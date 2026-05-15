'use client';

import { ModelId, MODELS } from '@/lib/types';
import ModelLogo from './ModelLogo';

interface ModelSelectorProps {
  value: ModelId;
  onChange: (model: ModelId) => void;
  disabled?: boolean;
  showNames?: boolean;
  theme?: 'dark' | 'light';
}

export function ModelSelector({ value, onChange, disabled, showNames, theme = 'dark' }: ModelSelectorProps) {
  const visibleModels: ModelId[] = ['claude-sonnet'];
  const isSelected = (id: ModelId) => id === value;

  if (theme === 'light') {
    return (
      <div className={`flex gap-1.5 items-center flex-wrap${disabled ? ' pointer-events-none opacity-40' : ''}`}>
        {visibleModels.map((id) => {
          const selected = isSelected(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '2px',
                fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                fontSize: '12px',
                transition: 'all 0.15s',
                background: selected ? 'var(--ink)' : 'transparent',
                color: selected ? 'var(--paper)' : 'var(--ink-mute)',
                border: selected
                  ? '1px solid var(--ink)'
                  : '1px solid var(--rule-faint)',
              }}
            >
              <ModelLogo provider={MODELS[id].provider} size="sm" theme={selected ? 'dark' : 'light'} />
              {MODELS[id].name}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex gap-1.5 sm:gap-3 items-center flex-wrap${disabled ? ' pointer-events-none opacity-30' : ''}`}>
      {visibleModels.map((id) => {
        const selected = isSelected(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={[
              'flex items-center gap-1.5 text-[12px] sm:text-sm transition-all py-0.5',
              selected
                ? 'border-b-2 border-[var(--gold-dim)] text-white'
                : 'opacity-40 text-[var(--secondary-text)] hover:opacity-70',
            ].join(' ')}
          >
            <ModelLogo provider={MODELS[id].provider} size="md" />
            <span className={showNames ? 'inline' : 'hidden sm:inline'}>{MODELS[id].name}</span>
          </button>
        );
      })}
    </div>
  );
}
