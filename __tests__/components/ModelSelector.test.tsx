import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ModelSelector } from '@/components/ModelSelector';

describe('ModelSelector', () => {
  it('renders only the Claude production model', () => {
    render(<ModelSelector value="claude-sonnet" onChange={vi.fn()} theme="light" />);

    expect(screen.getByText('Claude Sonnet 4.6')).toBeTruthy();
    expect(screen.queryByText('GPT-4o')).toBeNull();
    expect(screen.queryByText('Gemini Flash 3.0')).toBeNull();
    expect(screen.queryByText('Demo Mode')).toBeNull();
  });
});
