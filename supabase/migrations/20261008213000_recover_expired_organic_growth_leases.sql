create or replace function public.claim_organic_growth_job(
  p_kind text,
  p_trigger_source text default 'schedule',
  p_force boolean default false
)
returns table (claimed boolean, run_id uuid, reason text, next_due_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  state_row public.organic_growth_state%rowtype;
  new_run_id uuid;
  due_at timestamptz;
begin
  if p_kind not in ('execution', 'reporting') then
    raise exception 'Invalid organic growth job kind: %', p_kind;
  end if;

  select * into state_row
  from public.organic_growth_state
  where engine_key = 'ruka'
  for update;

  if state_row.execution_lease_run_id is not null and state_row.execution_lease_expires_at <= now() then
    update public.organic_growth_runs
    set status = 'failed', finished_at = now(), error_message = 'Execution lease expired before completion'
    where id = state_row.execution_lease_run_id and status = 'running';
    update public.organic_growth_state
    set execution_lease_run_id = null, execution_lease_expires_at = null, updated_at = now()
    where engine_key = 'ruka';
  end if;

  if state_row.reporting_lease_run_id is not null and state_row.reporting_lease_expires_at <= now() then
    update public.organic_growth_runs
    set status = 'failed', finished_at = now(), error_message = 'Reporting lease expired before completion'
    where id = state_row.reporting_lease_run_id and status = 'running';
    update public.organic_growth_state
    set reporting_lease_run_id = null, reporting_lease_expires_at = null, updated_at = now()
    where engine_key = 'ruka';
  end if;

  select * into state_row
  from public.organic_growth_state
  where engine_key = 'ruka';

  if (p_kind = 'execution' and state_row.execution_lease_run_id is not null and state_row.execution_lease_expires_at > now())
     or (p_kind = 'reporting' and state_row.reporting_lease_run_id is not null and state_row.reporting_lease_expires_at > now()) then
    return query select false, null::uuid, 'active_lease',
      case when p_kind = 'execution' then state_row.next_execution_at else state_row.next_report_at end;
    return;
  end if;

  due_at := case when p_kind = 'execution' then state_row.next_execution_at else state_row.next_report_at end;
  if not p_force and due_at > now() then
    return query select false, null::uuid, 'not_due', due_at;
    return;
  end if;

  insert into public.organic_growth_runs (kind, trigger_source)
  values (p_kind, left(coalesce(p_trigger_source, 'schedule'), 80))
  returning id into new_run_id;

  update public.organic_growth_state
  set execution_lease_run_id = case when p_kind = 'execution' then new_run_id else execution_lease_run_id end,
      execution_lease_expires_at = case when p_kind = 'execution' then now() + interval '2 hours' else execution_lease_expires_at end,
      reporting_lease_run_id = case when p_kind = 'reporting' then new_run_id else reporting_lease_run_id end,
      reporting_lease_expires_at = case when p_kind = 'reporting' then now() + interval '2 hours' else reporting_lease_expires_at end,
      updated_at = now()
  where engine_key = 'ruka';

  return query select true, new_run_id, 'claimed', due_at;
end;
$$;

revoke all on function public.claim_organic_growth_job(text, text, boolean) from public, anon, authenticated;
grant execute on function public.claim_organic_growth_job(text, text, boolean) to service_role;
