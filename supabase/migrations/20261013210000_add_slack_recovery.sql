create table public.lead_slack_recovery (
  submission_id uuid primary key references public.lead_submissions(id),
  cursor text check (length(cursor) <= 2048),
  candidate jsonb check (jsonb_typeof(candidate) = 'object' and octet_length(candidate::text) <= 100000),
  match_count integer not null default 0 check (match_count between 0 and 2),
  pages integer not null default 0,
  outcome text not null default 'scanning' check (outcome in ('scanning','resolved','not_found','ambiguous','conflict')),
  updated_at timestamptz not null default now()
);
alter table public.lead_slack_recovery enable row level security;
revoke all on public.lead_slack_recovery from public,anon,authenticated;
grant all on public.lead_slack_recovery to service_role;

-- A browser can disappear after prepare, before persistence or its failure
-- callback. The initial claim must therefore leave durable recovery work too.
create or replace function public.trace_claim_initial_slack(p_id uuid) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  update public.lead_submissions set slack_initial_state = 'sending', slack_initial_claimed_at = now()
  where id = p_id and slack_initial_state in ('pending','failed') and slack_message_ts is null;
  if not found then return false; end if;
  delete from public.lead_slack_recovery where submission_id=p_id;
  insert into public.lead_delivery_outbox(submission_id,destination) values(p_id,'slack_enrichment')
  on conflict(submission_id,destination) do update set revision = public.lead_delivery_outbox.revision + 1,
    state = case when public.lead_delivery_outbox.lease_until > now() then 'sending' else 'pending' end,
    attempts = 0,next_attempt_at = now(),updated_at = now();
  return true;
end;
$$;

create function public.trace_mark_persistence_failed(p_id uuid,p_token_hash text) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  perform public.trace_authorize_submission(p_id,p_token_hash);
  update public.lead_submissions set status='failed',updated_at=now() where id=p_id and status='pending';
  if not found then return false; end if;
  insert into public.lead_journey_events(event_key,submission_id,name,source,occurred_at)
    values('persistence-failed:' || p_id,p_id,'lead_persistence_failed','browser',now()) on conflict do nothing;
  perform public.trace_queue_enrichment(p_id);
  return true;
end;
$$;

-- Checkpoint a bounded Slack history page under the existing outbox lease.
-- Recovered references/snapshots never UPDATE leads or invoke their hooks.
create function public.trace_record_slack_recovery(p_delivery bigint,p_lease uuid,p_revision bigint,p_cursor text,p_complete boolean,p_matches jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare d public.lead_delivery_outbox; s public.lead_submissions; r public.lead_slack_recovery; m jsonb;
  v_outcome text := 'scanning'; v_ts text;
begin
  -- All producers lock submission before outbox; keep that same lock order.
  select * into d from public.lead_delivery_outbox where id=p_delivery;
  if not found then return null; end if;
  select * into strict s from public.lead_submissions where id=d.submission_id for update;
  select * into d from public.lead_delivery_outbox where id=p_delivery for update;
  if not found or d.destination <> 'slack_enrichment' or p_lease is null or d.lease_id is distinct from p_lease
    or d.lease_until is null or d.lease_until <= now() or d.revision is distinct from p_revision then return null; end if;
  if p_complete is null or p_complete <> (p_cursor is null) or length(p_cursor)>2048 or p_cursor=''
    or jsonb_typeof(p_matches) is distinct from 'array' or jsonb_array_length(p_matches)>2 then raise exception 'Invalid recovery page'; end if;
  insert into public.lead_slack_recovery(submission_id) values(s.id) on conflict do nothing;
  select * into strict r from public.lead_slack_recovery where submission_id=s.id for update;
  if r.outcome <> 'scanning' then return jsonb_build_object('outcome',r.outcome); end if;
  if r.pages >= 100 or (p_cursor is not null and p_cursor = r.cursor) then raise exception 'Recovery page limit or repeated cursor'; end if;
  for m in select value from jsonb_array_elements(p_matches) loop
    if coalesce(m->>'ts','') !~ '^[0-9]{10,}[.][0-9]{6}$' or coalesce(m->>'method','') not in ('metadata','legacy_reference_and_contact')
      or jsonb_typeof(m->'blocks') is distinct from 'array' or jsonb_array_length(m->'blocks') not between 1 and 50
      or jsonb_typeof(m->'text') is distinct from 'string' or octet_length(m::text)>100000 then raise exception 'Invalid recovered message'; end if;
    if r.candidate is null then r.candidate := m; r.match_count := 1;
    elsif r.candidate->>'ts' <> m->>'ts' then r.match_count := 2; end if;
  end loop;
  if r.match_count > 1 then v_outcome := 'ambiguous';
  elsif p_complete and r.match_count = 0 then v_outcome := 'not_found';
  elsif p_complete then
    v_ts := r.candidate->>'ts';
    -- Serialize the reference assignment across different submissions too.
    perform pg_advisory_xact_lock(hashtextextended('slack-root:' || v_ts,0));
    if (s.slack_message_ts is not null and s.slack_message_ts <> v_ts)
      or (s.slack_channel_id is not null and s.slack_channel_id <> 'C08DUJ6V2G6')
      or exists(select 1 from public.lead_submissions where id <> s.id and slack_message_ts=v_ts)
      then v_outcome := 'conflict';
    else
      update public.lead_submissions set slack_message_ts=v_ts,slack_channel_id='C08DUJ6V2G6',slack_initial_state='sent',
        slack_initial_message=jsonb_build_object('text',r.candidate->'text','blocks',r.candidate->'blocks'),updated_at=now() where id=s.id;
      insert into public.lead_journey_events(event_key,submission_id,name,source,occurred_at,properties)
        values('slack-recovered:' || s.id,s.id,'slack_root_recovered','reconciliation',now(),
          jsonb_build_object('channel','C08DUJ6V2G6','ts',v_ts,'method',r.candidate->>'method')) on conflict do nothing;
      v_outcome := 'resolved';
    end if;
  end if;
  update public.lead_slack_recovery set cursor=p_cursor,candidate=r.candidate,match_count=r.match_count,pages=r.pages+1,
    outcome=v_outcome,updated_at=now() where submission_id=s.id;
  return jsonb_build_object('outcome',v_outcome,'pages',r.pages+1);
end;
$$;
revoke all on function public.trace_mark_persistence_failed(uuid,text),
  public.trace_record_slack_recovery(bigint,uuid,bigint,text,boolean,jsonb) from public,anon,authenticated;
grant execute on function public.trace_mark_persistence_failed(uuid,text),
  public.trace_record_slack_recovery(bigint,uuid,bigint,text,boolean,jsonb) to service_role;
