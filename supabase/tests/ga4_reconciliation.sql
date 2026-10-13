begin;
insert into public.leads(created_at,name,company_name,email,ccity)
values('2026-10-10 02:59:59+00','TEST','TEST','DO_NOT_EXPOSE','TEST'),
('2026-10-10 03:00:00+00','TEST','TEST','DO_NOT_EXPOSE','TEST');
do $$ declare result jsonb; begin
  result:=public.trace_ga4_database_counts('2026-09-12','2026-10-10');
  assert jsonb_array_length(result)=29;
  assert (select r->>'classic_leads' from jsonb_array_elements(result) r where r->>'date'='2026-10-09')='1';
  assert (select r->>'classic_leads' from jsonb_array_elements(result) r where r->>'date'='2026-10-10')='1';
  assert (select r->>'consent_unknown' from jsonb_array_elements(result) r where r->>'date'='2026-10-10')='1';
  assert result::text not like '%DO_NOT_EXPOSE%';
  assert not has_function_privilege('anon','public.trace_ga4_database_counts(date,date)','execute');
  assert not has_function_privilege('authenticated','public.trace_ga4_database_counts(date,date)','execute');
  assert has_function_privilege('service_role','public.trace_ga4_database_counts(date,date)','execute');
  assert not has_table_privilege('anon','public.lead_ga4_reconciliations','select');
  assert public.trace_monitor_snapshot()->'counts'->>'ga4_source_unavailable'='0';
  assert public.trace_monitor_snapshot()->'counts'->>'ga4_volume_drop'='0';
  begin
    perform public.trace_ga4_database_counts(current_date-28,current_date);
    raise exception 'Immature range accepted';
  exception when raise_exception then
    assert sqlerrm='Invalid mature reporting window';
  end;
end $$;
insert into public.lead_traceability_health(job,last_started_at,last_completed_at,result)
values('ga4_reconciliation',now(),now(),'{"state":"ok","drop_signals":["lead_created"]}');
do $$ begin
  assert public.trace_monitor_snapshot()->'counts'->>'ga4_volume_drop'='1';
  assert public.trace_monitor_snapshot()->'counts'->>'ga4_source_unavailable'='0';
end $$;
update public.lead_traceability_health set result='{"state":"error","code":"ga4_read_failed"}' where job='ga4_reconciliation';
do $$ begin
  assert public.trace_monitor_snapshot()->'counts'->>'ga4_source_unavailable'='1';
  assert public.trace_monitor_snapshot()->'counts'->>'ga4_volume_drop'='0';
end $$;
rollback;
