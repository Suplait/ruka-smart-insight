alter table public.lead_meetings add column invitee_email_hash text
  check (invitee_email_hash ~ '^[a-f0-9]{64}$');
create index lead_meetings_unmatched_email on public.lead_meetings(invitee_email_hash)
  where submission_id is null;
alter table public.lead_submissions add column email_hash text;
create function public.trace_set_email_hash() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  new.email_hash := encode(sha256(convert_to(lower(btrim(new.contact_snapshot->>'email')), 'UTF8')), 'hex');
  return new;
end;
$$;
create trigger trace_set_email_hash before insert or update of contact_snapshot on public.lead_submissions
for each row execute function public.trace_set_email_hash();
update public.lead_submissions set email_hash = encode(sha256(convert_to(lower(btrim(contact_snapshot->>'email')), 'UTF8')), 'hex');
create index lead_submission_email_hash on public.lead_submissions(email_hash);
revoke all on function public.trace_set_email_hash() from public, anon, authenticated;

create table public.lead_calendly_receipts (
  event_key text primary key,
  invitee_uri text not null,
  source text not null check (source in ('calendly','reconciliation')),
  occurred_at timestamptz not null,
  received_at timestamptz not null default now(),
  evidence jsonb not null check (octet_length(evidence::text) <= 4096)
);
create index lead_calendly_receipts_invitee on public.lead_calendly_receipts(invitee_uri);
alter table public.lead_calendly_receipts enable row level security;
revoke all on public.lead_calendly_receipts from public, anon, authenticated;
grant all on public.lead_calendly_receipts to service_role;

create function public.trace_associate_meeting(p_invitee_uri text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_meeting public.lead_meetings; v_candidates uuid[]; v_submission uuid;
begin
  select * into strict v_meeting from public.lead_meetings where invitee_uri = p_invitee_uri for update;
  if v_meeting.submission_id is not null then return v_meeting.submission_id; end if;
  select array_agg(id) into v_candidates from public.lead_submissions
  where email_hash = v_meeting.invitee_email_hash
    and created_at between v_meeting.booked_at - interval '90 days' and v_meeting.booked_at + interval '5 minutes';
  if cardinality(v_candidates) = 1 then
    v_submission := v_candidates[1];
    update public.lead_meetings set submission_id = v_submission, association_method = 'unique_email' where invitee_uri = p_invitee_uri;
    insert into public.lead_journey_events(event_key, submission_id, name, source, occurred_at, properties)
    values('calendar-associated:' || p_invitee_uri, v_submission, 'meeting_associated', 'reconciliation', now(),
      jsonb_build_object('invitee_uri', p_invitee_uri, 'method', 'unique_email')) on conflict(event_key) do nothing;
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

create function public.trace_record_calendly(p_meeting jsonb, p_source text default 'calendly') returns void
language plpgsql security definer set search_path = '' as $$
declare v_meeting public.lead_meetings; v_changed boolean; v_submission uuid;
begin
  if p_source not in ('calendly', 'reconciliation') then raise exception 'Invalid evidence source'; end if;
  if p_meeting->>'invitee_email_hash' is null then raise exception 'Missing contact hash'; end if;
  insert into public.lead_calendly_receipts(event_key, invitee_uri, source, occurred_at, evidence)
  values('calendar:' || (p_meeting->>'invitee_uri') || ':' || (p_meeting->>'status') || ':' || extract(epoch from (p_meeting->>'source_updated_at')::timestamptz)::text,
    p_meeting->>'invitee_uri', p_source, (p_meeting->>'source_updated_at')::timestamptz,
    jsonb_build_object('invitee_uri',p_meeting->>'invitee_uri','event_uri',p_meeting->>'event_uri','status',p_meeting->>'status',
      'booked_at',p_meeting->>'booked_at','starts_at',p_meeting->>'starts_at','old_invitee_uri',p_meeting->>'old_invitee_uri',
      'new_invitee_uri',p_meeting->>'new_invitee_uri','invitee_email_hash',p_meeting->>'invitee_email_hash'))
  on conflict(event_key) do nothing;
  insert into public.lead_meetings(invitee_uri, event_uri, status, booked_at, starts_at, source_updated_at,
    old_invitee_uri, new_invitee_uri, association_method, source, invitee_email_hash)
  values(p_meeting->>'invitee_uri', p_meeting->>'event_uri', p_meeting->>'status', (p_meeting->>'booked_at')::timestamptz,
    (p_meeting->>'starts_at')::timestamptz, (p_meeting->>'source_updated_at')::timestamptz,
    p_meeting->>'old_invitee_uri', p_meeting->>'new_invitee_uri', 'unmatched', p_source, p_meeting->>'invitee_email_hash')
  on conflict(invitee_uri) do update set
    status = excluded.status, starts_at = coalesce(excluded.starts_at, public.lead_meetings.starts_at),
    source_updated_at = excluded.source_updated_at,
    old_invitee_uri = coalesce(excluded.old_invitee_uri, public.lead_meetings.old_invitee_uri),
    new_invitee_uri = coalesce(excluded.new_invitee_uri, public.lead_meetings.new_invitee_uri),
    source = excluded.source, received_at = now()
  where excluded.source_updated_at >= public.lead_meetings.source_updated_at
    and not (public.lead_meetings.status = 'canceled' and excluded.status = 'active')
    and (excluded.status is distinct from public.lead_meetings.status
      or (excluded.starts_at is not null and excluded.starts_at is distinct from public.lead_meetings.starts_at)
      or (excluded.old_invitee_uri is not null and excluded.old_invitee_uri is distinct from public.lead_meetings.old_invitee_uri)
      or (excluded.new_invitee_uri is not null and excluded.new_invitee_uri is distinct from public.lead_meetings.new_invitee_uri));
  v_changed := found;
  v_submission := public.trace_associate_meeting(p_meeting->>'invitee_uri');
  select * into strict v_meeting from public.lead_meetings where invitee_uri = p_meeting->>'invitee_uri';
  if v_changed and v_submission is not null then
    insert into public.lead_journey_events(event_key, submission_id, name, source, occurred_at, properties)
    values('calendar:' || v_meeting.invitee_uri || ':' || v_meeting.status || ':' || extract(epoch from v_meeting.source_updated_at)::text,
      v_submission, case when v_meeting.status = 'active' then 'meeting_confirmed' else 'meeting_canceled' end,
      p_source, v_meeting.source_updated_at, jsonb_build_object('invitee_uri', v_meeting.invitee_uri,
        'event_uri', v_meeting.event_uri, 'starts_at', v_meeting.starts_at, 'old_invitee_uri', v_meeting.old_invitee_uri,
        'new_invitee_uri', v_meeting.new_invitee_uri, 'association_method', v_meeting.association_method))
    on conflict(event_key) do nothing;
    perform public.trace_queue_enrichment(v_submission);
  end if;
end;
$$;

-- Late associations run outside the capture transaction, so calendar recovery
-- cannot add work or locks to the user's form submission.
create function public.trace_reconcile_unmatched_meetings(p_limit integer default 20) returns integer
language plpgsql security definer set search_path = '' as $$
declare v_invitee text; v_count integer := 0;
begin
  for v_invitee in select invitee_uri from public.lead_meetings
    where submission_id is null order by received_at desc for update skip locked limit least(greatest(p_limit,1),100)
  loop
    if public.trace_associate_meeting(v_invitee) is not null then v_count := v_count + 1; end if;
  end loop;
  return v_count;
end;
$$;

revoke all on function public.trace_associate_meeting(text), public.trace_record_calendly(jsonb,text), public.trace_reconcile_unmatched_meetings(integer)
  from public, anon, authenticated;
grant execute on function public.trace_associate_meeting(text), public.trace_record_calendly(jsonb,text), public.trace_reconcile_unmatched_meetings(integer) to service_role;

comment on column public.lead_meetings.invitee_email_hash is 'SHA256 of trimmed lowercase email, private matching key only. Not an authentication credential or an advertising identifier.';
