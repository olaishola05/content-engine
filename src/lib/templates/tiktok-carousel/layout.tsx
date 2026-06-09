import React from 'react';

interface TikTokCarouselLayoutProps {
  children: React.ReactNode;
  brand?: {
    brandName?: string;
    primaryColor?: string;
  };
}

/**
 * TikTok carousel layout as RSC.
 * 9:16 vertical container for Photo Mode.
 */
export default function TikTokCarouselLayout({
  children,
  brand,
}: TikTokCarouselLayoutProps) {
  return (
    <div
      className="w-[300px] mx-auto bg-black p-2 rounded-3xl overflow-hidden"
      data-aspect="9:16"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      <div className="space-y-1">
        {children}
      </div>
      {brand?.brandName && (
        <div className="text-center mt-2 text-[9px] text-white/50 tracking-[1.5px]">
          {brand.brandName} • TIKTOK
        </div>
      )}
    </div>
  );
}
