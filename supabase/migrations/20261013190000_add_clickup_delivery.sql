-- Correlation is private: never UPDATE leads or dispatch its commercial hooks.
create index lead_submissions_clickup_task on public.lead_submissions(clickup_task_id) where clickup_task_id is not null;

create function public.trace_link_clickup(p_submission uuid, p_task_id text, p_list_id text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_submission public.lead_submissions;
begin
  if p_task_id is null or p_task_id !~ '^[a-zA-Z0-9]{1,50}$' or p_list_id is distinct from '901301203866'
    then raise exception 'Invalid ClickUp reference' using errcode = '22023'; end if;
  select * into strict v_submission from public.lead_submissions where id = p_submission for update;
  if v_submission.status <> 'persisted' then raise exception 'Persisted lead required' using errcode = '22023'; end if;
  if v_submission.clickup_task_id = p_task_id then return false; end if;
  if v_submission.clickup_task_id is not null then raise exception 'ClickUp reference already exists' using errcode = '22023'; end if;
  update public.lead_submissions set clickup_task_id = p_task_id, updated_at = now() where id = p_submission;
  insert into public.lead_journey_events(event_key, submission_id, name, source, occurred_at, properties)
    values('clickup-linked:' || p_submission, p_submission, 'clickup_task_linked', 'n8n', now(),
      jsonb_build_object('task_id', p_task_id, 'list_id', p_list_id));
  perform public.trace_queue_enrichment(p_submission);
  return true;
end;
$$;

-- Slack must not reserve ClickUp deliveries handled by the independent n8n consumer.
create function public.trace_claim_slack_deliveries(p_limit integer default 4)
returns setof public.lead_delivery_outbox language plpgsql security definer set search_path = '' as $$
begin
  return query with ready as (
    select id from public.lead_delivery_outbox
    where destination = 'slack_enrichment' and revision > delivered_revision and attempts < 8 and next_attempt_at <= now()
      and (lease_until is null or lease_until < now())
    order by next_attempt_at, id for update skip locked limit least(greatest(p_limit, 1), 50)
  ) update public.lead_delivery_outbox d set state = 'sending', lease_id = gen_random_uuid(),
      lease_until = now() + interval '90 seconds', attempts = attempts + 1, updated_at = now()
    from ready where d.id = ready.id returning d.*;
end;
$$;

-- One bounded job per call. Serialize claims across submissions sharing a task,
-- and project all recent submissions so an older retry cannot erase a newer lead.
create function public.trace_claim_clickup_delivery()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_delivery public.lead_delivery_outbox; v_task text; v_context jsonb; v_count bigint; v_meetings jsonb;
begin
  perform pg_advisory_xact_lock(20261013, 190000);
  select d.* into v_delivery from public.lead_delivery_outbox d
    join public.lead_submissions s on s.id = d.submission_id
    where d.destination = 'clickup_enrichment' and s.clickup_task_id is not null
      and d.revision > d.delivered_revision and d.attempts < 8 and d.next_attempt_at <= now()
      and (d.lease_until is null or d.lease_until < now())
      and not exists (
        select 1 from public.lead_delivery_outbox busy join public.lead_submissions related on related.id = busy.submission_id
        where busy.destination = 'clickup_enrichment' and related.clickup_task_id = s.clickup_task_id and busy.lease_until > now()
      )
    order by d.next_attempt_at, d.id for update of d skip locked limit 1;
  if not found then return null; end if;
  update public.lead_delivery_outbox set state = 'sending', lease_id = gen_random_uuid(),
    lease_until = now() + interval '90 seconds', attempts = attempts + 1, updated_at = now()
    where id = v_delivery.id returning * into v_delivery;
  select clickup_task_id into v_task from public.lead_submissions where id = v_delivery.submission_id;
  select count(*) into v_count from public.lead_submissions where clickup_task_id = v_task;
  select jsonb_agg(snapshot order by created_at desc, id desc) into v_context from (
    select s.created_at, s.id, jsonb_build_object('submission_id', s.id, 'funnel', s.funnel,
      'lead_id', coalesce(s.lead_id, s.one_lead_id), 'created_at', s.created_at,
      'attribution', s.attribution, 'conversion_page', s.contact_snapshot->>'page_path',
      'invoice_count', l.facturas_compra_mes,
      'legacy_utms', jsonb_build_object('utm_source', coalesce(l.utm_source,o.utm_source),
        'utm_medium', coalesce(l.utm_medium,o.utm_medium), 'utm_campaign', coalesce(l.utm_campaign,o.utm_campaign),
        'utm_content', coalesce(l.utm_content,o.utm_content), 'utm_term', coalesce(l.utm_term,o.utm_term))) snapshot
    from public.lead_submissions s left join public.leads l on l.id = s.lead_id left join public.leads_one o on o.id = s.one_lead_id
    where s.clickup_task_id = v_task order by s.created_at desc, s.id desc limit 10
  ) recent;
  select coalesce(jsonb_agg(jsonb_build_object('status', status, 'starts_at', starts_at) order by starts_at desc), '[]'::jsonb)
    into v_meetings from (
      select m.status, m.starts_at from public.lead_meetings m join public.lead_submissions s on s.id = m.submission_id
      where s.clickup_task_id = v_task order by m.starts_at desc nulls last limit 20
    ) meetings;
  return jsonb_build_object('delivery', jsonb_build_object('id', v_delivery.id, 'lease_id', v_delivery.lease_id,
    'revision', v_delivery.revision, 'lease_until', v_delivery.lease_until),
    'task_id', v_task, 'list_id', '901301203866', 'field_id', 'e40a83ca-2acc-4103-ac62-cbf5ab7563e0',
    'submission_count', v_count, 'submissions', v_context, 'meetings', v_meetings);
end;
$$;

revoke all on function public.trace_link_clickup(uuid,text,text), public.trace_claim_slack_deliveries(integer),
  public.trace_claim_clickup_delivery() from public, anon, authenticated;
grant execute on function public.trace_link_clickup(uuid,text,text), public.trace_claim_slack_deliveries(integer),
  public.trace_claim_clickup_delivery() to service_role;
