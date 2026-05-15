'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const QUESTIONS = [
  { id: 'brandName', label: 'What is the name of your brand?', placeholder: 'e.g. Acme Studio' },
  { id: 'niche', label: 'What industry or niche does your brand operate in?', placeholder: 'e.g. B2B SaaS, sustainable fashion, edtech…' },
  { id: 'audience', label: 'Who is your primary audience?', placeholder: 'e.g. Early-stage founders, working professionals aged 25–40…' },
  { id: 'tone', label: 'How would you describe your brand\'s tone of voice?', placeholder: 'e.g. Confident, warm, and jargon-free. Like a trusted advisor.' },
  { id: 'pillars', label: 'What are your 3–5 core content pillars or themes?', placeholder: 'e.g. Productivity, remote work, leadership, personal finance…' },
  { id: 'values', label: 'What are your brand values?', placeholder: 'e.g. Transparency, simplicity, user-first thinking…' },
  { id: 'positioning', label: 'What makes your brand unique compared to competitors?', placeholder: 'e.g. We are the only platform that combines X with Y for Z audience…' },
];

export default function QuestionnairePage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const setAnswer = (id: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const progress = Math.round((Object.keys(answers).filter((k) => answers[k]?.trim()).length / QUESTIONS.length) * 100);

  const handleSubmit = async () => {
    const filled = QUESTIONS.filter((q) => answers[q.id]?.trim());
    if (filled.length < 3) {
      setError('Please answer at least 3 questions to continue.');
      return;
    }

    setStatus('submitting');
    setError(null);

    try {
      const res = await fetch('/api/brand/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) throw new Error('Processing failed');

      const { extractionId } = await res.json() as { extractionId: string };
      router.push(`/onboarding/review?extractionId=${extractionId}&path=B`);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 font-medium mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          Path B — Brand Questionnaire
        </div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Tell us about your brand</h1>
        <p className="text-white/50 text-sm">Answer what you can — Claude will fill in the gaps intelligently.</p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {QUESTIONS.map((q, i) => (
          <div key={q.id} className="space-y-2">
            <label htmlFor={q.id} className="flex items-start gap-2 text-sm text-white/70 font-medium">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-white/40 mt-0.5">
                {i + 1}
              </span>
              {q.label}
            </label>
            <textarea
              id={q.id}
              rows={2}
              value={answers[q.id] ?? ''}
              onChange={(e) => setAnswer(q.id, e.target.value)}
              placeholder={q.placeholder}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 text-white/80 text-sm placeholder:text-white/20 resize-none outline-none transition-all"
            />
          </div>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          id="back-btn"
          onClick={() => router.push('/onboarding')}
          className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/80 transition-colors"
        >
          ← Back
        </button>
        <button
          id="questionnaire-submit-btn"
          onClick={handleSubmit}
          disabled={status === 'submitting'}
          className="flex-1 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
        >
          {status === 'submitting' ? 'Generating profile…' : 'Generate Brand Profile →'}
        </button>
      </div>
    </div>
  );
}
