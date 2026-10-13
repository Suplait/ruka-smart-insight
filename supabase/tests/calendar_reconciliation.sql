begin;
do $$
declare u text := 'https://api.calendly.com/users/local-user'; job public.lead_calendar_reconciliation; next_state jsonb;
  meeting jsonb := '{"invitee_uri":"https://api.calendly.com/scheduled_events/local-event/invitees/local-person","event_uri":"https://api.calendly.com/scheduled_events/local-event","status":"active","booked_at":"2026-10-12T15:00:00Z","starts_at":"2026-10-14T15:00:00Z","source_updated_at":"2026-10-12T15:00:00Z","invitee_email_hash":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}';
begin
  job := public.trace_claim_calendar_reconciliation(u);
  assert job.lease_id is not null;
  assert (public.trace_claim_calendar_reconciliation(u)).lease_id is null, 'A concurrent worker cannot reserve the same cursor';
  next_state := jsonb_set(job.state,'{event_page_token}','"next-page"');
  begin
    perform public.trace_commit_calendar_reconciliation(u,job.lease_id,job.revision,next_state,
      jsonb_build_array(meeting, meeting - 'invitee_email_hash'));
    raise exception 'Invalid batch accepted';
  exception when raise_exception then
    assert sqlerrm = 'Missing contact hash';
  end;
  assert (select revision = job.revision and state = job.state from public.lead_calendar_reconciliation where user_uri = u), 'Failed persistence cannot advance pagination';
  assert (select count(*) = 0 from public.lead_calendly_receipts), 'Partial batch rolls back its evidence';
  assert public.trace_commit_calendar_reconciliation(u,job.lease_id,job.revision,next_state,jsonb_build_array(meeting));
  assert (select count(*) = 1 from public.lead_calendly_receipts);
  assert not public.trace_commit_calendar_reconciliation(u,job.lease_id,job.revision,next_state,jsonb_build_array(meeting)), 'Stale revision cannot commit twice';
  assert public.trace_release_calendar_reconciliation(u,job.lease_id,'simulated_rate_limit',120);
  assert (select next_attempt_at >= now() + interval '120 seconds' from public.lead_calendar_reconciliation where user_uri = u);
  assert (public.trace_claim_calendar_reconciliation(u)).lease_id is null, 'Rate limiting is durable';
  update public.lead_calendar_reconciliation set next_attempt_at = now() where user_uri = u;
  job := public.trace_claim_calendar_reconciliation(u);
  assert job.state->>'event_page_token' = 'next-page', 'A later worker resumes the committed cursor';
  update public.lead_calendar_reconciliation set lease_until = now() - interval '1 second' where user_uri = u;
  assert not public.trace_commit_calendar_reconciliation(u,job.lease_id,job.revision,next_state,'[]'), 'Expired lease cannot move the cursor';
  job := public.trace_claim_calendar_reconciliation(u);
  next_state := jsonb_set(job.state,'{complete}','true');
  assert public.trace_commit_calendar_reconciliation(u,job.lease_id,job.revision,next_state,'[]');
  assert (select cycle_completed_at is not null and lease_id is null and next_attempt_at >= now()+interval '24 hours'
    from public.lead_calendar_reconciliation where user_uri=u), 'Only a completed cycle schedules the next daily pass';
end; $$;
set local role anon;
do $$ begin
  begin perform * from public.lead_calendar_reconciliation; raise exception 'Anonymous checkpoint read allowed'; exception when insufficient_privilege then null; end;
  begin perform public.trace_claim_calendar_reconciliation('https://api.calendly.com/users/local-user'); raise exception 'Anonymous checkpoint claim allowed'; exception when insufficient_privilege then null; end;
end; $$;
rollback;
