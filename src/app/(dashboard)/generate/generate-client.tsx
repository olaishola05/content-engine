'use client';

import { useState } from 'react';
import { z } from 'zod';
import { experimental_useObject } from '@ai-sdk/react';
import { toast } from 'sonner';
import { ArrowLeft, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { signOutAction } from '@/lib/actions/auth';

import InputTypeSelector from '@/components/generate/input-type-selector';
import PlatformSelector from '@/components/generate/platform-selector';
import GenerationOutput, {
  type PlatformOutput,
} from '@/components/generate/generation-output';
import {
  validateGenerationInput,
  type InputType,
  type Platform,
  type Tone,
  type Direction,
} from '@/lib/actions/generate/client-validation';

// Define schema on client side to match the route handler schema exactly
const clientOutputSchema = z.object({
  generationId: z.string().optional(),
  outputs: z.array(
    z.object({
      platform: z.enum(['X', 'INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'LINKEDIN']),
      recommendedIndex: z.number().min(0).max(2),
      recommendationReason: z.string(),
      variations: z.array(
        z.object({
          angle: z.string(),
          content: z.string(),
          hookStrength: z.enum(['High', 'Medium', 'Low']),
          altHooks: z.array(z.string()).length(2),
        })
      ).length(3),
    })
  ),
});

interface GenerateClientProps {
  userEmail?: string | null;
}

export default function GenerateClient({ userEmail }: GenerateClientProps) {
  // 1. Form States
  const [inputType, setInputType] = useState<InputType>('LINKEDIN_POST');
  const [inputText, setInputText] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>(['X', 'LINKEDIN']);
  const [tone, setTone] = useState<Tone>('educational');
  const [direction, setDirection] = useState<Direction>('SHORT');

  // Active tab state for the output component
  const [activePlatform, setActivePlatform] = useState<Platform>('X');

  // Tracks the DB generationId from the last streamed response
  const [generationId, setGenerationId] = useState<string | null>(null);

  // Per-platform regeneration loading state
  const [regeneratingPlatform, setRegeneratingPlatform] = useState<Platform | null>(null);

  // Merged outputs: base (from full-gen stream) overridden by per-platform regen results
  const [regenOutputs, setRegenOutputs] = useState<PlatformOutput[]>([]);



  // Character & word counters
  const charCount = inputText.length;
  const wordCount = inputText.trim() === '' ? 0 : inputText.trim().split(/\s+/).length;

  // 2. AI SDK useObject hook for streaming structured JSON
  const { object, submit, isLoading, error } = experimental_useObject({
    api: '/api/generate/text',
    schema: clientOutputSchema,
    onError: (err: Error) => {
      // Clean up server-side error messages where possible
      const rawMsg = err.message || 'An unexpected error occurred';
      const cleanMsg = rawMsg.includes('JSON')
        ? 'Too many requests or server rate limit reached.'
        : rawMsg;
      toast.error(cleanMsg);
    },
    onFinish: ({ object: finishedObj }) => {
      // Capture generationId from the finished stream so platform regen can reference it
      if (finishedObj?.generationId) {
        setGenerationId(finishedObj.generationId);
      }
      // Reset any prior regen overrides when a full generation completes
      setRegenOutputs([]);
      toast.success('Variations generated successfully!');
    },
  });

  // Handle Form Submission
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    const inputData = {
      inputText,
      inputType,
      platforms,
      tone,
      direction,
    };

    // Client-side validation
    const validation = validateGenerationInput(inputData);
    if (!validation.success) {
      toast.error(validation.error?.message || 'Invalid input parameters');
      return;
    }

    // Default active tab to the first selected platform
    if (platforms.length > 0) {
      setActivePlatform(platforms[0]);
    }

    // Trigger AI streaming
    submit(inputData);
  };

  /**
   * Re-generates a single platform output without losing the others.
   * Calls POST /api/generate/regenerate with the stored generationId + platform.
   * On success, merges the new output into the displayed results.
   */
  const handleRegeneratePlatform = async (platform: Platform) => {
    if (!generationId) {
      toast.error('Cannot regenerate — no generation session found. Please generate first.');
      return;
    }
    setRegeneratingPlatform(platform);
    try {
      const res = await fetch('/api/generate/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generationId, platform }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error || 'Regeneration failed. Please try again.');
        return;
      }
      // Parse the streamed response — it is a JSON text stream, read to end
      const text = await res.text();
      // Extract the first complete JSON object line
      const lines = text.split('\n').filter(Boolean);
      let newOutput: PlatformOutput | null = null;
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed?.outputs?.[0]) {
            const out = parsed.outputs[0];
            newOutput = {
              platform: (out.platform || platform) as Platform,
              recommendedIndex: out.recommendedIndex,
              recommendationReason: out.recommendationReason,
              variations: out.variations,
            };
            break;
          }
        } catch {
          // skip non-JSON lines
        }
      }
      if (newOutput) {
        setRegenOutputs((prev) => [
          ...prev.filter((o) => o.platform !== platform),
          newOutput!,
        ]);
        toast.success(`${platform} variations regenerated!`);
      } else {
        toast.error('Could not parse regenerated variations.');
      }
    } catch (err) {
      console.error('[REGENERATE]', err);
      toast.error('An unexpected error occurred during regeneration.');
    } finally {
      setRegeneratingPlatform(null);
    }
  };

  // Map the streamed partial/complete object back to the expected PlatformOutput format
  const streamedOutputs: PlatformOutput[] =
    (object?.outputs as Array<{
      platform?: string;
      recommendedIndex?: number;
      recommendationReason?: string;
      variations?: Array<{
        angle?: string;
        content?: string;
        hookStrength?: string;
        altHooks?: string[];
      }>;
    }>)?.map((out) => ({
      platform: (out?.platform || 'X') as Platform,
      recommendedIndex: out?.recommendedIndex,
      recommendationReason: out?.recommendationReason,
      variations: out?.variations?.map((v) => ({
        angle: v?.angle,
        content: v?.content,
        hookStrength: v?.hookStrength,
        altHooks: v?.altHooks ? (v.altHooks.filter(Boolean) as string[]) : undefined,
      })),
    })) || [];

  // Merge: start with streamed outputs, override any platform with regen output
  const mappedOutputs: PlatformOutput[] = [
    ...streamedOutputs.filter((o) => !regenOutputs.some((r) => r.platform === o.platform)),
    ...regenOutputs,
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* ── Top Nav ─────────────────────────── */}
      <header className="h-14 bg-white border-b border-[#ebebeb] flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#4d4d4d] hover:text-[#171717] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-medium">Dashboard</span>
          </Link>
          <span className="text-[#ebebeb]">|</span>
          <span className="text-ui font-semibold -tracking-[0.5px]">ContentEngine</span>
        </div>

        <div className="flex items-center gap-6">
          {userEmail && <span className="text-label hidden sm:block">{userEmail}</span>}
          <form action={signOutAction}>
            <button
              id="sign-out-btn"
              type="submit"
              className="text-sm font-medium text-[#4d4d4d] hover:text-[#171717] transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* ── Main Content Area ───────────────── */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Headline */}
          <div className="space-y-1">
            <h1 className="text-title-2 font-semibold text-[#171717] -tracking-[0.96px]">
              Generate Brand Content
            </h1>
            <p className="text-sm text-[#4d4d4d]">
              Repurpose original texts into platform-specific social variations matching your brand voice.
            </p>
          </div>

          {/* Discoverability wiring for visual outputs (Task 11) */}
          <div className="p-3 bg-[#fff0f6] rounded-xl border border-[#fcd5e4]">
            <p className="text-xs font-semibold text-[#de1d8d] mb-1">New: Visual Outputs</p>
            <div className="flex gap-2 text-sm">
              <Link href="/generate/carousel/instagram" className="text-[#de1d8d] hover:underline">Instagram Carousel</Link>
              <span className="text-[#666]">•</span>
              <Link href="/generate/carousel/tiktok" className="text-[#de1d8d] hover:underline">TikTok Carousel</Link>
              <span className="text-[#666]">•</span>
              <Link href="/generate/impact-card" className="text-[#de1d8d] hover:underline">Impact Card</Link>
            </div>
          </div>

          {/* Form + Output Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls */}
            <form onSubmit={handleGenerate} className="lg:col-span-5 space-y-6">
              {/* Source Type Selector */}
              <div className="p-6 bg-white rounded-2xl border border-[#ebebeb] shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-[#666666] uppercase tracking-wider">
                  1. Content Source Type
                </h3>
                <InputTypeSelector selected={inputType} onChange={setInputType} />
              </div>

              {/* Text Input */}
              <div className="p-6 bg-white rounded-2xl border border-[#ebebeb] shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-[#666666] uppercase tracking-wider">
                    2. Paste Source Content
                  </h3>
                  <span className="text-[10px] text-[#888888] font-mono">
                    {wordCount} words / {charCount} chars
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    id="source-content-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste your original LinkedIn post, YouTube transcript summary, or raw draft ideas here..."
                    className={[
                      'w-full min-h-[160px] p-3 text-xs border border-[#ebebeb] rounded-lg bg-[#fafafa]',
                      'focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] transition-all font-mono leading-relaxed resize-y',
                    ].join(' ')}
                  />
                </div>
              </div>

              {/* Platform Selector */}
              <div className="p-6 bg-white rounded-2xl border border-[#ebebeb] shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-[#666666] uppercase tracking-wider">
                  3. Select Target Platforms
                </h3>
                <PlatformSelector
                  selected={platforms}
                  onChange={(newPlatforms) => {
                    setPlatforms(newPlatforms);
                    if (newPlatforms.length > 0 && !newPlatforms.includes(activePlatform)) {
                      setActivePlatform(newPlatforms[0]);
                    }
                  }}
                />
              </div>

              {/* Tone & Direction Selector */}
              <div className="p-6 bg-white rounded-2xl border border-[#ebebeb] shadow-sm space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#666666] uppercase tracking-wider">
                    4. Tone & Style
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Tone Select */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="tone-select" className="text-[11px] font-semibold text-[#4d4d4d]">
                        Content Tone
                      </label>
                      <select
                        id="tone-select"
                        value={tone}
                        onChange={(e) => setTone(e.target.value as Tone)}
                        className="h-9 px-2 text-xs border border-[#ebebeb] rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#171717] focus:border-[#171717]"
                      >
                        <option value="educational">🎓 Educational</option>
                        <option value="storytelling">📖 Storytelling</option>
                        <option value="promotional">⚡ Promotional</option>
                        <option value="vulnerable">🌱 Vulnerable</option>
                        <option value="direct">🎯 Direct</option>
                      </select>
                    </div>

                    {/* Direction Option */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-[#4d4d4d] flex items-center gap-1">
                        <span>Format Length</span>
                        <span title="Long-form: generates a full SEO blog post from your source content">
                          <HelpCircle className="w-3 h-3 text-[#888888] cursor-help" />
                        </span>
                      </label>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDirection('SHORT')}
                          className={[
                            'flex-1 h-9 rounded-md text-xs font-semibold border transition-all duration-200',
                            direction === 'SHORT'
                              ? 'bg-[#171717] border-[#171717] text-white shadow-sm'
                              : 'bg-white border-[#ebebeb] text-[#4d4d4d] hover:border-[#171717]/20',
                          ].join(' ')}
                        >
                          Short-form
                        </button>
                        <Link
                          href="/generate/blog"
                          className={[
                            'flex-1 h-9 rounded-md text-xs font-semibold border flex items-center justify-center transition-all duration-200',
                            'bg-white border-[#ebebeb] text-[#4d4d4d] hover:border-[#171717]/20',
                          ].join(' ')}
                        >
                          Long
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="p-4 bg-[#fdf2f2] text-[#ec5959] rounded-xl border border-[#fde8e8] text-xs font-semibold flex flex-col gap-1 leading-relaxed">
                  <span>Failed to generate variations:</span>
                  <span className="font-mono text-[11px] bg-white/50 p-2 rounded border border-[#fde8e8]/50">
                    {error.message || 'Check your internet connection or API settings.'}
                  </span>
                </div>
              )}

              {/* Generate Button */}
              <button
                id="generate-btn"
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className={[
                  'w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200',
                  isLoading || !inputText.trim()
                    ? 'bg-[#fafafa] border border-[#ebebeb] text-[#a1a1aa] cursor-not-allowed'
                    : 'bg-[#171717] text-white hover:bg-[#383838] shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer',
                ].join(' ')}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Repurposing Content...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Variations</span>
                  </>
                )}
              </button>
            </form>

            {/* Output Display */}
            <div className="lg:col-span-7">
              <div className="p-6 bg-white rounded-2xl border border-[#ebebeb] shadow-sm min-h-[500px]">
                <h2 className="text-xs font-bold text-[#666666] uppercase tracking-wider mb-4">
                  Generated Variations
                </h2>
                <GenerationOutput
                  selectedPlatforms={platforms}
                  outputs={mappedOutputs.length > 0 ? mappedOutputs : undefined}
                  isGenerating={isLoading}
                  activePlatform={activePlatform}
                  setActivePlatform={setActivePlatform}
                  onRegeneratePlatform={generationId ? handleRegeneratePlatform : undefined}
                  regeneratingPlatform={regeneratingPlatform}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
