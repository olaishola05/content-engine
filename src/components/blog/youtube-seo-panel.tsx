'use client';

import { useState } from 'react';
import { Copy, Check, Video, FileText, Hash } from 'lucide-react';
import { toast } from 'sonner';

interface YoutubeSeo {
  titles: string[];
  description: string;
  tags: string[];
}

interface YoutubeSeoPanelProps {
  seo?: YoutubeSeo | null;
}

export default function YoutubeSeoPanel({ seo }: YoutubeSeoPanelProps) {
  const [copiedTitleIdx, setCopiedTitleIdx] = useState<number | null>(null);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);

  const handleCopyTitle = (title: string, idx: number) => {
    navigator.clipboard.writeText(title);
    setCopiedTitleIdx(idx);
    toast.success('YouTube Title copied!');
    setTimeout(() => setCopiedTitleIdx(null), 2000);
  };

  const handleCopyDesc = () => {
    if (!seo?.description) return;
    navigator.clipboard.writeText(seo.description);
    setCopiedDesc(true);
    toast.success('YouTube Description copied!');
    setTimeout(() => setCopiedDesc(false), 2000);
  };

  const handleCopyTags = () => {
    if (!seo?.tags) return;
    navigator.clipboard.writeText(seo.tags.join(', '));
    setCopiedTags(true);
    toast.success('YouTube Tags copied!');
    setTimeout(() => setCopiedTags(false), 2000);
  };

  if (!seo) return null;

  return (
    <div className="p-6 bg-white rounded-2xl border border-[#ebebeb] shadow-sm space-y-6">
      <div className="space-y-1">
        <h3 className="text-xs font-bold text-[#666666] uppercase tracking-wider flex items-center gap-1.5 text-[#de1d8d]">
          <Video className="w-4 h-4 shrink-0" />
          <span>YouTube Video SEO Layer</span>
        </h3>
        <p className="text-[10px] text-[#666666]">
          Optimized titles, tags, and description compiled directly from your source transcript.
        </p>
      </div>

      {/* Title Variations */}
      <div className="space-y-3 pt-4 border-t border-[#ebebeb]/50">
        <span className="text-[10px] font-semibold text-[#666666] uppercase tracking-wider block">
          Title Suggestions
        </span>
        <div className="space-y-2">
          {seo.titles?.map((title, idx) => {
            const isCopied = copiedTitleIdx === idx;
            return (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-3 bg-[#fafafa] rounded-lg border border-[#ebebeb]/50 hover:border-[#171717]/20 transition-all"
              >
                <p className="text-xs text-[#171717] font-semibold select-text leading-snug">
                  {title}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopyTitle(title, idx)}
                  className="p-1 rounded hover:bg-gray-200 text-[#4d4d4d] hover:text-[#171717] shrink-0"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Description */}
      <div className="space-y-2 pt-4 border-t border-[#ebebeb]/50">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-semibold text-[#666666] uppercase tracking-wider flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>Video Description</span>
          </span>
          <button
            type="button"
            onClick={handleCopyDesc}
            className="p-1 rounded hover:bg-gray-100 text-[#4d4d4d] hover:text-[#171717]"
          >
            {copiedDesc ? (
              <Check className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <p className="text-xs text-[#4d4d4d] select-text bg-[#fafafa] p-3 rounded border border-[#ebebeb]/50 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
          {seo.description}
        </p>
      </div>

      {/* Tags */}
      <div className="space-y-2 pt-4 border-t border-[#ebebeb]/50">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-semibold text-[#666666] uppercase tracking-wider flex items-center gap-1">
            <Hash className="w-3 h-3" />
            <span>Video Tags</span>
          </span>
          <button
            type="button"
            onClick={handleCopyTags}
            className="p-1 rounded hover:bg-gray-100 text-[#4d4d4d] hover:text-[#171717]"
          >
            {copiedTags ? (
              <Check className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 p-3 bg-[#fafafa] rounded-lg border border-[#ebebeb]/50">
          {seo.tags?.map((tag, i) => (
            <span key={i} className="px-2 py-0.5 bg-white text-[#4d4d4d] text-[10px] font-mono rounded border border-[#ebebeb] select-text">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
