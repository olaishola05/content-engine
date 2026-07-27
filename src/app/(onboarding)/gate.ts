import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

type GateResult =
  | { status: 'UNAUTHENTICATED' }
  | { status: 'NEEDS_ONBOARDING'; userId: string }
  | { status: 'PROFILE_EXISTS'; userId: string };

/**
 * Pure gate function — determines what state an onboarding visitor is in.
 * Used in the onboarding layout to gate access and skip users who already have a profile.
 */
export async function resolveOnboardingGate(): Promise<GateResult> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return { status: 'UNAUTHENTICATED' };
  }

  const { id: userId } = session.user;

  const [profile, dbUser] = await Promise.all([
    prisma.brandProfile.findUnique({
      where: { userId },
      select: { id: true, profileType: true },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, encryptedAnthropicApiKey: true },
    }),
  ]);

  if (profile && profile.profileType !== 'DRAFT') {
    const isTester = dbUser?.role === 'tester';
    const hasKey = !!dbUser?.encryptedAnthropicApiKey;
    if (isTester && !hasKey) {
      return { status: 'NEEDS_ONBOARDING', userId };
    }
    return { status: 'PROFILE_EXISTS', userId };
  }

  return { status: 'NEEDS_ONBOARDING', userId };
}
