# Plataforma Palenke

Portal web del Palenke (Next.js App Router): experiencia pública rica en contenido (MVP) y un **flujo operativo `plan_instrumentos`** conectado a **Supabase** (autenticación, Postgres, Storage y revisiones admin verificadas).

## Qué hay en el código

### Contenido y navegación (MVP)

- **Inicio** y tarjetas hacia módulos temáticos (SCITA, gobierno propio, memoria, noticias, etc.).
- **Gobierno propio / instrumentos** (`/gobierno-propio`, `/gobierno-propio/[instrumento]`): fichas por instrumento (reglamentos, planes de uso, litigio, conservación, …) con UI específica por nivel de acceso (`AdminGatedUI`, `CoordinationGatedUI`).
- **Biblioteca Base** (`/biblioteca`, `/biblioteca/[slug]`): documentos definidos en `src/lib/mock-data.ts`; descargas **internas** pueden usar URLs firmadas cuando Supabase está configurado.
- **Memoria afroterritorial**, **mujeres, juventudes y niñez**, **incidencias**, **estadísticas**, **SCITA**, **geoportal** (enlace externo), **política de datos**, **accesibilidad**, **noticias** (newsroom), y pantallas **admin** de demostración (contenido visual, campañas, usuarios, documentos, ACCs, tableros) — en su mayoría **datos mock** y formularios de preview, no un CMS completo.

### Búsqueda y contenido generado

- **Búsqueda asistida en biblioteca** (`src/lib/ai-search.ts`): ranking heurístico sobre el catálogo mock (sin llamada obligatoria a un LLM).
- **Contenido visual admin** (`/admin/contenido-visual`, API `/api/admin/visual-content/*`): generación opcional con **Google Gen AI** si configuras `GEMINI_API_KEY` (protegida por el middleware de admin).

### Flujo `plan_instrumentos` (Supabase)

Implementado de extremo a extremo y documentado en `docs/plan_instrumentos_*.md`:

| Pieza | Descripción |
|--------|-------------|
| **Solicitudes de acceso** | Formulario en `/solicitar-acceso/[instrumento]` → `POST /api/access-requests` (validación Zod) → tabla `public.access_requests`. |
| **Correo (opcional)** | **n8n** vía `N8N_EMAIL_WEBHOOK_URL`: notificación a admin o coordinación al crear solicitud; aprobación, rechazo y enlace firmado cuando aplica. Sin esa variable el flujo de DB sigue; el envío queda en modo degradado. |
| **Revisión admin** | `/admin/solicitudes`, detalle `/admin/solicitudes/[id]`: aprobar / rechazar vía server actions (`approveRequest` / `rejectRequest`). |
| **Aprobación `admin`** | Invitación / aprovisionamiento en Auth y fila `role: internal` en `public.users`. |
| **Aprobación `coordination`** | Entrega por correo de URL firmada al material **sensible** del instrumento cuando hay archivo en Storage. |
| **Documentos y descarga** | Metadatos en `public.documents` + archivos en buckets **privados** `docs-internal` y `docs-sensitive`. API `GET /api/documents/[id]/signed-url` valida sesión, rol en `users`, **y** solicitud aprobada para internos en documentos no públicos. Documentos **sensible**: respuesta `204` y enlace enviado solo por correo (no en JSON). |

## Lógica de acceso (resumen)

### Roles en base de datos (`public.users`)

- **`public`**, **`internal`**, **`admin`** (campo `active` puede desactivar la cuenta).
- **RLS en `documents`**: `public` visible para consulta según políticas; `internal` requiere usuario interno/admin activo; `sensitive` solo admin en política directa — la app refuerza además **solicitud aprobada** para quienes no son admin al usar la API de descarga.

### Middleware (`src/middleware.ts`)

- Aplica solo a **`/admin/*`** y **`/api/admin/*`**.
- Exige sesión Supabase y **`users.role === 'admin'`** y **`active !== false`**; si no, redirección a login o `/acceso-restringido`.

### Modo “vista previa” del MVP (`?role=`)

- Gran parte del sitio usa **`getViewerRole(searchParams)`** (`src/lib/viewer.ts`) con `?role=internal` o `?role=admin` para simular qué ve cada perfil **sin** Supabase.
- Con Supabase configurado, **`getViewerRoleFromSession()`** (`src/lib/viewer-server.ts`) resuelve el rol real para piezas que lo usan (por ejemplo revisiones y acciones admin internas).
- Iniciar sesión con Supabase **no** añade automáticamente `?role=` en la URL; algunas páginas que solo miran query params pueden seguir comportándose como “público” hasta alinear sesión y UI (área a mejorar si se unifica todo el portal con Auth).

### Geoportal (`/geoportal`)

- Requiere rol **internal o admin** en el modelo MVP actual (vía `?role=` o enlaces del sitio que lo conservan).
- Tras login real, conviene enlazar con `withRole("/geoportal", …)` o unificar con sesión como en otras rutas.

## Stack

- Next.js `16.1.6`
- React `19.2.3`
- TypeScript
- Tailwind CSS v4
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- Zod
- n8n webhook (correo opcional)
- `@google/genai` (contenido visual admin opcional)

## Requisitos

- Node.js 20+
- npm 10+
- Proyecto Supabase
- Buckets **privados** en Supabase Storage: `docs-internal`, `docs-sensitive`

## Variables de entorno

Parte de `.env.example`:

```bash
GEMINI_API_KEY=""   # opcional: generación visual en admin

NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

# Opcionales para correo (sin ellos, persistencia y acciones admin siguen; envío degradado)
N8N_EMAIL_WEBHOOK_URL=""
ADMIN_EMAIL="admin@palenke.org"
COORDINATOR_EMAIL="coordinacion@palenke.org"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Notas:

- La clave publicable de Supabase es la del cliente (frontend); el **service role** solo en servidor (API, scripts, actions).
- Para SQL manual en el Dashboard no necesitas CLI; para migraciones remotas vía CLI, token y proyecto enlazados (`docs/plan_instrumentos_remote_migrations.md`).

## Instalación y ejecución local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Migraciones SQL (remoto)

En el SQL Editor de Supabase, en orden:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_seed_documents.sql`

Detalle: `docs/plan_instrumentos_remote_migrations.md`.

## Comandos operativos `plan_instrumentos`

```bash
npm run sync:plan-instrumentos-storage:dry
npm run sync:plan-instrumentos-storage
npm run sync:plan-instrumentos-storage:verify
npm run sync:plan-instrumentos-storage:verify-db
npm run verify:plan-instrumentos-auth-e2e
npm run verify:plan-instrumentos-admin-actions-e2e
```

Runbook: `docs/plan_instrumentos_phase4_runbook.md` · Avance: `docs/plan_instrumentos_progress.md`.

## Rutas útiles

| Área | Ruta |
|------|------|
| Inicio | `/` |
| Login | `/login` |
| Solicitar acceso | `/solicitar-acceso/[instrumento]` |
| Admin solicitudes | `/admin/solicitudes`, `/admin/solicitudes/[id]` |
| API descarga | `/api/documents/[id]/signed-url` (query `mode=redirect` opcional) |
| API solicitudes | `POST /api/access-requests` |
| Biblioteca | `/biblioteca`, `/biblioteca/[slug]` |
| Gobierno propio | `/gobierno-propio`, `/gobierno-propio/[instrumento]` |
| Geoportal | `/geoportal` |
| Admin (mock + visual con Gemini) | `/admin`, `/admin/contenido-visual`, … |

## Estructura principal

```txt
src/
  app/
    admin/              # CMS demo + solicitudes (real) + APIs admin
    api/
      access-requests/
      documents/
      admin/
    solicitar-acceso/
    biblioteca/
    gobierno-propio/
    login/
  components/
    auth/
    palenke/
    mock/
  lib/
    access-requests.ts
    admin-access.ts
    config.ts
    email.ts
    email-templates.ts
    mock-data.ts
    viewer.ts
    viewer-server.ts
    supabase/
    schemas/
middleware.ts
supabase/migrations/
docs/plan_instrumentos_*.md
scripts/
  upload-plan-instrumentos-storage.mjs
  verify-plan-instrumentos-auth-e2e.mjs
  verify-plan-instrumentos-admin-actions-e2e.mjs
```

## Calidad

```bash
npm run lint
npx tsc --noEmit
```

## Alcance pendiente / matiz

- **`plan_instrumentos`**: flujo listo para producción con Supabase según el runbook.
- **Resto del portal**: gran superficie sigue en **mock** o preview (catalogación en código, admin de demostración). Unificar **siempre** el rol de sesión Supabase con las páginas que hoy solo miran `?role=` es trabajo futuro si se exige una sola fuente de verdad en todo el sitio.
