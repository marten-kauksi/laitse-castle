# Website Build Workflow with Claude Code

A repeatable, end-to-end workflow for building websites using Claude Code with specialized skills. Documented from the Laitse Lossi (Laitse Castle) website project — an event venue site built with Astro + Tailwind CSS.

**This repo serves as a reference implementation.** Clone it to get the skills, see how things were done, and adapt the workflow to any project. The visual style/design is specific to this castle — don't copy it. The *process* is the reusable part.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites & Setup](#prerequisites--setup)
3. [Phase 1: Project Kickoff & Research](#phase-1-project-kickoff--research)
4. [Phase 2: Brand & Visual Identity](#phase-2-brand--visual-identity)
5. [Phase 3: Copy Direction](#phase-3-copy-direction)
6. [Phase 4: Astro Build](#phase-4-astro-build)
7. [Phase 5: SEO & Assets](#phase-5-seo--assets)
8. [Phase 6: Deploy & Launch](#phase-6-deploy--launch)
9. [Skills Reference](#skills-reference)
10. [Astro Setup Reference](#astro-setup-reference)
11. [Tips & Lessons Learned](#tips--lessons-learned)

---

## Overview

### The Approach: Brand-First via Visual Prototyping

We don't start with code. We start with visual prototypes — single HTML files that explore design directions. This lets you iterate on branding, typography, and color with the client *before* writing any framework code.

### The Sequence

```
Research → Visual Prototypes → Brand Guidelines → Copy Direction → Astro Build → SEO → Deploy
```

Each phase produces concrete artifacts (documents, prototypes, design tokens) that feed the next phase. Nothing is abstract brand theory — everything is visual and tangible.

### What You Get

- A static Astro site with Tailwind CSS
- Multi-language support (i18n)
- Schema.org structured data
- 100 Accessibility + 100 SEO Lighthouse scores
- Deployed on Vercel

---

## Prerequisites & Setup

### 1. Install Claude Code

```bash
# Install Claude Code CLI
npm install -g @anthropic-ai/claude-code
```

### 2. Initialize the Project

```bash
mkdir my-website && cd my-website
git init
```

### 3. Install Skills

Copy the `.claude/skills/` directory from this repo into your project. These are the specialized skills that guide Claude through each phase:

```bash
# From this reference repo
cp -r .claude/skills/ /path/to/your-project/.claude/skills/
```

Skills installed (24 total — see [Skills Reference](#skills-reference) for details):

| Category | Skills |
|----------|--------|
| **Design & UI** | `design-system-generator`, `ui-design-methodology`, `tailwind-design-system`, `mobile-first-layout`, `micro-interactions`, `canvas-design`, `brand-guidelines`, `theme-factory` |
| **Copywriting** | `copywriting`, `copy-editing`, `content-research-writer` |
| **SEO & Technical** | `schema-markup`, `seo-audit`, `seo-optimization`, `ai-seo`, `web-asset-generator` |
| **UX & Conversion** | `page-cro`, `accessibility-ux`, `marketing-psychology`, `user-persona` |
| **QA & Sharing** | `browser-qa`, `share-gallery` |

### 4. Install Plugins

The superpowers plugin provides workflow skills (brainstorming, planning, parallel agents, debugging). The frontend-design plugin provides production-grade frontend code generation.

```bash
# Install via Claude Code plugin system
claude /install-plugin superpowers
claude /install-plugin frontend-design
```

### 5. Write CLAUDE.md

Create a `CLAUDE.md` at project root with:
- What the project is
- Tech stack
- Key constraints (legal, brand, technical)
- Project structure (update as you go)
- Links to key design docs
- Any rules for Claude (e.g., "no git operations", "update both ET/EN pages")

See this repo's `CLAUDE.md` for a full example.

### 6. Write the Project Spec

Create `docs/plans/project-spec.md` with:
- What you're building and why
- Target audience
- Brand direction (even if vague — "luxurious but warm", "minimal and clean")
- Page structure
- Legal/brand constraints
- Open questions

This is the single source of truth for the project. Claude reads it first.

---

## Phase 1: Project Kickoff & Research

**Goal:** Understand the space, define constraints, gather raw material.

### Steps

1. **Research competitors/peers** — If there's an existing site to differentiate from, scrape it for reference (what to avoid). Research competitor sites for inspiration.

2. **Gather images** — Scrape existing imagery, collect client photos, or identify stock sources. Put them in `scraped/` or `public/images/`. Having real images early makes prototyping 10x better.

3. **Define personas** — Use the `user-persona` skill to create target audience profiles. These inform copy tone and page priorities.

4. **Document what exists** — If rewriting an existing site, save current copy to `docs/current-copy/` as reference. This is for *rewriting from*, not copying.

### Artifacts Produced

```
docs/plans/project-spec.md      # Project definition
docs/current-copy/               # Reference content (if rewriting)
scraped/                          # Images and content from existing sites
```

### Skills Used
- `user-persona` — target audience definition
- `marketing-psychology` — understand buyer motivations

---

## Phase 2: Brand & Visual Identity

**Goal:** Go from "I want it to feel luxurious" to approved design tokens and brand guidelines.

This is the most iterative phase. Expect 5-10 rounds of prototyping.

### How We Did It

#### Round 1: Explore Directions (v1)

Asked Claude to create a single HTML prototype with 3 distinct design directions:

- **Direction A: Minimal & Airy** — white space, restraint, clean lines
- **Direction B: Bold & Dramatic** — dark backgrounds, rich textures, commanding
- **Direction C: Warm & Inviting** — heritage feel, warm tones, approachable luxury

Each direction had its own color palette, typography, and decorative approach. All in one HTML file for easy comparison.

**Client feedback:** "I like Warm. More red and gold please."

#### Rounds 2-4: Refine the Direction (v2-v4)

Narrowed to warm variants with increasing red/gold presence:
- v2: 4 sub-variants exploring different font/ornament combinations
- v3: Red and gold made more prominent (key feedback: "these are our brand differentiators")
- v4: Finalists consolidated

**Key learning:** The client's instinct about red/gold being the differentiator was right. Don't fight it — lean into what makes the brand distinct.

#### Rounds 5-8: Polish Details (v5-v8)

Fine-tuned typography, spacing, decorative elements:
- v5: Flowy/calligraphic direction explored
- v6: More professional/clean take
- v7: Combined best elements
- v8: Remixed variations

#### Round 9: Final Approval (v9)

v9 presented curated variants. **Variant B was approved** as the final style direction.

#### Round 10: Font Comparison (v10)

Specifically compared display fonts (Fraunces vs Bodoni Moda) for the hero heading. Settled on Bodoni Moda.

### The Prototyping Method

Each prototype is a **single self-contained HTML file** with inline CSS. No build tools, no framework — just open in a browser. This keeps iteration fast.

```
docs/prototypes/
├── v1-hero-variants.html       # 3 design directions
├── v2-warm-variants.html       # 4 warm sub-variants
├── v3-warm-red-gold.html       # Red/gold emphasis
├── v4-finalists.html           # Consolidated finalists
├── v5-flowy.html               # Alternative direction
├── v6-professional.html        # Clean/professional take
├── v7-combined.html            # Best-of combination
├── v8-remixed.html             # Final remixes
├── v9-curated.html             # APPROVED — Variant B
├── v10-display-font-compare.html
└── _deploy/index.html          # Deployed final version
```

Use the `share-gallery` skill to serve prototypes via cloudflared tunnel for mobile viewing / client sharing.

### After Approval: Document Everything

Once a direction is approved, formalize it into design documents:

1. **Brand Guidelines** (`docs/plans/brand-guidelines.md`)
   - Color palette with hex values and usage rules
   - Typography system (display, subtitle, body, UI fonts with weights)
   - Decorative elements (flourishes, rules, stripes)
   - Button styles (filled/outline, hover states)
   - Tone of voice guidelines

2. **Tailwind Tokens** (`docs/plans/tailwind-tokens.js`)
   - Colors, font families, font sizes with clamp() for responsive
   - Custom spacing, letter-spacing, gradients
   - Ready to paste into `tailwind.config.mjs`

3. **Site Layout Design** (`docs/plans/site-layout-design.md`)
   - Page-by-page layout specification
   - Shared elements (header, footer)
   - Content structure per section

### Artifacts Produced

```
docs/prototypes/v1-v10.html         # Visual iterations
docs/plans/brand-guidelines.md       # Approved brand identity
docs/plans/tailwind-tokens.js        # Design tokens for Tailwind
docs/plans/site-layout-design.md     # Page layouts
```

### Skills Used
- `design-system-generator` — color palettes, typography systems, spacing
- `ui-design-methodology` — color psychology, visual hierarchy, component patterns
- `brand-guidelines` — brand identity structure
- `theme-factory` — quick theme exploration / inspiration
- `canvas-design` — visual design philosophy
- `frontend-design` (plugin) — production-grade HTML/CSS for prototypes

---

## Phase 3: Copy Direction

**Goal:** Define content strategy and write initial copy for all pages.

### How We Did It

We wrote a **copy direction document** — not final copy, but the structure, tone, and key messages for each page. This sits between "what pages do we need" and "here's the final text."

The copy direction defines:
- **Per page:** headline, subtitle, section structure, CTAs
- **Tone rules:** warm but not salesy, dignified but not cold
- **Practical info placement:** capacity, location, contact always easy to find
- **What NOT to do:** don't copy old site copy, no fairy-tale narratives on service pages

### Copy Approach

1. **Estonian first** — write all copy in the primary language first, translate later
2. **Write from scratch** — reference existing copy for facts, but rewrite completely
3. **Section-by-section structure** — define what each section says before writing full paragraphs
4. **CTA variants** — plan multiple CTAs to test

### Artifacts Produced

```
docs/plans/copy-direction.md     # Content strategy per page
```

### Skills Used
- `copywriting` — page copy frameworks, headline formulas, CTA patterns
- `copy-editing` — Seven Sweeps editing framework (Clarity → Voice → So What → Prove It → Specificity → Emotion → Zero Risk)
- `content-research-writer` — research, outlines, hooks

---

## Phase 4: Astro Build

**Goal:** Turn approved design + copy into a working Astro site.

### Implementation Order

We followed a bottom-up approach — tokens first, then components, then layout, then pages:

| # | Task | What |
|---|------|------|
| 1 | **Init + Tokens** | `npm create astro`, install Tailwind, paste design tokens into `tailwind.config.mjs` |
| 2 | **Decorative Components** | SVG flourishes, gold/burgundy rules, top stripe, buttons |
| 3 | **Layout** | Header (sticky, scroll-aware), Footer (contact, map), BaseLayout (meta, fonts, schema) |
| 4 | **Home Page** | Hero, services overview, value props, castle teaser, CTA |
| 5 | **History Page** | Editorial layout, narrative sections, pull-quotes |
| 6 | **Service Page(s)** | Room details, capacity, equipment, contact |
| 7 | **A/B Variant** | Combined services page for testing |
| 8 | **i18n** | Estonian + English with route-based locale switching |
| 9 | **Responsive Polish** | Mobile 375px, tablet 768px, desktop 1280px+ |
| 10 | **Build + Audit** | Production build, Lighthouse verification |

### Key Architecture Decisions

**Page duplication for i18n:** Pages are duplicated between `src/pages/` (Estonian) and `src/pages/en/` (English). They're separate files with hardcoded content, not shared templates. Simple but requires updating both when making layout changes.

```
src/pages/
├── index.astro              # Estonian home
├── ajalugu.astro            # Estonian history
├── peod-ja-seminarid.astro  # Estonian events
└── en/
    ├── index.astro          # English home
    ├── history.astro        # English history
    └── events-and-seminars.astro  # English events
```

**Translation function:** A `t(locale, 'key.path')` helper for shared UI strings (nav labels, buttons, footer text). Page content is hardcoded per-language file.

**Scroll animations:** IntersectionObserver-based `[data-animate]` system with staggered delays. Respects `prefers-reduced-motion`.

**Font loading:** Google Fonts loaded with `media="print"` + `onload="this.media='all'"` for non-blocking load.

### Component Library

```
src/components/
├── BaseLayout.astro        # HTML shell, meta tags, fonts, global styles
├── Header.astro            # Sticky nav, mobile menu, language switcher
├── Footer.astro            # Contact info, Google Maps embed, copyright
├── Button.astro            # CTA button (filled/outline variants)
├── Flourish.astro          # SVG decorative flourish (simple/vintage)
├── GoldRule.astro           # Horizontal gold gradient line
├── BurgundyRule.astro       # Horizontal burgundy line
├── TopStripe.astro          # 4px burgundy + 1px gold top bar
├── LanguageSwitcher.astro   # EST/ENG toggle
└── SchemaOrg.astro          # JSON-LD schema markup renderer
```

### Lighthouse Results

| Metric | Score |
|--------|-------|
| Performance | 78 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

### Artifacts Produced

```
src/                    # Full Astro site
tailwind.config.mjs     # Design tokens
astro.config.mjs        # Astro config with i18n
package.json            # Dependencies
```

### Skills Used
- `frontend-design` (plugin) — production-grade components and pages
- `tailwind-design-system` — Tailwind patterns, responsive design
- `mobile-first-layout` — responsive breakpoint strategy
- `micro-interactions` — hover effects, scroll animations
- `accessibility-ux` — WCAG 2.1 AA compliance, touch targets, contrast

---

## Phase 5: SEO & Assets

**Goal:** Technical SEO, structured data, favicons, OG images, accessibility audit.

### Tasks

1. **Schema markup** — LocalBusiness, EventVenue, Organization JSON-LD
2. **Meta tags** — Title, description, Open Graph, Twitter Cards per page
3. **Sitemap** — Auto-generated via `@astrojs/sitemap`
4. **Favicons + app icons** — Generate from logo
5. **OG images** — Social sharing images for each page
6. **Accessibility audit** — Full WCAG 2.1 AA check
7. **SEO audit** — Technical SEO checklist
8. **AI search optimization** — Structure content for LLM citation

### Skills Used
- `schema-markup` — JSON-LD structured data implementation
- `seo-audit` — technical SEO checklist (crawlability, indexation, speed, mobile)
- `seo-optimization` — metadata, Open Graph, sitemaps, canonical URLs
- `ai-seo` — optimize for ChatGPT/Perplexity/Google AI Overviews
- `web-asset-generator` — favicons, PWA icons, OG images
- `accessibility-ux` — WCAG audit (automated + keyboard + screen reader + contrast + manual)

---

## Phase 6: Deploy & Launch

**Goal:** Ship it.

### Vercel Deployment

This project deploys on **Vercel** with the Astro adapter.

#### Setup

```bash
# Install Vercel adapter
npm install @astrojs/vercel
```

Update `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://yourdomain.com',
  output: 'static',       // Static site generation (default)
  adapter: vercel(),
  integrations: [tailwind(), sitemap()],
  i18n: {
    defaultLocale: 'et',
    locales: ['et', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
```

#### Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (first time — links to Vercel project)
vercel

# Deploy to production
vercel --prod
```

Or connect the GitHub repo to Vercel for automatic deploys on push.

#### Vercel Config (optional `vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

### Launch Checklist

- [ ] Domain configured and DNS propagated
- [ ] SSL certificate active (automatic on Vercel)
- [ ] All pages render correctly on mobile/tablet/desktop
- [ ] Lighthouse scores acceptable (aim for 90+ across the board)
- [ ] Schema markup validates (Google Rich Results Test)
- [ ] OG images display correctly (share on social to test)
- [ ] Analytics set up (Plausible, Fathom, or similar)
- [ ] Google Search Console configured
- [ ] Google Business Profile updated with new URL
- [ ] Redirects from old domain (if applicable)

---

## Skills Reference

### When to Use Each Skill

| Phase | Skill | Purpose |
|-------|-------|---------|
| Research | `user-persona` | Define target audience profiles |
| Research | `marketing-psychology` | Understand buyer motivations (70+ mental models) |
| Branding | `design-system-generator` | Create color palettes, typography systems |
| Branding | `ui-design-methodology` | Color psychology, visual hierarchy, animation systems |
| Branding | `brand-guidelines` | Structure brand identity documentation |
| Branding | `theme-factory` | Quick theme exploration with 10 presets |
| Copy | `copywriting` | Write page copy (headlines, CTAs, section frameworks) |
| Copy | `copy-editing` | Polish copy with Seven Sweeps framework |
| Copy | `content-research-writer` | Research-backed content with citations |
| Build | `frontend-design` (plugin) | Production-grade HTML/CSS components |
| Build | `tailwind-design-system` | Tailwind patterns, CVA components, responsive |
| Build | `mobile-first-layout` | Responsive breakpoint strategy |
| Build | `micro-interactions` | Hover effects, loading states, transitions |
| Build | `canvas-design` | Visual design for static assets (posters, art) |
| SEO | `schema-markup` | JSON-LD structured data (LocalBusiness, Event, etc.) |
| SEO | `seo-audit` | Technical SEO checklist |
| SEO | `seo-optimization` | Meta tags, Open Graph, sitemaps, canonicals |
| SEO | `ai-seo` | Optimize for AI search engines |
| SEO | `web-asset-generator` | Favicons, PWA icons, OG images |
| QA | `accessibility-ux` | WCAG 2.1 AA compliance audit |
| QA | `page-cro` | Conversion rate optimization analysis |
| QA | `browser-qa` | Browser automation testing with Playwright |
| QA | `share-gallery` | Serve screenshots/prototypes via tunnel for review |

### Workflow Skills (via superpowers plugin)

| Skill | When to Use |
|-------|-------------|
| `brainstorming` | Before any creative work — explore intent before implementing |
| `writing-plans` | Before multi-step implementation — write the plan first |
| `executing-plans` | Run plans with review checkpoints |
| `dispatching-parallel-agents` | When 2+ independent tasks can run simultaneously |
| `subagent-driven-development` | Parallel implementation within a session |
| `verification-before-completion` | Before claiming done — verify with evidence |
| `systematic-debugging` | When encountering bugs — diagnose before fixing |
| `requesting-code-review` | Before merging — verify work meets requirements |

---

## Astro Setup Reference

### Project Init

```bash
npm create astro@latest my-website
cd my-website
npx astro add tailwind
npm install @astrojs/sitemap --save-dev
```

### Configuration (`astro.config.mjs`)

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yourdomain.com',
  integrations: [tailwind(), sitemap()],
  i18n: {
    defaultLocale: 'et',          // Your primary language
    locales: ['et', 'en'],         // All supported languages
    routing: {
      prefixDefaultLocale: false,  // Clean URLs for default locale
    },
  },
});
```

### Tailwind Config (`tailwind.config.mjs`)

Design tokens go here. The structure from this project:

```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Your brand colors
      },
      fontFamily: {
        // display, subtitle, body, ui
      },
      fontSize: {
        // Responsive clamp() sizes
      },
      letterSpacing: {
        // display, wide, wider
      },
      backgroundImage: {
        // Gradients
      },
      spacing: {
        // Custom spacing units
      },
    },
  },
};
```

### Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.astro     # Navigation (sticky, scroll-aware)
│   ├── Footer.astro     # Contact, maps, legal
│   ├── Button.astro     # CTA button variants
│   └── ...              # Decorative elements
├── layouts/
│   └── BaseLayout.astro # HTML shell, meta, fonts, global CSS
├── pages/
│   ├── index.astro      # Home (default locale)
│   ├── about.astro      # About page
│   └── en/              # English versions
│       ├── index.astro
│       └── about.astro
├── i18n/
│   ├── routes.ts        # Route mapping between locales
│   └── utils.ts         # Translation helper t(locale, key)
└── styles/              # Global styles (if needed)

public/
├── images/              # Static images
└── fonts/               # Self-hosted fonts (if not using Google Fonts)

docs/
├── plans/               # Design docs, brand guidelines, specs
├── prototypes/          # Visual prototypes (v1-v10.html)
└── current-copy/        # Reference copy for rewriting
```

### Key Patterns

**Non-blocking Google Fonts:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=..."
  rel="stylesheet"
  media="print"
  onload="this.media='all'"
/>
<noscript>
  <link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet" />
</noscript>
```

**Scroll animations:**
```html
<!-- In your component -->
<div data-animate data-animate-delay="200">Content fades in on scroll</div>

<!-- In BaseLayout (global JS) -->
<script>
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
</script>
```

**Responsive font sizes with clamp():**
```javascript
// In tailwind.config.mjs
fontSize: {
  'hero': ['clamp(2.375rem, 5.5vw, 4.25rem)', { lineHeight: '1.05' }],
  'section': ['clamp(1.75rem, 3.5vw, 2.75rem)', { lineHeight: '1.15' }],
}
```

---

## Tips & Lessons Learned

### Prototyping

- **Start with 3 distinct directions**, not variations of one idea. Let the client react to contrast.
- **Use real images from the start.** Stock photos or blank placeholders don't convey atmosphere.
- **Single HTML files** for prototypes — no build tools, no framework. Just open in browser.
- **Share prototypes** via `share-gallery` skill for mobile viewing. Clients review on phones.
- **Expect 7-10 rounds.** v1 is exploration, v4-5 is refinement, v8-9 is polish. Don't try to nail it in 2.

### Branding

- **Listen to the client's instinct** about what differentiates them. "More red and gold" was the right call even when subtlety seemed more "refined."
- **Document everything** once approved. Brand guidelines, tailwind tokens, layout specs — before writing a line of framework code.
- **Typography exploration matters.** We did a dedicated v10 just for display font comparison. The right heading font changes everything.

### Building

- **Bottom-up:** tokens → components → layout → pages. Don't build pages before the design system exists.
- **Duplicate pages for i18n** is simple and works well for small sites (3-5 pages). For larger sites, consider a CMS or content collections.
- **Test mobile early.** Not at the end — during each page build.
- **Lighthouse 100 on A11y and SEO is achievable** with basic discipline: semantic HTML, alt text, contrast ratios, meta tags.

### Skills

- **Skills are guides, not scripts.** They provide frameworks and checklists — you still make the creative decisions.
- **Use the brainstorming skill** before any creative work. It prevents jumping to implementation before understanding what you're building.
- **Copy-editing's Seven Sweeps** is genuinely useful: Clarity → Voice → So What → Prove It → Specificity → Emotion → Zero Risk.
- **SEO skills stack:** `schema-markup` + `seo-optimization` + `seo-audit` + `ai-seo` cover different angles.

### Process

- **CLAUDE.md is your contract with Claude.** Keep it updated as the project evolves.
- **STATE.md tracks progress.** Update it as tasks complete so Claude (and you) know where things stand.
- **Design docs in `docs/plans/`** — brand guidelines, layout specs, copy direction, implementation plan. These are the bridge between prototyping and building.
- **One phase at a time.** Don't try to brand and build simultaneously. The sequential flow prevents rework.
