import { Message } from '../types';

export interface LLMProvider {
  stream(messages: Message[], systemPrompt?: string): AsyncIterable<string>;
  complete(messages: Message[], systemPrompt?: string): Promise<string>;
}
