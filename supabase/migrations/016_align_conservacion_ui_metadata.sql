-- Align ACC (Áreas de Conservación Comunitaria) metadata with the agreed UI table:
-- CONSEJO COMUNITARIO / TERRITORIO / AÑO.
-- Keep behavior unchanged by updating only metadata fields.

with target_updates (
  council_slug,
  council,
  territory,
  published_on,
  created_at
) as (
  values
    (
      'cc-nelson-mandela',
      'CC - Nelson Mandela',
      'Municipio de Miraflores, Departamento del Guaviare',
      date '2024-01-01',
      timestamptz '2024-01-01 00:00:00+00'
    ),
    (
      'cc-diego-luis-cordoba',
      'CC - Diego Luis Córdoba',
      'Municipio de Miraflores, Departamento del Guaviare',
      date '2024-01-01',
      timestamptz '2024-01-01 00:00:00+00'
    ),
    (
      'cc-las-acacias',
      'CC - Las Acacias',
      'Municipio de Puerto Guzman, Departamento de Putumayo',
      date '2024-01-01',
      timestamptz '2024-01-01 00:00:00+00'
    ),
    (
      'cc-villa-del-rio',
      'CC - Villa del Río',
      'Municipio de Puerto Caicedo, Departamento de Putumayo',
      date '2024-01-01',
      timestamptz '2024-01-01 00:00:00+00'
    ),
    (
      'cc-mujeres-afro-del-patia-california',
      'CC - Mujeres Afro del Patía California',
      'Municipio de Patia, Departamento del Cauca.',
      date '2024-01-01',
      timestamptz '2024-01-01 00:00:00+00'
    ),
    (
      'cc-despertad-patianos',
      'CC - Despertad Patianos',
      'Municipio de Patia, Departamento del Cauca.',
      date '2024-01-01',
      timestamptz '2024-01-01 00:00:00+00'
    ),
    (
      'cc-martin-luther-king',
      'CC - Martin Luther King',
      'Municipio de Miraflores, Departamento del Guaviare',
      date '2024-01-01',
      timestamptz '2024-01-01 00:00:00+00'
    ),
    (
      'cc-renacientes-de-la-diaspora-africana',
      'CC - Renacientes de la Diáspora Africana',
      'Municipio de Chaguaní, Departamento de Cundinamarca',
      date '2024-01-01',
      timestamptz '2024-01-01 00:00:00+00'
    ),
    (
      'cc-raices',
      'CC - Raices',
      'Municipio de Miraflores, Departamento del Guaviare',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    ),
    (
      'cc-cimarrones',
      'CC - Cimarrones',
      'Municipio de Miraflores, Departamento del Guaviare',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    ),
    (
      'cc-los-dos-rios-de-corregimientos-y-veredas-de-cantagallo',
      'CC - Los Dos Ríos de Corregimientos y Veredas de Cantagallo',
      'Municipio de Cantagallo, Departamento de Bolivar',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    ),
    (
      'cc-mayor-de-la-capitania-afrodescendiente-de-paez',
      'CC - Mayor de la Capitanía Afrodescendiente de Páez',
      'Municipio de Belalcazar, Departamento del Cauca',
      date '2025-01-01',
      timestamptz '2025-01-01 00:00:00+00'
    )
)
update public.documents as d
set
  council = u.council,
  territory = u.territory,
  published_on = u.published_on,
  created_at = u.created_at,
  municipality = null,
  department = null
from target_updates as u
where d.instrument = 'conservacion'
  and d.storage_path like ('conservacion/' || u.council_slug || '/%');
