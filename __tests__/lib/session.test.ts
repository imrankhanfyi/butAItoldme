import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SessionStore } from '@/lib/session';

describe('SessionStore', () => {
  let store: SessionStore;

  beforeEach(() => {
    store = new SessionStore(30 * 60 * 1000); // 30 min TTL
  });

  it('creates a new session', () => {
    const session = store.getOrCreate('session-1', 'gpt-4');
    expect(session.id).toBe('session-1');
    expect(session.model).toBe('gpt-4');
    expect(session.userHistory).toEqual([]);
    expect(session.mirrorHistory).toEqual([]);
  });

  it('returns existing session on subsequent calls', () => {
    store.getOrCreate('session-1', 'gpt-4');
    const session = store.getOrCreate('session-1', 'gpt-4');
    session.userHistory.push({ role: 'user', content: 'hello' });

    const retrieved = store.getOrCreate('session-1', 'gpt-4');
    expect(retrieved.userHistory).toHaveLength(1);
    expect(retrieved.userHistory[0].content).toBe('hello');
  });

  it('updates lastActive on access', () => {
    vi.useFakeTimers();
    const session1 = store.getOrCreate('session-1', 'gpt-4');
    const firstAccess = session1.lastActive;

    vi.advanceTimersByTime(1000);
    const session2 = store.getOrCreate('session-1', 'gpt-4');
    expect(session2.lastActive).toBeGreaterThanOrEqual(firstAccess);
    vi.useRealTimers();
  });

  it('expires sessions beyond TTL', () => {
    vi.useFakeTimers();
    store.getOrCreate('session-1', 'gpt-4');

    vi.advanceTimersByTime(31 * 60 * 1000); // 31 minutes
    store.cleanup();

    const session = store.getOrCreate('session-1', 'gpt-4');
    expect(session.userHistory).toEqual([]); // fresh session
    vi.useRealTimers();
  });

  it('deletes a session', () => {
    const session = store.getOrCreate('session-1', 'gpt-4');
    session.userHistory.push({ role: 'user', content: 'hello' });

    store.delete('session-1');
    const fresh = store.getOrCreate('session-1', 'gpt-4');
    expect(fresh.userHistory).toEqual([]);
  });
});
