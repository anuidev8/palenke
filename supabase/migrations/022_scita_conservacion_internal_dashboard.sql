-- Tablero interno (I_) de Conservación — faltaba en el seed inicial.
-- Sustituye embed_url por la URL publish-to-web del informe I_ cuando el equipo la tenga.

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
