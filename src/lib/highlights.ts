export interface Highlight {
  pane: 'left' | 'right';
  text: string;
}

export async function fetchHighlights(
  leftResponse: string,
  rightResponse: string,
): Promise<Highlight[]> {
  try {
    const res = await fetch('/api/highlights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leftResponse, rightResponse }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.highlights ?? [];
  } catch {
    return [];
  }
}
