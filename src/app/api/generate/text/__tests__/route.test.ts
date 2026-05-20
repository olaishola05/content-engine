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
}));

// 5. Mock Skills Loader
vi.mock('@/lib/skills/loader', () => ({
  getSkillContent: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

describe('POST /api/generate/text', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key-1234';
  });

  const createMockRequest = (body: Record<string, any>) => {
    return new NextRequest('http://localhost/api/generate/text', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  };

  it('returns 401 if user is unauthenticated', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const { POST } = await import('../route');
    const req = createMockRequest({
      inputText: 'AI content',
      inputType: 'LINKEDIN_POST',
      platforms: ['X'],
      tone: 'educational',
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
      inputText: 'AI content',
      inputType: 'LINKEDIN_POST',
      platforms: ['X'],
      tone: 'educational',
    });

    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toContain('Too many requests');
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
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce(null);

    const { POST } = await import('../route');
    const req = createMockRequest({
      inputText: 'AI content',
      inputType: 'LINKEDIN_POST',
      platforms: ['X'],
      tone: 'educational',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Brand profile not found');
  });

  it('returns 400 if ANTHROPIC_API_KEY is missing', async () => {
    delete process.env.ANTHROPIC_API_KEY;

    const { auth } = await import('@/lib/auth');
    const { textGenRateLimit } = await import('@/lib/ratelimit');
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(textGenRateLimit.limit).mockResolvedValueOnce({
      success: true,
    } as any);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({
      id: 'bp_123',
      brandName: 'My Brand',
    } as any);

    const { POST } = await import('../route');
    const req = createMockRequest({
      inputText: 'AI content',
      inputType: 'LINKEDIN_POST',
      platforms: ['X'],
      tone: 'educational',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.code).toBe('MISSING_API_KEY');
  });

  it('returns 400 if request body has invalid parameters', async () => {
    const { auth } = await import('@/lib/auth');
    const { textGenRateLimit } = await import('@/lib/ratelimit');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(textGenRateLimit.limit).mockResolvedValueOnce({
      success: true,
    } as any);

    const { POST } = await import('../route');
    
    // Missing platforms and tone
    const req = createMockRequest({
      inputText: 'AI content',
      inputType: 'LINKEDIN_POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
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
      inputText: 'Original content to repurpose',
      inputType: 'LINKEDIN_POST',
      platforms: ['X', 'LINKEDIN'],
      tone: 'educational',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(streamObject).toHaveBeenCalledOnce();
  });
});
