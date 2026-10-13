-- A retry updates updated_at, so it must not reset the age of an incident.
alter table public.lead_delivery_outbox add column pending_since timestamptz not null default now();
update public.lead_delivery_outbox d set pending_since = coalesce(d.delivered_at, s.created_at)
from public.lead_submissions s where s.id = d.submission_id and d.revision > d.delivered_revision;

create or replace function public.trace_queue_enrichment(p_submission uuid) returns void
language sql security definer set search_path = '' as $$
  insert into public.lead_delivery_outbox(submission_id, destination)
  values (p_submission, 'slack_enrichment'), (p_submission, 'clickup_enrichment')
  on conflict(submission_id, destination) do update
    set revision = public.lead_delivery_outbox.revision + 1,
        pending_since = case when public.lead_delivery_outbox.revision <= public.lead_delivery_outbox.delivered_revision
          then now() else public.lead_delivery_outbox.pending_since end,
        state = case when public.lead_delivery_outbox.lease_until > now() then 'sending' else 'pending' end,
        attempts = 0, next_attempt_at = now(), updated_at = now();
$$;

-- Fixed aggregate projection: no contact, URLs, tokens, snapshots or raw errors.
create function public.trace_monitor_snapshot() returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('version',1,'observed_at',now(),'counts',jsonb_build_object(
    'enrichment_stale', case when exists (
      select 1 from public.lead_traceability_health where job='enrichment' and last_completed_at >= now()-interval '10 minutes'
    ) then 0 else 1 end,
    'persistence_failed', (select count(*) from public.lead_submissions where status='failed'),
    'persistence_unconfirmed', (select count(*) from public.lead_submissions
      where status='pending' and created_at < now()-interval '10 minutes' and slack_initial_state in ('sent','sending','uncertain')),
    'slack_overdue', (select count(*) from public.lead_delivery_outbox
      where destination='slack_enrichment' and revision>delivered_revision and pending_since < now()-interval '5 minutes'),
    'clickup_overdue', (select count(*) from public.lead_delivery_outbox d join public.lead_submissions s on s.id=d.submission_id
      where d.destination='clickup_enrichment' and d.revision>d.delivered_revision and d.pending_since < now()-interval '5 minutes'
        and s.funnel='classic' and s.status='persisted'),
    'deliveries_exhausted', (select count(*) from public.lead_delivery_outbox d join public.lead_submissions s on s.id=d.submission_id
      where d.revision>d.delivered_revision and d.attempts>=8
        and (d.destination='slack_enrichment' or (s.funnel='classic' and s.status='persisted'))),
    'calendar_reader_stale', case when exists (
      select 1 from public.lead_calendar_reconciliation
      where user_uri='https://api.calendly.com/users/e1fc0690-f20a-4400-9940-284d3c8a2e24'
        and attempts<8 and next_attempt_at >= now()-interval '30 minutes'
    ) then 0 else 1 end,
    'recent_meetings_unmatched', (select count(*) from public.lead_meetings
      where submission_id is null and booked_at >= now()-interval '7 days')
  ));
$$;
revoke all on function public.trace_monitor_snapshot() from public, anon, authenticated;
grant execute on function public.trace_monitor_snapshot() to service_role;
