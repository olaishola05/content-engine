'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateBrandProfile } from '@/lib/actions/brand/save-profile';
import type { ExtractedBrandProfile } from '@/lib/actions/brand/validation';

type Field = keyof ExtractedBrandProfile;

export default function ReviewForm({
  profile: initial,
  path,
}: {
  profile: Partial<ExtractedBrandProfile>;
  path: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [profile, setProfile] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  const setField = (key: Field, value: string | string[]) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const result = await updateBrandProfile(profile);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error);
      }
    });
  };

  const renderStringField = (key: Field, label: string) => (
    <div key={key} className="space-y-1.5">
      <label className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">{label}</label>
      <input
        id={`field-${key}`}
        type="text"
        value={(profile[key] as string) ?? ''}
        onChange={(e) => setField(key, e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#ebebeb] focus:border-[#0a72ef] focus:ring-1 focus:ring-[#0a72ef]/30 text-[#171717] text-sm outline-none transition-all placeholder:text-[#808080] shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
        placeholder={`No ${label.toLowerCase()} found`}
      />
    </div>
  );

  const renderArrayField = (key: Field, label: string) => {
    const arr = (profile[key] as string[]) ?? [];
    return (
      <div key={key} className="space-y-1.5">
        <label className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">{label}</label>
        <input
          id={`field-${key}`}
          type="text"
          value={arr.join(', ')}
          onChange={(e) => setField(key, e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#ebebeb] focus:border-[#0a72ef] focus:ring-1 focus:ring-[#0a72ef]/30 text-[#171717] text-sm outline-none transition-all placeholder:text-[#808080] shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          placeholder={`No ${label.toLowerCase()} found`}
        />
        <p className="text-[#808080] text-[10px] pl-1">Separate with commas</p>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-5 p-6 rounded-2xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
        {renderStringField('brandName', 'Brand Name')}
        {renderStringField('tagline', 'Tagline')}
        {renderStringField('niche', 'Niche / Industry')}
        {renderStringField('audience', 'Target Audience')}
        {renderStringField('toneOfVoice', 'Tone of Voice')}
        {renderArrayField('contentPillars', 'Content Pillars')}
        {renderArrayField('keyPhrases', 'Key Phrases')}
        {renderArrayField('avoidPhrases', 'Avoid Phrases')}
        {renderArrayField('brandValues', 'Brand Values')}
        {renderStringField('uniquePositioning', 'Unique Positioning')}
        {renderStringField('ctaStyle', 'CTA Style')}
        {renderStringField('primaryColor', 'Primary Color')}
        {renderStringField('font', 'Font')}
      </div>

      {path === 'B' && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#fafafa] border border-[#ebebeb] text-sm text-[#4d4d4d]">
          <span>💡</span>
          <p>You have a Basic Profile. Upload brand documents later in Settings to unlock a Full Profile.</p>
        </div>
      )}

      {error && <p className="text-red-600 text-sm text-center font-medium">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          id="back-review-btn"
          onClick={() => router.back()}
          className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#4d4d4d] bg-white border border-[#ebebeb] hover:bg-[#fafafa] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors"
        >
          ← Back
        </button>
        <button
          id="save-profile-btn"
          onClick={handleSave}
          disabled={isPending}
          className="flex-1 px-6 py-2.5 rounded-xl bg-[#171717] hover:bg-[#171717]/90 text-white text-sm font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors"
        >
          {isPending ? 'Saving…' : 'Save Profile & Go to Dashboard →'}
        </button>
      </div>
    </>
  );
}
