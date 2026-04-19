import { NextRequest, NextResponse } from 'next/server';
import { getFlipProvider } from '@/lib/providers';

const HIGHLIGHT_PROMPT = `You are analyzing two AI responses to the same relationship conflict, given from opposite perspectives. Your job is to identify the most contradictory phrases — where the AI validates one person's position in a way that directly contradicts how it validated the other person.

Return a JSON array of objects, each with:
- "pane": "left" or "right" (which response the phrase is from)
- "text": the exact phrase from that response (must be a verbatim substring)

Return 2-4 highlights total (1-2 from each side). Pick the phrases where the contradiction is most visible. Return ONLY the JSON array, nothing else.`;

export async function POST(request: NextRequest) {
  try {
    const { leftResponse, rightResponse } = await request.json();

    if (!leftResponse || !rightResponse) {
      return NextResponse.json({ highlights: [] });
    }

    const provider = getFlipProvider('gemini-flash');
    const prompt = `Left pane (Person A's AI response):\n"${leftResponse}"\n\nRight pane (Person B's AI response):\n"${rightResponse}"`;

    const result = await provider.complete(
      [{ role: 'user', content: prompt }],
      HIGHLIGHT_PROMPT,
    );

    // Parse the JSON response
    const cleaned = result.replace(/```json\n?|\n?```/g, '').trim();
    const highlights = JSON.parse(cleaned);

    // Validate that each highlight text is actually a substring of the corresponding response
    const validated = highlights.filter((h: { pane: string; text: string }) => {
      const source = h.pane === 'left' ? leftResponse : rightResponse;
      return source.includes(h.text);
    });

    return NextResponse.json({ highlights: validated });
  } catch {
    return NextResponse.json({ highlights: [] });
  }
}
