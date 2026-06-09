'use client';

import React from 'react';
import TikTokCarouselLayout from '../../lib/templates/tiktok-carousel/layout';
import TikTokCarouselSlide from '../../lib/templates/tiktok-carousel/slide';

interface TikTokPreviewProps {
  slides: string[];
  currentIndex: number;
  brand?: {
    brandName?: string;
    primaryColor?: string;
  };
}

/**
 * In-browser scaled preview for TikTok carousel.
 */
export default function TikTokPreview({
  slides,
  currentIndex,
  brand,
}: TikTokPreviewProps) {
  const currentSlide = slides[currentIndex] || '';

  return (
    <div className="relative mx-auto" style={{ maxWidth: '300px' }}>
      <div className="scale-[0.8] origin-top">
        <TikTokCarouselLayout brand={brand}>
          <TikTokCarouselSlide
            content={currentSlide}
            index={currentIndex}
            total={slides.length}
            brand={brand}
          />
        </TikTokCarouselLayout>
      </div>
      <div className="mt-2 text-center text-xs text-[#666]">
        {currentIndex + 1} / {slides.length} • TikTok Preview
      </div>
    </div>
  );
}
