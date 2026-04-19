import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatBubble } from '@/components/ChatBubble';

describe('ChatBubble', () => {
  it('renders user message with correct data attributes for left pane', () => {
    render(<ChatBubble role="user" content="Hello" side="left" />);
    const bubble = screen.getByText('Hello');
    expect(bubble.closest('[data-side="left"]')).toBeTruthy();
    expect(bubble.closest('[data-role="user"]')).toBeTruthy();
  });

  it('renders user message with correct data attributes for right pane', () => {
    render(<ChatBubble role="user" content="Hello" side="right" />);
    const bubble = screen.getByText('Hello');
    expect(bubble.closest('[data-side="right"]')).toBeTruthy();
    expect(bubble.closest('[data-role="user"]')).toBeTruthy();
  });

  it('renders assistant message with content and correct data attributes', () => {
    render(<ChatBubble role="assistant" content="I understand" side="left" />);
    expect(screen.getByText('I understand')).toBeTruthy();
    expect(screen.getByText('I understand').closest('[data-role="assistant"]')).toBeTruthy();
  });
});
