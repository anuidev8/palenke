# Gap Analysis Fase 1: Área interna – Usuarios, roles y cuentas

**Módulo:** 13 · Área interna – Usuarios, roles y cuentas  
**Fecha:** 11 de marzo de 2026  
**Fuente principal:** `docs/Plataforma Palenke_ Propuesta_fases_final.pdf`  
**Secciones del PDF usadas:** 2.1, 2.5, 3.1 y 4  
**Base de comparación:** implementación actual del mock en Next.js

---

## 0. Criterio de este análisis

- Este análisis compara el PDF de Fase 1 con la implementación actual del repositorio.
- El repositorio actual es un **mock funcional de frontend**. Por eso, la ausencia de backend, base de datos y autenticación real se registra como **gap frente al MVP final**, no como error del mock.
- Solo se consideran **requisitos explícitos o inferencias directas del PDF**.
- Si algo existe hoy en el mock pero **no aparece en el PDF**, se clasifica como **decisión local del mock** u **open question**, no como alcance cerrado del MVP.

---

## 1. Requisitos MVP extraídos del PDF

## 1.1 Roles

El PDF define tres tipos de usuario:

- **Público**: sin login; solo accede a contenidos públicos.
- **Interno Palenke/Hileros**: acceso autenticado a contenidos internos y accesos protegidos, especialmente tableros y geoportal.
- **Admin**: además de lo anterior, gestiona contenidos, usuarios y visibilidad.

## 1.2 Reglas de visibilidad

El PDF define tres niveles de visibilidad por recurso:

- **Público**
- **Interno**
- **Sensible/restringido**

Reglas asociadas:

- Lo `público` puede verse sin login.
- Lo `interno` requiere autenticación.
- Lo `sensible/restringido` **no se muestra en la web** y se maneja fuera de la plataforma.
- La plataforma debe implementar estas reglas como configuración y control de acceso, alineadas con seguridad territorial digital.

## 1.3 Navegación y acceso relacionados con este módulo

Para este módulo, el PDF exige:

- Login para usuarios `interno` y `admin`.
- Acceso protegido a recursos internos.
- Acceso a `geoportal` solo para usuarios autenticados con rol interno o admin.
- Existencia de un panel interno para coordinación y equipo técnico.
- Gestión de usuarios por parte del rol admin.

## 1.4 Tipos de datos o entidades mínimas

El PDF no define un esquema detallado de cuentas, pero sí obliga a soportar como mínimo:

- **Usuarios**
- **Roles**
- **Credenciales/autenticación**
- **Permisos de visibilidad por rol**

Además, en 3.1 el PDF exige persistencia para:

- usuarios
- roles
- documentos
- secciones
- dashboards
- configuración

## 1.5 Comportamiento técnico

El PDF exige para Fase 1:

- **Frontend:** Next.js/React
- **Backend/API:** rutas API de Next.js o funciones serverless para autenticación, gestión de contenidos y roles
- **Base de datos:** Postgres
- **Control de acceso por roles**
- **Manejo de visibilidad de contenidos**
- **HTTPS / SSL**

## 1.6 Integraciones y límites

Relacionados con este módulo:

- El acceso a dashboards internos y geoportal depende del rol/autenticación.
- La plataforma **no almacena datos geográficos crudos ni capas SIG**.
- La alternativa de despliegue en servidor propio aparece como posibilidad futura; el PDF dice explícitamente que esa migración **no está incluida en el trabajo inicial**.

## 1.7 Lo que el PDF no define

El PDF **no define explícitamente** para este módulo:

- límite máximo de usuarios
- estructura exacta del formulario de usuario
- campo de organización
- `admin principal`
- `último acceso`
- `forzar cambio de contraseña`
- recuperación de contraseña por correo
- auditoría de eventos de cuentas
- política de registro público/autoinvitación

Estos temas no deben tratarse como alcance cerrado del MVP sin validación adicional.

---

## 2. Estado actual del repo

La implementación actual cubre bastante superficie de UI, pero sigue siendo mock:

- El rol activo se obtiene desde `?role=` en [`src/lib/viewer.ts`](../src/lib/viewer.ts), no desde una sesión real.
- La protección de `/admin` se hace con un guard basado en ese mismo query param en [`src/lib/admin-access.ts`](../src/lib/admin-access.ts).
- Existe pantalla de login en [`src/app/login/page.tsx`](../src/app/login/page.tsx), pero el botón no autentica contra servidor.
- Existe pantalla de recuperación en [`src/app/recuperar-contrasena/page.tsx`](../src/app/recuperar-contrasena/page.tsx), también solo a nivel UI.
- Existe módulo admin de usuarios en:
  - [`src/app/admin/usuarios/page.tsx`](../src/app/admin/usuarios/page.tsx)
  - [`src/app/admin/usuarios/nuevo/page.tsx`](../src/app/admin/usuarios/nuevo/page.tsx)
  - [`src/app/admin/usuarios/[id]/editar/page.tsx`](../src/app/admin/usuarios/[id]/editar/page.tsx)
- Los datos de usuarios viven en memoria dentro de [`src/lib/mock-data.ts`](../src/lib/mock-data.ts).
- La UI ya incluye enlaces de "Cerrar sesión" en header del sitio y panel admin, pero solo navegan a `/`; no cierran una sesión real.

---

## 3. Comparación PDF vs implementación actual

| Requisito Fase 1 | Estado | Qué ya existe en el repo | Gap real |
|---|---|---|---|
| Roles `público`, `interno`, `admin` | **Parcial** | Existe el tipo `ViewerRole` y el sitio cambia navegación y vistas según rol mock. | Los roles no provienen de autenticación segura; se simulan por URL. |
| Visibilidad `público / interno / sensible` | **Parcial** | Existe el tipo `Visibility` y la lógica de filtrado/ocultamiento en frontend. | El enforcement es de presentación; no existe control de acceso respaldado por sesión/servidor. |
| Login para usuarios internos/admin | **Parcial** | Existe pantalla de login con estados visuales. | No valida credenciales, no crea sesión, no persiste estado. |
| Gestión de usuarios por admin | **Parcial** | Existen listado, alta y edición de usuarios en el panel admin. | No hay CRUD real ni persistencia; solo mock data. |
| Protección del panel admin por rol | **Parcial** | `requireAdmin()` redirige si el rol mock no es admin. | La validación depende de `?role=admin`; no existe middleware ni sesión segura. |
| Acceso protegido a recursos internos | **Parcial** | El geoportal redirige a login si el rol mock no es interno/admin; el sitio distingue vistas públicas e internas. | No hay modelo de sesión ni autorización real del lado servidor. |
| Backend/API para autenticación y roles | **No cubierto** | No existe `src/app/api` para auth o usuarios. | Falta crear la capa API/serverless exigida por el PDF. |
| Base de datos Postgres para usuarios y roles | **No cubierto** | No hay persistencia; todo está en `mock-data.ts`. | Falta modelo de datos, conexión y almacenamiento real. |
| Seguridad base: HTTPS, control de acceso, manejo de visibilidad | **Parcial** | La UI expresa control de acceso y visibilidad; el diseño conceptual existe. | Falta la implementación técnica real de seguridad y acceso. |
| No almacenar datos SIG crudos | **Cubierto** | El patrón actual para geoportal solo enlaza al sistema externo. | No hay gap relevante en este módulo. |

---

## 4. Detalle del gap analysis

## 4.1 Ítems ya OK

Estos puntos ya están resueltos al nivel correcto para un mock de Fase 1:

- La taxonomía base de roles existe: `public`, `internal`, `admin`.
- La taxonomía base de visibilidad existe: `public`, `internal`, `sensitive`.
- Hay superficie de navegación para login, acceso restringido, panel admin y geoportal.
- Existe un flujo visible de gestión de usuarios para admin: listar, crear y editar.
- La plataforma actual no intenta almacenar geometrías ni datos SIG crudos.

## 4.2 Ítems que deben ajustarse

Estos puntos existen, pero deben corregirse o redefinirse para quedar alineados con el PDF:

- **Autenticación simulada por query string:** debe migrar a sesión real basada en credenciales.
- **Guard del panel admin:** debe depender de sesión/rol real, no de `searchParams`.
- **Logout:** hoy es solo navegación a `/`; debe convertirse en cierre de sesión real cuando exista auth.
- **Documentación del módulo:** no debe presentar como requisitos cerrados cosas que el PDF no define.

Puntos del mock que hoy conviene mantener como hipótesis, no como requisito:

- límite `15` usuarios
- campo `organization`
- campo `isPrimaryAdmin`
- `mustChangePassword`
- `lastLoginAt`
- restablecimiento por correo
- feed de actividad de cuentas

## 4.3 Ítems faltantes y a crear desde cero

Para que este módulo cumpla el MVP del PDF, aún falta construir:

- autenticación segura con usuario/contraseña
- sesión real para usuarios internos y admin
- protección real de rutas internas y admin
- backend/API para auth y gestión de usuarios/roles
- persistencia en Postgres para usuarios y roles
- capa de autorización consistente entre UI, rutas y datos

## 4.4 Lo que está parcialmente cubierto

Hay varias piezas cuyo diseño ya existe, pero cuya funcionalidad real no:

- pantalla de login
- pantalla de recuperación de contraseña
- formulario de creación/edición de usuario
- filtros de la lista de usuarios
- acceso restringido a admin y geoportal
- enlaces de cierre de sesión

La lectura correcta aquí es: **la UX está avanzada, la implementación real todavía no**.

---

## 5. Qué no debemos bloquear como MVP sin validación

Para mantenernos estrictamente en Fase 1, no conviene fijar todavía como compromiso:

- un límite máximo de usuarios
- una política cerrada de autogestión de cuentas
- flujos obligatorios de cambio de contraseña
- un modelo de organizaciones o dependencias internas más detallado
- trazabilidad/auditoría avanzada de eventos de cuenta

Nada de eso está cerrado en el PDF. Si el equipo quiere conservarlo porque aporta al mock, debe documentarse como:

- decisión interna del mock, o
- open question para validación con coordinación/técnico

## 5.1 Lo que sí está explícitamente fuera del trabajo inicial

Según el PDF, no debe meterse dentro del MVP inicial:

- migración a servidor propio de la corporación
- endurecimiento específico de infraestructura para ese escenario futuro

Eso debe quedarse como consideración de arquitectura futura, no como entregable del módulo.

---

## 6. Recomendación práctica para este repo

Como el proyecto seguirá con datos mock por ahora, la mejor lectura operativa es:

### En el mock actual

- Mantener la UI y los flujos visibles.
- Mantener usuarios y roles en `mock-data.ts`.
- Mantener el disclaimer de que el acceso es simulado.
- No intentar vender como "implementado" nada que dependa de auth, DB o API real.

### Para la documentación del MVP final

- Dejar claramente marcado que el mock cubre **estructura, navegación, permisos simulados y formularios**.
- Dejar claramente marcado que aún faltan **auth, autorización real, API y persistencia** para completar Fase 1.

---

## 7. Propuesta de estructura `docs/` para este módulo

```text
docs/
  area-interna-usuarios-roles-cuentas/
    requirements.md
    gap-analysis.md
    ux-flow.md
    permissions-matrix.md
    technical-design.md
    data-model.md
    open-questions.md
```

## `requirements.md`

**Propósito**

- Traducir el PDF a requisitos verificables del módulo.

**Secciones sugeridas**

- objetivo del módulo
- alcance Fase 1
- roles
- reglas de visibilidad
- rutas y navegación
- restricciones de seguridad
- criterios de aceptación

**Qué incluir**

- tabla requisito -> fuente PDF -> criterio de validación
- notas sobre qué no está definido por el PDF

## `gap-analysis.md`

**Propósito**

- Comparar requisitos Fase 1 contra el estado real del repo.

**Secciones sugeridas**

- snapshot actual
- cubierto
- parcialmente cubierto
- no cubierto
- decisiones mock que no equivalen a alcance MVP

**Qué incluir**

- tabla de gaps con prioridad
- referencias a archivos del repo
- lista de riesgos por depender de mock data

## `ux-flow.md`

**Propósito**

- Documentar la experiencia de acceso y gestión de cuentas.

**Secciones sugeridas**

- flujo login
- flujo acceso denegado
- flujo admin: listar usuarios
- flujo admin: crear usuario
- flujo admin: editar/desactivar usuario

**Qué incluir**

- diagramas de flujo simples
- estados vacíos, error, loading y acceso restringido
- diferencias entre público, interno y admin

## `permissions-matrix.md`

**Propósito**

- Volver explícita la matriz de permisos por rol.

**Secciones sugeridas**

- recursos protegidos
- acciones permitidas por rol
- reglas de visibilidad
- excepciones o recursos fuera de plataforma

**Qué incluir**

- matriz `rol x acción`
- notas sobre `sensitive/restricted`
- relación entre auth y navegación

## `technical-design.md`

**Propósito**

- Definir la implementación técnica real cuando el módulo deje de ser solo mock.

**Secciones sugeridas**

- arquitectura del módulo
- estrategia de autenticación
- autorización y guards
- rutas API
- middleware
- consideraciones de seguridad

**Qué incluir**

- diagrama de secuencia login -> sesión -> acceso
- diagrama de componentes
- decisiones sobre sesión, hashing y protección de rutas

## `data-model.md`

**Propósito**

- Fijar el modelo de datos mínimo para usuarios, roles y credenciales.

**Secciones sugeridas**

- entidades
- campos mínimos
- enums
- relaciones
- persistencia requerida por Fase 1

**Qué incluir**

- ERD simple
- tabla `users`
- tabla o estrategia para roles/sesión si aplica
- separación entre campos confirmados por PDF y campos opcionales del mock

## `open-questions.md`

**Propósito**

- Capturar decisiones aún no cerradas por el PDF.

**Secciones sugeridas**

- preguntas de producto
- preguntas de seguridad
- preguntas de operación
- decisiones pendientes de validación

**Qué incluir**

- si habrá o no límite de usuarios
- si habrá recuperación por correo en MVP
- si `organization` será obligatorio
- si se requiere desactivación/reactivación explícita
- qué campos mínimos debe tener una cuenta interna

---

## 8. Resumen ejecutivo

### Ya cubierto

- estructura de roles y visibilidad a nivel de mock
- panel y pantallas para gestión de usuarios
- navegación diferenciada entre público, interno y admin
- patrón de no almacenar datos SIG crudos

### A ajustar

- dejar de documentar como requisito lo que hoy solo es una convención del mock
- normalizar el módulo alrededor de requisitos reales del PDF
- preparar la documentación para separar mock actual de MVP final

### Falta por construir para cumplir Fase 1 final

- autenticación real
- sesiones
- autorización real por rol
- backend/API
- Postgres

### Fuera del MVP inicial

- migración a servidor propio

---

## 9. Verificación de cumplimiento (actualizada)

**Fecha de verificación:** 12 de marzo de 2026

Estado real frente al plan del módulo:

| Requisito | Estado actual |
|---|---|
| Roles `public / internal / admin` en navegación | ✅ Implementado en mock (vía `?role=`) |
| Listado admin de usuarios (`/admin/usuarios`) | ✅ Implementado en mock |
| Alta de usuario (`/admin/usuarios/nuevo`) | ✅ Implementado en mock (UI) |
| Edición de usuario (`/admin/usuarios/[id]/editar`) | ✅ Implementado en mock (UI) |
| Guard de acceso a panel admin | ✅ Implementado en mock (redirige si no es admin) |
| Login y recuperar contraseña (pantallas) | ✅ Implementado en mock (sin backend) |
| Autenticación real con credenciales | ❌ No implementado |
| Sesión real (cookie/token server-side) | ❌ No implementado |
| API para auth/usuarios/roles | ❌ No implementado |
| Persistencia en Postgres | ❌ No implementado |
| Logout real (invalidar sesión) | ❌ No implementado |

**Conclusión:** no están cumplidos todos los requisitos del MVP final de este módulo; sí está cumplida la capa de mock/UX.

## 10. Faltantes mínimos a agregar para cierre del módulo (MVP final)

- [ ] Implementar autenticación real (login con validación de credenciales).
- [ ] Implementar sesiones seguras para `internal` y `admin`.
- [ ] Implementar autorización real por rol para rutas internas y admin.
- [ ] Crear API de usuarios/roles (listar, crear, editar, activar/desactivar).
- [ ] Conectar persistencia en Postgres para usuarios y roles.
- [ ] Implementar logout real (cierre de sesión server-side).
- [ ] Migrar guards basados en query param a middleware/sesión real.
