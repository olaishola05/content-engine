'use client';

import { useState } from 'react';
import { Copy, Check, MessageSquare, BarChart2, Zap, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Atoms {
  quotable: string;
  statistic: string;
  take: string;
  howto: string;
}

interface ContentAtomsPanelProps {
  atoms?: Atoms | null;
}

export default function ContentAtomsPanel({ atoms }: ContentAtomsPanelProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Atom copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const list = [
    {
      key: 'quotable',
      label: 'Quotable Moment',
      description: 'Perfect for a standalone X post or LinkedIn quote',
      icon: MessageSquare,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      value: atoms?.quotable,
    },
    {
      key: 'statistic',
      label: 'Key Statistic / Proof',
      description: 'Formatted as a high-authority social proof post',
      icon: BarChart2,
      color: 'text-green-600 bg-green-50 border-green-100',
      value: atoms?.statistic,
    },
    {
      key: 'take',
      label: 'Controversial Take',
      description: 'A scroll-stopping hook or debate-starting perspective',
      icon: Zap,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
      value: atoms?.take,
    },
    {
      key: 'howto',
      label: 'How-to Step / Breakdown',
      description: 'Educational nugget for carousels or short scripts',
      icon: HelpCircle,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      value: atoms?.howto,
    },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl border border-[#ebebeb] shadow-sm space-y-6">
      <div className="space-y-1">
        <h3 className="text-xs font-bold text-[#666666] uppercase tracking-wider">
          Extracted Content Atoms
        </h3>
        <p className="text-[10px] text-[#666666]">
          Micro-content segments extracted automatically to power your social schedule.
        </p>
      </div>

      <div className="space-y-4 pt-4 border-t border-[#ebebeb]/50">
        {list.map((atom) => {
          const Icon = atom.icon;
          const isCopied = copiedKey === atom.key;

          return (
            <div
              key={atom.key}
              className="p-4 bg-white rounded-xl border border-[#ebebeb] hover:border-[#4d4d4d]/30 transition-all duration-200 space-y-3 shadow-sm"
            >
              {/* Atom Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border ${atom.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-[#171717]">
                      {atom.label}
                    </h4>
                    <p className="text-[9px] text-[#666666]">
                      {atom.description}
                    </p>
                  </div>
                </div>

                {atom.value && (
                  <button
                    type="button"
                    onClick={() => handleCopy(atom.value || '', atom.key)}
                    className="p-1 rounded hover:bg-gray-100 text-[#4d4d4d] hover:text-[#171717]"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              {/* Atom Body */}
              {atom.value ? (
                <p className="text-xs text-[#171717] select-text bg-[#fafafa] p-3 rounded border border-[#ebebeb]/50 font-mono tracking-tight leading-relaxed">
                  {atom.value}
                </p>
              ) : (
                <div className="h-10 bg-gray-50 animate-pulse rounded border border-[#ebebeb]/50" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
