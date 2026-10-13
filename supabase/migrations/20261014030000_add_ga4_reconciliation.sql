-- Aggregate evidence only; does not attach GA4 receipts or inferred consent to a lead.
create table public.lead_ga4_reconciliations (
  report_date date primary key,
  observed_at timestamptz not null default now(),
  window_start date not null,
  result jsonb not null check (jsonb_typeof(result)='object' and octet_length(result::text)<=65536)
);
alter table public.lead_ga4_reconciliations enable row level security;
revoke all on public.lead_ga4_reconciliations from public,anon,authenticated;
grant select,insert,update on public.lead_ga4_reconciliations to service_role;

create function public.trace_ga4_database_counts(p_start date,p_end date) returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
  if p_start is null or p_end is null or p_end-p_start<>28 or p_end>(now() at time zone 'America/Santiago')::date-3 then
    raise exception 'Invalid mature reporting window';
  end if;
  with dates as (select p_start+i as day from generate_series(0,28) i),
  captured as (
    select l.created_at,l.submission_id,'classic' as funnel from public.leads l
    where l.created_at>=p_start::timestamp at time zone 'America/Santiago'
      and l.created_at<(p_end+1)::timestamp at time zone 'America/Santiago'
    union all
    select l.created_at,l.submission_id,'one' from public.leads_one l
    where l.created_at>=p_start::timestamp at time zone 'America/Santiago'
      and l.created_at<(p_end+1)::timestamp at time zone 'America/Santiago'
  ), counts as (
    select (c.created_at at time zone 'America/Santiago')::date as day,
      count(*) filter(where c.funnel='classic') as classic,
      count(*) filter(where c.funnel='one') as one,
      count(*) filter(where s.attribution->>'analytics_consent'='granted') as consent_granted,
      count(*) filter(where s.attribution->>'analytics_consent'='denied') as consent_denied,
      count(*) filter(where s.attribution->>'analytics_consent' is null or s.attribution->>'analytics_consent' not in ('granted','denied')) as consent_unknown
    from captured c left join public.lead_submissions s on s.id=c.submission_id group by 1
  ), meetings as (
    select (booked_at at time zone 'America/Santiago')::date as day,count(*) as booked,
      count(*) filter(where status='canceled') as now_canceled,
      count(*) filter(where submission_id is null) as unmatched
    from public.lead_meetings
    where booked_at>=p_start::timestamp at time zone 'America/Santiago'
      and booked_at<(p_end+1)::timestamp at time zone 'America/Santiago'
    group by 1
  )
  select jsonb_agg(jsonb_build_object('date',d.day,'classic_leads',coalesce(c.classic,0),'one_leads',coalesce(c.one,0),
    'consent_granted',coalesce(c.consent_granted,0),'consent_denied',coalesce(c.consent_denied,0),'consent_unknown',coalesce(c.consent_unknown,0),
    'meetings_booked',coalesce(m.booked,0),'meetings_now_canceled',coalesce(m.now_canceled,0),'meetings_unmatched',coalesce(m.unmatched,0)) order by d.day)
    into result from dates d left join counts c on c.day=d.day left join meetings m on m.day=d.day;
  return result;
end;
$$;
revoke all on function public.trace_ga4_database_counts(date,date) from public,anon,authenticated;
grant execute on function public.trace_ga4_database_counts(date,date) to service_role;

create or replace function public.trace_monitor_snapshot() returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('version',1,'observed_at',now(),'counts',jsonb_build_object(
    'ga4_source_unavailable', (select count(*) from public.lead_traceability_health
      where job='ga4_reconciliation' and (result->>'state'='error' or last_completed_at is null or last_completed_at<now()-interval '36 hours')),
    'ga4_volume_drop', coalesce((select jsonb_array_length(result->'drop_signals') from public.lead_traceability_health
      where job='ga4_reconciliation' and result->>'state'='ok' and last_completed_at>=now()-interval '36 hours'),0),
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
