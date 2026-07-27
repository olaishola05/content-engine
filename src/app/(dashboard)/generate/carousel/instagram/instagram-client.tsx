'use client';

import React, { useState } from 'react';
import InstagramPreview from '@/components/carousel/instagram-preview';
import SlideNavigator from '@/components/carousel/slide-navigator';
import ExportButton from '@/components/carousel/export-button';

interface InstagramClientProps {
  userEmail?: string | null;
}

export default function InstagramClient({}: InstagramClientProps) {
  const [inputText, setInputText] = useState('');
  const [slides, setSlides] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setSlides([]);

    try {
      const res = await fetch('/api/generate/carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputText,
          carouselType: 'instagram',
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate carousel');
      }

      const data = await res.json();
      if (data.slides && data.slides.length > 0) {
        setSlides(data.slides);
        setCurrentIndex(0);
      } else {
        throw new Error('No slides generated');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPNG = async () => {
    if (slides.length === 0) return;
    // For demo, construct basic HTML; in full would render template server-side
    const htmlContent = `<html><body>${slides.map((s, i) => `<div>Slide ${i+1}: ${s}</div>`).join('')}</body></html>`;
    try {
      const res = await fetch('/api/generate/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationId: 'demo-gen', // placeholder
          htmlContent,
          exportType: 'instagram',
          dimensions: { width: 1080, height: 1350 },
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
    // Similar, for now same as PNG for demo
    handleExportPNG();
  };

  return (
    <div className="flex-1 flex flex-col">

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-8 space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#171717]">Generate Instagram Carousel</h1>
          <p className="text-sm text-[#4d4d4d]">Enter content to generate a 7-slide carousel preview and export.</p>
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
            {isLoading ? 'Generating...' : 'Generate Carousel'}
          </button>
        </form>

        {error && <div className="p-4 bg-[#fdf2f2] text-[#ec5959] rounded-xl text-sm">{error}</div>}

        {slides.length > 0 && (
          <div className="space-y-6">
            <InstagramPreview
              slides={slides}
              currentIndex={currentIndex}
              brand={{ brandName: 'Your Brand', primaryColor: '#de1d8d' }}
            />
            <SlideNavigator
              currentIndex={currentIndex}
              total={slides.length}
              onChange={setCurrentIndex}
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
