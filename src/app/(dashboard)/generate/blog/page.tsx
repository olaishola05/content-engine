import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import BlogClient from './blog-client';

export default async function BlogGeneratePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/sign-in');

  return <BlogClient userEmail={session.user.email} />;
}
