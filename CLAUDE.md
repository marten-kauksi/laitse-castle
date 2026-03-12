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

## IMPORTANT: No Git Operations

**DO NOT run any git commands** (commit, add, push, init, etc.). The user has security hooks that block automated git operations. The user will handle all git operations manually. Just write code and report what changed.

## Key Constraint

The previous owner's website (laitseloss.ee) is still live. We must NOT copy its fonts, colors, design, or layout. We CAN leverage inherent castle brand familiarity. See spec for details.

## Project Structure

```
src/                  # Astro site source
  components/         # Shared components (Flourish, Button, Header, Footer, etc.)
  layouts/            # BaseLayout.astro
  pages/              # Page files (index, ajalugu, peod, seminarid, sundmused)
public/images/        # Working images from scraped site
docs/plans/           # Design docs, brand guidelines, implementation plan
docs/prototypes/      # Visual prototypes (v1-v9)
docs/current-copy/    # Reference copy (rewrite, don't copy)
scraped/laitseloss/   # Full scraped content + 120 images from prev site
.claude/skills/       # 20 installed skills
_research/            # Cloned reference repos (not part of site)
```

## Current Phase

Phase 4: Astro Build — in progress. See `STATE.md` for live progress tracking.

## Key Design Docs

- Brand guidelines: `docs/plans/2026-03-12-brand-guidelines.md`
- Tailwind tokens: `docs/plans/2026-03-12-tailwind-tokens.js`
- Site layout: `docs/plans/2026-03-12-site-layout-design.md`
- Copy direction: `docs/plans/2026-03-12-copy-direction.md`
- Implementation plan: `docs/plans/2026-03-12-implementation-plan.md`
