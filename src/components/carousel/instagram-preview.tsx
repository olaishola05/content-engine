'use client';

import React from 'react';
import InstagramCarouselLayout from '../../lib/templates/instagram-carousel/layout';
import InstagramCarouselSlide from '../../lib/templates/instagram-carousel/slide';

interface InstagramPreviewProps {
  slides: string[];
  currentIndex: number;
  brand?: {
    brandName?: string;
    primaryColor?: string;
  };
}

/**
 * In-browser scaled preview for Instagram carousel.
 * Uses the RSC templates for consistent look.
 */
export default function InstagramPreview({
  slides,
  currentIndex,
  brand,
}: InstagramPreviewProps) {
  const currentSlide = slides[currentIndex] || '';

  return (
    <div className="relative mx-auto" style={{ maxWidth: '420px' }}>
      <div className="scale-[0.6] origin-top">
        <InstagramCarouselLayout brand={brand}>
          <InstagramCarouselSlide
            content={currentSlide}
            index={currentIndex}
            total={slides.length}
            brand={brand}
          />
        </InstagramCarouselLayout>
      </div>
      <div className="mt-2 text-center text-xs text-[#666]">
        {currentIndex + 1} / {slides.length} • Instagram Preview
      </div>
    </div>
  );
}
