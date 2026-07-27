'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { RefreshCw, Sparkles } from 'lucide-react';

import InputTypeSelector from '@/components/generate/input-type-selector';
import AngleSelector, { type BlogAngle } from '@/components/blog/angle-selector';
import { generateBlogAnglesAction } from '@/lib/actions/generate/blog';
import type { InputType, Tone } from '@/lib/actions/generate/client-validation';

interface BlogClientProps {
  userEmail?: string | null;
}

export default function BlogClient({}: BlogClientProps) {
  const router = useRouter();

  // 1. Form States
  const [inputType, setInputType] = useState<InputType>('YOUTUBE_TRANSCRIPT');
  const [inputText, setInputText] = useState('');
  const [tone, setTone] = useState<Tone>('educational');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Angles Generation States
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [angles, setAngles] = useState<BlogAngle[]>([]);
  const [recommendedIdx, setRecommendedIdx] = useState<number>(0);
  const [recommendationReason, setRecommendationReason] = useState<string>('');
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  // Word & character counters
  const charCount = inputText.length;
  const wordCount = inputText.trim() === '' ? 0 : inputText.trim().split(/\s+/).length;

  // Handles generating the 3 angles
  const handleGenerateAngles = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      toast.error('Source content is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAngles([]);
    setGenerationId(null);

    try {
      const result = await generateBlogAnglesAction({
        inputText,
        inputType,
        tone,
      });

      if (!result.success) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      setGenerationId(result.generationId);
      setAngles(result.data.angles);
      setRecommendedIdx(result.data.recommendedIndex);
      setRecommendationReason(result.data.recommendationReason);
      setSelectedIdx(result.data.recommendedIndex); // default select recommended
      toast.success('Angles generated successfully!');
    } catch (err) {
      console.error('[BLOG_CLIENT_GENERATE_ANGLES]', err);
      const msg = 'Failed to generate angles. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handles proceeding to full blog generation
  const handleGenerateFullPost = () => {
    if (!generationId || angles.length === 0) {
      toast.error('Please generate angles first.');
      return;
    }

    const selectedAngle = angles[selectedIdx];
    const query = new URLSearchParams({
      tone,
      headline: selectedAngle.headline,
      angle: selectedAngle.angle,
    });

    router.push(`/generate/blog/${generationId}?${query.toString()}`);
  };

  return (
    <div className="flex-1 flex flex-col">

      {/* ── Main Content Area ───────────────── */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-8 space-y-8">
        {/* Headline */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#171717] -tracking-[0.96px] flex items-center gap-2">
            <span>Expand to Long-Form Blog</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#de1d8d] bg-[#fff0f6] px-2 py-0.5 rounded border border-[#fcd5e4]">
              Phase 4
            </span>
          </h1>
          <p className="text-sm text-[#4d4d4d]">
            Paste content, review recommended SEO/thought-leadership angles, and generate structured, search-optimized articles.
          </p>
        </div>

        {/* Input Form Card */}
        <form onSubmit={handleGenerateAngles} className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-[#ebebeb] shadow-sm space-y-6">
            {/* Input Type */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#666666] uppercase tracking-wider">
                1. Content Source Type
              </h3>
              <InputTypeSelector selected={inputType} onChange={setInputType} />
            </div>

            {/* Source Content */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-[#666666] uppercase tracking-wider">
                  2. Paste Source Content
                </h3>
                <span className="text-[10px] text-[#888888] font-mono">
                  {wordCount} words / {charCount} chars
                </span>
              </div>
              <textarea
                id="source-content-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your YouTube transcript summary, original LinkedIn post, or outline notes to expand into a full blog post..."
                className={[
                  'w-full min-h-[160px] p-3 text-xs border border-[#ebebeb] rounded-lg bg-[#fafafa]',
                  'focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] transition-all font-mono leading-relaxed resize-y',
                ].join(' ')}
              />
            </div>

            {/* Tone Selector */}
            <div className="space-y-3 max-w-xs">
              <h3 className="text-xs font-bold text-[#666666] uppercase tracking-wider">
                3. Content Tone & Style
              </h3>
              <select
                id="tone-select"
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="w-full h-9 px-2 text-xs border border-[#ebebeb] rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#171717] focus:border-[#171717]"
              >
                <option value="educational">🎓 Educational</option>
                <option value="storytelling">📖 Storytelling</option>
                <option value="promotional">⚡ Promotional</option>
                <option value="vulnerable">🌱 Vulnerable</option>
                <option value="direct">🎯 Direct</option>
              </select>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-[#fdf2f2] text-[#ec5959] rounded-xl border border-[#fde8e8] text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Generate Angles Button */}
          {angles.length === 0 && (
            <button
              id="generate-angles-btn"
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className={[
                'w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200',
                isLoading || !inputText.trim()
                  ? 'bg-[#fafafa] border border-[#ebebeb] text-[#a1a1aa] cursor-not-allowed'
                  : 'bg-[#171717] text-white hover:bg-[#383838] shadow-sm cursor-pointer',
              ].join(' ')}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing & Generating Angles...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#de1d8d]" />
                  <span>Generate Blog Angles</span>
                </>
              )}
            </button>
          )}
        </form>

        {/* Step 2: Display Generated Angles & selector */}
        {angles.length > 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#171717] -tracking-[0.5px]">
                Step 2: Select Your Preferred Angle
              </h2>
              <p className="text-xs text-[#666666]">
                Review the generated angles, choose the direction that matches your strategy, and generate the full article.
              </p>
            </div>

            <AngleSelector
              angles={angles}
              recommendedIndex={recommendedIdx}
              recommendationReason={recommendationReason}
              selectedIndex={selectedIdx}
              onSelect={setSelectedIdx}
            />

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setAngles([]);
                  setGenerationId(null);
                }}
                className="px-6 h-11 border border-[#ebebeb] hover:border-[#171717]/20 text-[#4d4d4d] hover:text-[#171717] text-sm font-semibold rounded-xl transition-all"
              >
                Start Over
              </button>

              <button
                id="generate-full-post-btn"
                type="button"
                onClick={handleGenerateFullPost}
                className="flex-1 h-11 flex items-center justify-center gap-2 bg-[#171717] hover:bg-[#383838] text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#de1d8d]" />
                <span>Generate Full Blog Post</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
