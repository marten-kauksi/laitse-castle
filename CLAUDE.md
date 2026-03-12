# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Laitse Lossi (Laitse Castle) — event venue website for a castle in Estonia. New ownership; building site from scratch.

- **Full spec:** `docs/plans/2026-02-24-project-spec.md` — read this first for full context
- **Stack:** Astro + Tailwind CSS
- **Languages:** Estonian + English
- **Pages (initial):** Home, History, Events/Services
- **Brand:** Elegant/historic to luxurious/exclusive. Starting from scratch — no existing branding.
- **Skills:** 20 custom skills in `.claude/skills/` for copywriting, design, SEO, UX, asset generation

## Key Constraint

The previous owner's website (laitseloss.ee) is still live. We must NOT copy its fonts, colors, design, or layout. We CAN leverage inherent castle brand familiarity. See spec for details.

## Project Structure

```
.claude/skills/       # 20 installed skills (copywriting, design, SEO, etc.)
docs/plans/           # Project spec and design documents
_research/            # Cloned reference repos (not part of site)
```

## Current Phase
ˇ
Phase 1: Research & Groundwork. Next steps:
1. Research current laitseloss.ee to document what to avoid
2. Research competitor venue sites for inspiration
3. Define user personas
4. Create product marketing context (`.claude/product-marketing-context.md`)
5. Begin visual prototyping for brand identity
