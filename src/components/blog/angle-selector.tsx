'use client';

import { Sparkles, Check } from 'lucide-react';

export interface BlogAngle {
  headline: string;
  angle: string;
  direction: 'Search Intent' | 'Thought Leadership' | 'Case Study';
}

interface AngleSelectorProps {
  angles: BlogAngle[];
  recommendedIndex: number;
  recommendationReason: string;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default function AngleSelector({
  angles,
  recommendedIndex,
  recommendationReason,
  selectedIndex,
  onSelect,
}: AngleSelectorProps) {
  return (
    <div className="space-y-6">
      {/* AI Recommendation Banner */}
      <div className="p-4 bg-[#fff0f6] rounded-xl border border-[#fcd5e4] flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#de1d8d] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-[#de1d8d] uppercase tracking-wider">
            AI Recommendation
          </h4>
          <p className="text-sm text-[#4d4d4d] leading-relaxed">
            {recommendationReason || `We recommend option ${recommendedIndex + 1} because it best matches your brand voice and audience search intent.`}
          </p>
        </div>
      </div>

      {/* Angles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {angles.map((item, idx) => {
          const isRecommended = idx === recommendedIndex;
          const isSelected = idx === selectedIndex;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect(idx)}
              className={[
                'w-full text-left bg-white p-6 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[220px]',
                isSelected
                  ? 'shadow-[0_0_0_2px_#de1d8d,0_4px_12px_rgba(222,29,141,0.08)] bg-white'
                  : 'shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_0_0_1px_rgba(0,0,0,0.12),0_4px_8px_rgba(0,0,0,0.04)] bg-white',
              ].join(' ')}
            >
              <div className="space-y-4 w-full">
                {/* Header: Direction and Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#666666] bg-[#fafafa] px-2 py-0.5 rounded border border-[#ebebeb]">
                    {item.direction}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isRecommended && (
                      <span className="text-[9px] font-bold uppercase tracking-wide text-[#de1d8d] bg-[#fff0f6] px-1.5 py-0.5 rounded border border-[#fcd5e4]">
                        Recommended
                      </span>
                    )}
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-[#de1d8d] flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-[#171717] line-clamp-2 leading-tight">
                    {item.headline}
                  </h3>
                  <p className="text-xs text-[#4d4d4d] line-clamp-4 leading-relaxed">
                    {item.angle}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
