-- Supabase-supported scheduler, independent of n8n availability. Only this
-- private, bounded maintenance function is scheduled; no commercial workflow.
create extension if not exists pg_cron;
select cron.schedule('lead-attribution-retention', '17 * * * *',
  $$select public.trace_expire_attribution_detail();$$);
