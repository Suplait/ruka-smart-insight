begin;
do $$
declare
  s1 uuid := '62111111-1111-4111-8111-111111111111';
  s2 uuid := '62222222-2222-4222-8222-222222222222';
  s3 uuid := '62333333-3333-4333-8333-333333333333';
  event text := 'https://api.calendly.com/scheduled_events/group-event';
  uri text := event || '/invitees/person-1';
  meeting jsonb;
begin
  perform public.trace_prepare_submission(s1,repeat('a',64),'classic',null,'{"email":"same@example.invalid"}');
  perform public.trace_prepare_submission(s2,repeat('b',64),'classic',null,'{"email":"same@example.invalid"}');
  perform public.trace_prepare_submission(s3,repeat('c',64),'classic',null,'{"email":"other@example.invalid"}');
  meeting:=jsonb_build_object('event_uri',event,'invitee_uri',uri,'status','active','booked_at',now(),
    'source_updated_at',now(),'invitee_email_hash',encode(sha256(convert_to('same@example.invalid','UTF8')),'hex'));
  -- The observer alone cannot create or confirm a booking.
  perform public.trace_observe_calendar(s2,repeat('b',64),event,uri);
  perform public.trace_observe_calendar(s2,repeat('b',64),event,uri);
  assert (select count(*)=0 from public.lead_meetings);
  assert (select count(*)=1 from public.lead_journey_events where name='calendly_scheduled_observed');
  perform public.trace_record_calendly(meeting);
  assert (select submission_id=s2 and association_method='browser_reference' from public.lead_meetings where invitee_uri=uri);
  perform public.trace_record_calendly(meeting);
  assert (select count(*)=1 from public.lead_journey_events where name='meeting_confirmed' and submission_id=s2);

  -- A receipt may arrive before postMessage; the existing worker resolves it later.
  uri:=event||'/invitees/person-2';
  perform public.trace_record_calendly(meeting||jsonb_build_object('invitee_uri',uri));
  assert (select association_method='ambiguous' from public.lead_meetings where invitee_uri=uri);
  perform public.trace_observe_calendar(s2,repeat('b',64),event,uri);
  perform public.trace_reconcile_unmatched_meetings();
  assert (select submission_id=s2 and association_method='browser_reference' from public.lead_meetings where invitee_uri=uri);
  assert (select count(*)=2 from public.lead_journey_events where name='calendly_scheduled_observed' and submission_id=s2), 'Two invitees of one group event are distinct';

  -- A reference claimed by another contact cannot break an email ambiguity.
  uri:=event||'/invitees/person-3';
  perform public.trace_observe_calendar(s3,repeat('c',64),event,uri);
  perform public.trace_record_calendly(meeting||jsonb_build_object('invitee_uri',uri));
  assert (select submission_id is null and association_method='ambiguous' from public.lead_meetings where invitee_uri=uri);
  -- Conflicting browser claims with matching emails also remain ambiguous.
  uri:=event||'/invitees/person-4';
  perform public.trace_observe_calendar(s1,repeat('a',64),event,uri);
  perform public.trace_observe_calendar(s2,repeat('b',64),event,uri);
  perform public.trace_record_calendly(meeting||jsonb_build_object('invitee_uri',uri));
  assert (select submission_id is null and association_method='ambiguous' from public.lead_meetings where invitee_uri=uri);
  begin
    perform public.trace_observe_calendar(s1,repeat('c',64),event,uri);
    raise exception 'Invalid token accepted';
  exception when invalid_authorization_specification then null;
  end;
  -- Older event-only keys remain idempotent after the rollout.
  uri:=event||'/invitees/person-legacy';
  insert into public.lead_journey_events(event_key,submission_id,name,source,occurred_at,properties)
  values('browser-booking:'||s1||':'||event,s1,'calendly_scheduled_observed','browser',now(),jsonb_build_object('event_uri',event,'invitee_uri',uri));
  perform public.trace_observe_calendar(s1,repeat('a',64),event,uri);
  assert (select count(*)=1 from public.lead_journey_events where properties->>'invitee_uri'=uri);
  assert (select count(*)=0 from public.fixture_n8n_calls), 'No commercial INSERT trigger';
  assert not has_function_privilege('anon','public.trace_observe_calendar(uuid,text,text,text)','execute');
end $$;
rollback;
