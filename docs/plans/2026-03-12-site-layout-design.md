# Site Layout Design — Laitse Loss

**Date:** 2026-03-12
**Status:** Approved

## Site Structure

5 page designs (4 pages + 1 A/B variant):

1. **Avaleht** (Home)
2. **Ajalugu** (History)
3. **Peod** (Parties/Celebrations)
4. **Seminarid** (Seminars/Corporate)
5. **Peod & Seminarid** (Combined variant for A/B testing)

## Visual Style

Approved: v9 Curated Variant B + burgundy filled CTA button.

- **Fonts:** Fraunces (headings), Cormorant Infant (subtitles), Libre Baskerville (body), Lato (UI)
- **Colors:** warm-white `#FAF7F2`, burgundy `#8B1A1A`, gold gradient `#d19e1d→#ffd86e→#e3a812`, warm-dark `#2C2420`, stone `#7A6F64`
- **Decorative:** gold gradient flourishes (SVG), gold/burgundy rules, side accent lines

## Page Layouts

### 1. Avaleht (Home)

Purpose: sell the castle, route visitors to the right service page.

| Section | Content |
|---------|---------|
| **Hero** | Castle name, one-line value prop, two CTAs: Peod / Seminarid |
| **Event types overview** | Two cards/sections — Peod + Seminarid, each with short hook + link to dedicated page |
| **Why Laitse Loss** | 3–4 value props (historic setting, proximity to Tallinn, flexible spaces, dedicated service) |
| **Castle teaser** | Short atmospheric paragraph + placeholder photo, link to Ajalugu page |
| **Contact / Footer** | Phone, email, address, map link |

No fairy tales. Short, focused, routes people to services.

### 2. Ajalugu (History)

Purpose: tell the castle's story for visitors who want depth.

| Section | Content |
|---------|---------|
| **Hero image** | Full-width castle photo (placeholder) |
| **Castle history narrative** | Flowing editorial text based on existing copy in `docs/current-copy/history.md`. Pull-quotes for key moments. |
| **Woldemar von Uexküll** | Separate section with different background tone. Portrait-style layout. Bio content from existing copy. |
| **Footer** | Standard contact footer |

Design: editorial/bookish, generous whitespace, typography-driven. Works with 1-2 photos.

### 3. Peod (Parties/Celebrations)

Purpose: inspire and inform people planning celebrations.

| Section | Content |
|---------|---------|
| **Emotional hook** | Headline + atmospheric subtext — "your special occasion deserves a special setting" |
| **Celebration types** | Weddings, birthdays, anniversaries, corporate galas — framed aspirationally |
| **The spaces** | Rooms described atmospherically (not just m²). Mood, lighting, character. Placeholder photos. |
| **What's possible** | Catering arrangements, decoration, music, outdoor areas, seasonal options |
| **Capacity** | Framed as "intimate gathering of 20" to "grand celebration of 150" |
| **Contact** | Phone, email — no inquiry form |

Tone: emotional, aspirational, warm.

### 4. Seminarid (Seminars/Corporate)

Purpose: convince corporate bookers this beats a hotel conference room.

| Section | Content |
|---------|---------|
| **Value prop** | Why a castle beats a hotel — memorable, inspiring, close to Tallinn |
| **Rooms** | Each room with: name, capacity in different layouts (theater/U-shape/classroom), dimensions, placeholder photo |
| **Equipment** | Projector, screen, wifi, whiteboard, etc. (to be confirmed) |
| **Add-on experiences** | Sauna complex, grill, team activities — positioned as "after the work" |
| **Location & access** | Distance from Tallinn, parking, directions |
| **Contact** | Phone, email |

Tone: professional, efficient, practical.

### 5. Peod & Seminarid (Combined — A/B variant)

Purpose: test whether a single services page converts better than separate pages.

| Section | Content |
|---------|---------|
| **Hero** | General "events at Laitse Loss" hook |
| **Peod section** | Condensed version of the Peod page — emotional hook, types, spaces, capacity |
| **Visual divider** | Gold rule or decorative element |
| **Seminarid section** | Condensed version of the Seminarid page — value prop, rooms, equipment, add-ons |
| **Contact** | Phone, email |

Navigation could use anchor links or tabs to jump between sections.

## Shared Elements

### Header/Navigation
- Logo (left)
- Nav links: Avaleht, Ajalugu, Peod, Seminarid (or combined variant)
- Language toggle: EST / ENG
- Sticky on scroll

### Footer
- Contact info: phone, email, address
- Map link
- Company info (Laitse Loss OÜ)
- Privacy policy link
- Language toggle

## Content Status

| Content | Source | Status |
|---------|--------|--------|
| History text | `docs/current-copy/history.md` | Exists, needs editing (can't copy 1:1) |
| Seminarid reference | `docs/current-copy/seminars.md` | Reference only, rewrite from scratch |
| Peod copy | None | Write from scratch |
| Home copy | `docs/current-copy/home-page.md` | Reference only, completely different approach |
| Photos | None | Placeholders, owner will provide |
| Room specs | Previous site reference | Need to confirm with owner |

## Images

Use scraped photos from `scraped/laitseloss/images/` as working assets during development. 120 images available including:
- Castle exterior: `Fassaad.jpg`, `Fassaad-_htul.jpg`, `Lossi-tagune.jpg`, `Lossi-tornid.jpg`, `main_backyard.jpg`
- Wedding photos: `01-pulm.webp` through `18-pulm.webp`, `Pulmad.jpg`, `PulmadKabel.jpg`, `PulmadLaud.jpg`
- Rooms: `Salong_.jpg`, `Suur_saal_galerii.jpg`, `Suur_saal_tuhi.jpg`, `Guvernandi-tuba.jpg`, `Kabel.jpg`, etc.
- Food/events: `Toit.jpg`, `Peolaud-Kuldses-saalis.jpg`, `main_gastro.jpg`
- Grounds: `Terrass.jpg`, `Tuhande-Tuti-M_gi.jpg`

These are from the previous site and can be used as working placeholders. Owner may provide updated photos later.

## A/B Testing Plan

Two things to test:
1. **Home page hero**: event types first vs. castle story first
2. **Services**: separate Peod + Seminarid pages vs. combined single page

## Open Questions

1. Equipment list for seminar rooms — projector, screen, wifi? Need to confirm.
2. Are add-on experiences (sauna, grill) still offered under new ownership?
3. Outdoor spaces — garden, terrace? Available for events?
4. Seasonal differences — winter vs. summer offerings?
