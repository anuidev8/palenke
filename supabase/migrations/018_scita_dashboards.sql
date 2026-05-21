create table if not exists public.scita_dashboards (
  id uuid primary key default gen_random_uuid(),
  module_key text not null
    check (module_key in ('gobierno', 'conservacion', 'titulacion')),
  title text not null,
  short_label text not null,
  description text not null,
  detail_description text not null,
  detail_bullets jsonb not null default '[]'::jsonb,
  iframe_title text not null,
  embed_url text not null,
  embed_width numeric not null default 600,
  embed_height numeric not null default 373.5,
  footer_crop_px integer not null default 56,
  icon_src text not null,
  visibility text not null default 'public'
    check (visibility in ('public', 'internal')),
  status text not null default 'active'
    check (status in ('active', 'draft', 'disabled')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_key, visibility)
);

create index if not exists scita_dashboards_sort_idx
  on public.scita_dashboards (sort_order asc, module_key asc);

alter table public.scita_dashboards enable row level security;

drop policy if exists scita_dashboards_public_read on public.scita_dashboards;
create policy scita_dashboards_public_read on public.scita_dashboards
  for select using (
    visibility = 'public'
    and status = 'active'
  );

drop policy if exists scita_dashboards_internal_read on public.scita_dashboards;
create policy scita_dashboards_internal_read on public.scita_dashboards
  for select using (
    status = 'active'
    and exists (
      select 1
      from public.users u
      where u.id = auth.uid()
        and u.role in ('internal', 'admin')
        and u.active = true
    )
  );

drop policy if exists scita_dashboards_admin_all on public.scita_dashboards;
create policy scita_dashboards_admin_all on public.scita_dashboards
  for all using (
    exists (
      select 1
      from public.users u
      where u.id = auth.uid()
        and u.role = 'admin'
        and u.active = true
    )
  );

insert into public.scita_dashboards (
  module_key,
  title,
  short_label,
  description,
  detail_description,
  detail_bullets,
  iframe_title,
  embed_url,
  embed_width,
  embed_height,
  footer_crop_px,
  icon_src,
  visibility,
  status,
  sort_order
) values
(
  'gobierno',
  'Instrumentos de Gobierno Propio',
  'Gobierno propio',
  'Reglamentos, normas internas y planes de etnodesarrollo comunitario.',
  'Este tablero consolida la información de reglamentos comunitarios, planes de uso y planes de etnodesarrollo para identificar avances, brechas y prioridades de gobernanza. Permite comparar territorios, fortalecer la toma de decisiones internas y sustentar procesos organizativos con evidencia territorial para escenarios de planificación anual y rendición comunitaria.',
  '["Cobertura: consejos comunitarios, instrumento vigente, estado de adopción y nivel de actualización.","Lectura principal: qué territorios tienen avances normativos robustos y cuáles requieren acompañamiento técnico o jurídico.","Cruce sugerido: relacionar instrumentos con conflictos de uso del suelo, presión extractiva y alertas territoriales.","Uso político: preparar reuniones con autoridades, asambleas y mesas interinstitucionales con evidencia consolidada."]'::jsonb,
  'P_Instrumentos de Gobierno Propio',
  'https://app.powerbi.com/view?r=eyJrIjoiZjljZDMxZjMtMjNhNS00ZGMzLTgwMTYtY2E5YzM4ZGNhNjE5IiwidCI6ImNlODUzNmFiLWYzOTktNGZiYS04MWQ1LTgwZDc0ZWVlOTk5ZCIsImMiOjR9',
  600,
  373.5,
  56,
  '/assets/scita/icons/icon-gobierno.png',
  'public',
  'active',
  10
),
(
  'gobierno',
  'Instrumentos de Gobierno Propio (interno)',
  'Gobierno propio',
  'Vista ampliada para equipo Palenke: reglamentos, normas y etnodesarrollo con mayor detalle.',
  'Tablero interno con indicadores y cruces no expuestos en la versión pública. Uso exclusivo para acompañamiento técnico, coordinación territorial y preparación de incidencia con consejos comunitarios.',
  '["Acceso restringido a usuarios internos y administradores.","Incluye desagregaciones y filtros adicionales respecto al tablero público.","No compartir capturas ni enlaces fuera del equipo autorizado."]'::jsonb,
  'I_Instrumentos de Gobierno Propio',
  'https://app.powerbi.com/view?r=eyJrIjoiZTNmNmZjMzAtMTJhOS00YTEzLTljYTAtYjIxNGY0YjRhZGY4IiwidCI6ImNlODUzNmFiLWYzOTktNGZiYS04MWQ1LTgwZDc0ZWVlOTk5ZCIsImMiOjR9',
  600,
  373.5,
  56,
  '/assets/scita/icons/icon-gobierno.png',
  'internal',
  'active',
  11
),
(
  'conservacion',
  'Áreas de Conservación Comunitaria',
  'Conservación',
  'Figuras de protección, biodiversidad y seguimiento territorial de ecosistemas.',
  'Este módulo muestra el estado de las áreas de conservación comunitaria, la distribución de ecosistemas estratégicos y señales de presión ambiental en el territorio. Su lectura facilita priorizar acciones de protección, monitoreo y control comunitario sobre bosques, cuencas y zonas de alta importancia biocultural en ventanas de seguimiento mensual y trimestral.',
  '["Cobertura: áreas bioculturales, cuencas priorizadas, cobertura boscosa y puntos críticos de presión.","Lectura principal: identificar dónde se concentra la amenaza y qué zonas mantienen mayor resiliencia ecológica.","Cruce sugerido: contrastar cambios de cobertura con reportes de campo y eventos climáticos recientes.","Uso operativo: priorizar brigadas comunitarias, rutas de verificación y medidas de restauración temprana."]'::jsonb,
  'P_Áreas de Conservación Comunitaria',
  'https://app.powerbi.com/view?r=eyJrIjoiNTk3NmZlYmMtN2U2NS00NTFkLWEzOTEtZjAzNTg0ZTZhNjU2IiwidCI6ImNlODUzNmFiLWYzOTktNGZiYS04MWQ1LTgwZDc0ZWVlOTk5ZCIsImMiOjR9',
  600,
  373.5,
  56,
  '/assets/scita/icons/icon-conservacion.png',
  'public',
  'active',
  20
),
(
  'conservacion',
  'Áreas de Conservación Comunitaria (interno)',
  'Conservación',
  'Vista ampliada para equipo Palenke: presión ambiental, cuencas y figuras de protección con mayor detalle.',
  'Tablero interno con indicadores y cruces no expuestos en la versión pública. Uso exclusivo para acompañamiento técnico, monitoreo comunitario y priorización de brigadas territoriales.',
  '["Acceso restringido a usuarios internos y administradores.","Incluye desagregaciones adicionales respecto al tablero público.","Actualizar embed_url con el enlace I_ de Power BI en /admin/dashboards."]'::jsonb,
  'I_Áreas de Conservación Comunitaria',
  'https://app.powerbi.com/view?r=eyJrIjoiNTk3NmZlYmMtN2U2NS00NTFkLWEzOTEtZjAzNTg0ZTZhNjU2IiwidCI6ImNlODUzNmFiLWYzOTktNGZiYS04MWQ1LTgwZDc0ZWVlOTk5ZCIsImMiOjR9',
  600,
  373.5,
  56,
  '/assets/scita/icons/icon-conservacion.png',
  'internal',
  'active',
  21
),
(
  'titulacion',
  'Titulación Colectiva De Comunidades Negras',
  'Titulación colectiva',
  'Consejos comunitarios y territorios colectivos en trámite y adjudicación.',
  'Este tablero presenta el comportamiento de procesos de titulación colectiva por consejo comunitario y por estado del trámite, visibilizando avances y rezagos. Sirve para orientar incidencia jurídica y política, respaldar gestiones institucionales y dar seguimiento a la garantía efectiva de derechos territoriales en ciclos de gestión ante entidades públicas.',
  '["Cobertura: expedientes por territorio, fase del trámite, tiempos acumulados y estado administrativo.","Lectura principal: detectar cuellos de botella en procesos de adjudicación y formalización colectiva.","Cruce sugerido: comparar avance de titulación con presión territorial y conflictividad local.","Uso estratégico: sustentar acciones de incidencia, seguimiento legal y priorización de casos urgentes."]'::jsonb,
  'P_Titulación Colectiva De Comunidades Negras',
  'https://app.powerbi.com/view?r=eyJrIjoiZjZlYzMzZDctNDcwMy00Zjc5LTg1ZjUtODRjYTYzZGZkZGE4IiwidCI6ImNlODUzNmFiLWYzOTktNGZiYS04MWQ1LTgwZDc0ZWVlOTk5ZCIsImMiOjR9',
  600,
  373.5,
  56,
  '/assets/scita/icons/icon-titulacion.png',
  'public',
  'active',
  30
),
(
  'titulacion',
  'Titulación Colectiva De Comunidades Negras (interno)',
  'Titulación colectiva',
  'Seguimiento detallado de trámites y expedientes para uso del equipo técnico.',
  'Tablero interno para análisis de rezagos, tiempos de gestión y priorización de casos con información no publicada en la versión abierta.',
  '["Acceso restringido a usuarios internos y administradores.","Útil para mesas técnicas y seguimiento jurídico con entidades.","No difundir fuera de canales autorizados del equipo."]'::jsonb,
  'I_Titulación Colectiva De Comunidades Negras',
  'https://app.powerbi.com/view?r=eyJrIjoiZGQ5NTRjNmEtMjlhYi00YzAyLWFiZDgtMWZkZTE4MDFjNDcxIiwidCI6ImNlODUzNmFiLWYzOTktNGZiYS04MWQ1LTgwZDc0ZWVlOTk5ZCIsImMiOjR9',
  600,
  373.5,
  56,
  '/assets/scita/icons/icon-titulacion.png',
  'internal',
  'active',
  31
)
on conflict (module_key, visibility) do update set
  title = excluded.title,
  short_label = excluded.short_label,
  description = excluded.description,
  detail_description = excluded.detail_description,
  detail_bullets = excluded.detail_bullets,
  iframe_title = excluded.iframe_title,
  embed_url = excluded.embed_url,
  embed_width = excluded.embed_width,
  embed_height = excluded.embed_height,
  footer_crop_px = excluded.footer_crop_px,
  icon_src = excluded.icon_src,
  status = excluded.status,
  sort_order = excluded.sort_order,
  updated_at = now();
