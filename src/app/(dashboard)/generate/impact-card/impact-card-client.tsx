'use client';

import React, { useState } from 'react';
import CardPreview from '@/components/impact-card/card-preview';
import StyleSelector from '@/components/impact-card/style-selector';
import RegenerateStatement from '@/components/impact-card/regenerate-statement';
import ExportButton from '@/components/carousel/export-button';

interface ImpactCardClientProps {
  userEmail?: string | null;
}

export default function ImpactCardClient({}: ImpactCardClientProps) {
  const [inputText, setInputText] = useState('');
  const [statements, setStatements] = useState<string[]>([]);
  const [currentStatementIndex, setCurrentStatementIndex] = useState(0);
  const [currentStyle, setCurrentStyle] = useState<'white' | 'black' | 'gradient'>('white');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setStatements([]);

    try {
      const res = await fetch('/api/generate/impact-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputText,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate impact card');
      }

      const data = await res.json();
      if (data.statements && data.statements.length > 0) {
        setStatements(data.statements);
        setCurrentStatementIndex(0);
      } else {
        throw new Error('No statements generated');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (statements.length > 0) {
      const next = (currentStatementIndex + 1) % statements.length;
      setCurrentStatementIndex(next);
    }
  };

  const currentStatement = statements[currentStatementIndex] || '';

  const handleExportPNG = async () => {
    if (!currentStatement) return;
    // Construct simple HTML for the card
    const htmlContent = `<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;"><div style="font-size:2rem;padding:2rem;text-align:center;">${currentStatement}</div></body></html>`;
    try {
      const res = await fetch('/api/generate/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationId: 'demo-gen',
          htmlContent,
          exportType: 'impact',
          dimensions: { width: 1080, height: 1080 },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.open(data.url, '_blank');
        }
      }
    } catch {
      alert('Export failed');
    }
  };

  const handleExportPDF = async () => {
    handleExportPNG();
  };

  return (
    <div className="flex-1 flex flex-col">

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-8 space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#171717]">Generate Impact Card</h1>
          <p className="text-sm text-[#4d4d4d]">Enter content to extract statements and preview/export cards in different styles.</p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your content here..."
            className="w-full min-h-[120px] p-3 text-sm border border-[#ebebeb] rounded-lg bg-[#fafafa] focus:outline-none focus:border-[#171717]"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="w-full h-11 bg-[#171717] text-white rounded-xl text-sm font-semibold disabled:bg-[#fafafa] disabled:text-[#a1a1aa]"
          >
            {isLoading ? 'Generating...' : 'Generate Statements'}
          </button>
        </form>

        {error && <div className="p-4 bg-[#fdf2f2] text-[#ec5959] rounded-xl text-sm">{error}</div>}

        {statements.length > 0 && (
          <div className="space-y-6">
            <CardPreview
              statement={currentStatement}
              style={currentStyle}
              brand={{ brandName: 'Your Brand', primaryColor: '#de1d8d', platformHandles: { instagram: '@yourbrand' } }}
            />
            <StyleSelector
              currentStyle={currentStyle}
              onChange={setCurrentStyle}
              brand={{ primaryColor: '#de1d8d' }}
            />
            <RegenerateStatement
              currentStatement={currentStatement}
              statements={statements}
              onRegenerate={handleRegenerate}
            />
            <ExportButton
              onDownloadPNG={handleExportPNG}
              onDownloadPDF={handleExportPDF}
            />
          </div>
        )}
      </main>
    </div>
  );
}
