'use client';

import React from 'react';

interface RegenerateStatementProps {
  currentStatement: string;
  statements: string[];
  onRegenerate: () => void;
}

/**
 * Shows current statement and button to regenerate (pick next option).
 */
export default function RegenerateStatement({
  currentStatement,
  statements,
  onRegenerate,
}: RegenerateStatementProps) {
  return (
    <div className="mt-4 p-4 bg-white rounded-2xl border border-[#ebebeb]">
      <p className="text-sm text-[#171717] mb-3">{currentStatement}</p>
      <button
        onClick={onRegenerate}
        className="w-full px-4 py-2 text-sm font-semibold border border-[#ebebeb] rounded-xl hover:bg-[#fafafa] transition"
      >
        Regenerate Statement
      </button>
      <div className="mt-2 text-[10px] text-[#666] text-center">
        {statements.length} options available
      </div>
    </div>
  );
}
