alter table public.organic_growth_state
  add column if not exists execution_lease_run_id uuid,
  add column if not exists execution_lease_expires_at timestamptz,
  add column if not exists reporting_lease_run_id uuid,
  add column if not exists reporting_lease_expires_at timestamptz;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'organic_growth_state' and column_name = 'lease_kind'
  ) then
    execute $migration$
      update public.organic_growth_state
      set execution_lease_run_id = case when lease_kind = 'execution' then lease_run_id else execution_lease_run_id end,
          execution_lease_expires_at = case when lease_kind = 'execution' then lease_expires_at else execution_lease_expires_at end,
          reporting_lease_run_id = case when lease_kind = 'reporting' then lease_run_id else reporting_lease_run_id end,
          reporting_lease_expires_at = case when lease_kind = 'reporting' then lease_expires_at else reporting_lease_expires_at end
    $migration$;
  end if;
end;
$$;

alter table public.organic_growth_state
  drop constraint if exists organic_growth_state_lease_kind,
  drop column if exists lease_kind,
  drop column if exists lease_run_id,
  drop column if exists lease_expires_at;

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

create or replace function public.finish_organic_growth_job(
  p_run_id uuid,
  p_success boolean,
  p_summary jsonb default '{}'::jsonb,
  p_error_message text default null,
  p_data_through_date date default null,
  p_git_sha text default null,
  p_pull_request_url text default null,
  p_deployment_url text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  run_kind text;
begin
  select kind into run_kind from public.organic_growth_runs where id = p_run_id for update;
  if run_kind is null then raise exception 'Unknown run %', p_run_id; end if;

  update public.organic_growth_runs
  set status = case when p_success then 'succeeded' else 'failed' end,
      finished_at = now(),
      data_through_date = coalesce(p_data_through_date, data_through_date),
      git_sha = coalesce(p_git_sha, git_sha),
      pull_request_url = coalesce(p_pull_request_url, pull_request_url),
      deployment_url = coalesce(p_deployment_url, deployment_url),
      summary = coalesce(p_summary, '{}'::jsonb),
      error_message = case when p_success then null else left(coalesce(p_error_message, 'Unknown failure'), 8000) end
  where id = p_run_id;

  update public.organic_growth_state
  set next_execution_at = case
        when run_kind = 'execution' and p_success then now() + interval '5 days'
        when run_kind = 'execution' then now() + interval '6 hours'
        else next_execution_at end,
      next_report_at = case
        when run_kind = 'reporting' and p_success then public.organic_growth_next_report_at(now())
        when run_kind = 'reporting' then now() + interval '2 hours'
        else next_report_at end,
      last_execution_success_at = case when run_kind = 'execution' and p_success then now() else last_execution_success_at end,
      last_report_success_at = case when run_kind = 'reporting' and p_success then now() else last_report_success_at end,
      last_data_through_date = coalesce(p_data_through_date, last_data_through_date),
      execution_lease_run_id = case when run_kind = 'execution' and execution_lease_run_id = p_run_id then null else execution_lease_run_id end,
      execution_lease_expires_at = case when run_kind = 'execution' and execution_lease_run_id = p_run_id then null else execution_lease_expires_at end,
      reporting_lease_run_id = case when run_kind = 'reporting' and reporting_lease_run_id = p_run_id then null else reporting_lease_run_id end,
      reporting_lease_expires_at = case when run_kind = 'reporting' and reporting_lease_run_id = p_run_id then null else reporting_lease_expires_at end,
      updated_at = now()
  where engine_key = 'ruka'
    and ((run_kind = 'execution' and execution_lease_run_id = p_run_id)
      or (run_kind = 'reporting' and reporting_lease_run_id = p_run_id));

  return true;
end;
$$;

revoke all on function public.claim_organic_growth_job(text, text, boolean) from public, anon, authenticated;
revoke all on function public.finish_organic_growth_job(uuid, boolean, jsonb, text, date, text, text, text) from public, anon, authenticated;
grant execute on function public.claim_organic_growth_job(text, text, boolean) to service_role;
grant execute on function public.finish_organic_growth_job(uuid, boolean, jsonb, text, date, text, text, text) to service_role;
