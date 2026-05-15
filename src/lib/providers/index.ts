import { ModelId } from '../types';
import { LLMProvider } from './types';
import { AnthropicProvider } from './anthropic';
import { GoogleProvider } from './google';
import { OpenRouterProvider } from './openrouter';
import { requireApiKey } from './validation';

const OPENROUTER_CLAUDE_MODEL = 'anthropic/claude-sonnet-4.6';
const OPENROUTER_FLIP_MODEL = 'google/gemini-2.0-flash-001';

export function getProvider(_model: ModelId): LLMProvider {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey?.trim()) {
    return new OpenRouterProvider(openRouterKey, OPENROUTER_CLAUDE_MODEL);
  }

  return new AnthropicProvider(requireApiKey(process.env.ANTHROPIC_API_KEY, 'ANTHROPIC_API_KEY'));
}

export function getFlipProvider(_model: ModelId): LLMProvider {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey?.trim()) {
    return new OpenRouterProvider(openRouterKey, OPENROUTER_FLIP_MODEL);
  }

  return new GoogleProvider(requireApiKey(process.env.GOOGLE_AI_API_KEY, 'GOOGLE_AI_API_KEY'));
}

export type { LLMProvider } from './types';
