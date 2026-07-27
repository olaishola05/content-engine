/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

// 1. Mock Prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    brandProfile: {
      findUnique: vi.fn(),
    },
    generation: {
      findUnique: vi.fn(),
    },
    generationOutput: {
      findFirst: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// 2. Mock Auth
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

// 3. Mock Rate Limiter
vi.mock('@/lib/ratelimit', () => ({
  textGenRateLimit: {
    limit: vi.fn(),
  },
}));

// 4. Mock AI SDK
vi.mock('ai', () => ({
  streamObject: vi.fn(),
}));

vi.mock('@ai-sdk/anthropic', () => ({
  anthropic: vi.fn(),
  createAnthropic: vi.fn().mockReturnValue(vi.fn()),
}));

vi.mock('@/lib/ai-client', () => ({
  resolveAnthropicModel: vi.fn().mockResolvedValue({ model: vi.fn(), error: null }),
}));

// 5. Mock Skills Loader
vi.mock('@/lib/skills/loader', () => ({
  getSkillContent: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

describe('POST /api/generate/regenerate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key-1234';
  });

  const createMockRequest = (body: Record<string, any>) => {
    return new NextRequest('http://localhost/api/generate/regenerate', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  };

  it('returns 401 if user is unauthenticated', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const { POST } = await import('../route');
    const req = createMockRequest({
      generationId: 'gen_123',
      platform: 'X',
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 429 if rate limit is exceeded', async () => {
    const { auth } = await import('@/lib/auth');
    const { textGenRateLimit } = await import('@/lib/ratelimit');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(textGenRateLimit.limit).mockResolvedValueOnce({
      success: false,
      limit: 10,
      remaining: 0,
      reset: Date.now(),
    } as any);

    const { POST } = await import('../route');
    const req = createMockRequest({
      generationId: 'gen_123',
      platform: 'X',
    });

    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toContain('Too many requests');
  });

  it('returns 400 if request body has invalid parameters', async () => {
    const { auth } = await import('@/lib/auth');
    const { textGenRateLimit } = await import('@/lib/ratelimit');

    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(textGenRateLimit.limit).mockResolvedValue({
      success: true,
    } as any);

    const { POST } = await import('../route');
    
    // Missing platform
    const req1 = createMockRequest({
      generationId: 'gen_123',
    });
    const res1 = await POST(req1);
    expect(res1.status).toBe(400);

    // Invalid platform enum
    const req2 = createMockRequest({
      generationId: 'gen_123',
      platform: 'INVALID',
    });
    const res2 = await POST(req2);
    expect(res2.status).toBe(400);
  });

  it('returns 404 if the original generation is not found or does not belong to the user', async () => {
    const { auth } = await import('@/lib/auth');
    const { textGenRateLimit } = await import('@/lib/ratelimit');
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(textGenRateLimit.limit).mockResolvedValueOnce({
      success: true,
    } as any);
    vi.mocked(prisma.generation.findUnique).mockResolvedValueOnce(null);

    const { POST } = await import('../route');
    const req = createMockRequest({
      generationId: 'gen_123',
      platform: 'X',
    });

    const res = await POST(req);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toContain('Generation not found');
  });

  it('returns 400 if brand profile is missing', async () => {
    const { auth } = await import('@/lib/auth');
    const { textGenRateLimit } = await import('@/lib/ratelimit');
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(textGenRateLimit.limit).mockResolvedValueOnce({
      success: true,
    } as any);
    vi.mocked(prisma.generation.findUnique).mockResolvedValueOnce({
      id: 'gen_123',
      userId: 'user_123',
      inputText: 'content',
      inputType: 'LINKEDIN_POST',
      tone: 'educational',
      direction: 'SHORT',
    } as any);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce(null);

    const { POST } = await import('../route');
    const req = createMockRequest({
      generationId: 'gen_123',
      platform: 'X',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Brand profile not found');
  });

  it('successfully triggers streamObject and returns text stream on valid request', async () => {
    const { auth } = await import('@/lib/auth');
    const { textGenRateLimit } = await import('@/lib/ratelimit');
    const { prisma } = await import('@/lib/prisma');
    const { streamObject } = await import('ai');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(textGenRateLimit.limit).mockResolvedValueOnce({
      success: true,
    } as any);
    vi.mocked(prisma.generation.findUnique).mockResolvedValueOnce({
      id: 'gen_123',
      userId: 'user_123',
      inputText: 'Original content',
      inputType: 'LINKEDIN_POST',
      tone: 'educational',
      direction: 'SHORT',
    } as any);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({
      id: 'bp_123',
      brandName: 'My Brand',
    } as any);

    const mockResponse = new Response('stream data', { status: 200 });
    vi.mocked(streamObject).mockResolvedValueOnce({
      toTextStreamResponse: () => mockResponse,
    } as any);

    const { POST } = await import('../route');
    const req = createMockRequest({
      generationId: 'gen_123',
      platform: 'X',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(streamObject).toHaveBeenCalledOnce();
  });

  it('returns 400 if ANTHROPIC_API_KEY is missing', async () => {
    delete process.env.ANTHROPIC_API_KEY;

    const { auth } = await import('@/lib/auth');
    const { textGenRateLimit } = await import('@/lib/ratelimit');
    const { prisma } = await import('@/lib/prisma');
    const { resolveAnthropicModel } = await import('@/lib/ai-client');

    const missingKeyError = NextResponse.json(
      { error: 'Anthropic API key is missing. Please contact administrator to set ANTHROPIC_API_KEY.', code: 'MISSING_API_KEY' },
      { status: 400 }
    );
    vi.mocked(resolveAnthropicModel).mockResolvedValueOnce({ model: null, error: missingKeyError });

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({ user: { id: 'user_123' } } as any);
    vi.mocked(textGenRateLimit.limit).mockResolvedValueOnce({ success: true } as any);
    vi.mocked(prisma.generation.findUnique).mockResolvedValueOnce({
      id: 'gen_123',
      userId: 'user_123',
      inputText: 'c',
      inputType: 'LINKEDIN_POST',
      tone: 'educational',
    } as any);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({ id: 'bp', brandName: 'B' } as any);

    const { POST } = await import('../route');
    const req = createMockRequest({ generationId: 'gen_123', platform: 'X' });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.code).toBe('MISSING_API_KEY');
    expect(resolveAnthropicModel).toHaveBeenCalledWith('user_123');
  });

  it('uses BYOK decrypted key via resolveAnthropicModel for tester role', async () => {
    const { auth } = await import('@/lib/auth');
    const { textGenRateLimit } = await import('@/lib/ratelimit');
    const { prisma } = await import('@/lib/prisma');
    const { streamObject } = await import('ai');
    const { resolveAnthropicModel } = await import('@/lib/ai-client');

    const mockModel = vi.fn();
    vi.mocked(resolveAnthropicModel).mockResolvedValueOnce({ model: mockModel as any, error: null });

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({ user: { id: 'tester_123' } } as any);
    vi.mocked(textGenRateLimit.limit).mockResolvedValueOnce({ success: true } as any);
    vi.mocked(prisma.generation.findUnique).mockResolvedValueOnce({
      id: 'gen_123',
      userId: 'tester_123',
      inputText: 'content',
      inputType: 'LINKEDIN_POST',
      tone: 'educational',
    } as any);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({ id: 'bp_1', brandName: 'Tester' } as any);

    const mockResponse = new Response('stream', { status: 200 });
    vi.mocked(streamObject).mockResolvedValueOnce({ toTextStreamResponse: () => mockResponse } as any);

    const { POST } = await import('../route');
    const req = createMockRequest({ generationId: 'gen_123', platform: 'X' });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(resolveAnthropicModel).toHaveBeenCalledWith('tester_123');
  });

  it('returns error response when resolveAnthropicModel returns a decryption error', async () => {
    const { auth } = await import('@/lib/auth');
    const { textGenRateLimit } = await import('@/lib/ratelimit');
    const { prisma } = await import('@/lib/prisma');
    const { resolveAnthropicModel } = await import('@/lib/ai-client');

    const errorResponse = NextResponse.json({ error: 'Decryption failed', code: 'DECRYPTION_FAILED' }, { status: 500 });
    vi.mocked(resolveAnthropicModel).mockResolvedValueOnce({ model: null, error: errorResponse });

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({ user: { id: 'tester_456' } } as any);
    vi.mocked(textGenRateLimit.limit).mockResolvedValueOnce({ success: true } as any);
    vi.mocked(prisma.generation.findUnique).mockResolvedValueOnce({
      id: 'gen_123',
      userId: 'tester_456',
      inputText: 'c',
      inputType: 'LINKEDIN_POST',
      tone: 'educational',
    } as any);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({ id: 'bp_2', brandName: 'Bad' } as any);

    const { POST } = await import('../route');
    const req = createMockRequest({ generationId: 'gen_123', platform: 'X' });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.code).toBe('DECRYPTION_FAILED');
  });
});
