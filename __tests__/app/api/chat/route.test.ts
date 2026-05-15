import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getProvider: vi.fn(() => ({ stream: vi.fn(), complete: vi.fn() })),
  getFlipProvider: vi.fn(() => ({ stream: vi.fn(), complete: vi.fn() })),
  orchestrate: vi.fn(async function* () {
    yield { type: 'done' as const };
  }),
}));

vi.mock('@/lib/providers', () => ({
  getProvider: mocks.getProvider,
  getFlipProvider: mocks.getFlipProvider,
}));

vi.mock('@/lib/orchestrator', () => ({
  orchestrate: mocks.orchestrate,
}));

import { POST } from '@/app/api/chat/route';

describe('POST /api/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('accepts the Claude product model', async () => {
    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello',
        model: 'claude-sonnet',
        sessionId: 'session-1',
      }),
    });

    const response = await POST(request as never);

    expect(response.status).toBe(200);
    expect(mocks.getProvider).toHaveBeenCalledWith('claude-sonnet');
    expect(mocks.getFlipProvider).toHaveBeenCalledWith('claude-sonnet');
  });

  it('rejects legacy product model ids', async () => {
    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello',
        model: 'gpt-4',
        sessionId: 'session-1',
      }),
    });

    const response = await POST(request as never);

    expect(response.status).toBe(400);
    await expect(response.text()).resolves.toBe('Invalid model: gpt-4');
    expect(mocks.getProvider).not.toHaveBeenCalled();
  });
});
