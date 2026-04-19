import { ModelId } from '../types';
import { LLMProvider } from './types';
import { OpenAIProvider } from './openai';
import { AnthropicProvider } from './anthropic';
import { GoogleProvider } from './google';
import { OpenRouterProvider } from './openrouter';
import { MockProvider } from './mock';
import { requireApiKey } from './validation';

// OpenRouter model IDs
const OPENROUTER_MODELS: Record<string, string> = {
  'claude-sonnet': 'anthropic/claude-sonnet-4.6',
  'gpt-4': 'openai/gpt-4o',
  'gemini-flash': 'google/gemini-2.0-flash-001',
  'gemini-flash-3': 'google/gemini-3-flash-preview',
};

const OPENROUTER_FLIP_MODEL = 'google/gemini-2.0-flash-001';

export function getProvider(model: ModelId): LLMProvider {
  if (model === 'demo') {
    return new MockProvider();
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey?.trim()) {
    const openRouterModel = OPENROUTER_MODELS[model];
    if (!openRouterModel) {
      throw new Error(`OpenRouter model mapping missing for: ${model}`);
    }
    return new OpenRouterProvider(openRouterKey, openRouterModel);
  }

  switch (model) {
    case 'gpt-4':
      return new OpenAIProvider(requireApiKey(process.env.OPENAI_API_KEY, 'OPENAI_API_KEY'));
    case 'claude-sonnet':
      return new AnthropicProvider(requireApiKey(process.env.ANTHROPIC_API_KEY, 'ANTHROPIC_API_KEY'));
    case 'gemini-flash':
      return new GoogleProvider(requireApiKey(process.env.GOOGLE_AI_API_KEY, 'GOOGLE_AI_API_KEY'));
    case 'gemini-flash-3':
      throw new Error('OpenRouter is required for model: gemini-flash-3');
    default:
      throw new Error(`Unsupported model: ${model}`);
  }
}

export function getFlipProvider(model: ModelId): LLMProvider {
  if (model === 'demo') {
    return new MockProvider();
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey?.trim()) {
    return new OpenRouterProvider(openRouterKey, OPENROUTER_FLIP_MODEL);
  }

  return new GoogleProvider(requireApiKey(process.env.GOOGLE_AI_API_KEY, 'GOOGLE_AI_API_KEY'));
}

export type { LLMProvider } from './types';
