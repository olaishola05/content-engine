import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import GenerateClient from './generate-client';

export default async function GeneratePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/sign-in');

  return <GenerateClient userEmail={session.user.email} />;
}
