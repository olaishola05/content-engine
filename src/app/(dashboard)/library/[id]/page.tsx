import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getHistoryAction } from '@/lib/actions/history';
import GenerationDetail from '@/components/library/generation-detail';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LibraryDetailPage({ params }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/sign-in');

  const { id } = await params;

  const result = await getHistoryAction(id);
  if (!result.success) {
    redirect('/library');
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* ── Main Content Area ───────────────── */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center gap-2 text-sm text-[#666666]">
          <Link href="/library" className="hover:text-[#171717] transition-colors">
            ← Back to Library
          </Link>
        </div>
        <GenerationDetail generation={result.generation} outputs={result.outputs} />
      </main>
    </div>
  );
}
