# Phase 5: Visual Outputs (Carousels + Impact Cards)

## Goal
The same content input that generates text also generates shareable visual assets: Instagram carousels, LinkedIn PDF carousels, TikTok Photo Mode carousels, and Impact / Quote cards — all exported as real image files.

**Demo at end of phase**: Founder generates an Instagram carousel from a LinkedIn post, sees the 7-slide preview in-browser, downloads 7 individual 1080×1350px PNG files and a compiled PDF. The founder also generates a TikTok carousel (3 slides, 1080×1920px) and an impact card with their handle and brand accent line.

---

## Acceptance Criteria

### Instagram Carousel
- [ ] 7-slide narrative arc: Hero, Problem, Solution, Features, Details, How-to, CTA
- [ ] Arc adapts to content — not every carousel requires all 7 slides
- [ ] Every slide includes progress bar and swipe arrow
- [ ] HTML template renders at 420px width (2.57× scale factor for 1080px output)
- [ ] Playwright exports each slide as an individual 1080×1350px PNG
- [ ] All slides compiled into a single PDF for LinkedIn native upload
- [ ] Files stored to Cloudflare R2, download URLs returned to client
- [ ] Export counts against rate limit: max 5 exports/hour per user

### TikTok Photo Mode Carousel
- [ ] 3–5 slides maximum — hook on slide 1, value in middle, CTA on last
- [ ] Bold typography, high contrast, minimal text per slide
- [ ] One idea / one statement / one step per slide — no information density
- [ ] HTML template at 1080×1920px (9:16 vertical)
- [ ] Playwright exports each slide as individual 1080×1920px PNG
- [ ] Files stored to Cloudflare R2

### Impact Card / Quote Card
- [ ] System extracts the single most impactful statement from the content
- [ ] User can regenerate with a different extracted statement
- [ ] Three background style options:
  - [ ] Solid white with heavy black type
  - [ ] Solid black with white type
  - [ ] Brand gradient with white type (uses `primary_color` from brand profile)
- [ ] Brand customisation applied from brand profile:
  - [ ] Brand handle at bottom (11px muted text)
  - [ ] Logo mark / brand initial in corner at 10–15% opacity (if stored)
  - [ ] 4px accent bar in brand primary colour along bottom or left edge
  - [ ] Optional background tint at 4–8% opacity
- [ ] User's preferred default style set in brand profile, applied automatically
- [ ] Export sizes: 1080×1080px (Instagram) and 1080×1920px (TikTok/Reels)
- [ ] Files stored to Cloudflare R2

---

## Architecture Decisions

- **Playwright pipeline**: HTML template → Playwright headless browser → screenshot at correct device scale factor → R2 upload. One shared pipeline, different templates and dimensions.
- **Carousel HTML templates**: React Server Components render the carousel HTML server-side. Playwright opens a local URL or HTML string. Do NOT use client-side canvas.
- **Playwright on Vercel**: Test this early. If Playwright cold-start times are too slow on Vercel serverless, fallback is Browserless.io (has a free tier with a REST API — no Playwright install needed on Vercel).
- **Slide content generation**: A separate Claude call generates the slide copy from the input content. The carousel layout engine then places the copy into the HTML template.
- **Impact card statement extraction**: Short Claude call — pass the content, ask for the single most impactful sentence. Return 3 options so user can pick or regenerate.

---

## Key Files to Create

```
app/
  (dashboard)/
    generate/
      carousel/
        instagram/page.tsx
        tiktok/page.tsx
      impact-card/page.tsx

lib/
  prompts/
    carousel-copy.ts                  ← Slide copy generation prompt
    impact-statement.ts               ← Impactful quote extraction prompt
  export/
    playwright.ts                     ← Playwright screenshot helper
    r2-upload.ts                      ← Upload buffer to R2, return signed URL
  templates/
    instagram-carousel/
      slide.tsx                       ← Individual slide HTML component
      layout.tsx                      ← Full carousel shell
    tiktok-carousel/
      slide.tsx
      layout.tsx
    impact-card/
      layout.tsx                      ← Three style variants

actions/
  generate/
    carousel.ts                       ← Instagram + LinkedIn carousel generation
    tiktok-carousel.ts
    impact-card.ts
    export.ts                         ← Playwright export trigger (all types)

components/
  carousel/
    instagram-preview.tsx             ← In-browser preview (scaled down)
    tiktok-preview.tsx
    slide-navigator.tsx               ← Arrow navigation through slides
    export-button.tsx                 ← Download PNG / Download PDF
  impact-card/
    card-preview.tsx
    style-selector.tsx                ← Three background style options
    regenerate-statement.tsx
```

---

## Dependencies

- Phase 1 complete (auth, rate limiting)
- Phase 2 complete (brand profile — needed for impact card customisation and colour)
- Phase 3 complete (generation pipeline pattern)

---

## Testing Checklist (agent-tdd targets)

- Carousel copy generation returns correct number of slides (≤7 for Instagram, 3–5 for TikTok)
- Playwright screenshot produces a buffer at the correct dimensions (1080×1350 Instagram, 1080×1920 TikTok)
- R2 upload returns a valid signed URL
- Impact card extraction returns 3 statement options from the input
- Export rate limiter blocks >5 exports/hour
