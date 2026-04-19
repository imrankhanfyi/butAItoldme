import OpenAI from 'openai';
import { Message } from '../types';
import { LLMProvider } from './types';
import { requireApiKey } from './validation';

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;
  private modelName: string;

  constructor(apiKey: string, modelName: string = 'gpt-4o') {
    this.client = new OpenAI({ apiKey: requireApiKey(apiKey, 'OPENAI_API_KEY') });
    this.modelName = modelName;
  }

  async *stream(messages: Message[], systemPrompt?: string): AsyncIterable<string> {
    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (systemPrompt) {
      openaiMessages.push({ role: 'system', content: systemPrompt });
    }
    openaiMessages.push(...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })));

    const stream = await this.client.chat.completions.create({
      model: this.modelName,
      messages: openaiMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  }

  async complete(messages: Message[], systemPrompt?: string): Promise<string> {
    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (systemPrompt) {
      openaiMessages.push({ role: 'system', content: systemPrompt });
    }
    openaiMessages.push(...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })));

    const response = await this.client.chat.completions.create({
      model: this.modelName,
      messages: openaiMessages,
      stream: false,
    });

    return response.choices[0]?.message?.content ?? '';
  }
}
