'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push('/library');
    } else {
      router.push(`/library?query=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    router.push('/library');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-2 max-w-md w-full" data-testid="search-bar">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search history..."
          className="w-full pl-3 pr-8 py-2 border border-[#ebebeb] rounded-lg text-sm text-[#171717] placeholder-[#888888] focus:outline-none focus:ring-1 focus:ring-[#171717] focus:border-[#171717] transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#171717] text-xs font-medium focus:outline-none"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-[#171717] hover:bg-[#171717]/90 text-white rounded-lg text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors"
      >
        Search
      </button>
    </form>
  );
}
