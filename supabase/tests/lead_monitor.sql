begin;
insert into public.lead_traceability_health(job,last_started_at,last_completed_at)
values('enrichment',now(),now()) on conflict(job) do update set last_completed_at=now();
insert into public.lead_calendar_reconciliation(user_uri,state,next_attempt_at)
values('https://api.calendly.com/users/e1fc0690-f20a-4400-9940-284d3c8a2e24','{}',now()+interval '24 hours');
insert into public.lead_submissions(id,funnel,status,contact_snapshot)
values('11111111-1111-4111-8111-111111111111','classic','persisted','{"email":"SECRET"}'),
('22222222-2222-4222-8222-222222222222','one','persisted','{}');
select public.trace_queue_enrichment('11111111-1111-4111-8111-111111111111');
select public.trace_queue_enrichment('22222222-2222-4222-8222-222222222222');
update public.lead_delivery_outbox set pending_since=now()-interval '20 minutes',updated_at=now();
update public.lead_delivery_outbox set delivered_revision=revision where destination='slack_enrichment';
do $$ declare result jsonb; begin
  result := public.trace_monitor_snapshot();
  assert result->'counts'->>'clickup_overdue' = '1', 'One without a CRM flow must not be a ClickUp incident';
  assert result->'counts'->>'slack_overdue' = '0', 'Confirmed Slack is not overdue';
  assert result->'counts'->>'enrichment_stale' = '0';
  assert result->'counts'->>'calendar_reader_stale' = '0', 'Sleeping daily reconciliation is healthy';
  assert result::text not like '%SECRET%', 'No contact in monitoring';
  assert not has_function_privilege('anon','public.trace_monitor_snapshot()','execute');
  assert not has_function_privilege('authenticated','public.trace_monitor_snapshot()','execute');
  assert has_function_privilege('service_role','public.trace_monitor_snapshot()','execute');
end $$;
select public.trace_queue_enrichment('11111111-1111-4111-8111-111111111111');
do $$ begin
  assert (select pending_since < now()-interval '5 minutes' from public.lead_delivery_outbox
    where submission_id='11111111-1111-4111-8111-111111111111' and destination='clickup_enrichment'), 'Queueing again cannot reset pending age';
  assert (select pending_since = now() from public.lead_delivery_outbox
    where submission_id='11111111-1111-4111-8111-111111111111' and destination='slack_enrichment'), 'A new revision after success gets its own age';
end $$;
update public.lead_traceability_health set last_completed_at=now()-interval '11 minutes' where job='enrichment';
update public.lead_calendar_reconciliation set next_attempt_at=now()-interval '31 minutes';
do $$ declare result jsonb; begin
  result := public.trace_monitor_snapshot();
  assert result->'counts'->>'enrichment_stale' = '1';
  assert result->'counts'->>'calendar_reader_stale' = '1';
end $$;
rollback;
