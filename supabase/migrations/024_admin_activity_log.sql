create table if not exists public.admin_activity_log (
  id uuid primary key default gen_random_uuid(),
  kind text not null
    check (kind in (
      'content',
      'user_created',
      'user_deactivated',
      'user_role_changed',
      'password_reset',
      'access_review'
    )),
  title text not null,
  section text not null,
  actor_user_id uuid references public.users(id) on delete set null,
  actor_display_name text not null,
  entity_type text,
  entity_id uuid,
  occurred_at timestamptz not null default now()
);

create index if not exists admin_activity_log_occurred_at_idx
  on public.admin_activity_log (occurred_at desc);

alter table public.admin_activity_log enable row level security;

drop policy if exists admin_activity_log_admin_read on public.admin_activity_log;
create policy admin_activity_log_admin_read on public.admin_activity_log
  for select using (
    exists (
      select 1
      from public.users u
      where u.id = auth.uid()
        and u.role = 'admin'
        and u.active = true
    )
  );

-- Backfill recent events from existing tables (actor unknown for historical rows).
insert into public.admin_activity_log (kind, title, section, actor_display_name, entity_type, entity_id, occurred_at)
select
  'content',
  d.title,
  case d.instrument
    when 'conservacion' then 'ACCs'
    when 'normativa-vigente' then 'Biblioteca'
    when 'litigio' then 'Biblioteca'
    when 'planes-uso' then 'Biblioteca'
    when 'etnodesarrollo' then 'Biblioteca'
    when 'proteccion-hidrica' then 'Biblioteca'
    when 'reglamentos' then 'Gobierno propio'
    else 'Biblioteca'
  end,
  'Sistema',
  'document',
  d.id,
  d.created_at
from public.documents d
order by d.created_at desc
limit 30;

insert into public.admin_activity_log (kind, title, section, actor_display_name, entity_type, entity_id, occurred_at)
select
  'user_created',
  initcap(replace(split_part(u.email, '@', 1), '.', ' ')) || ' — cuenta creada',
  'Usuarios',
  'Sistema',
  'user',
  u.id,
  u.created_at
from public.users u
where u.role in ('admin', 'internal')
order by u.created_at desc
limit 20;

insert into public.admin_activity_log (kind, title, section, actor_display_name, entity_type, entity_id, occurred_at)
select
  'content',
  n.title,
  'Lo Último',
  'Sistema',
  'internal_news',
  n.id,
  n.updated_at
from public.internal_news n
order by n.updated_at desc
limit 15;

insert into public.admin_activity_log (kind, title, section, actor_display_name, entity_type, entity_id, occurred_at)
select
  'content',
  e.title,
  'Agenda',
  'Sistema',
  'event',
  e.id,
  e.updated_at
from public.events e
order by e.updated_at desc
limit 15;

insert into public.admin_activity_log (kind, title, section, actor_display_name, entity_type, entity_id, occurred_at)
select
  'content',
  s.title,
  'Dashboards',
  'Sistema',
  'scita_dashboard',
  s.id,
  s.updated_at
from public.scita_dashboards s
order by s.updated_at desc
limit 10;

insert into public.admin_activity_log (kind, title, section, actor_display_name, entity_type, entity_id, occurred_at)
select
  'access_review',
  r.full_name || ' — solicitud ' || case r.status when 'approved' then 'aprobada' else 'rechazada' end,
  'Solicitudes',
  coalesce(
    initcap(replace(split_part(reviewer.email, '@', 1), '.', ' ')),
    'Sistema'
  ),
  'access_request',
  r.id,
  r.reviewed_at
from public.access_requests r
left join public.users reviewer on reviewer.id = r.reviewed_by
where r.reviewed_at is not null
order by r.reviewed_at desc
limit 15;
