-- Run only against the disposable local fixture database, never production.
begin;
do $$
declare
  s uuid := 'f220f4b5-81be-4bde-8e73-21dd42a61000';
  s_one uuid := 'f220f4b5-81be-4bde-8e73-21dd42a61001';
  token text := repeat('a', 64);
  lead bigint;
  retry bigint;
  delivery public.lead_delivery_outbox;
  wrong_lease uuid := gen_random_uuid();
  body jsonb := '{"name":"Local QA","company_name":"Example","email":"qa@example.invalid","ccity":"Santiago","whatsapp":"+56900000000","page_path":"/restaurantes","utm_source":"facebook","utm_term":"restaurant","clave_sii":"must-not-be-copied"}';
begin
  perform public.trace_prepare_submission(s, token, 'classic', '{"version":1}', '{}');
  assert public.trace_claim_initial_slack(s), 'Initial message can be claimed once';
  assert not public.trace_claim_initial_slack(s), 'Concurrent or late requests cannot send a second initial message';
  lead := public.trace_submit_lead(s, token, body);
  retry := public.trace_submit_lead(s, token, body);
  assert lead = retry, 'Retry must return the same lead';
  assert (select count(*) = 1 from public.fixture_n8n_calls where lead_id = lead), 'Existing n8n trigger fires only once';
  assert (select count(*) = 1 from public.lead_journey_events where submission_id = s and name = 'lead_persisted'), 'Persistence evidence is unique';
  assert (select count(*) = 2 from public.lead_delivery_outbox where submission_id = s), 'Exactly two enrichment destinations';
  assert (select clave_sii is null from public.leads where id = lead), 'Generic payload cannot write secret fields';
  assert (select contact_snapshot::text not like '%must-not-be-copied%' from public.lead_submissions where id = s), 'Private snapshot is a whitelist';
  assert (select utm_term = 'restaurant' from public.leads where id = lead), 'Fifth UTM survives persistence';

  perform public.trace_qualify_lead(s, token, 225);
  perform public.trace_qualify_lead(s, token, 225);
  assert (select facturas_compra_mes = 225 and requires_calendly from public.leads where id = lead), 'Qualification is derived consistently';
  assert (select count(*) = 1 from public.lead_journey_events where submission_id = s and name = 'lead_qualified'), 'Qualification retry does not add another milestone';
  perform public.trace_confirm_initial_slack(s, 'C08DUJ6V2G6', '1234567.1234');
  assert (select slack_message_ts = '1234567.1234' from public.leads where id = lead), 'A late Slack reference is persisted without another insert';
  assert (select count(*) = 1 from public.fixture_n8n_calls where lead_id = lead), 'Enrichment does not rerun the commercial insert hook';
  perform public.trace_observe_calendar(s, token, 'https://api.calendly.com/scheduled_events/event-1', 'https://api.calendly.com/scheduled_events/event-1/invitees/person-1');
  perform public.trace_observe_calendar(s, token, 'https://api.calendly.com/scheduled_events/event-1', 'https://api.calendly.com/scheduled_events/event-1/invitees/person-1');
  assert (select count(*) = 1 from public.lead_journey_events where submission_id = s and source = 'browser'), 'Browser observation is deduplicated';
  assert (select count(*) = 0 from public.lead_meetings), 'Browser observation cannot confirm a meeting';
  begin
    perform public.trace_authorize_submission(s, null);
    raise exception 'Null continuation accepted';
  exception when invalid_authorization_specification then null;
  end;

  begin
    perform public.trace_prepare_submission(s, repeat('b',64), 'classic', null, '{}');
    raise exception 'Another token claimed an existing submission';
  exception when invalid_authorization_specification then null;
  end;
  begin
    perform public.trace_submit_lead(s, repeat('b',64), body);
    raise exception 'Wrong continuation token accepted';
  exception when invalid_authorization_specification then null;
  end;
  update public.lead_submissions set token_expires_at = now() - interval '1 second' where id = s;
  begin
    perform public.trace_submit_lead(s, token, body);
    raise exception 'Expired continuation token accepted';
  exception when invalid_authorization_specification then null;
  end;

  select * into delivery from public.trace_claim_deliveries(1);
  assert delivery.lease_id is not null, 'Delivery has exclusive lease';
  assert not public.trace_finish_delivery(delivery.id, wrong_lease, delivery.revision), 'Wrong lease cannot complete delivery';
  perform public.trace_queue_enrichment(delivery.submission_id);
  assert public.trace_finish_delivery(delivery.id, delivery.lease_id, delivery.revision), 'Current lease can complete its revision';
  assert (select state = 'pending' and revision > delivered_revision from public.lead_delivery_outbox where id = delivery.id), 'Evidence arriving during delivery remains pending';
  select * into delivery from public.trace_claim_deliveries(1);
  perform public.trace_finish_delivery(delivery.id, delivery.lease_id, delivery.revision, 'simulated integration failure');
  assert (select state = 'pending' and next_attempt_at > now() from public.lead_delivery_outbox where id = delivery.id), 'Failure backs off without touching leads';

  perform public.trace_prepare_submission(s_one, token, 'one', '{}', '{}');
  lead := public.trace_submit_lead(s_one, token, '{"name":"QA One","company":"Example One","email":"one@example.invalid","whatsapp":"+56900000000","utm_term":"one"}');
  retry := public.trace_submit_lead(s_one, token, '{"name":"Late retry"}');
  assert lead = retry, 'One retry returns the existing lead';
  assert (select company = 'Example One' from public.leads_one where id = lead), 'A delayed retry cannot overwrite the original lead';
  assert (select count(*) = 1 from public.lead_journey_events where submission_id = s_one), 'One has durable unique evidence';

  insert into public.leads(name,company_name,email,ccity,clave_sii)
  values('Legacy QA',repeat('x',5000),'legacy@example.invalid','Santiago','legacy-secret') returning id into lead;
  assert (select submission_id is not null from public.leads where id = lead), 'Legacy clients also leave evidence';
  assert (select length(contact_snapshot->>'company_name') = 160 from public.lead_submissions where lead_id = lead), 'Long legacy inputs cannot break capture';
end;
$$;

set local role anon;
do $$
begin
  begin
    perform * from public.lead_submissions;
    raise exception 'Anonymous read unexpectedly allowed';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.trace_submit_lead(gen_random_uuid(), repeat('a',64), '{}');
    raise exception 'Anonymous RPC unexpectedly allowed';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.trace_claim_deliveries(1);
    raise exception 'Anonymous worker access unexpectedly allowed';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;
rollback;
