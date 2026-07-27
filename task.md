# Active Tasks: Phase 7 (Polish and Private Deployment)

## Status: ✅ Complete (Tasks 1-8 done)

**Source:** `plans/phase-7-polish.md` + Approved `implementation_plan.md`

### Backlog & Tasks

- [x] **Task 1: Add custom role and encrypted API key support to Prisma schema & BetterAuth**
  - What: Update `schema.prisma` with `encryptedAnthropicApiKey` on `User`. Configure `role` custom field and `before` hook in `auth.ts` to auto-assign roles (founder as admin, others as tester during beta).
  - TDD Target: Test role mapping and creation hooks.
  - Verification: Run prisma migration/client generation.

- [x] **Task 2: Implement server action to save/update tester API key**
  - What: Create `saveUserApiKeyAction(key)` server action in `src/lib/actions/brand/save-api-key.ts` with validation and encryption.
  - TDD Target: Write unit tests in `save-api-key.test.ts` for valid keys, encryption, and authentication checks.

- [x] **Task 3: Update onboarding review form and onboarding gate**
  - What: Update `gate.ts` to gate testers without keys. Update `ReviewForm.tsx` to prompt testers for keys and save them.
  - TDD Target: Update page/gate tests.

- [x] **Task 4: Update Playwright helper for Browserless.io support**
  - What: Update `playwright.ts` to use `connectOverCDP` if `BROWSERLESS_WS_URL` is set.
  - TDD Target: Mock connection and test fallback behavior.

- [x] **Task 5: Update generation routes to support BYOK & decryption error handling**
  - What: Update `src/app/api/generate/*` routes to decrypt tester keys and initialize custom Anthropic client via shared `resolveAnthropicModel`. Removed per-route ANTHROPIC_API_KEY guards in favor of centralized handling (supports pure BYOK for testers without server env key). Added MISSING/DECRYPTION error propagation.
  - TDD Target: Completed (target-isolated route tests updated first for each).

- [x] **Task 6: Create responsive Header component (`DashboardHeader`)**
  - What: Create `src/components/dashboard-header.tsx` with mobile drawer and hook it into `src/app/(dashboard)/layout.tsx`. Remove headers from child pages.
  - TDD Target: Test mobile header toggle state and layout styling.

- [x] **Task 7: Create settings page (`/dashboard/settings`)**
  - What: Create `settings/page.tsx` for updating brand profile and rotating API keys.
  - TDD Target: Test settings rendering and key update action call.

- [x] **Task 8: Implement admin statistics action (`get-stats.ts`) and Admin Dashboard (`/dashboard/admin`)**
  - What: Implement admin-only stats action and dashboard page with stats-cards and platform-chart (SVG/CSS chart). Return 403 Forbidden for non-admins.
  - TDD Target: Test admin-only authorization and stats calculations.
