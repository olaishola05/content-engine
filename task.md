# Active Tasks: Phase 4 (Long-Form Blog Output)

## Status: 100% Complete ✅

### Backlog & Tasks

- [x] **Task 1: AI Prompts Setup**
  - Create the prompt templates:
    - [lib/prompts/blog-angle.ts](file:///Users/olaish/Documents/Microverse/olaishola/Brand/content-engine/src/lib/prompts/blog-angle.ts) (Step 1: Generate 3 headlines & angles with AI recommendation)
    - [lib/prompts/blog-article.ts](file:///Users/olaish/Documents/Microverse/olaishola/Brand/content-engine/src/lib/prompts/blog-article.ts) (Step 2: Full article generation with SEO layout)
    - [lib/prompts/content-atoms.ts](file:///Users/olaish/Documents/Microverse/olaishola/Brand/content-engine/src/lib/prompts/content-atoms.ts) (Extract 4 atoms: quotable, stat, controversial take, how-to step)
    - [lib/prompts/youtube-seo.ts](file:///Users/olaish/Documents/Microverse/olaishola/Brand/content-engine/src/lib/prompts/youtube-seo.ts) (YouTube title, description, and tags)
  
- [x] **Task 2: Server Actions & Database Logic**
  - Implement [src/lib/actions/generate/blog.ts](file:///Users/olaish/Documents/Microverse/olaishola/Brand/content-engine/src/lib/actions/generate/blog.ts) for:
    - Generating angles (Step 1)
    - Generating full article + atoms + saving to `generation_outputs` (Step 2)
  - Ensure Neon DB schemas and Prisma bindings for the outputs are fully wired.

- [x] **Task 3: On-Page SEO & Verification Tests (TDD)**
  - Write test suites for SEO length validation (SEO title < 60 chars, meta description < 160 chars).
  - Verify that statistics, definition blocks, FAQ sections, and CTAs exist in generated outputs.
  - Verify that YouTube SEO logic triggers only when `input_type === 'youtube_transcript'`.

- [x] **Task 4: Angle Selection UI Screen**
  - Implemented [src/app/(dashboard)/generate/blog/page.tsx](file:///Users/olaish/Documents/Microverse/olaishola/Brand/content-engine/src/app/(dashboard)/generate/blog/page.tsx) and angle selector cards using the Preview Pink theme and spread shadows.
  - Created `AngleSelector` component with 3 cards, AI recommendation badge, direction pills.
  - Enabled "Long" format button in `generate-client.tsx` with routing to `/generate/blog`.

- [x] **Task 5: Full Article Generation & Output Display**
  - Implemented [src/app/(dashboard)/generate/blog/[id]/page.tsx](file:///Users/olaish/Documents/Microverse/olaishola/Brand/content-engine/src/app/(dashboard)/generate/blog/%5Bid%5D/page.tsx).
  - `blog-view-client.tsx`: streams article via `useObject`, polls for background atoms/YouTube assets.
  - Sidebar panels implemented with tabbed navigation:
    - `SeoMetadataPanel` — title, meta, primary + secondary keywords (copy buttons)
    - `ContentAtomsPanel` — 4 atoms (quotable, stat, take, how-to) with copy buttons
    - `YoutubeSeoPanel` — conditional (YouTube transcript only), title variations, description, tags
  - All components use Geist font scale, achromatic palette, shadow-as-border (`border-[#ebebeb]`).

- [x] **Task 6: Onboarding Gate & Navigation Integration**
  - `/generate/blog` and `/generate/blog/[id]` both gate on `auth.api.getSession` → redirect `/sign-in`.
  - Both pages sit inside `(dashboard)/` layout which enforces `resolveOnboardingGate`.
  - Updated stale "gated until Phase 4" tooltip in `generate-client.tsx` to reflect live feature.
  - Integration tests assert auth redirect on both routes (2 test files, 5 auth/navigation tests).
  - Production build: ✓ 19 routes compiled clean, TypeScript in 21s, static pages in 1.4s.
