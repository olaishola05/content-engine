import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveBrandProfile, updateBrandProfile } from '../save-profile';

// Mock Prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    brandProfile: {
      upsert: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Mock auth session
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({
        user: { id: 'user_123' },
      }),
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

const mockProfile = {
  brandName: 'Test Brand',
  tagline: 'Just do it',
  niche: 'Tech',
  audience: 'Developers',
  toneOfVoice: 'Professional',
  contentPillars: ['Code', 'Design'],
  keyPhrases: ['Ship it'],
  avoidPhrases: ['Bug'],
  platformHandles: { linkedin: null, instagram: null, x: null, tiktok: null, youtube: null },
  ctaStyle: 'Direct',
  brandValues: ['Integrity'],
  uniquePositioning: 'First to market',
  primaryColor: '#000000',
  font: 'Inter',
};

describe('Brand Profile Persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saveBrandProfile upserts the profile with correct fields for authenticated user', async () => {
    const { prisma } = await import('@/lib/prisma');
    const upsertMock = vi.mocked(prisma.brandProfile.upsert);
    upsertMock.mockResolvedValue({ id: 'bp_1', userId: 'user_123', ...mockProfile } as never);

    const result = await saveBrandProfile(mockProfile, 'FULL');

    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'user_123' },
        create: expect.objectContaining({ userId: 'user_123', profileType: 'FULL' }),
        update: expect.objectContaining({ profileType: 'FULL' }),
      })
    );
    expect(result.success).toBe(true);
  });

  it('updateBrandProfile updates a specific field for authenticated user', async () => {
    const { prisma } = await import('@/lib/prisma');
    const updateMock = vi.mocked(prisma.brandProfile.update);
    updateMock.mockResolvedValue({ id: 'bp_1', userId: 'user_123', ...mockProfile } as never);

    const result = await updateBrandProfile({ brandName: 'Updated Brand' });

    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'user_123' },
        data: expect.objectContaining({ brandName: 'Updated Brand' }),
      })
    );
    expect(result.success).toBe(true);
  });

  it('saveBrandProfile returns error if user is not authenticated', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const result = await saveBrandProfile(mockProfile, 'BASIC');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
    }
  });
});
