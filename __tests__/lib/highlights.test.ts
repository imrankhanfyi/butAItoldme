import { describe, it, expect } from 'vitest';
import type { Highlight } from '@/lib/highlights';

describe('Highlight type', () => {
  it('represents a pane and text snippet', () => {
    const h: Highlight = { pane: 'left', text: 'completely valid' };
    expect(h.pane).toBe('left');
    expect(h.text).toBe('completely valid');
  });
});
