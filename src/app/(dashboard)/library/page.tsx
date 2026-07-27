import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { listHistoryAction, searchHistoryAction } from '@/lib/actions/history';
import SearchBar from '@/components/library/search-bar';
import HistoryList from '@/components/library/history-list';

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/sign-in');

  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const query = params.query?.trim() || undefined;

  const data = query
    ? await searchHistoryAction({ query, page, pageSize: 20 })
    : await listHistoryAction({ page, pageSize: 20 });

  return (
    <div className="flex-1 flex flex-col">
      {/* ── Main ────────────────────────────── */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-[#171717]">Library</h1>
          <p className="text-sm text-[#666666]">All your generated content, searchable and ready to reuse.</p>
        </div>

        <SearchBar key={query || ''} initialQuery={query} />

        {data.success ? (
          <HistoryList
            generations={data.generations}
            page={page}
            hasMore={data.hasMore}
            query={query}
          />
        ) : (
          <div className="text-sm text-[#666666]">Error loading library: {data.error}</div>
        )}
      </main>
    </div>
  );
}
