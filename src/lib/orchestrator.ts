import { Session, SSEEvent } from './types';
import { LLMProvider } from './providers/types';
import { flipMessage } from './flip';

export const CHAT_SYSTEM_PROMPT = `Respond in 2-3 sentences. Never write more than 3 sentences total. No bullet points, lists, headers, or markdown. Plain prose only.`;

export async function* orchestrate(
  userMessage: string,
  subjectProvider: LLMProvider,
  flipProvider: LLMProvider,
  session: Session,
  prewrittenMirrorMessage?: string,
): AsyncGenerator<SSEEvent> {
  const userHistorySnapshot = [...session.userHistory];
  const mirrorHistorySnapshot = [...session.mirrorHistory];

  session.userHistory.push({ role: 'user', content: userMessage });

  if (prewrittenMirrorMessage) {
    // Turn 1 of a curated scenario: skip flip, stream left then right sequentially
    session.mirrorHistory.push({ role: 'user', content: prewrittenMirrorMessage });
    yield { type: 'flip', flippedMessage: prewrittenMirrorMessage };

    // Stream left fully first
    const leftGen = subjectProvider.stream(session.userHistory, CHAT_SYSTEM_PROMPT);
    let leftFull = '';
    for await (const token of leftGen) {
      leftFull += token;
      yield { type: 'left', token };
    }
    yield { type: 'left_done' };
    session.userHistory.push({ role: 'assistant', content: leftFull });

    // Stream right after left is done
    const rightGen = subjectProvider.stream(session.mirrorHistory, CHAT_SYSTEM_PROMPT);
    let rightFull = '';
    for await (const token of rightGen) {
      rightFull += token;
      yield { type: 'right', token };
    }
    session.mirrorHistory.push({ role: 'assistant', content: rightFull });
  } else {
    // Follow-up turn (or legacy): flip then stream sequentially
    const flipPromise = flipMessage(
      flipProvider,
      userMessage,
      userHistorySnapshot,
      mirrorHistorySnapshot,
    );

    // Stream left pane
    let leftFull = '';
    for await (const token of subjectProvider.stream(session.userHistory, CHAT_SYSTEM_PROMPT)) {
      leftFull += token;
      yield { type: 'left', token };
    }
    session.userHistory.push({ role: 'assistant', content: leftFull });

    // Wait for flip, then stream right pane
    const flippedMessage = await flipPromise;
    yield { type: 'flip', flippedMessage };

    session.mirrorHistory.push({ role: 'user', content: flippedMessage });

    let rightFull = '';
    for await (const token of subjectProvider.stream(session.mirrorHistory, CHAT_SYSTEM_PROMPT)) {
      rightFull += token;
      yield { type: 'right', token };
    }
    session.mirrorHistory.push({ role: 'assistant', content: rightFull });
  }

  yield { type: 'done' };
}
