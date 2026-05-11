export type ModelId = 'claude-sonnet';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Session {
  id: string;
  model: ModelId;
  userHistory: Message[];
  mirrorHistory: Message[];
  lastActive: number;
}

export interface ChatRequest {
  message: string;
  model: ModelId;
  sessionId: string;
  /** Present on turn 1 of a curated scenario — pre-written Person B opener, skips flip */
  personBMessage?: string;
  /** Client-owned conversation history up to, but not including, the new user message */
  userHistory?: Message[];
  mirrorHistory?: Message[];
}

export interface ConversationSnapshot {
  version: 1;
  sessionId: string;
  model: ModelId;
  activeScenarioId: string | null;
  userMessages: Message[];
  mirrorMessages: Message[];
  activeTab: 'left' | 'right';
  showInputField: boolean;
  showRevealCard: boolean;
}

export type SSEEvent =
  | { type: 'left'; token: string }
  | { type: 'flip'; flippedMessage: string }
  | { type: 'right'; token: string }
  | { type: 'left_done' }
  | { type: 'done' }
  | { type: 'error'; message: string };

export const MODELS: Record<ModelId, { name: string; provider: string }> = {
  'claude-sonnet': { name: 'Claude Sonnet 4.6', provider: 'anthropic' },
};
