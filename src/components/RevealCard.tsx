import type { KeyboardEvent } from 'react';

interface RevealCardProps {
  visible: boolean;
  onTryAnother: () => void;
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  isSubmitting?: boolean;
}

export function RevealCard({
  visible,
  onTryAnother,
  input,
  onInputChange,
  onSubmit,
  onInputKeyDown,
  isSubmitting = false,
}: RevealCardProps) {
  if (!visible) return null;

  return (
    <div className="animate-fade-in relative">
      <div style={{ height: '1px', background: 'rgba(245,243,238,0.09)' }} />
      <div className="relative px-4 py-1.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
            className="w-full min-w-0 px-3.5 py-2 transition-colors min-h-[48px] flex items-center"
            style={{ border: '1px solid rgba(245,243,238,0.12)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLFormElement).style.borderColor = 'rgba(245,243,238,0.22)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLFormElement).style.borderColor = 'rgba(245,243,238,0.12)';
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(event) => onInputChange(event.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Type a follow-up..."
              autoFocus
              disabled={isSubmitting}
              className="w-full bg-transparent text-sm outline-none disabled:opacity-40"
              style={{
                color: 'rgba(245,243,238,0.88)',
                caretColor: 'rgba(245,243,238,0.6)',
              }}
            />
          </form>
          <button
            onClick={onTryAnother}
            className="w-full min-w-0 text-left px-3.5 py-2 transition-colors min-h-[48px] flex items-center"
            style={{ border: '1px solid rgba(245,243,238,0.09)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,243,238,0.2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,243,238,0.09)';
            }}
          >
            <div className="text-sm" style={{ color: 'rgba(245,243,238,0.42)' }}>
              Pick a different scenario →
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
