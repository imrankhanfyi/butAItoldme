'use client';

import Link from 'next/link';

interface TopBarProps {
  onNewChat: () => void;
  variant?: 'landing' | 'chat';
}

export function TopBar({ onNewChat, variant = 'chat' }: TopBarProps) {
  if (variant === 'landing') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 28px',
          borderBottom: '1px solid var(--ink)',
          background: 'var(--paper)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <button
            onClick={onNewChat}
            style={{
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontSize: '15px',
            }}
          >
            but AI told me
          </button>
          <span
            style={{
              fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
              color: 'var(--ink)',
              fontSize: '10px',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ color: '#b44' }}>RESEARCH PREVIEW</span> · APR 2026 · an AI safety demo
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Link
            href="/how-it-works"
            style={{
              fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
              fontSize: '11px',
              color: 'var(--ink-mute)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--ink-mute)',
              paddingBottom: '1px',
            }}
          >
            <span className="hidden sm:inline">how it works →</span>
            <span className="sm:hidden">how?</span>
          </Link>
          <a
            href="https://www.imrankhan.fyi"
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
              fontSize: '11px',
              color: 'var(--ink-mute)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--ink-mute)',
              paddingBottom: '1px',
            }}
          >
            <span className="hidden sm:inline">by imrankhan.fyi →</span>
            <span className="sm:hidden">by imrankhan.fyi</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-subtle)]">
      <div className="flex items-center gap-3">
        <button
          onClick={onNewChat}
          className="text-sm font-bold text-white tracking-tight hover:opacity-80 transition-opacity"
        >
          but AI told me
        </button>
      </div>
      <div />
    </div>
  );
}
