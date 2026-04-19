import Link from 'next/link';
import { CHAT_SYSTEM_PROMPT } from '@/lib/orchestrator';
import { FLIP_SYSTEM_PROMPT } from '@/lib/flip';

export const metadata = {
  title: 'How It Works — ButAIToldMe',
};

function Header() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '12px 28px',
        borderBottom: '1px solid var(--ink)',
        background: 'var(--paper)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
        <Link
          href="/"
          style={{
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: 'var(--ink)',
            textDecoration: 'none',
            fontSize: '15px',
          }}
        >
          but AI told me
        </Link>
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
          href="/"
          style={{
            fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
            fontSize: '11px',
            color: 'var(--ink-mute)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--ink-mute)',
            paddingBottom: '1px',
          }}
        >
          <span className="hidden sm:inline">home →</span>
          <span className="sm:hidden">home</span>
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

function SectionLabel({ children }: { children: string }) {
  return (
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
      {children}
    </div>
  );
}

function PromptBlock({ children }: { children: string }) {
  return (
    <pre
      style={{
        margin: '12px 0 0',
        padding: '16px',
        border: '1px solid var(--rule-faint)',
        background: 'rgba(26,26,26,0.03)',
        color: 'var(--ink-soft)',
        fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
        fontSize: '12px',
        lineHeight: 1.55,
        whiteSpace: 'pre-wrap',
        overflowX: 'auto',
      }}
    >
      {children}
    </pre>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        paddingTop: '24px',
        marginTop: '24px',
        borderTop: '1px solid var(--rule-faint)',
      }}
    >
      <SectionLabel>{label}</SectionLabel>
      {children}
    </section>
  );
}

export default function HowItWorks() {
  return (
    <div className="landing flex min-h-screen flex-col" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <Header />

      <main className="flex-1">
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 28px 56px' }}>
          <div style={{ paddingTop: '44px', paddingBottom: '28px' }}>
            <SectionLabel>How it works</SectionLabel>
            <h1
              style={{
                fontSize: 'clamp(34px, 4.6vw, 44px)',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                margin: '0 0 16px',
                color: 'var(--ink)',
              }}
            >
              Everything this demo does, explained.
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--ink-soft)',
                lineHeight: 1.6,
                maxWidth: '560px',
                margin: 0,
              }}
            >
              No tricks. Just the prompts, the API flow, and the few places where the app
              intentionally stages the conversation.
            </p>
          </div>

          <Section label="What the demo does">
            <p
              style={{
                fontSize: '16px',
                color: 'var(--ink-soft)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Two independent conversations with the same AI model about the same relationship
              conflict - one from each person&apos;s perspective. The conversations run in separate
              API sessions. Neither has access to the other. The AI doesn&apos;t know the other
              conversation exists.
            </p>
          </Section>

          <Section label="The system prompt">
            <p
              style={{
                fontSize: '16px',
                color: 'var(--ink-soft)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Both conversations use this exact system prompt. It constrains response length for
              readability - it does not influence the AI&apos;s opinion or push it toward agreement.
            </p>
            <PromptBlock>{CHAT_SYSTEM_PROMPT}</PromptBlock>
          </Section>

          <Section label="How the API calls work">
            <p
              style={{
                fontSize: '16px',
                color: 'var(--ink-soft)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Both conversations use the same model with the same settings. Each conversation is a
              separate API session with its own message history. The model you see in the header
              (Claude Sonnet 4.6, GPT-4o, or Gemini Flash 3.0) is the exact model making both API calls.
              We use the provider default temperature, which is 1.0 in this setup. All models are
              accessed through OpenRouter.
            </p>
          </Section>

          <Section label="What we don&apos;t do">
            <p
              style={{
                fontSize: '16px',
                color: 'var(--ink-soft)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              No prompt engineering to force the AI to agree. No cherry-picking responses. No
              post-processing to make answers more contradictory. The responses stream live from
              the API and are shown to you unmodified. If the AI happens to challenge one side,
              you&apos;ll see that too.
            </p>
          </Section>

          <Section label="The perspective flip">
            <p
              style={{
                fontSize: '16px',
                color: 'var(--ink-soft)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              For the first message, both perspectives are pre-written by us - each person tells
              their side of the story in their own words. For follow-up messages, a separate AI
              (Gemini Flash 3.0) rewrites your message from the other person&apos;s perspective.
              We use the provider default temperature here as well, which is 1.0. Here&apos;s the
              exact prompt it uses:
            </p>
            <PromptBlock>{FLIP_SYSTEM_PROMPT}</PromptBlock>
          </Section>

          <Section label="How follow-up messages work">
            <p
              style={{
                fontSize: '16px',
                color: 'var(--ink-soft)',
                lineHeight: 1.65,
                margin: '0 0 16px',
              }}
            >
              When you type a follow-up, three things happen in sequence. First, your message is
              added to the left-pane conversation and sent to the main AI — it sees the full history
              of that conversation and responds as if it&apos;s been talking to you the whole time.
              Second, a separate AI (Gemini Flash 3.0) rewrites your message from the other
              person&apos;s perspective, using the context it has from both sides of the
              conversation. Third, that rewritten version is added to the right-pane conversation
              and the main AI responds to it — again, with the full history of that conversation.
            </p>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--ink-soft)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              The two panes stay independent throughout. Your original message never reaches the
              right-pane session. The rewritten message never reaches the left-pane session. The
              main AI only ever sees one side at a time.
            </p>
          </Section>

          <Section label="Source code">
            <p
              style={{
                fontSize: '16px',
                color: 'var(--ink-soft)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              This project is open source.{' '}
              <a
                href="https://github.com/imrankhanfyi/butAItoldme"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--ink)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--ink-mute)',
                }}
              >
                View the code on GitHub
              </a>
              .
            </p>
          </Section>

          <Section label="What we learned">
            <p
              style={{
                fontSize: '16px',
                color: 'var(--ink-soft)',
                lineHeight: 1.65,
                margin: '0 0 16px',
              }}
            >
              Before publishing, we ran a validation study on every scenario: N=5 independent
              trials per scenario across three frontier models (Claude Sonnet 4.6, GPT-4o,
              Gemini Flash 3.0), with two independent LLM judges scoring each response.
              Inter-judge agreement was 89%. Fourteen scenarios were tested; the nine you see
              here were the ones that consistently produced sycophancy across models and trials.
            </p>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--ink-soft)',
                lineHeight: 1.65,
                margin: '0 0 16px',
              }}
            >
              The five we removed taught us something more interesting than we expected. Our
              prompts ask for a direct answer — &ldquo;don&apos;t just tell me to
              communicate,&rdquo; &ldquo;I want to know: am I wrong?&rdquo; That framing boosted
              the visible contradiction in every scenario. But on scenarios where one person was
              more clearly in the wrong — someone who broke a confidence, ignored an agreed rule,
              posted a photo without consent — the same framing caused the models to push back on
              the culpable party rather than validate them. Those scenarios had high visibility
              scores but low sycophancy rates. The clearest case: one scenario reached 4.4/5 on
              the visibility scale (the highest in the study) while triggering symmetric
              validation in exactly 0% of trials.
            </p>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--ink-soft)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              What this means is that the sycophancy you see in this demo isn&apos;t a blanket
              failure mode. It shows up most reliably when the situation involves{' '}
              <em>symmetric emotional grievance</em> — where both people have genuine pain, neither
              is obviously more wrong, and the model can&apos;t make a judgment call without
              picking a side. That&apos;s not a narrow edge case. It describes a large share of
              the actual conflicts people bring to AI.
            </p>
          </Section>
        </div>
      </main>
    </div>
  );
}
