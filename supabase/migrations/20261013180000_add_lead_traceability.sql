-- Additive stage. Existing capture grants and n8n triggers are intentionally
-- retained until the token-aware frontend and endpoints have been deployed.
alter table public.leads add column if not exists submission_id uuid;
alter table public.leads add column if not exists utm_term text;
create unique index if not exists leads_submission_id_key on public.leads(submission_id);

create table public.lead_submissions (
  id uuid primary key,
  funnel text not null check (funnel in ('classic', 'one')),
  token_hash text check (token_hash ~ '^[a-f0-9]{64}$'),
  token_expires_at timestamptz,
  lead_id bigint unique references public.leads(id) on delete set null,
  one_lead_id bigint unique references public.leads_one(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'persisted', 'failed')),
  attribution jsonb,
  contact_snapshot jsonb not null default '{}'::jsonb,
  slack_initial_message jsonb,
  slack_channel_id text,
  slack_message_ts text,
  slack_initial_state text not null default 'pending'
    check (slack_initial_state in ('pending', 'sending', 'sent', 'uncertain', 'failed')),
  slack_initial_claimed_at timestamptz,
  clickup_task_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (num_nonnulls(lead_id, one_lead_id) <= 1),
  check (attribution is null or (jsonb_typeof(attribution) = 'object' and octet_length(attribution::text) <= 32768)),
  check (jsonb_typeof(contact_snapshot) = 'object' and octet_length(contact_snapshot::text) <= 16384)
);

create table public.lead_journey_events (
  id bigint generated always as identity primary key,
  event_key text not null unique check (length(event_key) <= 300),
  submission_id uuid not null references public.lead_submissions(id),
  name text not null check (length(name) <= 100),
  source text not null check (source in ('browser', 'database', 'calendly', 'n8n', 'reconciliation')),
  occurred_at timestamptz not null,
  received_at timestamptz not null default now(),
  properties jsonb not null default '{}'::jsonb,
  check (jsonb_typeof(properties) = 'object' and octet_length(properties::text) <= 16384)
);
create index lead_journey_submission_time on public.lead_journey_events(submission_id, occurred_at);

create table public.lead_delivery_outbox (
  id bigint generated always as identity primary key,
  submission_id uuid not null references public.lead_submissions(id),
  destination text not null check (destination in ('slack_enrichment', 'clickup_enrichment')),
  revision bigint not null default 1,
  delivered_revision bigint not null default 0,
  state text not null default 'pending' check (state in ('pending', 'sending', 'delivered', 'failed', 'waiting_reference')),
  attempts integer not null default 0 check (attempts >= 0),
  next_attempt_at timestamptz not null default now(),
  lease_id uuid,
  lease_until timestamptz,
  last_error text,
  updated_at timestamptz not null default now(),
  delivered_at timestamptz,
  unique(submission_id, destination)
);
create index lead_delivery_ready on public.lead_delivery_outbox(next_attempt_at) where state <> 'delivered';

create table public.lead_meetings (
  invitee_uri text primary key,
  event_uri text not null,
  submission_id uuid references public.lead_submissions(id),
  status text not null check (status in ('active', 'canceled')),
  booked_at timestamptz not null,
  starts_at timestamptz,
  source_updated_at timestamptz not null,
  old_invitee_uri text,
  new_invitee_uri text,
  association_method text not null check (association_method in ('booking_token', 'unique_email', 'unmatched', 'ambiguous')),
  source text not null check (source in ('calendly', 'reconciliation')),
  received_at timestamptz not null default now(),
  check (invitee_uri ~ '^https://api.calendly.com/scheduled_events/[^/]+/invitees/[^/]+$'),
  check (event_uri ~ '^https://api.calendly.com/scheduled_events/[^/]+$')
);
create index lead_meetings_submission on public.lead_meetings(submission_id, starts_at);

alter table public.lead_submissions enable row level security;
alter table public.lead_journey_events enable row level security;
alter table public.lead_delivery_outbox enable row level security;
alter table public.lead_meetings enable row level security;
revoke all on public.lead_submissions, public.lead_journey_events, public.lead_delivery_outbox, public.lead_meetings from public, anon, authenticated;
grant all on public.lead_submissions, public.lead_journey_events, public.lead_delivery_outbox, public.lead_meetings to service_role;
grant usage, select on sequence public.lead_journey_events_id_seq, public.lead_delivery_outbox_id_seq to service_role;

create function public.trace_queue_enrichment(p_submission uuid) returns void
language sql security definer set search_path = '' as $$
  insert into public.lead_delivery_outbox(submission_id, destination)
  values (p_submission, 'slack_enrichment'), (p_submission, 'clickup_enrichment')
  on conflict(submission_id, destination) do update
    set revision = public.lead_delivery_outbox.revision + 1,
        state = case when public.lead_delivery_outbox.lease_until > now() then 'sending' else 'pending' end,
        attempts = 0, next_attempt_at = now(), updated_at = now();
$$;

create function public.trace_assign_submission() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  new.submission_id := coalesce(new.submission_id, gen_random_uuid());
  return new;
end;
$$;
create trigger trace_assign_submission before insert on public.leads
for each row execute function public.trace_assign_submission();

create function public.trace_record_lead_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  v_funnel text := case when tg_table_name = 'leads_one' then 'one' else 'classic' end;
  v_data jsonb := to_jsonb(new);
begin
  insert into public.lead_submissions(id, funnel, lead_id, one_lead_id, status, contact_snapshot, slack_message_ts)
  values(new.submission_id, v_funnel,
    case when v_funnel = 'classic' then new.id end,
    case when v_funnel = 'one' then new.id end, 'persisted',
    jsonb_build_object('name', left(v_data->>'name', 120), 'company_name', left(coalesce(v_data->>'company_name', v_data->>'company'), 160),
      'email', left(v_data->>'email', 254), 'whatsapp', left(v_data->>'whatsapp', 32), 'ccity', left(v_data->>'ccity', 120),
      'page_path', left(coalesce(v_data->>'page_path', v_data->>'landing_path'), 1000)),
    coalesce(v_data->>'slack_message_ts', v_data->>'slack_thread_ts'))
  on conflict(id) do update set
    lead_id = excluded.lead_id, one_lead_id = excluded.one_lead_id,
    status = 'persisted', contact_snapshot = excluded.contact_snapshot,
    slack_message_ts = coalesce(public.lead_submissions.slack_message_ts, excluded.slack_message_ts), updated_at = now()
  where public.lead_submissions.funnel = excluded.funnel
    and (public.lead_submissions.lead_id is null or public.lead_submissions.lead_id = excluded.lead_id)
    and (public.lead_submissions.one_lead_id is null or public.lead_submissions.one_lead_id = excluded.one_lead_id);
  if not found then raise exception 'Submission already belongs to a lead'; end if;
  insert into public.lead_journey_events(event_key, submission_id, name, source, occurred_at, properties)
  values('persisted:' || v_funnel || ':' || new.id, new.submission_id, 'lead_persisted', 'database', new.created_at,
    jsonb_build_object('table', tg_table_name, 'record_id', new.id)) on conflict(event_key) do nothing;
  perform public.trace_queue_enrichment(new.submission_id);
  return new;
end;
$$;
create trigger trace_record_lead_insert after insert on public.leads
for each row execute function public.trace_record_lead_insert();
create trigger trace_record_one_insert after insert on public.leads_one
for each row execute function public.trace_record_lead_insert();

-- Only the authenticated server can prepare a submission; the raw continuation
-- token stays in the browser and the edge handler sends its SHA-256 digest here.
create function public.trace_prepare_submission(p_id uuid, p_token_hash text, p_funnel text, p_attribution jsonb, p_contact jsonb)
returns public.lead_submissions language plpgsql security definer set search_path = '' as $$
declare v_row public.lead_submissions;
begin
  if p_token_hash is null or p_token_hash !~ '^[a-f0-9]{64}$' then raise exception 'Invalid continuation token'; end if;
  insert into public.lead_submissions(id, token_hash, token_expires_at, funnel, attribution, contact_snapshot)
  values(p_id, p_token_hash, now() + interval '7 days', p_funnel, p_attribution, p_contact)
  on conflict(id) do nothing;
  select * into strict v_row from public.lead_submissions where id = p_id for update;
  if v_row.token_hash is distinct from p_token_hash or v_row.funnel <> p_funnel or v_row.token_expires_at <= now()
    then raise exception 'Invalid continuation token' using errcode = '28000'; end if;
  return v_row;
end;
$$;

create function public.trace_claim_initial_slack(p_id uuid) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  update public.lead_submissions set slack_initial_state = 'sending', slack_initial_claimed_at = now()
  where id = p_id and slack_initial_state in ('pending', 'failed') and slack_message_ts is null;
  return found;
end;
$$;

create function public.trace_authorize_submission(p_id uuid, p_token_hash text)
returns public.lead_submissions language plpgsql security definer set search_path = '' as $$
declare v_row public.lead_submissions;
begin
  select * into v_row from public.lead_submissions where id = p_id;
  if not found or p_token_hash is null or v_row.token_hash is null or v_row.token_hash is distinct from p_token_hash or v_row.token_expires_at is null or v_row.token_expires_at <= now()
    then raise exception 'Invalid continuation token' using errcode = '28000'; end if;
  return v_row;
end;
$$;

create function public.trace_submit_lead(p_id uuid, p_token_hash text, p_lead jsonb)
returns bigint language plpgsql security definer set search_path = '' as $$
declare v_row public.lead_submissions; v_id bigint;
begin
  select * into strict v_row from public.lead_submissions where id = p_id for update;
  if p_token_hash is null or v_row.token_hash is null or v_row.token_hash is distinct from p_token_hash or v_row.token_expires_at is null or v_row.token_expires_at <= now()
    then raise exception 'Invalid continuation token' using errcode = '28000'; end if;
  if v_row.lead_id is not null then return v_row.lead_id; end if;
  if v_row.one_lead_id is not null then return v_row.one_lead_id; end if;
  if v_row.funnel = 'classic' then
    insert into public.leads(submission_id, name, first_name, last_name, company_name, email, ccity,
      whatsapp, codigo_promocional, page_path, utm_source, utm_medium, utm_campaign, utm_content, utm_term, slack_message_ts)
    values(p_id, p_lead->>'name', p_lead->>'first_name', p_lead->>'last_name', p_lead->>'company_name', p_lead->>'email',
      p_lead->>'ccity', p_lead->>'whatsapp', p_lead->>'codigo_promocional', p_lead->>'page_path',
      p_lead->>'utm_source', p_lead->>'utm_medium', p_lead->>'utm_campaign', p_lead->>'utm_content', p_lead->>'utm_term', v_row.slack_message_ts)
    returning id into v_id;
  else
    insert into public.leads_one(submission_id, name, company, email, whatsapp, landing_path,
      utm_source, utm_medium, utm_campaign, utm_content, utm_term, slack_thread_ts)
    values(p_id, p_lead->>'name', p_lead->>'company', p_lead->>'email', p_lead->>'whatsapp',
      coalesce(p_lead->>'landing_path', '/one/contacto'), p_lead->>'utm_source', p_lead->>'utm_medium',
      p_lead->>'utm_campaign', p_lead->>'utm_content', p_lead->>'utm_term', v_row.slack_message_ts)
    returning id into v_id;
  end if;
  return v_id;
end;
$$;

create function public.trace_claim_deliveries(p_limit integer default 20)
returns setof public.lead_delivery_outbox language plpgsql security definer set search_path = '' as $$
begin
  return query
  with ready as (
    select id from public.lead_delivery_outbox
    where revision > delivered_revision and attempts < 8 and next_attempt_at <= now()
      and (lease_until is null or lease_until < now())
    order by next_attempt_at for update skip locked limit least(greatest(p_limit, 1), 50)
  )
  update public.lead_delivery_outbox d set state = 'sending', lease_id = gen_random_uuid(),
    lease_until = now() + interval '90 seconds', attempts = attempts + 1, updated_at = now()
  from ready where d.id = ready.id returning d.*;
end;
$$;

create function public.trace_finish_delivery(p_id bigint, p_lease uuid, p_revision bigint, p_error text default null, p_retry_after integer default null)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  update public.lead_delivery_outbox set
    delivered_revision = case when p_error is null then greatest(delivered_revision, p_revision) else delivered_revision end,
    state = case when p_error is null and revision = p_revision then 'delivered' when attempts >= 8 then 'failed' else 'pending' end,
    delivered_at = case when p_error is null then now() else delivered_at end,
    next_attempt_at = now() + make_interval(secs => case when p_error is null then 0 else greatest(least(3600, coalesce(p_retry_after, 0)), least(3600, (power(2, attempts) * 15)::integer)) end),
    last_error = left(p_error, 500), lease_id = null, lease_until = null, updated_at = now()
  where id = p_id and lease_id = p_lease and p_revision <= revision;
  return found;
end;
$$;

revoke all on function public.trace_queue_enrichment(uuid), public.trace_assign_submission(), public.trace_record_lead_insert(),
  public.trace_prepare_submission(uuid,text,text,jsonb,jsonb), public.trace_claim_initial_slack(uuid),
  public.trace_submit_lead(uuid,text,jsonb),
  public.trace_authorize_submission(uuid,text),
  public.trace_claim_deliveries(integer), public.trace_finish_delivery(bigint,uuid,bigint,text,integer)
  from public, anon, authenticated;
grant execute on function public.trace_queue_enrichment(uuid), public.trace_prepare_submission(uuid,text,text,jsonb,jsonb),
  public.trace_submit_lead(uuid,text,jsonb),
  public.trace_authorize_submission(uuid,text),
  public.trace_claim_initial_slack(uuid), public.trace_claim_deliveries(integer), public.trace_finish_delivery(bigint,uuid,bigint,text,integer)
  to service_role;

comment on table public.lead_journey_events is 'Private evidence ledger. Browser success events are observations, never database confirmations or extra ad conversions.';
comment on table public.lead_delivery_outbox is 'Updates existing Slack messages and ClickUp tasks only. Never dispatches pixels, calls, messages to prospects, or task creation.';

-- Persist qualification and its evidence together. Replaying the same value is a no-op.
create function public.trace_qualify_lead(p_id uuid, p_token_hash text, p_invoice_count integer)
returns void language plpgsql security definer set search_path = '' as $$
declare v_submission public.lead_submissions; v_lead public.leads;
begin
  select * into v_submission from public.lead_submissions where id = p_id for update;
  perform public.trace_authorize_submission(p_id, p_token_hash);
  if v_submission.lead_id is null then raise exception 'Classic lead required'; end if;
  if p_invoice_count is null or p_invoice_count not in (75,225,450,750) then raise exception 'Invalid qualification'; end if;
  select * into strict v_lead from public.leads where id = v_submission.lead_id for update;
  if v_lead.facturas_compra_mes is not distinct from p_invoice_count
    and v_lead.requires_calendly is not distinct from (p_invoice_count >= 150) then return; end if;
  update public.leads set facturas_compra_mes = p_invoice_count, requires_calendly = (p_invoice_count >= 150) where id = v_lead.id;
  insert into public.lead_journey_events(event_key, submission_id, name, source, occurred_at, properties)
  values ('qualified:' || gen_random_uuid(), p_id, 'lead_qualified', 'database', now(),
    jsonb_build_object('invoice_count', p_invoice_count, 'requires_calendly', p_invoice_count >= 150));
  perform public.trace_queue_enrichment(p_id);
end;
$$;

create function public.trace_confirm_initial_slack(p_id uuid, p_channel text, p_ts text)
returns void language plpgsql security definer set search_path = '' as $$
declare v_submission public.lead_submissions;
begin
  if p_channel is null or p_ts is null or p_channel !~ '^C[A-Z0-9]+$' or p_ts !~ '^[0-9]+[.][0-9]+$' then raise exception 'Invalid Slack reference'; end if;
  select * into strict v_submission from public.lead_submissions where id = p_id for update;
  if v_submission.slack_message_ts is not null and v_submission.slack_message_ts <> p_ts then raise exception 'Slack reference already exists'; end if;
  update public.lead_submissions set slack_channel_id = p_channel, slack_message_ts = p_ts, slack_initial_state = 'sent', updated_at = now() where id = p_id;
  if v_submission.lead_id is not null then
    update public.leads set slack_message_ts = p_ts where id = v_submission.lead_id and slack_message_ts is distinct from p_ts;
  end if;
  if v_submission.one_lead_id is not null then
    update public.leads_one set slack_thread_ts = p_ts, slack_notified_at = coalesce(slack_notified_at, now()) where id = v_submission.one_lead_id;
  end if;
  perform public.trace_queue_enrichment(p_id);
end;
$$;

create function public.trace_observe_calendar(p_id uuid, p_token_hash text, p_event_uri text, p_invitee_uri text default null)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform public.trace_authorize_submission(p_id, p_token_hash);
  if p_event_uri is null or p_event_uri !~ '^https://api.calendly.com/scheduled_events/[a-zA-Z0-9-]+$'
    then raise exception 'Invalid calendar reference'; end if;
  if p_invitee_uri is not null and (p_invitee_uri !~ '^https://api.calendly.com/scheduled_events/[a-zA-Z0-9-]+/invitees/[a-zA-Z0-9-]+$'
    or split_part(p_invitee_uri, '/invitees/', 1) <> p_event_uri) then raise exception 'Invalid invitee reference'; end if;
  insert into public.lead_journey_events(event_key, submission_id, name, source, occurred_at, properties)
  values('browser-booking:' || p_id || ':' || p_event_uri, p_id, 'calendly_scheduled_observed', 'browser', now(),
    jsonb_build_object('event_uri', p_event_uri, 'invitee_uri', p_invitee_uri)) on conflict(event_key) do nothing;
  -- An iframe signal is only an observation; it never creates a confirmed meeting.
end;
$$;

revoke all on function public.trace_qualify_lead(uuid,text,integer), public.trace_confirm_initial_slack(uuid,text,text),
  public.trace_observe_calendar(uuid,text,text,text) from public, anon, authenticated;
grant execute on function public.trace_qualify_lead(uuid,text,integer), public.trace_confirm_initial_slack(uuid,text,text),
  public.trace_observe_calendar(uuid,text,text,text) to service_role;

-- Missing references are actionable waiting states, not exhausted transport retries.
create function public.trace_defer_delivery(p_id bigint, p_lease uuid, p_reason text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  update public.lead_delivery_outbox set state = 'waiting_reference', attempts = greatest(0, attempts - 1),
    next_attempt_at = now() + interval '5 minutes', last_error = left(p_reason, 100), lease_id = null, lease_until = null, updated_at = now()
  where id = p_id and lease_id = p_lease;
  return found;
end;
$$;
revoke all on function public.trace_defer_delivery(bigint,uuid,text) from public, anon, authenticated;
grant execute on function public.trace_defer_delivery(bigint,uuid,text) to service_role;

create table public.lead_traceability_health (
  job text primary key,
  last_started_at timestamptz not null,
  last_completed_at timestamptz,
  result jsonb not null default '{}'::jsonb
);
alter table public.lead_traceability_health enable row level security;
revoke all on public.lead_traceability_health from public, anon, authenticated;
grant all on public.lead_traceability_health to service_role;
