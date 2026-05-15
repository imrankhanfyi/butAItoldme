'use client';

import { ChatPane } from '@/components/ChatPane';
import { RevealCard } from '@/components/RevealCard';
import { ScenarioList } from '@/components/ScenarioList';
import { TopBar } from '@/components/TopBar';
import { SCENARIOS } from '@/lib/scenarios';
import { pronounFromLabel } from '@/lib/reveal-utils';
import { useConversationController } from '@/hooks/useConversationController';

const FEATURED = SCENARIOS.filter((s) => s.featured);
const REST = SCENARIOS.filter((s) => !s.featured);

export default function Home() {
  const controller = useConversationController();
  const isEmpty =
    controller.userMessages.length === 0 &&
    !controller.isStreaming &&
    !controller.activeScenario &&
    !controller.leftTypingContent;

  if (isEmpty) {
    return (
      <div className="landing flex flex-col min-h-screen" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
        <TopBar variant="landing" onNewChat={controller.handleNewChat} />

        <div className="flex-1 overflow-y-auto">
          <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 28px' }}>

            {/* Hero */}
            <div style={{ paddingTop: '44px', paddingBottom: '24px' }}>
              <h1
                style={{
                  fontSize: 'clamp(36px, 5vw, 46px)',
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.0,
                  margin: '0 0 16px',
                  color: 'var(--ink)',
                }}
              >
                Is your AI sycophantic?
              </h1>
              <p
                style={{
                  fontSize: '16px',
                  color: 'var(--ink-soft)',
                  lineHeight: 1.55,
                  maxWidth: '560px',
                  margin: 0,
                }}
              >
                See Claude respond in real time to two sides of the same conflict.
              </p>
            </div>

            {/* Claude row */}
            <div style={{ paddingBottom: '24px' }}>
              <div
                style={{
                  fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                  color: 'var(--ink-faint)',
                  fontSize: '10px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                LIVE MODEL
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 12px',
                  border: '1px solid var(--ink)',
                  fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                  fontSize: '12px',
                  color: 'var(--ink)',
                  background: 'rgba(26,26,26,0.03)',
                }}
              >
                Claude Sonnet 4.6
                <span style={{ color: 'var(--ink-faint)' }}>fixed for every live conversation</span>
              </div>
            </div>

            {/* Scenario list */}
            <div style={{ paddingBottom: '60px' }}>
              <div
                style={{
                  fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                  color: 'var(--ink-faint)',
                  fontSize: '10px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                STEP 1 · PICK A SCENARIO
              </div>
              <ScenarioList
                featured={FEATURED}
                rest={REST}
                onSelect={(scenario) => controller.startScenario(scenario)}
              />
            </div>

            {/* Footer */}
            <div
              style={{
                paddingBottom: '32px',
                fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                fontSize: '10px',
                color: 'var(--ink-faint)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              sycobot · a claude-only demo of AI agreement
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--background)' }}>
      <TopBar
        variant="chat"
        onNewChat={controller.handleNewChat}
      />

      <div className="flex-1 flex flex-col min-h-0">
        {controller.activeScenario && (
          <div
            className="px-4 sm:px-5 py-2 border-b"
            style={{
              borderColor: 'rgba(245,243,238,0.09)',
              fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
              fontSize: '10px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'rgba(245,243,238,0.42)',
            }}
          >
            <span className="mr-2">{controller.activeScenario.emoji}</span>
            <span className="truncate">{controller.activeScenario.title}</span>
          </div>
        )}

        <div className="flex sm:hidden border-b" style={{ borderColor: 'rgba(245,243,238,0.09)' }}>
          <button
            onClick={() => controller.setActiveTab('left')}
            className="flex-1 py-2 text-sm font-medium transition-colors"
            style={{
              color: controller.activeTab === 'left' ? 'rgba(245,243,238,0.88)' : 'rgba(245,243,238,0.25)',
              borderBottom: controller.activeTab === 'left' ? '2px solid rgba(245,243,238,0.5)' : '2px solid transparent',
            }}
          >
            {controller.activeScenario ? controller.activeScenario.personALabel : 'You'}
          </button>
          <button
            onClick={() => controller.setActiveTab('right')}
            className="flex-1 py-2 text-sm font-medium transition-colors"
            style={{
              color: controller.activeTab === 'right' ? 'rgba(245,243,238,0.88)' : 'rgba(245,243,238,0.25)',
              borderBottom: controller.activeTab === 'right' ? '2px solid rgba(245,243,238,0.5)' : '2px solid transparent',
            }}
          >
            {controller.activeScenario ? controller.activeScenario.personBLabel : 'The Other Side 🪞'}
          </button>
        </div>

        {controller.streamError && (
          <div className="mx-4 mt-3 px-4 py-2 border border-red-700/50 bg-red-900/30 text-red-300 text-sm text-center">
            {controller.streamError}
          </div>
        )}

        <div className="relative flex-1 flex min-h-0">
          {controller.showRevealCard && !controller.isStreaming && (
            <div className="absolute bottom-0 left-0 right-0 z-20">
              <div
                className="h-8 pointer-events-none"
                style={{ background: 'linear-gradient(to top, var(--background), transparent)' }}
              />
              <div style={{ background: 'var(--background)' }}>
                <RevealCard
                  visible={controller.showRevealCard}
                  onTryAnother={controller.handleNewChat}
                  input={controller.input}
                  onInputChange={controller.setInput}
                  onSubmit={() => void controller.sendMessage(controller.input)}
                  onInputKeyDown={controller.handleKeyDown}
                  isSubmitting={controller.isStreaming}
                />
              </div>
            </div>
          )}

          <div
            className={`flex-1 border-r border-[var(--border-subtle)] ${
              controller.activeTab !== 'left' ? 'hidden sm:flex' : 'flex'
            } flex-col`}
          >
            <ChatPane
              title={controller.leftTitle}
              side="left"
              messages={controller.userMessages}
              isStreaming={
                controller.leftAITyping ||
                (controller.isStreaming &&
                  !controller.leftStreaming &&
                  controller.userChunksComplete &&
                  !controller.leftTypingContent &&
                  controller.leftTypingRole !== 'assistant')
              }
              streamingContent={
                controller.userMessages.length <= 1 && controller.userChunksComplete
                  ? (controller.leftStreaming || undefined)
                  : undefined
              }
              model={controller.model}
              connectionState={controller.leftConnected ? 'connected' : 'idle'}
              canFastForward={controller.fastForwardPane === 'left'}
              onFastForward={controller.fastForwardCurrentPhase}
              userTyping={controller.userTyping && !controller.leftTypingContent}
              pronoun={
                controller.activeScenario
                  ? pronounFromLabel(controller.activeScenario.personALabel)
                  : undefined
              }
              highlights={controller.highlightData
                .filter((highlight) => highlight.pane === 'left')
                .map((highlight) => highlight.text)}
              typingContent={controller.leftTypingContent ?? undefined}
              typingRole={controller.leftTypingRole}
              footer={null}
            />
          </div>

          <div
            className={`flex-1 ${controller.activeTab !== 'right' ? 'hidden sm:flex' : 'flex'} flex-col`}
          >
            <ChatPane
              title={controller.rightTitle}
              side="right"
              messages={controller.mirrorMessages}
              isStreaming={
                controller.rightAITyping ||
                (controller.isStreaming &&
                  controller.rightRevealReady &&
                  controller.rightChunksComplete &&
                  !controller.rightStreaming &&
                  !controller.mirrorStatus &&
                  !controller.rightTypingContent &&
                  controller.rightTypingRole !== 'assistant')
              }
              streamingContent={
                controller.rightRevealReady && controller.rightChunksComplete
                  ? (controller.rightStreaming || undefined)
                  : undefined
              }
              userTyping={controller.mirrorUserTyping && !controller.rightTypingContent}
              statusText={controller.rightRevealReady ? controller.mirrorStatus || undefined : undefined}
              model={controller.model}
              connectionState={controller.rightConnected ? 'connected' : 'idle'}
              canFastForward={controller.fastForwardPane === 'right'}
              onFastForward={controller.fastForwardCurrentPhase}
              pronoun={
                controller.activeScenario
                  ? pronounFromLabel(controller.activeScenario.personBLabel)
                  : undefined
              }
              highlights={controller.highlightData
                .filter((highlight) => highlight.pane === 'right')
                .map((highlight) => highlight.text)}
              typingContent={controller.rightTypingContent ?? undefined}
              typingRole={controller.rightTypingRole}
              footer={null}
            />
          </div>
        </div>
      </div>

      {/* How it works — centered footer */}
      <div
        className="flex justify-center py-2"
        style={{ borderTop: '1px solid rgba(245,243,238,0.09)' }}
      >
        <a
          href="/how-it-works"
          style={{
            fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
            fontSize: '11px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: 'rgba(245,243,238,0.42)',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(245,243,238,0.7)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(245,243,238,0.42)';
          }}
        >
          How it works →
        </a>
      </div>
    </div>
  );
}
