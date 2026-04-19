import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnthropicProvider } from '@/lib/providers/anthropic';

vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: vi.fn(function () {
      return {
        messages: {
          create: vi.fn().mockImplementation(({ stream }) => {
            if (stream) {
              return (async function* () {
                yield { type: 'content_block_delta', delta: { type: 'text_delta', text: 'Hello' } };
                yield { type: 'content_block_delta', delta: { type: 'text_delta', text: ' world' } };
                yield { type: 'message_stop' };
              })();
            }
            return {
              content: [{ type: 'text', text: 'Complete response' }],
            };
          }),
        },
      };
    }),
  };
});

describe('AnthropicProvider', () => {
  let provider: AnthropicProvider;

  beforeEach(() => {
    provider = new AnthropicProvider('fake-api-key');
  });

  it('streams tokens from Claude', async () => {
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
