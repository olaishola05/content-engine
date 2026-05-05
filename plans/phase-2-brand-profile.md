# Phase 2: Brand Profile System

## Goal
The intelligence layer. Every generation from Phase 3 onward is automatically informed by the user's stored brand profile — without the user thinking about it.

**Demo at end of phase**: Founder logs in for the first time, completes the three-step onboarding (uploads their brand guide PDF, reviews Claude's extracted brand data, saves it), and sees a populated brand profile page. BYOK testers also add their Anthropic API key.

---

## Acceptance Criteria

- [ ] Three-step onboarding flow triggers automatically on first login, cannot be skipped
- [ ] **Step 1**: File upload UI accepts PDF, DOCX, or Markdown (.md). Max 10MB. File type validated before upload. Skip option applies a generic voice.
- [ ] Uploaded file stored to Cloudflare R2 via `@aws-sdk/client-s3` with R2 endpoint
- [ ] **Step 2**: Document text extracted and sent to Claude brand extraction prompt. Returns structured JSON with all required fields. User sees the extracted data in an editable review UI. User can edit any field before saving.
- [ ] Extracted brand data saved as structured JSON to `brand_profiles` table in Neon
- [ ] Extracted fields stored: `brand_name`, `tagline`, `niche`, `audience`, `tone_of_voice`, `content_pillars`, `key_phrases`, `avoid_phrases`, `platform_handles`, `cta_style`, `brand_values`, `unique_positioning`, `primary_color`, `font`
- [ ] **Step 3**: BYOK users enter Anthropic API key. Key encrypted with AES-256 before storage in `api_keys` table. Platform users (V2) skip this step.
- [ ] Brand profile page in settings shows a formatted summary of extracted brand details
- [ ] User can update any field of their brand profile from settings at any time
- [ ] Brand profile is loaded and injected into every generation server action automatically
- [ ] `BrandProfile` and `ApiKey` models live in Neon via Prisma schema

---

## Architecture Decisions

- **Cloudflare R2** via `@aws-sdk/client-s3` — R2 is S3-compatible, use the AWS SDK with R2 endpoint. No new SDK to learn.
- **Text extraction**: For DOCX use `mammoth` npm package. For PDF use `pdf-parse`. For MD read directly. Extract text, then pass to Claude.
- **AES-256 encryption**: Use Node.js built-in `crypto` module (`createCipheriv` / `createDecipheriv`). No third-party encryption library.
- **Brand extraction prompt**: Stored as a constant in `lib/prompts/brand-extraction.ts`. System prompt only — document text goes in user message.
- **Onboarding gate**: Check `brand_profile` existence on every dashboard load. Redirect to onboarding if null.

---

## Brand Extraction System Prompt

```
You are a brand intelligence extraction system. Read the document and extract structured brand information. Return ONLY a valid JSON object with these fields: brand_name, tagline, niche, audience, tone_of_voice, content_pillars (array), key_phrases (array), avoid_phrases (array), platform_handles (object with linkedin/instagram/x/tiktok/youtube), cta_style, brand_values (array), unique_positioning, primary_color, font. If a field cannot be found, return null. Never invent information not in the document. Return only raw JSON. No preamble. No markdown fences.
```

---

## Key Files to Create

```
app/
  (onboarding)/
    page.tsx                        ← Three-step onboarding shell
    step-1-upload/page.tsx
    step-2-review/page.tsx
    step-3-keys/page.tsx
  (dashboard)/
    settings/
      brand-profile/page.tsx        ← View + edit brand profile

prisma/
  schema.prisma                     ← ADD: BrandProfile, ApiKey models

lib/
  prompts/
    brand-extraction.ts             ← System prompt constant
  extractors/
    pdf.ts                          ← pdf-parse wrapper
    docx.ts                         ← mammoth wrapper
    markdown.ts                     ← Direct read
  r2.ts                             ← Cloudflare R2 client (AWS SDK)
  encrypt.ts                        ← AES-256 encrypt/decrypt helpers

actions/
  brand/
    upload-document.ts
    extract-brand.ts
    save-profile.ts
    update-profile.ts
  settings/
    save-api-keys.ts
    delete-api-keys.ts

components/
  onboarding/
    upload-step.tsx
    review-step.tsx
    keys-step.tsx
    progress-indicator.tsx
  brand/
    brand-profile-card.tsx
    editable-field.tsx
```

---

## Environment Variables Required

```
CLOUDFLARE_R2_ENDPOINT=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=
ENCRYPTION_KEY=                     # 32-byte hex string for AES-256
ANTHROPIC_API_KEY=                  # Founder's own key (server env var)
```

---

## Dependencies

- Phase 1 complete (auth + Neon + Prisma setup)

---

## Testing Checklist (agent-tdd targets)

- PDF upload stores file to R2 and returns a URL
- DOCX upload extracts text correctly via mammoth
- Brand extraction returns valid JSON with all required fields
- Brand extraction with a sparse document returns null for missing fields (not invented data)
- Saving brand profile persists all fields to Neon
- AES-256 encryption produces different ciphertext each time (IV randomisation)
- Decryption returns the original API key
- Unauthenticated user cannot access `/onboarding` routes
- Second login skips onboarding if brand profile exists
