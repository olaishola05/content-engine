"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import type { ExtractedBrandProfile } from './extract-brand';

type ProfileType = 'BASIC' | 'FULL';

type ActionResult =
  | { success: true; profileId: string }
  | { success: false; error: string };

/**
 * Saves (or overwrites) a brand profile for the authenticated user.
 * Uses upsert — safe to call on first save or re-upload.
 */
export async function saveBrandProfile(
  profile: ExtractedBrandProfile,
  profileType: ProfileType = 'BASIC'
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const userId = session.user.id;

  const saved = await prisma.brandProfile.upsert({
    where: { userId },
    create: {
      userId,
      profileType,
      brandName: profile.brandName,
      tagline: profile.tagline,
      niche: profile.niche,
      audience: profile.audience,
      toneOfVoice: profile.toneOfVoice,
      contentPillars: profile.contentPillars,
      keyPhrases: profile.keyPhrases,
      avoidPhrases: profile.avoidPhrases,
      platformHandles: profile.platformHandles ?? undefined,
      ctaStyle: profile.ctaStyle,
      brandValues: profile.brandValues,
      uniquePositioning: profile.uniquePositioning,
      primaryColor: profile.primaryColor,
      font: profile.font,
    },
    update: {
      profileType,
      brandName: profile.brandName,
      tagline: profile.tagline,
      niche: profile.niche,
      audience: profile.audience,
      toneOfVoice: profile.toneOfVoice,
      contentPillars: profile.contentPillars,
      keyPhrases: profile.keyPhrases,
      avoidPhrases: profile.avoidPhrases,
      platformHandles: profile.platformHandles ?? undefined,
      ctaStyle: profile.ctaStyle,
      brandValues: profile.brandValues,
      uniquePositioning: profile.uniquePositioning,
      primaryColor: profile.primaryColor,
      font: profile.font,
    },
  });

  return { success: true, profileId: saved.id };
}

/**
 * Partially updates specific fields of the authenticated user's brand profile.
 */
export async function updateBrandProfile(
  data: Partial<ExtractedBrandProfile>
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const userId = session.user.id;

  const updated = await prisma.brandProfile.update({
    where: { userId },
    data: {
      ...data,
      platformHandles: data.platformHandles ?? undefined,
    },
  });

  return { success: true, profileId: updated.id };
}
