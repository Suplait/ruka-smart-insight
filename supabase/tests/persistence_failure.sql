-- Disposable fixture only, no external calls.
begin;
do $$
declare s uuid:=gen_random_uuid(); token text:=repeat('a',64); before_revision bigint; lead bigint;
begin
  perform public.trace_prepare_submission(s,token,'classic','{}','{}');
  assert public.trace_claim_initial_slack(s);
  assert not public.trace_claim_initial_slack(s), 'Unconfirmed send cannot be sent again';
  assert (select count(*)=1 from public.lead_delivery_outbox where submission_id=s and destination='slack_enrichment'), 'Abandoned prepare leaves visibility work';
  assert not exists(select from public.lead_delivery_outbox where submission_id=s and destination='clickup_enrichment'), 'Prepare does not initiate commercial linkage';
  assert public.trace_mark_persistence_failed(s,token);
  select revision into before_revision from public.lead_delivery_outbox where submission_id=s and destination='slack_enrichment';
  assert not public.trace_mark_persistence_failed(s,token), 'Repeated failure is idempotent';
  assert (select revision=before_revision from public.lead_delivery_outbox where submission_id=s and destination='slack_enrichment');
  assert (select count(*)=1 from public.lead_journey_events where submission_id=s and name='lead_persistence_failed');
  lead:=public.trace_submit_lead(s,token,'{"name":"Local QA","company_name":"Example","email":"qa@example.invalid","ccity":"Santiago"}');
  assert not public.trace_mark_persistence_failed(s,token), 'Delayed failure cannot downgrade confirmed persistence';
  assert (select status='persisted' from public.lead_submissions where id=s);
  assert (select count(*)=1 from public.fixture_n8n_calls where lead_id=lead), 'No commercial INSERT replay';
end; $$;
create function fixture_reject_failure_queue() returns trigger language plpgsql as $$ begin raise exception 'fixture queue failure' using errcode='23514'; end $$;
create trigger fixture_queue_failure before insert on public.lead_delivery_outbox for each row execute function fixture_reject_failure_queue();
do $$ declare s uuid:=gen_random_uuid(); begin
  perform public.trace_prepare_submission(s,repeat('a',64),'classic','{}','{}');
  begin
    perform public.trace_mark_persistence_failed(s,repeat('a',64));
    raise exception 'Queue failure should reject transaction';
  exception when check_violation then null; end;
  assert (select status='pending' from public.lead_submissions where id=s), 'Status rolled back';
  assert not exists(select from public.lead_journey_events where submission_id=s and name='lead_persistence_failed'), 'Evidence rolled back';
end; $$;
set local role anon;
do $$ begin
  begin perform public.trace_mark_persistence_failed(gen_random_uuid(),repeat('a',64)); raise exception 'Anonymous failure write allowed';
  exception when insufficient_privilege then null; end;
end; $$;
rollback;
