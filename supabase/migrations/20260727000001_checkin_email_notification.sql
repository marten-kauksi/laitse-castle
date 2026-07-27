-- ============================================================================
-- Check-in email notification → Resend
--
-- Run AFTER 20260727000000_guest_registrations.sql.
--
-- No Edge Function and no deploy step: a statement-level trigger calls the
-- Resend API directly over pg_net. One email per submission, not per guest.
--
-- ── Setup (three steps, ~5 minutes) ─────────────────────────────────────────
--
--  1. Resend account → add and verify the domain laitsecastle.ee
--     (Resend gives you DKIM + SPF DNS records to add). Without a verified
--     domain you can only send to your own address.
--
--  2. Create an API key in Resend, then store it in Supabase Vault —
--     NEVER paste it into this file or any table:
--
--        select vault.create_secret('re_xxxxxxxxxxxx', 'resend_api_key');
--
--  3. Set the recipient. NOTE: this repository is PUBLIC — do not write the
--     address into this file. It is read from Vault at runtime, so it only ever
--     needs to exist inside your Supabase project:
--
--        select vault.create_secret('<recipient@example.com>', 'checkin_notify_to');
--
--     To rotate either value later:
--        select vault.update_secret(
--          (select id from vault.secrets where name = 'resend_api_key'),
--          're_newkey...');
--        select vault.update_secret(
--          (select id from vault.secrets where name = 'checkin_notify_to'),
--          'someone-else@example.com');
--
-- ── Privacy note — read this ────────────────────────────────────────────────
--
-- The email deliberately carries NO guest personal data: no names, no dates of
-- birth, no document numbers. Only a count and the stay dates. Emailing the
-- register contents would copy § 24 data into an inbox outside the database,
-- where it is not covered by the 2-year deletion job, is likely to sit in a
-- mail provider indefinitely, and widens the blast radius of a compromised
-- mailbox. Staff open Supabase to see who actually arrived.
-- ============================================================================

create extension if not exists pg_net;


create or replace function public.notify_checkin()
returns trigger
language plpgsql
security definer
set search_path = public, vault, extensions
as $$
declare
  v_api_key   text;
  v_recipient text;
  v_count     int;
  v_arrival   date;
  v_departure date;
  v_locale    text;
begin
  -- Read secrets from Vault. If either is unset, do nothing rather than fail —
  -- a missing notification must never block a guest's registration.
  select decrypted_secret into v_api_key
    from vault.decrypted_secrets where name = 'resend_api_key';
  select decrypted_secret into v_recipient
    from vault.decrypted_secrets where name = 'checkin_notify_to';

  if v_api_key is null or v_recipient is null then
    raise warning 'notify_checkin: Vault secrets not configured, skipping email';
    return null;
  end if;

  select count(*), min(arrival_date), max(departure_date), min(locale)
    into v_count, v_arrival, v_departure, v_locale
    from new_rows;

  perform net.http_post(
    url     := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || v_api_key,
      'Content-Type',  'application/json'
    ),
    body := jsonb_build_object(
      'from',    'Laitse loss <sisseregistreerimine@laitsecastle.ee>',
      'to',      jsonb_build_array(v_recipient),
      'subject', format('Uus sisseregistreerimine — %s külalist, saabumine %s',
                        v_count, to_char(v_arrival, 'DD.MM.YYYY')),
      'text', format(
        E'Uus sisseregistreerimine.\n\n'
        'Külalisi: %s\n'
        'Saabumine: %s\n'
        'Lahkumine: %s\n'
        'Vormi keel: %s\n\n'
        'Külaliste andmed on Supabase tabelis guest_registrations.\n'
        'Isikuandmeid e-kirjaga ei edastata.',
        v_count,
        to_char(v_arrival, 'DD.MM.YYYY'),
        to_char(v_departure, 'DD.MM.YYYY'),
        v_locale
      )
    ),
    timeout_milliseconds := 5000
  );

  return null;
exception
  -- A failed notification must never roll back the registration itself.
  when others then
    raise warning 'notify_checkin failed: %', sqlerrm;
    return null;
end;
$$;

revoke all on function public.notify_checkin() from anon, authenticated;


drop trigger if exists guest_registrations_notify on public.guest_registrations;

-- Statement-level with a transition table: a party of three submitted together
-- is ONE insert statement, so it produces ONE email rather than three.
create trigger guest_registrations_notify
  after insert on public.guest_registrations
  referencing new table as new_rows
  for each statement
  execute function public.notify_checkin();


-- ── Verify ──────────────────────────────────────────────────────────────────
--   Insert a test row via scripts/verify-rls.mjs, then check delivery:
--     select * from net._http_response order by created desc limit 5;
--   A 200 means Resend accepted it. 401 = bad API key, 403 = domain not verified.
