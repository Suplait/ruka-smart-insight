-- Keep campaign summaries and delivery references; expire only acquisition
-- identifiers / navigation detail and already unusable continuation hashes.
alter table public.lead_submissions add column attribution_detail_expired_at timestamptz;

create function public.trace_expire_attribution_detail() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare s record; a jsonb; touch text; details integer := 0; tokens integer := 0;
begin
  -- Bound work and skip intake/worker transactions rather than blocking them.
  for s in select id, attribution from public.lead_submissions
    where created_at < now() - interval '90 days'
      and attribution_detail_expired_at is null
    order by created_at limit 1000 for update skip locked
  loop
    a := (s.attribution - array['anonymous_id','session_id','ga_client_id','ga_session_id','observed_pages'])
      || '{"detail_expired":true}'::jsonb;
    foreach touch in array array['first_touch','session_entry','last_non_direct_touch'] loop
      if jsonb_typeof(a->touch) = 'object' then
        a := jsonb_set(a,array[touch],(a->touch) - array['gclid','gbraid','wbraid','fbclid']);
      end if;
    end loop;
    update public.lead_submissions set attribution = a,
      attribution_detail_expired_at = now() where id = s.id;
    details := details + 1;
  end loop;
  with expired as (
    select id from public.lead_submissions
    where token_hash is not null and token_expires_at <= now()
    order by token_expires_at limit 1000 for update skip locked
  )
  update public.lead_submissions target set token_hash = null
    from expired e where target.id = e.id;
  get diagnostics tokens = row_count;
  insert into public.lead_traceability_health(job,last_started_at,last_completed_at,result)
    values('attribution_retention',now(),now(),jsonb_build_object('details_expired',details,'tokens_expired',tokens))
    on conflict(job) do update set last_started_at=now(),last_completed_at=now(),result=excluded.result;
  return jsonb_build_object('details_expired',details,'tokens_expired',tokens);
end;
$$;
revoke all on function public.trace_expire_attribution_detail() from public,anon,authenticated;
grant execute on function public.trace_expire_attribution_detail() to service_role;
