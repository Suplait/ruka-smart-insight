create table public.works_leads (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  company text not null check (char_length(company) between 2 and 160),
  email text not null check (char_length(email) between 5 and 254),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  landing_path text not null default '/works',
  status text not null default 'new' check (status in ('new', 'calendar_viewed', 'scheduled', 'contacted', 'closed')),
  slack_notification_status text not null default 'pending' check (slack_notification_status in ('pending', 'sending', 'sent', 'failed')),
  slack_notified_at timestamptz,
  slack_message_ts text
);

create index works_leads_created_at_idx on public.works_leads (created_at desc);
create index works_leads_status_idx on public.works_leads (status);
create index works_leads_slack_status_idx on public.works_leads (slack_notification_status);

alter table public.works_leads enable row level security;

comment on table public.works_leads is 'Leads del funnel comercial independiente Ruka Works. Solo accesible mediante funciones con service role.';
comment on column public.works_leads.submission_id is 'Clave idempotente creada por el navegador para evitar leads y notificaciones duplicadas por reintentos.';
