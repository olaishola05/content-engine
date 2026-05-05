# Phase 7: Polish and Private Deployment

## Goal
Take the functional app and make it production-ready. Zero rough edges, fully tested, and securely deployed on Vercel for the first invited testers.

**Demo at end of phase**: Founder navigates the app entirely on their iPhone, views their usage dashboard, and successfully onboards 3 BYOK testers who generate content without any errors.

---

## Acceptance Criteria

- [ ] Comprehensive mobile-responsive audit:
  - [ ] Navigation collapses to a mobile menu/drawer
  - [ ] Generation UI and platform outputs stack cleanly on small screens
  - [ ] Carousel previews scale down to fit viewport without horizontal scroll
- [ ] Founder Dashboard (`/dashboard/admin`):
  - [ ] Total generations count
  - [ ] Breakdown of generations by platform
  - [ ] Estimated API cost (calculated by multiplying total generations by estimated token cost)
- [ ] End-to-end user flow test: Sign up → Brand Onboarding → Short-form Generation → Blog Generation → Carousel Export
- [ ] Security audit:
  - [ ] Run `/security-audit` slash command across the codebase
  - [ ] Verify all Server Actions validate session via BetterAuth
  - [ ] Verify R2 export URLs are properly signed and expire
  - [ ] Verify BYOK keys are encrypted and decrypted correctly
- [ ] Final Vercel deployment checks:
  - [ ] Production environment variables confirmed (Neon, Upstash, BetterAuth, R2)
  - [ ] Playwright (or Browserless fallback) functioning in Vercel production environment
- [ ] Invite first 3 testers via email link or manual account creation
- [ ] Ensure testers are prompted for their Anthropic API key during onboarding

---

## Architecture Decisions

- **Admin Dashboard**: Built specifically for the founder (role: `admin`). Access denied to `tester` and `subscriber` roles.
- **Mobile First**: All Tailwind classes should follow `mobile-first` paradigm (e.g., `flex-col md:flex-row`).
- **Cost Estimation**: V1 does not require exact token counting. A simple heuristic based on generation count is sufficient for the founder dashboard.

---

## Key Files to Create

```
app/
  (dashboard)/
    admin/
      page.tsx                        ← Founder usage dashboard

actions/
  admin/
    get-stats.ts                      ← Fetch usage statistics (admin only)

components/
  admin/
    stats-cards.tsx
    platform-chart.tsx                ← Simple visual breakdown

.github/
  workflows/
    # (Optional) Any CI/CD hooks required before Vercel deploy
```

---

## Dependencies

- Phases 1-6 complete. This is the final polish step before sharing the URL.

---

## Testing Checklist (agent-tdd targets)

- Admin routes (`/dashboard/admin`) return 403 Forbidden for non-admin users
- Usage stats accurately reflect database counts
- UI renders without horizontal overflow on 320px viewport
- `security-audit` reports zero Critical or High vulnerabilities
