import React from 'react';

interface InstagramCarouselLayoutProps {
  children: React.ReactNode;
  brand?: {
    brandName?: string;
    primaryColor?: string;
  };
}

/**
 * Instagram carousel layout wrapper as RSC.
 * Provides the overall narrative arc container.
 */
export default function InstagramCarouselLayout({
  children,
  brand,
}: InstagramCarouselLayoutProps) {
  return (
    <div className="w-[420px] mx-auto bg-[#fafafa] p-4 rounded-2xl shadow-sm" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div className="space-y-4">
        {children}
      </div>
      {brand?.brandName && (
        <div className="text-center mt-4 text-[10px] text-[#666] tracking-[2px]">
          {brand.brandName} • INSTAGRAM CAROUSEL
        </div>
      )}
    </div>
  );
}
