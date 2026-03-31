-- Migration 003: Public base/methodology documents for each instrument.
-- These are freely downloadable by any user (no auth required).
-- Files must be uploaded to the 'docs-public' Supabase Storage bucket
-- at the exact storage_path values below before downloads will work.
--
-- Bucket setup: create a private bucket named 'docs-public' in Supabase Storage.
-- (Signed URLs are used for delivery, so the bucket does not need to be public.)

insert into public.documents (title, instrument, council, visibility, storage_bucket, storage_path)
values
  (
    'Documento Base Metodológico - Reglamentos Internos',
    'reglamentos',
    'Palenke PCN',
    'public',
    'docs-public',
    'reglamentos/base.pdf'
  ),
  (
    'Documento Base Metodológico - Planes de Uso y Manejo',
    'planes-uso',
    'Palenke PCN',
    'public',
    'docs-public',
    'planes-uso/base.pdf'
  ),
  (
    'Documento Base Metodológico - Etnodesarrollo',
    'etnodesarrollo',
    'Palenke PCN',
    'public',
    'docs-public',
    'etnodesarrollo/base.pdf'
  ),
  (
    'Documento Base Metodológico - Áreas Bioculturales de Conservación',
    'conservacion',
    'Palenke PCN',
    'public',
    'docs-public',
    'conservacion/base.pdf'
  )
on conflict (instrument, storage_path) do nothing;
