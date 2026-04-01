alter table public.access_requests
  add column if not exists document_id uuid references public.documents(id) on delete set null,
  add column if not exists document_title text;

create index if not exists access_requests_document_id_idx
  on public.access_requests (document_id);

create index if not exists access_requests_email_document_status_idx
  on public.access_requests (email, document_id, status);

create table if not exists public.document_download_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  document_id uuid not null references public.documents(id) on delete cascade,
  source_request_id uuid references public.access_requests(id) on delete set null,
  granted_by uuid references public.users(id),
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists document_download_grants_active_user_document_unique
  on public.document_download_grants (user_id, document_id)
  where user_id is not null and revoked_at is null;

create unique index if not exists document_download_grants_active_email_document_unique
  on public.document_download_grants (email, document_id)
  where revoked_at is null;

alter table public.document_download_grants enable row level security;

drop policy if exists document_download_grants_admin on public.document_download_grants;
create policy document_download_grants_admin on public.document_download_grants
  for all using (
    exists (
      select 1
      from public.users u
      where u.id = auth.uid()
        and u.role = 'admin'
        and u.active = true
    )
  );

drop policy if exists document_download_grants_self_select on public.document_download_grants;
create policy document_download_grants_self_select on public.document_download_grants
  for select using (auth.uid() = user_id);
