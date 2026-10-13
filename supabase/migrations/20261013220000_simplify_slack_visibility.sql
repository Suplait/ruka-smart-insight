-- Remove the unused history-recovery prototype. Visibility uses confirmed
-- Slack references; ambiguous sends remain pending and are not sent again.
-- This migration refuses to discard any recovery evidence if it ever exists.
begin;
lock table public.lead_slack_recovery in access exclusive mode;
do $$ begin
  if exists(select from public.lead_slack_recovery) then
    raise exception 'Recovery table is not empty; preserve evidence before cleanup';
  end if;
end; $$;

create or replace function public.trace_claim_initial_slack(p_id uuid) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  update public.lead_submissions set slack_initial_state='sending',slack_initial_claimed_at=now()
  where id=p_id and slack_initial_state in ('pending','failed') and slack_message_ts is null;
  if not found then return false; end if;
  insert into public.lead_delivery_outbox(submission_id,destination) values(p_id,'slack_enrichment')
  on conflict(submission_id,destination) do update set revision=public.lead_delivery_outbox.revision+1,
    state=case when public.lead_delivery_outbox.lease_until>now() then 'sending' else 'pending' end,
    attempts=0,next_attempt_at=now(),updated_at=now();
  return true;
end;
$$;
drop function public.trace_record_slack_recovery(bigint,uuid,bigint,text,boolean,jsonb);
drop table public.lead_slack_recovery;
commit;
