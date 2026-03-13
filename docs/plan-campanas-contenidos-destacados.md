# Gap Analysis Fase 1: 10 · Bloque de contenidos destacados (campañas)

**Módulo:** 10 · Bloque de contenidos destacados (campañas)  
**Fecha:** 11 de marzo de 2026  
**Fuente principal:** `docs/Plataforma Palenke_ Propuesta_fases_final.pdf`  
**Secciones usadas:** 2.3, 2.5, 3.1, 4

## 1. Requisitos MVP extraídos del PDF

El PDF exige explícitamente, para MJN:

- un bloque de “contenidos destacados” configurable desde el panel interno

El PDF no define con precisión:

- si ese bloque también debe aparecer en Home
- reglas de placement multi-zona
- workflow editorial complejo de campañas

## 2. Estado actual del repo

- las campañas se modelan en `campaigns` dentro de `src/lib/mock-data.ts`
- Home y MJN muestran campañas activas según `visibility` y `placements`
- existe detalle de campaña en `/mujeres-juventudes-ninez/campanas/[slug]`
- existe panel admin de campañas en `src/app/admin/campanas/page.tsx`
- existe formulario admin con título, intro, materiales, fechas, placement, visibilidad y estado

## 3. Cobertura actual

### Ya cubierto

- existe bloque de campañas en MJN
- existe configuración admin a nivel UI/mock
- hay detalle de campaña con materiales y fechas
- se respeta visibilidad pública/interna y estado activo

### Parcial

- placement en Home, Biblioteca o `all` es una decisión del mock, no un requisito claramente cerrado por el PDF
- la gestión admin es solo visual; no persiste
- la portada de campaña y materiales siguen siendo placeholders

### No cubierto

- backend CRUD real para campañas
- almacenamiento real de assets/materiales

## 4. Qué ajustar o no ampliar en Fase 1

- documentar que la única exigencia inequívoca del PDF es el bloque configurable en MJN
- no ampliar a sistema de campañas/iniciativas con llamados a la acción o integraciones externas sin validación

## 5. Propuesta docs/

```text
docs/campanas-contenidos-destacados/
  requirements.md
  ux-flow.md
  technical-design.md
  content-model.md
  open-questions.md
```

- `requirements.md`: alcance exacto del bloque de campañas y su fuente PDF.
- `ux-flow.md`: listado en MJN/Home, acceso al detalle y estados activo/inactivo.
- `technical-design.md`: reglas de placement, visibilidad y publicación.
- `content-model.md`: campaña, materiales, fechas, placements y estado.
- `open-questions.md`: si Home y Biblioteca deben seguir soportando placements en Fase 1.

## 6. Resumen

- OK: el mock ya tiene un módulo de campañas bastante completo en UI.
- Ajustar: separar placements confirmados del PDF de los que son decisión local del mock.
- Crear desde cero: persistencia, assets y CRUD real.

