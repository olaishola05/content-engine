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

// 3. Mock AI SDK
vi.mock('ai', () => ({
  streamObject: vi.fn(),
  generateObject: vi.fn(),
}));

vi.mock('@ai-sdk/anthropic', () => ({
  anthropic: vi.fn(),
}));

// 4. Mock Skills Loader
vi.mock('@/lib/skills/loader', () => ({
  getSkillContent: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

describe('POST /api/generate/blog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key-1234';
  });

  const createMockRequest = (body: Record<string, any>) => {
    return new NextRequest('http://localhost/api/generate/blog', {
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
      selectedHeadline: 'Headline',
      selectedAngle: 'Angle',
      tone: 'educational',
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 400 if validation fails due to missing parameters', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);

    const { POST } = await import('../route');
    const req = createMockRequest({
      generationId: 'gen_123',
      // missing selectedHeadline, selectedAngle, tone
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid parameters');
  });

  it('returns 400 if parent generation is not found', async () => {
    const { auth } = await import('@/lib/auth');
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(prisma.generation.findUnique).mockResolvedValueOnce(null);

    const { POST } = await import('../route');
    const req = createMockRequest({
      generationId: 'gen_not_found',
      selectedHeadline: 'Headline',
      selectedAngle: 'Angle',
      tone: 'educational',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Parent generation not found');
  });

  it('returns 400 if parent generation belongs to another user', async () => {
    const { auth } = await import('@/lib/auth');
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(prisma.generation.findUnique).mockResolvedValueOnce({
      id: 'gen_123',
      userId: 'other_user',
    } as any);

    const { POST } = await import('../route');
    const req = createMockRequest({
      generationId: 'gen_123',
      selectedHeadline: 'Headline',
      selectedAngle: 'Angle',
      tone: 'educational',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 400 if brand profile is missing', async () => {
    const { auth } = await import('@/lib/auth');
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(prisma.generation.findUnique).mockResolvedValueOnce({
      id: 'gen_123',
      userId: 'user_123',
    } as any);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce(null);

    const { POST } = await import('../route');
    const req = createMockRequest({
      generationId: 'gen_123',
      selectedHeadline: 'Headline',
      selectedAngle: 'Angle',
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
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(prisma.generation.findUnique).mockResolvedValueOnce({
      id: 'gen_123',
      userId: 'user_123',
    } as any);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({
      id: 'bp_123',
      brandName: 'Test Brand',
    } as any);

    const { POST } = await import('../route');
    const req = createMockRequest({
      generationId: 'gen_123',
      selectedHeadline: 'Headline',
      selectedAngle: 'Angle',
      tone: 'educational',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.code).toBe('MISSING_API_KEY');
  });

  it('successfully triggers streamObject and returns text stream', async () => {
    const { auth } = await import('@/lib/auth');
    const { prisma } = await import('@/lib/prisma');
    const { streamObject } = await import('ai');

    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: { id: 'user_123' },
    } as any);
    vi.mocked(prisma.generation.findUnique).mockResolvedValueOnce({
      id: 'gen_123',
      userId: 'user_123',
      inputType: 'LINKEDIN_POST',
    } as any);
    vi.mocked(prisma.brandProfile.findUnique).mockResolvedValueOnce({
      id: 'bp_123',
      brandName: 'Test Brand',
    } as any);

    const mockResponse = new Response('stream data', { status: 200 });
    vi.mocked(streamObject).mockResolvedValueOnce({
      toTextStreamResponse: () => mockResponse,
    } as any);

    const { POST } = await import('../route');
    const req = createMockRequest({
      generationId: 'gen_123',
      selectedHeadline: 'Headline',
      selectedAngle: 'Angle',
      tone: 'educational',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(streamObject).toHaveBeenCalledOnce();
  });
});
