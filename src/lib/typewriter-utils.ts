type OnUpdate = (displayedText: string) => void;
type OnCommit = (text: string) => void;
type CancelFn = (() => void) & { finishNow?: () => void };

// 30 cps increased by 18% for the chat-pane reveal speed.
export const CHAT_PANE_TYPING_CPS = 35.4;

export function typewriterRevealSentences(
  sentences: string[],
  onUpdate: OnUpdate,
  onCommit: OnCommit,
  onDone?: () => void,
  cps = CHAT_PANE_TYPING_CPS,
  pauseAfterMs = 500,
): CancelFn {
  if (!sentences.length) { onDone?.(); return () => {}; }

  let cancelled = false;
  let finished = false;
  let finishNowRequested = false;
  const timers: ReturnType<typeof setTimeout>[] = [];
  let currentSentence: string | null = null;
  let currentSentenceCommitted = false;

  const addTimer = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.push(t);
  };

  const cancel = () => {
    cancelled = true;
    timers.forEach(clearTimeout);
    timers.length = 0;
  };

  const flushRemaining = () => {
    if (cancelled || finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    timers.length = 0;

    if (currentSentence && !currentSentenceCommitted) {
      onUpdate(currentSentence!);
      onCommit(currentSentence!);
      onUpdate('');
      currentSentenceCommitted = true;
    }

    while (sentenceIdx < sentences.length) {
      const sentence = sentences[sentenceIdx++];
      onUpdate(sentence);
      onCommit(sentence);
      onUpdate('');
    }

    onDone?.();
  };

  const intervalMs = Math.ceil(1000 / cps);
  let sentenceIdx = 0;

  const typeNext = () => {
    if (cancelled) return;
    if (sentenceIdx >= sentences.length) { onDone?.(); return; }

    currentSentence = sentences[sentenceIdx++];
    currentSentenceCommitted = false;
    let charIdx = 0;

    const tick = () => {
      if (cancelled) return;
      if (finished) return;
      if (finishNowRequested) {
        flushRemaining();
        return;
      }
      charIdx++;
      onUpdate(currentSentence!.slice(0, charIdx));
      if (charIdx < currentSentence!.length) {
        addTimer(tick, intervalMs);
      } else {
        // Full sentence displayed — pause, then commit
        addTimer(() => {
          if (cancelled) return;
          if (finished) return;
          if (finishNowRequested) {
            flushRemaining();
            return;
          }
          currentSentenceCommitted = true;
          onCommit(currentSentence!);
          onUpdate('');
          addTimer(typeNext, 50);
        }, pauseAfterMs);
      }
    };

    addTimer(tick, intervalMs);
  };

  const finishNow = () => {
    if (cancelled || finished) return;
    finishNowRequested = true;
    flushRemaining();
  };

  typeNext();
  return Object.assign(cancel, { finishNow });
}

export function typewriterRevealChunks(
  chunks: string[],
  onUpdate: OnUpdate,
  onCommit: OnCommit,
  onDone?: () => void,
  cps = CHAT_PANE_TYPING_CPS,
  pauseAfterMs = 500,
): CancelFn {
  return typewriterRevealSentences(chunks, onUpdate, onCommit, onDone, cps, pauseAfterMs);
}
