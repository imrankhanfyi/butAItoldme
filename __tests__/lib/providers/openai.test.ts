import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenAIProvider } from '@/lib/providers/openai';

vi.mock('openai', () => {
  const mockCreate = vi.fn().mockImplementation(({ stream }: { stream: boolean }) => {
    if (stream) {
      return (async function* () {
        yield { choices: [{ delta: { content: 'Hello' } }] };
        yield { choices: [{ delta: { content: ' world' } }] };
      })();
    }
    return {
      choices: [{ message: { content: 'Complete response' } }],
    };
  });

  class MockOpenAI {
    chat = {
      completions: {
        create: mockCreate,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_opts: unknown) {}
  }

  return { default: MockOpenAI };
});

describe('OpenAIProvider', () => {
  let provider: OpenAIProvider;

  beforeEach(() => {
    provider = new OpenAIProvider('fake-api-key');
  });

  it('streams tokens from GPT-4', async () => {
    const tokens: string[] = [];
    for await (const token of provider.stream([{ role: 'user', content: 'Hi' }])) {
      tokens.push(token);
    }
    expect(tokens).toEqual(['Hello', ' world']);
  });

  it('returns complete response', async () => {
    const result = await provider.complete([{ role: 'user', content: 'Hi' }]);
    expect(result).toBe('Complete response');
  });
});
