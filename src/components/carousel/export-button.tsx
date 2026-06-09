'use client';

import React from 'react';

interface ExportButtonProps {
  onDownloadPNG: () => void;
  onDownloadPDF: () => void;
}

/**
 * Buttons to trigger PNG or PDF export of the current visual.
 */
export default function ExportButton({
  onDownloadPNG,
  onDownloadPDF,
}: ExportButtonProps) {
  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={onDownloadPNG}
        className="flex-1 px-4 py-2 text-sm font-semibold bg-[#171717] text-white rounded-xl hover:bg-[#333] transition"
      >
        Download PNG
      </button>
      <button
        onClick={onDownloadPDF}
        className="flex-1 px-4 py-2 text-sm font-semibold border border-[#ebebeb] rounded-xl hover:bg-[#fafafa] transition"
      >
        Download PDF
      </button>
    </div>
  );
}
