-- Private bucket for SCITA field report evidence (images + audio only).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'scita-evidence',
  'scita-evidence',
  false,
  4194304,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'audio/webm',
    'audio/mpeg',
    'audio/mp4',
    'audio/ogg',
    'audio/x-m4a',
    'audio/wav'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table public.scita_reports
  add column if not exists evidence_bucket text,
  add column if not exists evidence_path text,
  add column if not exists evidence_mime_type text,
  add column if not exists evidence_size_bytes bigint,
  add column if not exists evidence_original_name text;

create index if not exists scita_reports_evidence_path_idx
  on public.scita_reports (evidence_path)
  where evidence_path is not null;

-- Internal/admin users can read evidence objects via authenticated Storage API.
drop policy if exists "scita_evidence_internal_select" on storage.objects;
create policy "scita_evidence_internal_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'scita-evidence'
  and exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.role in ('internal', 'admin')
      and u.active = true
  )
);
