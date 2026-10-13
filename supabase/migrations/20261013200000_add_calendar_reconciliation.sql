create table public.lead_calendar_reconciliation (
  user_uri text primary key check (user_uri ~ '^https://api.calendly.com/users/[a-zA-Z0-9-]+$'),
  state jsonb not null check (jsonb_typeof(state) = 'object' and octet_length(state::text) <= 131072),
  revision bigint not null default 0,
  lease_id uuid,
  lease_until timestamptz,
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  cycle_started_at timestamptz not null default now(),
  cycle_completed_at timestamptz,
  pages_processed bigint not null default 0,
  last_error text,
  updated_at timestamptz not null default now()
);
alter table public.lead_calendar_reconciliation enable row level security;
revoke all on public.lead_calendar_reconciliation from public, anon, authenticated;
grant all on public.lead_calendar_reconciliation to service_role;

create function public.trace_claim_calendar_reconciliation(p_user_uri text)
returns public.lead_calendar_reconciliation language plpgsql security definer set search_path = '' as $$
declare v_row public.lead_calendar_reconciliation; v_initial jsonb;
begin
  if p_user_uri is null or p_user_uri !~ '^https://api.calendly.com/users/[a-zA-Z0-9-]+$' then raise exception 'Invalid calendar scope'; end if;
  v_initial := jsonb_build_object('user_uri',p_user_uri,'min_start_time',now() - interval '90 days',
    'event_status','active','event_page_token',null,'event_pages_done',false,'events','[]'::jsonb,
    'invitee_status','active','invitee_page_token',null,'complete',false);
  insert into public.lead_calendar_reconciliation(user_uri, state) values(p_user_uri,v_initial) on conflict do nothing;
  select * into v_row from public.lead_calendar_reconciliation where user_uri = p_user_uri for update skip locked;
  if not found or v_row.lease_until > now() or v_row.next_attempt_at > now() or v_row.attempts >= 8 then return null; end if;
  update public.lead_calendar_reconciliation set
    state = case when (state->>'complete')::boolean then v_initial else state end,
    cycle_started_at = case when (state->>'complete')::boolean then now() else cycle_started_at end,
    pages_processed = case when (state->>'complete')::boolean then 0 else pages_processed end,
    lease_id = gen_random_uuid(), lease_until = now() + interval '120 seconds', attempts = attempts + 1, updated_at = now()
    where user_uri = p_user_uri returning * into v_row;
  insert into public.lead_traceability_health(job,last_started_at) values('calendly_reconciliation:' || p_user_uri,now())
    on conflict(job) do update set last_started_at = excluded.last_started_at;
  return v_row;
end;
$$;

create function public.trace_commit_calendar_reconciliation(p_user_uri text, p_lease uuid, p_revision bigint, p_state jsonb, p_meetings jsonb)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_row public.lead_calendar_reconciliation; v_meeting jsonb; v_complete boolean;
begin
  select * into v_row from public.lead_calendar_reconciliation where user_uri = p_user_uri for update;
  if not found or v_row.lease_id is distinct from p_lease or p_lease is null or v_row.revision <> p_revision or v_row.lease_until <= now() then return false; end if;
  if p_state->>'user_uri' is distinct from p_user_uri or jsonb_typeof(p_state) is distinct from 'object'
    or coalesce(p_state->>'complete','') not in ('true','false') or jsonb_typeof(p_meetings) is distinct from 'array' or jsonb_array_length(p_meetings) > 100
    then raise exception 'Invalid reconciliation checkpoint'; end if;
  v_complete := (p_state->>'complete')::boolean;
  for v_meeting in select value from jsonb_array_elements(p_meetings)
  loop perform public.trace_record_calendly(v_meeting,'reconciliation'); end loop;
  update public.lead_calendar_reconciliation set state = p_state, revision = revision + 1, attempts = 0,
    pages_processed = pages_processed + 1, last_error = null, updated_at = now(),
    lease_id = case when v_complete then null else lease_id end,
    lease_until = case when v_complete then null else lease_until end,
    cycle_completed_at = case when v_complete then now() else cycle_completed_at end,
    next_attempt_at = case when v_complete then now() + interval '24 hours' else now() end
    where user_uri = p_user_uri;
  if v_complete then
    perform public.trace_reconcile_unmatched_meetings(100);
    insert into public.lead_traceability_health(job,last_started_at,last_completed_at,result)
      values('calendly_reconciliation:' || p_user_uri,v_row.cycle_started_at,now(),jsonb_build_object('completed',true,'pages',v_row.pages_processed + 1))
      on conflict(job) do update set last_completed_at = excluded.last_completed_at, result = excluded.result;
  end if;
  return true;
end;
$$;

create function public.trace_release_calendar_reconciliation(p_user_uri text, p_lease uuid, p_error text default null, p_retry_after integer default null)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  update public.lead_calendar_reconciliation set lease_id = null, lease_until = null, last_error = left(p_error,100), updated_at = now(),
    next_attempt_at = now() + make_interval(secs => case when p_error is null then 0
      else greatest(least(3600,coalesce(p_retry_after,0)),least(3600,(power(2,attempts)*15)::integer)) end)
    where user_uri = p_user_uri and lease_id = p_lease;
  return found;
end;
$$;
revoke all on function public.trace_claim_calendar_reconciliation(text),
  public.trace_commit_calendar_reconciliation(text,uuid,bigint,jsonb,jsonb),
  public.trace_release_calendar_reconciliation(text,uuid,text,integer) from public,anon,authenticated;
grant execute on function public.trace_claim_calendar_reconciliation(text),
  public.trace_commit_calendar_reconciliation(text,uuid,bigint,jsonb,jsonb),
  public.trace_release_calendar_reconciliation(text,uuid,text,integer) to service_role;
