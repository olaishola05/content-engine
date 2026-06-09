'use client';

import React from 'react';

interface StyleSelectorProps {
  currentStyle: 'white' | 'black' | 'gradient';
  onChange: (style: 'white' | 'black' | 'gradient') => void;
  brand?: {
    primaryColor?: string;
  };
}

/**
 * Selector for the three impact card background styles.
 */
export default function StyleSelector({
  currentStyle,
  onChange,
  brand,
}: StyleSelectorProps) {
  const styles: Array<'white' | 'black' | 'gradient'> = ['white', 'black', 'gradient'];
  const accent = brand?.primaryColor || '#de1d8d';

  return (
    <div className="flex gap-2 mt-4">
      {styles.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`flex-1 px-3 py-2 text-xs font-semibold rounded-xl border transition ${
            currentStyle === s
              ? 'border-[#171717] bg-[#fafafa]'
              : 'border-[#ebebeb] hover:bg-[#fafafa]'
          }`}
          style={s === 'gradient' ? { borderColor: accent } : {}}
        >
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </button>
      ))}
    </div>
  );
}
