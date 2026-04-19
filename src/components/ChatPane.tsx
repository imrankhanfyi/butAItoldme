'use client';

import { ReactNode, useRef, useEffect } from 'react';
import { Message, ModelId, MODELS } from '@/lib/types';
import { ChatBubble } from './ChatBubble';
import { TypingIndicator } from './TypingIndicator';
import ModelLogo from './ModelLogo';

interface ChatPaneProps {
  title: string;
  side: 'left' | 'right';
  messages: Message[];
  isStreaming: boolean;
  streamingContent?: string;
  statusText?: string;
  model: ModelId;
  pronoun?: string;
  userTyping?: boolean;
  highlights?: string[];
  footer?: ReactNode;
  typingContent?: string;
  typingRole?: 'user' | 'assistant';
  connectionState?: 'connected' | 'idle';
  onFastForward?: () => void;
  canFastForward?: boolean;
}

const MONO = "ui-monospace, 'SF Mono', Menlo, monospace";
const LABEL_COLOR = 'rgba(245,243,238,0.42)';
const HAIRLINE = 'rgba(245,243,238,0.09)';

function formatUserTitle(title: string) {
  const normalized = (title || 'You').trim();
  return `👤 ${normalized}`;
}

function formatPaneTitle(title: string) {
  return (title || 'You').trim().toUpperCase();
}

export function ChatPane({
  title,
  side,
  messages,
  isStreaming,
  streamingContent,
  statusText,
  model,
  pronoun: _pronoun,
  userTyping,
  highlights,
  footer,
  typingContent,
  typingRole,
  connectionState,
  onFastForward,
  canFastForward,
}: ChatPaneProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasMessagesRef = useRef(false);
  void _pronoun;
  useEffect(() => { hasMessagesRef.current = messages.length > 0; }, [messages.length]);

  useEffect(() => {
    if (scrollRef.current && typeof scrollRef.current.scrollTo === 'function') {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, streamingContent, isStreaming, typingContent]);

  // Scroll to bottom when container shrinks (e.g. RevealCard or input footer appearing)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (typeof ResizeObserver === 'undefined') return;
    let prevHeight = el.clientHeight;
    const observer = new ResizeObserver(() => {
      const newHeight = el.clientHeight;
      if (newHeight < prevHeight && hasMessagesRef.current) {
        requestAnimationFrame(() => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }));
      }
      prevHeight = newHeight;
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const modelName = MODELS[model]?.name ?? model;
  const modelProvider = MODELS[model]?.provider ?? 'anthropic';

  // Mono header: "THE QUITTER · GEMINI FLASH"
  const personLabel = formatPaneTitle(title);
  const modelLabel = modelName.toUpperCase();
  const headerLabel = `${personLabel} · ${modelLabel}`;

  return (
    <div className="flex flex-col h-full">
      {/* Pane header */}
      <div
        className="px-5 py-3 border-b"
        style={{ borderColor: HAIRLINE }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: '10px',
            letterSpacing: '1.5px',
            color: LABEL_COLOR,
            textTransform: 'uppercase',
          }}
        >
          {headerLabel}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 pb-32 hide-scrollbar">
        {messages.map((msg, i) => {
          const showLabel = i === 0 || msg.role !== messages[i - 1]?.role;
          const speakerLabel = msg.role === 'user' ? formatUserTitle(title) : (MODELS[model]?.name ?? model);
          return (
            <ChatBubble
              key={i}
              role={msg.role}
              content={msg.content}
              side={side}
              highlights={msg.role === 'assistant' ? highlights : undefined}
              showLabel={showLabel}
              speakerLabel={speakerLabel}
              model={modelProvider}
              connectionState={msg.role === 'assistant' ? connectionState : undefined}
            />
          );
        })}
        {typingContent != null && typingRole != null && (() => {
          const showLabel = messages.length === 0 || messages[messages.length - 1]?.role !== typingRole;
          const speakerLabel = typingRole === 'user' ? formatUserTitle(title) : (MODELS[model]?.name ?? model);
          return (
            <ChatBubble
              role={typingRole}
              content={typingContent}
              side={side}
              showLabel={showLabel}
              speakerLabel={speakerLabel}
              model={modelProvider}
              showCursor
              connectionState={typingRole === 'assistant' ? connectionState : undefined}
            />
          );
        })()}
        {userTyping && !typingContent && <TypingIndicator />}
        {isStreaming && !streamingContent && !userTyping && !typingContent && <TypingIndicator />}
        {streamingContent && (
          <div className="py-3 text-sm leading-relaxed" style={{ color: 'rgba(245,243,238,0.82)' }}>
            <div className="mr-8 sm:mr-10">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="flex items-center gap-1"
                  style={{ fontFamily: MONO, fontSize: '10px', color: LABEL_COLOR }}
                >
                  <ModelLogo provider={modelProvider} size="sm" />
                  <span>{modelName}</span>
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
              </div>
              {streamingContent}
            </div>
          </div>
        )}
        {statusText && (
          <p className="text-xs mt-2" style={{ color: LABEL_COLOR }}>
            {statusText}
          </p>
        )}
      </div>

      <div className="px-5 pb-2.5">
        {canFastForward && onFastForward && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onFastForward}
              className="mb-2 inline-flex items-center gap-2 rounded-full px-2.5 py-1 transition-colors"
              style={{
                border: '1px solid rgba(245,243,238,0.12)',
                color: 'rgba(245,243,238,0.35)',
                fontFamily: MONO,
                fontSize: '9px',
                letterSpacing: '1.35px',
                textTransform: 'uppercase',
                background: 'transparent',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,243,238,0.22)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,243,238,0.12)';
              }}
            >
              <span style={{ fontSize: '10px', lineHeight: 1 }}>⏩</span>
              Fast-forward
            </button>
          </div>
        )}
        {footer}
      </div>
    </div>
  );
}
