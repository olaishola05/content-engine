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

  const profile = await prisma.brandProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (profile) {
    return { status: 'PROFILE_EXISTS', userId };
  }

  return { status: 'NEEDS_ONBOARDING', userId };
}
