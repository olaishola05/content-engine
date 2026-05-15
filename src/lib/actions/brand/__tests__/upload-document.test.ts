import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadAndExtract } from '../upload-document';

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('@ai-sdk/anthropic', () => ({
  anthropic: vi.fn(() => ({})),
}));

vi.mock('ai', () => ({
  generateObject: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    brandProfile: { upsert: vi.fn(), update: vi.fn() },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/r2', () => ({
  uploadFileToR2: vi.fn().mockResolvedValue('https://r2.example.com/brand-documents/user_123/doc.pdf'),
}));

vi.mock('@/lib/extractors/pdf', () => ({
  extractPdfText: vi.fn().mockResolvedValue('Extracted PDF text'),
}));

vi.mock('@/lib/extractors/docx', () => ({
  extractDocxText: vi.fn().mockResolvedValue('Extracted DOCX text'),
}));

vi.mock('@/lib/extractors/markdown', () => ({
  extractMarkdownText: vi.fn().mockResolvedValue('Extracted Markdown text'),
}));

vi.mock('../extract-brand', () => ({
  extractBrandFromText: vi.fn().mockResolvedValue({
    brandName: 'Test Brand',
    tagline: 'Just do it',
    niche: 'Tech',
    audience: 'Developers',
    toneOfVoice: 'Professional',
    contentPillars: ['Code', 'Design'],
    keyPhrases: [],
    avoidPhrases: [],
    platformHandles: null,
    ctaStyle: null,
    brandValues: [],
    uniquePositioning: null,
    primaryColor: null,
    font: null,
  }),
}));

vi.mock('../save-profile', () => ({
  saveBrandProfile: vi.fn().mockResolvedValue({ success: true, profileId: 'bp_1' }),
}));

// ── Helpers ────────────────────────────────────────────────────────────────

function makeFile(name: string, type: string, content = 'dummy'): File {
  return new File([content], name, { type });
}

function makeFormData(files: File[]): FormData {
  const fd = new FormData();
  files.forEach((f) => fd.append('files', f));
  return fd;
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('uploadAndExtract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns UNAUTHENTICATED error when session is missing', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const result = await uploadAndExtract(makeFormData([]));

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/authenticated/i);
  });

  it('returns error when no files are provided', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({ user: { id: 'user_123' } } as never);

    const result = await uploadAndExtract(makeFormData([]));

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/no files/i);
  });

  it('calls uploadFileToR2 for each uploaded file', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({ user: { id: 'user_123' } } as never);

    const { uploadFileToR2 } = await import('@/lib/r2');

    const formData = makeFormData([
      makeFile('brand.pdf', 'application/pdf'),
      makeFile('guide.md', 'text/markdown'),
    ]);

    await uploadAndExtract(formData);

    expect(vi.mocked(uploadFileToR2)).toHaveBeenCalledTimes(2);
  });

  it('uses the correct extractor per file type and combines text', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({ user: { id: 'user_123' } } as never);

    const { extractBrandFromText } = await import('../extract-brand');
    const { extractPdfText } = await import('@/lib/extractors/pdf');
    const { extractMarkdownText } = await import('@/lib/extractors/markdown');

    const formData = makeFormData([
      makeFile('brand.pdf', 'application/pdf'),
      makeFile('guide.md', 'text/markdown'),
    ]);

    await uploadAndExtract(formData);

    expect(vi.mocked(extractPdfText)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(extractMarkdownText)).toHaveBeenCalledTimes(1);

    // Combined text should be passed to Claude
    const calledWith = vi.mocked(extractBrandFromText).mock.calls[0][0];
    expect(calledWith).toContain('Extracted PDF text');
    expect(calledWith).toContain('Extracted Markdown text');
  });

  it('calls saveBrandProfile with FULL type and returns success', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({ user: { id: 'user_123' } } as never);

    const { saveBrandProfile } = await import('../save-profile');

    const formData = makeFormData([makeFile('brand.pdf', 'application/pdf')]);
    const result = await uploadAndExtract(formData);

    expect(vi.mocked(saveBrandProfile)).toHaveBeenCalledWith(
      expect.objectContaining({ brandName: 'Test Brand' }),
      'FULL'
    );
    expect(result.success).toBe(true);
  });
});
