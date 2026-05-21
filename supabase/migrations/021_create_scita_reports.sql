-- Create citizen environmental reports table
create table if not exists public.scita_reports (
  id uuid primary key default gen_random_uuid(),
  categoria text not null check (categoria in ('hidrica', 'deforestacion', 'mineria', 'fauna', 'otro')),
  formato text not null check (formato in ('texto', 'imagen', 'voz')),
  descripcion text not null,
  nombre text,
  contacto text,
  tablero_origen text check (tablero_origen in ('gobierno', 'conservacion', 'titulacion', 'proyectos')),
  created_at timestamptz not null default now()
);

-- Index for ordering by creation date
create index if not exists scita_reports_created_at_idx on public.scita_reports (created_at desc);

-- Enable Row-Level Security
alter table public.scita_reports enable row level security;

-- Policies for public.scita_reports
-- 1. Allow anonymous insertions (citizen reporting is open to the public)
drop policy if exists scita_reports_anon_insert on public.scita_reports;
create policy scita_reports_anon_insert on public.scita_reports
  for insert with check (true);

-- 2. Allow administrative/internal users to view reports
drop policy if exists scita_reports_admin_select on public.scita_reports;
create policy scita_reports_admin_select on public.scita_reports
  for select using (
    exists (
      select 1
      from public.users u
      where u.id = auth.uid()
        and u.role in ('internal', 'admin')
        and u.active = true
    )
  );

-- 3. Allow admins full privileges (e.g. deletion, updating)
drop policy if exists scita_reports_admin_all on public.scita_reports;
create policy scita_reports_admin_all on public.scita_reports
  for all using (
    exists (
      select 1
      from public.users u
      where u.id = auth.uid()
        and u.role = 'admin'
        and u.active = true
    )
  );
