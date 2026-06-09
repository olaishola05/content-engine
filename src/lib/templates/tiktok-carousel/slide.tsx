import React from 'react';

interface TikTokSlideProps {
  content: string;
  index: number;
  total: number;
  brand?: {
    brandName?: string;
    primaryColor?: string;
  };
}

/**
 * TikTok Photo Mode carousel slide as RSC.
 * Bold typography, minimal text, high contrast.
 */
export default function TikTokCarouselSlide({
  content,
  index,
  total,
  brand,
}: TikTokSlideProps) {
  const accent = brand?.primaryColor || '#de1d8d';

  return (
    <div
      className="relative w-full h-full flex flex-col justify-center items-center bg-black text-white p-8 text-center"
      style={{ aspectRatio: '1080 / 1920' }} // 9:16 vertical
    >
      {/* Minimal bold content */}
      <div className="max-w-[85%]">
        <p className="text-4xl leading-[1.1] font-bold tracking-[-1px]">{content}</p>
      </div>

      {/* Subtle brand accent */}
      {brand?.brandName && (
        <div
          className="absolute bottom-8 text-[11px] font-mono tracking-[3px] opacity-70"
          style={{ color: accent }}
        >
          {brand.brandName.toUpperCase()}
        </div>
      )}

      {/* Page indicator for minimalism */}
      <div className="absolute bottom-4 text-[10px] opacity-50">
        {index + 1} / {total}
      </div>
    </div>
  );
}
