-- Permite varios tableros por módulo y visibilidad (p. ej. dos internos en Conservación).
alter table public.scita_dashboards
  drop constraint if exists scita_dashboards_module_key_visibility_key;

create unique index if not exists scita_dashboards_iframe_title_key
  on public.scita_dashboards (iframe_title);

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
  'conservacion',
  'Caracterización – Recurso Hídrico (ZC-SA)',
  'Recurso hídrico',
  'Caracterización hidrológica y seguimiento de recurso hídrico en la zona de conservación (uso interno).',
  'Tablero interno de caracterización del recurso hídrico en el ámbito ZC-SA. Consolida indicadores, puntos de monitoreo y lecturas territoriales para acompañamiento técnico del equipo Palenke y aliados autorizados.',
  '["Acceso restringido (PRIVADO): usuarios internos y administradores.","Cruce sugerido: áreas de conservación, cuencas y reportes de campo hidráulicos.","No compartir capturas ni enlaces fuera del equipo autorizado."]'::jsonb,
  'I_Caracterizacion - Recurso Hidrico ZC SA',
  'https://app.powerbi.com/view?r=eyJrIjoiZWQwN2I2ZTktZTg5OC00ODdjLTgxOTAtMDk2NTk4MjI5ZGRiIiwidCI6ImNlODUzNmFiLWYzOTktNGZiYS04MWQ1LTgwZDc0ZWVlOTk5ZCIsImMiOjR9',
  600,
  373.5,
  56,
  '/assets/scita/icons/icon-conservacion.png',
  'internal',
  'active',
  22
)
on conflict (iframe_title) do update set
  module_key = excluded.module_key,
  title = excluded.title,
  short_label = excluded.short_label,
  description = excluded.description,
  detail_description = excluded.detail_description,
  detail_bullets = excluded.detail_bullets,
  embed_url = excluded.embed_url,
  embed_width = excluded.embed_width,
  embed_height = excluded.embed_height,
  footer_crop_px = excluded.footer_crop_px,
  icon_src = excluded.icon_src,
  visibility = excluded.visibility,
  status = excluded.status,
  sort_order = excluded.sort_order,
  updated_at = now();
