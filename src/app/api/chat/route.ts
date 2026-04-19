import { NextRequest } from 'next/server';
import { ChatRequest, Message, ModelId, MODELS, Session } from '@/lib/types';
import { getProvider, getFlipProvider } from '@/lib/providers';
import { orchestrate } from '@/lib/orchestrator';

const MAX_MESSAGES = 100;
const MAX_MESSAGE_LENGTH = 4000;

function validateMessages(messages: unknown): Message[] {
  if (!Array.isArray(messages)) return [];
  const validated = messages.filter((message): message is Message => {
    return (
      !!message &&
      typeof message === 'object' &&
      (message as Message).role !== undefined &&
      ((message as Message).role === 'user' || (message as Message).role === 'assistant') &&
      typeof (message as Message).content === 'string' &&
      (message as Message).content.length <= MAX_MESSAGE_LENGTH
    );
  });
  return validated.slice(0, MAX_MESSAGES);
}

export async function POST(request: NextRequest) {
  let body: ChatRequest;
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { message, model, sessionId, personBMessage } = body;

  if (!message || !model || !sessionId) {
    return new Response('Missing required fields: message, model, sessionId', { status: 400 });
  }

  if (!MODELS[model as ModelId]) {
    return new Response(`Invalid model: ${model}`, { status: 400 });
  }

  const userHistory = validateMessages(body.userHistory);
  const mirrorHistory = validateMessages(body.mirrorHistory);

  let subjectProvider: ReturnType<typeof getProvider>;
  let flipProvider: ReturnType<typeof getFlipProvider>;
  try {
    subjectProvider = getProvider(model);
    flipProvider = getFlipProvider(model);
  } catch (error) {
    const raw = error instanceof Error ? error.message : 'Provider configuration error';
    return new Response(raw, { status: 503 });
  }

  const session: Session = {
    id: sessionId,
    model: model as ModelId,
    userHistory,
    mirrorHistory,
    lastActive: Date.now(),
  };

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of orchestrate(message, subjectProvider, flipProvider, session, personBMessage)) {
          const data = JSON.stringify(event);
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
      } catch (error) {
        const raw = error instanceof Error ? error.message : 'Unknown error';
        const msg =
          raw.toLowerCase().includes('json') || raw.toLowerCase().includes('parse')
            ? 'Connection hiccup — please try again'
            : raw;
        const errorEvent = JSON.stringify({ type: 'error', message: msg });
        controller.enqueue(encoder.encode(`data: ${errorEvent}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
