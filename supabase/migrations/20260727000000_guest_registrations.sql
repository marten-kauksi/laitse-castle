-- ============================================================================
-- Guest check-in register — Turismiseadus § 24
-- "Majutusteenuse kasutaja registreerimine"
--
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Design doc: docs/superpowers/specs/2026-07-27-guest-check-in-design.md
-- Statute:    https://www.riigiteataja.ee/akt/113032014069?leiaKehtiv
--
-- The project MUST be in an EU region (Frankfurt or Stockholm).
-- ============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- 0. Who must supply travel document details (§ 24(3))?
--
--    § 24(2) — the short field list, with no document details — covers TWO
--    groups: EEA/Swiss citizens, AND third-country nationals residing in Estonia
--    on a residence permit or right of residence. § 24(3) applies only to people
--    named in neither.
--
--    Estonian residence is inferred from country_of_residence = 'EE' rather than
--    asked separately: the guest has already answered it, so a second question
--    would be redundant. Slightly over-inclusive — someone here on a long-stay
--    visa rather than a permit is technically not exempt — but that errs toward
--    collecting LESS, which is the right direction under data minimisation.
--
--    Defined once here and reused by the CHECK constraint, so the country list
--    lives in exactly one place in SQL.
--    Keep in sync with EEA_AND_CH and needsTravelDocument() in src/lib/countries.ts.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.turs_requires_document(
  p_citizenship          char(2),
  p_country_of_residence char(2),
  p_has_ee_residence     boolean
) returns boolean
language sql
immutable
parallel safe
as $$
  select not coalesce(p_has_ee_residence, false)
     and coalesce(p_country_of_residence, '') <> 'EE'
     and coalesce(p_citizenship, '') not in (
       'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT',
       'LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE',  -- EU 27
       'IS','LI','NO',                                               -- EEA
       'CH'                                                          -- Switzerland
     )
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Table — one row per ADULT guest.
--    Accompanying minors are a count only; § 24(4) requires no data for them.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.guest_registrations (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),

  -- § 24(2)1–2 — identity
  given_names   text not null check (char_length(btrim(given_names)) between 1 and 100),
  surname       text not null check (char_length(btrim(surname))     between 1 and 100),
  date_of_birth date not null check (date_of_birth between '1900-01-01' and '2035-01-01'),

  -- § 24(2)3–4 — citizenship and country of residence (ISO 3166-1 alpha-2).
  -- Note: country only. The statute does NOT require a street address.
  citizenship          char(2) not null check (citizenship          ~ '^[A-Z]{2}$'),
  country_of_residence char(2) not null check (country_of_residence ~ '^[A-Z]{2}$'),

  -- § 24(2)5 — dates of stay
  arrival_date   date not null check (arrival_date   between '2020-01-01' and '2100-01-01'),
  departure_date date not null check (departure_date between '2020-01-01' and '2100-01-01'),

  -- § 24(2)6–7
  purpose_of_travel   text     not null check (purpose_of_travel in ('leisure', 'business', 'other')),
  accompanying_minors smallint not null default 0 check (accompanying_minors between 0 and 20),

  -- Drives the § 24(3) exemption for non-EEA citizens living in Estonia.
  has_estonian_residence boolean not null default false,

  -- § 24(3) — required for non-EEA/CH citizens without Estonian residence.
  document_type    text    check (document_type in ('passport', 'id_card', 'other')),
  document_number  text    check (char_length(btrim(document_number)) between 3 and 40),
  document_country char(2) check (document_country ~ '^[A-Z]{2}$'),

  -- NOT required by § 24. Collected for the accommodation contract, so these are
  -- freely erasable on request and are nulled out early (see § 4 below).
  phone text     check (phone ~ '^[+0-9][0-9 ()\-]{4,24}$'),
  email text     check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
                        and char_length(email) <= 254),

  locale text not null default 'et' check (locale in ('et', 'en')),

  constraint stay_dates_ordered check (departure_date >= arrival_date),
  constraint stay_length_sane   check (departure_date <= arrival_date + 90),

  -- § 24(3) enforced in the database, not merely in the browser.
  -- Guests outside the exempt set MUST supply all three document fields;
  -- everyone else may supply them (optional convenience) or leave them blank.
  constraint turs_24_3_document_required check (
    not public.turs_requires_document(citizenship, country_of_residence, has_estonian_residence)
    or (document_type    is not null
    and document_number  is not null
    and document_country is not null)
  )
);

comment on table public.guest_registrations is
  'Guest register under Turismiseadus § 24. One row per adult. Retained 2 years '
  '(§ 24(7)), then deleted automatically. Contains names, dates of birth and '
  'passport numbers — treat dashboard access as access to the full register.';

create index if not exists guest_registrations_arrival_idx
  on public.guest_registrations (arrival_date desc);

create index if not exists guest_registrations_created_idx
  on public.guest_registrations (created_at);


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Row-level security — THE critical part.
--
--    The publishable key ships in the page source. That is safe ONLY because
--    the key grants INSERT and nothing else. If anon could SELECT, the entire
--    guest register would be publicly downloadable — a personal data breach
--    notifiable to AKI within 72 hours.
--
--    Grants and RLS are independent layers; both are closed here deliberately.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.guest_registrations enable row level security;

revoke all    on public.guest_registrations from anon, authenticated;
grant  insert on public.guest_registrations to   anon;

drop policy if exists guest_self_registration on public.guest_registrations;

create policy guest_self_registration
  on public.guest_registrations
  for insert
  to anon
  with check (true);

-- No SELECT / UPDATE / DELETE policy exists, so all three are denied.
-- Staff read the table through the Supabase dashboard, which does not use this key.


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Retention — § 24(7): two years from the date of registration.
--
--    There is no admin UI, so nobody will ever prune this by hand. Keeping a
--    guest register indefinitely is its own GDPR violation, independent of
--    everything else, so deletion has to be automatic.
--
--    Requires pg_cron: Dashboard → Database → Extensions → enable "pg_cron".
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists pg_cron;

select cron.unschedule('prune-guest-registrations')
where exists (select 1 from cron.job where jobname = 'prune-guest-registrations');

select cron.schedule(
  'prune-guest-registrations',
  '15 3 * * *',
  $$delete from public.guest_registrations
     where created_at < now() - interval '2 years'$$
);


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Early minimisation of contact details.
--
--    Phone and email are NOT required by § 24 — they rest on the accommodation
--    contract, not the legal obligation. So they get no 2-year shield and are
--    cleared at 6 months while the statutory fields live out their full term.
--
--    Document details need no equivalent treatment: the form only ever collects
--    them from guests § 24(3) actually covers, so every stored document number
--    is statutory and keeps the full two years.
-- ─────────────────────────────────────────────────────────────────────────────

select cron.unschedule('clear-guest-contact-details')
where exists (select 1 from cron.job where jobname = 'clear-guest-contact-details');

select cron.schedule(
  'clear-guest-contact-details',
  '30 3 * * *',
  $$update public.guest_registrations
       set phone = null, email = null
     where created_at < now() - interval '6 months'
       and (phone is not null or email is not null)$$
);


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Verify.  Run scripts/verify-rls.mjs after this migration:
--       node scripts/verify-rls.mjs
--    It asserts anon can INSERT but cannot SELECT, UPDATE or DELETE.
-- ─────────────────────────────────────────────────────────────────────────────
