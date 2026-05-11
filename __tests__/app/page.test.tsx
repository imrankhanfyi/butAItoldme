import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Home from '@/app/page';

const startScenario = vi.fn();
const handleNewChat = vi.fn();
const setModel = vi.fn();
const setInput = vi.fn();
const setActiveTab = vi.fn();
const setShowInputField = vi.fn();

vi.mock('@/hooks/useConversationController', () => ({
  useConversationController: () => ({
    model: 'claude-sonnet',
    setModel,
    sessionId: 'session-1',
    userMessages: [],
    mirrorMessages: [],
    input: '',
    setInput,
    isStreaming: false,
    leftStreaming: '',
    rightStreaming: '',
    mirrorStatus: '',
    rightRevealReady: true,
    rightChunksComplete: true,
    userChunksComplete: true,
    userTyping: false,
    leftAITyping: false,
    rightAITyping: false,
    mirrorUserTyping: false,
    leftTypingContent: null,
    leftTypingRole: 'user',
    rightTypingContent: null,
    rightTypingRole: 'user',
    streamError: '',
    activeTab: 'left',
    setActiveTab,
    activeScenario: null,
    showRevealCard: false,
    showInputField: false,
    highlightData: [],
    phaseLabel: 'Choose a scenario',
    handleScenarioSelect: startScenario,
    startScenario,
    handleNewChat,
    sendMessage: vi.fn(),
    handleKeyDown: vi.fn(),
    fastForwardCurrentPhase: vi.fn(),
    fastForwardAvailable: false,
    fastForwardPane: null,
    leftTitle: 'You',
    rightTitle: 'The Other Side 🪞',
    leftConnected: false,
    rightConnected: false,
    setShowInputField,
  }),
}));

describe('Home', () => {
  beforeEach(() => {
    startScenario.mockClear();
    handleNewChat.mockClear();
    setModel.mockClear();
    setInput.mockClear();
    setActiveTab.mockClear();
    setShowInputField.mockClear();
  });

  it('renders the new direct headline and no subtitle', () => {
    render(<Home />);
    expect(screen.getByText('Is your AI sycophantic?')).toBeTruthy();
    expect(screen.getByText('See Claude respond in real time to two sides of the same conflict.')).toBeTruthy();
    expect(screen.getByText('LIVE MODEL')).toBeTruthy();
    expect(screen.getByText('STEP 1 · PICK A SCENARIO')).toBeTruthy();
    expect(screen.getByText('Claude Sonnet 4.6')).toBeTruthy();
    expect(screen.getByText('fixed for every live conversation')).toBeTruthy();
    expect(screen.queryByText('GPT-4o')).toBeNull();
    expect(screen.queryByText('Gemini Flash 3.0')).toBeNull();
    expect(screen.queryByText('CLICK → TO RUN TEST')).toBeNull();
    expect(screen.queryByText('an AI safety demo')).toBeNull();
    expect(screen.getByText('LIVE DEMO')).toBeTruthy();
    expect(screen.getByText(/MAY 2026/)).toBeTruthy();
    expect(screen.getByText('by imrankhan.fyi →')).toBeTruthy();
    expect(screen.getByText('Did She Break the Med School Deal?')).toBeTruthy();
  });

  it('starts a scenario directly when a row is clicked', () => {
    render(<Home />);

    const scenarioRow = screen.getByText('Did She Break a Baby Promise?').closest('[role="button"]');
    expect(scenarioRow).toBeTruthy();
    expect(screen.queryByRole('button', { name: /test your ai/i })).toBeNull();

    fireEvent.click(scenarioRow!);
    expect(startScenario).toHaveBeenCalledOnce();
  });
});
