# Guest Check-In (Majutusteenuse kasutaja registreerimine) — Design

**Date:** 2026-07-27
**Status:** Built — awaiting migration + RLS verification against Supabase
**Author:** Marten Kauksi + Claude

---

## 1. Context

Laitse loss offers accommodation (guest rooms: Ülemkantsleri, Pastorihärra, Noorhärra,
Tallmeistri, Pargivahi, Seltsidaami, Kammerneitsi). Under Estonian law an accommodation
provider must register every guest before the stay begins and retain that data for two
years.

Today there is no form anywhere on the site — `STATE.md` records "No inquiry form — just
contact info" as a deliberate decision. This design adds the first backend tier to an
otherwise fully static site.

Guests reach the form by scanning a **single static QR code** at the front desk, or by
being sent the same URL in advance. There is no per-booking link and no token.

---

## 2. Legal basis

**Turismiseadus § 24** — "Majutusteenuse kasutaja registreerimine"
([Riigi Teataja](https://www.riigiteataja.ee/akt/113032014069?leiaKehtiv), consolidated
text as amended by RT I, 04.12.2020, 1 — in force 01.05.2021).

The 2021 amendment removed the paper *külastajakaart* and its signature requirement.
Electronic registration is permitted with no prescribed form.

| Clause | Requirement |
|---|---|
| § 24(1) | Register **"üldjuhul reisidokumendi või isikutunnistuse alusel"** — as a rule on the basis of the travel document or ID card, before the stay begins. Absent one, registration may proceed on another document **or the guest's own statements** (`ütluste alusel`). |
| § 24(2) | For EE/EEA/Swiss citizens and foreigners holding Estonian residence — **at minimum**: given & surname(s), date of birth, citizenship, **country of residence**, dates of stay, purpose of travel, number of accompanying minors. |
| § 24(3) | All other persons additionally: travel document type, number, issuing country. |
| § 24(4) | No data need be registered for accompanying minor children. |
| § 24(6) | The guest is responsible for accuracy. The provider **may** require the document to verify identity. |
| § 24(7) | Retain **two years** from the date of registration. |
| § 24(8) | Must be disclosable to PPA and security authorities on demand. |

Note § 24(2) requires **country of residence only** — not a street address. No personal
identification code (isikukood) is required or collected.

**GDPR basis:** Art. 6(1)(c) — compliance with a legal obligation. Deliberately *not*
consent, which would be withdrawable and therefore unusable for a statutory register.

**Business prerequisite (outside this build):** commercial accommodation in Estonia
requires registration as a *majutusettevõte* in the Majandustegevuse register (MTR).
Confirm Nevaliste OÜ is registered before go-live.

---

## 3. Scope

**In scope (v1)**

- Public check-in form, Estonian and English
- Supabase table, RLS, constraints, automatic two-year deletion
- Privacy policy updates in both languages
- Analytics suppressed on check-in routes
- RLS verification script

**Deferred**

- **MRZ scanning.** Client-side WASM read of the passport/ID machine-readable zone,
  image never leaving the device. Deferred by decision — for an EEA guest it fills only
  3 of 7 fields. Revisit once the manual form has real usage.
- Admin dashboard. Staff read the table in the Supabase dashboard.
- Per-stay links / tokens / booking records. Booking.com remains the source of truth.
- Email notifications.

**Explicit non-goals**

- **No free-form message, notes or comment field.** The only free-text inputs are the two
  name fields and the document number, each length-capped; everything else is a date,
  a number or an enumerated select. Automated form spam is overwhelmingly link injection
  and needs somewhere to put a URL, so a form with no prose field has no payload surface.
  This is why no CAPTCHA is needed.
- No storage of any ID image, ever.

---

## 4. Architecture

```
/registreerimine (ET)  ─┐
/en/check-in     (EN)  ─┼── fetch() POST ──► PostgREST ──► RLS: anon INSERT only
   static QR → one URL ─┘                                        │
                                              pg_cron nightly ──►│ DELETE > 2 years
                                                  Supabase dashboard (staff read)
```

Static Astro pages with a client-side script. No adapter change, no SSR, no Edge
Function. Vercel deployment is unaffected.

**No `@supabase/supabase-js` dependency.** The client posts directly to PostgREST with
`fetch()` — roughly fifteen lines. Adding ~40 KB of SDK to a marketing site currently
scoring 78 on Lighthouse performance is not justified for a single INSERT.

```js
await fetch(`${SUPABASE_URL}/rest/v1/guest_registrations`, {
  method: 'POST',
  headers: {
    apikey: PUBLISHABLE_KEY,
    Authorization: `Bearer ${PUBLISHABLE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal',      // never needs SELECT
  },
  body: JSON.stringify(rows),      // array → multi-adult in one request
});
```

`Prefer: return=minimal` matters: without it PostgREST tries to return the inserted row,
which requires a `SELECT` grant we are deliberately withholding.

---

## 5. Data model

One table. One row per **adult** guest. Accompanying minors are a count only (§ 24(4)).

```sql
create table public.guest_registrations (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),

  -- § 24(2)1–2
  given_names   text not null check (char_length(btrim(given_names)) between 1 and 100),
  surname       text not null check (char_length(btrim(surname))     between 1 and 100),
  date_of_birth date not null check (date_of_birth between '1900-01-01' and '2035-01-01'),

  -- § 24(2)3–4  (ISO 3166-1 alpha-2)
  citizenship          char(2) not null check (citizenship          ~ '^[A-Z]{2}$'),
  country_of_residence char(2) not null check (country_of_residence ~ '^[A-Z]{2}$'),

  -- § 24(2)5
  arrival_date   date not null check (arrival_date   between '2020-01-01' and '2100-01-01'),
  departure_date date not null check (departure_date between '2020-01-01' and '2100-01-01'),

  -- § 24(2)6–7
  purpose_of_travel   text     not null check (purpose_of_travel in ('leisure','business','other')),
  accompanying_minors smallint not null default 0 check (accompanying_minors between 0 and 20),

  -- drives the § 24(3) exemption
  has_estonian_residence boolean not null default false,

  -- § 24(3) — non-EEA only
  document_type    text    check (document_type in ('passport','id_card','other')),
  document_number  text    check (char_length(btrim(document_number)) between 3 and 40),
  document_country char(2) check (document_country ~ '^[A-Z]{2}$'),

  locale text not null default 'et' check (locale in ('et','en')),

  constraint stay_dates_ordered check (departure_date >= arrival_date),
  constraint stay_length_sane   check (departure_date <= arrival_date + 90),

  constraint turs_24_3_document_required check (
    not public.turs_requires_document(citizenship, has_estonian_residence)
    or (document_type    is not null
    and document_number  is not null
    and document_country is not null)
  )
);

create index guest_registrations_arrival_idx on public.guest_registrations (arrival_date);
create index guest_registrations_created_idx on public.guest_registrations (created_at);
```

`turs_24_3_document_required` encodes § 24(3) in the database rather than trusting the
browser. The exempt-country list lives in one place in SQL — the immutable function
`public.turs_requires_document(citizenship, has_estonian_residence)` — mirrored once in
TypeScript as `EEA_AND_CH`; change both together.

Bounds use literal dates rather than `current_date`, because non-immutable functions in
`CHECK` constraints are a known Postgres footgun on dump/restore; "not in the future" is
enforced client-side only.

**No address is collected.** § 24(2)4 requires country of residence only — no street,
city or postcode — so none is stored.

---

## 6. Security

The entire boundary is in Postgres. The publishable key ships in the page source — that
is expected and safe, because the key grants nothing but `INSERT`.

```sql
alter table public.guest_registrations enable row level security;

revoke all    on public.guest_registrations from anon, authenticated;
grant  insert on public.guest_registrations to   anon;

create policy guest_self_registration
  on public.guest_registrations
  for insert to anon
  with check (true);
```

No `SELECT`, `UPDATE` or `DELETE` policy exists, so all three are denied. Grants and RLS
are independent layers and both are closed here deliberately.

**This is the single most important part of the build.** The table holds names, dates of
birth and passport numbers. If `anon` could `SELECT`, the entire guest register would be
publicly downloadable — a personal data breach notifiable to AKI within 72 hours.

**Threat notes, stated honestly:**

- A honeypot field is included, but it only stops bots that render the page. A script
  posting straight to PostgREST is stopped by nothing except RLS and the `CHECK`
  constraints. The realistic worst case is junk rows — noise and storage cost, not
  disclosure.
- Accepted deliberately: form spam is overwhelmingly link injection, which needs a
  free-text field to be worth sending. This form has none.
- Mitigation if junk ever appears: insert an Edge Function with per-IP rate limiting in
  front of the table. This changes only the fetch URL in the page — no schema change.

**Supabase project must be in an EU region** (Frankfurt or Stockholm) and their DPA
accepted; Supabase is the processor for this data.

**The secret key (`sb_secret_…`, formerly `service_role`) must never appear in `.env` or
Vercel with a `PUBLIC_` prefix** — Astro would inline it into a public JS bundle,
handing over the whole register. It is not needed anywhere in this design.

---

## 7. Retention (§ 24(7))

With no admin UI, nobody will ever prune this by hand. Retaining a guest register
indefinitely is its own GDPR violation, independent of everything else, so deletion must
be automatic.

```sql
create extension if not exists pg_cron;

select cron.schedule(
  'prune-guest-registrations',
  '15 3 * * *',
  $$delete from public.guest_registrations
     where created_at < now() - interval '2 years'$$
);
```

`pg_cron` is enabled from Dashboard → Database → Extensions.

---

## 8. Privacy and analytics

**PostHog must not run on these routes.** `src/components/PostHog.astro` currently
enables session recording after consent, which would record guests typing dates of birth
and passport numbers. Leaving this to the cookie banner is not acceptable.

`BaseLayout.astro` gains two props:

```ts
interface Props {
  // …existing
  noAnalytics?: boolean;   // skips <PostHog /> and <CookieConsent /> entirely
  noindex?: boolean;       // emits <meta name="robots" content="noindex, nofollow">
}
```

Both check-in pages set both. The component is not rendered at all — not disabled at
runtime — so no PostHog code reaches the page. Form inputs additionally carry
`ph-no-capture` as defence in depth.

`noindex` is for tidiness, not security: unlinked URLs are found regardless (wordlist
scanning, link-preview fetchers, Common Crawl). Security comes from RLS. Both routes are
also excluded from the sitemap.

**Privacy policy** (`privaatsuspoliitika.astro` and `en/privacy-policy.astro`) gains a
section covering: the § 24 registration purpose, legal basis Art. 6(1)(c) + Turismiseadus
§ 24, the exact field list, two-year retention, disclosure to PPA and security
authorities under § 24(8), and Supabase as EU-region processor.

**Data subject rights — state the split precisely.** § 24 mandates the *data*, not the
*document*, and the two are treated differently:

| Data | Retention | Erasure on request |
|---|---|---|
| The seven § 24(2) fields (+ § 24(3) document details) | 2 years, mandatory | Restricted — GDPR Art. 17(3)(b) |
| Any identity document **image** | Never stored | N/A — none is ever created |

The policy must say erasure is restricted for the register during the statutory period;
promising otherwise commits to something legally impossible. It must equally not
overstate the restriction: **access (Art. 15) and rectification (Art. 16) apply in full
throughout**, only erasure is limited, and the restriction lapses entirely at two years —
which `pg_cron` handles unprompted.

An ID image would carry **no** Art. 17(3)(b) shield, because nothing in § 24 requires
retaining a copy of the document. Storing one would mean holding personal data with no
statutory basis, erasable on demand, plus an AKI copying problem and breach-notification
exposure. This is the core reason the design stores none — and the reason client-side
MRZ was chosen over server-side OCR when scanning is eventually built: an image that
never leaves the guest's device never becomes the controller's data at all.

---

## 9. Routes and UX

| Route | Locale |
|---|---|
| `/registreerimine` | Estonian |
| `/en/check-in` | English |

Separate files per locale, per the duplication rule in `CLAUDE.md` — every layout change
applies to both.

**Stay section, entered once and copied to every guest row:** arrival date · departure
date · purpose of travel (select: puhkus / töö / muu) · number of accompanying minors ·
phone (required) · email (optional).

**Per guest:** given names · surname · date of birth · citizenship · country of residence.

When a **non-EEA citizenship** is selected, the form reveals a checkbox — *"Mul on Eesti
elamisluba või elamisõigus"* — and, if unchecked, three required document fields (type,
number, issuing country). EEA and Swiss guests never see them.

**Multiple adults:** "Lisa veel külaline" appends another guest block; all blocks submit
as one array in a single request. Equally, several people may each scan the same QR and
submit separately. Both work without coordination, since there is no stay record to
reconcile against.

Existing design system throughout. Typography follows the `CLAUDE.md` rules —
comfortably large, high contrast, nothing at the `text-subtitle` token size. Labels are
visible (never placeholder-only), touch targets meet WCAG 2.1 AA, and errors are
announced to assistive technology. A failed submission never clears entered data.

The page states plainly, above the form, why the data is required (Turismiseadus § 24),
how long it is kept, and that no identity document is stored.

---

## 10. Configuration

`docs/supabase-env.example`, following the existing `docs/posthog-env.example` pattern:

```
PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Astro exposes only `PUBLIC_`-prefixed variables to client code; `NEXT_PUBLIC_` is Next.js
convention and yields `undefined` at runtime with no build error. The same two variables
must be set in Vercel, and because the site is static they are inlined **at build time** —
changing them requires a redeploy, not just a save.

---

## 11. Testing

The project has no test runner. Two additions, kept minimal.

**`scripts/verify-rls.mjs` — the one test that must exist.** Using the publishable key,
assert that:

1. `SELECT` returns an error or zero rows
2. `UPDATE` is rejected
3. `DELETE` is rejected
4. A valid `INSERT` succeeds

This is the difference between a working form and a public guest register, and it must
be run against production after the migration.

**Constraint tests** (SQL): departure before arrival rejected; non-EEA citizenship
without document fields rejected; the same with `has_estonian_residence = true` accepted;
`accompanying_minors = -1` rejected.

**Playwright** (`.playwright-cli` already present): happy path in both locales, the
non-EEA conditional reveal, validation errors preserving input, and mobile at 375 px.

---

## 12. Changes made during implementation

1. **Phone (required) and email (optional) added** at the owner's request. Neither is
   required by § 24, so they rest on the accommodation contract rather than the legal
   obligation — meaning they *are* erasable on request. A second `pg_cron` job nulls them
   at 6 months while the statutory fields serve their full 2 years.
2. **Purpose of travel and minor count kept**, though the owner's field list omitted them.
   § 24(2)6 and § 24(2)7 make both mandatory; dropping them would produce a register that
   fails the statute this form exists to satisfy. Reduced to a 3-option select and a
   number defaulting to 0.
3. **Country lists sort per display locale.** `COUNTRIES` ships in Estonian collation;
   rendering that list untranslated put "United States" 4th on the English page (sorting
   as "Ameerika Ühendriigid"). `CheckInGuestBlock` now re-sorts with `Intl.Collator(locale)`.
4. **Check-in `<h1>` does not use `text-hero`.** Its 38px floor overflows a 375px viewport,
   because "Sisseregistreerimine" is one unbreakable 20-character word. Both pages use
   `clamp(30px,7vw,68px)`, which reaches the same 68px on desktop.
5. **No stay-level `country_of_residence`** — it is per guest, as § 24(2) requires. Arrival,
   departure, purpose, minors, phone and email are entered once and copied onto every
   guest row.
6. `.claude/launch.json` had hardcoded Windows paths (`C:\Program Files\nodejs\…`) and
   could not start on macOS; switched to `npm` resolved from `PATH`.
7. **"Reisi eesmärk" relabelled "Külastuse eesmärk" / "Reason for your stay."** The
   statutory phrase reads as though it asks about a destination; the owner's own
   reaction was the evidence. Stored values (`leisure`/`business`/`other`) unchanged.
8. **No gold callout above the form.** It existed to carry "we never store your ID
   photo", which is premature while MRZ is deferred. Replaced by a plain line carrying
   only retention + PPA disclosure + the privacy link, which GDPR Art. 13 requires at
   the point of collection. The ID-image statement remains in both privacy policies,
   where it is accurate and useful. Restore the callout when MRZ ships.
9. **The Estonian-residence checkbox was removed, and the exemption inferred instead.**
   § 24(2) exempts third-country nationals resident in Estonia from § 24(3)'s document
   requirement. Rather than ask a separate question, this is now derived from
   `country_of_residence = 'EE'`, which the guest has already answered — so a Ukrainian
   citizen living in Tallinn is never asked for a passport number.

   `turs_requires_document(citizenship, country_of_residence, has_estonian_residence)`
   encodes the same rule in Postgres, mirrored by `needsTravelDocument()` in
   `src/lib/countries.ts`. **Both must change together** — had only the form changed,
   every Ukraine/Estonia row would have been rejected by the CHECK constraint.

   Slightly over-inclusive: someone in Estonia on a long-stay visa rather than a
   residence permit is technically not exempt. That errs toward collecting *less*, which
   is the right direction under data minimisation. The `has_estonian_residence` column is
   retained (always `false`) so an explicit question can be reinstated without a migration.
10. **Document fields clear themselves when they stop applying.** Switching a guest from
   a non-EEA to an exempt citizenship wipes any already-typed document values, so a
   hidden field can never smuggle data into the payload. Blank values are sent as
   `null`, not `''` — `''` fails the `char(2)` and enum CHECK constraints and would
   have rejected every EEA guest's submission.

## Email notification (`20260727000001_checkin_email_notification.sql`)

A statement-level `AFTER INSERT` trigger with a transition table calls the Resend API
directly over `pg_net` — no Edge Function, no deploy step. Statement-level means a party
of three submitted together produces one email, not three. Failures are swallowed with a
warning: a notification must never roll back a registration.

Secrets live in Supabase Vault (`resend_api_key`, `checkin_notify_to`), never in the
migration or a table. If either is unset the trigger no-ops.

**The email carries no personal data** — guest count and stay dates only. Mailing the
register contents would copy § 24 data into an inbox beyond the reach of the two-year
deletion job, where it would persist in the mail provider indefinitely and turn one
compromised mailbox into a register breach. Staff open Supabase for details.

## 13. Open items

1. Confirm the Supabase project region is EU and the DPA is accepted.
2. Confirm Nevaliste OÜ is registered as a *majutusettevõte* in MTR before go-live.
3. Decide who at the castle holds Supabase dashboard access, and ensure those accounts
   have 2FA — dashboard access reads the full register.
4. Print/produce the QR code for the front desk once the route is live.
