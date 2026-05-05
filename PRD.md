
PRODUCT REQUIREMENTS DOCUMENT
[Working Title: ContentEngine]
AI-Powered Content Repurposing Platform
Version 2.0 — May 2026

1. Executive Summary
ContentEngine is an AI-powered content repurposing and generation platform. It takes a single piece of content and produces a complete content pack: platform-optimised text, long-form blog posts, visual carousels, impact cards, and video-ready scripts. Every output is informed by the user's stored brand profile, so the system does not just repurpose content — it repurposes it in the user's voice, for their audience, optimised for each platform's performance norms.

The product launches as a private internal tool for the founder, opens to invited testers on BYOK access, then goes fully commercial with a flat monthly subscription. This staged approach validates the product in real use before money changes hands.


2. Problem Statement
Content creators who want to build a serious presence across multiple platforms face three compounding problems.

- Problem 1: The manual repurposing tax.
The same idea gets touched five or six times across platforms. Most creators skip repurposing entirely or produce lower quality outputs because of the effort involved.
- Problem 2: Generic AI output that sounds like AI.
Without brand voice context, AI-generated content is tonally wrong. The creator rewrites it anyway, defeating the purpose.
- Problem 3: No performance intelligence built in.
Even repurposed content fails to perform when hooks are weak, captions miss platform conventions, and YouTube titles are not searchable. The tool produces content but not results.

3. Product Vision
ContentEngine is the tool that makes one piece of content go everywhere, sound like you, and perform well when it gets there.


4. Target Users
ContentEngine is built for any serious content creator regardless of technical background. The UI must work equally well for a developer who appreciates clean tooling and a faith-based YouTube creator who has never written a line of code.


5. Scope
The product is built in two clearly defined versions. V1 is the private internal tool. V2 is the commercial product.

Version 1 — Private Tool (Target: 4 to 6 Weeks)
INCLUDED IN V1
- User authentication via BetterAuth with email and password
- Brand profile creation via document upload — PDF, DOCX, or Markdown (.md)
- Automatic brand detail extraction stored structured in user profile on Neon
- Five content input types: LinkedIn post, YouTube transcript, blog article, topic or idea, document upload
- Text repurposing to X, Instagram caption, TikTok script, YouTube script
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
- Content history and library — all generations saved and searchable
- BYOK mode for invited testers — API keys stored encrypted per user
- Rate limiting on all API routes via Upstash Redis
- Mobile responsive UI
- Marketing skills integration from coreyhaines31/marketingskills library
- Simple usage dashboard for the founder

DEFERRED TO V2
- Remotion animated video generation
- WaveSpeed AI video generation
- Content calendar and planning view
- Stripe subscription and billing
- Multi-user commercial access
- Auto-posting and scheduling integration
- Analytics per piece of content
- Team accounts and multiple brand profiles


6. Feature Specifications
6.1 Authentication and Access Control
Auth is built from day one using BetterAuth. There are no unprotected routes. Every page and every API endpoint requires a valid session. Users can authenticate via OAuth providers or email and password — both supported from day one.

- Sign up and sign in with email and password via BetterAuth
- OAuth sign in via Google and GitHub — primary and recommended authentication method
- Users can choose either OAuth or email and password. OAuth is presented as the default option on the login screen for fastest onboarding.
- Session management with secure HTTP-only cookies
- User roles: Admin (founder), Tester (BYOK required), Subscriber (V2)
- All API calls routed through Next.js server actions — keys never exposed to the client
- Rate limiting per user per endpoint using Upstash Redis sliding window
- BYOK mode: testers enter their own Anthropic and WaveSpeed keys on first login, stored encrypted in Neon using AES-256

6.2 Brand Profile System
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

6.3 Content Input Types

ContentEngine accepts five distinct input types. The UI presents these as selectable cards on the main generation screen. The user selects one, pastes or uploads their content, and the generation pipeline receives both the content and the input type as context.

| Input Type | Description | Accepted Format |
|---|---|---|
| LinkedIn Post | An existing LinkedIn post the user has written or wants to repurpose | Plain text paste |
| YouTube Transcript | Full or partial transcript from a YouTube video | Plain text paste or .txt upload |
| Blog Article | A full blog post or article | Plain text paste or .md/.txt upload |
| Topic or Idea | A rough concept, title, or bullet points — no full content yet | Plain text paste |
| Document Upload | A PDF, DOCX, or Markdown file | File upload (max 10MB) |

All input types route into the same generation pipeline. The input type is passed as context so the AI can calibrate tone, structure, and platform adaptation accordingly. A YouTube transcript generates differently from a LinkedIn post even when targeting the same output platform.

6.4 Text Repurposing Engine
The core generation pipeline. Produces platform-specific text outputs informed by the coreyhaines31/marketingskills library — specifically the social-content, copywriting, and content-strategy skills.

THREE VARIATIONS PER PLATFORM WITH RECOMMENDATION
Every text output is generated as three distinct variations. Each variation takes a different angle, hook style, or tone approach. The system analyses all three and recommends one with a plain English explanation of why.

- Variation 1: Curiosity or open-loop angle — creates a knowledge gap the audience wants to close
- Variation 2: Bold claim or direct statement — leads with the outcome or result
- Variation 3: Personal story or experience angle — leads with a relatable human moment

The recommendation is based on three factors: brand profile fit (which variation sounds most like the user), platform performance principle (which hook formula performs strongest on that platform per the social-content skill), and content type match (educational content gets different treatment from personal story content).


PLATFORM RULES BAKED INTO EVERY GENERATION

PERFORMANCE LAYER
- Hook analysis on every output: why the hook is strong or weak
- Two alternative hook options per platform
- Regenerate any single platform output independently without losing others
- Tone selector per generation: educational, storytelling, promotional, vulnerable, direct

6.5 Long-Form Output: Blog Post and Article Generation
Any input type can be expanded into a full SEO-optimised blog post. This is a distinct output direction from short-form repurposing. The user chooses to repurpose short, expand long, or generate both simultaneously.


Blog Post Structure — Every Generated Article Includes
- SEO title with primary keyword front-loaded, under 60 characters
- Meta description under 160 characters with primary keyword and clear value proposition
- Estimated read time
- Definition block in the first paragraph: a self-contained answer to the primary query in 40 to 60 words, optimised for AI snippet extraction
- Structured body with H2 and H3 headings that mirror how people phrase search queries
- At least one comparison table, numbered list, or step-by-step block for structured content AI search engines cite
- Statistics and cited sources woven into the body — each statistic increases AI citation probability by up to 37 percent
- Internal linking suggestions noted in brackets for where the user should link to related content
- Primary keyword and three to five secondary keywords identified
- CTA at the end aligned with the user's brand profile
- FAQ section with natural-language questions and direct answers — optimised for featured snippet and AI Overview citation

Three Angle Variations for Blog Posts
Blog posts and articles use a two-step variation flow to avoid generating three full long-form articles unnecessarily.

- Step 1: System generates three headline and angle options with a brief description of each direction and a recommendation
- Step 2: User selects their preferred angle and the full article is generated for that angle only
This protects token usage and keeps the experience fast without sacrificing creative choice.

Content Atom Extraction
When a blog post is generated, ContentEngine also extracts content atoms — self-contained moments from the article that work as standalone social posts.

- Quotable moment: a bold claim or memorable line for X or LinkedIn
- Key statistic: a surprising number formatted as a social proof post
- Controversial take: a contrarian angle for X or LinkedIn
- Step extracted from a how-to section: suitable for TikTok or Instagram carousel

6.6 Marketing Skills Integration
ContentEngine's generation prompts are systematically informed by the coreyhaines31/marketingskills open-source library. This ensures every output follows proven marketing methodology rather than generic AI writing patterns.


Installation into the ContentEngine codebase:
npx skills add coreyhaines31/marketingskills
Skills install to .agents/skills/ directory. The AI coding agent reads relevant skill files before building each generation prompt.

6.7 Visual Output: Instagram Carousel
Produces a fully swipeable HTML carousel where every slide is designed for export as an individual PNG for Instagram, or compiled as a PDF for LinkedIn.

- Content derived from the same input used for text repurposing
- Brand profile informs tone, messaging, and CTA. Colour system derived from brand primary colour.
- Standard 7-slide narrative arc: Hero, Problem, Solution, Features, Details, How-to, CTA
- Arc adapts to content topic — not every carousel needs all seven slides
- Every slide includes progress bar and swipe arrow per the carousel design system
- Instagram export: individual 1080x1350px PNG files per slide
- LinkedIn export: single compiled PDF with all slides as pages — LinkedIn PDF carousel format which is currently one of the highest-performing content types on the platform
- Playwright used for export at correct device scale factor (420px layout, 2.57x scale to 1080px output)

6.8 Visual Output: TikTok Photo Mode Carousel
A distinct carousel format built for TikTok's Photo Mode and Instagram Reels multi-image posts. Different dimensions, different design energy, and different pacing from the Instagram carousel.


- Format: 9:16 vertical ratio at 1080x1920px
- 3 to 5 slides maximum — hook on slide one, value in the middle, payoff or CTA on the last slide
- Bold typography, high contrast, minimal text per slide — designed for fast thumb-scroll consumption
- Each slide carries one idea, one statement, or one step — no information density
- Exported as individual PNG files ready for TikTok Photo Mode upload
- Same Playwright pipeline as Instagram carousel — different HTML template and dimensions

6.9 Visual Output: Impact Card / Quote Card
A single-slide branded image built around the most powerful statement extracted from the content. Performs exceptionally well on faith channels, motivational accounts, and any niche where a bold declaration drives saves and shares.

Generation Logic
- System extracts the single most impactful statement from the content — the line most likely to stop a scroll
- User can regenerate with a different extracted statement if the first does not land
- Three background style options: solid white with heavy black type, solid black with white type, brand gradient with white type
- User sets their preferred default style in brand profile — applied automatically to every Impact Card generated

Brand Customisation
Subtle but deliberate. The message is always the hero. The branding claims ownership without fighting the content for attention.

- Brand handle or name displayed small at the bottom — e.g. @olaishola in 11px muted text. Enough to claim it, not enough to distract.
- Logo mark or brand initial in the corner at low opacity (10 to 15 percent) if stored in brand profile
- Thin accent bar — 4px along the bottom or left edge in brand primary colour. A single line of colour that makes the card distinctly theirs across a feed.
- Optional background tint: brand primary colour at 4 to 8 percent opacity on white or black base. Barely visible but consistently theirs.
- All customisation values pulled automatically from stored brand profile. Set once, applied everywhere. No manual customisation per card.

Export Formats
- 1080x1080px PNG for Instagram feed and Facebook
- 1080x1920px PNG for TikTok and Instagram Reels

6.10 Content History and Library
- All generations stored in Neon database linked to the user account
- History view shows date, input type, input preview, and platforms generated
- User can open any past generation and see all outputs including all three variations
- User can re-edit any saved output
- User can regenerate any past session with updated brand profile or tone
- Search by keyword across all saved generations

6.11 Onboarding Flow
- Step 1: Upload brand guide — PDF, DOCX, or Markdown. Skip option available.
- Step 2: Review extracted brand details. Edit any field before confirming.
- Step 3: Add API keys if BYOK mode. Platform subscribers skip this.
- After onboarding, user lands on main generation dashboard ready to create.


7. Technical Architecture
7.1 Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Server Actions keep API keys server-side by design |
| **Language** | TypeScript | Type safety across the full stack |
| **Package Manager** | pnpm | Faster installs, disk-efficient, stricter dependency resolution |
| **Styling** | Tailwind CSS + shadcn/ui | Maximum speed, zero custom CSS overhead, accessible by default |
| **Auth** | BetterAuth | Consistent across all Oladipupo Ishola products |
| **Database** | Neon (PostgreSQL) | Serverless Postgres, generous free tier, native Vercel integration |
| **ORM** | Prisma | Developer familiarity, best-in-class schema readability, uses `@prisma/adapter-neon` |
| **Rate Limiting** | Upstash Redis | Serverless Redis, sliding window, native Vercel integration |
| **AI** | Anthropic Claude (claude-3-5-sonnet) | Brand extraction + all generation prompts |
| **File Storage** | Cloudflare R2 | 10GB free, no egress fees — handles brand docs + carousel exports |
| **Visual Export** | Playwright | Headless browser for carousel PNG and PDF export |
| **Client State** | Zustand | Lightweight, minimal boilerplate for shared client state |
| **Server State** | Next.js Server Actions + React cache | No additional library overhead |
| **Deployment** | Vercel | Zero-config Next.js deployment |
| **Marketing Skills** | coreyhaines31/marketingskills | Installed via `npx skills add` to `.agents/skills/` |

7.2 Database Schema
users
- id, email, password_hash, role (admin | tester | subscriber), created_at, updated_at
brand_profiles
- id, user_id (FK), raw_document_url, extracted_data (JSON), primary_color, tone, niche, audience, handles (JSON), impact_card_style, created_at, updated_at
api_keys
- id, user_id (FK), anthropic_key_encrypted, wavespeed_key_encrypted, created_at
generations
- id, user_id (FK), input_type, input_content, tone_used, platforms (JSON array), output_direction (short | long | both), created_at
generation_outputs
- id, generation_id (FK), platform, variations (JSON array of 3), recommended_variation (1|2|3), recommendation_reason, hook_score, alternative_hooks (JSON), seo_data (JSON for YouTube and blog), carousel_url, tiktok_carousel_url, impact_card_url, created_at

7.3 API Route Structure

All data mutations are handled via Next.js Server Actions. There are no public REST API endpoints in V1. Every action is session-gated by BetterAuth middleware before execution.

```
app/
  actions/
    auth/
      sign-in.ts          → Email/password sign in
      sign-up.ts          → New account creation
      sign-out.ts         → Session termination
      oauth.ts            → Google + GitHub OAuth callbacks

    brand/
      upload-document.ts  → Accepts PDF/DOCX/MD, validates, stores to R2
      extract-brand.ts    → Sends document text to Claude, returns structured JSON
      save-profile.ts     → Persists confirmed brand_profile to Neon
      update-profile.ts   → Partial updates to existing brand profile

    generate/
      text.ts             → Text repurposing pipeline (3 variations + recommendation)
      blog.ts             → Long-form blog post generation (angle selection flow)
      carousel.ts         → Instagram + LinkedIn carousel HTML generation
      tiktok-carousel.ts  → TikTok Photo Mode carousel generation
      impact-card.ts      → Impact card / quote card generation
      export.ts           → Playwright PNG + PDF export trigger

    history/
      list.ts             → Paginated list of past generations
      get.ts              → Single generation with all outputs
      search.ts           → Keyword search across saved generations
      delete.ts           → Soft delete a generation record

    settings/
      save-api-keys.ts    → BYOK: encrypt + store Anthropic key
      delete-api-keys.ts  → Remove stored keys
```

7.4 Security Model
- All API keys stored server-side only — never accessible to the client
- BYOK keys encrypted with AES-256 before storage in Neon
- Every API route protected by BetterAuth session validation middleware
- Rate limiting per user per route using Upstash Redis sliding window
- Default limits: 10 text generations per hour, 5 exports per hour, 20 requests per minute per route
- Document uploads validated for file type (PDF, DOCX, MD only) and size (max 10MB) before processing
- All user data scoped to their account — no cross-user data access possible


8. User Experience
8.1 Key UX Principles
- Approachable first. Works for a non-technical faith channel creator and a developer equally. No jargon in labels or instructions.
- Mobile responsive. Every screen works on a phone. The user should generate content from their phone after a class.
- Three variations, one decision. Showing three options with a clear recommendation removes choice paralysis. The user decides in seconds.
- Nothing is lost. Every generation saved automatically including all three variations.
- Brand voice is invisible. The user does not think about applying their brand voice. It just happens.
- Output direction is explicit. The user consciously chooses to repurpose short, expand long, or both. Not a hidden setting.

8.2 Visual Design Direction

ContentEngine's visual identity is **pure black and white**. The product stands independently from the founder's personal brand. No accent colour is applied globally — the interface earns its authority through precision, space, and typography alone.

Design references: Vercel, Linear, Clerk.

**Core Principles**
- Dark mode first. Light mode available as a user toggle.
- Pure black (#000000) and pure white (#FFFFFF) as the only background values. No grey washes, no off-white softening.
- Neutral shadcn/ui theme as the component foundation — no colour overrides applied globally.
- One rule for colour in the interface: **user brand colours are only ever shown inside the brand profile section and on carousel/card previews**. The product shell stays monochrome.
- Typography does the heavy lifting. Sharp, high-contrast. One sans-serif display weight for headings. Clean body type.
- Borders and dividers are hairline (1px, low opacity) — space is used for hierarchy, not boxes.
- Motion is subtle. Fade-ins on generation output. No decorative animation.
- The generation output area is the hero of every screen. Interface chrome recedes. Content leads.

**Component Approach**
- shadcn/ui neutral palette, dark mode default
- Tailwind CSS utility classes only — no custom CSS files
- Consistent 4px spacing grid
- Cards have no shadow — they float on black with a hairline border

8.3 Core User Flow
- User logs in. First login triggers onboarding automatically.
- User selects output direction: Repurpose Short, Expand Long, or Both.
- User selects input type and pastes or uploads their content.
- User selects tone for this generation if different from brand profile default.
- User selects which platforms and output types they want.
- User hits Generate. Outputs stream in per platform.
- Each platform shows three variations with the recommended one highlighted. Two to three sentence recommendation explains the choice.
- User picks their preferred variation, edits if needed, copies or downloads.
- All outputs including all three variations saved to history automatically.


9. Pricing Model
V1 — Private and Tester Phase
- Founder (admin): uses own API keys stored in server environment variables
- Testers: BYOK mode. Must provide their own Anthropic API key. Zero cost to founder.
- No payment infrastructure in V1

V2 — Commercial Launch



10. V1 Build Plan
Designed for a solo builder working alongside other commitments. Target: 4 to 6 weeks from start to private deployment on Vercel. Organised by feature phase, not calendar week, to stay flexible around real-life commitments.

**Phase 1 — Project Foundation + Authentication**
Goal: A running Next.js app where every route is protected from day one. Auth is never retrofitted.
- Scaffold Next.js 15 with pnpm, TypeScript, Tailwind, shadcn/ui
- Install and configure BetterAuth (email/password + Google + GitHub OAuth)
- Implement session middleware — all routes protected by default, no exceptions
- Sign in, sign up, sign out pages built to final visual design spec
- User roles defined in schema: admin, tester, subscriber
- Neon database connected, Prisma schema initialised with users table
- Upstash Redis connected, rate limiting middleware wired to all server actions
- Deploy skeleton to Vercel — production environment established from day one
- Done when: Founder can log in via Google, all other routes return 401 unauthenticated

**Phase 2 — Brand Profile System**
Goal: The core intelligence layer. Every generation after this phase is brand-informed.
- Three-step onboarding flow triggered on first login, cannot be skipped
- File upload to Cloudflare R2 (PDF, DOCX, MD — validated for type and size)
- Brand extraction pipeline: document text → Claude system prompt → structured JSON
- User reviews and confirms extracted brand data before saving
- brand_profiles table and api_keys table created in Neon
- Brand profile injected automatically into all downstream generation prompts
- BYOK key entry, AES-256 encryption, storage in api_keys table
- Done when: Founder uploads their own brand guide and sees accurate extraction

**Phase 3 — Text Repurposing Engine**
Goal: The primary value delivery. One input, five platforms, three variations each.
- Content input UI: five input type cards, paste or upload flow
- Tone selector: educational, storytelling, promotional, vulnerable, direct
- Platform selector: X, Instagram caption, TikTok script, YouTube script, LinkedIn post
- Generation pipeline: brand profile + marketing skills + platform rules → 3 variations
- AI recommendation with plain English reasoning displayed per platform
- Hook analysis on every output: strength rating + two alternative hooks
- Regenerate individual platform output without losing others
- generations and generation_outputs tables live
- Done when: Founder pastes a LinkedIn post and receives three platform-ready variations per selected channel with a recommendation

**Phase 4 — Long-Form Blog Output**
Goal: SEO-optimised long-form content from any input.
- Two-step flow: three headline and angle options first, then full article for selected angle
- Full SEO blog structure: title, meta, definition block, H2/H3 body, comparison tables, FAQ
- Content atom extraction: quotable moment, key stat, controversial take, how-to step
- YouTube SEO layer: title, description, tags generated alongside YouTube script
- Done when: Founder generates a full SEO blog post from a YouTube transcript

**Phase 5 — Visual Outputs**
Goal: Carousel and card generation with export.
- Instagram carousel: 7-slide narrative arc, 1080x1350px, PNG per slide + compiled PDF
- LinkedIn PDF carousel: same pipeline, PDF format for LinkedIn native upload
- TikTok Photo Mode carousel: 9:16, 1080x1920px, 3–5 slides, bold minimal design
- Impact card: single-slide quote card, three background style options, brand customisation
- Playwright export pipeline: HTML template → headless browser → PNG/PDF → R2 storage
- Done when: Founder generates and exports a complete Instagram carousel to PNG files

**Phase 6 — Content History and Library**
Goal: Nothing is ever lost.
- History view: date, input type, input preview, platforms generated
- Open any past generation and see all outputs including all three variations
- Re-edit any saved output, regenerate with updated brand profile or tone
- Keyword search across all saved generations
- Done when: Founder can find and reuse a generation from two weeks ago

**Phase 7 — Polish and Private Deployment**
Goal: Production-ready, zero rough edges, deployed.
- Mobile responsive audit across all screens
- Usage dashboard for founder: total generations, platform breakdown, API cost estimate
- End-to-end testing of full generation flow
- Security audit of all server actions and R2 signed URLs
- Final Vercel production deployment with environment variables confirmed
- Onboard first three testers
- Done when: Three testers have signed up with BYOK and generated content


11. Success Metrics
V1 Metrics
- Founder generates and posts content using the tool at least 4 times per week
- Content generated covers all five platforms consistently
- Time from input to ready-to-post output is under 3 minutes
- No API key exposure incidents
- At least 3 testers onboarded and actively using the tool by end of week 6
- Founder is using the three variations feature and the recommended option lands correctly at least 70 percent of the time — tracked informally through usage patterns

V2 Metrics (Pre-launch Targets)
- 10 paying subscribers within 30 days of commercial launch
- Average session generates content for at least 3 platforms
- Monthly churn below 10 percent
- Average Anthropic API cost per user per month is at least 40 percent below subscription price after accounting for three variations per generation

12. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Claude API cost overrun** — 3 variations per platform per generation is token-heavy | Medium | High | BYOK in V1 means testers absorb their own costs. Monitor founder usage. Gate variation count in V2 prompts. |
| **Playwright export fails on Vercel** — serverless functions have limits for headless browsers | Medium | High | Decision gate at Phase 5: test Playwright on Vercel early. Fallback: use Browserless.io hosted service (has a free tier). |
| **Brand extraction inaccuracy** — Claude misreads poorly structured brand guides | Medium | Medium | Mandatory user review step before saving. User can edit any field. Generic voice fallback if upload is skipped. |
| **Cloudflare R2 integration complexity** — unfamiliar SDK for file uploads | Low | Medium | Use official `@aws-sdk/client-s3` with R2 endpoint — R2 is S3-compatible. Well-documented pattern. |
| **Claude response latency** — 3 variations takes longer than a single generation | High | Medium | Stream generation output per platform. Show skeleton loaders. Display outputs as they arrive, not all at once. |
| **Scope creep into V2 features** — video generation, calendar, analytics are tempting | High | High | Defer list is explicit in the PRD. Any V2 feature request goes to a backlog document, not the codebase. |
| **Security gap in BYOK key storage** — AES-256 implementation error | Low | Critical | Use a battle-tested Node.js crypto implementation. Add `/security-audit` review before first tester onboarding. |
| **Single brand profile per user becomes a constraint** — power users want multiple brands | Low | Low | Explicitly deferred to V2. Communicate this to testers upfront. |

13. Open Questions
- What is the final product name? Working title ContentEngine used until decided.
- What are the exact V2 subscription price points? Determined after V1 usage data.
- Should carousel export run server-side on Vercel or via a hosted browser service? Decision needed before Week 4 build.
- Does V1 support multiple brand profiles per user? Current answer: no. Single profile per user in V1.
- Should the three variations feature be available on all plans in V2, or gated to Creator? Decision based on API cost data from V1.
- What is the video generation allowance per plan in V2? Requires WaveSpeed cost analysis per model before decision.

14. System Prompts Reference
Ready-to-use system prompts for the AI coding agent building the generation pipeline.

Brand Extraction System Prompt
Store as a constant in lib/prompts/brand-extraction.ts. The document text goes in the user message. This prompt goes in the system field.

You are a brand intelligence extraction system. Read the document and extract structured brand information. Return ONLY a valid JSON object with these fields: brand_name, tagline, niche, audience, tone_of_voice, content_pillars (array), key_phrases (array), avoid_phrases (array), platform_handles (object with linkedin/instagram/x/tiktok/youtube), cta_style, brand_values (array), unique_positioning, primary_color, font. If a field cannot be found, return null. Never invent information not in the document. Return only raw JSON. No preamble. No markdown fences.

15. Appendix
Reference Products Studied
- Blotato (blotato.com) — content creation and repurposing platform. Reference for pricing model, credit system, and multi-platform publishing approach.
- WaveSpeed AI (wavespeed.ai) — unified AI media generation platform with 1000+ models via single API key. Selected as V2 video and image generation provider.
- Linear, Raycast, Clerk — referenced for clean, approachable-but-sharp design direction.

Key Technical and Skill References
- coreyhaines31/marketingskills — open-source marketing skills library. Install: npx skills add coreyhaines31/marketingskills. Skills used: social-content, ai-seo, seo-audit, copywriting, content-strategy, launch-strategy.
- Instagram Carousel Design System — established carousel skill with Playwright export pipeline. Integrated directly into ContentEngine carousel output feature.
- BetterAuth — authentication library used across all Oladipupo Ishola products for stack consistency.
- Upstash Redis — rate limiting implementation.
- Remotion — programmatic video generation library. Deferred to V2.

ContentEngine PRD v2.0 — Oladipupo Ishola — May 2026 — Confidential