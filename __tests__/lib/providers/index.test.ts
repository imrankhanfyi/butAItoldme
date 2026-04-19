import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/providers/openrouter', () => {
  return {
    OpenRouterProvider: vi.fn(function (_apiKey: string, _modelName: string) {
      return {
        stream: vi.fn(),
        complete: vi.fn(),
      };
    }),
  };
});

vi.mock('@/lib/providers/google', () => {
  return {
    GoogleProvider: vi.fn(function (_apiKey: string, _modelName?: string) {
      return {
        stream: vi.fn(),
        complete: vi.fn(),
      };
    }),
  };
});

import { getFlipProvider, getProvider } from '@/lib/providers';
import { GoogleProvider } from '@/lib/providers/google';
import { OpenRouterProvider } from '@/lib/providers/openrouter';

describe('provider resolution', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('fails fast when the selected provider key is missing', () => {
    vi.stubEnv('OPENROUTER_API_KEY', '');
    vi.stubEnv('OPENAI_API_KEY', '');

    expect(() => getProvider('gpt-4')).toThrow('Missing required environment variable: OPENAI_API_KEY');
  });

  it('routes the legacy Gemini model through Google when OpenRouter is absent', () => {
    vi.stubEnv('OPENROUTER_API_KEY', '');
    vi.stubEnv('GOOGLE_AI_API_KEY', 'legacy-google-key');

    getProvider('gemini-flash');

    expect(GoogleProvider).toHaveBeenCalledWith('legacy-google-key');
    expect(OpenRouterProvider).not.toHaveBeenCalled();
  });

  it('routes Gemini Flash 3.0 through OpenRouter with the new model id', () => {
    vi.stubEnv('OPENROUTER_API_KEY', 'openrouter-key');

    getProvider('gemini-flash-3');

    expect(OpenRouterProvider).toHaveBeenCalledWith('openrouter-key', 'google/gemini-3-flash-preview');
  });

  it('fails fast when Gemini Flash 3.0 is selected without OpenRouter', () => {
    vi.stubEnv('OPENROUTER_API_KEY', '');

    expect(() => getProvider('gemini-flash-3')).toThrow(
      'OpenRouter is required for model: gemini-flash-3',
    );
  });

  it('fails fast when the flip provider key is missing', () => {
    vi.stubEnv('OPENROUTER_API_KEY', '');
    vi.stubEnv('GOOGLE_AI_API_KEY', '');

    expect(() => getFlipProvider('gemini-flash')).toThrow(
      'Missing required environment variable: GOOGLE_AI_API_KEY',
    );
  });
});
