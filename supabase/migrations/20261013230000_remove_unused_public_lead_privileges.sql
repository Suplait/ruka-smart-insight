-- Cached classic clients still INSERT/SELECT during the agreed cutover window.
-- They never need direct UPDATE, DELETE, TRUNCATE, REFERENCES or TRIGGER rights.
-- The existing update Edge Function and commercial n8n use service_role.
revoke update, delete, truncate, references, trigger on public.leads from public, anon, authenticated;

-- Column-level grants are independent from table grants.
do $$
declare column_name text;
begin
  for column_name in
    select attname from pg_attribute
    where attrelid = 'public.leads'::regclass and attnum > 0 and not attisdropped
  loop
    execute format('revoke update (%I), references (%I) on public.leads from public, anon, authenticated', column_name, column_name);
  end loop;
end;
$$;
