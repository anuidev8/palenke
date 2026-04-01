alter table public.documents
  add column if not exists summary text,
  add column if not exists published_on date,
  add column if not exists external_url text,
  add column if not exists document_type text,
  add column if not exists priority_order integer not null default 0,
  add column if not exists featured boolean not null default false,
  add column if not exists source_label text;

create index if not exists documents_instrument_priority_idx
  on public.documents (instrument, priority_order, published_on desc, created_at desc);

create table if not exists public.internal_news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  body text not null,
  category text not null default 'Actualización territorial',
  location text,
  cover_image_url text,
  visibility text not null default 'public'
    check (visibility in ('public', 'internal')),
  featured boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists internal_news_published_idx
  on public.internal_news (published_at desc);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  description text not null,
  category text not null default 'Territorio',
  location text not null,
  territory text,
  resource_url text,
  resource_label text,
  visibility text not null default 'public'
    check (visibility in ('public', 'internal')),
  featured boolean not null default false,
  starts_at timestamptz not null,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_starts_at_idx
  on public.events (starts_at asc);

alter table public.internal_news enable row level security;
alter table public.events enable row level security;

drop policy if exists internal_news_public on public.internal_news;
create policy internal_news_public on public.internal_news
  for select using (visibility = 'public');

drop policy if exists internal_news_admin on public.internal_news;
create policy internal_news_admin on public.internal_news
  for all using (
    exists (
      select 1
      from public.users u
      where u.id = auth.uid()
        and u.role = 'admin'
        and u.active = true
    )
  );

drop policy if exists events_public on public.events;
create policy events_public on public.events
  for select using (visibility = 'public');

drop policy if exists events_admin on public.events;
create policy events_admin on public.events
  for all using (
    exists (
      select 1
      from public.users u
      where u.id = auth.uid()
        and u.role = 'admin'
        and u.active = true
    )
  );

update public.documents
set
  title = 'Ley 70 de 1993',
  document_type = 'Ley',
  summary = 'Norma central que reconoce los derechos territoriales, culturales, de participación y desarrollo propio de las comunidades negras en Colombia.',
  published_on = coalesce(published_on, date '1993-08-27'),
  priority_order = 10,
  featured = true,
  source_label = 'PDF oficial'
where instrument = 'normativa-vigente'
  and (title ilike 'Ley 70 de 1993%' or storage_path = '/docs/normativa/Ley_70_de_1993.pdf');

update public.documents
set
  title = 'Decreto 1396 de 2023',
  document_type = 'Decreto',
  summary = 'Fortalece espacios e instancias de interlocución, participación y coordinación institucional para comunidades negras, afrocolombianas, raizales y palenqueras.',
  published_on = coalesce(published_on, date '2023-08-29'),
  priority_order = 40,
  featured = true,
  external_url = coalesce(external_url, 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=217103'),
  source_label = 'Función Pública'
where instrument = 'normativa-vigente'
  and (title ilike 'Decreto 1396 de 2023%' or storage_path = '/docs/normativa/Decreto_1396_de_2023.pdf');

update public.documents
set
  title = 'Decreto 0129 de 2024',
  document_type = 'Decreto',
  summary = 'Actualiza disposiciones administrativas relevantes para la coordinación estatal y el fortalecimiento organizativo afrodescendiente.',
  published_on = coalesce(published_on, date '2024-02-01'),
  priority_order = 50,
  featured = true,
  external_url = coalesce(external_url, 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=235062'),
  source_label = 'Función Pública'
where instrument = 'normativa-vigente'
  and (title ilike 'Decreto 129 de 2024%' or title ilike 'Decreto 0129 de 2024%' or storage_path = '/docs/normativa/Decreto_129_de_2024.pdf');

insert into public.documents (
  title,
  instrument,
  council,
  visibility,
  summary,
  published_on,
  external_url,
  document_type,
  priority_order,
  featured,
  source_label
)
select
  'Decreto 1745 de 1995',
  'normativa-vigente',
  'Presidencia de la República',
  'public',
  'Reglamenta el Capítulo III de la Ley 70 de 1993 sobre propiedad colectiva, titulación y funcionamiento de los Consejos Comunitarios.',
  date '1995-10-12',
  'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=7389',
  'Decreto',
  20,
  true,
  'Función Pública'
where not exists (
  select 1
  from public.documents
  where instrument = 'normativa-vigente'
    and title = 'Decreto 1745 de 1995'
);

insert into public.documents (
  title,
  instrument,
  council,
  visibility,
  summary,
  published_on,
  external_url,
  document_type,
  priority_order,
  featured,
  source_label
)
select
  'Decreto 1384 de 2023',
  'normativa-vigente',
  'Presidencia de la República',
  'public',
  'Reconoce y desarrolla medidas de protección ambiental con enfoque étnico, relevantes para territorios colectivos y conservación biocultural.',
  date '2023-08-11',
  'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=217070',
  'Decreto',
  30,
  true,
  'Función Pública'
where not exists (
  select 1
  from public.documents
  where instrument = 'normativa-vigente'
    and title = 'Decreto 1384 de 2023'
);

insert into public.documents (
  title,
  instrument,
  council,
  visibility,
  summary,
  published_on,
  external_url,
  document_type,
  priority_order,
  featured,
  source_label
)
select
  'Plan Nacional de Desarrollo 2022-2026 — capítulos étnicos',
  'normativa-vigente',
  'Departamento Nacional de Planeación',
  'public',
  'Documento base del Plan Nacional de Desarrollo con referencias útiles para seguimiento de compromisos étnicos y territoriales.',
  date '2023-05-19',
  'https://www.cnp.gov.co/Documents/Concepto%20CNP%20BASES%20PND%202022%202026_compressed.pdf',
  'Política pública',
  60,
  false,
  'CNP'
where not exists (
  select 1
  from public.documents
  where instrument = 'normativa-vigente'
    and title = 'Plan Nacional de Desarrollo 2022-2026 — capítulos étnicos'
);

insert into public.documents (
  title,
  instrument,
  council,
  visibility,
  summary,
  published_on,
  external_url,
  document_type,
  priority_order,
  featured,
  source_label
)
select
  'Ley 21 de 1991 — Convenio 169 de la OIT',
  'normativa-vigente',
  'Congreso de Colombia',
  'public',
  'Incorpora al ordenamiento colombiano el Convenio 169 de la OIT sobre pueblos indígenas y tribales, base para consulta previa, participación y territorio.',
  date '1991-03-04',
  'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=37032',
  'Ley',
  70,
  false,
  'Función Pública'
where not exists (
  select 1
  from public.documents
  where instrument = 'normativa-vigente'
    and title = 'Ley 21 de 1991 — Convenio 169 de la OIT'
);

insert into public.internal_news (
  slug,
  title,
  summary,
  body,
  category,
  location,
  visibility,
  featured,
  published_at
)
select
  'mision-territorial-guaviare-marzo-2026',
  'Misión territorial en Guaviare para fortalecer el gobierno propio',
  'El equipo del Palenke acompañó una agenda de trabajo con consejos comunitarios para revisar prioridades de protección territorial y rutas organizativas.',
  'Durante la jornada se consolidaron acuerdos de seguimiento para reglamentos internos, protección hídrica y articulación con procesos de memoria comunitaria. La visita permitió actualizar necesidades de documentación, agenda de formación y coordinación interterritorial para el segundo trimestre del año.',
  'Territorio',
  'Guaviare',
  'public',
  true,
  timestamptz '2026-03-26 10:00:00-05'
where not exists (
  select 1 from public.internal_news where slug = 'mision-territorial-guaviare-marzo-2026'
);

insert into public.internal_news (
  slug,
  title,
  summary,
  body,
  category,
  location,
  visibility,
  featured,
  published_at
)
select
  'encuentro-consejos-comunitarios-ovejas',
  'Encuentro con consejos comunitarios de la cuenca del río Ovejas',
  'Se realizó una jornada de coordinación para priorizar rutas jurídicas, agenda ambiental y circulación de documentos de apoyo para liderazgos locales.',
  'La reunión permitió definir una agenda inmediata de acompañamiento técnico y político, con énfasis en alertas territoriales, seguimiento a normativa reciente y preparación de próximos encuentros comunitarios.',
  'Gobierno propio',
  'Suárez, Cauca',
  'public',
  false,
  timestamptz '2026-03-21 15:30:00-05'
where not exists (
  select 1 from public.internal_news where slug = 'encuentro-consejos-comunitarios-ovejas'
);

insert into public.events (
  slug,
  title,
  summary,
  description,
  category,
  location,
  territory,
  resource_url,
  resource_label,
  visibility,
  featured,
  starts_at,
  ends_at
)
select
  'asamblea-territorial-pacifico-sur-2026',
  'Asamblea territorial de Consejos Comunitarios del Pacífico Sur',
  'Espacio de coordinación política, balance organizativo y definición de prioridades ambientales para el siguiente ciclo territorial.',
  'La asamblea reunirá delegaciones de consejos comunitarios para revisar agenda política, defensa del territorio, normas recientes y articulación con procesos de memoria y monitoreo ambiental.',
  'Asamblea',
  'Tumaco, Nariño',
  'Pacífico Sur',
  '/incidencia',
  'Ver Lo Último',
  'public',
  true,
  timestamptz '2026-04-20 09:00:00-05',
  timestamptz '2026-04-20 17:00:00-05'
where not exists (
  select 1 from public.events where slug = 'asamblea-territorial-pacifico-sur-2026'
);

insert into public.events (
  slug,
  title,
  summary,
  description,
  category,
  location,
  territory,
  resource_url,
  resource_label,
  visibility,
  featured,
  starts_at,
  ends_at
)
select
  'formacion-sig-comunitario-quibdo-2026',
  'Formación en herramientas SIG para equipos comunitarios',
  'Sesión de trabajo para fortalecer el uso comunitario de cartografía, monitoreo y análisis territorial.',
  'La formación abordará captura de datos, lectura de capas territoriales y uso de insumos cartográficos para defensa ambiental y toma de decisiones comunitarias.',
  'Taller',
  'Quibdó, Chocó',
  'Chocó',
  '/geoportal',
  'Abrir geoportal',
  'public',
  true,
  timestamptz '2026-04-18 08:30:00-05',
  timestamptz '2026-04-18 13:00:00-05'
where not exists (
  select 1 from public.events where slug = 'formacion-sig-comunitario-quibdo-2026'
);

insert into public.events (
  slug,
  title,
  summary,
  description,
  category,
  location,
  territory,
  visibility,
  featured,
  starts_at,
  ends_at
)
select
  'audiencia-proteccion-rio-anchicaya-2026',
  'Audiencia pública sobre protección hídrica del río Anchicayá',
  'Audiencia de seguimiento a compromisos institucionales y comunitarios para la defensa del río y sus cuencas.',
  'La jornada combinará balance jurídico, presentación de evidencia territorial y revisión de acuerdos de acción para protección hídrica y vigilancia comunitaria.',
  'Protección hídrica',
  'Bogotá D.C.',
  'Valle del Cauca',
  'public',
  false,
  timestamptz '2026-04-15 14:00:00-05',
  timestamptz '2026-04-15 17:00:00-05'
where not exists (
  select 1 from public.events where slug = 'audiencia-proteccion-rio-anchicaya-2026'
);
