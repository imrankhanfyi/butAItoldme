import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useConversationController } from '@/hooks/useConversationController';

vi.mock('@/lib/highlights', () => ({
  CHAT_PANE_HIGHLIGHTS_ENABLED: false,
  fetchHighlights: vi.fn(),
}));

const STORAGE_KEY = 'butaitoldme-state-v1';
const originalLocalStorage = Object.getOwnPropertyDescriptor(window, 'localStorage');

describe('useConversationController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const storage = {
      getItem: vi.fn((key: string) => (key === STORAGE_KEY ? '{"version":1}' : null)),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: storage,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    if (originalLocalStorage) {
      Object.defineProperty(window, 'localStorage', originalLocalStorage);
    }
  });

  it('always starts from the landing state even if a snapshot exists', async () => {
    const { result } = renderHook(() => useConversationController());

    await waitFor(() => {
      expect(result.current.sessionId).not.toBe('');
    });

    expect(result.current.userMessages).toEqual([]);
    expect(result.current.mirrorMessages).toEqual([]);
    expect(result.current.activeTab).toBe('left');
    expect(result.current.activeScenario).toBeNull();
    expect(result.current.showInputField).toBe(false);
    expect(result.current.showRevealCard).toBe(false);
    expect(result.current.phaseLabel).toBe('Choose a scenario');
    expect(result.current.model).toBe('claude-sonnet');
    expect(window.localStorage.getItem).not.toHaveBeenCalled();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
  });
});
