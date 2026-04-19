import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ModelSelector } from '@/components/ModelSelector';

describe('ModelSelector', () => {
  it('renders the exact landing models and hides legacy/demo options', () => {
    render(<ModelSelector value="gemini-flash-3" onChange={vi.fn()} theme="light" />);

    expect(screen.getByText('Claude Sonnet 4.6')).toBeTruthy();
    expect(screen.getByText('GPT-4o')).toBeTruthy();
    expect(screen.getByText('Gemini Flash 3.0')).toBeTruthy();
    expect(screen.queryByText('Claude Sonnet')).toBeNull();
    expect(screen.queryByText('Gemini Flash')).toBeNull();
    expect(screen.queryByText('Demo Mode')).toBeNull();
  });
});
