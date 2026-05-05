# Phase 3: Text Repurposing Engine

## Goal
The primary value delivery. The founder pastes one piece of content, selects platforms, and receives three brand-informed variations per platform with an AI recommendation — all informed by the brand profile established in Phase 2.

**Demo at end of phase**: Founder pastes a LinkedIn post, selects X and Instagram caption, hits Generate, and sees three streaming variations per platform. Each variation has a hook strength score and two alternative hooks. The recommended variation is highlighted with a plain English reason.

---

## Acceptance Criteria

- [ ] Main generation dashboard UI live
- [ ] Input type selector: five cards (LinkedIn post, YouTube transcript, blog article, topic/idea, document upload)
- [ ] Output direction selector: **Repurpose Short** | **Expand Long** | **Both**
- [ ] Platform selector (multi-select): X, Instagram caption, TikTok script, YouTube script, LinkedIn post
- [ ] Tone selector (per generation): educational, storytelling, promotional, vulnerable, direct
- [ ] Brand profile auto-injected into every generation prompt — user never selects it
- [ ] marketingskills library installed: `npx skills add coreyhaines31/marketingskills` → `.agents/skills/`
- [ ] Relevant skills (social-content, copywriting, content-strategy) loaded into generation prompts
- [ ] Three variations generated per selected platform, each with a distinct angle:
  - Variation 1: Curiosity / open-loop
  - Variation 2: Bold claim / direct statement
  - Variation 3: Personal story / experience
- [ ] AI recommendation: one variation highlighted per platform with 2–3 sentence reasoning
- [ ] Hook analysis per output: strength assessment + two alternative hook options
- [ ] Outputs stream in — user sees text appearing as Claude generates, not a spinner then a wall of text
- [ ] Regenerate individual platform output without losing other platform outputs
- [ ] `generations` and `generation_outputs` tables live in Neon
- [ ] Every generation + all three variations auto-saved to database on completion
- [ ] Rate limiting enforced: 10 text generations per hour per user

---

## Platform Rules (baked into prompts)

| Platform | Character limit | Key rules |
|---|---|---|
| X (Twitter) | 280 chars | Hook in first line. No filler. Punchy ending. |
| Instagram caption | 2,200 chars | Hook above fold. Line breaks for readability. CTA at end. |
| TikTok script | ~60 seconds spoken | Hook in first 3 seconds. Pattern interrupts. Spoken-word rhythm. |
| YouTube script | Variable | Strong hook. Chapters implicit. CTA before outro. |
| LinkedIn post | 3,000 chars | First line is everything. Story or insight. No hashtag spam. |

---

## Architecture Decisions

- **Streaming**: Use Anthropic SDK `stream()` method + Next.js streaming response. Client uses `useEffect` to read chunks.
- **Three variations in one call**: Generate all three in a single Claude call using a structured output prompt. Cheaper and faster than three separate calls.
- **marketingskills**: Skills files are read at build time and injected as context strings into the system prompt. Not called at runtime.
- **Recommendation logic**: Part of the Claude prompt — ask Claude to evaluate its own variations and recommend one with reasoning. Not a separate call.

---

## Key Files to Create

```
app/
  (dashboard)/
    generate/
      page.tsx                        ← Main generation UI

lib/
  prompts/
    text-generation.ts                ← Generation system prompt with platform rules
    recommendation.ts                 ← Recommendation prompt fragment
    hook-analysis.ts                  ← Hook scoring prompt fragment
  db/
    schema.ts                         ← ADD: generations, generation_outputs tables
  skills/
    loader.ts                         ← Reads .agents/skills/ files into prompt strings

actions/
  generate/
    text.ts                           ← Core generation server action (streaming)

components/
  generate/
    input-type-selector.tsx
    platform-selector.tsx
    tone-selector.tsx
    direction-selector.tsx
    generation-output.tsx             ← Streaming output display
    variation-card.tsx                ← Single variation with recommendation badge
    hook-analysis-card.tsx
    regenerate-button.tsx
```

---

## Environment Variables Required

```
# Already set in Phase 2
ANTHROPIC_API_KEY=
```

---

## Dependencies

- Phase 1 complete (auth, session, rate limiting)
- Phase 2 complete (brand profile loaded + injected)

---

## Testing Checklist (agent-tdd targets)

- Text generation action returns exactly 3 variations per platform
- Each variation has distinct angle (curiosity / bold claim / story)
- Recommendation field identifies one of the three variations (1, 2, or 3)
- Hook analysis returns a strength label + exactly 2 alternative hooks
- Output saved to `generation_outputs` table after streaming completes
- Regenerating one platform does not overwrite other platform outputs
- Rate limiter blocks generation after 10 requests/hour
- Brand profile fields appear in the generated output (tone, key phrases, avoid phrases respected)
- Unauthenticated user cannot trigger generation action
