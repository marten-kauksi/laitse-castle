#!/usr/bin/env node
/**
 * Verify row-level security on public.guest_registrations.
 *
 * This is the one check that genuinely must pass. The publishable key ships in
 * the page source; that is safe ONLY while the key can INSERT and nothing else.
 * If anon can SELECT, the entire guest register — names, dates of birth,
 * passport numbers — is publicly downloadable.
 *
 * Run after applying supabase/migrations/*_guest_registrations.sql:
 *
 *     node --env-file=.env scripts/verify-rls.mjs
 *
 * Exits non-zero if any assertion fails.
 */

const URL_ = process.env.PUBLIC_SUPABASE_URL;
const KEY = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!URL_ || !KEY) {
  console.error('Missing PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
  console.error('Run with:  node --env-file=.env scripts/verify-rls.mjs');
  process.exit(2);
}

if (/^sb_secret_|service_role/.test(KEY)) {
  console.error('REFUSING TO RUN: that looks like the SECRET key, not the publishable key.');
  console.error('This script must test the key the browser actually uses.');
  process.exit(2);
}

const ENDPOINT = `${URL_}/rest/v1/guest_registrations`;
const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
};

const results = [];
const record = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? '  PASS' : '  FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

// A row that satisfies every CHECK constraint. Estonian citizenship, so § 24(3)
// document fields are not required.
const probe = {
  given_names: 'RLS',
  surname: 'Verification Probe',
  date_of_birth: '1990-01-01',
  citizenship: 'EE',
  country_of_residence: 'EE',
  arrival_date: '2020-01-01',
  departure_date: '2020-01-02',
  purpose_of_travel: 'other',
  accompanying_minors: 0,
  has_estonian_residence: false,
  phone: '+3720000000',
  email: null,
  locale: 'et',
};

console.log(`\nVerifying RLS on ${ENDPOINT}\n`);

// ── 1. SELECT must be denied ────────────────────────────────────────────────
{
  const res = await fetch(`${ENDPOINT}?select=*&limit=1`, { headers });
  let body = null;
  try { body = await res.json(); } catch {}
  const leaked = res.ok && Array.isArray(body) && body.length > 0;
  record(
    'anon cannot SELECT',
    !leaked,
    leaked
      ? `LEAKED ${body.length} row(s) — the guest register is PUBLIC`
      : `HTTP ${res.status}`
  );
}

// ── 2. INSERT must succeed ──────────────────────────────────────────────────
{
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify([probe]),
  });
  record('anon can INSERT', res.ok, `HTTP ${res.status}${res.ok ? '' : ` ${await res.text()}`}`);
}

// ── 3. UPDATE must be denied ────────────────────────────────────────────────
{
  const res = await fetch(`${ENDPOINT}?surname=eq.${encodeURIComponent(probe.surname)}`, {
    method: 'PATCH',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify({ surname: 'Tampered' }),
  });
  // 404/403/401 all mean "not permitted". A 2xx means an UPDATE policy exists.
  record('anon cannot UPDATE', !res.ok, `HTTP ${res.status}`);
}

// ── 4. DELETE must be denied ────────────────────────────────────────────────
{
  const res = await fetch(`${ENDPOINT}?surname=eq.${encodeURIComponent(probe.surname)}`, {
    method: 'DELETE',
    headers: { ...headers, Prefer: 'return=minimal' },
  });
  record('anon cannot DELETE', !res.ok, `HTTP ${res.status}`);
}

// ── 5. CHECK constraints hold ───────────────────────────────────────────────
{
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify([{ ...probe, departure_date: '2019-12-01' }]),
  });
  record('departure before arrival rejected', !res.ok, `HTTP ${res.status}`);
}

{
  // Non-EEA citizenship, no Estonian residence, no document details → must fail.
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify([{ ...probe, citizenship: 'US', country_of_residence: 'US' }]),
  });
  record('§ 24(3) document requirement enforced', !res.ok, `HTTP ${res.status}`);
}

{
  // Same, but with document details supplied → must succeed.
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify([{
      ...probe,
      citizenship: 'US',
      country_of_residence: 'US',
      document_type: 'passport',
      document_number: 'X1234567',
      document_country: 'US',
    }]),
  });
  record('§ 24(3) satisfied by document details', res.ok, `HTTP ${res.status}`);
}

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed.`);

if (failed.length) {
  console.error(`\nFAILED: ${failed.map((f) => f.name).join(', ')}`);
  process.exit(1);
}

console.log(
  '\nAll checks passed.\n' +
  'NOTE: this inserted test rows. Remove them in the Supabase dashboard:\n' +
  "  delete from public.guest_registrations where surname = 'Verification Probe';\n"
);
