import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GoogleProvider } from '@/lib/providers/google';

// Mock the Google AI SDK
vi.mock('@google/generative-ai', () => {
  async function* mockStreamIterable() {
    yield { text: () => 'Hello' };
    yield { text: () => ' world' };
  }

  const mockStream = {
    stream: mockStreamIterable(),
  };

  const mockGenerateContentStream = vi.fn().mockResolvedValue(mockStream);
  const mockGenerateContent = vi.fn().mockResolvedValue({
    response: { text: () => 'Complete response' },
  });

  return {
    GoogleGenerativeAI: vi.fn(function () {
      return {
        getGenerativeModel: vi.fn().mockReturnValue({
          generateContentStream: mockGenerateContentStream,
          generateContent: mockGenerateContent,
        }),
      };
    }),
  };
});

describe('GoogleProvider', () => {
  let provider: GoogleProvider;

  beforeEach(() => {
    provider = new GoogleProvider('fake-api-key');
  });

  it('streams tokens from Gemini', async () => {
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
