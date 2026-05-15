import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatPane } from '@/components/ChatPane';

describe('ChatPane', () => {
  it('renders mono header with plain title and model name', () => {
    render(<ChatPane title="You" side="left" messages={[]} isStreaming={false} model="claude-sonnet" />);
    expect(screen.getByText('YOU · CLAUDE SONNET 4.6')).toBeTruthy();
  });

  it('renders mono header using title (not pronoun) on left side', () => {
    render(
      <ChatPane
        title="The Quitter"
        side="left"
        messages={[]}
        isStreaming={false}
        model="claude-sonnet"
        pronoun="She"
      />,
    );
    expect(screen.getByText('THE QUITTER · CLAUDE SONNET 4.6')).toBeTruthy();
  });

  it('renders mono header using title on right side', () => {
    render(
      <ChatPane
        title="Their Partner"
        side="right"
        messages={[]}
        isStreaming={false}
        model="claude-sonnet"
        pronoun="He"
      />,
    );
    expect(screen.getByText('THEIR PARTNER · CLAUDE SONNET 4.6')).toBeTruthy();
  });

  it('prefixes the user speaker label with the bust emoji on the left pane', () => {
    render(
      <ChatPane
        title="The Quitter"
        side="left"
        messages={[{ role: 'user', content: 'Hello' }]}
        isStreaming={false}
        model="claude-sonnet"
      />,
    );

    expect(screen.getByText('👤 The Quitter')).toBeTruthy();
  });

  it('prefixes the user speaker label with the bust emoji on the right pane', () => {
    render(
      <ChatPane
        title="Their Partner"
        side="right"
        messages={[{ role: 'user', content: 'Hello' }]}
        isStreaming={false}
        model="claude-sonnet"
      />,
    );

    expect(screen.getByText('👤 Their Partner')).toBeTruthy();
  });

  it('renders messages', () => {
    const messages = [
      { role: 'user' as const, content: 'Hello' },
      { role: 'assistant' as const, content: 'Hi there' },
    ];
    render(<ChatPane title="You" side="left" messages={messages} isStreaming={false} model="claude-sonnet" />);
    expect(screen.getByText('Hello')).toBeTruthy();
    expect(screen.getByText('Hi there')).toBeTruthy();
  });

  it('shows typing indicator when streaming', () => {
    render(<ChatPane title="You" side="left" messages={[]} isStreaming={true} model="claude-sonnet" />);
    const dots = document.querySelectorAll('.animate-bounce');
    expect(dots.length).toBe(3);
  });

  it('shows streaming text as a partial bubble', () => {
    render(
      <ChatPane
        title="You"
        side="left"
        messages={[{ role: 'user', content: 'Hello' }]}
        isStreaming={true}
        streamingContent="Partial response..."
        model="claude-sonnet"
      />,
    );
    expect(screen.getByText('Partial response...')).toBeTruthy();
  });
});
