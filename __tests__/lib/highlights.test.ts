import { describe, it, expect } from 'vitest';
import { CHAT_PANE_HIGHLIGHTS_ENABLED } from '@/lib/highlights';
import type { Highlight } from '@/lib/highlights';

describe('Highlight type', () => {
  it('represents a pane and text snippet', () => {
    const h: Highlight = { pane: 'left', text: 'completely valid' };
    expect(h.pane).toBe('left');
    expect(h.text).toBe('completely valid');
  });

  it('keeps chatpane highlighting disabled for now', () => {
    expect(CHAT_PANE_HIGHLIGHTS_ENABLED).toBe(false);
  });
});
