/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// 1. Mock Prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    brandProfile: {
      findUnique: vi.fn(),
    },
    generation: {
      findUnique: vi.fn(),
      create: vi.fn().mockResolvedValue({ id: 'gen_123' }),
    },
    generationOutput: {
      create: vi.fn().mockResolvedValue({ id: 'out_123' }),
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
  visualExportRateLimit: {
    limit: vi.fn(),
  },
}));

// 4. Mock AI SDK
vi.mock('ai', () => ({
  generateObject: vi.fn(),
}));

vi.mock('@ai-sdk/anthropic', () => ({
  anthropic: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

describe('POST /api/generate/impact-card', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key-1234';
  });

  const createMockRequest = (body: Record<string, any>) => {
    return new NextRequest('http://localhost/api/generate/impact-card', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  };

  it('returns 401 if user is unauthenticated', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const { POST } = await import('../route');
    const req = createMockRequest({
      inputText: 'Some content',
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 429 if rate limit is exceeded', async () => {
    const { auth } = await import('@/lib/auth');
    const { visualExportRateLimit } = await import('@/lib/ratelimit');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(visualExportRateLimit.limit).mockResolvedValueOnce({
      success: false,
    } as any);

    const { POST } = await import('../route');
    const req = createMockRequest({
      inputText: 'Some content',
    });

    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toContain('Too many requests');
  });

  it('returns 400 if validation fails', async () => {
    const { auth } = await import('@/lib/auth');
    const { visualExportRateLimit } = await import('@/lib/ratelimit');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(visualExportRateLimit.limit).mockResolvedValueOnce({
      success: true,
    } as any);

    const { POST } = await import('../route');
    const req = createMockRequest({
      // missing inputText
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid parameters');
  });

  it('successfully generates impact statements and returns JSON', async () => {
    const { auth } = await import('@/lib/auth');
    const { visualExportRateLimit } = await import('@/lib/ratelimit');
    const { prisma } = await import('@/lib/prisma');
    const { generateObject } = await import('ai');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(visualExportRateLimit.limit).mockResolvedValueOnce({
      success: true,
    } as any);
    vi.mocked(prisma.generation.findUnique).mockResolvedValueOnce({
      id: 'gen_123',
      userId: 'user_123',
      inputText: 'Some content',
    } as any);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({
      id: 'bp_123',
      brandName: 'Test Brand',
    } as any);

    const mockStatements = ['Statement 1', 'Statement 2', 'Statement 3'];
    vi.mocked(generateObject).mockResolvedValueOnce({
      object: { statements: mockStatements },
    } as any);

    const { POST } = await import('../route');
    const req = createMockRequest({
      inputText: 'Some content',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.statements).toEqual(mockStatements);
    expect(generateObject).toHaveBeenCalledOnce();
  });
});
