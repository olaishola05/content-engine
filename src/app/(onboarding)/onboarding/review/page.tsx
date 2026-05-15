'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ExtractedBrandProfile } from '@/lib/actions/brand/extract-brand';

type Field = keyof ExtractedBrandProfile;
type EditableProfile = Partial<ExtractedBrandProfile>;

export default function ReviewPage() {
  const router = useRouter();
  const params = useSearchParams();
  const extractionId = params.get('extractionId');
  const path = params.get('path') as 'A' | 'B';

  const [profile, setProfile] = useState<EditableProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!extractionId) return;
    fetch(`/api/brand/extraction?id=${extractionId}`)
      .then((r) => r.json())
      .then((data: EditableProfile) => { setProfile(data); setLoading(false); })
      .catch(() => { setError('Failed to load extracted profile.'); setLoading(false); });
  }, [extractionId]);

  const setField = (key: Field, value: string | string[]) =>
    setProfile((prev) => prev ? { ...prev, [key]: value } : prev);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/brand/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, profileType: path === 'A' ? 'FULL' : 'BASIC' }),
      });
      if (!res.ok) throw new Error('Failed to save profile');
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4 py-20">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
        <p className="text-white/50 text-sm">Claude is extracting your brand data…</p>
      </div>
    );
  }

  if (!profile) return null;

  const renderStringField = (key: Field, label: string) => (
    <div key={key} className="space-y-1.5">
      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">{label}</label>
      <input
        id={`field-${key}`}
        type="text"
        value={(profile[key] as string) ?? ''}
        onChange={(e) => setField(key, e.target.value)}
        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 text-white/80 text-sm outline-none transition-all"
        placeholder={`No ${label.toLowerCase()} found`}
      />
    </div>
  );

  const renderArrayField = (key: Field, label: string) => {
    const arr = (profile[key] as string[]) ?? [];
    return (
      <div key={key} className="space-y-1.5">
        <label className="text-xs font-medium text-white/40 uppercase tracking-wider">{label}</label>
        <input
          id={`field-${key}`}
          type="text"
          value={arr.join(', ')}
          onChange={(e) => setField(key, e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 text-white/80 text-sm outline-none transition-all"
          placeholder={`No ${label.toLowerCase()} found`}
        />
        <p className="text-white/20 text-[10px]">Separate with commas</p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 font-medium mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Step 3 — Review & Save
        </div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Review your brand profile</h1>
        <p className="text-white/50 text-sm">
          {path === 'A' ? 'Claude extracted this from your documents.' : 'Claude generated this from your answers.'}
          {' '}Edit any field before saving.
        </p>
      </div>

      <div className="space-y-4 p-6 rounded-2xl bg-white/[0.03] border border-white/10">
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
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-sm text-violet-300">
          <span>💡</span>
          <p>You have a Basic Profile. Upload brand documents later in Settings to unlock a Full Profile.</p>
        </div>
      )}

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          id="back-review-btn"
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/80 transition-colors"
        >
          ← Back
        </button>
        <button
          id="save-profile-btn"
          onClick={handleSave}
          disabled={saving}
          className="flex-1 px-6 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving…' : 'Save Profile & Go to Dashboard →'}
        </button>
      </div>
    </div>
  );
}
