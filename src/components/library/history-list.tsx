import React from 'react';
import HistoryCard from './history-card';
import Link from 'next/link';

interface HistoryListProps {
  generations: Array<{
    id: string;
    createdAt: Date;
    inputText: string;
    inputType: string;
    platforms: string[];
    outputs?: Array<{ platform: string }>;
  }>;
  brand?: { primaryColor?: string };
  page?: number;
  hasMore?: boolean;
  query?: string;
}

export default function HistoryList({ generations, brand, page = 1, hasMore = false, query = '' }: HistoryListProps) {
  if (!generations || generations.length === 0) {
    return <div data-testid="history-list" className="text-gray-500">No history yet.</div>;
  }

  const queryParam = query ? `&query=${encodeURIComponent(query)}` : '';

  return (
    <div data-testid="history-list" className="space-y-2">
      {generations.map((gen) => (
        <HistoryCard key={gen.id} generation={gen} brand={brand} />
      ))}
      <div className="flex gap-4 mt-4">
        {page > 1 && (
          <Link 
            href={`/dashboard/library?page=${page - 1}${queryParam}`}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
          >
            ← Previous
          </Link>
        )}
        {hasMore && (
          <Link 
            href={`/dashboard/library?page=${page + 1}${queryParam}`}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
