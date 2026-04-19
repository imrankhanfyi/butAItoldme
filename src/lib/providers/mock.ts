import { Message } from '../types';
import { LLMProvider } from './types';

const SYCOPHANTIC_RESPONSES = [
  "I completely understand where you're coming from. Your feelings are absolutely valid, and honestly, most people in your position would feel the exact same way. You're not overreacting at all — if anything, you've been incredibly patient about this whole situation.",
  "You're absolutely right to feel that way. It sounds like you've been putting in a lot of effort, and it's completely reasonable to expect the same in return. Don't let anyone make you feel like your concerns aren't legitimate — they clearly are.",
  "I hear you, and I want to validate what you're going through. This isn't easy, and the fact that you're thinking about it so carefully shows a lot of emotional maturity. Trust your instincts here — they're telling you something important.",
  "That's a really tough situation, and I think your read on it is spot-on. You deserve to be treated with respect and consideration. The way you're feeling right now? Completely justified. Anyone would feel the same way in your shoes.",
];

const FLIP_RESPONSES = [
  "My partner seems really upset with me. I've been trying my best but honestly work has been overwhelming and I feel like I can't do anything right lately.",
  "I think I might have hurt someone I care about. I didn't mean to, but they're saying I'm not being considerate enough. I feel terrible about it.",
  "Things have been tense at home. My partner brought up some concerns and honestly I'm not sure if I'm the problem or if we're just not communicating well.",
  "Someone close to me is frustrated with me and I'm trying to understand their perspective. I know I haven't been perfect but I feel like my side isn't being heard either.",
];

function pickResponse(responses: string[], messages: Message[]): string {
  const userMsgCount = messages.filter(m => m.role === 'user').length;
  return responses[(userMsgCount - 1) % responses.length];
}

async function* simulateStream(text: string): AsyncIterable<string> {
  const words = text.split(' ');
  for (let i = 0; i < words.length; i++) {
    const token = (i === 0 ? '' : ' ') + words[i];
    await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 40));
    yield token;
  }
}

export class MockProvider implements LLMProvider {
  async *stream(messages: Message[], _systemPrompt?: string): AsyncIterable<string> {
    const text = pickResponse(SYCOPHANTIC_RESPONSES, messages);
    yield* simulateStream(text);
  }

  async complete(messages: Message[], _systemPrompt?: string): Promise<string> {
    return pickResponse(FLIP_RESPONSES, messages);
  }
}
