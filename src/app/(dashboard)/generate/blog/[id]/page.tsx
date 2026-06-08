import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getBlogGenerationAction } from '@/lib/actions/generate/blog';
import BlogViewClient, { type BlogArticleOutput } from './blog-view-client';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    tone?: string;
    headline?: string;
    angle?: string;
  }>;
}

export default async function BlogViewPage({ params, searchParams }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/sign-in');

  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const result = await getBlogGenerationAction(id);
  if (!result.success) {
    redirect('/generate/blog');
  }

  // Cast output variations JSON safely to the expected type
  const existingOutput = result.output ? (result.output.variations as unknown as BlogArticleOutput) : null;

  return (
    <BlogViewClient
      generationId={id}
      inputType={result.generation.inputType}
      userEmail={session.user.email}
      existingOutput={existingOutput}
      tone={resolvedSearchParams.tone}
      headline={resolvedSearchParams.headline}
      angle={resolvedSearchParams.angle}
    />
  );
}
