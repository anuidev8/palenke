-- Remove legacy fallback rows that mirrored PUMANE (planes-uso) into conservacion.
-- Conservacion must only reflect direct source documents from
-- docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA.

delete from public.documents
where instrument = 'conservacion'
  and storage_path in (
    'conservacion/cc-renacientes/pumane-final-cc-renacientes.pdf',
    'conservacion/cc-renacientes/anexo-1-pumane-glosario.pdf',
    'conservacion/cc-renacientes/anexo-2-memoria-metodologica-pumane.pdf',
    'conservacion/cc-renacientes/anexo-3-especies-flora-fauna-pumane.pdf'
  );
