-- Additional copies follow the original lead's lifetime. Pending intake rows
-- have no original yet and must remain usable by the existing capture flow.
alter table public.lead_submissions add column original_deleted_at timestamptz;

-- Do not silently leave historical copies behind or guess which unfinished
-- submissions represent deletions. Production preflight found zero such rows.
do $$ begin
  if exists(select 1 from public.lead_submissions
    where status='persisted' and lead_id is null and one_lead_id is null) then
    raise exception 'Review orphaned persisted submissions before enabling retention';
  end if;
end $$;

create function public.trace_retire_contact_copies() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if old.original_deleted_at is not null then
    new.original_deleted_at := old.original_deleted_at;
    if new.lead_id is not null or new.one_lead_id is not null then
      raise exception 'Deleted submission cannot be reused' using errcode = '22023';
    end if;
  elsif (old.lead_id is not null and new.lead_id is null
      and not exists(select 1 from public.leads where id=old.lead_id))
    or (old.one_lead_id is not null and new.one_lead_id is null
      and not exists(select 1 from public.leads_one where id=old.one_lead_id)) then
    new.original_deleted_at := now();
  else
    -- The marker belongs to this trigger, not to an incoming payload.
    new.original_deleted_at := null;
  end if;
  if new.original_deleted_at is not null then
    new.contact_snapshot := '{}'::jsonb;
    new.slack_initial_message := null;
    new.email_hash := null;
    new.token_hash := null;
    new.token_expires_at := null;
  end if;
  return new;
end;
$$;

-- Runs after trace_set_email_hash alphabetically, including late snapshot
-- writes. The FK's ON DELETE SET NULL update invokes it in the same transaction.
create trigger trace_z_retire_contact_copies before update on public.lead_submissions
for each row execute function public.trace_retire_contact_copies();
revoke all on function public.trace_retire_contact_copies() from public, anon, authenticated;
