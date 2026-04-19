// src/components/TypingIndicator.tsx
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-3">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary-text)] animate-bounce" />
      <span
        className="w-1.5 h-1.5 rounded-full bg-[var(--secondary-text)] animate-bounce"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full bg-[var(--secondary-text)] animate-bounce"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
}
