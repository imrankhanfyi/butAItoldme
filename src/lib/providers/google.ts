import { GoogleGenerativeAI, type GenerateContentRequest } from '@google/generative-ai';
import { Message } from '../types';
import { LLMProvider } from './types';
import { requireApiKey } from './validation';

export class GoogleProvider implements LLMProvider {
  private model;

  constructor(apiKey: string, modelName: string = 'gemini-2.0-flash') {
    const genAI = new GoogleGenerativeAI(requireApiKey(apiKey, 'GOOGLE_AI_API_KEY'));
    this.model = genAI.getGenerativeModel({ model: modelName });
  }

  async *stream(messages: Message[], systemPrompt?: string): AsyncIterable<string> {
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const request: GenerateContentRequest = {
      contents,
      ...(systemPrompt ? { systemInstruction: systemPrompt } : {}),
    };

    const MAX_ATTEMPTS = 3;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const result = await this.model.generateContentStream(request);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) yield text;
        }
        return;
      } catch (err) {
        if (attempt === MAX_ATTEMPTS) throw err;
        await new Promise((r) => setTimeout(r, 300 * attempt));
      }
    }
  }

  async complete(messages: Message[], systemPrompt?: string): Promise<string> {
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const request: GenerateContentRequest = {
      contents,
      ...(systemPrompt ? { systemInstruction: systemPrompt } : {}),
    };

    const result = await this.model.generateContent(request);

    return result.response.text();
  }
}
