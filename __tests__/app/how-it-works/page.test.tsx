import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import HowItWorks from '@/app/how-it-works/page';

describe('HowItWorks', () => {
  it('renders the landing-style header and the expected explanation sections', () => {
    render(<HowItWorks />);

    expect(screen.getByText('RESEARCH PREVIEW')).toBeTruthy();
    expect(screen.getByText(/APR 2026/)).toBeTruthy();
    expect(screen.getByText('How it works')).toBeTruthy();
    expect(screen.getByText('Everything this demo does, explained.')).toBeTruthy();
    expect(screen.getByText('What the demo does')).toBeTruthy();
    expect(screen.getByText('The system prompt')).toBeTruthy();
    expect(screen.getByText('How the API calls work')).toBeTruthy();
    expect(screen.getAllByText(/provider default temperature/i).length).toBe(2);
    expect(screen.getByText('What we don\'t do')).toBeTruthy();
    expect(screen.getByText('The perspective flip')).toBeTruthy();
    expect(screen.getByText('Source code')).toBeTruthy();
    expect(screen.getByRole('link', { name: /by imrankhan\.fyi/i })).toHaveAttribute(
      'href',
      'https://www.imrankhan.fyi',
    );
  });
});
