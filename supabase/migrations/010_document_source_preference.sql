alter table public.documents
  add column if not exists preferred_source text;

update public.documents
set preferred_source = case
  when preferred_source in ('storage', 'external') then preferred_source
  when storage_path is not null then 'storage'
  when external_url is not null then 'external'
  else null
end;

alter table public.documents
  drop constraint if exists documents_preferred_source_check;

alter table public.documents
  add constraint documents_preferred_source_check
  check (preferred_source in ('storage', 'external') or preferred_source is null);
