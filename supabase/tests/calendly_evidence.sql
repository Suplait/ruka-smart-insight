-- Signed/API-authenticated evidence fixtures; no outgoing hooks or notifications.
begin;
do $$
declare
  s uuid := 'f220f4b5-81be-4bde-8e73-21dd42a61002';
  s2 uuid := 'f220f4b5-81be-4bde-8e73-21dd42a61003';
  hash text := encode(sha256(convert_to('calendar@example.invalid','UTF8')),'hex');
  event text := 'https://api.calendly.com/scheduled_events/event-1';
  uri text := event || '/invitees/person-1';
  meeting jsonb;
begin
  meeting := jsonb_build_object('event_uri',event,'invitee_uri',uri,'status','active','booked_at',now(),
    'starts_at',now()+interval '1 day','source_updated_at',now(),'invitee_email_hash',hash);
  perform public.trace_record_calendly(meeting);
  assert (select association_method = 'unmatched' from public.lead_meetings where invitee_uri = uri), 'External booking remains unmatched without evidence';
  perform public.trace_prepare_submission(s,repeat('a',64),'classic',null,'{"email":" Calendar@Example.Invalid "}');
  perform public.trace_reconcile_unmatched_meetings();
  assert (select submission_id = s and association_method = 'unique_email' from public.lead_meetings where invitee_uri = uri), 'Delayed lead is associated by normalized unique email';
  perform public.trace_record_calendly(meeting);
  assert (select count(*) = 1 from public.lead_meetings where invitee_uri = uri), 'Repeated webhook cannot duplicate meeting';

  perform public.trace_record_calendly(meeting || jsonb_build_object('status','canceled','source_updated_at',now()+interval '1 minute','new_invitee_uri',event||'/invitees/person-2'));
  perform public.trace_record_calendly(meeting);
  assert (select status = 'canceled' from public.lead_meetings where invitee_uri = uri), 'Out-of-order creation cannot undo cancellation';
  perform public.trace_record_calendly(meeting || jsonb_build_object('invitee_uri',event||'/invitees/person-2','old_invitee_uri',uri));
  assert (select count(*) = 2 from public.lead_meetings), 'A reschedule retains both invitees';
  assert (select count(*) = 1 from public.lead_journey_events where submission_id=s and name='meeting_canceled'), 'Cancellation milestone is unique';

  perform public.trace_prepare_submission(s2,repeat('b',64),'classic',null,'{"email":"calendar@example.invalid"}');
  perform public.trace_record_calendly(meeting || jsonb_build_object('invitee_uri',event||'/invitees/person-3'));
  assert (select submission_id is null and association_method='ambiguous' from public.lead_meetings where invitee_uri=event||'/invitees/person-3'), 'Multiple matching leads are never guessed';
  assert (select count(*) = 0 from public.fixture_n8n_calls), 'Meeting evidence never calls the existing commercial hook';
end;
$$;
set local role anon;
do $$
begin
  begin
    perform public.trace_record_calendly('{}');
    raise exception 'Anonymous Calendly evidence accepted';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;
rollback;
