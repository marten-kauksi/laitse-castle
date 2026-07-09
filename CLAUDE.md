# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Laitse Lossi (Laitse Castle) — event venue website for a castle in Estonia. New ownership; building site from scratch.

- **Full spec:** `docs/plans/2026-02-24-project-spec.md` — read this first for full context
- **Stack:** Astro + Tailwind CSS
- **Languages:** Estonian + English
- **Pages:** Avaleht, Ajalugu, Peod, Seminarid, Sündmused (A/B variant)
- **Brand:** Warm bookish luxury. White primary, burgundy + gold accents.
- **Skills:** 20 custom skills in `.claude/skills/` for copywriting, design, SEO, UX, asset generation

## Git Operations

Claude MAY run git operations (add, commit, push), but **always ask for confirmation before running any git command** — never do it unprompted. "Pane live" / "make it live" means `git push` to `origin` (auto-deploy publishes the site).

## Key Constraint

The previous owner's website (laitseloss.ee) is still live. We must NOT copy its fonts, colors, design, or layout. We CAN leverage inherent castle brand familiarity. See spec for details.

## Project Structure

```
src/                  # Astro site source
  components/         # Shared components (Flourish, Button, Header, Footer, etc.)
  layouts/            # BaseLayout.astro
  pages/              # Page files (index, ajalugu, peod, seminarid, sundmused)
Fotopank/             # Original master photos (branded names, NOT deployed) — see Photos section
public/fotopank/       # Served photos as WebP (branded Fotopank filenames)
public/images/        # Legacy/working images (logo, favicon, some schema images)
public/signed-images/  # Legacy images (a few still referenced in schema)
docs/plans/           # Design docs, brand guidelines, implementation plan
docs/prototypes/      # Visual prototypes (v1-v9)
docs/current-copy/    # Reference copy (rewrite, don't copy)
scraped/laitseloss/   # Full scraped content + 120 images from prev site
.claude/skills/       # 20 installed skills
_research/            # Cloned reference repos (not part of site)
```

## Photos / Images

- **Source of truth:** original master photos live in `Fotopank/` (repo root, NOT deployed). These are the branded originals.
- **Served images:** WebP files in `public/fotopank/`. Generate them from the `Fotopank/` originals with sharp at **max 1200px (longest side), quality 78**.
- **Filenames — keep the exact original Fotopank basename**, only changing the extension to `.webp` (e.g. `LaitseLoss_Peosaal1.jpg` → `LaitseLoss_Peosaal1.webp`, `LaitseCastle_Toomas-Tuul.jpg` → `.webp`). This preserves the **LaitseLoss / LaitseCastle brand** and the **photographer credit "Toomas-Tuul"** in the filename — important marketing detail (a saved image already carries the castle name). Do NOT rename to short/generic slugs.
- **No darkening on photos with text.** Hero sections and image cards show the photo in original colors with NO dark gradient/overlay; readability comes from `text-shadow` (`.text-overlay`) only. The only gradient allowed on a hero is the decorative gold TopStripe line.
- **Gallery alt text** is written inline in the `images` array (Estonian in `galerii.astro`, English in `en/gallery.astro`), not via i18n keys.
- **Legacy folders** `public/images/` and `public/signed-images/` hold older assets; only a few are still used (logo, favicon, JSON-LD schema images). Prefer Fotopank photos for any new or updated visible imagery, and delete assets that become orphaned.

## Typography & Legibility

Default to **comfortably large, high-contrast text** — the user has repeatedly asked to enlarge and darken text, so err on the bigger/bolder side.

- **NEVER use tiny text.** Section subtitles / taglines / intro lines must be **at least ~24px on desktop** — use `text-[clamp(24px,3vw,34px)]` (or larger), never the `text-subtitle` token (it shrinks to 17px) and never a clamp whose minimum is 17–20px. The user has repeatedly flagged such text as unreadable. Body copy should be `text-body-lg` (17px) or larger; only genuinely secondary captions (e.g. an email line under a button) may be smaller.
- Avoid small font sizes for anything meant to be read (section subtitles, eyebrows, labels, captions). Prefer a `clamp()` that scales up nicely on desktop rather than tiny fixed sizes.
- Avoid low-contrast light/grey text on light backgrounds. `text-stone` (grey) on white/warm-light is often too faint for longer or important text — prefer `text-warm-dark` or `text-burgundy`, or bump the weight, when legibility matters.
- Make labels/eyebrows bold enough to read (they were too thin/faint by default).
- Note: for italic weights, Cormorant Infant italic 600/700 must be present in the Google Fonts request (`BaseLayout.astro`) or bold has no visible effect.

## Current Phase

Phase 4: Astro Build — in progress. See `STATE.md` for live progress tracking.

## Key Design Docs

- Brand guidelines: `docs/plans/2026-03-12-brand-guidelines.md`
- Tailwind tokens: `docs/plans/2026-03-12-tailwind-tokens.js`
- Site layout: `docs/plans/2026-03-12-site-layout-design.md`
- Copy direction: `docs/plans/2026-03-12-copy-direction.md`
- Implementation plan: `docs/plans/2026-03-12-implementation-plan.md`
