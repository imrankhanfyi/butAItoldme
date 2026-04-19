import { Session, ModelId } from './types';

export class SessionStore {
  private sessions = new Map<string, Session>();
  private ttlMs: number;

  constructor(ttlMs: number = 30 * 60 * 1000) {
    this.ttlMs = ttlMs;
  }

  getOrCreate(id: string, model: ModelId): Session {
    const existing = this.sessions.get(id);
    if (existing) {
      existing.lastActive = Date.now();
      return existing;
    }

    const session: Session = {
      id,
      model,
      userHistory: [],
      mirrorHistory: [],
      lastActive: Date.now(),
    };
    this.sessions.set(id, session);
    return session;
  }

  delete(id: string): void {
    this.sessions.delete(id);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [id, session] of this.sessions) {
      if (now - session.lastActive > this.ttlMs) {
        this.sessions.delete(id);
      }
    }
  }
}

export const sessionStore = new SessionStore();
