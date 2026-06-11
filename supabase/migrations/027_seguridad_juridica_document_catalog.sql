-- Extend documents with SEO/catalog fields for gobierno propio document previews.
-- Data seed is managed via data/seguridad-juridica-catalog.json and
-- scripts/sync-seguridad-juridica-documents.mjs

alter table public.documents
  add column if not exists slug text,
  add column if not exists author text,
  add column if not exists theme text,
  add column if not exists subtheme text,
  add column if not exists spatial_coverage text,
  add column if not exists language text default 'es',
  add column if not exists status text,
  add column if not exists rights text,
  add column if not exists related_collection text,
  add column if not exists submodule text,
  add column if not exists format text,
  add column if not exists delivery_date date,
  add column if not exists keywords text[] default '{}';

create unique index if not exists documents_instrument_slug_unique
  on public.documents (instrument, slug)
  where slug is not null;

create index if not exists documents_instrument_submodule_idx
  on public.documents (instrument, submodule, published_on desc nulls last);
