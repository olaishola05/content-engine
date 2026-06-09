import React from 'react';

interface InstagramSlideProps {
  content: string;
  index: number;
  total: number;
  brand?: {
    brandName?: string;
    primaryColor?: string;
  };
}

/**
 * Individual Instagram carousel slide as RSC.
 * Includes progress bar and swipe arrow per AC.
 */
export default function InstagramCarouselSlide({
  content,
  index,
  total,
  brand,
}: InstagramSlideProps) {
  const progress = ((index + 1) / total) * 100;
  const accent = brand?.primaryColor || '#de1d8d';

  return (
    <div
      className="relative w-full h-full flex flex-col justify-center items-center p-8 bg-white text-[#171717] font-sans"
      style={{ aspectRatio: '1080 / 1350' }} // target IG ratio
    >
      {/* Progress bar */}
      <div className="absolute top-4 left-4 right-4 h-1 bg-[#ebebeb] rounded progress-bar">
        <div
          className="h-1 rounded transition-all"
          style={{ width: `${progress}%`, backgroundColor: accent }}
        />
      </div>

      {/* Swipe arrow cue */}
      <div className="absolute bottom-6 right-6 text-xs text-[#666] flex items-center gap-1">
        Swipe <span className="text-lg leading-none">→</span>
      </div>

      {/* Slide content */}
      <div className="text-center max-w-[80%]">
        <p className="text-2xl leading-tight font-medium">{content}</p>
      </div>

      {/* Brand footer */}
      {brand?.brandName && (
        <div className="absolute bottom-4 left-4 text-[10px] text-[#666] font-mono tracking-widest">
          {brand.brandName.toUpperCase()}
        </div>
      )}
    </div>
  );
}
