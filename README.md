# Plataforma Palenke - MVP Fase 1

Mock interactivo del portal del **Palenke de Pensamiento y Cuidadores del Territorio / PCN**, construido con Next.js (App Router) para validar estructura, flujos de roles y capacidades de gestion antes de integrar backend real.

Este repositorio implementa:
- Portal publico/interno con control de visibilidad por rol.
- Biblioteca documental con filtros.
- Agenda de Mujeres, Juventudes y Ninez (MJN).
- Catalogo de tableros (Power BI embed).
- Punto de entrada al geoportal externo.
- Panel administrativo completo (documentos, dashboards, ACCs, usuarios y campanas).

## 1. Stack tecnico

- Next.js `16.1.6` (App Router)
- React `19.2.3`
- TypeScript estricto
- Tailwind CSS v4
- ESLint (config Next.js Core Web Vitals + TypeScript)
- Fuentes: `Fraunces` + `Public Sans` via `next/font/google`

## 2. Naturaleza del proyecto (importante)

Este MVP es **frontend mock funcional**:
- No hay autenticacion real ni API conectada.
- No hay base de datos.
- Los datos viven en [`src/lib/mock-data.ts`](./src/lib/mock-data.ts).
- El comportamiento de roles se simula por query string.

El blueprint funcional base esta en:
- [`docs/Palenke mvp mockup blueprint.md`](./docs/Palenke%20mvp%20mockup%20blueprint.md)

## 3. Roles y visibilidad

### Roles soportados
- `public`
- `internal`
- `admin`

### Simulacion de sesion por URL

El rol se define con `?role=`:
- `?role=public` (o sin parametro)
- `?role=internal`
- `?role=admin`

Ejemplos:
- `http://localhost:3000/`
- `http://localhost:3000/?role=internal`
- `http://localhost:3000/admin?role=admin`

### Configuracion opcional (Geoportal)

Puedes configurar la URL externa del geoportal via entorno:

```bash
NEXT_PUBLIC_GEOPORTAL_URL="https://tu-geoportal.ejemplo"
```

Si no se define, el mock usa `https://example.com/geoportal`.

### Reglas de visibilidad implementadas

- `public`: visible para todos.
- `internal`: visible solo para `internal` y `admin`.
- `sensitive`: no se publica en frontend publico/interno (solo aparece en gestion admin de documentos).

Logica central:
- [`src/lib/viewer.ts`](./src/lib/viewer.ts)
- [`src/lib/mock-data.ts`](./src/lib/mock-data.ts)
- [`src/lib/admin-access.ts`](./src/lib/admin-access.ts)

## 4. Funcionalidades implementadas por modulo

### Home (`/`)
- Hero + presentacion institucional.
- Accesos rapidos a Biblioteca, MJN, Estadisticas y Geoportal.
- Muestra campanas activas segun rol y placement.
- Banner de acceso denegado cuando un no-admin intenta abrir `/admin`.

### Biblioteca Base (`/biblioteca`)
- Filtros:
  - Busqueda libre (`q`)
  - Seccion (`section`, multi-select)
  - Territorio (`territory`)
  - Tipo de instrumento (`type`)
  - Ano (`year`)
  - Enfoque de genero (`gender=1`)
- Chips de filtros activos y limpieza individual/global.
- Estado de carga simulado (`state=loading`).
- Estado vacio con CTA.
- Tarjetas con badges de visibilidad.

### Detalle de documento (`/biblioteca/[slug]`)
- Breadcrumbs + metadatos completos.
- Keywords, tipo de accion (archivo/enlace/video).
- Proteccion por visibilidad:
  - `sensitive` -> `404`
  - `internal` sin sesion -> redireccion a `/acceso-restringido`
- Aviso especial para contenidos con `riskFlag`.

### Mujeres, Juventudes y Ninez (`/mujeres-juventudes-ninez`)
- Hero editorial.
- Bloque de contexto politico editable + cita destacada.
- Subfiltros de documentos MJN por tab:
  - `all`
  - `litigio`
  - `pedagogico`
  - `memorias`
- Historias autorizadas (audio/video/texto/foto).
- Campanas activas de placement MJN.

### Detalle de campana (`/mujeres-juventudes-ninez/campanas/[slug]`)
- Portada, cuerpo narrativo y fechas.
- Lista de materiales descargables/visuales.
- Solo campanas activas.
- Respeta visibilidad `public/internal`.

### Estadisticas (`/estadisticas`)
- Catalogo de dashboards con filtros:
  - Tema (`topic`)
  - Territorio (`territory`)
- Estado de carga simulado (`state=loading`).
- Estado vacio.
- Aviso de que la analitica fuente vive en SIG/Power BI.

### Detalle de dashboard (`/estadisticas/[slug]`)
- Embed de Power BI via `iframe`.
- Estados simulados:
  - `iframe=loading`
  - `iframe=timeout`
- Proteccion de visibilidad por rol.

### Geoportal (`/geoportal`)
- Acceso solo `internal/admin`.
- Si rol publico -> redireccion a login con contexto.
- No almacena datos espaciales; solo enlaza al sistema fuente.

### Autenticacion mock
- `/login`
  - Estado de error (`state=error`)
  - Estado de cuenta desactivada (`state=disabled`)
  - Estado cargando (`state=loading`)
  - Botones para entrar como `internal` o `admin` sin backend
- `/recuperar-contrasena`
  - Estado de exito (`state=success`)
- `/acceso-restringido`
  - Pantalla intermedia para contenido protegido

### Legal y errores
- `/politica-de-datos`: politica resumida del MVP.
- `not-found.tsx`: pagina 404 custom.

## 5. Panel administrativo (`/admin`)

Acceso restringido a rol `admin` con guard:
- Si no es admin -> redireccion a `/?notice=admin-denied`.

### Secciones incluidas

- **Inicio** (`/admin`)
  - KPIs rapidos (documentos, dashboards, ACCs, usuarios)
  - Actividad reciente
  - Accesos directos a creacion

- **Documentos** (`/admin/documentos`)
  - Listado completo incluyendo `sensitive`
  - Filtros por busqueda, seccion, visibilidad y territorio
  - Formulario de crear/editar con:
    - metadatos
    - enfoque de genero/MJN
    - carga o URL
    - reglas de visibilidad y advertencias de riesgo

- **Dashboards** (`/admin/dashboards`)
  - Listado con filtros por tema/visibilidad
  - Estado del tablero (Activo / En actualizacion / Desactivado temporalmente)
  - Formulario de crear/editar con URL embed + previsualizacion

- **ACCs** (`/admin/accs`)
  - Listado con filtros por busqueda/territorio
  - Formulario de crear/editar con:
    - metadatos territoriales
    - vinculo opcional a geoportal
    - vinculo a dashboard y documentos
    - bandera Meta 30x30
    - visibilidad publica/interna

- **Usuarios** (`/admin/usuarios`)
  - Listado con filtros por busqueda/rol
  - Estado activa/desactivada
  - Formulario de crear/editar:
    - rol (Admin/Interno)
    - admin principal
    - contrasena temporal (alta)
    - reset (edicion)

- **Campanas** (`/admin/campanas`)
  - Listado de campanas con estado/visibilidad/placement
  - Formulario de crear/editar:
    - portada
    - intro y materiales
    - fechas
    - ubicacion (home, MJN, biblioteca, todas)
    - visibilidad + estado activa

## 6. Mapa de rutas

### Publico/interno
- `/`
- `/biblioteca`
- `/biblioteca/[slug]`
- `/mujeres-juventudes-ninez`
- `/mujeres-juventudes-ninez/campanas/[slug]`
- `/estadisticas`
- `/estadisticas/[slug]`
- `/geoportal`
- `/login`
- `/recuperar-contrasena`
- `/acceso-restringido`
- `/politica-de-datos`

### Admin
- `/admin`
- `/admin/documentos`
- `/admin/documentos/nuevo`
- `/admin/documentos/[id]/editar`
- `/admin/dashboards`
- `/admin/dashboards/nuevo`
- `/admin/dashboards/[id]/editar`
- `/admin/accs`
- `/admin/accs/nuevo`
- `/admin/accs/[id]/editar`
- `/admin/usuarios`
- `/admin/usuarios/nuevo`
- `/admin/usuarios/[id]/editar`
- `/admin/campanas`
- `/admin/campanas/nueva`
- `/admin/campanas/[id]/editar`

## 7. Datos mock incluidos

Definidos en [`src/lib/mock-data.ts`](./src/lib/mock-data.ts):
- 7 documentos
- 3 campanas (incluye activa/inactiva y publica/interna)
- 3 dashboards
- 3 ACCs
- 4 usuarios
- 4 historias MJN
- actividad reciente + textos editoriales y legales

## 8. Estados de demostracion por query params

Ejemplos utiles para QA visual:

- Home con aviso admin denegado:
  - `/?notice=admin-denied`
- Biblioteca cargando:
  - `/biblioteca?state=loading`
- Estadisticas cargando:
  - `/estadisticas?state=loading`
- Dashboard en loading/timeout:
  - `/estadisticas/biodiversidad-cuenca-naya?iframe=loading`
  - `/estadisticas/biodiversidad-cuenca-naya?iframe=timeout`
- Login con error/deshabilitada/loading:
  - `/login?state=error`
  - `/login?state=disabled`
  - `/login?state=loading`
- Recuperacion exitosa:
  - `/recuperar-contrasena?state=success`
- Tabs MJN:
  - `/mujeres-juventudes-ninez?tab=litigio`
  - `/mujeres-juventudes-ninez?tab=pedagogico`
  - `/mujeres-juventudes-ninez?tab=memorias`

Recuerda anadir `&role=internal` o `&role=admin` cuando quieras simular sesion.

## 9. Estructura del proyecto

```txt
src/
  app/                       # Rutas App Router
  components/mock/           # UI reusable y formularios admin mock
  lib/
    mock-data.ts             # Dataset y tipos principales
    mock-queries.ts          # Filtros de biblioteca/dashboards
    viewer.ts                # Rol, visibilidad y utilidades URL
    admin-access.ts          # Guard de acceso admin
docs/
  Palenke mvp mockup blueprint.md
```

## 10. Ejecutar en local

### Requisitos
- Node.js 20+ recomendado
- npm 10+ recomendado

### Instalacion
```bash
npm install
```

### Desarrollo
```bash
npm run dev
```
Abrir `http://localhost:3000`.

### Lint
```bash
npm run lint
```

### Build de produccion
```bash
npm run build
npm run start
```

## 11. Alcance y proximos pasos sugeridos

Al ser MVP mock, faltan integraciones productivas:
- autenticacion real y sesiones seguras
- API/backend persistente
- almacenamiento de archivos/documentos
- permisos por usuario real (no por query string)
- auditoria y trazabilidad de cambios
- tests automaticos (unit/integration/e2e)

Este repositorio deja resuelta la base de navegacion, informacion, diseno y flujo de gestion para avanzar a implementacion backend.
