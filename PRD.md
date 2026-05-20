
PRODUCT REQUIREMENTS DOCUMENT
[Working Title: ContentEngine]
AI-Powered Content Repurposing Platform
Version 2.0 — May 2026
Author: Oladipupo Ishola
Status: Final — Ready for Development

---

## 1. Executive Summary

ContentEngine is an AI-powered content repurposing and generation platform. It takes a single piece of content and produces a complete content pack: platform-optimised text, long-form blog posts, visual carousels, impact cards, and video-ready scripts. Every output is informed by the user's stored brand profile, so the system does not just repurpose content — it repurposes it in the user's voice, for their audience, optimised for each platform's performance norms.

The product launches as a private internal tool for the founder, opens to invited testers on BYOK access, then goes fully commercial with a flat monthly subscription. This staged approach validates the product in real use before money changes hands.

> **Strategic Context:** ContentEngine is built first. The audience built around it becomes the customer base for future products including Brand System Builder. Every piece of content produced with it is proof of what it does. The tool markets itself through use.

---

## 2. Problem Statement

Content creators who want to build a serious presence across multiple platforms face three compounding problems.

- **Problem 1: The manual repurposing tax.**
  The same idea gets touched five or six times across platforms. Most creators skip repurposing entirely or produce lower quality outputs because of the effort involved.

- **Problem 2: Generic AI output that sounds like AI.**
  Without brand voice context, AI-generated content is tonally wrong. The creator rewrites it anyway, defeating the purpose.

- **Problem 3: No performance intelligence built in.**
  Even repurposed content fails to perform when hooks are weak, captions miss platform conventions, and YouTube titles are not searchable. The tool produces content but not results.

---

## 3. Product Vision

ContentEngine is the tool that makes one piece of content go everywhere, sound like you, and perform well when it gets there.

> **One Input. Full Content Pack. Your Voice. Every Platform.**
> The user creates once. ContentEngine generates text, visuals, cards, and scripts — all branded, all optimised, all ready to post.

---

## 4. Target Users

ContentEngine is built for any serious content creator regardless of technical background. The UI must work equally well for a developer who appreciates clean tooling and a faith-based YouTube creator who has never written a line of code.

| User Type | Description |
|---|---|
| Solo content creators | Building a personal brand. Creating content regularly but struggling with distribution and repurposing volume. |
| Founders and solopreneurs | Non-technical. Need to show up online consistently to attract clients. Cannot afford a content team. |
| Educators and coaches | Have deep knowledge to share. Strong on their primary platform but not showing up elsewhere because repurposing is too time-consuming. |
| Developers and builders | Building in public. Want to repurpose technical content across platforms without manual effort. |
| Niche and faith channel creators | Running topic-specific channels. Need content that stays on-brand and on-message without generic AI output diluting their voice. |

---

## 5. Scope

The product is built in two clearly defined versions. V1 is the private internal tool. V2 is the commercial product.

### Version 1 — Private Tool (Target: 4 to 6 Weeks)

**INCLUDED IN V1**

- User authentication via BetterAuth with OAuth (Google, GitHub) and email and password
- Brand profile creation via document upload — PDF, DOCX, or Markdown (.md)
- Automatic brand detail extraction stored structured in user profile on Neon
- Five content input types: LinkedIn post, YouTube transcript, blog article, topic or idea, document upload
- Text repurposing to X, Instagram caption, TikTok script, YouTube script, LinkedIn post
- Three variations per platform output with AI-powered recommendation and reasoning
- Long-form output: SEO blog post and article generation optimised for traditional search and AI search engines
- Hook scoring and alternative hook suggestions per platform
- YouTube SEO layer: title, description, and tags generated alongside script
- Instagram carousel generation — 4:5 ratio, 7-slide narrative arc, exported as PNG and PDF
- LinkedIn PDF carousel export from the same carousel generation pipeline
- TikTok Photo Mode carousel — 9:16 vertical ratio, 3 to 5 slides, bold minimal design
- Impact Card / Quote Card generation with subtle brand customisation
- Tone selector per generation independent of brand profile default
- Regenerate individual platform outputs without losing others
- Content history and library — all generations saved, searchable, and soft-deletable
- BYOK mode for invited testers — API keys stored encrypted per user
- Rate limiting on all server actions via Upstash Redis
- Mobile responsive UI
- Marketing skills integration from coreyhaines31/marketingskills library
- Simple usage dashboard for the founder

**DEFERRED TO V2**

- Remotion animated video generation
- WaveSpeed AI video generation
- Content calendar and planning view
- Stripe subscription and billing
- Multi-user commercial access
- Auto-posting and scheduling integration
- Analytics per piece of content
- Team accounts and multiple brand profiles
- Public REST API endpoints for third-party integrations

---

## 6. Feature Specifications

### 6.1 Authentication and Access Control

Auth is built from day one using BetterAuth. There are no unprotected routes. Every page and every server action requires a valid session. Users can authenticate via OAuth providers or email and password — both supported from day one.

- Sign up and sign in with email and password via BetterAuth
- OAuth sign in via Google and GitHub — primary and recommended authentication method
- Users can choose either OAuth or email and password. OAuth is presented as the default option on the login screen for fastest onboarding.
- Session management with secure HTTP-only cookies
- User roles: Admin (founder), Tester (BYOK required), Subscriber (V2)
- All data mutations handled via Next.js Server Actions — keys never exposed to the client
- Rate limiting per user per server action using Upstash Redis sliding window
- BYOK mode: testers enter their own Anthropic keys on first login, stored encrypted in Neon using AES-256

---

### 6.2 Brand Profile System

The brand profile is what separates ContentEngine from generic repurposing tools. Every generation is automatically informed by it without the user having to think about it.

- On first login, three-step onboarding triggers automatically and cannot be skipped
  - Step 1: Upload brand guide in any supported format — PDF, DOCX, or Markdown (.md). Max 10MB. Skip option applies a generic voice.
  - Step 2: Claude reads the document and extracts structured brand data. User reviews and confirms or edits before saving.
  - Step 3: BYOK users add their API keys. Platform subscribers skip this step. OAuth users skip account setup entirely — profile is pre-populated from their provider.
- Extracted brand data stored as structured JSON in brand_profile field on user record in Neon
- Extracted fields: brand name, tone of voice, key phrases, avoid phrases, audience description, content pillars, platform handles, niche, CTA style, brand values, unique positioning, primary colour, font
- Brand profile injected automatically into every generation system prompt
- User can update brand profile at any time from settings
- User can view a formatted summary of extracted brand details in their profile page

---

### 6.3 Content Input Types

ContentEngine accepts five distinct input types. The UI presents these as selectable cards on the main generation screen. The user selects one, pastes or uploads their content, and the generation pipeline receives both the content and the input type as context. The input type is passed so the AI can calibrate tone, structure, and platform adaptation accordingly — a YouTube transcript generates differently from a LinkedIn post even when targeting the same output platform.

| Input Type | Description | Accepted Format |
|---|---|---|
| LinkedIn Post | An existing LinkedIn post the user has written or wants to repurpose | Plain text paste |
| YouTube Transcript | Full or partial transcript from a YouTube video | Plain text paste or .txt upload |
| Blog Article | A full blog post or article | Plain text paste or .md/.txt upload |
| Topic or Idea | A rough concept, title, or bullet points — no full content yet | Plain text paste |
| Document Upload | A PDF, DOCX, or Markdown file | File upload (max 10MB) |

---

### 6.4 Text Repurposing Engine

The core generation pipeline. Produces platform-specific text outputs informed by the coreyhaines31/marketingskills library — specifically the social-content, copywriting, and content-strategy skills.

#### THREE VARIATIONS PER PLATFORM WITH RECOMMENDATION

Every text output is generated as three distinct variations. Each variation takes a different angle, hook style, or tone approach. The system analyses all three and recommends one with a plain English explanation of why.

- Variation 1: Curiosity or open-loop angle — creates a knowledge gap the audience wants to close
- Variation 2: Bold claim or direct statement — leads with the outcome or result
- Variation 3: Personal story or experience angle — leads with a relatable human moment

The recommendation is based on three factors: brand profile fit (which variation sounds most like the user), platform performance principle (which hook formula performs strongest on that platform per the social-content skill), and content type match (educational content gets different treatment from personal story content).

> **Recommendation Format:** Plain English, 2 to 3 sentences. Example: "Variation 2 is recommended. It opens with a specific outcome rather than a question, which performs stronger on X. It also matches your direct, no-fluff tone better than the other two." Never a score or percentage.

#### PLATFORM RULES BAKED INTO EVERY GENERATION

| Platform | Generation Rules |
|---|---|
| X (Twitter) | Single tweet max 280 characters OR numbered thread if depth requires. Strong opening line. Max 2 hashtags. Hook must create curiosity or make a bold claim without being clickbait. |
| Instagram Caption | First line works as standalone hook before the "more" cut. Storytelling body. Clear CTA. 8 to 12 relevant hashtags grouped at the bottom. |
| TikTok Script | Hook in first 3 seconds creates an open loop. Spoken conversational language. 45 to 90 seconds when read aloud. Stage directions in brackets. Strong CTA at the end. |
| YouTube Script | Strong opening hook. Structured with clear sections. B-roll suggestions in brackets. Conversational but authoritative. SEO title, description, and 6 tags generated alongside. |
| LinkedIn Post | Professional but human voice. Hook in the first line (avoid opening with "I"). Short punchy paragraphs — 1 to 2 lines each, white space used deliberately. CTA drives to comment or follow. Max 3 relevant hashtags. |

#### PERFORMANCE LAYER

- Hook analysis on every output: why the hook is strong or weak
- Two alternative hook options per platform
- Regenerate any single platform output independently without losing others
- Tone selector per generation: educational, storytelling, promotional, vulnerable, direct

---

### 6.5 Long-Form Output: Blog Post and Article Generation

Any input type can be expanded into a full SEO-optimised blog post. This is a distinct output direction from short-form repurposing. The user chooses to repurpose short, expand long, or generate both simultaneously.

> **Dual SEO Optimisation:** Every blog post is optimised for traditional search engines (Google, Bing) AND AI search engines (Google AI Overviews, ChatGPT, Perplexity, Claude). Appearing in AI-generated answers is as important as ranking on page one in 2026. ContentEngine builds for both from day one.

#### Blog Post Structure — Every Generated Article Includes

- SEO title with primary keyword front-loaded, under 60 characters
- Meta description under 160 characters with primary keyword and clear value proposition
- Estimated read time
- Definition block in the first paragraph: a self-contained answer to the primary query in 40 to 60 words, optimised for AI snippet extraction
- Structured body with H2 and H3 headings that mirror how people phrase search queries
- At least one comparison table, numbered list, or step-by-step block for structured content AI search engines cite
- Statistics and cited sources woven into the body — each statistic increases AI citation probability
- Internal linking suggestions noted in brackets for where the user should link to related content
- Primary keyword and three to five secondary keywords identified
- CTA at the end aligned with the user's brand profile
- FAQ section with natural-language questions and direct answers — optimised for featured snippet and AI Overview citation

#### Three Angle Variations for Blog Posts

Blog posts and articles use a two-step variation flow to avoid generating three full long-form articles unnecessarily.

- Step 1: System generates three headline and angle options with a brief description of each direction and a recommendation
- Step 2: User selects their preferred angle and the full article is generated for that angle only

This protects token usage and keeps the experience fast without sacrificing creative choice.

#### Content Atom Extraction

When a blog post is generated, ContentEngine also extracts content atoms — self-contained moments from the article that work as standalone social posts.

- Quotable moment: a bold claim or memorable line for X or LinkedIn
- Key statistic: a surprising number formatted as a social proof post
- Controversial take: a contrarian angle for X or LinkedIn
- Step extracted from a how-to section: suitable for TikTok or Instagram carousel

---

### 6.6 Marketing Skills Integration

ContentEngine's generation prompts are systematically informed by the coreyhaines31/marketingskills open-source library. This ensures every output follows proven marketing methodology rather than generic AI writing patterns.

| Skill | Applied In ContentEngine |
|---|---|
| social-content | Hook formulas for every platform. Three-second rule for TikTok and Reels. Platform specs and character counts. Content atom extraction framework. |
| ai-seo | Blog post dual optimisation for traditional and AI search. 40 to 60 word extractable passage target. Statistics and citation weaving. FAQ block structure. |
| seo-audit | On-page SEO rules for blog post generation. Title tag, meta description, heading hierarchy, and keyword placement methodology. |
| copywriting | Headline formulas for LinkedIn hooks and Impact Cards. CTA writing rules. Benefit-over-feature principle. Specificity over vagueness rule across all outputs. |
| content-strategy | Searchable versus shareable classification. Content pillar and topic cluster mapping used in brand profile extraction. Buyer stage mapping for blog keyword targeting. |
| launch-strategy | ORB framework for launch announcement content. Five-phase launch approach templates available as a content mode. |

Installation into the ContentEngine codebase:

```bash
npx skills add coreyhaines31/marketingskills
```

Skills install to `.agents/skills/` directory. The AI coding agent reads relevant skill files before building each generation prompt.

---

### 6.7 Visual Output: Instagram Carousel

Produces a fully swipeable HTML carousel where every slide is designed for export as an individual PNG for Instagram, or compiled as a PDF for LinkedIn.

- Content derived from the same input used for text repurposing
- Brand profile informs tone, messaging, and CTA. Colour system derived from brand primary colour.
- Standard 7-slide narrative arc: Hero, Problem, Solution, Features, Details, How-to, CTA
- Arc adapts to content topic — not every carousel needs all seven slides
- Every slide includes progress bar and swipe arrow per the carousel design system
- Instagram export: individual 1080x1350px PNG files per slide
- LinkedIn export: single compiled PDF with all slides as pages — LinkedIn PDF carousel format which is currently one of the highest-performing content types on the platform
- Playwright used for export at correct device scale factor (420px layout, 2.57x scale to 1080px output)

---

### 6.8 Visual Output: TikTok Photo Mode Carousel

A distinct carousel format built for TikTok's Photo Mode and Instagram Reels multi-image posts. Different dimensions, different design energy, and different pacing from the Instagram carousel.

> **Why This Is Different:** Instagram carousel: editorial, information-dense, 7 slides, narrative arc. TikTok Photo Mode: punchy, minimal text per slide, high contrast, 3 to 5 slides maximum, designed to be consumed fast on a phone in portrait mode. Same source content, completely different treatment.

- Format: 9:16 vertical ratio at 1080x1920px
- 3 to 5 slides maximum — hook on slide one, value in the middle, payoff or CTA on the last slide
- Bold typography, high contrast, minimal text per slide — designed for fast thumb-scroll consumption
- Each slide carries one idea, one statement, or one step — no information density
- Exported as individual PNG files ready for TikTok Photo Mode upload
- Same Playwright pipeline as Instagram carousel — different HTML template and dimensions

---

### 6.9 Visual Output: Impact Card / Quote Card

A single-slide branded image built around the most powerful statement extracted from the content. Performs exceptionally well on faith channels, motivational accounts, and any niche where a bold declaration drives saves and shares.

#### Generation Logic

- System extracts the single most impactful statement from the content — the line most likely to stop a scroll
- User can regenerate with a different extracted statement if the first does not land
- Three background style options: solid white with heavy black type, solid black with white type, brand gradient with white type
- User sets their preferred default style in brand profile — applied automatically to every Impact Card generated

#### Brand Customisation

Subtle but deliberate. The message is always the hero. The branding claims ownership without fighting the content for attention.

- Brand handle or name displayed small at the bottom in 11px muted text. Enough to claim it, not enough to distract.
- Logo mark or brand initial in the corner at low opacity (10 to 15 percent) if stored in brand profile
- Thin accent bar — 4px along the bottom or left edge in brand primary colour
- Optional background tint: brand primary colour at 4 to 8 percent opacity on white or black base
- All customisation values pulled automatically from stored brand profile. Set once, applied everywhere.

#### Export Formats

- 1080x1080px PNG for Instagram feed and Facebook
- 1080x1920px PNG for TikTok and Instagram Reels

---

### 6.10 Content History and Library

- All generations stored in Neon database linked to the user account
- History view shows date, input type, input preview, and platforms generated
- User can open any past generation and see all outputs including all three variations
- User can re-edit any saved output
- User can regenerate any past session with updated brand profile or tone
- Search by keyword across all saved generations
- Soft delete: user can remove a generation from history without permanent data loss

---

### 6.11 Onboarding Flow

- Step 1: Upload brand guide — PDF, DOCX, or Markdown. Skip option available.
- Step 2: Review extracted brand details. Edit any field before confirming.
- Step 3: Add API keys if BYOK mode. Platform subscribers skip this.
- After onboarding, user lands on main generation dashboard ready to create.

---

## 7. Technical Architecture

### 7.1 Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Server Actions keep API keys server-side by design |
| **Language** | TypeScript | Type safety across the full stack |
| **Package Manager** | pnpm | Faster installs, disk-efficient, stricter dependency resolution |
| **Styling** | Tailwind CSS + shadcn/ui | Maximum speed, zero custom CSS overhead, accessible by default |
| **Auth** | BetterAuth | Consistent across all Oladipupo Ishola products. OAuth (Google, GitHub) primary; email/password as fallback. |
| **Database** | Neon (PostgreSQL) | Serverless Postgres, generous free tier, native Vercel integration |
| **ORM** | Prisma | Developer familiarity, best-in-class schema readability, uses `@prisma/adapter-neon` |
| **Rate Limiting** | Upstash Redis | Serverless Redis, sliding window, native Vercel integration |
| **AI** | Anthropic Claude (`claude-sonnet-4-20250514`) | Brand extraction + all generation prompts |
| **File Storage** | Cloudflare R2 | 10GB free, no egress fees — handles brand docs, carousel exports, and impact card PNGs |
| **Visual Export** | Playwright | Headless browser for carousel PNG and PDF export |
| **Client State** | Zustand | Lightweight, minimal boilerplate for shared client state |
| **Server State** | Next.js Server Actions + React cache | No additional library overhead |
| **Email** | Resend | Transactional email for auth and notifications |
| **Analytics** | PostHog | Product analytics and usage insight |
| **Deployment** | Vercel | Zero-config Next.js deployment |
| **Marketing Skills** | coreyhaines31/marketingskills | Installed via `npx skills add` to `.agents/skills/` |

---

### 7.2 Database Schema

> **Implementation Note:** BetterAuth requires its own table set for session management. These are defined in `prisma/schema.prisma` and managed automatically. Additional application tables are added per phase.

**Core Auth Tables (managed by BetterAuth — do not modify manually)**

**user**
- id (String PK), name, email (unique), emailVerified (Boolean), image, createdAt, updatedAt
- Custom field: role (String, default: "subscriber") — values: "admin" | "tester" | "subscriber"

**session**
- id (String PK), expiresAt, token (unique), createdAt, updatedAt, ipAddress, userAgent, userId (FK → user)

**account**
- id (String PK), accountId, providerId, userId (FK → user), accessToken, refreshToken, idToken, accessTokenExpiresAt, refreshTokenExpiresAt, scope, password, createdAt, updatedAt

**verification**
- id (String PK), identifier, value, expiresAt, createdAt, updatedAt

**Application Tables (added per phase)**

**brand_profiles** *(Phase 2)*
- id, user_id (FK), raw_document_url, extracted_data (JSON), primary_color, tone, niche, audience, handles (JSON), impact_card_style, created_at, updated_at

**api_keys** *(Phase 2)*
- id, user_id (FK), anthropic_key_encrypted, created_at

**generations** *(Phase 3)*
- id, user_id (FK), input_type, input_content, tone_used, platforms (JSON array), output_direction (short | long | both), created_at

**generation_outputs** *(Phase 3)*
- id, generation_id (FK), platform, variations (JSON array of 3), recommended_variation (1|2|3), recommendation_reason, hook_score, alternative_hooks (JSON), seo_data (JSON for YouTube and blog), carousel_url, tiktok_carousel_url, impact_card_url, deleted_at, created_at

---

### 7.3 API Route Structure (Server Actions)

All data mutations are handled via Next.js Server Actions. There are no public REST API endpoints in V1. Every action is session-gated by BetterAuth middleware before execution.

> **Next.js 16 Note:** The `middleware.ts` file convention is deprecated in Next.js 16. The file still works but the build outputs a warning. This will be migrated to the `proxy` convention before production deployment.

> **Future API Note:** If ContentEngine opens to third-party integrations in V2, a public REST API layer will be introduced alongside Server Actions. The internal architecture is designed so this can be added without refactoring the core generation logic — Server Actions and future API routes will share the same underlying service functions.

```
src/
  app/
    api/
      auth/
        [...all]/
          route.ts        → BetterAuth catch-all handler (GET + POST)
                            Handles: sign-in, sign-up, sign-out, OAuth callbacks
                            (Google + GitHub OAuth is automatic — no separate oauth.ts needed)

  lib/
    actions/
      auth.ts             → signUpAction, signInAction, signOutAction (server actions)

      brand/
        upload-document.ts  → Accepts PDF/DOCX/MD, validates, stores to R2  *(Phase 2)*
        extract-brand.ts    → Sends document text to Claude, returns structured JSON  *(Phase 2)*
        save-profile.ts     → Persists confirmed brand_profile to Neon  *(Phase 2)*
        update-profile.ts   → Partial updates to existing brand profile  *(Phase 2)*

      generate/
        text.ts             → Text repurposing pipeline (3 variations + recommendation)  *(Phase 3)*
        blog.ts             → Long-form blog post generation (angle selection flow)  *(Phase 3)*
        carousel.ts         → Instagram + LinkedIn carousel HTML generation  *(Phase 5)*
        tiktok-carousel.ts  → TikTok Photo Mode carousel generation  *(Phase 5)*
        impact-card.ts      → Impact card / quote card generation  *(Phase 5)*
        export.ts           → Playwright PNG + PDF export trigger  *(Phase 5)*

      history/
        list.ts             → Paginated list of past generations  *(Phase 6)*
        get.ts              → Single generation with all outputs  *(Phase 6)*
        search.ts           → Keyword search across saved generations  *(Phase 6)*
        delete.ts           → Soft delete a generation record  *(Phase 6)*

      settings/
        save-api-keys.ts    → BYOK: encrypt + store Anthropic key  *(Phase 2)*
        delete-api-keys.ts  → Remove stored keys  *(Phase 2)*

    auth.ts               → BetterAuth server config (providers, Prisma adapter)
    auth-client.ts        → BetterAuth React client (signIn, signUp, signOut, useSession)
    prisma.ts             → Prisma singleton (local Postgres dev / Neon adapter prod)
    ratelimit.ts          → Upstash Redis rate limiter instance
    validations/
      auth.ts             → Zod schemas: signUpSchema, signInSchema
```

> **Note on OAuth:** BetterAuth handles all OAuth provider callbacks internally through the `[...all]` catch-all route. No separate `oauth.ts` action file is required.

---

### 7.4 Security Model

- All API keys stored server-side only — never accessible to the client
- BYOK keys encrypted with AES-256 before storage in Neon
- Every server action protected by BetterAuth session validation middleware
- Rate limiting per user per action using Upstash Redis sliding window
- Auth rate limit: **5 requests per 10 seconds** per IP (sliding window) — prevents brute force attacks
- Generation rate limits *(Phase 3)*: 10 text generations per hour, 5 exports per hour per user
- Document uploads validated for file type (PDF, DOCX, MD only) and size (max 10MB) before processing
- All user data scoped to their account — no cross-user data access possible
- R2 file access uses signed URLs — no publicly accessible bucket URLs

---

## 8. User Experience

### 8.1 Key UX Principles

- Approachable first. Works for a non-technical faith channel creator and a developer equally. No jargon in labels or instructions.
- Mobile responsive. Every screen works on a phone. The user should generate content from their phone after a class.
- Three variations, one decision. Showing three options with a clear recommendation removes choice paralysis. The user decides in seconds.
- Nothing is lost. Every generation saved automatically including all three variations.
- Brand voice is invisible. The user does not think about applying their brand voice. It just happens.
- Output direction is explicit. The user consciously chooses to repurpose short, expand long, or both. Not a hidden setting.

---

### 8.2 Visual Design Direction

ContentEngine follows the **Vercel Design System** (Geist aesthetic), prioritizing developer-grade minimalism, whitespace-as-layout, and precise typographical tracking.

**Core Principles**
- **Default Theme:** Light mode default with full dark mode support.
- **Canvas Colors:** Pure White (`#ffffff`) page canvas, with warmth-softened Vercel Black (`#171717`) for primary text and headings. 
- **Workflow Accent Colors:** Colors are functional, marking workflow/pipeline stages: Develop Blue (`#0a72ef`), Preview Pink (`#de1d8d`), and Ship Red (`#ff5b4f`).
- **Shadow-as-Border:** Avoid traditional CSS borders on cards, input wrappers, and buttons. Use zero-offset spread shadows: `box-shadow: 0px 0px 0px 1px rgba(0,0,0,0.08)` (or `var(--shadow-ring)`).
- **Typography:** Geist Sans/Geist Mono typeface. Headings leverage aggressive negative tracking (e.g. `-2.4px` on Display, `-1.28px` on `h2`, `-0.96px` on `h3`). Enable OpenType `"liga"` (ligatures) globally.
- **Borders & Radii:** Corner radii follow Vercel scaling (standard elements: 6px/`radius-md`, cards: 8px/`radius-lg`, tags: 9999px/`radius-full`).
- **Elevation System:** Sub-whisper shadows for elevation. Standard cards use: `rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px`. Highlighted cards use the stacked shadow with an inner `#fafafa` glow ring.

**Component Approach**
- **Tailwind Version:** Tailwind CSS v4 using `@theme` utility tokens mapped in `globals.css`.
- **Three-Weight Hierarchy:** Use 400 (body/reading), 500 (UI/interactive), and 600 (headings/emphasis) only. No bold (700) is used except on micro-badges.
- **Cards & Tabs:** Card grids float on soft white with layered shadows. Variations for multi-platform displays are toggled using compact navigation tabs.

---

### 8.3 Core User Flow

1. User logs in. First login triggers onboarding automatically.
2. User selects output direction: Repurpose Short, Expand Long, or Both.
3. User selects input type and pastes or uploads their content.
4. User selects tone for this generation if different from brand profile default.
5. User selects which platforms and output types they want.
6. User hits Generate. Outputs stream in per platform.
7. Each platform shows three variations with the recommended one highlighted. Two to three sentence recommendation explains the choice.
8. User picks their preferred variation, edits if needed, copies or downloads.
9. All outputs including all three variations saved to history automatically.

---