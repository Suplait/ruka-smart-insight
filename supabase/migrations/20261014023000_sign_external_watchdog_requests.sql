-- Managed pg_net queue ACLs cannot be changed by this project's migration role.
-- Never enqueue a reusable secret: bind a short-lived HMAC to the exact body.
create or replace function public.trace_dispatch_external_watchdog() returns bigint
language plpgsql security definer set search_path = '' as $$
declare watchdog_token text; stamp text; body text := '{}'; signature text;
begin
  select decrypted_secret into strict watchdog_token from vault.decrypted_secrets
    where name='lead_watchdog_token';
  stamp := floor(extract(epoch from clock_timestamp()))::bigint::text;
  signature := encode(extensions.hmac(convert_to(stamp || '.' || body,'UTF8'),
    convert_to(watchdog_token,'UTF8'),'sha256'),'hex');
  return net.http_post(
    url := 'https://rmxzryueysmzksmvpwpv.supabase.co/functions/v1/lead-external-watchdog',
    headers := jsonb_build_object('Content-Type','application/json','X-Lead-Watchdog-Signature','t=' || stamp || ',v1=' || signature),
    body := body::jsonb, timeout_milliseconds := 10000
  );
end;
$$;
