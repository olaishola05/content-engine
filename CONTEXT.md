# Project Context: ContentEngine

> AI-Powered Content Repurposing Platform — Private tool first, then commercial SaaS.

---

## 🚀 What This Is

ContentEngine takes **one piece of content** and produces a **full content pack**:
- Platform-optimised text (X, Instagram, TikTok, YouTube, LinkedIn)
- Long-form SEO blog posts
- Instagram carousels (PNG + PDF export)
- TikTok Photo Mode carousels
- Impact / Quote cards

**Every output is automatically informed by the user's stored brand profile** — the system repurposes content in their voice, for their audience, optimised per platform.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router, Server Actions) |
| **Auth** | BetterAuth (email/password + Google + GitHub OAuth) |
| **Database** | Neon (PostgreSQL) |
| **Rate Limiting** | Upstash Redis (sliding window) |
| **AI** | Anthropic Claude (brand extraction + generation) |
| **Visual Export** | Playwright (carousel → PNG / PDF) |
| **Marketing Skills** | coreyhaines31/marketingskills |
| **Video (V2)** | WaveSpeed AI + Remotion |

---

## 🏛 Architecture

- All API calls routed through **Next.js Server Actions** — keys NEVER exposed to client
- BYOK keys encrypted with **AES-256** before storage
- Every route protected by BetterAuth session middleware
- Rate limits: 10 text generations/hour, 5 exports/hour, 20 req/min per route

---

## 🗄 Database Schema

```
users              → id, email, password_hash, role (admin|tester|subscriber)
brand_profiles     → id, user_id, raw_document_url, extracted_data (JSON), primary_color, tone, niche, audience, handles, impact_card_style
api_keys           → id, user_id, anthropic_key_encrypted, wavespeed_key_encrypted
generations        → id, user_id, input_type, input_content, tone_used, platforms, output_direction
generation_outputs → id, generation_id, platform, variations (JSON x3), recommended_variation, hook_score, carousel_url, impact_card_url
```

---

## 📋 V1 Scope (4–6 weeks)

**INCLUDED:**
- BetterAuth authentication (email + Google + GitHub)
- Brand profile upload (PDF/DOCX/MD → Claude extracts structured JSON)
- 5 content input types (LinkedIn, YouTube transcript, blog, topic/idea, document)
- Text repurposing → X, Instagram caption, TikTok script, YouTube script
- **3 variations per platform** with AI recommendation + reasoning
- Long-form SEO blog post generation
- Hook scoring + alternative hook suggestions
- Instagram carousel (1080×1350px PNG + PDF)
- LinkedIn PDF carousel
- TikTok Photo Mode carousel (1080×1920px)
- Impact / Quote card generation
- Content history & library (all generations saved + searchable)
- BYOK mode for invited testers
- Mobile responsive UI

**DEFERRED to V2:**
- Remotion / WaveSpeed video generation
- Stripe billing + subscriptions
- Content calendar
- Auto-posting & scheduling
- Analytics per content piece
- Team accounts + multiple brand profiles

---

## 🔑 Key Conventions

- **Git**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- **Auth**: BetterAuth — consistent across all Oladipupo Ishola products
- **API Keys**: Server-side only, AES-256 encrypted, never client-exposed
- **Marketing Prompts**: Informed by `coreyhaines31/marketingskills`
- **Brand Voice**: Injected automatically into every generation — user never thinks about it
- **Variations**: Always 3 per output with a recommended one and a plain-English reason

---

## 📁 Key File Locations

```
lib/prompts/brand-extraction.ts    → Brand extraction system prompt
.agents/skills/                    → marketingskills installed here (npx skills add)
resources/design/                  → Saved design systems (Refero / awesome-design-md)
plans/                             → prd-to-plan output lives here
```

---

## 🎯 Success Metrics (V1)

- Founder generates + posts content 4×/week using the tool
- Time from input to ready-to-post output: **under 3 minutes**
- 3 testers onboarded + active by end of week 6
- Recommended variation lands correctly ≥ 70% of the time

---

## ❓ Open Decisions

- Final product name (working title: ContentEngine)
- V2 subscription price points
- Server-side carousel export vs hosted browser service (decide before Week 4)
- V2: three variations gated or available on all plans?

---

## 📚 Reference Products

- **Blotato** (blotato.com) — pricing model + credit system reference
- **WaveSpeed AI** — V2 video/image provider
- **Linear, Raycast, Clerk** — visual design direction reference
