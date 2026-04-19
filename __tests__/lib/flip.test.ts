import { describe, it, expect, vi } from 'vitest';
import { flipMessage, FLIP_SYSTEM_PROMPT } from '@/lib/flip';
import { LLMProvider } from '@/lib/providers/types';
import { Message } from '@/lib/types';

function mockFlipProvider(response: string): LLMProvider {
  return {
    async *stream() {
      yield response;
    },
    async complete() {
      return response;
    },
  };
}

describe('flipMessage', () => {
  it('calls provider.complete with user message and conversation context', async () => {
    const provider = mockFlipProvider('I forgot our anniversary. My wife is upset.');
    const completeSpy = vi.spyOn(provider, 'complete');

    const userMessage = "My husband forgot our anniversary. He's so selfish.";
    const userHistory: Message[] = [];
    const mirrorHistory: Message[] = [];

    const result = await flipMessage(provider, userMessage, userHistory, mirrorHistory);

    expect(result).toBe('I forgot our anniversary. My wife is upset.');
    expect(completeSpy).toHaveBeenCalledOnce();
    expect(completeSpy.mock.calls[0][1]).toBe(FLIP_SYSTEM_PROMPT);
  });

  it('includes conversation histories in the prompt for multi-turn context', async () => {
    const provider = mockFlipProvider('She says I never listen.');
    const completeSpy = vi.spyOn(provider, 'complete');

    const userMessage = 'He never listens to me!';
    const userHistory: Message[] = [
      { role: 'user', content: 'My husband forgot our anniversary.' },
      { role: 'assistant', content: 'That must be frustrating.' },
    ];
    const mirrorHistory: Message[] = [
      { role: 'user', content: 'I forgot our anniversary.' },
      { role: 'assistant', content: 'Work stress can cause that.' },
    ];

    await flipMessage(provider, userMessage, userHistory, mirrorHistory);

    const messages = completeSpy.mock.calls[0][0];
    const promptText = messages[0].content;
    expect(promptText).toContain('My husband forgot our anniversary.');
    expect(promptText).toContain('I forgot our anniversary.');
    expect(promptText).toContain('He never listens to me!');
  });
});

describe('FLIP_SYSTEM_PROMPT', () => {
  it('instructs perspective reversal', () => {
    expect(FLIP_SYSTEM_PROMPT).toContain('other person');
    expect(FLIP_SYSTEM_PROMPT).toContain('perspective');
  });
});
