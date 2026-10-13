begin;
insert into public.lead_submissions(id,funnel,created_at,token_hash,token_expires_at,contact_snapshot,attribution,slack_initial_message,clickup_task_id)
values('11111111-1111-4111-8111-111111111111','classic',now()-interval '91 days',repeat('a',64),now()-interval '84 days',
  '{"email":"retention@example.invalid"}',
  '{"version":1,"anonymous_id":"private","session_id":"private","ga_client_id":"private","ga_session_id":"private","observed_pages":[{"page":"private"}],"first_touch":{"utm_source":"google","utm_term":"restaurant","gclid":"private"},"session_entry":{"utm_campaign":"launch","fbclid":"private"},"last_non_direct_touch":null,"analytics_consent":"unknown"}',
  '{"text":"keep original"}','task-keep'),
('22222222-2222-4222-8222-222222222222','one',now(),repeat('b',64),now()+interval '7 days','{}','{"anonymous_id":"keep"}',null,null);
select public.trace_queue_enrichment('11111111-1111-4111-8111-111111111111');
do $$ declare result jsonb; s public.lead_submissions; begin
  result := public.trace_expire_attribution_detail();
  assert result = '{"details_expired":1,"tokens_expired":1}'::jsonb;
  select * into strict s from public.lead_submissions where id='11111111-1111-4111-8111-111111111111';
  assert s.attribution::text not like '%private%', 'Acquisition identifiers and route history expire';
  assert s.attribution->'first_touch'->>'utm_term' = 'restaurant', 'Campaign summaries survive';
  assert s.attribution->'session_entry'->>'utm_campaign' = 'launch';
  assert s.attribution->'last_non_direct_touch' = 'null'::jsonb, 'No invented touch';
  assert s.token_hash is null and s.attribution_detail_expired_at is not null;
  assert s.contact_snapshot->>'email'='retention@example.invalid' and s.email_hash is not null, 'Meeting correlation survives';
  assert s.slack_initial_message->>'text'='keep original' and s.clickup_task_id='task-keep', 'Delivery snapshots/references survive';
  assert (select count(*)=2 and bool_and(revision=1 and state='pending') from public.lead_delivery_outbox where submission_id=s.id), 'No delivery or replay triggered';
  assert (select token_hash=repeat('b',64) and attribution->>'anonymous_id'='keep' and attribution_detail_expired_at is null from public.lead_submissions where id='22222222-2222-4222-8222-222222222222'), 'Recent lead and valid continuation unchanged';
  assert public.trace_expire_attribution_detail() = '{"details_expired":0,"tokens_expired":0}'::jsonb, 'Idempotent';
  assert not has_function_privilege('anon','public.trace_expire_attribution_detail()','execute');
  assert not has_function_privilege('authenticated','public.trace_expire_attribution_detail()','execute');
  assert has_function_privilege('service_role','public.trace_expire_attribution_detail()','execute');
end $$;
rollback;
