'use client';

import React from 'react';
import ImpactCardLayout from '../../lib/templates/impact-card/layout';

interface CardPreviewProps {
  statement: string;
  style: 'white' | 'black' | 'gradient';
  brand?: {
    brandName?: string;
    primaryColor?: string;
    platformHandles?: Record<string, string>;
  };
}

/**
 * In-browser preview of the impact card using the template.
 */
export default function CardPreview({
  statement,
  style,
  brand,
}: CardPreviewProps) {
  return (
    <div className="relative mx-auto" style={{ maxWidth: '320px' }}>
      <div className="scale-[0.9] origin-top">
        <ImpactCardLayout
          statement={statement}
          style={style}
          brand={brand}
        />
      </div>
      <div className="mt-2 text-center text-xs text-[#666]">
        {style} style • Impact Card Preview
      </div>
    </div>
  );
}
