alter table public.lead_meetings drop constraint lead_meetings_association_method_check;
alter table public.lead_meetings add constraint lead_meetings_association_method_check
  check (association_method in ('booking_token','browser_reference','unique_email','unmatched','ambiguous'));

create or replace function public.trace_associate_meeting(p_invitee_uri text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_meeting public.lead_meetings; v_candidates uuid[]; v_submission uuid; v_method text := 'unique_email';
begin
  select * into strict v_meeting from public.lead_meetings where invitee_uri = p_invitee_uri for update;
  if v_meeting.submission_id is not null then return v_meeting.submission_id; end if;
  -- A capability-authenticated browser reference narrows matching candidates,
  -- but only after a signed/API-authenticated receipt and matching contact hash.
  select array_agg(s.id) into v_candidates from public.lead_submissions s
  where s.email_hash = v_meeting.invitee_email_hash
    and s.created_at between v_meeting.booked_at - interval '90 days' and v_meeting.booked_at + interval '5 minutes'
    and exists (select 1 from public.lead_journey_events e
      where e.submission_id=s.id and e.source='browser' and e.name='calendly_scheduled_observed'
        and e.properties->>'event_uri'=v_meeting.event_uri
        and e.properties->>'invitee_uri'=v_meeting.invitee_uri);
  if coalesce(cardinality(v_candidates),0)>0 then
    v_method := 'browser_reference';
  else
    select array_agg(id) into v_candidates from public.lead_submissions
    where email_hash = v_meeting.invitee_email_hash
      and created_at between v_meeting.booked_at - interval '90 days' and v_meeting.booked_at + interval '5 minutes';
  end if;
  if cardinality(v_candidates) = 1 then
    v_submission := v_candidates[1];
    update public.lead_meetings set submission_id = v_submission, association_method = v_method where invitee_uri = p_invitee_uri;
    insert into public.lead_journey_events(event_key, submission_id, name, source, occurred_at, properties)
    values('calendar-associated:' || p_invitee_uri, v_submission, 'meeting_associated', 'reconciliation', now(),
      jsonb_build_object('invitee_uri', p_invitee_uri, 'method', v_method)) on conflict(event_key) do nothing;
    insert into public.lead_journey_events(event_key, submission_id, name, source, occurred_at, properties)
    select event_key, v_submission,
      case when evidence->>'status' = 'active' then 'meeting_confirmed' else 'meeting_canceled' end,
      source, occurred_at, evidence - 'invitee_email_hash'
    from public.lead_calendly_receipts where invitee_uri = p_invitee_uri
    on conflict(event_key) do nothing;
    perform public.trace_queue_enrichment(v_submission);
  else
    update public.lead_meetings set association_method = case when cardinality(v_candidates) > 1 then 'ambiguous' else 'unmatched' end
    where invitee_uri = p_invitee_uri;
  end if;
  return v_submission;
end;
$$;

create or replace function public.trace_observe_calendar(p_id uuid, p_token_hash text, p_event_uri text, p_invitee_uri text default null)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform public.trace_authorize_submission(p_id, p_token_hash);
  if p_event_uri is null or p_event_uri !~ '^https://api.calendly.com/scheduled_events/[a-zA-Z0-9-]+$'
    then raise exception 'Invalid calendar reference'; end if;
  if p_invitee_uri is not null and (p_invitee_uri !~ '^https://api.calendly.com/scheduled_events/[a-zA-Z0-9-]+/invitees/[a-zA-Z0-9-]+$'
    or split_part(p_invitee_uri, '/invitees/', 1) <> p_event_uri) then raise exception 'Invalid invitee reference'; end if;
  -- Preserve idempotence across the old event-only and new invitee-aware keys.
  if exists (select 1 from public.lead_journey_events where submission_id=p_id
    and name='calendly_scheduled_observed' and source='browser'
    and properties->>'event_uri'=p_event_uri and properties->>'invitee_uri' is not distinct from p_invitee_uri) then return; end if;
  insert into public.lead_journey_events(event_key, submission_id, name, source, occurred_at, properties)
  values('browser-booking:' || p_id || ':' || coalesce(p_invitee_uri,p_event_uri), p_id, 'calendly_scheduled_observed', 'browser', now(),
    jsonb_build_object('event_uri', p_event_uri, 'invitee_uri', p_invitee_uri)) on conflict(event_key) do nothing;
  -- An iframe signal is only an observation; it never creates a confirmed meeting.
end;
$$;
