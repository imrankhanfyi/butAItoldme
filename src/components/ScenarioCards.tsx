'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { Scenario, SCENARIOS } from '@/lib/scenarios';

interface ScenarioCardsProps {
  onSelect: (scenario: Scenario) => void;
  primaryScenarioIds?: string[];
  selectedScenarioId?: string | null;
  excludeIds?: string[];
  children?: ReactNode;
}

export function ScenarioCards({
  onSelect,
  primaryScenarioIds,
  selectedScenarioId = null,
  excludeIds = [],
  children,
}: ScenarioCardsProps) {
  const [visibleCount, setVisibleCount] = useState(3);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const featured = SCENARIOS.find((s) => s.featured) ?? SCENARIOS[0];
  const primaryScenarios =
    primaryScenarioIds?.length
      ? primaryScenarioIds
          .map((id) => SCENARIOS.find((scenario) => scenario.id === id))
          .filter((scenario): scenario is Scenario => !!scenario)
      : [];
  const primaryIds = new Set(primaryScenarios.map((scenario) => scenario.id));
  const excludedIds = new Set([
    ...excludeIds,
    ...primaryIds,
    ...(primaryScenarios.length ? [] : [featured.id]),
  ]);
  const others = SCENARIOS.filter((s) => !excludedIds.has(s.id));
  const visible = others.slice(0, visibleCount);
  const remainingCount = Math.max(0, others.length - visibleCount);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 4, others.length));
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [others]);

  return (
    <div className="w-full max-w-3xl px-4" role="group" aria-label="Scenario options">
      {primaryScenarios.length ? (
        <div className="mb-5 p-5 border border-[var(--gold-border)] bg-[rgba(255,255,255,0.03)]">
          <div className="text-[9px] font-semibold tracking-[1.5px] uppercase text-[var(--gold)] bg-[var(--background)] inline-block px-2 -mt-2.5">
            Default scenarios
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {primaryScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => onSelect(scenario)}
                aria-pressed={selectedScenarioId === scenario.id}
                className={[
                  'text-left p-4 border transition-all min-h-[160px]',
                  selectedScenarioId === scenario.id
                    ? 'border-[var(--gold)] bg-[rgba(232,184,77,0.08)] shadow-[0_0_0_1px_rgba(232,184,77,0.18)]'
                    : 'border-[var(--border-light)] bg-[rgba(255,255,255,0.02)] hover:border-[var(--gold-dim)] hover:bg-[rgba(255,255,255,0.04)]',
                ].join(' ')}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl leading-none" style={{ filter: 'grayscale(0.3)' }}>
                    {scenario.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[15px] font-bold text-white mb-1 tracking-tight">
                      {scenario.title}
                    </h3>
                    <p className="text-xs text-[var(--secondary-text)] leading-relaxed mb-3">
                      {scenario.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] text-[var(--person-a)] border-b border-[rgba(120,160,255,0.25)] pb-px">
                        {scenario.personALabel} →
                      </span>
                      <span className="text-[10px] text-[var(--person-b)] border-b border-[rgba(100,220,150,0.25)] pb-px">
                        {scenario.personBLabel} →
                      </span>
                    </div>
                  </div>
                </div>
                {selectedScenarioId === scenario.id && (
                  <div className="mt-3 text-[9px] uppercase tracking-[1.4px] text-[var(--gold)]">
                    Selected
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => onSelect(featured)}
          className="w-full text-left relative mb-5 p-6 bg-[rgba(255,255,255,0.03)] border border-[var(--gold-border)] transition-all hover:border-[var(--gold-dim)] group"
        >
          <div className="absolute -top-2.5 left-5 text-[9px] font-semibold tracking-[1.5px] uppercase text-[var(--gold)] bg-[var(--background)] px-2">
            Start here
          </div>
          <div className="relative flex items-start gap-4">
            <span className="text-4xl leading-none" style={{ filter: 'grayscale(0.3)' }}>
              {featured.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-bold text-white mb-1.5 tracking-tight">
                {featured.title}
              </h3>
              <p className="text-xs text-[var(--secondary-text)] leading-relaxed mb-3">
                {featured.description}
              </p>
              <div className="flex gap-2.5">
                <span className="text-[10px] text-[var(--person-a)] border-b border-[rgba(120,160,255,0.25)] pb-px">
                  {featured.personALabel} →
                </span>
                <span className="text-[10px] text-[var(--person-b)] border-b border-[rgba(100,220,150,0.25)] pb-px">
                  {featured.personBLabel} →
                </span>
              </div>
            </div>
          </div>
        </button>
      )}

      {children}

      {primaryScenarios.length ? <div className="gold-line my-5" /> : <div className="gold-line mb-5" />}

      {/* Secondary cards */}
      <div className="mb-3">
        <p className="text-[10px] uppercase tracking-[1.5px] text-[var(--faint-text)] mb-3">
          Other scenarios
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {visible.map((scenario, index) => (
            <button
              key={scenario.id}
              onClick={() => onSelect(scenario)}
              aria-pressed={selectedScenarioId === scenario.id}
              className={`text-left p-3.5 border min-h-[118px] transition-all ${selectedScenarioId === scenario.id ? 'border-[var(--gold)] bg-[rgba(232,184,77,0.06)]' : 'border-[var(--border-subtle)] bg-[rgba(255,255,255,0.015)] hover:border-[var(--border-light)] hover:bg-[rgba(255,255,255,0.03)]'}${index >= visibleCount - 4 ? ' animate-fade-in' : ''}`}
            >
              <span
                className="text-xl block mb-1.5"
                style={{ filter: 'grayscale(0.3)' }}
              >
                {scenario.emoji}
              </span>
              <span className="text-[11px] font-medium text-[rgba(255,255,255,0.6)] block leading-snug">
                {scenario.title}
              </span>
              <span className="text-[10px] text-[var(--faint-text)] block mt-1 leading-relaxed">
                {scenario.shortDescription}
              </span>
              {selectedScenarioId === scenario.id && (
                <div className="mt-2 text-[9px] uppercase tracking-[1.4px] text-[var(--gold)]">
                  Selected
                </div>
              )}
            </button>
          ))}
        </div>
        {remainingCount > 0 && (
          <button
            type="button"
            onClick={() => setVisibleCount(others.length)}
            className="mt-3 text-[10px] uppercase tracking-[1.4px] text-[var(--gold-dim)] hover:text-[var(--gold)] transition-colors"
          >
            +{remainingCount} more scenarios
          </button>
        )}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </div>
    </div>
  );
}
