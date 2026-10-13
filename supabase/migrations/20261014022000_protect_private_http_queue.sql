-- pg_net keeps authorization headers in its transient request queue. Some
-- installations grant PUBLIC table access: the browser must never read it.
revoke all on net.http_request_queue from public,anon,authenticated;
revoke select(headers) on net.http_request_queue from public,anon,authenticated;
grant all on net.http_request_queue to service_role;
