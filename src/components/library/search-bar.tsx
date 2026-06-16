import React from 'react';

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = '' }: SearchBarProps) {
  return (
    <form method="get" className="mb-4 flex gap-2" data-testid="search-bar">
      <input
        type="text"
        name="query"
        defaultValue={initialQuery}
        placeholder="Search history..."
        className="flex-1 px-3 py-2 border rounded"
      />
      <button 
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}
