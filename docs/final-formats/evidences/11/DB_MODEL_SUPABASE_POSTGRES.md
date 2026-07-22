# Anexo — Modelo de base de datos (obligación 11)

**Producto contractual:** documentación técnica básica  
**Fuente completa:** `docs/technical/palenke-mvp-technical-documentation.md` (sección **3A**)

## Qué tipo de DB es

- **Motor:** PostgreSQL (base de datos **relacional** / RDBMS)
- **Plataforma:** Supabase (Postgres gestionado + Auth + Storage + RLS)
- **No es:** MongoDB, data warehouse ni geodatabase SIG

## Por qué

- Relaciones claras entre usuarios, documentos, solicitudes y permisos
- Seguridad por fila (RLS) alineada a roles `public` / `internal` / `admin`
- Archivos en Storage; metadatos en tablas
- Esquema versionado en `supabase/migrations/`

## Tablas clave

`users`, `documents`, `access_requests`, `document_download_grants`, `internal_news`, `events`, `scita_dashboards`, `scita_reports`, `contact_messages`, `admin_activity_log`

## Buckets Storage

`docs-public`, `docs-internal`, `docs-sensitive`, `mediateca-ubuntu`, `memoria-afroterritorial`, `scita-evidence`

## Fuera de esta DB (alcance)

- Geoportal SIG completo → **siguiente etapa** (no cierre MVP)
- Modelos Power BI → servicio Power BI; aquí solo URLs/metadatos en `scita_dashboards`
