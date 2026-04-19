import Anthropic from '@anthropic-ai/sdk';
import { Message } from '../types';
import { LLMProvider } from './types';
import { requireApiKey } from './validation';

export class AnthropicProvider implements LLMProvider {
  private client: Anthropic;
  private modelName: string;

  constructor(apiKey: string, modelName: string = 'claude-sonnet-4-6') {
    this.client = new Anthropic({ apiKey: requireApiKey(apiKey, 'ANTHROPIC_API_KEY') });
    this.modelName = modelName;
  }

  async *stream(messages: Message[], systemPrompt?: string): AsyncIterable<string> {
    const stream = await this.client.messages.create({
      model: this.modelName,
      max_tokens: 1024,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      ...(systemPrompt ? { system: systemPrompt } : {}),
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
  }

  async complete(messages: Message[], systemPrompt?: string): Promise<string> {
    const response = await this.client.messages.create({
      model: this.modelName,
      max_tokens: 1024,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      ...(systemPrompt ? { system: systemPrompt } : {}),
      stream: false,
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    return textBlock?.text ?? '';
  }
}
