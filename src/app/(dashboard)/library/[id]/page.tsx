import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getHistoryAction } from '@/lib/actions/history';
import GenerationDetail from '@/components/library/generation-detail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LibraryDetailPage({ params }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/sign-in');

  const { id } = await params;

  const result = await getHistoryAction(id);
  if (!result.success) {
    redirect('/dashboard/library');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Library Detail</h1>
      <GenerationDetail generation={result.generation} outputs={result.outputs} />
    </div>
  );
}
