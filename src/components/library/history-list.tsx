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
    if (query) {
      return (
        <div data-testid="history-list" className="text-[#666666] text-sm mt-4">
          No matching content found for &ldquo;{query}&rdquo;.
        </div>
      );
    }
    return (
      <div data-testid="history-list" className="text-[#666666] text-sm mt-4">
        No history yet. Start generating content to see it here.
      </div>
    );
  }

  const queryParam = query ? `&query=${encodeURIComponent(query)}` : '';

  return (
    <div data-testid="history-list" className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {generations.map((gen) => (
          <Link
            href={`/library/${gen.id}`}
            key={gen.id}
            className="block group"
          >
            <HistoryCard generation={gen} brand={brand} />
          </Link>
        ))}
      </div>
      <div className="flex gap-3">
        {page > 1 && (
          <Link
            href={`/library?page=${page - 1}${queryParam}`}
            className="px-3 py-1.5 border border-[#ebebeb] rounded-lg text-sm text-[#4d4d4d] hover:bg-[#fafafa] transition-colors"
          >
            ← Previous
          </Link>
        )}
        {hasMore && (
          <Link
            href={`/library?page=${page + 1}${queryParam}`}
            className="px-3 py-1.5 border border-[#ebebeb] rounded-lg text-sm text-[#4d4d4d] hover:bg-[#fafafa] transition-colors"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
