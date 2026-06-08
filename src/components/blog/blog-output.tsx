'use client';

import { useState } from 'react';
import { Copy, Check, Clock, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface BlogOutputProps {
  content: string;
  seoTitle?: string;
  readTime?: string;
  tone?: string;
}

/**
 * A lightweight, custom React parser that renders basic markdown structures 
 * (headers, paragraphs, bullet lists, numbered lists, tables) into clean HTML tags.
 */
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  
  let keyCounter = 0;
  let inList = false;
  let listItems: string[] = [];
  let isNumbered = false;

  let inTable = false;
  let tableRows: string[][] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    const Tag = isNumbered ? 'ol' : 'ul';
    elements.push(
      <Tag key={`list-${keyCounter++}`} className={isNumbered ? 'list-decimal pl-5 my-4 space-y-1.5' : 'list-disc pl-5 my-4 space-y-1.5'}>
        {listItems.map((item, i) => (
          <li key={i} className="text-sm text-[#4d4d4d] leading-relaxed select-text">{item}</li>
        ))}
      </Tag>
    );
    listItems = [];
    inList = false;
  };

  const flushTable = () => {
    if (tableRows.length === 0) return;
    
    // Check if the second row is a divider row (e.g., |---|---|)
    let rowsToRender = [...tableRows];
    let headers: string[] = [];
    
    if (rowsToRender.length > 1 && rowsToRender[1].every(cell => cell.trim().startsWith('-') || cell.trim() === '')) {
      headers = rowsToRender[0];
      rowsToRender = rowsToRender.slice(2);
    } else if (rowsToRender.length > 0) {
      headers = rowsToRender[0];
      rowsToRender = rowsToRender.slice(1);
    }

    elements.push(
      <div key={`table-wrapper-${keyCounter++}`} className="overflow-x-auto my-6 border border-[#ebebeb] rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-[#ebebeb] text-xs font-sans">
          <thead className="bg-[#fafafa]">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="px-4 py-3 text-left font-semibold text-[#171717] tracking-wider uppercase text-[10px]">
                  {header.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#ebebeb]">
            {rowsToRender.map((row, rIdx) => (
              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]/30'}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-2.5 text-[#4d4d4d] select-text">
                    {cell.trim()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    tableRows = [];
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle Tables
    if (line.trim().startsWith('|')) {
      flushList();
      inTable = true;
      const cells = line.split('|').slice(1, -1); // Split and drop outer cells
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Handle Unordered Lists
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      if (inList && isNumbered) {
        flushList();
      }
      inList = true;
      isNumbered = false;
      listItems.push(line.replace(/^[-*]\s+/, ''));
      continue;
    }

    // Handle Numbered Lists
    const numberedMatch = line.trim().match(/^(\d+)\.\s+/);
    if (numberedMatch) {
      if (inList && !isNumbered) {
        flushList();
      }
      inList = true;
      isNumbered = true;
      listItems.push(line.replace(/^\d+\.\s+/, ''));
      continue;
    }

    // Blank line or standard text breaks the list
    if (line.trim() === '') {
      flushList();
      continue;
    }

    // Flush any ongoing list
    flushList();

    // Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={keyCounter++} className="text-sm font-semibold text-[#171717] -tracking-[0.2px] mt-6 mb-2">
          {line.substring(4)}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={keyCounter++} className="text-base font-bold text-[#171717] -tracking-[0.5px] mt-8 mb-3 pb-1 border-b border-[#ebebeb]">
          {line.substring(3)}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={keyCounter++} className="text-xl font-bold text-[#171717] -tracking-[0.96px] mt-4 mb-4">
          {line.substring(2)}
        </h1>
      );
    } else {
      // Standard Paragraph
      // Check for inline bracket suggestions [Link text] or [Insert Internal Link]
      // and highlight them subtly
      const parts = [];
      const bracketRegex = /\[([^\]]+)\]/g;
      let match;
      let lastIndex = 0;

      while ((match = bracketRegex.exec(line)) !== null) {
        const textBefore = line.substring(lastIndex, match.index);
        if (textBefore) parts.push(textBefore);
        
        parts.push(
          <span key={`bracket-${match.index}`} className="px-1.5 py-0.5 bg-[#ebf5ff] text-[#0068d6] font-mono text-[10px] rounded border border-[#cce3ff] inline-flex items-center gap-1">
            <BookOpen className="w-2.5 h-2.5" />
            {match[1]}
          </span>
        );
        lastIndex = bracketRegex.lastIndex;
      }

      const textRemaining = line.substring(lastIndex);
      if (textRemaining) parts.push(textRemaining);

      elements.push(
        <p key={keyCounter++} className="text-xs text-[#4d4d4d] leading-relaxed my-3 select-text">
          {parts.length > 0 ? parts : line}
        </p>
      );
    }
  }

  // Flush remaining lists or tables at end
  flushList();
  flushTable();

  return <div className="space-y-1">{elements}</div>;
}

export default function BlogOutput({
  content,
  seoTitle,
  readTime = '4 min read',
  tone,
}: BlogOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Full article markdown copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#ebebeb] shadow-sm flex flex-col overflow-hidden">
      {/* Article Header Bar */}
      <div className="px-6 py-4 border-b border-[#ebebeb] bg-[#fafafa] flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-[#666666] font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{readTime}</span>
          </div>
          {tone && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666] bg-white border border-[#ebebeb] px-2 py-0.5 rounded">
              {tone} Tone
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#ebebeb] bg-white text-[#4d4d4d] hover:border-[#171717]/20 hover:text-[#171717] transition-all cursor-pointer shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-600" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Markdown</span>
            </>
          )}
        </button>
      </div>

      {/* Main Rendered Content */}
      <div className="p-8 max-h-[700px] overflow-y-auto min-h-[400px]">
        {seoTitle && (
          <div className="mb-6">
            <span className="text-[10px] font-mono font-bold text-[#de1d8d] uppercase tracking-wider block mb-1">
              Headline
            </span>
            <h1 className="text-xl font-bold text-[#171717] -tracking-[0.96px] leading-tight select-text">
              {seoTitle}
            </h1>
          </div>
        )}

        <div className="divider-h bg-[#ebebeb]/60 h-px mb-6" />

        {content.trim() === '' ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
            <div className="h-4 bg-gray-100 rounded w-full" />
          </div>
        ) : (
          <MarkdownRenderer content={content} />
        )}
      </div>
    </div>
  );
}
