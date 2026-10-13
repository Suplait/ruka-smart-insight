-- The token is provisioned in Vault and Edge secrets, never in migration text
-- or cron.job.command. No service-role key is passed through the scheduler.
create function public.trace_dispatch_external_watchdog() returns bigint
language plpgsql security definer set search_path = '' as $$
declare watchdog_token text;
begin
  select decrypted_secret into strict watchdog_token from vault.decrypted_secrets
    where name='lead_watchdog_token';
  return net.http_post(
    url := 'https://rmxzryueysmzksmvpwpv.supabase.co/functions/v1/lead-external-watchdog',
    headers := jsonb_build_object('Content-Type','application/json','X-Lead-Watchdog-Token',watchdog_token),
    body := '{}'::jsonb, timeout_milliseconds := 10000
  );
end;
$$;
revoke all on function public.trace_dispatch_external_watchdog() from public,anon,authenticated;
grant execute on function public.trace_dispatch_external_watchdog() to service_role;
select cron.schedule('lead-external-watchdog','*/5 * * * *',
  $$select public.trace_dispatch_external_watchdog();$$);
