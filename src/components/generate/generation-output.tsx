'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Copy, Sparkles, Check, RefreshCw } from 'lucide-react';
import type { Platform } from '@/lib/actions/generate/client-validation';

export interface Variation {
  angle?: string;
  content?: string;
  hookStrength?: 'High' | 'Medium' | 'Low' | string;
  altHooks?: string[];
}

export interface PlatformOutput {
  platform: Platform;
  recommendedIndex?: number;
  recommendationReason?: string;
  variations?: Variation[];
}

export interface GenerationOutputProps {
  selectedPlatforms: Platform[];
  outputs?: PlatformOutput[];
  isGenerating: boolean;
  activePlatform: Platform;
  setActivePlatform: (platform: Platform) => void;
  onRegeneratePlatform?: (platform: Platform) => void;
  regeneratingPlatform?: Platform | null;
}

/**
 * Maps hook strength values to display properties (styling classes).
 */
export function getHookStrengthProps(strength: 'High' | 'Medium' | 'Low' | string) {
  switch (strength) {
    case 'High':
      return {
        bgClass: 'bg-[#eaf5ff]',
        textClass: 'text-[#0068d6]',
        borderClass: 'border-[#cce3ff]',
      };
    case 'Medium':
      return {
        bgClass: 'bg-[#fef7e0]',
        textClass: 'text-[#b06000]',
        borderClass: 'border-[#feebc8]',
      };
    case 'Low':
      return {
        bgClass: 'bg-[#fce8e6]',
        textClass: 'text-[#c5221f]',
        borderClass: 'border-[#fad2cf]',
      };
    default:
      return {
        bgClass: 'bg-[#fafafa]',
        textClass: 'text-[#666666]',
        borderClass: 'border-[#ebebeb]',
      };
  }
}

/**
 * Validates if the platform output has completed generating (has 3 variations with content).
 */
export function isPlatformOutputComplete(output?: PlatformOutput): boolean {
  if (!output || !output.variations || output.variations.length < 3) {
    return false;
  }
  return output.variations.every(
    (v) => v && typeof v.content === 'string' && v.content.trim().length > 0
  );
}

export default function GenerationOutput({
  selectedPlatforms,
  outputs = [],
  isGenerating,
  activePlatform,
  setActivePlatform,
  onRegeneratePlatform,
  regeneratingPlatform,
}: GenerationOutputProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeOutput = outputs.find((o) => o.platform === activePlatform);
  const isPlatformRegenerating = regeneratingPlatform === activePlatform;
  const isGeneratingOrRegenerating = isGenerating || isPlatformRegenerating;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Platform Tabs */}
      <div className="flex border-b border-[#ebebeb] overflow-x-auto gap-2">
        {selectedPlatforms.map((platform) => {
          const isTabActive = activePlatform === platform;
          const output = outputs.find((o) => o.platform === platform);
          const complete = isPlatformOutputComplete(output);

          return (
            <button
              key={platform}
              type="button"
              onClick={() => setActivePlatform(platform)}
              className={[
                'flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068d6] focus-visible:ring-offset-2',
                isTabActive
                  ? 'border-[#171717] text-[#171717]'
                  : 'border-transparent text-[#666666] hover:text-[#171717]',
              ].join(' ')}
            >
              <span>{platform === 'X' ? '𝕏' : platform}</span>
              {isGenerating && !output && (
                <RefreshCw className="w-3 h-3 animate-spin text-[#666666]" />
              )}
              {!complete && output && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      {isGeneratingOrRegenerating && !activeOutput ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-16 w-full bg-[#fafafa] border border-[#ebebeb] rounded-lg" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 bg-white border border-[#ebebeb] rounded-lg space-y-3 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                </div>
                <div className="h-12 bg-gray-100 rounded" />
                <div className="space-y-2 pt-2 border-t border-[#ebebeb]">
                  <div className="h-3 w-40 bg-gray-100 rounded" />
                  <div className="h-3 w-48 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeOutput ? (
        <div className="space-y-6">
          {/* Header row with Platform name and Regenerate button */}
          <div className="flex justify-between items-center pb-2 border-b border-[#ebebeb]/50">
            <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
              {activePlatform === 'X' ? '𝕏' : activePlatform} Variations
            </span>
            {onRegeneratePlatform && (
              <button
                type="button"
                id="regenerate-platform-btn"
                disabled={isGenerating || isPlatformRegenerating}
                onClick={() => onRegeneratePlatform(activePlatform)}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068d6]',
                  isGenerating || isPlatformRegenerating
                    ? 'bg-[#fafafa] border-[#ebebeb] text-[#a1a1aa] cursor-not-allowed'
                    : 'bg-white border-[#ebebeb] text-[#4d4d4d] hover:border-[#171717]/30 hover:bg-gray-50 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
                ].join(' ')}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPlatformRegenerating ? 'animate-spin' : ''}`} />
                <span>{isPlatformRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
              </button>
            )}
          </div>
          {/* AI Recommendation Banner */}
          {activeOutput.recommendationReason && (
            <div className="p-4 bg-[#fafafa] rounded-lg border border-[#ebebeb] shadow-sm flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full bg-[#171717] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-[#171717]">
                  AI Choice: Variation{' '}
                  {activeOutput.recommendedIndex !== undefined
                    ? activeOutput.recommendedIndex + 1
                    : 1}
                </h4>
                <p className="text-xs text-[#4d4d4d] leading-relaxed">
                  {activeOutput.recommendationReason}
                </p>
              </div>
            </div>
          )}

          {/* Variations List */}
          <div className="space-y-4">
            {activeOutput.variations?.map((variation, index) => {
              const isRecommended = activeOutput.recommendedIndex === index;
              const strength = variation.hookStrength || 'Low';
              const badgeProps = getHookStrengthProps(strength);
              const copyId = `${activePlatform}-${index}`;

              return (
                <div
                  key={index}
                  className={[
                    'p-5 bg-white rounded-lg transition-all duration-300 border',
                    isRecommended
                      ? 'border-[#171717] shadow-sm ring-1 ring-[#171717]'
                      : 'border-[#ebebeb] hover:border-[#4d4d4d]/30 shadow-sm',
                  ].join(' ')}
                >
                  {/* Variation Header */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#171717]">
                        Variation {index + 1}
                        {variation.angle ? `: ${variation.angle}` : ''}
                      </span>
                      {isRecommended && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#171717] text-white rounded">
                          Recommended
                        </span>
                      )}
                    </div>
                    {variation.hookStrength && (
                      <span
                        className={[
                          'px-2 py-0.5 text-[10px] font-semibold rounded-full border',
                          badgeProps.bgClass,
                          badgeProps.textClass,
                          badgeProps.borderClass,
                        ].join(' ')}
                      >
                        Hook: {strength}
                      </span>
                    )}
                  </div>

                  {/* Variation Body */}
                  {variation.content ? (
                    <p className="text-xs text-[#171717] whitespace-pre-wrap leading-relaxed select-text font-mono tracking-tight bg-[#fafafa] p-3 rounded border border-[#ebebeb]/50">
                      {variation.content}
                    </p>
                  ) : (
                    <div className="h-10 bg-gray-50 animate-pulse rounded border border-[#ebebeb]/50" />
                  )}

                  {/* Alt Hooks Section */}
                  {variation.altHooks && variation.altHooks.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#ebebeb] space-y-2">
                      <h5 className="text-[10px] font-semibold text-[#4d4d4d] uppercase tracking-wider">
                        Alternative Hooks
                      </h5>
                      <ul className="space-y-1.5">
                        {variation.altHooks.map((altHook, hIndex) => (
                          <li
                            key={hIndex}
                            className="text-xs text-[#666666] flex items-start gap-2 bg-[#fafafa]/50 p-2 rounded border border-[#ebebeb]/30"
                          >
                            <span className="text-[#a1a1aa] font-semibold">{hIndex + 1}.</span>
                            <span className="select-text font-mono tracking-tight">{altHook}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {variation.content && (
                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-[#ebebeb]/60">
                      <button
                        type="button"
                        onClick={() => handleCopy(variation.content || '', copyId)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border border-[#ebebeb] text-[#4d4d4d] hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068d6] transition-colors"
                      >
                        {copiedId === copyId ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Post</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-[#fafafa] border border-[#ebebeb] rounded-lg">
          <p className="text-xs text-[#666666]">
            No variations generated yet. Click generate above.
          </p>
        </div>
      )}
    </div>
  );
}
