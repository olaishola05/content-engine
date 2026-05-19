"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import type { ExtractedBrandProfile } from './validation';

type ProfileType = 'DRAFT' | 'BASIC' | 'FULL';

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

/**
 * Saves questionnaire draft answers to the database under profileType = 'DRAFT'.
 */
export async function saveQuestionnaireDraftAction(
  answers: Record<string, string>
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const userId = session.user.id;

  // Convert raw form answers to database fields
  const brandName = answers.brandName || null;
  const niche = answers.niche || null;
  const audience = answers.audience || null;
  const toneOfVoice = answers.tone || null;
  const contentPillars = answers.pillars
    ? answers.pillars.split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  const brandValues = answers.values
    ? answers.values.split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  const uniquePositioning = answers.positioning || null;

  const saved = await prisma.brandProfile.upsert({
    where: { userId },
    create: {
      userId,
      profileType: 'DRAFT',
      brandName,
      niche,
      audience,
      toneOfVoice,
      contentPillars,
      brandValues,
      uniquePositioning,
    },
    update: {
      profileType: 'DRAFT',
      brandName,
      niche,
      audience,
      toneOfVoice,
      contentPillars,
      brandValues,
      uniquePositioning,
    },
  });

  return { success: true, profileId: saved.id };
}
