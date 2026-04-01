-- Seed for Phase 4 document metadata.
-- IMPORTANT:
-- 1) Upload private files to buckets with EXACT storage_path values below.
-- 2) Public normativa PDFs are served from Next.js /public/docs/normativa.

insert into public.documents (title, instrument, council, visibility, storage_bucket, storage_path)
values
  ('Ley 70 de 1993', 'normativa-vigente', 'Congreso de Colombia', 'public', null, '/docs/normativa/Ley_70_de_1993.pdf'),
  ('Decreto 1396 de 2023', 'normativa-vigente', 'Presidencia de la República', 'public', null, '/docs/normativa/Decreto_1396_de_2023.pdf'),
  ('Decreto 129 de 2024', 'normativa-vigente', 'Presidencia de la República', 'public', null, '/docs/normativa/Decreto_129_de_2024.pdf')
on conflict (instrument, storage_path) do nothing;

insert into public.documents (title, instrument, council, visibility, storage_bucket, storage_path)
values
  ('Reglamento Interno - CC Mayor de Capitania', 'reglamentos', 'CC Mayor de Capitania', 'internal', 'docs-internal', 'reglamentos/cc-mayor-de-capitania/reglamento-interno-capitania.pdf'),
  ('Reglamento Interno - CC Llaves del Futuro', 'reglamentos', 'CC Llaves del Futuro', 'internal', 'docs-internal', 'reglamentos/cc-llaves-del-futuro/reglamento-interno-cc-llaves-del-futuro.pdf'),
  ('Reglamento Interno - CC Martin Luther King', 'reglamentos', 'CC Martin Luther King', 'internal', 'docs-internal', 'reglamentos/cc-martin-luther-king/reglamento-interno-martin-luther-king.pdf'),
  ('Reglamento Interno - CC Nelson Mandela (Guaviare)', 'reglamentos', 'CC Nelson Mandela - Guaviare', 'internal', 'docs-internal', 'reglamentos/cc-nelson-mandela-guaviare/reglamento-interno-nelson-mandela-guaviare.pdf'),
  ('Reglamento Interno - CC ORCONEPIAC', 'reglamentos', 'CC ORCONEPIAC', 'internal', 'docs-internal', 'reglamentos/cc-orconepiac/reglamento-interno-cc-orconepiac.pdf'),
  ('Reglamento Interno - CC Nueva Esperanza', 'reglamentos', 'CC Nueva Esperanza', 'internal', 'docs-internal', 'reglamentos/cc-nueva-esperanza/reglamento-interno-cc-nueva-esperanza.pdf'),
  ('Reglamento Interno - CC Nelson Mandela (Piamonte)', 'reglamentos', 'CC Nelson Mandela - Piamonte', 'internal', 'docs-internal', 'reglamentos/cc-nelson-mandela-piamonte/reglamento-interno-cc-nelson-mandela-piamonte.pdf'),
  ('Reglamento Interno - CC Esperanza Viva', 'reglamentos', 'CC Esperanza Viva', 'internal', 'docs-internal', 'reglamentos/cc-esperanza-viva/reglamento-interno-cc-esperanza-viva.pdf'),
  ('Reglamento Interno - CC Diego Luis Cordoba', 'reglamentos', 'CC Diego Luis Cordoba', 'internal', 'docs-internal', 'reglamentos/cc-diego-luis-cordoba/reglamento-interno-diego-luis-cordoba.pdf'),

  ('Plan de Etnodesarrollo - CC Nelson Mandela', 'etnodesarrollo', 'CC Nelson Mandela', 'internal', 'docs-internal', 'etnodesarrollo/cc-nelson-mandela/plan-etnodesarrollo-nelson-mandela-20241201.pdf'),
  ('Plan de Etnodesarrollo - CC Diego Luis Cordoba', 'etnodesarrollo', 'CC Diego Luis Cordoba', 'internal', 'docs-internal', 'etnodesarrollo/cc-diego-luis-cordoba/plan-etnodesarrollo-diego-luis-cordoba-20241201.pdf'),
  ('Plan de Etnodesarrollo - CC Martin Luther King', 'etnodesarrollo', 'CC Martin Luther King', 'internal', 'docs-internal', 'etnodesarrollo/cc-martin-luther-king/plan-etnodesarrollo-martin-luther-king.pdf')
on conflict (instrument, storage_path) do nothing;

insert into public.documents (title, instrument, council, visibility, storage_bucket, storage_path)
values
  ('PUMANE Final - CC Renacientes', 'planes-uso', 'CC Renacientes de la Diáspora Africana', 'sensitive', 'docs-sensitive', 'planes-uso/cc-renacientes/pumane-final-cc-renacientes.pdf'),
  ('Anexo 1 PUMANE - Glosario', 'planes-uso', 'CC Renacientes de la Diáspora Africana', 'sensitive', 'docs-sensitive', 'planes-uso/cc-renacientes/anexo-1-pumane-glosario.pdf'),
  ('Anexo 2 PUMANE - Memoria metodológica', 'planes-uso', 'CC Renacientes de la Diáspora Africana', 'sensitive', 'docs-sensitive', 'planes-uso/cc-renacientes/anexo-2-memoria-metodologica-pumane.pdf'),
  ('Anexo 3 PUMANE - Flora y fauna', 'planes-uso', 'CC Renacientes de la Diáspora Africana', 'sensitive', 'docs-sensitive', 'planes-uso/cc-renacientes/anexo-3-especies-flora-fauna-pumane.pdf')
on conflict (instrument, storage_path) do nothing;
