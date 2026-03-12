# Laitse Loss Website — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the Laitse Loss event venue website with Astro + Tailwind CSS — 4 pages (+ 1 A/B variant), Estonian first, using approved brand identity.

**Architecture:** Astro static site with Tailwind CSS for styling. Pages as `.astro` files, shared layout component with header/footer. Images from `scraped/laitseloss/images/`. Google Fonts loaded via `<link>`. Google Maps embed in footer. No JS frameworks needed — pure Astro components.

**Tech Stack:** Astro 5.x, Tailwind CSS 4.x, Google Fonts (Fraunces, Cormorant Infant, Libre Baskerville, Lato)

**Reference docs:**
- Brand guidelines: `docs/plans/2026-03-12-brand-guidelines.md`
- Tailwind tokens: `docs/plans/2026-03-12-tailwind-tokens.js`
- Site layout: `docs/plans/2026-03-12-site-layout-design.md`
- Copy direction: `docs/plans/2026-03-12-copy-direction.md`
- Scraped images: `scraped/laitseloss/images/`
- Prototype reference: `docs/prototypes/_deploy/index.html` (v9 Variant B style)

---

### Task 1: Astro projekti loomine ja seadistamine

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/pages/index.astro` (placeholder)
- Create: `public/` (copy working images from scraped/)

**Step 1: Astro projekti initsialiseerimine**

```bash
cd /Users/martenkauksi/codeprojects/laitse-lossi-website
npm create astro@latest . -- --template minimal --no-git --no-install
```

**Step 2: Tailwind CSS lisamine**

```bash
npx astro add tailwind -y
npm install
```

**Step 3: Tailwind tokenite seadistamine**

Copy design tokens from `docs/plans/2026-03-12-tailwind-tokens.js` into `tailwind.config.mjs`. Add Google Fonts import to base layout.

**Step 4: Tööpiltide kopeerimine**

```bash
mkdir -p public/images
cp scraped/laitseloss/images/Fassaad.jpg public/images/
cp scraped/laitseloss/images/Fassaad-_htul.jpg public/images/
cp scraped/laitseloss/images/main_backyard.jpg public/images/
cp scraped/laitseloss/images/Salong_.jpg public/images/
cp scraped/laitseloss/images/Suur_saal_galerii.jpg public/images/
cp scraped/laitseloss/images/Suur_saal_tuhi.jpg public/images/
cp scraped/laitseloss/images/Terrass.jpg public/images/
cp scraped/laitseloss/images/Pulmad.jpg public/images/
cp scraped/laitseloss/images/PulmadLaud.jpg public/images/
cp scraped/laitseloss/images/Peolaud-Kuldses-saalis.jpg public/images/
cp scraped/laitseloss/images/01-pulm.webp public/images/
cp scraped/laitseloss/images/Lossi-tornid.jpg public/images/
cp scraped/laitseloss/images/ajaluguUexkyll.jpg public/images/
cp scraped/laitseloss/images/main_gastro.jpg public/images/
```

**Step 5: Dev serveri test**

```bash
npm run dev
```

Expected: Astro dev server starts, placeholder page loads at localhost:4321

**Step 6: Commit**

```bash
git init && git add -A && git commit -m "chore: init Astro project with Tailwind and design tokens"
```

---

### Task 2: SVG flourish'id ja jagatud komponendid

**Files:**
- Create: `src/components/Flourish.astro` — SVG flourish komponent (fl-simple, fl-vintage)
- Create: `src/components/GoldRule.astro` — kuldne joon
- Create: `src/components/BurgundyRule.astro` — burgundia joon
- Create: `src/components/Button.astro` — CTA nupu komponent (filled + outline variandid)
- Create: `src/components/TopStripe.astro` — burgundia + kuld ülariba

**Step 1: SVG-d prototüübist**

Extract SVG flourish definitions from `docs/prototypes/_deploy/index.html` (lines 132-148) into `Flourish.astro` component. Props: `type` ("simple" | "vintage"), `size` ("sm" | "md" | "lg"), `fill` ("gold" | "burgundy" | "gold-faded").

**Step 2: Dekoratiivsed jooned**

`GoldRule.astro` — 1px gold gradient horizontal rule. Prop: `width` (default "80px").
`BurgundyRule.astro` — 2px solid burgundy rule. Prop: `width` (default "60px").
`TopStripe.astro` — 4px burgundy bar + 1px gold line.

**Step 3: Button komponent**

`Button.astro` — Props: `variant` ("filled" | "outline"), `href`, `label`.
- Filled: bg-burgundy, text-warm-white, hover:bg-burgundy-hover
- Outline: border-burgundy, text-burgundy, hover:bg-burgundy hover:text-warm-white
- Font: font-ui, uppercase, tracking-wider, px-10 py-4

**Step 4: Kontrolli et komponendid renderuvad**

Add components to placeholder index page, verify visually.

**Step 5: Commit**

```bash
git add src/components/ && git commit -m "feat: add shared decorative and UI components"
```

---

### Task 3: Layout — header, footer, base layout

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro`

**Step 1: Header**

- Logo vasakul (kasuta `docs/prototypes/_deploy/logo-proposal.png`, kopeeri `public/` kausta)
- Nav lingid: Avaleht, Ajalugu, Peod, Seminarid
- Sticky on scroll
- Mobile: hamburger menüü (lihtne CSS-only toggle)
- Font: font-ui, uppercase, tracking-wide

**Step 2: Footer**

- Kontaktinfo: telefon (+372 58 356 509), email (info@laitseloss.ee), aadress
- Google Maps embed (Lossi tee 9, Laitse, Harjumaa)
- Ettevõtte info: Laitse Loss OÜ
- Privaatsuspoliitika link (placeholder)
- Burgundia taust, warm-white tekst, kuld aktsendid

**Step 3: BaseLayout**

- Google Fonts `<link>` tags (Fraunces, Cormorant Infant, Libre Baskerville, Lato)
- `<html lang="et">`
- Meta viewport, charset
- BaseLayout wraps Header + slot + Footer
- Background: warm-white

**Step 4: Visuaalne kontroll**

```bash
npm run dev
```

Verify header sticky, footer with map, mobile responsive.

**Step 5: Commit**

```bash
git add src/ public/ && git commit -m "feat: add base layout with header, footer, and Google Maps"
```

---

### Task 4: Avaleht (Home)

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Hero sektsioon**

- Täisekraani hero, `warm-white` taust
- TopStripe ülaosas
- Kuld flourish (fl-simple, md)
- Pealkiri: "Laitse Loss" — font-display, text-hero, text-warm-dark
- BurgundyRule
- Alapealkiri: "Sündmuste paik ajaloolises lossis" — font-subtitle, italic, text-burgundy
- Teenuste rida: "Pulmad · Vastuvõtud · Seminarid" — font-ui, text-label-sm, uppercase, text-stone
- Body: 1-2 lauset väärtuspakkumisest — font-body
- CTA-d: Button filled "Küsi pakkumist" + Button outline "Avasta ruume"
- Side lines (vertikaalsed kuld jooned servades)

Kasuta v9 Variant B prototüüpi referentsina — `docs/prototypes/_deploy/index.html` read 177-187.

**Step 2: Teenuste ülevaade**

Kaks kaarti kõrvuti (mobile: üksteise all):
- **Peod ja tähtpäevad** — pilt (`Pulmad.jpg`), pealkiri, 2-3 lauset, CTA "Loe lähemalt" → /peod
- **Seminarid ja konverentsid** — pilt (`Salong_.jpg`), pealkiri, 2-3 lauset, CTA "Loe lähemalt" → /seminarid

Kaardid: warm-white taust, kerge shadow või border, hover efekt.

**Step 3: Miks Laitse Loss**

4 väärtuspakkumist ikoonidega või nummerdatult:
- 130+ aastat ajalugu
- 30 min Tallinnast
- Kuni 150 külalist
- Personaalne teenindus

Paigutus: 2x2 grid (desktop), üks tulp (mobile).

**Step 4: Lossi lugu teaser**

- Pilt (`Fassaad.jpg`) + tekst kõrvuti (mobile: alt)
- Pealkiri: "Lossi lugu"
- 2-3 lauset ajaloost
- CTA: "Loe ajalugu" → /ajalugu
- Taustavärv: kerge kontrast (nt warm-dark sektsioon warm-white tekstiga, või vastupidi)

**Step 5: Visuaalne kontroll**

```bash
npm run dev
```

Kontrolli desktop + mobile layout, tüpograafia, värvid, pildid.

**Step 6: Commit**

```bash
git add src/pages/index.astro && git commit -m "feat: build home page with hero, services, value props, history teaser"
```

---

### Task 5: Ajalugu leht

**Files:**
- Create: `src/pages/ajalugu.astro`

**Step 1: Hero**

- Täislaiuses pilt (`Fassaad.jpg` või `Lossi-tornid.jpg`)
- Pealkiri overlay: "Laitse lossi ajalugu" — font-display, text-hero

**Step 2: Lossi ajalugu narratiiv**

- Kirjuta ümber `docs/current-copy/history.md` esimene osa (1219 → ~1890)
- NB: ümberkirjutada, MITTE kopeerida 1:1
- Editorial layout: lai tekstitulp (max-w-prose), suur font-body
- Pull-quote: 1219 kroonika mainimine — font-subtitle, italic, text-burgundy, suurem tekst
- GoldRule sektsioonide vahel
- Pikkus: 300-400 sõna

**Step 3: Woldemar von Uexküll sektsioon**

- Erinev taustvärvus (nt kerge warm-dark taustaga sektsioon)
- Pilt (`ajaluguUexkyll.jpg`) kõrval tekst
- Kirjuta ümber `docs/current-copy/history.md` teine osa
- Pikkus: 300-400 sõna
- Flourish (fl-vintage) sektsiooni lõpus

**Step 4: Visuaalne kontroll**

Desktop + mobile, tüpograafia loetavus, piltide sobivus.

**Step 5: Commit**

```bash
git add src/pages/ajalugu.astro && git commit -m "feat: build history page with editorial layout"
```

---

### Task 6: Peod leht

**Files:**
- Create: `src/pages/peod.astro`

**Step 1: Hero / emotsionaalne sissejuhatus**

- Hero pilt (`01-pulm.webp` või `PulmadLaud.jpg`)
- Pealkiri: "Tähistage oma erilist päeva ajaloolises lossis" — font-display
- Alapealkiri: 1 lause — font-subtitle, italic, text-burgundy
- 2-3 lauset atmosfäärilist teksti — font-body

**Step 2: Tähistamise tüübid**

3 kaarti/sektsiooni:
- **Pulmad** — pilt (`Pulmad.jpg`), 1-2 lauset
- **Sünnipäevad ja tähtpäevad** — pilt (`Peolaud-Kuldses-saalis.jpg`), 1-2 lauset
- **Firmapeod ja galaõhtud** — pilt (`main_gastro.jpg`), 1-2 lauset

Paigutus: kolm kaarti (desktop), üks tulp (mobile). Aspiratsiooniline toon.

**Step 3: Ruumid ja alad**

Vahelduvad sektsioonid (pilt vasak/tekst parem, siis vastupidi):

- **Suur saal** — pilt (`Suur_saal_galerii.jpg`), atmosfääriline kirjeldus, "kuni 150 külalist piduliku banketi jaoks", 110m²
- **Salong** — pilt (`Salong_.jpg`), "intiimne õhkkond kuni 64 külalisele", 56m²
- **Terrass ja aed** — pilt (`Terrass.jpg`), suveüritused, õues söömine

**Step 4: Mida pakume**

Lühikesed bulletid ikoonidega:
- Toitlustus (täpsustada)
- Kaunistused
- Muusika / meelelahutus
- Suveperioodil aed ja terrass

**Step 5: Kontakt sektsioon**

- Pealkiri: "Räägime teie sündmusest"
- Telefon, email
- CTA: Button filled "Küsi pakkumist"

**Step 6: Visuaalne kontroll + commit**

```bash
git add src/pages/peod.astro && git commit -m "feat: build parties page with rooms, celebration types"
```

---

### Task 7: Seminarid leht

**Files:**
- Create: `src/pages/seminarid.astro`

**Step 1: Väärtuspakkumine hero**

- Pealkiri: "Seminarid ja konverentsid Laitse Lossis" — font-display
- Alapealkiri: "Inspireeriv keskkond, mis jääb meelde" — font-subtitle, italic
- 2-3 lauset — miks loss on parem kui hotelli konverentsiruum

**Step 2: Ruumid detailselt**

Iga ruum eraldi sektsioonina:

**Salong (I korrus)**
- Pilt (`Salong_.jpg`)
- Mahutavus tabelina: U-laud 24 | Diplomaat 32 | Klassiruum 40 | Teater 64
- Mõõdud: 56m² (7,5 × 7,5)
- 1-2 lauset ruumi kohta

**Suur saal (soklikorrus)**
- Pilt (`Suur_saal_tuhi.jpg`)
- Mahutavus: Teater 150 | Bankett 100
- Mõõdud: 110m² (5,5 × 20,1)
- 1-2 lauset

**Terrass ja aed**
- Pilt (`Terrass.jpg`)
- Kohvipausid, suveüritused

Mahutavuse tabel: lihtne grid, font-ui, selge ja kompaktne.

**Step 3: Tehnika**

Bullet list:
- Projektor ja ekraan
- WiFi
- Tahvel / flipchart
- (Täpsustada omanikuga)

**Step 4: Asukoht ja ligipääs**

- "~30 minutit Tallinna kesklinnast"
- Parkimisinfo
- Google Maps embed (sama mis footeris, aga siin ka inline)

**Step 5: Kontakt + commit**

```bash
git add src/pages/seminarid.astro && git commit -m "feat: build seminars page with room specs and capacity tables"
```

---

### Task 8: Peod & Seminarid kombineeritud leht (A/B variant)

**Files:**
- Create: `src/pages/sundmused.astro`

**Step 1: Kombineeritud sisu**

- Hero: "Sündmused Laitse Lossis" — üldine hook
- **Peod sektsioon**: tihendatud versioon Task 6-st (~60% pikkusest)
  - Emotsionaalne hook
  - Tähistamise tüübid (kompaktsemad)
  - Ruumid (lühemad kirjeldused)
- **Visuaalne eraldaja**: kuld flourish + GoldRule
- **Seminarid sektsioon**: tihendatud versioon Task 7-st (~60%)
  - Väärtuspakkumine
  - Ruumid mahutavusega
  - Tehnika
- Kontakt

**Step 2: Navigatsiooni anchor lingid**

Lehe ülaosas kaks linki: "Peod ↓" ja "Seminarid ↓" mis scrollivad vastavasse sektsiooni.

**Step 3: Visuaalne kontroll + commit**

```bash
git add src/pages/sundmused.astro && git commit -m "feat: build combined events page (A/B variant)"
```

---

### Task 9: Responsive disain ja mobiilivaade

**Files:**
- Modify: kõik lehed ja komponendid

**Step 1: Mobile-first kontroll**

Käi läbi kõik lehed 375px laiusel:
- Header: hamburger menüü töötab
- Hero: tekst loetav, pildid skaleeruvad
- Kaardid: üks tulp
- Tabelid: horisontaalne scroll või stack
- Footer: üks tulp, kaart täislaiuses
- Pildid: `object-fit: cover`, ei venita

**Step 2: Tablet (768px)**

- Kaardid: 2 kõrvuti
- Ruumide sektsioonid: pilt + tekst kõrvuti

**Step 3: Desktop (1280px+)**

- Max-width konteiner (~1200px), tsentreeritud
- Kaardid: 3 kõrvuti kus sobiv
- Suured hero pildid

**Step 4: Commit**

```bash
git commit -am "fix: responsive design polish across all pages"
```

---

### Task 10: Lõppkontroll ja build

**Step 1: Production build**

```bash
npm run build
```

Expected: builds without errors.

**Step 2: Preview**

```bash
npm run preview
```

Kontrolli kõik lehed visuaalselt, kõik lingid töötavad, pildid laevad.

**Step 3: Lighthouse audit**

Chrome DevTools → Lighthouse → Performance, Accessibility, SEO. Eesmärk: 90+ kõigis kategooriates.

**Step 4: Lõpp-commit**

```bash
git add -A && git commit -m "chore: production build verification"
```

---

## Märkused

- **Copy on esialgne** — lõplik tekst kirjutatakse hiljem copywriting skill'iga
- **Pildid on tööpildid** — scraped laitseloss.ee-lt, omanik annab hiljem uued
- **A/B testimine** — kombineeritud vs eraldi lehed, CTA variandid — tehniline setup hiljem
- **i18n (inglise keel)** — eraldi task hiljem, Astro i18n routing
- **SEO, schema markup, OG images** — Phase 5, eraldi plaan
