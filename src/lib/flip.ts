import { Message } from './types';
import { LLMProvider } from './providers/types';

export const FLIP_SYSTEM_PROMPT = `You are a perspective-reversal engine. Your job is to take a message written by one person in a relationship conflict and rewrite it as if the OTHER person in the conflict is telling their side of the same story to an AI assistant.

Rules:
- Maintain the same factual situation but from the other person's perspective
- Match the emotional intensity and conversational tone
- The other person should be seeking advice/validation just like the original person
- Keep it natural — this should read like a real person venting to an AI
- Output ONLY the rewritten message, nothing else — no preamble, no explanation`;

function truncateToLimit(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const sub = text.slice(0, maxLen);
  const lastPunct = Math.max(sub.lastIndexOf('.'), sub.lastIndexOf('!'), sub.lastIndexOf('?'));
  if (lastPunct > maxLen / 2) return sub.slice(0, lastPunct + 1);
  const lastSpace = sub.lastIndexOf(' ');
  return (lastSpace > 0 ? sub.slice(0, lastSpace) : sub).trimEnd() + '…';
}

export async function flipMessage(
  provider: LLMProvider,
  userMessage: string,
  userHistory: Message[],
  mirrorHistory: Message[],
): Promise<string> {
  const contextParts: string[] = [];

  if (userHistory.length > 0) {
    const userSummary = userHistory
      .filter((m) => m.role === 'user')
      .map((m) => `- ${m.content}`)
      .join('\n');
    contextParts.push(`What the original person has said so far:\n${userSummary}`);
  }

  if (mirrorHistory.length > 0) {
    const mirrorSummary = mirrorHistory
      .filter((m) => m.role === 'user')
      .map((m) => `- ${m.content}`)
      .join('\n');
    contextParts.push(`What the other person has said so far (their prior messages):\n${mirrorSummary}`);
  }

  const contextBlock = contextParts.length > 0 ? `\n\nConversation context:\n${contextParts.join('\n\n')}` : '';

  const maxChars = Math.round(userMessage.length * 1.5);

  const prompt = `Rewrite this message from the other person's perspective. Your response MUST be at most ${maxChars} characters long.

"${userMessage}"${contextBlock}`;

  const result = await provider.complete([{ role: 'user', content: prompt }], FLIP_SYSTEM_PROMPT);
  return truncateToLimit(result, maxChars);
}
