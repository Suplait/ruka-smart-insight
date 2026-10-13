create table public.lead_watchdog_state (
  id text primary key check (id in ('heartbeat','probe')),
  last_state text not null default 'healthy' check (last_state in ('healthy','stale','probe')),
  delivery_state text not null default 'confirmed' check (delivery_state in ('confirmed','rejected','uncertain')),
  attempt_id uuid,
  cooldown_until timestamptz not null default '-infinity',
  checked_at timestamptz,
  confirmed_at timestamptz
);
alter table public.lead_watchdog_state enable row level security;
revoke all on public.lead_watchdog_state from public,anon,authenticated;
grant all on public.lead_watchdog_state to service_role;
insert into public.lead_watchdog_state(id) values('heartbeat'),('probe');

create function public.trace_claim_watchdog_notice(p_probe boolean default false) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare s public.lead_watchdog_state; desired text; heartbeat timestamptz; attempt uuid;
begin
  select * into strict s from public.lead_watchdog_state
    where id=case when p_probe then 'probe' else 'heartbeat' end for update;
  select last_completed_at into heartbeat from public.lead_traceability_health where job='enrichment';
  desired := case when p_probe then 'probe'
    when heartbeat >= now()-interval '30 minutes' and heartbeat <= now()+interval '2 minutes' then 'healthy'
    else 'stale' end;
  update public.lead_watchdog_state set checked_at=now() where id=s.id;
  if s.cooldown_until > now() or (s.last_state=desired and s.delivery_state <> 'rejected') then
    return null;
  end if;
  attempt := gen_random_uuid();
  -- Reserve before transmission. A timeout or a lost response must not cause
  -- another post of the same notice. Only an explicit rejection can retry.
  update public.lead_watchdog_state set last_state=desired,delivery_state='uncertain',
    attempt_id=attempt,cooldown_until=now()+interval '30 minutes' where id=s.id;
  return jsonb_build_object('id',s.id,'attempt_id',attempt,'state',desired,'last_heartbeat',heartbeat);
end;
$$;

create function public.trace_finish_watchdog_notice(p_id text,p_attempt uuid,p_outcome text) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if p_outcome not in ('confirmed','rejected','uncertain') then raise exception 'Invalid outcome'; end if;
  update public.lead_watchdog_state set delivery_state=p_outcome,
    confirmed_at=case when p_outcome='confirmed' then now() else confirmed_at end
    where id=p_id and attempt_id=p_attempt and delivery_state='uncertain';
  return found;
end;
$$;
revoke all on function public.trace_claim_watchdog_notice(boolean),public.trace_finish_watchdog_notice(text,uuid,text) from public,anon,authenticated;
grant execute on function public.trace_claim_watchdog_notice(boolean),public.trace_finish_watchdog_notice(text,uuid,text) to service_role;
