# Phase 4: Long-Form Blog Output

## Goal
Any content input can be expanded into a full SEO-optimised blog post that is structured for both traditional search and AI search engine citation. This is a distinct output direction from short-form repurposing.

**Demo at end of phase**: Founder pastes a YouTube transcript, selects "Expand Long", sees three headline and angle options with a recommendation, selects one, and receives a complete SEO blog post with meta description, structured headings, FAQ section, and a list of content atoms extracted from the article.

---

## Acceptance Criteria

- [ ] "Expand Long" direction triggers the blog output pipeline, not the short-form pipeline
- [ ] **Step 1 — Angle selection**: Three headline + angle options generated with a brief description of each direction and an AI recommendation. User selects preferred angle before full article is generated.
- [ ] **Step 2 — Full article generation**: Complete blog post generated for the selected angle only (not all three — protects token usage)
- [ ] Generated blog post always includes:
  - [ ] SEO title: primary keyword front-loaded, under 60 characters
  - [ ] Meta description: under 160 characters, primary keyword present, clear value proposition
  - [ ] Estimated read time
  - [ ] Definition block in first paragraph: 40–60 words, optimised for AI snippet extraction
  - [ ] Structured body: H2 and H3 headings that mirror how people phrase search queries
  - [ ] At least one comparison table, numbered list, or step-by-step block
  - [ ] Statistics and cited sources woven into body
  - [ ] Internal linking suggestions in brackets
  - [ ] Primary keyword + 3–5 secondary keywords identified
  - [ ] CTA at end aligned with brand profile
  - [ ] FAQ section: natural-language questions + direct answers
- [ ] **YouTube SEO layer**: When input type is YouTube transcript, additionally generate: video title, description, and tags alongside the script
- [ ] **Content atom extraction**: After blog post generation, extract 4 atoms:
  - Quotable moment (for X or LinkedIn)
  - Key statistic (formatted as social proof post)
  - Controversial take (for X or LinkedIn)
  - How-to step (for TikTok or Instagram carousel)
- [ ] Blog output saved to `generation_outputs` table linked to the parent generation
- [ ] Rate limiting: blog generation counts against the same 10 generations/hour limit

---

## Architecture Decisions

- **Two-step flow**: Do NOT generate the full article in the first call. Generate headlines and angles first (cheap), then the full article only after user selection (expensive). This is both better UX and token-efficient.
- **ai-seo skill**: Load the `ai-seo` skill from marketingskills into the blog generation system prompt. This informs SEO structure decisions.
- **Content atoms**: Extracted in a separate Claude call after the full article — pass the article as input and ask for the four atoms. Clean separation of concerns.
- **YouTube SEO**: Conditional branch in the generation action — if `input_type === 'youtube_transcript'`, append the SEO layer generation to the same call or as a follow-up call.

---

## Key Files to Create

```
app/
  (dashboard)/
    generate/
      blog/
        page.tsx                        ← Blog angle selection UI
        [id]/page.tsx                   ← Full article view

lib/
  prompts/
    blog-angle.ts                       ← Headline + angle generation prompt
    blog-article.ts                     ← Full article generation prompt
    content-atoms.ts                    ← Content atom extraction prompt
    youtube-seo.ts                      ← YouTube title/description/tags prompt

actions/
  generate/
    blog.ts                             ← Two-step blog generation action
    youtube-seo.ts                      ← YouTube SEO layer action
    extract-atoms.ts                    ← Content atom extraction action

components/
  blog/
    angle-selector.tsx                  ← Three angle cards with recommendation
    blog-output.tsx                     ← Full article display with copy button
    seo-metadata-panel.tsx              ← Title, meta, keywords sidebar
    content-atoms-panel.tsx             ← Four extracted atoms with copy buttons
    youtube-seo-panel.tsx               ← Title, description, tags
```

---

## Dependencies

- Phase 1 complete (auth)
- Phase 2 complete (brand profile injection)
- Phase 3 complete (base generation pipeline pattern established — blog reuses the same prompt injection architecture)

---

## Testing Checklist (agent-tdd targets)

- Angle generation returns exactly 3 options with distinct directions
- Recommendation identifies one angle with reasoning
- Full article is only generated after user selects an angle (not all three auto-generated)
- Generated article includes all required sections (SEO title, meta, definition block, H2/H3, FAQ, CTA)
- SEO title is under 60 characters
- Meta description is under 160 characters
- Content atom extraction returns exactly 4 atoms (quotable, stat, take, how-to)
- YouTube SEO generation only triggers when input type is `youtube_transcript`
- Blog output saved to `generation_outputs` with `platform = 'blog'`
