-- Disposable local fixture only; never delete a production lead for this test.
begin;
do $$
declare
  s uuid;
  f text;
  original_id bigint;
  token text := repeat('a',64);
  body jsonb := '{"name":"Retention QA","company_name":"Example","company":"Example","email":"retention@example.invalid","ccity":"Santiago","whatsapp":"000000000"}';
  before_outbox jsonb;
  retired_at timestamptz;
  calls bigint;
begin
  foreach f in array array['classic','one'] loop
    s := gen_random_uuid();
    perform public.trace_prepare_submission(s,token,f,null,body);
    update public.lead_submissions set slack_initial_message='{"text":"private copy"}' where id=s;
    assert (select original_deleted_at is null and contact_snapshot=body and token_hash=token
      from public.lead_submissions where id=s), 'Pending capture is preserved';
    original_id := public.trace_submit_lead(s,token,body);
    assert public.trace_submit_lead(s,token,body)=original_id, 'Normal retry stays idempotent';
    update public.lead_submissions set created_at=now()-interval '180 days',
      slack_channel_id='C08DUJ6V2G6',slack_message_ts='123.456',clickup_task_id='reference' where id=s;
    perform public.trace_expire_attribution_detail();
    assert (select contact_snapshot->>'email'='retention@example.invalid' and
      slack_initial_message is not null and original_deleted_at is null from public.lead_submissions where id=s),
      'Contact copies have no age limit while the original exists';
    select jsonb_agg(to_jsonb(d) order by d.id) into before_outbox from public.lead_delivery_outbox d where submission_id=s;
    select count(*) into calls from public.fixture_n8n_calls;
    if f='classic' then delete from public.leads where id=original_id;
    else delete from public.leads_one where id=original_id; end if;
    select original_deleted_at into retired_at from public.lead_submissions where id=s;
    assert retired_at is not null;
    assert (select contact_snapshot='{}'::jsonb and slack_initial_message is null and email_hash is null
      and token_hash is null and token_expires_at is null and lead_id is null and one_lead_id is null
      and slack_message_ts='123.456' and clickup_task_id='reference' from public.lead_submissions where id=s),
      'Deletion clears copies and continuation while preserving delivery references';
    update public.lead_submissions set contact_snapshot=body,slack_initial_message='{"text":"late write"}',
      email_hash=token,token_hash=token,token_expires_at=now()+interval '7 days',original_deleted_at=null where id=s;
    assert (select contact_snapshot='{}'::jsonb and slack_initial_message is null and email_hash is null
      and token_hash is null and original_deleted_at=retired_at from public.lead_submissions where id=s),
      'Late writes cannot recreate the copies or reauthorize a deleted submission';
    begin
      perform public.trace_submit_lead(s,token,body);
      raise exception 'Deleted original was recreated';
    exception when invalid_authorization_specification then null; end;
    assert (select jsonb_agg(to_jsonb(d) order by d.id)=before_outbox from public.lead_delivery_outbox d where submission_id=s),
      'Retention neither queues deliveries nor alters existing delivery evidence';
    assert (select count(*)=calls from public.fixture_n8n_calls), 'No commercial hook replay';
    assert (select count(*)=1 from public.lead_journey_events where submission_id=s and name='lead_persisted'),
      'Persistence evidence survives';
  end loop;
  assert not has_function_privilege('anon','public.trace_retire_contact_copies()','execute');
  assert not has_function_privilege('authenticated','public.trace_retire_contact_copies()','execute');
end $$;
rollback;
