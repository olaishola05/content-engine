import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { resolveOnboardingGate } from '@/app/(onboarding)/gate';

import InstagramClient from './instagram-client';

export default async function InstagramCarouselGeneratePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/sign-in');

  const gate = await resolveOnboardingGate();
  if (gate.status === 'NEEDS_ONBOARDING') redirect('/onboarding');

  return <InstagramClient userEmail={session.user.email} />;
}
