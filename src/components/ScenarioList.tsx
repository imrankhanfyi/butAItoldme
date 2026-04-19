'use client';

import { useState } from 'react';
import { Scenario } from '@/lib/scenarios';

interface ScenarioListProps {
  featured: Scenario[];
  rest: Scenario[];
  onSelect: (scenario: Scenario) => void;
}

function ScenarioRow({ scenario, onSelect }: { scenario: Scenario; onSelect: (s: Scenario) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(scenario)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(scenario); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderTop: '1px solid var(--ink)',
        padding: '18px 0',
        cursor: 'pointer',
        display: 'grid',
        gridTemplateColumns: '40px 1fr auto',
        gap: '16px',
        alignItems: 'center',
        background: hovered ? 'rgba(26,26,26,0.03)' : 'transparent',
        transition: 'background 0.1s',
        marginLeft: '-4px',
        paddingLeft: '4px',
        paddingRight: '4px',
      }}
    >
      <span style={{ fontSize: '24px', lineHeight: 1 }}>{scenario.emoji}</span>
      <span>
        <div style={{ fontWeight: 700, fontSize: '19px', letterSpacing: '-0.01em', color: 'var(--ink)' }}>
          {scenario.title}
        </div>
        <div style={{ color: 'var(--ink-mute)', fontSize: '14px', marginTop: '2px', lineHeight: 1.45 }}>
          {scenario.shortDescription}
        </div>
      </span>
      <span
        style={{
          fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
          fontSize: '11px',
          color: 'var(--ink-faint)',
        }}
      >
        →
      </span>
    </div>
  );
}

function SmallScenarioRow({ scenario, onSelect }: { scenario: Scenario; onSelect: (s: Scenario) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(scenario)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(scenario); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderTop: '1px solid var(--rule-faint)',
        padding: '13px 0',
        cursor: 'pointer',
        display: 'grid',
        gridTemplateColumns: '32px 1fr auto',
        gap: '12px',
        alignItems: 'center',
        background: hovered ? 'rgba(26,26,26,0.03)' : 'transparent',
        transition: 'background 0.1s',
        marginLeft: '-4px',
        paddingLeft: '4px',
        paddingRight: '4px',
      }}
    >
      <span style={{ fontSize: '18px', lineHeight: 1 }}>{scenario.emoji}</span>
      <span>
        <div style={{ fontWeight: 600, fontSize: '15px', letterSpacing: '-0.01em', color: 'var(--ink)' }}>
          {scenario.title}
        </div>
        <div style={{ color: 'var(--ink-mute)', fontSize: '13px', marginTop: '1px', lineHeight: 1.4 }}>
          {scenario.shortDescription}
        </div>
      </span>
      <span
        style={{
          fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
          fontSize: '11px',
          color: 'var(--ink-faint)',
        }}
      >
        →
      </span>
    </div>
  );
}

export function ScenarioList({ featured, rest, onSelect }: ScenarioListProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      {featured.map((s) => (
        <ScenarioRow key={s.id} scenario={s} onSelect={onSelect} />
      ))}

      {rest.length > 0 && (
        <>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setExpanded((v) => !v)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded((v) => !v); }}
            style={{
              borderTop: '1px solid var(--ink)',
              borderBottom: expanded ? 'none' : '1px solid var(--ink)',
              padding: '13px 0',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
              fontSize: '11px',
              color: 'var(--ink-mute)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            <span>{rest.length} more scenarios</span>
            <span>{expanded ? '↑ collapse' : '↓ expand'}</span>
          </div>

          {expanded && (
            <div style={{ borderBottom: '1px solid var(--ink)' }}>
              {rest.map((s) => (
                <SmallScenarioRow key={s.id} scenario={s} onSelect={onSelect} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
