'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { processQuestionnaire } from '@/lib/actions/brand/process-questionnaire';
import { saveBrandProfile, saveQuestionnaireDraftAction } from '@/lib/actions/brand/save-profile';
import { QUESTIONS } from './questions';

export default function QuestionnaireWizard({
  initialAnswers,
}: {
  initialAnswers: Record<string, string>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const setAnswer = (id: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  // Count how many questions have non-empty answers
  const filledCount = QUESTIONS.filter((q) => answers[q.id]?.trim()).length;
  const isMinimumAnswered = filledCount >= 3;

  const currentQuestion = QUESTIONS[currentIndex];
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === QUESTIONS.length - 1;

  // Triggers draft saving in background
  const persistDraft = async (updatedAnswers: Record<string, string>) => {
    try {
      await saveQuestionnaireDraftAction(updatedAnswers);
    } catch (e) {
      console.error('Failed to save draft', e);
    }
  };

  const handleNext = () => {
    setError(null);
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
      persistDraft(answers);
    }
  };

  const handleBack = () => {
    setError(null);
    if (!isFirstQuestion) {
      setCurrentIndex((prev) => prev - 1);
      persistDraft(answers);
    } else {
      router.push('/onboarding');
    }
  };

  const handleSubmit = () => {
    if (!isMinimumAnswered) {
      setError('Please answer at least 3 questions to continue.');
      return;
    }
    setError(null);

    startTransition(async () => {
      try {
        // 1. Call Claude to generate the brand profile from answers
        const profile = await processQuestionnaire(answers);

        // 2. Save the generated profile to the database as BASIC
        const saveResult = await saveBrandProfile(profile, 'BASIC');

        if (!saveResult.success) {
          setError(saveResult.error);
          return;
        }

        // 3. Go to review
        router.push('/onboarding/review?path=B');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "";
        console.error("Profile generation failed:", err);
        setError(
          errorMessage.includes("API key")
            ? "AI generation is currently unavailable (API key missing)."
            : "An error occurred while generating your brand profile."
        );
      }
    });
  };

  // Progress percentage (from 1 to 7)
  const progress = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-fade-in bg-white p-8 rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs text-[#4d4d4d] font-medium shadow-[0_0_0_1px_rgba(0,0,0,0.08)] mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Question {currentIndex + 1} of {QUESTIONS.length}
        </div>
        <h1 className="text-2xl font-semibold text-[#171717] tracking-tight -tracking-[0.96px]">
          Tell us about your brand
        </h1>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-[#ebebeb] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#171717] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Active Question Box */}
      <div className="space-y-4 py-4 min-h-[160px]">
        <div className="space-y-2">
          <label htmlFor={currentQuestion.id} className="flex items-start gap-2 text-sm text-[#171717] font-semibold">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#fafafa] border border-[#ebebeb] flex items-center justify-center text-[10px] text-[#666666] mt-0.5">
              {currentIndex + 1}
            </span>
            {currentQuestion.label}
          </label>
          <textarea
            id={currentQuestion.id}
            rows={4}
            value={answers[currentQuestion.id] ?? ''}
            onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="w-full px-4 py-3 rounded-xl bg-white border border-[#ebebeb] focus:border-[#0a72ef] focus:ring-1 focus:ring-[#0a72ef]/30 text-[#171717] text-sm placeholder:text-[#808080] resize-none outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>
      </div>

      {/* Minimum count warning indicator */}
      <div className="flex items-center justify-between text-xs border-t border-[#ebebeb] pt-4">
        <span className="text-[#808080]">Required answers: min. 3</span>
        <span className={`font-semibold ${isMinimumAnswered ? 'text-emerald-600' : 'text-red-500'}`}>
          {isMinimumAnswered ? '🟢' : '🔴'} Answered: {filledCount}/3
        </span>
      </div>

      {isPending && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100 text-sm text-[#0068d6]">
          <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />
          <p>Generating your brand profile with Claude…</p>
        </div>
      )}

      {error && <p className="text-red-600 text-sm text-center font-medium">{error}</p>}

      {/* Footer Navigation */}
      <div className="flex items-center gap-3 pt-2">
        <button
          id="wizard-back-btn"
          onClick={handleBack}
          disabled={isPending}
          className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#4d4d4d] bg-white border border-[#ebebeb] hover:bg-[#fafafa] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors"
        >
          {isFirstQuestion ? '← Cancel' : '← Back'}
        </button>

        {isLastQuestion ? (
          <button
            id="questionnaire-submit-btn"
            onClick={handleSubmit}
            disabled={isPending || !isMinimumAnswered}
            className="flex-1 px-6 py-2.5 rounded-xl bg-[#171717] hover:bg-[#171717]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors"
          >
            {isPending ? 'Generating profile…' : 'Generate Brand Profile →'}
          </button>
        ) : (
          <button
            id="wizard-next-btn"
            onClick={handleNext}
            disabled={isPending}
            className="flex-1 px-6 py-2.5 rounded-xl bg-[#171717] hover:bg-[#171717]/90 text-white text-sm font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors text-center"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
