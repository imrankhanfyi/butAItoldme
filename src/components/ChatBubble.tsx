'use client';

import React from 'react';
import ModelLogo from './ModelLogo';
import { TypingCursor } from './TypingCursor';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  side: 'left' | 'right';
  highlights?: string[];
  speakerLabel?: string;
  showLabel?: boolean;
  model?: string;
  showCursor?: boolean;
  connectionState?: 'connected' | 'idle';
}

const MONO = "ui-monospace, 'SF Mono', Menlo, monospace";
const LABEL_COLOR = 'rgba(245,243,238,0.42)';
const MSG_COLOR = 'rgba(245,243,238,0.95)';
const AI_COLOR = 'rgba(245,243,238,0.72)';

function highlightText(content: string, highlights: string[]): React.ReactNode {
  if (!highlights.length) return content;

  const parts: { text: string; highlighted: boolean }[] = [];
  let remaining = content;

  for (const hl of highlights) {
    const idx = remaining.indexOf(hl);
    if (idx === -1) continue;
    if (idx > 0) parts.push({ text: remaining.slice(0, idx), highlighted: false });
    parts.push({ text: hl, highlighted: true });
    remaining = remaining.slice(idx + hl.length);
  }
  if (remaining) parts.push({ text: remaining, highlighted: false });

  if (parts.length === 0) return content;

  return parts.map((part, i) =>
    part.highlighted ? (
      <span
        key={i}
        style={{
          borderBottom: '1px solid rgba(245,243,238,0.32)',
          color: MSG_COLOR,
        }}
      >
        {part.text}
      </span>
    ) : (
      <span key={i}>{part.text}</span>
    ),
  );
}

export function ChatBubble({
  role,
  content,
  side,
  highlights = [],
  speakerLabel,
  showLabel,
  model,
  showCursor,
  connectionState,
}: ChatBubbleProps) {
  const isUser = role === 'user';
  const textColor = isUser ? MSG_COLOR : AI_COLOR;
  const fontWeight = isUser ? 450 : 400;
  const shouldHighlight = !isUser && highlights.length > 0;

  return (
    <div
      className={`${showLabel ? 'pt-2 pb-1' : 'py-1'}`}
      style={{ color: textColor }}
      data-role={role}
      data-side={side}
    >
      <div className={isUser ? 'ml-8 sm:ml-10' : 'mr-8 sm:mr-10'}>
        {showLabel && (
          <div className="mb-1">
            {isUser ? (
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: '10px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: LABEL_COLOR,
                }}
              >
                {speakerLabel}
              </span>
            ) : (
              <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <span
                  className="flex items-center gap-1"
                  style={{ fontFamily: MONO, fontSize: '10px', color: LABEL_COLOR }}
                >
                  <ModelLogo provider={model ?? 'anthropic'} size="sm" />
                  <span>{speakerLabel}</span>
                </span>
                {connectionState === 'connected' && (
                  <span
                    className="inline-flex items-center gap-1.5"
                    style={{ fontFamily: MONO, fontSize: '9px', letterSpacing: '1.4px', color: LABEL_COLOR }}
                  >
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: 'rgba(120,210,150,0.9)',
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    />
                    CONNECTED
                  </span>
                )}
              </span>
            )}
          </div>
        )}
        <p className="text-sm leading-relaxed" style={{ fontWeight }}>
          {shouldHighlight ? highlightText(content, highlights) : content}
          {showCursor && <TypingCursor />}
        </p>
      </div>
    </div>
  );
}
