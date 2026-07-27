'use client';

import { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { experimental_useObject } from '@ai-sdk/react';
import { toast } from 'sonner';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

import BlogOutput from '@/components/blog/blog-output';
import SeoMetadataPanel from '@/components/blog/seo-metadata-panel';
import ContentAtomsPanel from '@/components/blog/content-atoms-panel';
import YoutubeSeoPanel from '@/components/blog/youtube-seo-panel';
import { getBlogGenerationAction } from '@/lib/actions/generate/blog';

// Align with route handler schemas
const articleOutputSchema = z.object({
  seoTitle: z.string(),
  metaDescription: z.string(),
  primaryKeyword: z.string(),
  secondaryKeywords: z.array(z.string()),
  estimatedReadTime: z.string(),
  contentMarkdown: z.string(),
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
});

export interface BlogArticleOutput {
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  estimatedReadTime: string;
  contentMarkdown: string;
  faqs: Array<{ question: string; answer: string }>;
  atoms?: {
    quotable: string;
    statistic: string;
    take: string;
    howto: string;
  } | null;
  youtubeSeo?: {
    titles: string[];
    description: string;
    tags: string[];
  } | null;
}

interface BlogViewClientProps {
  generationId: string;
  inputType: string;
  userEmail?: string | null;
  existingOutput?: BlogArticleOutput | null;
  tone?: string;
  headline?: string;
  angle?: string;
}

export default function BlogViewClient({
  generationId,
  inputType,
  existingOutput,
  tone,
  headline,
  angle,
}: BlogViewClientProps) {
  // Tabs for sidebar
  const tabs = [
    { id: 'seo', label: 'SEO Metadata' },
    { id: 'atoms', label: 'Content Atoms' },
    ...(inputType === 'YOUTUBE_TRANSCRIPT' ? [{ id: 'youtube', label: 'YouTube SEO' }] : []),
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [postGenOutput, setPostGenOutput] = useState<BlogArticleOutput | null>(existingOutput || null);
  const streamStarted = useRef(false);

  // 1. AI SDK useObject hook for streaming structured JSON
  const { object, submit, isLoading, error } = experimental_useObject({
    api: '/api/generate/blog',
    schema: articleOutputSchema,
    onError: (err: Error) => {
      console.error('[STREAMING_ERROR]', err);
      toast.error(err.message || 'Error occurred during streaming.');
    },
    onFinish: () => {
      toast.success('Article generated! Extracting additional assets...');
      pollPostGenAssets();
    },
  });

  // Poll for background outputs (atoms + YouTube SEO)
  const pollPostGenAssets = () => {
    let attempts = 0;
    const maxAttempts = 15;

    const interval = setInterval(async () => {
      attempts++;
      try {
        const result = await getBlogGenerationAction(generationId);
        if (result.success && result.output) {
          const parsed = result.output.variations as unknown as BlogArticleOutput;
          const hasAtoms = !!parsed?.atoms;
          const needsYt = inputType === 'YOUTUBE_TRANSCRIPT';
          const hasYt = !!parsed?.youtubeSeo;

          if (hasAtoms && (!needsYt || hasYt)) {
            clearInterval(interval);
            setPostGenOutput(parsed);
            toast.success('All assets loaded successfully!');
          }
        }
      } catch (err) {
        console.error('Error polling post-gen assets:', err);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        toast.error('Timed out loading additional assets. Refresh the page to try again.');
      }
    }, 2000);
  };

  // Trigger stream on mount if no existing output is present
  useEffect(() => {
    if (!existingOutput && !streamStarted.current && headline && angle && tone) {
      streamStarted.current = true;
      submit({
        generationId,
        selectedHeadline: headline,
        selectedAngle: angle,
        tone,
      });
    }
  }, [existingOutput, generationId, headline, angle, tone, submit]);

  // Derived content state (merges stream results and completed outputs)
  const currentTitle = postGenOutput?.seoTitle || object?.seoTitle || headline || 'Generating Title...';
  const currentMeta = postGenOutput?.metaDescription || object?.metaDescription || '';
  const currentPrimaryKeyword = postGenOutput?.primaryKeyword || object?.primaryKeyword || '';
  const currentSecondaryKeywords = (postGenOutput?.secondaryKeywords || object?.secondaryKeywords || []) as string[];
  const currentReadTime = postGenOutput?.estimatedReadTime || object?.estimatedReadTime || 'Calculating...';
  
  // FAQs block to append to article content if present
  const faqs = (postGenOutput?.faqs || object?.faqs || []) as Array<{ question: string; answer: string }>;
  let currentContent = postGenOutput?.contentMarkdown || object?.contentMarkdown || '';
  if (faqs.length > 0 && currentContent) {
    const faqSection = `\n\n## Frequently Asked Questions\n\n${faqs
      .map((f: { question: string; answer: string }) => `### ${f.question}\n${f.answer}`)
      .join('\n\n')}`;
    if (!currentContent.includes('## Frequently Asked Questions')) {
      currentContent += faqSection;
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* ── Main Layout Grid ───────────────── */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#171717] -tracking-[0.5px]">
                Blog Generation Outputs
              </h2>
              <p className="text-xs text-[#666]">
                {isLoading 
                  ? 'Streaming post from AI engine...' 
                  : postGenOutput 
                  ? 'Blog output fully generated and saved.' 
                  : 'Completing background asset extraction...'}
              </p>
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-3">
              {isLoading ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#0068d6] bg-[#ebf5ff] px-3 py-1.5 rounded-full border border-[#cce3ff]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Streaming Article...</span>
                </span>
              ) : postGenOutput ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Complete</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Assets...</span>
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-[#fdf2f2] text-[#ec5959] rounded-xl border border-[#fde8e8] text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Failed to stream blog post: {error.message}</span>
            </div>
          )}

          {/* Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Article display */}
            <div className="lg:col-span-7">
              <BlogOutput
                content={currentContent}
                seoTitle={currentTitle}
                readTime={currentReadTime}
                tone={tone}
              />
            </div>

            {/* Right: Sidebar Tabs and Panels */}
            <div className="lg:col-span-5 space-y-6">
              {/* Tabs list */}
              <div className="flex border-b border-[#ebebeb] overflow-x-auto gap-2 bg-white px-4 rounded-xl border py-1 shadow-sm">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={[
                        'flex items-center gap-2 px-3 py-2.5 text-xs font-semibold border-b-2 transition-all duration-200 whitespace-nowrap focus:outline-none',
                        isActive
                          ? 'border-[#171717] text-[#171717]'
                          : 'border-transparent text-[#666666] hover:text-[#171717]',
                      ].join(' ')}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Panels Display */}
              <div className="transition-all duration-200">
                {activeTab === 'seo' && (
                  <SeoMetadataPanel
                    seoTitle={currentTitle}
                    metaDescription={currentMeta}
                    primaryKeyword={currentPrimaryKeyword}
                    secondaryKeywords={currentSecondaryKeywords}
                  />
                )}

                {activeTab === 'atoms' && (
                  <ContentAtomsPanel atoms={postGenOutput?.atoms} />
                )}

                {activeTab === 'youtube' && (
                  <YoutubeSeoPanel seo={postGenOutput?.youtubeSeo} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
