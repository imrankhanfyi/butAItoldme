'use client';

import { useState, useEffect } from 'react';

interface ModelLogoProps {
  provider: string;
  size: 'sm' | 'md';
  theme?: 'dark' | 'light';
}

const PROVIDER_COLORS: Record<string, string> = {
  anthropic: '#d4a574',
  openai: '#74d4a5',
  google: '#74a5d4',
  mock: '#888',
};

const SIZE_CONFIG = {
  sm: { dimension: 16, fontSize: 10 },
  md: { dimension: 24, fontSize: 13 },
};

export default function ModelLogo({ provider, size, theme = 'dark' }: ModelLogoProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/logos/${provider}.svg`, { method: 'HEAD' })
      .then(r => { if (r.ok && !cancelled) setImgLoaded(true); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [provider]);

  const { dimension, fontSize } = SIZE_CONFIG[size];
  const color = PROVIDER_COLORS[provider] ?? '#666';
  const letter = provider.charAt(0).toUpperCase();

  if (imgLoaded) {
    return (
      <img
        src={`/logos/${provider}.svg`}
        alt=""
        aria-hidden="true"
        width={dimension}
        height={dimension}
        style={{
          display: 'inline-block',
          filter: theme === 'light' ? 'brightness(0)' : 'brightness(0) invert(1)',
          opacity: theme === 'light' ? 0.7 : 0.85,
        }}
      />
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dimension,
        height: dimension,
        borderRadius: '50%',
        backgroundColor: color,
        fontSize,
        fontWeight: 600,
        color: '#fff',
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {letter}
    </span>
  );
}
