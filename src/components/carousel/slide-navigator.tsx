'use client';

import React from 'react';

interface SlideNavigatorProps {
  currentIndex: number;
  total: number;
  onChange: (index: number) => void;
}

/**
 * Arrow navigation for carousel slides.
 */
export default function SlideNavigator({
  currentIndex,
  total,
  onChange,
}: SlideNavigatorProps) {
  const goPrev = () => onChange(Math.max(0, currentIndex - 1));
  const goNext = () => onChange(Math.min(total - 1, currentIndex + 1));

  return (
    <div className="flex items-center justify-between mt-4">
      <button
        onClick={goPrev}
        disabled={currentIndex === 0}
        className="px-4 py-2 text-sm font-semibold border border-[#ebebeb] rounded-xl disabled:opacity-50 hover:bg-[#fafafa]"
        aria-label="Previous slide"
      >
        ← Prev
      </button>
      <span className="text-xs text-[#666]">
        {currentIndex + 1} / {total}
      </span>
      <button
        onClick={goNext}
        disabled={currentIndex === total - 1}
        className="px-4 py-2 text-sm font-semibold border border-[#ebebeb] rounded-xl disabled:opacity-50 hover:bg-[#fafafa]"
        aria-label="Next slide"
      >
        Next →
      </button>
    </div>
  );
}
