create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'internal'
    check (role in ('public', 'internal', 'admin')),
  active boolean not null default true,
  organization text,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists public.access_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  national_id text not null,
  email text not null,
  community text not null,
  motivation text not null,
  pcn_affiliation text,
  institution text,
  use_purpose text,
  data_protection text,
  instrument_slug text not null,
  access_level text not null
    check (access_level in ('admin', 'coordination')),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  reviewer_notes text,
  reviewed_by uuid references public.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  instrument text not null,
  council text,
  visibility text not null
    check (visibility in ('public', 'internal', 'sensitive')),
  storage_bucket text,
  storage_path text,
  created_at timestamptz not null default now()
);

create unique index if not exists documents_instrument_storage_path_unique
  on public.documents (instrument, storage_path);

alter table public.users enable row level security;
alter table public.access_requests enable row level security;
alter table public.documents enable row level security;

drop policy if exists users_own on public.users;
create policy users_own on public.users
  for select using (auth.uid() = id);

drop policy if exists users_admin on public.users;
create policy users_admin on public.users
  for all using (
    exists (
      select 1
      from public.users u
      where u.id = auth.uid()
        and u.role = 'admin'
        and u.active = true
    )
  );

drop policy if exists requests_insert on public.access_requests;
create policy requests_insert on public.access_requests
  for insert with check (true);

drop policy if exists requests_admin on public.access_requests;
create policy requests_admin on public.access_requests
  for all using (
    exists (
      select 1
      from public.users u
      where u.id = auth.uid()
        and u.role = 'admin'
        and u.active = true
    )
  );

drop policy if exists docs_public on public.documents;
create policy docs_public on public.documents
  for select using (visibility = 'public');

drop policy if exists docs_internal on public.documents;
create policy docs_internal on public.documents
  for select using (
    visibility = 'internal'
    and exists (
      select 1
      from public.users u
      where u.id = auth.uid()
        and u.role in ('internal', 'admin')
        and u.active = true
    )
  );

drop policy if exists docs_sensitive on public.documents;
create policy docs_sensitive on public.documents
  for select using (
    visibility = 'sensitive'
    and exists (
      select 1
      from public.users u
      where u.id = auth.uid()
        and u.role = 'admin'
        and u.active = true
    )
  );
