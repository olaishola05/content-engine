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
  const query = params.query || undefined;

  // Use search action if query present for full keyword search across input + outputs;
  // otherwise list. Both support pagination. Pagination UI in HistoryList component.
  const data = query 
    ? await searchHistoryAction({ query, page, pageSize: 20 })
    : await listHistoryAction({ page, pageSize: 20 });

  if (!data.success) {
    return <div>Error loading library: {data.error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Library</h1>
      <SearchBar initialQuery={query} />
      <HistoryList 
        generations={data.generations} 
        page={page} 
        hasMore={data.hasMore} 
        query={query} 
      />
    </div>
  );
}
