# Plataforma Palenke - Documentacion Tecnica MVP

Version: 1.0  
Fecha: 2026-05-04  
Estado: Base tecnica para MVP (Fase 1)

## 1) Objetivo

Este documento describe como funciona la plataforma Palenke en su estado MVP, con enfoque en:

- arquitectura tecnica real del proyecto;
- modulos funcionales principales;
- estrategia de roles y visibilidad;
- flujo de acceso a documentos internos/sensibles;
- operacion basica y siguientes pasos hacia Fase 2.

## 2) Resumen de la plataforma

Palenke es una infraestructura digital para el PCN orientada a:

- gestionar contenidos territoriales y de gobernanza;
- proteger acceso segun nivel de sensibilidad;
- conectar biblioteca, memoria, estadisticas y geoportal;
- habilitar operacion editorial y administrativa.

## 3) Arquitectura MVP

### 3.1 Stack base

- Frontend y servidor: Next.js App Router + React + TypeScript
- Estilos: Tailwind CSS v4
- Datos y seguridad: Supabase (Auth, Postgres, Storage)
- Validaciones: Zod
- Integraciones: Power BI embebido por URL, geoportal externo, webhook n8n opcional para correo

### 3.2 Componentes principales

- Capa web publica e interna en rutas `src/app/*`
- API routes para operaciones de acceso y descarga controlada
- Middleware para proteccion de `/admin/*`
- Base de datos para usuarios, roles, documentos y solicitudes
- Buckets privados para archivos restringidos

### 3.3 Decision de arquitectura (MVP)

- Se mantiene experiencia modular del portal.
- Se aplica control por rol en backend para rutas criticas.
- Se evita almacenar capas SIG crudas en la plataforma (geoportal permanece externo).

## 4) Modulos MVP y alcance operativo

1. Inicio (`/`): presentacion institucional, navegacion principal, campañas visibles por rol.
2. Biblioteca (`/biblioteca`): consulta documental con niveles de visibilidad.
3. Gobierno propio (`/gobierno-propio`): instrumentos y rutas por tipo.
4. MJN (`/mujeres-juventudes-ninez`): contenidos de memoria y accion politica.
5. Estadisticas (`/estadisticas`): tableros via Power BI.
6. SCITA (`/scita`): informacion territorial y capas de lectura comunitaria.
7. Geoportal (`/geoportal`): acceso restringido por rol, motor geoespacial externo.
8. Admin (`/admin/*`): gestion operativa de contenidos y solicitudes.

## 5) Seguridad territorial digital

### 5.1 Roles

- `public`: acceso abierto a contenido publico.
- `internal`: acceso autenticado a contenido interno.
- `admin`: gestion de contenidos, usuarios y aprobaciones.

### 5.2 Niveles de visibilidad

- `public`: visible sin login.
- `internal`: requiere sesion valida y permisos.
- `sensitive`: no se expone en frontend publico.

### 5.3 Proteccion tecnica

- `src/middleware.ts` protege rutas admin.
- API de signed URL valida sesion, rol y aprobacion de solicitud.
- Documentos sensibles se entregan con control adicional (no exposicion directa).

## 6) Flujo critico: solicitud y entrega de documentos

1. Usuario solicita acceso en `/solicitar-acceso/[instrumento]`.
2. API valida payload y guarda solicitud en `public.access_requests`.
3. Admin revisa en `/admin/solicitudes` y aprueba/rechaza.
4. Si aplica, el sistema habilita acceso interno o entrega controlada.
5. Descarga de documento restringido ocurre via signed URL temporal.

Resultado: trazabilidad del acceso y reduccion de exposicion de datos sensibles.

## 7) Infraestructura y operacion

### 7.1 Variables de entorno clave

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `N8N_EMAIL_WEBHOOK_URL` (opcional)
- `ADMIN_EMAIL` y `COORDINATOR_EMAIL` (opcionales)

### 7.2 Storage

Buckets privados usados por el flujo:

- `docs-internal`
- `docs-sensitive`

### 7.3 Comandos operativos relevantes

- `npm run sync:plan-instrumentos-storage`
- `npm run sync:plan-instrumentos-storage:verify`
- `npm run sync:plan-instrumentos-storage:verify-db`
- `npm run verify:plan-instrumentos-auth-e2e`
- `npm run verify:plan-instrumentos-admin-actions-e2e`

## 8) MVP vs Fase 2 (resumen)

### MVP (Fase 1)

- portal modular por bloques activos/construccion;
- visibilidad publico/internal/sensitive;
- dashboards Power BI por URL embebida;
- acceso geoportal por rol sin replicar SIG;
- CRUD base de documentos y metadatos.

### Fase 2

- taxonomias mas profundas;
- flujo editorial completo (borrador, revision, publicado);
- modulo ACC extendido;
- modulo de incidencia politica ampliado;
- auditoria y versionado de contenidos estrategicos.

## 9) Riesgos y recomendaciones

1. Unificar toda la experiencia de rol en sesion real (evitar mezcla con query params en vistas legacy).
2. Consolidar documentacion por modulo con plantilla unica.
3. Mantener runbooks de operacion sincronizados con cambios de DB/migraciones.
4. Definir politicas de respaldo y continuidad operacional por entorno.

## 10) Referencias tecnicas del repositorio

- `README.md`
- `docs/plan-modulos-fase1-index.md`
- `docs/plan_instrumentos_phase4_runbook.md`
- `docs/plan_instrumentos_progress.md`
- `docs/plan-usuarios-roles-cuentas.md`
- `docs/pagina-inicial-presentacion/technical-design.md`
- `src/app/page.tsx`
- `src/app/mockups/sat-palenke/page.tsx`
- `src/middleware.ts`
- `src/app/api/access-requests/route.ts`
- `src/app/api/documents/[id]/signed-url/route.ts`

