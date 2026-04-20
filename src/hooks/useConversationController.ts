'use client';

import type { KeyboardEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CHAT_PANE_HIGHLIGHTS_ENABLED, Highlight, fetchHighlights } from '@/lib/highlights';
import { Scenario } from '@/lib/scenarios';
import { splitIntoChunks, splitIntoSentences } from '@/lib/reveal-utils';
import {
  CHAT_PANE_TYPING_CPS,
  typewriterRevealChunks,
  typewriterRevealSentences,
} from '@/lib/typewriter-utils';
import {
  ChatRequest,
  ConversationSnapshot,
  Message,
  ModelId,
  SSEEvent,
} from '@/lib/types';

const STORAGE_KEY = 'butaitoldme-state-v1';
const SNAPSHOT_VERSION = 1;

type TypingRole = 'user' | 'assistant';
type RevealHandle = (() => void) & { finishNow?: () => void };

function buildSnapshot(args: {
  sessionId: string;
  model: ModelId;
  activeScenario: Scenario | null;
  userMessages: Message[];
  mirrorMessages: Message[];
  activeTab: 'left' | 'right';
  showInputField: boolean;
  showRevealCard: boolean;
}): ConversationSnapshot {
  return {
    version: SNAPSHOT_VERSION,
    sessionId: args.sessionId,
    model: args.model,
    activeScenarioId: args.activeScenario?.id ?? null,
    userMessages: args.userMessages,
    mirrorMessages: args.mirrorMessages,
    activeTab: args.activeTab,
    showInputField: args.showInputField,
    showRevealCard: args.showRevealCard,
  };
}

function defaultPhaseLabel(args: {
  userMessages: Message[];
  mirrorMessages: Message[];
  isStreaming: boolean;
  rightRevealReady: boolean;
  rightChunksComplete: boolean;
  userChunksComplete: boolean;
  mirrorStatus: string;
  leftAITyping: boolean;
  rightAITyping: boolean;
  showRevealCard: boolean;
  streamError: string;
}): string {
  if (args.streamError) return 'Error';
  if (!args.userMessages.length && !args.mirrorMessages.length && !args.isStreaming && !args.showRevealCard) {
    return 'Choose a scenario';
  }
  if (args.showRevealCard && !args.isStreaming) return 'Done';
  if (args.mirrorStatus) return 'Rewriting perspective';
  if (args.isStreaming && !args.userChunksComplete) return 'Listening';
  if (args.isStreaming && args.rightRevealReady && !args.rightChunksComplete) return 'Revealing the other side';
  if (args.leftAITyping || args.rightAITyping) return 'Typing';
  if (args.isStreaming) return 'Streaming';
  return 'Conversation ready';
}

export interface ConversationController {
  model: ModelId;
  setModel: (model: ModelId) => void;
  sessionId: string;
  userMessages: Message[];
  mirrorMessages: Message[];
  input: string;
  setInput: (value: string) => void;
  isStreaming: boolean;
  leftStreaming: string;
  rightStreaming: string;
  mirrorStatus: string;
  rightRevealReady: boolean;
  rightChunksComplete: boolean;
  userChunksComplete: boolean;
  userTyping: boolean;
  leftAITyping: boolean;
  rightAITyping: boolean;
  mirrorUserTyping: boolean;
  leftTypingContent: string | null;
  leftTypingRole: TypingRole;
  rightTypingContent: string | null;
  rightTypingRole: TypingRole;
  streamError: string;
  activeTab: 'left' | 'right';
  setActiveTab: (tab: 'left' | 'right') => void;
  activeScenario: Scenario | null;
  showRevealCard: boolean;
  showInputField: boolean;
  highlightData: Highlight[];
  phaseLabel: string;
  handleScenarioSelect: (scenario: Scenario) => void;
  startScenario: (scenario: Scenario) => void;
  handleNewChat: () => void;
  sendMessage: (message: string, personBMessage?: string) => Promise<void>;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  fastForwardCurrentPhase: () => void;
  fastForwardAvailable: boolean;
  fastForwardPane: 'left' | 'right' | null;
  leftTitle: string;
  rightTitle: string;
  leftConnected: boolean;
  rightConnected: boolean;
  setShowInputField: (value: boolean) => void;
}

export function useConversationController(): ConversationController {
  const [model, setModel] = useState<ModelId>('gemini-flash-3');
  const [sessionId, setSessionId] = useState<string>('');
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  const [mirrorMessages, setMirrorMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [leftStreaming, setLeftStreaming] = useState('');
  const [rightStreaming, setRightStreaming] = useState('');
  const [mirrorStatus, setMirrorStatus] = useState('');
  const [rightRevealReady, setRightRevealReady] = useState(true);
  const [rightChunksComplete, setRightChunksComplete] = useState(true);
  const [userChunksComplete, setUserChunksComplete] = useState(true);
  const [userTyping, setUserTyping] = useState(false);
  const [leftAITyping, setLeftAITyping] = useState(false);
  const [rightAITyping, setRightAITyping] = useState(false);
  const [mirrorUserTyping, setMirrorUserTyping] = useState(false);
  const [leftTypingContent, setLeftTypingContent] = useState<string | null>(null);
  const [leftTypingRole, setLeftTypingRole] = useState<TypingRole>('user');
  const [rightTypingContent, setRightTypingContent] = useState<string | null>(null);
  const [rightTypingRole, setRightTypingRole] = useState<TypingRole>('user');
  const [streamError, setStreamError] = useState('');
  const [activeTab, setActiveTab] = useState<'left' | 'right'>('left');
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [showRevealCard, setShowRevealCard] = useState(false);
  const [showInputField, setShowInputField] = useState(false);
  const [highlightData, setHighlightData] = useState<Highlight[]>([]);
  const [fastForwardAvailable, setFastForwardAvailable] = useState(false);
  const [fastForwardPane, setFastForwardPane] = useState<'left' | 'right' | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const pendingCompletionRef = useRef<{ leftFull: string; rightFull: string } | null>(null);
  const pendingRightAIRef = useRef<string | null>(null);
  const pendingFollowUpFlipRef = useRef<string | null>(null);
  const rightChunksRevealedRef = useRef(true);
  const userChunksCompleteRef = useRef(true);
  const bChunksRef = useRef<string[]>([]);
  const leftDoneRef = useRef(false);
  const flowIdRef = useRef(0);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cancelRefs = useRef<Array<() => void>>([]);
  const activeRevealHandleRef = useRef<RevealHandle | null>(null);
  const userMessagesRef = useRef(userMessages);
  const mirrorMessagesRef = useRef(mirrorMessages);
  const hydratedRef = useRef(false);

  useEffect(() => {
    userMessagesRef.current = userMessages;
  }, [userMessages]);

  useEffect(() => {
    mirrorMessagesRef.current = mirrorMessages;
  }, [mirrorMessages]);

  const clearTimers = useCallback(() => {
    for (const timer of timerRefs.current) clearTimeout(timer);
    timerRefs.current = [];
  }, []);

  const clearCancelers = useCallback(() => {
    for (const cancel of cancelRefs.current) cancel();
    cancelRefs.current = [];
  }, []);

  const clearFlowArtifacts = useCallback(() => {
    clearTimers();
    clearCancelers();
    activeRevealHandleRef.current = null;
    setFastForwardAvailable(false);
    setFastForwardPane(null);
    pendingFollowUpFlipRef.current = null;
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, [clearCancelers, clearTimers]);

  const nextFlowId = useCallback(() => {
    flowIdRef.current += 1;
    return flowIdRef.current;
  }, []);

  const isCurrentFlow = useCallback((flowId: number) => flowIdRef.current === flowId, []);

  const schedule = useCallback(
    (flowId: number, fn: () => void, delayMs: number) => {
      const timer = setTimeout(() => {
        timerRefs.current = timerRefs.current.filter((id) => id !== timer);
        if (isCurrentFlow(flowId)) fn();
      }, delayMs);
      timerRefs.current.push(timer);
      return timer;
    },
    [isCurrentFlow],
  );

  const registerCancel = useCallback((cancel: () => void) => {
    cancelRefs.current.push(cancel);
  }, []);

  const setActiveRevealHandle = useCallback((handle: RevealHandle | null) => {
    activeRevealHandleRef.current = handle;
    setFastForwardAvailable(!!handle);
  }, []);

  const fastForwardCurrentPhase = useCallback(() => {
    const handle = activeRevealHandleRef.current;
    if (!handle) return;
    activeRevealHandleRef.current = null;
    setFastForwardAvailable(false);
    handle.finishNow?.();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore storage failures
      }
    }
    setSessionId(uuidv4());
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current || typeof window === 'undefined' || !sessionId) return;
    try {
      const snapshot = buildSnapshot({
        sessionId,
        model,
        activeScenario,
        userMessages,
        mirrorMessages,
        activeTab,
        showInputField,
        showRevealCard,
      });
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // ignore storage failures
    }
  }, [
    activeScenario,
    activeTab,
    model,
    mirrorMessages,
    sessionId,
    showInputField,
    showRevealCard,
    userMessages,
  ]);

  // Commit right AI only after right user chunks have been revealed
  const commitPendingRightAI = useCallback(
    (flowId: number) => {
      if (!isCurrentFlow(flowId)) return;
      if (pendingRightAIRef.current !== null && rightChunksRevealedRef.current) {
        const rightFull = pendingRightAIRef.current;
        pendingRightAIRef.current = null;
        setRightTypingRole('assistant');
        const cancel = typewriterRevealSentences(
          splitIntoSentences(rightFull),
          (text) => {
            if (!isCurrentFlow(flowId)) return;
            setRightTypingContent(text !== '' ? text : null);
          },
          (sentence) => {
            if (!isCurrentFlow(flowId)) return;
            setMirrorMessages((prev) => [...prev, { role: 'assistant', content: sentence }]);
          },
          () => {
            if (!isCurrentFlow(flowId)) return;
            setRightTypingContent(null);
            setShowRevealCard(true);
            setActiveRevealHandle(null);
            setFastForwardPane(null);
          },
          CHAT_PANE_TYPING_CPS,
        );
        setActiveRevealHandle(cancel as RevealHandle);
        registerCancel(cancel);
      }
    },
    [isCurrentFlow, registerCancel, setActiveRevealHandle],
  );

  const startFollowUpRightPhase = useCallback(
    (flowId: number) => {
      if (!isCurrentFlow(flowId)) return;
      const flippedMessage = pendingFollowUpFlipRef.current;
      if (flippedMessage) {
        setMirrorMessages((prev) => [...prev, { role: 'user', content: flippedMessage }]);
        pendingFollowUpFlipRef.current = null;
      }
      rightChunksRevealedRef.current = true;
      setRightChunksComplete(true);
      setRightRevealReady(true);
      setFastForwardPane('right');
      commitPendingRightAI(flowId);
    },
    [commitPendingRightAI, isCurrentFlow],
  );

  // Commit buffered completion + trigger right reveal when chunks finish displaying
  useEffect(() => {
    userChunksCompleteRef.current = userChunksComplete;
    if (!userChunksComplete) return;

    const flowId = flowIdRef.current;
    if (pendingCompletionRef.current) {
      const { leftFull, rightFull } = pendingCompletionRef.current;
      pendingCompletionRef.current = null;
      pendingRightAIRef.current = rightFull;
      setLeftAITyping(true);
      schedule(flowId, () => {
        setLeftAITyping(false);
        setLeftTypingRole('assistant');
        const cancel = typewriterRevealSentences(
          splitIntoSentences(leftFull),
          (text) => {
            if (!isCurrentFlow(flowId)) return;
            setLeftTypingContent(text !== '' ? text : null);
          },
          (sentence) => {
            if (!isCurrentFlow(flowId)) return;
            setUserMessages((prev) => [...prev, { role: 'assistant', content: sentence }]);
          },
          () => {
            if (!isCurrentFlow(flowId)) return;
            setLeftTypingContent(null);
            const hasFollowUpFlip = !!pendingFollowUpFlipRef.current;
            if (hasFollowUpFlip) {
              startFollowUpRightPhase(flowId);
            } else {
              schedule(flowId, () => setRightRevealReady(true), 800);
              setActiveRevealHandle(null);
              setFastForwardPane(null);
            }
          },
          CHAT_PANE_TYPING_CPS,
        );
        setActiveRevealHandle(cancel as RevealHandle);
        registerCancel(cancel);
      }, 800);
    }
  }, [isCurrentFlow, registerCancel, schedule, userChunksComplete]);

  // Reveal right chunks when rightRevealReady fires
  useEffect(() => {
    if (!rightRevealReady) return;
    const chunks = bChunksRef.current;
    if (!chunks.length) return;
    const flowId = flowIdRef.current;
    bChunksRef.current = [];
    setRightChunksComplete(false);
    setFastForwardPane('right');

    const finishChunks = () => {
      if (!isCurrentFlow(flowId)) return;
      rightChunksRevealedRef.current = true;
      setRightChunksComplete(true);
      setRightAITyping(true);
      schedule(flowId, () => {
        setRightAITyping(false);
        commitPendingRightAI(flowId);
      }, 800);
    };

    setRightTypingRole('user');
    const cancel = typewriterRevealChunks(
      chunks,
      (text) => {
        if (!isCurrentFlow(flowId)) return;
        setRightTypingContent(text !== '' ? text : null);
      },
      (sentence) => {
        if (!isCurrentFlow(flowId)) return;
        setMirrorMessages((prev) => [...prev, { role: 'user', content: sentence }]);
      },
      () => {
        if (!isCurrentFlow(flowId)) return;
        setRightTypingContent(null);
        finishChunks();
      },
      CHAT_PANE_TYPING_CPS,
    );
    setActiveRevealHandle(cancel as RevealHandle);
    registerCancel(cancel);
  }, [commitPendingRightAI, isCurrentFlow, registerCancel, rightRevealReady, schedule, setActiveRevealHandle]);

  // Auto-switch to right tab on mobile when right pane visually starts revealing
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 640) return;
    if (rightRevealReady && (rightStreaming || !rightChunksComplete)) setActiveTab('right');
  }, [rightChunksComplete, rightRevealReady, rightStreaming]);

  useEffect(() => {
    if (!CHAT_PANE_HIGHLIGHTS_ENABLED || !showRevealCard) return;
    const leftAI = userMessages.filter((message) => message.role === 'assistant').map((message) => message.content).join(' ');
    const rightAI = mirrorMessages.filter((message) => message.role === 'assistant').map((message) => message.content).join(' ');
    if (leftAI && rightAI) {
      fetchHighlights(leftAI, rightAI).then(setHighlightData);
    }
  }, [mirrorMessages, showRevealCard, userMessages]);

  const sendMessage = useCallback(
    async (message: string, personBMessage?: string) => {
      if (!message.trim() || isStreaming || !sessionId) return;

      const flowId = nextFlowId();
      clearFlowArtifacts();
      setStreamError('');
      setLeftStreaming('');
      setRightStreaming('');
      setLeftTypingContent(null);
      setRightTypingContent(null);
      setShowRevealCard(false);
      setHighlightData([]);
      setFastForwardPane('left');
      pendingFollowUpFlipRef.current = null;

      const existingUserMessages = userMessagesRef.current;
      const existingMirrorMessages = mirrorMessagesRef.current;
      const isEmpty = existingUserMessages.length === 0;
      const activeSessionId = isEmpty ? uuidv4() : sessionId;

      if (isEmpty) {
        setSessionId(activeSessionId);
      }

      setIsStreaming(true);

      if (personBMessage) {
        setRightRevealReady(false);
        setRightChunksComplete(false);
        setUserChunksComplete(false);
        setUserTyping(false);
        setLeftAITyping(false);
        setRightAITyping(false);
        setMirrorUserTyping(false);
        leftDoneRef.current = false;
        rightChunksRevealedRef.current = false;

        const aChunks = splitIntoChunks(message);
        const bChunks = splitIntoChunks(personBMessage);
        bChunksRef.current = bChunks;

        setLeftTypingRole('user');
        const cancel = typewriterRevealChunks(
          aChunks,
          (text) => {
            if (!isCurrentFlow(flowId)) return;
            setLeftTypingContent(text !== '' ? text : null);
          },
          (sentence) => {
            if (!isCurrentFlow(flowId)) return;
            setUserMessages((prev) => [...prev, { role: 'user', content: sentence }]);
          },
          () => {
            if (!isCurrentFlow(flowId)) return;
            setLeftTypingContent(null);
            setUserChunksComplete(true);
            setActiveRevealHandle(null);
          },
          CHAT_PANE_TYPING_CPS,
        );
        setActiveRevealHandle(cancel as RevealHandle);
        registerCancel(cancel);
      } else {
        setUserChunksComplete(true);
        setRightRevealReady(false);
        setRightChunksComplete(false);
        rightChunksRevealedRef.current = false;
        setMirrorStatus('Flipping perspective...');
        setUserMessages((prev) => [...prev, { role: 'user', content: message }]);
      }

      setInput('');
      setActiveTab('left');

      abortRef.current = new AbortController();

      const requestBody: ChatRequest = {
        message,
        model,
        sessionId: activeSessionId,
        ...(personBMessage ? { personBMessage } : {}),
        userHistory: existingUserMessages,
        mirrorHistory: existingMirrorMessages,
      };

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: abortRef.current.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let leftFull = '';
        let rightFull = '';
        let lineBuffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = lineBuffer + decoder.decode(value, { stream: true });
          const lines = text.split('\n');
          lineBuffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const json = line.slice(6);
            if (!json) continue;

            let event: SSEEvent;
            try {
              event = JSON.parse(json);
            } catch {
              console.error('Failed to parse SSE event:', json);
              continue;
            }

            switch (event.type) {
              case 'left':
                leftFull += event.token;
                setLeftStreaming(leftFull);
                break;
              case 'flip':
                if (!personBMessage) {
                  pendingFollowUpFlipRef.current = event.flippedMessage;
                }
                break;
              case 'right':
                rightFull += event.token;
                setRightStreaming(rightFull);
                break;
              case 'left_done':
                leftDoneRef.current = true;
                if (
                  userChunksCompleteRef.current &&
                  !pendingFollowUpFlipRef.current &&
                  !bChunksRef.current.length
                ) {
                  schedule(flowId, () => setRightRevealReady(true), 800);
                }
                break;
              case 'done': {
                if (userChunksCompleteRef.current) {
                  setLeftTypingRole('assistant');
                  const cancel = typewriterRevealSentences(
                    splitIntoSentences(leftFull),
                    (text) => {
                      if (!isCurrentFlow(flowId)) return;
                      setLeftTypingContent(text !== '' ? text : null);
                    },
                    (sentence) => {
                      if (!isCurrentFlow(flowId)) return;
                      setUserMessages((prev) => [...prev, { role: 'assistant', content: sentence }]);
                    },
                    () => {
                      if (!isCurrentFlow(flowId)) return;
                      setLeftTypingContent(null);
                      const hasFollowUpFlip = !!pendingFollowUpFlipRef.current;
                      if (hasFollowUpFlip) {
                        startFollowUpRightPhase(flowId);
                      } else {
                        schedule(flowId, () => setRightRevealReady(true), 800);
                        setActiveRevealHandle(null);
                        setFastForwardPane(null);
                      }
                    },
                    CHAT_PANE_TYPING_CPS,
                  );
                  setActiveRevealHandle(cancel as RevealHandle);
                  registerCancel(cancel);
                  pendingRightAIRef.current = rightFull;
                  if (!pendingFollowUpFlipRef.current) {
                    commitPendingRightAI(flowId);
                  }
                } else {
                  pendingCompletionRef.current = { leftFull, rightFull };
                }
                setLeftStreaming('');
                setRightStreaming('');
                break;
              }
              case 'error':
                setStreamError(event.message);
                console.error('Stream error:', event.message);
                break;
            }
          }
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Chat error:', error);
          setStreamError('Something went wrong. Please try again.');
        }
      } finally {
        setIsStreaming(false);
        setMirrorStatus('');
      }
    },
    [
      clearFlowArtifacts,
      commitPendingRightAI,
      isCurrentFlow,
      isStreaming,
      model,
      nextFlowId,
      registerCancel,
      schedule,
      sessionId,
      userChunksCompleteRef,
    ],
  );

  const startScenario = useCallback(
    (scenario: Scenario) => {
      setActiveScenario(scenario);
      void sendMessage(scenario.personA, scenario.personB);
    },
    [sendMessage],
  );

  const handleNewChat = useCallback(() => {
    clearFlowArtifacts();
    nextFlowId();
    setUserMessages([]);
    setMirrorMessages([]);
    setLeftStreaming('');
    setRightStreaming('');
    const freshSessionId = uuidv4();
    setSessionId(freshSessionId);
    setInput('');
    setActiveTab('left');
    setActiveScenario(null);
    setStreamError('');
    setLeftAITyping(false);
    setRightAITyping(false);
    setMirrorUserTyping(false);
    setLeftTypingContent(null);
    setRightTypingContent(null);
    pendingCompletionRef.current = null;
    pendingRightAIRef.current = null;
    pendingFollowUpFlipRef.current = null;
    rightChunksRevealedRef.current = true;
    bChunksRef.current = [];
    leftDoneRef.current = false;
    setRightChunksComplete(true);
    setRightRevealReady(true);
    setUserChunksComplete(true);
    setShowRevealCard(false);
    setShowInputField(false);
    setHighlightData([]);
    setMirrorStatus('');
    setFastForwardPane(null);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, [clearFlowArtifacts, nextFlowId]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        void sendMessage(input);
      }
    },
    [input, sendMessage],
  );

  const leftTitle = activeScenario ? activeScenario.personALabel : 'You';
  const rightTitle = activeScenario ? activeScenario.personBLabel : 'The Other Side 🪞';
  const leftConnected =
    leftAITyping ||
    leftStreaming.length > 0 ||
    (leftTypingRole === 'assistant' && (leftTypingContent !== null || isStreaming));
  const rightConnected =
    rightAITyping ||
    rightStreaming.length > 0 ||
    (rightTypingRole === 'assistant' && (rightTypingContent !== null || isStreaming));
  const phaseLabel = useMemo(
    () =>
      defaultPhaseLabel({
        userMessages,
        mirrorMessages,
        isStreaming,
        rightRevealReady,
        rightChunksComplete,
        userChunksComplete,
        mirrorStatus,
        leftAITyping,
        rightAITyping,
        showRevealCard,
        streamError,
      }),
    [
      isStreaming,
      leftAITyping,
      mirrorMessages,
      mirrorStatus,
      rightAITyping,
      rightChunksComplete,
      rightRevealReady,
      showRevealCard,
      streamError,
      userChunksComplete,
      userMessages,
    ],
  );

  return {
    model,
    setModel,
    sessionId,
    userMessages,
    mirrorMessages,
    input,
    setInput,
    isStreaming,
    leftStreaming,
    rightStreaming,
    mirrorStatus,
    rightRevealReady,
    rightChunksComplete,
    userChunksComplete,
    userTyping,
    leftAITyping,
    rightAITyping,
    mirrorUserTyping,
    leftTypingContent,
    leftTypingRole,
    rightTypingContent,
    rightTypingRole,
    streamError,
    activeTab,
    setActiveTab,
    activeScenario,
    showRevealCard,
    showInputField,
    highlightData,
    phaseLabel,
    handleScenarioSelect: startScenario,
    startScenario,
    handleNewChat,
    sendMessage,
    handleKeyDown,
    fastForwardCurrentPhase,
    fastForwardAvailable,
    fastForwardPane,
    leftTitle,
    rightTitle,
    leftConnected,
    rightConnected,
    setShowInputField,
  };
}
