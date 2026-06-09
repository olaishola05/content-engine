'use client';

import { useState } from 'react';
import { Copy, Check, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SeoMetadataPanelProps {
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
}

export default function SeoMetadataPanel({
  seoTitle,
  metaDescription,
  primaryKeyword,
  secondaryKeywords = [],
}: SeoMetadataPanelProps) {
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedMeta, setCopiedMeta] = useState(false);

  const titleLength = seoTitle?.length || 0;
  const isTitleValid = titleLength <= 60 && titleLength > 0;

  const metaLength = metaDescription?.length || 0;
  const isMetaValid = metaLength <= 160 && metaLength > 0;

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(seoTitle);
    setCopiedTitle(true);
    toast.success('SEO Title copied!');
    setTimeout(() => setCopiedTitle(false), 2000);
  };

  const handleCopyMeta = () => {
    navigator.clipboard.writeText(metaDescription);
    setCopiedMeta(true);
    toast.success('Meta Description copied!');
    setTimeout(() => setCopiedMeta(false), 2000);
  };

  return (
    <div className="p-6 bg-white rounded-2xl border border-[#ebebeb] shadow-sm space-y-6">
      <h3 className="text-xs font-bold text-[#666666] uppercase tracking-wider">
        SEO Metadata & Keywords
      </h3>

      {/* Keywords */}
      <div className="space-y-4 pt-2 border-t border-[#ebebeb]/50">
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-[#666666] uppercase tracking-wider">
            Primary Keyword
          </span>
          <div className="mt-1">
            {primaryKeyword ? (
              <span className="inline-block px-2.5 py-1 bg-[#ebf5ff] text-[#0068d6] font-semibold text-xs rounded-lg border border-[#cce3ff] select-text">
                🔑 {primaryKeyword}
              </span>
            ) : (
              <span className="text-xs text-[#a1a1aa] italic">None identified</span>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-[#666666] uppercase tracking-wider">
            Secondary Keywords
          </span>
          <div className="flex flex-wrap gap-2 mt-1">
            {secondaryKeywords.length > 0 ? (
              secondaryKeywords.map((kw, i) => (
                <span key={i} className="px-2 py-0.5 bg-[#fafafa] text-[#4d4d4d] text-xs rounded border border-[#ebebeb] select-text">
                  {kw}
                </span>
              ))
            ) : (
              <span className="text-xs text-[#a1a1aa] italic">None identified</span>
            )}
          </div>
        </div>
      </div>

      {/* SEO Title */}
      <div className="space-y-2 pt-4 border-t border-[#ebebeb]/50">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-semibold text-[#666666] uppercase tracking-wider flex items-center gap-1">
            <span>SEO Title</span>
            <span className="text-[9px] font-mono text-[#888]">
              ({titleLength}/60)
            </span>
          </span>

          <div className="flex items-center gap-1.5">
            {isTitleValid ? (
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                <CheckCircle className="w-2.5 h-2.5" /> Optimal
              </span>
            ) : (
              titleLength > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200" title="Title should be under 60 characters for search listings">
                  <AlertTriangle className="w-2.5 h-2.5" /> Long
                </span>
              )
            )}

            <button
              type="button"
              disabled={!seoTitle}
              onClick={handleCopyTitle}
              className="p-1 rounded hover:bg-gray-100 text-[#4d4d4d] hover:text-[#171717]"
            >
              {copiedTitle ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {seoTitle ? (
          <p className="text-xs text-[#171717] font-semibold select-text bg-[#fafafa] p-3 rounded border border-[#ebebeb]/50 leading-snug">
            {seoTitle}
          </p>
        ) : (
          <div className="h-10 bg-gray-50 animate-pulse rounded border border-[#ebebeb]/50" />
        )}
      </div>

      {/* Meta Description */}
      <div className="space-y-2 pt-4 border-t border-[#ebebeb]/50">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-semibold text-[#666666] uppercase tracking-wider flex items-center gap-1">
            <span>Meta Description</span>
            <span className="text-[9px] font-mono text-[#888]">
              ({metaLength}/160)
            </span>
          </span>

          <div className="flex items-center gap-1.5">
            {isMetaValid ? (
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                <CheckCircle className="w-2.5 h-2.5" /> Optimal
              </span>
            ) : (
              metaLength > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200" title="Description should be under 160 characters for search listings">
                  <AlertTriangle className="w-2.5 h-2.5" /> Long
                </span>
              )
            )}

            <button
              type="button"
              disabled={!metaDescription}
              onClick={handleCopyMeta}
              className="p-1 rounded hover:bg-gray-100 text-[#4d4d4d] hover:text-[#171717]"
            >
              {copiedMeta ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {metaDescription ? (
          <p className="text-xs text-[#4d4d4d] select-text bg-[#fafafa] p-3 rounded border border-[#ebebeb]/50 leading-relaxed">
            {metaDescription}
          </p>
        ) : (
          <div className="h-14 bg-gray-50 animate-pulse rounded border border-[#ebebeb]/50" />
        )}
      </div>
    </div>
  );
}
