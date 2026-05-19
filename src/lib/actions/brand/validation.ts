import { z } from 'zod';

export const brandProfileSchema = z.object({
  brandName: z.string().nullable(),
  tagline: z.string().nullable(),
  niche: z.string().nullable(),
  audience: z.string().nullable(),
  toneOfVoice: z.string().nullable(),
  contentPillars: z.array(z.string()),
  keyPhrases: z.array(z.string()),
  avoidPhrases: z.array(z.string()),
  platformHandles: z.object({
    linkedin: z.string().nullable(),
    instagram: z.string().nullable(),
    x: z.string().nullable(),
    tiktok: z.string().nullable(),
    youtube: z.string().nullable(),
  }).nullable(),
  ctaStyle: z.string().nullable(),
  brandValues: z.array(z.string()),
  uniquePositioning: z.string().nullable(),
  primaryColor: z.string().nullable(),
  font: z.string().nullable(),
});

export type ExtractedBrandProfile = z.infer<typeof brandProfileSchema>;
