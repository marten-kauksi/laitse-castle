# PostHog Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire PostHog EU analytics with cookieless pageviews by default, session recording only after consent, and live ET/EN privacy pages.

**Architecture:** Wizard (or manual) installs PostHog into Astro; we harden init for cookieless + deferred recording; add a consent banner and publish privacy pages linked from the footer.

**Tech Stack:** Astro 5, PostHog JS (EU Cloud), localStorage consent, existing i18n helpers

---

## File map

| File | Role |
| --- | --- |
| `src/components/PostHog.astro` | Init + consent-aware recording toggle |
| `src/components/CookieConsent.astro` | Banner UI (ET/EN) |
| `src/layouts/BaseLayout.astro` | Include PostHog + CookieConsent |
| `src/pages/privaatsuspoliitika.astro` | Live ET privacy page |
| `src/pages/en/privacy-policy.astro` | Live EN privacy page |
| `src/components/Footer.astro` | Privacy links |
| `src/i18n/*` | Consent + footer strings |
| `.env.example` | `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST` |

---

### Task 1: Branch from latest main

- [ ] Fetch/pull `main`, create `marten`
- [ ] Leave existing uncommitted docs on the branch

### Task 2: PostHog install (wizard)

> **Note:** `@posthog/wizard@latest` currently requires Node.js `>=22.22.0`. This machine had `v22.19.0`, so we wired PostHog manually. Upgrade Node to use the wizard, or paste the project API key into `.env`.

- [x] Manual EU init in `src/components/PostHog.astro`
- [ ] Add `PUBLIC_POSTHOG_KEY` to local `.env` (see `docs/posthog-env.example`)
- [ ] Optional: upgrade Node → run `npx -y @posthog/wizard@latest --region eu` and keep our consent layer

### Task 3: Consent-aware PostHog init

- [ ] Default: cookieless persistence, `disable_session_recording: true`
- [ ] On prior accept in localStorage: enable cookies + start recording
- [ ] Expose `window.__laitseConsentRecording(accepted: boolean)` for the banner

### Task 4: Cookie consent banner

- [ ] ET/EN copy: recording cookies only; link to privacy policy
- [ ] Accept / Decline; persist choice; hide when decided

### Task 5: Privacy pages + footer

- [ ] Replace draft “no analytics” copy with PostHog EU disclosure
- [ ] Publish ET + EN routes; footer links both locales

### Task 6: Verify

- [ ] Dev: pageviews fire without cookies
- [ ] Accept: cookies set + recording starts
- [ ] Decline: no recording cookies
- [ ] Privacy pages reachable from footer
