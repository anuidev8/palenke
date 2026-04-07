-- Update metadata for selected gobierno propio documents:
-- - title
-- - location fields (territory, department, municipality)
-- - published_on (used as document year in UI)

with target_updates (
  storage_path,
  title,
  territory,
  department,
  municipality,
  published_on
) as (
  values
    (
      'reglamentos/cc-diego-luis-cordoba/reglamento-interno-diego-luis-cordoba.pdf',
      'Reglamento Interno - CC Diego Luis Cordoba (Miraflores, Guaviare)',
      'Municipio de Miraflores, Departamento del Guaviare',
      'Guaviare',
      'Miraflores',
      date '2023-01-01'
    ),
    (
      'reglamentos/cc-esperanza-viva/reglamento-interno-cc-esperanza-viva.pdf',
      'Reglamento Interno - CC Esperanza Viva (Piamonte, Cauca)',
      'Municipio de Piamonte, Departamento del Cauca',
      'Cauca',
      'Piamonte',
      date '2025-01-01'
    ),
    (
      'reglamentos/cc-llaves-del-futuro/reglamento-interno-cc-llaves-del-futuro.pdf',
      'Reglamento Interno - CC Llaves del Futuro (Piamonte, Cauca)',
      'Municipio de Piamonte, Departamento del Cauca',
      'Cauca',
      'Piamonte',
      date '2025-01-01'
    ),
    (
      'reglamentos/cc-martin-luther-king/reglamento-interno-martin-luther-king.pdf',
      'Reglamento Interno - CC Martin Luther King (Miraflores, Guaviare)',
      'Municipio de Miraflores, Departamento del Guaviare',
      'Guaviare',
      'Miraflores',
      date '2023-01-01'
    ),
    (
      'reglamentos/cc-mayor-de-capitania/reglamento-interno-capitania.pdf',
      'Reglamento Interno - CC Mayor de Capitania (Capitania, Cauca)',
      'Municipio de Capitania, Departamento del Cauca',
      'Cauca',
      'Capitania',
      date '2023-01-01'
    ),
    (
      'reglamentos/cc-nelson-mandela-guaviare/reglamento-interno-nelson-mandela-guaviare.pdf',
      'Reglamento Interno - CC Nelson Mandela (Miraflores, Guaviare)',
      'Municipio de Miraflores, Departamento del Guaviare',
      'Guaviare',
      'Miraflores',
      date '2023-01-01'
    ),
    (
      'reglamentos/cc-nelson-mandela-piamonte/reglamento-interno-cc-nelson-mandela-piamonte.pdf',
      'Reglamento Interno - CC Nelson Mandela (Piamonte, Cauca)',
      'Municipio de Piamonte, Departamento del Cauca',
      'Cauca',
      'Piamonte',
      date '2025-01-01'
    ),
    (
      'reglamentos/cc-nueva-esperanza/reglamento-interno-cc-nueva-esperanza.pdf',
      'Reglamento Interno - CC Nueva Esperanza (Piamonte, Cauca)',
      'Municipio de Piamonte, Departamento del Cauca',
      'Cauca',
      'Piamonte',
      date '2025-01-01'
    ),
    (
      'reglamentos/cc-orconepiac/reglamento-interno-cc-orconepiac.pdf',
      'Reglamento Interno - CC ORCONEPIAC (Piamonte, Cauca)',
      'Municipio de Piamonte, Departamento del Cauca',
      'Cauca',
      'Piamonte',
      date '2025-01-01'
    ),
    (
      'etnodesarrollo/cc-diego-luis-cordoba/plan-etnodesarrollo-diego-luis-cordoba-20241201.pdf',
      'Plan de Etnodesarrollo - CC Diego Luis Cordoba (Miraflores, Guaviare)',
      'Municipio de Miraflores, Departamento del Guaviare',
      'Guaviare',
      'Miraflores',
      date '2024-01-01'
    ),
    (
      'etnodesarrollo/cc-nelson-mandela/plan-etnodesarrollo-nelson-mandela-20241201.pdf',
      'Plan de Etnodesarrollo - CC Nelson Mandela (Miraflores, Guaviare)',
      'Municipio de Miraflores, Departamento del Guaviare',
      'Guaviare',
      'Miraflores',
      date '2024-01-01'
    ),
    (
      'etnodesarrollo/cc-martin-luther-king/plan-etnodesarrollo-martin-luther-king.pdf',
      'Plan de Etnodesarrollo - CC Martin Luther King (Miraflores, Guaviare)',
      'Municipio de Miraflores, Departamento del Guaviare',
      'Guaviare',
      'Miraflores',
      date '2025-01-01'
    ),
    (
      'planes-uso/cc-renacientes/pumane-final-cc-renacientes.pdf',
      'Plan de Uso y Manejo Ambiental - CC Renacientes de la Diaspora Africana',
      'Municipio de Chaguani, Departamento de Cundinamarca',
      'Cundinamarca',
      'Chaguani',
      date '2025-01-01'
    )
)
update public.documents as d
set
  title = u.title,
  territory = u.territory,
  department = u.department,
  municipality = u.municipality,
  published_on = u.published_on
from target_updates as u
where d.storage_path = u.storage_path
  and d.instrument in ('reglamentos', 'etnodesarrollo', 'planes-uso');
