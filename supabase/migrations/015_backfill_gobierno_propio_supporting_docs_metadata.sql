-- Backfill metadata for supporting files (actas + anexos) so Gobierno Propio
-- cards render year/location consistently from DB values.

with target_updates (
  storage_path,
  territory,
  published_on,
  created_at
) as (
  values
    (
      'reglamentos/cc-diego-luis-cordoba/ACTAS-DE-ACTUALIZACION/acta-aprobacion-diego-luis-cordoba.pdf',
      'Municipio de Miraflores, Departamento del Guaviare',
      date '2023-01-01',
      timestamptz '2023-01-01 00:00:00+00'
    ),
    (
      'reglamentos/cc-esperanza-viva/ACTAS-DE-VALIDACION/acta-validacion-cc-esperanza-viva.pdf',
      'Municipio de Piamonte, Departamento del Cauca.',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    ),
    (
      'reglamentos/cc-llaves-del-futuro/ACTAS-DE-VALIDACION/acta-validacion-cc-llaves-del-futuro.pdf',
      'Municipio de Piamonte, Departamento del Cauca.',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    ),
    (
      'reglamentos/cc-martin-luther-king/ACTAS-DE-ACTUALIZACION/acta-validacion-martin-luther-king.pdf',
      'Municipio de Miraflores, Departamento del Guaviare',
      date '2023-01-01',
      timestamptz '2023-01-01 00:00:00+00'
    ),
    (
      'reglamentos/cc-mayor-de-capitania/ACTAS-DE-ACTUALIZACION/acta-validacion-cc-capitania.pdf',
      'Municipio de Capitanía, Departamento del Cauca',
      date '2023-01-01',
      timestamptz '2023-01-01 00:00:00+00'
    ),
    (
      'reglamentos/cc-nelson-mandela-guaviare/ACTAS-DE-ACTUALIZACION/acta-aprobacion-nelson-mandela-guaviare.pdf',
      'Municipio de Miraflores, Departamento del Guaviare',
      date '2023-01-01',
      timestamptz '2023-01-01 00:00:00+00'
    ),
    (
      'reglamentos/cc-nelson-mandela-piamonte/ACTAS-DE-VALIDACION/acta-validacion-cc-nelson-mandela-piamonte.pdf',
      'Municipio de Piamonte, Departamento del Cauca.',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    ),
    (
      'reglamentos/cc-nueva-esperanza/ACTAS-DE-VALIDACION/acta-validacion-cc-nueva-esperanza.pdf',
      'Municipio de Piamonte, Departamento del Cauca.',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    ),
    (
      'reglamentos/cc-orconepiac/ACTAS-DE-VALIDACION/acta-validacion-cc-orconepiac.pdf',
      'Municipio de Piamonte, Departamento del Cauca.',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    ),
    (
      'planes-uso/cc-renacientes/anexo-1-pumane-glosario.pdf',
      'Municipio de Chaguaní, Departamento de Cundinamarca',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    ),
    (
      'planes-uso/cc-renacientes/anexo-2-memoria-metodologica-pumane.pdf',
      'Municipio de Chaguaní, Departamento de Cundinamarca',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    ),
    (
      'planes-uso/cc-renacientes/anexo-3-especies-flora-fauna-pumane.pdf',
      'Municipio de Chaguaní, Departamento de Cundinamarca',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    )
)
update public.documents as d
set
  territory = u.territory,
  published_on = u.published_on,
  created_at = u.created_at,
  municipality = null,
  department = null
from target_updates as u
where d.storage_path = u.storage_path
  and d.instrument in ('reglamentos', 'planes-uso');
