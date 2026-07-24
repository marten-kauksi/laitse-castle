# PostHog Analytics Design — Laitse Loss

**Date:** 2026-07-24  
**Status:** Approved  
**Branch:** `marten` (from latest `main`)

## Goal

Add PostHog (EU Cloud) to the Astro site: pageviews and key events immediately (cookieless), session recording only after cookie consent, plus live ET/EN privacy policy pages.

## Decisions

| Topic | Choice |
| --- | --- |
| Hosting | PostHog Cloud EU (`eu.i.posthog.com`) |
| Scope | Pageviews + custom CTA events + session recording |
| Consent | Analytics immediately (no cookies); cookies + recording only after accept |
| Privacy | Publish ET + EN privacy pages + footer links as part of this work |
| Setup path | PostHog wizard (`--region eu`), then harden for consent model |
| Plan | Free tier (1 project) is enough |

## Architecture

1. **Init** — PostHog loads from `BaseLayout` (or wizard-generated component included there) on every page.
2. **Default mode** — Cookieless / memory persistence; session recording disabled.
3. **Consent gate** — Banner (ET/EN). Accept → enable persistence cookies + `startSessionRecording()`. Decline → stay cookieless, no recording. Choice stored in `localStorage`.
4. **Privacy** — Live `/privaatsuspoliitika` and `/en/privacy-policy` with accurate PostHog disclosure; footer links.
5. **Secrets** — Project API key via env (`PUBLIC_POSTHOG_KEY` or wizard equivalent); never commit keys.

## Components

| Unit | Responsibility |
| --- | --- |
| PostHog init script/component | Init client with EU host; respect prior consent |
| CookieConsent component | Banner UI + accept/decline + i18n |
| Privacy pages (ET/EN) | Legal notice for analytics + recording |
| Footer | Links to privacy pages |

## Data flow

```
Page load
  → PostHog init (cookieless, recording off)
  → Autocapture pageviews + CTA events
  → If no consent decision: show banner
  → Accept: enable cookies + start recording
  → Decline: keep cookieless; hide banner
```

## Out of scope

- Self-hosted PostHog
- Separate consent for pageviews vs recording (recording-only consent)
- Feature flags / surveys / A-B experiments (can add later)

## Legal note

Not legal advice. Privacy policy + recording consent are included because PostHog processes personal data and session recording uses cookies. Cookie banner covers recording cookies only, per product decision.
