# Phase 1: Project Foundation + Authentication

## Goal
A deployed Next.js 15 app on Vercel where every route is locked behind BetterAuth from day one. Auth is never retrofitted — it is the foundation everything else is built on.

**Demo at end of phase**: Founder opens the deployed Vercel URL, sees a sign-in screen, authenticates via Google OAuth, and lands on a protected dashboard. Any unauthenticated request to any route returns 401.

---

## Acceptance Criteria

- [ ] `pnpm create next-app` scaffolded with TypeScript, Tailwind CSS, App Router, ESLint
- [ ] shadcn/ui initialised with neutral theme, dark mode default
- [ ] BetterAuth installed and configured with:
  - [ ] Email + password authentication
  - [ ] Google OAuth provider
  - [ ] GitHub OAuth provider
- [ ] Session middleware applied globally — all routes protected by default, zero exceptions
- [ ] Sign in page (`/sign-in`) — Google and GitHub as primary CTAs, email/password as secondary
- [ ] Sign up page (`/sign-up`) — email/password only (OAuth auto-creates account)
- [ ] Sign out action wired to user menu
- [ ] User roles defined in schema: `admin | tester | subscriber`
- [ ] Local PostgreSQL database connected via Prisma for development
- [ ] `User` model schema live in local DB
- [ ] Zod schema validation applied to all auth forms and server actions
- [ ] Upstash Redis connected and rate limiting middleware wired to all server actions
- [ ] App deployed to Vercel with production environment variables set
- [ ] Founder can log in via Google and reach the (empty) dashboard
- [ ] Any unauthenticated route access redirects to `/sign-in`

---

## Architecture Decisions

- **No public routes** except `/sign-in` and `/sign-up`. Middleware catches everything else.
- **BetterAuth** handles session via secure HTTP-only cookies. No JWT stored in localStorage.
- **Prisma ORM** for DB interactions. Connects to local PostgreSQL during development. Uses `@prisma/adapter-neon` only in production/Vercel.
- **Zod + React Hook Form** for end-to-end validation. Schemas defined once, used on both client (UI) and server (Actions).
- **Upstash Redis** rate limiting applied as middleware at the Server Action level, not the UI level.
- **shadcn/ui neutral** — no colour customisation yet. Ship the skeleton in pure black/white.

---

## Key Files to Create

```
app/
  (auth)/
    sign-in/page.tsx
    sign-up/page.tsx
  (dashboard)/
    page.tsx                  ← Protected empty dashboard shell
  layout.tsx
  middleware.ts               ← BetterAuth session check on every request

lib/
  auth.ts                     ← BetterAuth config (providers, callbacks)
  prisma.ts                   ← Prisma client instantiation
  redis.ts                    ← Upstash Redis client
  rate-limit.ts               ← Sliding window middleware helper
  
prisma/
  schema.prisma               ← Prisma schema: User table

actions/
  auth/
    validations.ts            ← Zod schemas for auth (SignInSchema, SignUpSchema)
    sign-in.ts
    sign-up.ts
    sign-out.ts

components/
  auth/
    sign-in-form.tsx
    sign-up-form.tsx
    oauth-buttons.tsx

.env.local                    ← All environment variables documented
```

---

## Environment Variables Required

```
DATABASE_URL=               # Neon PostgreSQL connection string
BETTER_AUTH_SECRET=         # Random secret for session signing
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## Dependencies

None. This is Phase 1 — the foundation.

---

## Testing Checklist (agent-tdd targets)

- Sign up with email/password creates a user record in Neon
- Sign in with correct credentials returns a valid session
- Sign in with wrong credentials returns an error, no session
- Unauthenticated request to `/dashboard` redirects to `/sign-in`
- Authenticated request to `/dashboard` returns 200
- Rate limiter blocks >20 requests/min from the same user
- Google OAuth callback creates or retrieves user record correctly
