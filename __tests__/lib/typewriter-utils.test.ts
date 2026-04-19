import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { typewriterRevealSentences, typewriterRevealChunks } from '@/lib/typewriter-utils';

describe('typewriterRevealSentences', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('calls onDone immediately for empty array', () => {
    const onDone = vi.fn();
    typewriterRevealSentences([], () => {}, () => {}, onDone);
    expect(onDone).toHaveBeenCalledOnce();
  });

  it('types a single character on first tick', () => {
    const updates: string[] = [];
    typewriterRevealSentences(['Hi.'], (text) => updates.push(text), () => {}, undefined, 30, 500);
    vi.advanceTimersByTime(34);
    expect(updates[0]).toBe('H');
  });

  it('updates display incrementally for a single sentence', () => {
    const updates: string[] = [];
    typewriterRevealSentences(['Hi.'], (text) => updates.push(text), () => {}, undefined, 30, 500);
    vi.advanceTimersByTime(34 * 3);
    expect(updates).toContain('H');
    expect(updates).toContain('Hi');
    expect(updates).toContain('Hi.');
  });

  it('commits sentence after typing + pause, then calls onDone', () => {
    const commits: string[] = [];
    const onDone = vi.fn();
    typewriterRevealSentences(['Hi.'], () => {}, (s) => commits.push(s), onDone, 30, 500);
    // 3 chars at ~33ms each = ~99ms typing, then 500ms pause
    vi.advanceTimersByTime(700);
    expect(commits).toEqual(['Hi.']);
    expect(onDone).toHaveBeenCalledOnce();
  });

  it('clears display after committing a sentence', () => {
    const updates: string[] = [];
    typewriterRevealSentences(['Hi.'], (text) => updates.push(text), () => {}, undefined, 30, 500);
    vi.advanceTimersByTime(700);
    // last update after commit should be empty string
    expect(updates[updates.length - 1]).toBe('');
  });

  it('types multiple sentences in sequence', () => {
    const commits: string[] = [];
    typewriterRevealSentences(['Hi.', 'Bye.'], () => {}, (s) => commits.push(s), undefined, 30, 500);
    // first: ~99ms typing + 500ms pause = ~600ms
    vi.advanceTimersByTime(700);
    expect(commits).toEqual(['Hi.']);
    // second: ~132ms typing + 500ms pause = ~632ms more
    vi.advanceTimersByTime(800);
    expect(commits).toEqual(['Hi.', 'Bye.']);
  });

  it('calls onDone once after all sentences finish', () => {
    const onDone = vi.fn();
    typewriterRevealSentences(['Hi.', 'Bye.'], () => {}, () => {}, onDone, 30, 500);
    vi.advanceTimersByTime(2000);
    expect(onDone).toHaveBeenCalledOnce();
  });

  it('cancel stops all future updates and commits', () => {
    const updates: string[] = [];
    const commits: string[] = [];
    const cancel = typewriterRevealSentences(
      ['Hello world.'],
      (text) => updates.push(text),
      (s) => commits.push(s),
      undefined,
      30,
      500,
    );
    vi.advanceTimersByTime(100);
    const countBefore = updates.length;
    cancel();
    vi.advanceTimersByTime(5000);
    expect(updates.length).toBe(countBefore);
    expect(commits).toEqual([]);
  });
});

describe('typewriterRevealChunks', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('calls onDone immediately for empty array', () => {
    const onDone = vi.fn();
    typewriterRevealChunks([], () => {}, () => {}, onDone);
    expect(onDone).toHaveBeenCalledOnce();
  });

  it('types a single chunk character by character', () => {
    const updates: string[] = [];
    const commits: string[] = [];
    typewriterRevealChunks(['Hey.'], (t) => updates.push(t), (s) => commits.push(s), undefined, 30, 500);
    vi.advanceTimersByTime(34);
    expect(updates[0]).toBe('H');
    vi.advanceTimersByTime(700);
    expect(commits).toEqual(['Hey.']);
  });

  it('processes multiple chunks sequentially', () => {
    const commits: string[] = [];
    typewriterRevealChunks(
      ['Hey.', 'How are you?'],
      () => {},
      (s) => commits.push(s),
      undefined,
      30,
      500,
    );
    vi.advanceTimersByTime(800);
    expect(commits).toEqual(['Hey.']);
    vi.advanceTimersByTime(1200);
    expect(commits).toEqual(['Hey.', 'How are you?']);
  });

  it('calls onDone after all chunks', () => {
    const onDone = vi.fn();
    typewriterRevealChunks(['A.', 'B.'], () => {}, () => {}, onDone, 30, 500);
    vi.advanceTimersByTime(3000);
    expect(onDone).toHaveBeenCalledOnce();
  });
});
