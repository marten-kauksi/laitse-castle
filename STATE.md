# Laitse Loss — Project State

**Last updated:** 2026-07-27

## Overall Roadmap

| Phase | Status |
|-------|--------|
| 1. Research & Groundwork | Done |
| 2. Brand & Visual Identity | Done |
| 3. Copywriting (direction) | Done (direction only, final copy later) |
| 4. Astro Build | **Done** |
| 5. SEO & Assets | Not started |
| 6. Launch | Not started |
| 7. Guest check-in (Turismiseadus § 24) | **Code done — migration not yet applied** |

## Phase 7: Guest Check-In

Statutory guest register under [Turismiseadus § 24](https://www.riigiteataja.ee/akt/113032014069?leiaKehtiv).
Design: `docs/superpowers/specs/2026-07-27-guest-check-in-design.md`

| Item | Status |
|------|--------|
| SQL migration (table, RLS, 2 cron jobs) | Written — **not yet run** |
| Email notification via Resend + `pg_net` trigger | Written — **not yet run**, needs Resend domain + Vault secrets |
| ET `/registreerimine` + EN `/en/check-in` | Done, verified in browser |
| ISO country list (198, ET/EN, locale-sorted) | Done |
| PostHog + cookie banner suppressed on these routes | Done, verified in build output |
| Privacy policy sections (ET + EN) | Done |
| `scripts/verify-rls.mjs` | Written — **not yet run** |

**Blocking go-live:**

1. Run `supabase/migrations/20260727000000_guest_registrations.sql` in the Supabase SQL editor.
2. Enable the `pg_cron` extension (Dashboard → Database → Extensions) — without it the
   two-year deletion required by § 24(7) never happens.
3. Run `node --env-file=.env scripts/verify-rls.mjs` and confirm all 7 checks pass.
3b. *(Optional)* For email alerts: verify laitsecastle.ee in Resend, store
    `resend_api_key` + `checkin_notify_to` in Vault, then run migration `…0001`.
4. Set `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Vercel (build-time
   inlined — needs a redeploy).
5. Confirm Nevaliste OÜ is registered as a *majutusettevõte* in MTR.
6. Restrict Supabase dashboard access + enable 2FA — it reads the full guest register.

## Phase 4: Build Progress

| Task | Status | Notes |
|------|--------|-------|
| Task 1: Astro init + Tailwind + tokens | Done | Commit `2363e63` |
| Task 2: Shared components (Flourish, Button, Rules, TopStripe) | Done | Commit `4dcdbef` |
| Task 3: Layout (Header, Footer, BaseLayout) | Done | Commit `215d1c2` |
| Task 4: Avaleht (Home) | Done | |
| Task 5: Ajalugu (History) | Done | |
| Task 6: Peod (Parties) | Done | |
| Task 7: Seminarid (Seminars) | Done | |
| Task 8: Peod & Seminarid combined (A/B) | Done | |
| Task 9: Responsive polish | Done | Mobile 375px verified, footer improved, SVG centering fixed globally |
| Task 10: Build + Lighthouse | Done | Perf 78, A11y 100, BP 100, SEO 100 |

## Lighthouse Scores (Production Build)

| Metric | Score |
|--------|-------|
| Performance | 78 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 0.8s |
| LCP | 6.2s (hero image, improvable with WebP) |
| TBT | 0ms |
| CLS | 0.001 |

## QA Review Fixes Applied

- Home hero: white bg → full image hero (Fassaad.jpg + 70% overlay)
- "Miks Laitse Loss": flat text → number cards with borders
- Seminarid hero: faint 12% bg → full image hero
- BurgundyRule on dark bg → GoldRule (visibility fix)
- SVG/Rule centering: per-page hacks → global `.text-center` rule
- Header z-index: z-10 → z-50
- Logo: 8.1MB (2048px) → 101KB (200px)
- Google Fonts: render-blocking → non-blocking load
- Footer: 3-col → 2-col (contact+company | map spanning 2)
- robots.txt added
- Contrast fixes for WCAG AA compliance

## Key Decisions Made

- Style: v9 Variant B (Fraunces + Cormorant Infant + Libre Baskerville)
- Colors: warm-white, burgundy, gold gradient
- Site structure: 4 pages + 1 A/B variant
- Peod and Seminarid as separate pages (+ combined variant for testing)
- No pricing on site
- No social proof (none available yet)
- No inquiry form — just contact info
- Google Maps embed in footer
- Sauna/grill NOT available under new ownership
- Terrass + aed available for events
- Room specs (Salong, Suur saal) confirmed accurate
- All copy in Estonian first, from scratch (not copied from prev site)
- CTA variants to A/B test

## Open Questions for Owner

1. Any additional rooms beyond Salong and Suur saal?
2. Catering — own kitchen or external partners?
3. Which celebration types to emphasize or avoid?
