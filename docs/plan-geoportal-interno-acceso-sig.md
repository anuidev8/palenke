# Gap Analysis Fase 1: 12 · Módulo Geoportal Interno – Acceso SIG

**Módulo:** 12 · Módulo Geoportal Interno – Acceso SIG  
**Fecha:** 11 de marzo de 2026  
**Fuente principal:** `docs/Plataforma Palenke_ Propuesta_fases_final.pdf`  
**Secciones usadas:** 2.4.2, 2.5, 3.1, 4

## 1. Requisitos MVP extraídos del PDF

El PDF exige:

- una entrada “Geoportal interno” visible solo para usuarios `interno` o `admin`
- dos opciones posibles:
  - A: abrir el geoportal en nueva pestaña
  - B: página `/geoportal` con iframe, si el servidor lo permite
- la plataforma no almacena datos geográficos ni capas SIG
- la plataforma solo gestiona quién ve el enlace y dónde se presenta
- la URL del geoportal debe formar parte de la configuración persistente

## 2. Estado actual del repo

- el menú muestra `Geoportal` solo para `internal/admin`
- la ruta `/geoportal` existe y redirige a login si el rol mock es público
- la página interna actúa como gateway (opción A) y ofrece botón para abrir URL externa en nueva pestaña
- la URL del geoportal se resuelve desde `NEXT_PUBLIC_GEOPORTAL_URL` con fallback en `geoportalCopy` (`src/lib/mock-data.ts`)

## 3. Cobertura actual

### Ya cubierto

- acceso visible solo para roles internos/admin
- handoff hacia sistema externo
- mensaje explícito de que el geoportal lo administra el equipo SIG
- la plataforma no almacena geometrías ni datos SIG
- comportamiento de acceso para público: `/geoportal` -> `/login?redirect=/geoportal&message=geoportal`
- opción A del blueprint implementada (gateway page + apertura en nueva pestaña)

### Parcial

- la protección depende de rol mock por URL
- la URL se puede configurar por entorno, pero no existe persistencia editable desde backend/admin

### No cubierto

- auth real para controlar acceso
- configuración persistente de la URL del geoportal en DB/API
- sesión/autorización real para reemplazar `?role=...`

## 4. Qué ajustar o no ampliar en Fase 1

- no implementar carga de shapefiles, capas, GeoServer o almacenamiento espacial
- cerrar con el equipo SIG si la UX final será link directo o gateway page

## 5. Propuesta docs/

```text
docs/geoportal-interno-acceso-sig/
  requirements.md
  ux-flow.md
  technical-design.md
  configuration.md
  open-questions.md
```

- `requirements.md`: reglas de acceso y restricciones SIG.
- `ux-flow.md`: menú -> acceso -> login -> geoportal externo.
- `technical-design.md`: opción A vs opción B, control de acceso y no almacenamiento de datos.
- `configuration.md`: URL del geoportal, ownership, entorno y fallback.
- `open-questions.md`: definir integración final y si el iframe es viable.

## 6. Resumen

- OK: módulo implementado en mock conforme a la opción A del blueprint.
- Ajustar: cerrar auth real y configuración persistente editable.
- Crear desde cero: capa API/DB de configuración y sesión segura.

## 7. Verificación de implementación (12 de marzo de 2026)

- ✅ menú principal: `Geoportal` solo aparece para `internal/admin`.
- ✅ `/geoportal` redirige usuario público a login con mensaje contextual.
- ✅ `/geoportal?role=internal` y `/geoportal?role=admin` renderizan gateway interno.
- ✅ botón principal abre geoportal externo en nueva pestaña.
- ✅ copy explícito: la plataforma no almacena datos SIG y el sistema es administrado por equipo SIG.
- ✅ URL del geoportal configurable por `NEXT_PUBLIC_GEOPORTAL_URL` (con fallback de mock).

Estado: **cumplido para mock MVP**. Pendiente para cierre productivo: auth/sesión real + configuración persistente en backend.
