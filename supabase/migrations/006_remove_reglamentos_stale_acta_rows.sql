-- Remove legacy reglamentos rows created with older storage_path keys
-- (pre-normalization / pre-ACTAS folder convention).

delete from public.documents
where instrument = 'reglamentos'
  and storage_path in (
    'reglamentos/cc-martin-luther-king/acta-validacion-martin-luther-king.pdf',
    'reglamentos/cc-esperanza-viva/acta-validacion-cc-esperanza-viva.pdf',
    'reglamentos/cc-llaves-del-futuro/acta-validacion-cc-llaves-del-futuro.pdf',
    'reglamentos/cc-mayor-de-capitania/acta-validacion-cc-capitania.pdf',
    'reglamentos/cc-nelson-mandela-guaviare/acta-aprobacion-nelson-mandela-guaviare.pdf',
    'reglamentos/cc-nelson-mandela-piamonte/acta-validacion-cc-nelson-mandela-piamonte.pdf',
    'reglamentos/cc-nueva-esperanza/acta-validacion-cc-nueva-esperanza.pdf',
    'reglamentos/cc-orconepiac/acta-validacion-cc-orconepiac.pdf',
    'reglamentos/cc-diego-luis-cordoba/acta-aprobacion-diego-luis-cordoba.pdf',
    'reglamentos/cc-martin-luther-king/acta-martin-luther-king.pdf'
  );
