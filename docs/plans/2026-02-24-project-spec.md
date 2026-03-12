# Laitse Lossi Website — Project Spec

## What This Is

Laitse Lossi (Laitse Castle) is an event venue in Estonia. The castle has been acquired by a new owner. The previous owner is not complying with handing over or taking down the current website (https://www.laitseloss.ee/). We are building a completely new website from scratch.

## Legal / Brand Constraint

The current site at laitseloss.ee is still live under previous ownership. We must:
- **NOT** copy fonts, colors, or design 1:1 from the current site
- **NOT** replicate the current site's layout or visual structure
- **CAN** leverage some brand familiarity (it's the same castle, same name, same location)
- Need to differentiate clearly while still feeling like Laitse Lossi

**TODO:** Research current site (laitseloss.ee) to document what to avoid and what brand elements are inherently tied to the castle vs. the previous owner's design choices.

## Project Summary

| Attribute | Value |
|-----------|-------|
| Type | Event venue website |
| Events hosted | Broad — weddings, corporate, private parties, cultural events, photo shoots, etc. |
| Languages | Estonian + English |
| Existing branding | None — starting from scratch |
| Brand personality | Between "elegant & historic" and "luxurious & exclusive" |
| Tech stack | Astro + Tailwind CSS |
| Pages | Home, History, Events/Services page |
| Primary goal | Drive event bookings and inquiries |

## Brand Direction

**Tone:** Refined, prestigious, aspirational — but not cold. The castle should feel like a place you *want* to be, not a museum you're afraid to touch.

**Personality spectrum:**
```
Elegant & Historic ←————————→ Luxurious & Exclusive
                    ↑
              We're somewhere here
```

Exact positioning to be determined during visual prototyping phase.

## Target Audience

- Couples planning weddings (Estonian + international)
- Corporate event planners
- Private party organizers
- Cultural event producers
- Photographers / film crews seeking a location

## Pages / Site Structure

### 1. Home
- Hero with castle imagery
- Value proposition
- Event types overview
- CTA to inquiry/contact

### 2. History
- Story of the castle
- Heritage and architecture
- Photo gallery of the building and grounds

### 3. Events / Services
- What types of events they host
- Spaces available
- What's included / what they offer
- Inquiry CTA

*Additional pages (gallery, contact, FAQ, testimonials, blog) may be added later but are not in initial scope.*

## Development Approach: Brand-First via Visual Prototyping

We chose a brand-first approach, but starting with visual prototypes — not abstract brand theory. The sequence:

### Phase 1: Research & Groundwork
- Research current laitseloss.ee site (document colors, fonts, layout to AVOID copying)
- Research competitor/peer venue sites for inspiration
- Define user personas for each audience segment
- Create product marketing context document (`.claude/product-marketing-context.md`)

### Phase 2: Brand & Visual Identity
- Explore color palettes, typography, and mood through visual prototypes
- Use `design-system-generator` and `ui-design-methodology` skills
- Create design tokens (colors, typography, spacing) in Tailwind config
- Generate logo concepts / direction
- Define brand guidelines document

### Phase 3: Copywriting
- Write copy for all 3 pages using `copywriting` skill
- Edit/refine using `copy-editing` skill (Seven Sweeps)
- Estonian + English versions

### Phase 4: Astro Build
- Initialize Astro project with Tailwind
- Build layout and components using `frontend-design` and `tailwind-design-system` skills
- Build all 3 pages
- Mobile-first responsive design using `mobile-first-layout` skill
- Micro-interactions and polish using `micro-interactions` skill

### Phase 5: SEO & Assets
- Schema markup (LocalBusiness, Event types) using `schema-markup` skill
- SEO audit using `seo-audit` skill
- AI search optimization using `ai-seo` skill
- Generate favicons, OG images using `web-asset-generator` skill
- Accessibility audit using `accessibility-ux` skill

### Phase 6: Launch
- Deploy (platform TBD — Netlify, Vercel, or similar)
- Test across devices
- Set up analytics

## Installed Skills (20)

### Copywriting & Content
- `copywriting` — page copy frameworks, headline formulas, CTA guidelines
- `copy-editing` — Seven Sweeps editing framework
- `content-research-writer` — research, outlines, hooks, draft feedback

### Design & UI
- `design-system-generator` — colors, typography, spacing tokens
- `ui-design-methodology` — HSL tokens, color psychology, animations, component variants
- `tailwind-design-system` — CVA patterns, responsive, dark mode
- `mobile-first-layout` — responsive layout patterns
- `micro-interactions` — hover effects, loading states, transitions
- `canvas-design` — design philosophy to visual output
- `brand-guidelines` — brand identity structure template
- `theme-factory` — 10 pre-built themes for quick prototyping/inspiration

### SEO & Technical
- `schema-markup` — JSON-LD (LocalBusiness, Event — perfect for venue)
- `seo-audit` — technical SEO checklist
- `seo-optimization` — metadata, Open Graph, sitemaps
- `ai-seo` — optimizing for LLM/AI search discovery
- `web-asset-generator` — favicons, PWA icons, OG images with Python scripts

### UX & Conversion
- `page-cro` — conversion rate optimization
- `accessibility-ux` — WCAG 2.1 AA compliance
- `marketing-psychology` — 70+ mental models for persuasion
- `user-persona` — target audience definition

### Workflow (via superpowers plugin)
- `brainstorming` — explore before implementing
- `writing-plans` — plan multi-step tasks
- `executing-plans` — run plans with checkpoints
- `dispatching-parallel-agents` — parallel work
- `subagent-driven-development` — parallel implementation
- `verification-before-completion` — verify before claiming done
- `test-driven-development` — for interactive components
- `systematic-debugging` — when things break
- `frontend-design` (plugin) — production-grade frontend code

## Research Repos (in `_research/`)

8 cloned repos + 4 openskills downloads in `_research/` folder. These are reference material, not part of the site. Can be deleted once skills are finalized.

## Open Questions

1. Domain — will laitseloss.ee transfer eventually, or do we need a new domain?
2. Photography — do we have castle photos, or do we need to plan a shoot?
3. Contact method — email form, phone, booking system?
4. Hosting preference — Netlify, Vercel, or other?
5. Timeline — any deadline or launch target?
