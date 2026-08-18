create table public.works_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  company text not null check (char_length(company) between 2 and 160),
  email text not null check (char_length(email) between 5 and 254),
  whatsapp text check (whatsapp is null or char_length(whatsapp) <= 40),
  process_description text not null check (char_length(process_description) between 20 and 5000),
  systems text check (systems is null or char_length(systems) <= 1000),
  frequency text not null check (frequency in ('Varias veces al día', 'Todos los días', 'Todas las semanas', 'Todos los meses', 'Otro')),
  manual_hours text not null check (manual_hours in ('Menos de 5 h / semana', '5-20 h / semana', '20-50 h / semana', 'Más de 50 h / semana', 'No sé')),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  landing_path text not null default '/works',
  status text not null default 'new' check (status in ('new', 'calendar_viewed', 'scheduled', 'contacted', 'closed')),
  slack_message_ts text
);

create index works_leads_created_at_idx on public.works_leads (created_at desc);
create index works_leads_status_idx on public.works_leads (status);

alter table public.works_leads enable row level security;

comment on table public.works_leads is 'Leads del funnel comercial independiente Ruka Works. Solo accesible mediante funciones con service role.';
