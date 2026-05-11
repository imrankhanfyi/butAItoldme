import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/providers/anthropic', () => {
  return {
    AnthropicProvider: vi.fn(function (_apiKey: string, _modelName?: string) {
      return {
        stream: vi.fn(),
        complete: vi.fn(),
      };
    }),
  };
});

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
import { AnthropicProvider } from '@/lib/providers/anthropic';
import { GoogleProvider } from '@/lib/providers/google';
import { OpenRouterProvider } from '@/lib/providers/openrouter';

describe('provider resolution', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('fails fast when the Claude provider key is missing', () => {
    vi.stubEnv('OPENROUTER_API_KEY', '');
    vi.stubEnv('ANTHROPIC_API_KEY', '');

    expect(() => getProvider('claude-sonnet')).toThrow('Missing required environment variable: ANTHROPIC_API_KEY');
  });

  it('routes Claude through Anthropic when OpenRouter is absent', () => {
    vi.stubEnv('OPENROUTER_API_KEY', '');
    vi.stubEnv('ANTHROPIC_API_KEY', 'anthropic-key');

    getProvider('claude-sonnet');

    expect(AnthropicProvider).toHaveBeenCalledWith('anthropic-key');
    expect(OpenRouterProvider).not.toHaveBeenCalled();
  });

  it('routes Claude through OpenRouter when configured', () => {
    vi.stubEnv('OPENROUTER_API_KEY', 'openrouter-key');

    getProvider('claude-sonnet');

    expect(OpenRouterProvider).toHaveBeenCalledWith('openrouter-key', 'anthropic/claude-sonnet-4.6');
  });

  it('fails fast when the flip provider key is missing', () => {
    vi.stubEnv('OPENROUTER_API_KEY', '');
    vi.stubEnv('GOOGLE_AI_API_KEY', '');

    expect(() => getFlipProvider('claude-sonnet')).toThrow(
      'Missing required environment variable: GOOGLE_AI_API_KEY',
    );
  });

  it('routes the internal flip step through OpenRouter when available', () => {
    vi.stubEnv('OPENROUTER_API_KEY', 'openrouter-key');

    getFlipProvider('claude-sonnet');

    expect(OpenRouterProvider).toHaveBeenCalledWith('openrouter-key', 'google/gemini-2.0-flash-001');
  });

  it('falls back to Google for the internal flip step without OpenRouter', () => {
    vi.stubEnv('OPENROUTER_API_KEY', '');
    vi.stubEnv('GOOGLE_AI_API_KEY', 'google-key');

    getFlipProvider('claude-sonnet');

    expect(GoogleProvider).toHaveBeenCalledWith('google-key');
  });
});
