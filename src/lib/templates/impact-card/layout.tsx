import React from 'react';

interface ImpactCardLayoutProps {
  statement: string;
  style: 'white' | 'black' | 'gradient';
  brand?: {
    brandName?: string;
    primaryColor?: string;
    platformHandles?: Record<string, string>;
  };
}

/**
 * Impact / Quote card as RSC.
 * Three background style variants as specified in ACs.
 * Uses brand primaryColor for gradient and accents.
 */
export default function ImpactCardLayout({
  statement,
  style,
  brand,
}: ImpactCardLayoutProps) {
  const brandName = brand?.brandName || 'Your Brand';
  const handle = brand?.platformHandles?.instagram || brand?.platformHandles?.twitter || '@yourbrand';
  const primary = brand?.primaryColor || '#de1d8d';

  let containerClass = '';
  let textClass = '';
  let accentBarClass = '';

  if (style === 'white') {
    containerClass = 'bg-white text-[#171717]';
    textClass = 'font-bold text-4xl tracking-[-1.5px] leading-tight';
    accentBarClass = `bg-[${primary}]`;
  } else if (style === 'black') {
    containerClass = 'bg-[#171717] text-white';
    textClass = 'font-bold text-4xl tracking-[-1.5px] leading-tight';
    accentBarClass = `bg-[${primary}]`;
  } else {
    // gradient
    containerClass = 'bg-gradient-to-br from-[#171717] to-[#333] text-white';
    textClass = 'font-bold text-4xl tracking-[-1.5px] leading-tight';
    accentBarClass = `bg-[${primary}]`;
  }

  return (
    <div
      className={`relative w-full aspect-square flex flex-col justify-center p-10 ${containerClass}`}
      data-style={style}
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Accent bar - bottom or left per AC */}
      <div className={`absolute bottom-0 left-0 h-1 w-full ${accentBarClass}`} />

      {/* Statement */}
      <div className="max-w-[90%]">
        <p className={textClass}>{statement}</p>
      </div>

      {/* Brand customisation */}
      <div className="absolute bottom-8 left-10 text-[11px] opacity-60 flex items-center gap-2">
        <span>{brandName}</span>
        <span className="opacity-40">•</span>
        <span>{handle}</span>
      </div>

      {/* Subtle logo mark / initial */}
      <div className="absolute top-8 right-10 text-[10px] opacity-[0.12] font-mono tracking-[4px]">
        {brandName.slice(0, 2).toUpperCase()}
      </div>
    </div>
  );
}
