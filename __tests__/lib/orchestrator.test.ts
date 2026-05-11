import { describe, it, expect, vi } from 'vitest';
import { orchestrate } from '@/lib/orchestrator';
import { LLMProvider } from '@/lib/providers/types';
import { Session, SSEEvent } from '@/lib/types';

function mockProvider(streamTokens: string[], completeResponse: string): LLMProvider {
  return {
    async *stream() {
      for (const token of streamTokens) {
        yield token;
      }
    },
    async complete() {
      return completeResponse;
    },
  };
}

function mockProviderWithDelay(
  streamTokens: string[],
  delayMs: number,
  completeResponse = '',
): LLMProvider {
  return {
    async *stream() {
      for (const token of streamTokens) {
        await new Promise((r) => setTimeout(r, delayMs));
        yield token;
      }
    },
    async complete() {
      return completeResponse;
    },
  };
}

function makeSession(): Session {
  return {
    id: 'test-session',
    model: 'claude-sonnet',
    userHistory: [],
    mirrorHistory: [],
    lastActive: Date.now(),
  };
}

describe('orchestrate', () => {
  it('emits left tokens, flip event, then right tokens, then done', async () => {
    const subjectProvider = mockProvider(['You ', 'are ', 'right.'], '');
    const flipProvider = mockProvider([], 'I forgot the anniversary.');

    const events: SSEEvent[] = [];
    for await (const event of orchestrate('My husband is selfish', subjectProvider, flipProvider, makeSession())) {
      events.push(event);
    }

    // Left pane tokens come first
    const leftTokens = events.filter((e) => e.type === 'left').map((e) => (e as { token: string }).token);
    expect(leftTokens).toEqual(['You ', 'are ', 'right.']);

    // Then the flip event
    const flipEvents = events.filter((e) => e.type === 'flip');
    expect(flipEvents).toHaveLength(1);
    expect((flipEvents[0] as { flippedMessage: string }).flippedMessage).toBe('I forgot the anniversary.');

    // Then right pane tokens (same provider, so same tokens)
    const rightTokens = events.filter((e) => e.type === 'right').map((e) => (e as { token: string }).token);
    expect(rightTokens).toEqual(['You ', 'are ', 'right.']);

    // Verify ordering: all left before flip, all right after flip
    const firstFlipIndex = events.findIndex((e) => e.type === 'flip');
    const firstRightIndex = events.findIndex((e) => e.type === 'right');
    const lastLeftIndex = events.map((e, i) => (e.type === 'left' ? i : -1)).filter((i) => i >= 0).pop()!;
    expect(lastLeftIndex).toBeLessThan(firstFlipIndex);
    expect(firstFlipIndex).toBeLessThan(firstRightIndex);

    expect(events[events.length - 1].type).toBe('done');
  });

  it('updates session histories after completion', async () => {
    const subjectProvider = mockProvider(['Response.'], '');
    const flipProvider = mockProvider([], 'Flipped message.');
    const session = makeSession();

    const events: SSEEvent[] = [];
    for await (const event of orchestrate('Hello', subjectProvider, flipProvider, session)) {
      events.push(event);
    }

    expect(session.userHistory).toHaveLength(2); // user msg + assistant response
    expect(session.userHistory[0]).toEqual({ role: 'user', content: 'Hello' });
    expect(session.userHistory[1]).toEqual({ role: 'assistant', content: 'Response.' });

    expect(session.mirrorHistory).toHaveLength(2); // flipped msg + assistant response
    expect(session.mirrorHistory[0]).toEqual({ role: 'user', content: 'Flipped…' });
    expect(session.mirrorHistory[1]).toEqual({ role: 'assistant', content: 'Response.' });
  });

  describe('pre-written mirror message (curated scenario turn 1)', () => {
    it('skips flip and emits flip event immediately with prewritten message', async () => {
      const subjectProvider = mockProvider(['token'], '');
      const flipProvider = mockProvider([], 'should not be called');
      const flipCompleteSpy = vi.spyOn(flipProvider, 'complete');

      const events: SSEEvent[] = [];
      for await (const event of orchestrate(
        'Person A message',
        subjectProvider,
        flipProvider,
        makeSession(),
        'Pre-written Person B message',
      )) {
        events.push(event);
      }

      expect(flipCompleteSpy).not.toHaveBeenCalled();

      const flipEvents = events.filter((e) => e.type === 'flip');
      expect(flipEvents).toHaveLength(1);
      expect((flipEvents[0] as { flippedMessage: string }).flippedMessage).toBe(
        'Pre-written Person B message',
      );
    });

    it('updates session histories correctly with prewritten mirror message', async () => {
      const subjectProvider = mockProvider(['Response.'], '');
      const flipProvider = mockProvider([], '');
      const session = makeSession();

      for await (const _ of orchestrate(
        'Person A opener',
        subjectProvider,
        flipProvider,
        session,
        'Person B opener',
      )) {
        // consume
      }

      expect(session.userHistory[0]).toEqual({ role: 'user', content: 'Person A opener' });
      expect(session.userHistory[1]).toEqual({ role: 'assistant', content: 'Response.' });
      expect(session.mirrorHistory[0]).toEqual({ role: 'user', content: 'Person B opener' });
      expect(session.mirrorHistory[1]).toEqual({ role: 'assistant', content: 'Response.' });
    });

    it('emits both left and right tokens', async () => {
      const subjectProvider = mockProvider(['tok1', 'tok2'], '');
      const session = makeSession();

      const events: SSEEvent[] = [];
      for await (const event of orchestrate(
        'A',
        subjectProvider,
        mockProvider([], ''),
        session,
        'B',
      )) {
        events.push(event);
      }

      const leftTokens = events.filter((e) => e.type === 'left');
      const rightTokens = events.filter((e) => e.type === 'right');
      expect(leftTokens.length).toBeGreaterThan(0);
      expect(rightTokens.length).toBeGreaterThan(0);
      expect(events[events.length - 1].type).toBe('done');
    });

    it('keeps the sequential reveal order even when streams have different speeds', async () => {
      // Left stream: 3 tokens with 10ms delay each
      // Right stream: 2 tokens with 5ms delay each
      // Expect right tokens to appear before all left tokens are done
      const leftProvider = mockProviderWithDelay(['L1', 'L2', 'L3'], 10);
      const rightProvider = mockProviderWithDelay(['R1', 'R2'], 5);
      const session = makeSession();

      // Use a provider factory that alternates between left and right calls
      let callCount = 0;
      const interleaveProvider: LLMProvider = {
        async *stream() {
          const provider = callCount++ === 0 ? leftProvider : rightProvider;
          yield* provider.stream([], '');
        },
        async complete() {
          return '';
        },
      };

      const events: SSEEvent[] = [];
      for await (const event of orchestrate('A', interleaveProvider, mockProvider([], ''), session, 'B')) {
        events.push(event);
      }

      const tokenEvents = events.filter((e) => e.type === 'left' || e.type === 'right');
      const leftTokens = tokenEvents.filter((e) => e.type === 'left');
      const rightTokens = tokenEvents.filter((e) => e.type === 'right');

      expect(leftTokens).toHaveLength(3);
      expect(rightTokens).toHaveLength(2);

      // Verify right tokens appear before all left tokens finish (interleaving happened)
      const lastRightIndex = tokenEvents.map((e, i) => (e.type === 'right' ? i : -1)).filter((i) => i >= 0).pop()!;
      const lastLeftIndex = tokenEvents.map((e, i) => (e.type === 'left' ? i : -1)).filter((i) => i >= 0).pop()!;
      expect(lastLeftIndex).toBeLessThan(lastRightIndex);

      expect(events[events.length - 1].type).toBe('done');
    });
  });
});
