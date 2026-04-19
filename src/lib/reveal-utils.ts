export function pronounFromLabel(label: string): string {
  const lower = label.toLowerCase();
  if (lower.includes('mom') || lower.includes('bride') || lower.includes('her') || lower.includes('she')) return 'She';
  if (lower.includes('dad') || lower.includes('he') || lower.includes('his')) return 'He';
  return 'They';
}

export function splitIntoSentences(text: string): string[] {
  const parts: string[] = [];
  let current = '';
  for (let i = 0; i < text.length; i++) {
    current += text[i];
    if (text[i] === '.' || text[i] === '!' || text[i] === '?') {
      // Handle closing quote after punctuation (e.g. .' or .")
      if (
        i + 1 < text.length &&
        (text[i + 1] === "'" || text[i + 1] === '"') &&
        (i + 2 >= text.length || text[i + 2] === ' ')
      ) {
        current += text[i + 1];
        i += 2; // skip quote + space
        parts.push(current.trim());
        current = '';
        continue;
      }
      // Normal: punctuation at end of string or followed by space
      if (i + 1 >= text.length || text[i + 1] === ' ') {
        parts.push(current.trim());
        current = '';
        if (i + 1 < text.length) i++; // skip space
      }
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts.length ? parts : [text];
}

export function revealAISentences(
  sentences: string[],
  addMessage: (s: string) => void,
  setTyping: (v: boolean) => void,
  onDone?: () => void,
  interDelay = 1000,
) {
  if (!sentences.length) { onDone?.(); return; }
  addMessage(sentences[0]);
  if (sentences.length === 1) { onDone?.(); return; }
  let idx = 1;
  const next = () => {
    if (idx >= sentences.length) { onDone?.(); return; }
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addMessage(sentences[idx++]);
      next();
    }, interDelay);
  };
  next();
}

export function revealUserChunks(
  remaining: string[],
  addMessage: (s: string) => void,
  setTyping: (v: boolean) => void,
  onDone: () => void,
  delay = 500,
) {
  if (!remaining.length) { onDone(); return; }
  setTyping(true);
  setTimeout(() => {
    setTyping(false);
    addMessage(remaining[0]);
    revealUserChunks(remaining.slice(1), addMessage, setTyping, onDone, delay);
  }, delay);
}

export function splitIntoChunks(text: string): string[] {
  const parts: string[] = [];
  let current = '';
  for (let i = 0; i < text.length; i++) {
    current += text[i];
    if (text[i] === '.' || text[i] === '!' || text[i] === '?') {
      // Handle closing quote after punctuation (e.g. .' or .")
      if (
        i + 1 < text.length &&
        (text[i + 1] === "'" || text[i + 1] === '"') &&
        (i + 2 >= text.length || text[i + 2] === ' ')
      ) {
        current += text[i + 1];
        i += 2;
        parts.push(current.trim());
        current = '';
        continue;
      }
      // Normal: punctuation followed by space
      if (i + 1 < text.length && text[i + 1] === ' ') {
        parts.push(current.trim());
        current = '';
        i++;
      }
    }
  }
  if (current.trim()) parts.push(current.trim());
  if (parts.length <= 1) return [text];
  if (parts.length <= 4) return parts;
  return [parts[0], parts[1], parts.slice(2, -1).join(' '), parts[parts.length - 1]];
}
