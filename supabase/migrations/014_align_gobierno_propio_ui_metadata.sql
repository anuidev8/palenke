-- Align gobierno propio document metadata with the UI list requested by product:
-- - title (used as file name in cards)
-- - territory (used as "Ubicación")
-- - published_on (used as displayed year)
-- Keep behavior/logic unchanged by updating only DB values.

with target_updates (
  storage_path,
  title,
  territory,
  published_on,
  created_at
) as (
  values
    (
      'reglamentos/cc-diego-luis-cordoba/reglamento-interno-diego-luis-cordoba.pdf',
      'CC Diego Luis Cordoba',
      'Municipio de Miraflores, Departamento del Guaviare',
      date '2023-01-01',
      timestamptz '2023-01-01 00:00:00+00'
    ),
    (
      'reglamentos/cc-esperanza-viva/reglamento-interno-cc-esperanza-viva.pdf',
      'CC Esperanza Viva',
      'Municipio de Piamonte, Departamento del Cauca.',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    ),
    (
      'reglamentos/cc-llaves-del-futuro/reglamento-interno-cc-llaves-del-futuro.pdf',
      'CC Llaves del Futuro',
      'Municipio de Piamonte, Departamento del Cauca.',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    ),
    (
      'reglamentos/cc-martin-luther-king/reglamento-interno-martin-luther-king.pdf',
      'CC Martin Luther King',
      'Municipio de Miraflores, Departamento del Guaviare',
      date '2023-01-01',
      timestamptz '2023-01-01 00:00:00+00'
    ),
    (
      'reglamentos/cc-mayor-de-capitania/reglamento-interno-capitania.pdf',
      'CC Mayor de Capitanía',
      'Municipio de Páez, Departamento del Cauca',
      date '2023-01-01',
      timestamptz '2023-01-01 00:00:00+00'
    ),
    (
      'reglamentos/cc-nelson-mandela-guaviare/reglamento-interno-nelson-mandela-guaviare.pdf',
      'CC Nelson Mandela',
      'Municipio de Miraflores, Departamento del Guaviare',
      date '2023-01-01',
      timestamptz '2023-01-01 00:00:00+00'
    ),
    (
      'reglamentos/cc-nelson-mandela-piamonte/reglamento-interno-cc-nelson-mandela-piamonte.pdf',
      'CC Nelson Mandela',
      'Municipio de Piamonte, Departamento del Cauca.',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    ),
    (
      'reglamentos/cc-nueva-esperanza/reglamento-interno-cc-nueva-esperanza.pdf',
      'CC Nueva Esperanza',
      'Municipio de Piamonte, Departamento del Cauca.',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    ),
    (
      'reglamentos/cc-orconepiac/reglamento-interno-cc-orconepiac.pdf',
      'CC ORCONEPIAC',
      'Municipio de Piamonte, Departamento del Cauca.',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    ),
    (
      'etnodesarrollo/cc-diego-luis-cordoba/plan-etnodesarrollo-diego-luis-cordoba-20241201.pdf',
      'CC Diego Luis Cordoba',
      'Municipio de Miraflores, Departamento del Guaviare',
      date '2024-01-01',
      timestamptz '2024-01-01 00:00:00+00'
    ),
    (
      'etnodesarrollo/cc-nelson-mandela/plan-etnodesarrollo-nelson-mandela-20241201.pdf',
      'CC Nelson Mandela',
      'Municipio de Miraflores, Departamento del Guaviare',
      date '2024-01-01',
      timestamptz '2024-01-01 00:00:00+00'
    ),
    (
      'etnodesarrollo/cc-martin-luther-king/plan-etnodesarrollo-martin-luther-king.pdf',
      'CC Martin Luther King',
      'Municipio de Miraflores, Departamento del Guaviare',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    ),
    (
      'planes-uso/cc-renacientes/pumane-final-cc-renacientes.pdf',
      'Renacientes de la diáspora africana',
      'Municipio de Chaguaní, Departamento de Cundinamarca',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    )
)
update public.documents as d
set
  title = u.title,
  territory = u.territory,
  published_on = u.published_on,
  created_at = u.created_at,
  municipality = null,
  department = null
from target_updates as u
where d.storage_path = u.storage_path
  and d.instrument in ('reglamentos', 'etnodesarrollo', 'planes-uso');
