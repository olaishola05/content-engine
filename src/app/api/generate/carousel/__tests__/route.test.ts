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

// 3. Mock Rate Limiter (visual for exports)
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
  createAnthropic: vi.fn().mockReturnValue(vi.fn()),
}));

vi.mock('@/lib/ai-client', () => ({
  resolveAnthropicModel: vi.fn().mockResolvedValue({ model: vi.fn(), error: null }),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

describe('POST /api/generate/carousel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key-1234';
  });

  const createMockRequest = (body: Record<string, any>) => {
    return new NextRequest('http://localhost/api/generate/carousel', {
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
      carouselType: 'instagram',
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
      carouselType: 'instagram',
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
      carouselType: 'instagram',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid parameters');
  });

  it('successfully generates carousel copy and returns JSON', async () => {
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

    const mockSlides = ['Slide 1', 'Slide 2'];
    vi.mocked(generateObject).mockResolvedValueOnce({
      object: { slides: mockSlides },
    } as any);

    const { POST } = await import('../route');
    const req = createMockRequest({
      inputText: 'Some content',
      carouselType: 'instagram',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.slides).toEqual(mockSlides);
    expect(generateObject).toHaveBeenCalledOnce();
  });

  it('returns 400 if ANTHROPIC_API_KEY is missing', async () => {
    delete process.env.ANTHROPIC_API_KEY;

    const { auth } = await import('@/lib/auth');
    const { visualExportRateLimit } = await import('@/lib/ratelimit');
    const { prisma } = await import('@/lib/prisma');
    const { resolveAnthropicModel } = await import('@/lib/ai-client');

    const missingKeyError = NextResponse.json(
      { error: 'Anthropic API key is missing. Please contact administrator to set ANTHROPIC_API_KEY.', code: 'MISSING_API_KEY' },
      { status: 400 }
    );
    vi.mocked(resolveAnthropicModel).mockResolvedValueOnce({ model: null, error: missingKeyError });

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({ user: { id: 'user_123' } } as any);
    vi.mocked(visualExportRateLimit.limit).mockResolvedValueOnce({ success: true } as any);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({ id: 'bp_123', brandName: 'Test Brand' } as any);

    const { POST } = await import('../route');
    const req = createMockRequest({ inputText: 'Some content', carouselType: 'instagram' });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.code).toBe('MISSING_API_KEY');
    expect(resolveAnthropicModel).toHaveBeenCalledWith('user_123');
  });

  it('uses BYOK decrypted key via resolveAnthropicModel for tester role', async () => {
    const { auth } = await import('@/lib/auth');
    const { visualExportRateLimit } = await import('@/lib/ratelimit');
    const { prisma } = await import('@/lib/prisma');
    const { generateObject } = await import('ai');
    const { resolveAnthropicModel } = await import('@/lib/ai-client');

    const mockModel = vi.fn();
    vi.mocked(resolveAnthropicModel).mockResolvedValueOnce({ model: mockModel as any, error: null });

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({ user: { id: 'tester_123' } } as any);
    vi.mocked(visualExportRateLimit.limit).mockResolvedValueOnce({ success: true } as any);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({ id: 'bp_1', brandName: 'Tester Brand' } as any);

    vi.mocked(generateObject).mockResolvedValueOnce({ object: { slides: ['S1'] } } as any);

    const { POST } = await import('../route');
    const req = createMockRequest({ inputText: 'Tester content', carouselType: 'tiktok' });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(resolveAnthropicModel).toHaveBeenCalledWith('tester_123');
  });

  it('returns error response when resolveAnthropicModel returns a decryption error', async () => {
    const { auth } = await import('@/lib/auth');
    const { visualExportRateLimit } = await import('@/lib/ratelimit');
    const { prisma } = await import('@/lib/prisma');
    const { resolveAnthropicModel } = await import('@/lib/ai-client');

    const errorResponse = NextResponse.json({ error: 'Decryption failed', code: 'DECRYPTION_FAILED' }, { status: 500 });
    vi.mocked(resolveAnthropicModel).mockResolvedValueOnce({ model: null, error: errorResponse });

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({ user: { id: 'tester_456' } } as any);
    vi.mocked(visualExportRateLimit.limit).mockResolvedValueOnce({ success: true } as any);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({ id: 'bp_2', brandName: 'Bad Tester' } as any);

    const { POST } = await import('../route');
    const req = createMockRequest({ inputText: 'Bad key content', carouselType: 'instagram' });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.code).toBe('DECRYPTION_FAILED');
  });
});
