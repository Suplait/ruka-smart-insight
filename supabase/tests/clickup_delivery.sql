begin;
do $$
declare s uuid := gen_random_uuid(); s2 uuid := gen_random_uuid(); job jsonb; repeated jsonb; before_revision bigint; lead bigint;
begin
  perform public.trace_prepare_submission(s, repeat('a',64), 'classic', '{"version":1}', '{}');
  lead := public.trace_submit_lead(s, repeat('a',64), '{"name":"Local QA","company_name":"Example","email":"qa@example.invalid","ccity":"Santiago","whatsapp":"+56900000000"}');
  assert public.trace_link_clickup(s, 'testtask', '901301203866');
  select revision into before_revision from public.lead_delivery_outbox where submission_id = s and destination = 'clickup_enrichment';
  assert not public.trace_link_clickup(s, 'testtask', '901301203866'), 'Same callback is a no-op';
  assert (select revision = before_revision from public.lead_delivery_outbox where submission_id = s and destination = 'clickup_enrichment');
  begin
    perform public.trace_link_clickup(s, 'different', '901301203866');
    raise exception 'Conflicting association accepted';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.trace_link_clickup(s, 'testtask', 'other-list');
    raise exception 'Foreign list accepted';
  exception when invalid_parameter_value then null; end;
  perform public.trace_prepare_submission(s2, repeat('b',64), 'one', '{}', '{}');
  perform public.trace_submit_lead(s2, repeat('b',64), '{"name":"Local One","company":"Example","email":"one@example.invalid","whatsapp":"+56900000000"}');
  perform public.trace_link_clickup(s2, 'testtask', '901301203866');
  assert (select count(*) = 1 from public.fixture_n8n_calls where lead_id = lead), 'Link never replays the lead hook';
  assert (select count(*) = 2 from public.lead_journey_events where name = 'clickup_task_linked');
  assert (select bool_and(destination = 'slack_enrichment') from public.trace_claim_slack_deliveries(50)), 'Consumers do not steal jobs';
  job := public.trace_claim_clickup_delivery();
  assert job->>'task_id' = 'testtask' and (job->>'submission_count')::int = 2;
  assert jsonb_array_length(job->'submissions') = 2, 'Projection includes all associated submissions';
  assert job::text not like '%token_hash%' and job::text not like '%qa@example.invalid%', 'Job omits auth and contact snapshots';
  assert public.trace_claim_clickup_delivery() is null, 'Same task cannot have overlapping leases';
  assert public.trace_finish_delivery((job#>>'{delivery,id}')::bigint, (job#>>'{delivery,lease_id}')::uuid,
    (job#>>'{delivery,revision}')::bigint, 'retry', 120);
  repeated := public.trace_claim_clickup_delivery();
  assert repeated->'submissions' = job->'submissions', 'Retry from another submission projects the same task history';
  assert not public.trace_finish_delivery((job#>>'{delivery,id}')::bigint, (job#>>'{delivery,lease_id}')::uuid,
    (job#>>'{delivery,revision}')::bigint), 'Released lease cannot acknowledge again';
end;
$$;
set local role anon;
do $$ begin
  begin perform public.trace_claim_clickup_delivery(); raise exception 'Anonymous claim allowed';
  exception when insufficient_privilege then null; end;
  begin perform public.trace_link_clickup(gen_random_uuid(),'test','901301203866'); raise exception 'Anonymous linkage allowed';
  exception when insufficient_privilege then null; end;
end; $$;
rollback;
