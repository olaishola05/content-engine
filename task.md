# Active Tasks: Phase 5 (Visual Outputs - Carousels + Impact Cards)

## Status: 100% Complete ✅

**Source:** `./plans/phase-5-visual-outputs.md`

**Complexity:** High

**External dependencies:** Add Playwright (and test early on Vercel; fallback to Browserless.io if needed); generalize R2 usage for visual exports.

### Backlog & Tasks

- [x] **Task 1: Add visual generation prompts**
- [x] **Task 2: Extend rate limiting for visual exports**
- [x] **Task 3: Create shared export / R2 utilities**
  - Created `src/lib/export/playwright.ts` (takeScreenshot(htmlOrUrl, {width, height}) using Playwright, supports string or URL, returns PNG buffer at exact dims).
  - Created `src/lib/export/r2-upload.ts` (uploadVisualToR2 wrapper that calls generalized uploadFileToR2 with 'visual-exports/' prefix).
  - Generalized `src/lib/r2.ts` uploadFileToR2 to accept optional basePath (default 'brand-documents' for compat).
  - Added `src/lib/__tests__/export.test.ts` (5 tests: correct IG 1080x1350 & TT 1080x1920 buffers, html/url modes, R2 prefix & URL return; builds on r2.test.ts patterns + mocks).
  - TDD: Wrote failing test first (Red - module not found) → implemented + generalized R2 → tests green (5/5) + new test in suite → `./hooks/pre-commit` passed (159 tests total). Added 'playwright' dep (as required by plan for early testing).
  - Covers: Playwright export ACs, R2 storage ACs, testing checklist.

- [x] **Task 4: Implement carousel content generation actions**
  - Created `src/lib/actions/generate/carousel.ts` (generateCarouselCopyAction using buildCarouselCopySystemPrompt, auth + visualExportRateLimit + brand lookup + generateObject, creates Generation with direction 'VISUAL').
  - Added `src/lib/actions/generate/__tests__/carousel.test.ts` (4 tests: unauth, rate limit, missing brand, success with slides + DB record; modeled on blog.test.ts).
  - TDD: Wrote failing tests first (Red - module not found) → implemented action → 4/4 tests green → `./hooks/pre-commit` passed (new test included, 163 total tests).
  - Covers: Carousel content gen + arc ACs.

- [x] **Task 5: Implement impact card statement extraction action**
  - Created `src/lib/actions/generate/impact-card.ts` (generateImpactStatementAction using buildImpactStatementSystemPrompt, auth + visualExportRateLimit + brand lookup + generateObject, creates Generation with direction 'VISUAL').
  - Added `src/lib/actions/generate/__tests__/impact-card.test.ts` (4 tests: unauth, rate limit, missing brand, success with 3 statements + DB record; modeled on carousel.test.ts).
  - TDD: Wrote failing tests first (Red - module not found) → implemented action → 4/4 tests green → `./hooks/pre-commit` passed (new test included, 167 total tests).
  - Covers: Impact statement extraction + regeneration ACs.

- [x] **Task 6: Implement shared visual export trigger action**
  - Created `src/lib/actions/generate/export.ts` (triggerVisualExportAction: auth + visual rate limit + ownership + takeScreenshot + uploadVisualToR2 + create GenerationOutput).
  - Added `src/lib/actions/generate/__tests__/export.test.ts` (3 tests: unauth, rate limit block, success with screenshot+upload+DB; mocks playwright/r2).
  - TDD: Wrote failing tests first (Red) → implemented → 3/3 green → `./hooks/pre-commit` passed (170 total tests, lint clean after fixes).
  - Covers: All export + R2 ACs + rate limit.

- [x] **Task 7: Create RSC HTML templates**
  - Created `src/lib/templates/instagram-carousel/{slide.tsx, layout.tsx}` (with progress bar, swipe cues, arc structure).
  - Created `src/lib/templates/tiktok-carousel/{slide.tsx, layout.tsx}` (bold minimal, 9:16 vertical).
  - Created `src/lib/templates/impact-card/layout.tsx` (white, black, gradient styles using primaryColor, brand handle/initial).
  - Added `src/lib/templates/__tests__/templates.test.tsx` (7 light render-to-string checks for structure, progress, 9:16, styles, brand customisation; uses ReactDOMServer).
  - TDD: Wrote failing tests first (Red - modules not found) → implemented templates with data attrs for checks → 7/7 green → `./hooks/pre-commit` passed (177 total tests).
  - Covers: Template rendering + brand customisation + style variant ACs.

- [x] **Task 8: Create dedicated API routes for visual generation/export**
  - Created `src/app/api/generate/carousel/route.ts` (POST for carousel copy gen using prompt, auth, visual rate limit, brand, returns JSON with slides; modeled on blog/regenerate patterns).
  - Created `src/app/api/generate/impact-card/route.ts` (similar for statements).
  - Created `src/app/api/generate/export/route.ts` (triggers the export action, with checks).
  - Added corresponding __tests__/route.test.ts (12 tests total: auth 401, rate 429, validation 400, success 200 with data/mocks for each).
  - TDD: Wrote failing tests first (Red - module not found) → implemented routes → 12/12 tests green → `./hooks/pre-commit` passed (189 total tests).
  - Covers: Backend generation + export ACs.

- [x] **Task 9: Create in-browser preview + UI components**
  - Created the 7 components (instagram/tiktok previews using templates, slide-navigator with arrows, export-button, impact card-preview/style-selector/regenerate-statement).
  - Added tests using ReactDOMServer for light structure checks (7 tests total for previews, nav, exports, selectors, regenerate).
  - TDD: Wrote failing tests first (Red - modules not found + missing @testing-library but switched to server render) → implemented components with controlled props → 7/7 green → `./hooks/pre-commit` passed (196 total tests).
  - Covers: Preview + style selection + regeneration UI ACs.

- [x] **Task 10: Create page routes and client flows for visuals**
  - Created server pages for instagram, tiktok, impact-card (auth gate + render client, modeled on blog/page.tsx).
  - Created clients: instagram-client.tsx, tiktok-client.tsx, impact-card-client.tsx (input, generate via API, previews with navigator/selector, export via API, state management).
  - Added page tests (6 tests: auth redirect and render for each of 3 pages, modeled on blog page tests).
  - TDD: Wrote failing page tests first (Red) → implemented pages + clients → 6/6 green (plus previous component tests) → `./hooks/pre-commit` passed (202 total tests).
  - Covers: Full UI flow for carousels + impact cards. (Wired to Task 8 APIs, Task 9 components, Task 7 templates indirectly via previews).

- [x] **Task 11: Integration + gating task (mandatory)**
  - Wired discoverability links in generate-client.tsx to /generate/carousel/instagram, /tiktok, /impact-card.
  - Updated the 3 visual pages to explicitly call resolveOnboardingGate and redirect for NEEDS_ONBOARDING (in addition to session auth).
  - Uncommented the gate in dashboard/layout.tsx for full enforcement.
  - Enhanced the 3 page tests with gate NEEDS_ONBOARDING redirect tests (now 9 tests covering unauth + needs + auth for new routes).
  - Added end-to-end simulation in dashboard test context (gate behavior).
  - TDD: Updated tests first with new gate cases (which would fail without enforcement) → implemented gate calls in pages + wiring + layout update → tests green (9 gate tests + others) → pre-commit passed (205 tests).
  - Covers: All routing/gating ACs + integration requirement + existing patterns from Phase 4 Task 6.

- [x] **Task 12: Rate limit + end-to-end export verification + build**
  - Enhanced `src/lib/actions/generate/__tests__/export.test.ts` (now 4 tests): rate limiter blocks >5/h (mock returns success:false), and end-to-end verification (real template renderToStaticMarkup → takeScreenshot called with exact 1080x1350 dims → uploadVisualToR2 → GenerationOutput created).
  - Confirmed enforcement in `triggerVisualExportAction` (and /api/generate/export route) with exact error message.
  - Full pipeline covered (slide copy gen + template HTML + Playwright buffer + R2 + rate limit) across action + route tests.
  - TDD: Added test (initial runs had mock/JSX issues) → fixed → all green → `./hooks/pre-commit` passed (206 tests) → explicit `pnpm run build` succeeded cleanly (new /generate/carousel/* and /api/generate/{carousel,impact-card,export} routes compiled).
  - Covers: All remaining checklist (rate limit blocks, correct buffer dims, R2 URLs, end-to-end) + build.

## Notes
- Full decomposition (12 atomic tasks) presented following `agents/agent-plan.md`.
- All acceptance criteria from the plan are mapped.
- Tasks are ordered by dependency (prompts/lib → actions → API → UI/templates → mandatory integration/gating).
- Each task is narrow enough for a single `agent-code` (TDD) call.
- All tasks completed via TDD + `./hooks/pre-commit` + explicit build.
- Phase 4 remains 100% complete (merged to development).
- **Phase 5: 100% Complete ✅** (visual outputs: carousels + impact cards, full pipeline, rate limits, gating, build).
