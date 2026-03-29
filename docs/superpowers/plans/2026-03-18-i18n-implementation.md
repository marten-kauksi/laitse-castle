# i18n Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Estonian + English language support with file-based translations, locale-prefixed routing, and a flag-based language switcher.

**Architecture:** Astro's built-in i18n routing (`defaultLocale: 'et'`, no prefix for Estonian, `/en/` prefix for English). Translation JSON files provide all UI strings. English page files in `src/pages/en/` import the same components as Estonian pages but pass `locale="en"`. A `LanguageSwitcher` component with flag icons lives in the header.

**Tech Stack:** Astro 5.x i18n routing, TypeScript, SVG flag icons (inline)

---

## File Structure

**Create:**
- `src/i18n/locales/et.json` — Estonian translation strings
- `src/i18n/locales/en.json` — English translation strings (placeholder copy = Estonian)
- `src/i18n/utils.ts` — `t()` helper, `getLocale()`, `getLocalizedPath()`, route map
- `src/i18n/routes.ts` — slug mapping between locales
- `src/components/LanguageSwitcher.astro` — flag icons + ET/EN labels
- `src/pages/en/index.astro` — English home page
- `src/pages/en/history.astro` — English history page
- `src/pages/en/events-and-seminars.astro` — English events page

**Modify:**
- `astro.config.mjs` — add i18n config
- `src/layouts/BaseLayout.astro` — accept `locale` prop, dynamic `lang`, hreflang tags, og:locale
- `src/components/Header.astro` — accept `locale` prop, use translated nav labels, add LanguageSwitcher
- `src/components/Footer.astro` — accept `locale` prop, use translated strings
- `src/pages/index.astro` — extract strings to translation keys
- `src/pages/ajalugu.astro` — extract strings to translation keys
- `src/pages/peod-ja-seminarid.astro` — extract strings to translation keys

---

## Chunk 1: Translation Infrastructure

### Task 1: Route mapping and i18n utilities

**Files:**
- Create: `src/i18n/routes.ts`
- Create: `src/i18n/utils.ts`

- [ ] **Step 1: Create route mapping**

Create `src/i18n/routes.ts`:

```typescript
// Maps Estonian slugs to English slugs and back
export const routeMap: Record<string, Record<string, string>> = {
  et: {
    '/': '/',
    '/ajalugu': '/ajalugu',
    '/peod-ja-seminarid': '/peod-ja-seminarid',
  },
  en: {
    '/': '/en/',
    '/ajalugu': '/en/history',
    '/peod-ja-seminarid': '/en/events-and-seminars',
  },
};

// Reverse map: from any path to its canonical Estonian path
export const reverseRouteMap: Record<string, string> = {
  '/': '/',
  '/ajalugu': '/ajalugu',
  '/peod-ja-seminarid': '/peod-ja-seminarid',
  '/en/': '/',
  '/en/history': '/ajalugu',
  '/en/events-and-seminars': '/peod-ja-seminarid',
};
```

- [ ] **Step 2: Create i18n utilities**

Create `src/i18n/utils.ts`:

```typescript
import etStrings from './locales/et.json';
import enStrings from './locales/en.json';
import { routeMap, reverseRouteMap } from './routes';

export type Locale = 'et' | 'en';
export type TranslationKey = keyof typeof etStrings;

const translations: Record<Locale, Record<string, string>> = {
  et: etStrings,
  en: enStrings,
};

export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] ?? translations['et']?.[key] ?? key;
}

export function getLocale(pathname: string): Locale {
  return pathname.startsWith('/en') ? 'en' : 'et';
}

export function getLocalizedPath(etPath: string, targetLocale: Locale): string {
  return routeMap[targetLocale]?.[etPath] ?? etPath;
}

export function getAlternatePath(currentPath: string, targetLocale: Locale): string {
  // Normalize: strip trailing slash except for root paths
  const normalized = currentPath === '/' || currentPath === '/en/'
    ? currentPath
    : currentPath.replace(/\/$/, '');
  const etPath = reverseRouteMap[normalized] ?? '/';
  return getLocalizedPath(etPath, targetLocale);
}
```

### Task 2: Translation JSON files

**Files:**
- Create: `src/i18n/locales/et.json`
- Create: `src/i18n/locales/en.json`

- [ ] **Step 1: Create Estonian translations**

Create `src/i18n/locales/et.json` with all UI strings extracted from pages/components. Group by component/page:

```json
{
  "nav.home": "Avaleht",
  "nav.events": "Peod ja seminarid",
  "nav.history": "Ajalugu",
  "header.announcement": "<strong>Laitse loss on uue omaniku käes.</strong> See on ametlik veebileht — õiged kontaktandmed ja info leiate siit.",
  "header.menu": "Menüü",

  "footer.tagline": "Ajalooline sündmuste paik",
  "footer.address": "Lossi tee 9, 76302 Laitse, Harjumaa",
  "footer.mapTitle": "Laitse Loss kaardil",

  "cta.contact": "Võta ühendust",
  "cta.bookEvent": "Broneeri oma sündmus",
  "cta.bookEventDesc": "Rääkige meile oma soovidest ja leiame koos parima lahenduse.",
  "cta.readMore": "Loe edasi",
  "contact.tel": "Tel:",
  "contact.email": "E-post:",

  "home.title": "Laitse loss — Ajalooline sündmuste paik Harjumaal",
  "home.description": "Neogooti loss Harjumaal — elegantne sündmuskoht pulmadeks, pidudeks ja seminarideks. ~40 minutit Tallinnast. Tutvu ruumide ja võimalustega.",
  "home.hero.heading": "Laitse loss",
  "home.hero.subtitle": "Ajalooline sündmuste paik Harjumaal",
  "home.hero.body": "Neogooti loss keset Harjumaa loodust — pulmadeks, pidustusteks ja seminarideks. ~40 minutit Tallinnast.",
  "home.services.heading": "Millist sündmust soovite?",
  "home.services.celebrations": "Sünnipäevad, pidustused ja pulmad",
  "home.services.seminars": "Firmaüritused ja seminarid",
  "home.location.label": "Asukoht",
  "home.location.address": "Lossi tee 9, Laitse, Harjumaa",
  "home.location.details": "~40 min Tallinnast · kuni 100 külalist · tasuta parkimine",
  "home.story.since": "Alates 1219",
  "home.story.heading": "Lossi lugu",
  "home.story.p1": "Laitse nimi ilmub ajaloo lehekülgedele esmakordselt 1219. aastal Henriku Liivimaa kroonikas. Sajandeid hiljem, 1890. aastal, ehitas baltisaksa aadlik Woldemar von Uexküll siia neogooti lossihoone — tornikeste ja kunstipäraste detailidega ehitise, mis paistab juba kaugelt.",
  "home.story.p2": "Sõjaväelasest kirjanikuks ja usuliseks müstikuks saanud Woldemari sisemine maailm peegeldub hoone ülevas ilmes. Kodu, mis sai lossiks.",

  "events.title": "Peod ja seminarid — Laitse loss",
  "events.description": "Pulmad, sünnipäevad, firmapeod ja seminarid ajaloolises Laitse lossis. Elegantne keskkond Harjumaal, ~40 min Tallinnast.",
  "events.hero.heading": "Peod ja seminarid",
  "events.hero.subtitle": "Ajalooline loss teie sündmuse teenistuses",
  "events.types.heading": "Teie sündmus lossis",
  "events.types.birthdays": "Sünnipäevad ja tähtpäevad",
  "events.types.birthdaysDesc": "Intiimsetest koosviibimistest suuremate pidustusteni.",
  "events.types.weddings": "Pulmad",
  "events.types.weddingsDesc": "Unustamatu päev ajaloolises lossis.",
  "events.types.corporate": "Firmaüritused ja seminarid",
  "events.types.corporateDesc": "Inspireeriv keskkond, mis jätab mulje.",
  "events.rooms.label": "Ruumid ja alad",
  "events.rooms.heading": "Meie ruumid",
  "events.rooms.klaverisalong": "Klaverisalong",
  "events.rooms.klaverisalongFloor": "I korrus",
  "events.rooms.klaverisalongDesc": "Klassikalise interjööriga salong lossi esimesel korrusel. Loomulik valgus, klaver ja hubane õhkkond sobivad ideaalselt nii väiksematele tähistamistele kui ka töötubadele.",
  "events.rooms.peasaal": "Peasaal",
  "events.rooms.peasaalFloor": "Peamine saal",
  "events.rooms.peasaalDesc": "Lossi peasaal — elegantne ruum banketipidudeks ja vastuvõttudeks. Ajaloolised detailid ja soe atmosfäär loovad meeldejääva keskkonna.",
  "events.rooms.terrass": "Terrass ja aed",
  "events.rooms.terassFloor": "Välialad",
  "events.rooms.terassDesc": "Terrass pakub ideaalset kohta vabaõhu kokteilideks ja einetamiseks. Suur aed sobib suveüritusteks ja tseremooniateks — looduse ja ajaloo kooskõla.",
  "events.rooms.suurSaal": "Suur saal",
  "events.rooms.suurSaalFloor": "Soklikorrus",
  "events.rooms.suurSaalDesc": "Lossi suurim ruum kõrgete võlvlagedega. Sobib suurematele konverentsidele, seminaridele ja üritustele, kus vajate avarust ja vabadust.",
  "events.table.layout": "Paigutus",
  "events.table.capacity": "Mahutavus",
  "events.table.uTable": "U-laud",
  "events.table.diplomat": "Diplomaadistiilis",
  "events.table.classroom": "Klassiruum",
  "events.table.theater": "Teatristiilis",
  "events.table.banquet": "Bankett",
  "events.table.reception": "Vastuvõtt",
  "events.offers.heading": "Mida pakume",
  "events.offers.subtitle": "Teie sündmuse õnnestumiseks hoolitseme kõige eest",
  "events.offers.rooms": "Ruumide rent",
  "events.offers.roomsDesc": "Paindlikud ruumilahendused vastavalt teie ürituse formaadile ja suurusele.",
  "events.offers.decor": "Kaunistused ja dekoreerimine",
  "events.offers.decorDesc": "Aitame luua teie nägemuse kohase kaunistuse, mis sobib lossi ajaloolise interjööriga.",
  "events.offers.catering": "Toitlustus",
  "events.offers.cateringDesc": "Aitame leida teie sündmusele sobiva toitlustuslahenduse — kohvipausidest piduliku õhtusöögini.",

  "history.title": "Laitse lossi ajalugu — Neogooti loss alates 1219",
  "history.description": "Laitse lossi ajalugu alates 1219. aastast kuni neogooti lossihoone valmimiseni 1890. aastal. Tutvu ehitaja Woldemar von Uexkülli looga.",
  "history.hero.heading": "Laitse lossi ajalugu",
  "history.narrative.p1": "Laitse nimi ilmub ajaloo lehekülgedele esmakordselt juba XIII sajandi alguses. Taani ristisõdijad, kes 1219. aasta talvel Eestimaa põhjaosa vallutusretkedel liikusid, jõudsid veebruarikuu lõikava külmaga vaikusesse mähkunud külakesse, mida Henriku Liivimaa kroonikas tähistatakse nimega Ladise. Sõdamehed pidasid seal öömaja ja jätsid siis edasi, kuid kohanimi jäi kroonikasse igaveseks.",
  "history.narrative.quote": "1219. aasta veebruaris jõudsid ristisõdijad Ladise-nimele külasse ja jäid sinna öömajale.",
  "history.narrative.quoteSource": "Henriku Liivimaa kroonika",
  "history.narrative.p2": "Sajandeid kuulus see paik Ruila ordumõisale. Olud muutusid XVII sajandi alguses, kui Rootsi võimude kingitusena anti kogu Ruila valdus 1622. aastal Riia bürgermeistrile Johan Ulrichile. Tema soost kujuneski Laitse mõisaks: vanimad kindlad teated iseseisva mõisana pärinevad aastast 1637. Ulrichite perekond hoidis maad enda käes ligi kakssada aastat, kuni 1814. aastani, mil valdus päranes Mohrenschildtide suguvõsale.",
  "history.narrative.p3": "XIX sajandi teisel poolel vahetusid omanikud sagedasti. Mohrenschildtide järelt läks mõis Tallinna pastorite toetusfondile, siis suurtöösturile Alexander Eggersile ning pärastpoole Paul Heinrich von Dehni käsutusse. Muutus saabus 1883. aastal, kui Kose-Uuemõisalt pärit Natalie von Uexküll ostis Laitse oma pojale Woldemarile. Just see ost muutis kõike: Woldemar von Uexküll, noor ja kujutlusvõimeline aadlik, hakkas kavandama midagi, mida senini Laitse küplev maastik polnud näinud.",
  "history.narrative.p4": "Umbes 1890. aastal valmis Woldemari nägemusest inspireeritud neogooti lossihoone — tornikeste, viilkatuse ja kunstipäraste detailidega ehitis, mis paistab juba kaugelt. See on romantiline loss, mida ehitas romantiline hing. Pärast sõjaväelist karjääri pööris Woldemar kirjanduse ja usulise müstika poole, ning tema sisemine maailm peegeldub hoone ülevas, unistavas ilmes. Kodu, mis sai lossiks; mõis, mis sai muinaslooliseks.",
  "history.woldemar.heading": "Woldemar von Uexküll",
  "history.woldemar.p1": "Parun Woldemar Reinhold Karl Alexander von Uexküll sündis 28. augustil 1860 Kose-Uuemõisas, vana baltisaksa aadliperekonna järglasena. Ta omandas hariduse Tallinna Toomkoolis ja hiljem Kuressaare gümnaasiumis, ning astus seejärel vabatahtlikuna Vene keisririigi ratsaväkke. Kaks aastat teenis ta Novorossiiskis, Põhja-Kaukaasia sõjas piirkonnas, enne kui otsustas sõjaväelise elu seljataha jätta.",
  "history.woldemar.p2": "Eestisse naastes ostis Woldemar Laitse mõisa ja abiellus 1883. aastal Prantsuse suursaadiku tütre Olga Marquis de Tallenay'ga. Kuid just isikliku elu keerulisus suunas noort parunit vaimsete otsingute teele. Abielu lahutati 1890ndatel aastatel, uus abielu 1899. aastal Martha von Ditmariga — need sõlmpunktid märkisid pööret, mille käigus Woldemar pöördus üha enam usu ja kirjanduse poole.",
  "history.woldemar.p3": "Laitse-perioodil ehitas ta praeguse neogooti lossihoone, arendas põllumajandust ja pidas Nissi vallas kohtuniku ametit. Samuti tugevdas ta sidemeid rahvusvahelise evangeelse liikumisega: 1905. aastal esindas ta Baptistliku Maailmaliidu Londoni konverentsil Vene Baptistlikku Liitu ja valiti üheks asepresidendiks. Talle oli oluline ka kohalik kogukond: Laitsesse loodi tema toetusel pühapäevakool ja algkool.",
  "history.woldemar.p4": "Üks tema lähedasemaid kaaslasi oli arhitektuurihuviline Nõmme asutaja Nicolai von Glehn. Pole võimalik välistada, et Glehn avaldas mõju ka Laitse lossihoone kujunemisele — mõlemad mehed jagasid vaimustust gooti vormide ja romantiliste ideaalide vastu.",
  "history.woldemar.p5": "1909. aastal müüs Woldemar Laitse mõisa: ainsale pojale, kes oli rüütelkonnast välja heidetud, ta seda pärandada ei saanud, tütar aga elas välismaal. Mõis läks Bremenite perekonna valdusse. Woldemar ise elas oma eluõhtul Austrias ja Šveitsis, kus ta jätkas vaimset otsingut ja kirjanduslikku loometööd. Ta suri 1945. aastal Baselis."
}
```

- [ ] **Step 2: Create English translations (placeholder)**

Create `src/i18n/locales/en.json` — copy of Estonian file. English copy will be replaced later. Only translate structural UI strings that are language-obvious:

```json
// Same structure as et.json but with placeholder English for nav/UI:
"nav.home": "Home",
"nav.events": "Events & seminars",
"nav.history": "History",
"header.menu": "Menu",
"contact.tel": "Tel:",
"contact.email": "Email:",
"cta.contact": "Contact us",
"cta.readMore": "Read more",
// ... all other keys: copy Estonian values as-is (placeholder)
```

### Task 3: Astro i18n config

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Add i18n config**

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://laitseloss.ee',
  i18n: {
    defaultLocale: 'et',
    locales: ['et', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    tailwind(),
    sitemap(),
  ],
});
```

- [ ] **Step 2: Verify build**

Run: `npx astro build`
Expected: Build succeeds with no i18n errors.

---

## Chunk 2: Layout and Component Updates

### Task 4: Update BaseLayout for locale support

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Add locale prop and dynamic lang/hreflang**

Update the Props interface to accept `locale`. Set `<html lang>` dynamically. Add hreflang alternate links. Update `og:locale`.

Key changes:
- Add `locale?: 'et' | 'en'` to Props (default `'et'`)
- `<html lang={locale}>` instead of hardcoded `"et"`
- Add `<link rel="alternate" hreflang="et" href="{etUrl}" />` and `<link rel="alternate" hreflang="en" href="{enUrl}" />`
- `og:locale` becomes `locale === 'en' ? 'en_GB' : 'et_EE'`
- `websiteSchema.inLanguage` becomes dynamic

### Task 5: Create LanguageSwitcher component

**Files:**
- Create: `src/components/LanguageSwitcher.astro`

- [ ] **Step 1: Create the component**

```astro
---
import { getAlternatePath } from '../i18n/utils';
import type { Locale } from '../i18n/utils';

interface Props {
  locale: Locale;
  currentPath: string;
}

const { locale, currentPath } = Astro.props;
const etPath = getAlternatePath(currentPath, 'et');
const enPath = getAlternatePath(currentPath, 'en');
---

<div class="flex items-center gap-1.5">
  <a
    href={etPath}
    class:list={[
      'flex items-center gap-1 px-1.5 py-1 rounded text-xs font-ui uppercase tracking-wide transition-colors duration-200 min-h-[44px]',
      locale === 'et' ? 'lang-active' : 'lang-inactive',
    ]}
    aria-label="Eesti keeles"
  >
    <!-- Estonian flag -->
    <svg width="20" height="14" viewBox="0 0 20 14" class="rounded-[2px] shadow-sm">
      <rect width="20" height="4.67" fill="#0072CE"/>
      <rect y="4.67" width="20" height="4.67" fill="#000000"/>
      <rect y="9.33" width="20" height="4.67" fill="#FFFFFF" stroke="#e5e5e5" stroke-width="0.3"/>
    </svg>
    <span>ET</span>
  </a>
  <a
    href={enPath}
    class:list={[
      'flex items-center gap-1 px-1.5 py-1 rounded text-xs font-ui uppercase tracking-wide transition-colors duration-200 min-h-[44px]',
      locale === 'en' ? 'lang-active' : 'lang-inactive',
    ]}
    aria-label="In English"
  >
    <!-- UK flag (simplified) -->
    <svg width="20" height="14" viewBox="0 0 20 14" class="rounded-[2px] shadow-sm">
      <rect width="20" height="14" fill="#012169"/>
      <path d="M0,0 L20,14 M20,0 L0,14" stroke="#FFFFFF" stroke-width="2.5"/>
      <path d="M0,0 L20,14 M20,0 L0,14" stroke="#C8102E" stroke-width="1.5"/>
      <rect x="8.5" width="3" height="14" fill="#FFFFFF"/>
      <rect y="5" width="20" height="4" fill="#FFFFFF"/>
      <rect x="9" width="2" height="14" fill="#C8102E"/>
      <rect y="5.5" width="20" height="3" fill="#C8102E"/>
    </svg>
    <span>EN</span>
  </a>
</div>

<style>
  .lang-active {
    opacity: 1;
  }
  .lang-inactive {
    opacity: 0.5;
  }
  .lang-inactive:hover {
    opacity: 0.8;
  }
</style>
```

### Task 6: Update Header with locale support

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Add locale prop, translated nav, and language switcher**

Key changes:
- Import `t` from `../i18n/utils` and `LanguageSwitcher`
- Accept `locale` prop (default `'et'`)
- Replace hardcoded `navLinks` with `t(locale, 'nav.home')` etc.
- Replace hardcoded announcement text with `t(locale, 'header.announcement')`
- Nav hrefs use `getLocalizedPath()` for current locale
- Add `<LanguageSwitcher>` in the nav bar (desktop: after nav links, mobile: in dropdown)

### Task 7: Update Footer with locale support

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Add locale prop and translated strings**

Key changes:
- Accept `locale` prop (default `'et'`)
- Import `t` from `../i18n/utils`
- Replace hardcoded strings with `t(locale, key)` calls

---

## Chunk 3: Page Updates

### Task 8: Update Estonian pages to use translation keys

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/ajalugu.astro`
- Modify: `src/pages/peod-ja-seminarid.astro`

- [ ] **Step 1: Update index.astro**

Import `t` from `../i18n/utils`. Replace all hardcoded Estonian strings with `t('et', 'key')` calls. Pass `locale="et"` to `<BaseLayout>`.

- [ ] **Step 2: Update ajalugu.astro**

Same pattern — replace hardcoded strings with `t('et', 'key')` calls.

- [ ] **Step 3: Update peod-ja-seminarid.astro**

Same pattern — replace hardcoded strings with `t('et', 'key')` calls.

- [ ] **Step 4: Verify build**

Run: `npx astro build`
Expected: Build succeeds, Estonian site works identically to before.

### Task 9: Create English page files

**Files:**
- Create: `src/pages/en/index.astro`
- Create: `src/pages/en/history.astro`
- Create: `src/pages/en/events-and-seminars.astro`

- [ ] **Step 1: Create en/index.astro**

Mirror of `src/pages/index.astro` but with `locale="en"` and `t('en', key)` calls throughout. Same imports, same structure, same components.

- [ ] **Step 2: Create en/history.astro**

Mirror of `src/pages/ajalugu.astro` with `locale="en"`.

- [ ] **Step 3: Create en/events-and-seminars.astro**

Mirror of `src/pages/peod-ja-seminarid.astro` with `locale="en"`.

- [ ] **Step 4: Final build and verify**

Run: `npx astro build`
Expected: Build succeeds. Both `/` and `/en/` routes exist. Language switcher works on all pages.

---

## Chunk 4: SEO and Sitemap

### Task 10: Sitemap and hreflang verification

- [ ] **Step 1: Verify sitemap includes both locales**

Run: `npx astro build && cat dist/sitemap-0.xml`
Expected: Both Estonian and English URLs present.

- [ ] **Step 2: Verify hreflang tags in built HTML**

Check that each page has:
```html
<link rel="alternate" hreflang="et" href="https://laitseloss.ee/..." />
<link rel="alternate" hreflang="en" href="https://laitseloss.ee/en/..." />
```

- [ ] **Step 3: Dev server smoke test**

Run: `npx astro dev`
Test all routes manually:
- `/` → Estonian home
- `/ajalugu` → Estonian history
- `/peod-ja-seminarid` → Estonian events
- `/en/` → English home
- `/en/history` → English history
- `/en/events-and-seminars` → English events
- Language switcher links correctly on each page
