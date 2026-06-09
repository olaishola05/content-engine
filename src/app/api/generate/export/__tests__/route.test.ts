/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// 1. Mock Prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    generation: {
      findUnique: vi.fn(),
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

// 4. Mock export action
vi.mock('@/lib/actions/generate/export', () => ({
  triggerVisualExportAction: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

describe('POST /api/generate/export', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockRequest = (body: Record<string, any>) => {
    return new NextRequest('http://localhost/api/generate/export', {
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
      htmlContent: '<div>test</div>',
      exportType: 'instagram',
      dimensions: { width: 1080, height: 1350 },
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
      generationId: 'gen_123',
      htmlContent: '<div>test</div>',
      exportType: 'instagram',
      dimensions: { width: 1080, height: 1350 },
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
      // missing params
      generationId: 'gen_123',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid parameters');
  });

  it('successfully triggers export and returns JSON', async () => {
    const { auth } = await import('@/lib/auth');
    const { visualExportRateLimit } = await import('@/lib/ratelimit');
    const { prisma } = await import('@/lib/prisma');
    const { triggerVisualExportAction } = await import('@/lib/actions/generate/export');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(visualExportRateLimit.limit).mockResolvedValueOnce({
      success: true,
    } as any);
    vi.mocked(prisma.generation.findUnique).mockResolvedValueOnce({
      id: 'gen_123',
      userId: 'user_123',
    } as any);

    vi.mocked(triggerVisualExportAction).mockResolvedValueOnce({
      success: true,
      generationId: 'gen_123',
      url: 'https://r2.example.com/export.png',
    });

    const { POST } = await import('../route');
    const req = createMockRequest({
      generationId: 'gen_123',
      htmlContent: '<div>test</div>',
      exportType: 'instagram',
      dimensions: { width: 1080, height: 1350 },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.url).toBe('https://r2.example.com/export.png');
    expect(triggerVisualExportAction).toHaveBeenCalledOnce();
  });
});
