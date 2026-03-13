# Gap Analysis Fase 1: 11 · Módulo Estadísticas y Tableros – Power BI

**Módulo:** 11 · Módulo Estadísticas y Tableros – Power BI  
**Fecha:** 11 de marzo de 2026  
**Fuente principal:** `docs/Plataforma Palenke_ Propuesta_fases_final.pdf`  
**Secciones usadas:** 2.4.1, 2.5, 3.1, 4

## 1. Requisitos MVP extraídos del PDF

El PDF exige:

- admin puede registrar tableros con título, descripción, URL de embed y visibilidad
- la plataforma muestra un listado filtrable por tema/territorio
- cada dashboard se embebe en un iframe
- la visibilidad puede ser `público / interno`
- la plataforma no modifica la lógica interna de Power BI; solo aloja y muestra

## 2. Estado actual del repo

- `/estadisticas` muestra catálogo con filtros por tema y territorio
- `/estadisticas/[slug]` embebe el tablero en iframe
- la gestión admin existe en `src/app/admin/dashboards/page.tsx`
- el formulario admin ya incluye título, descripción, tema, territorio, período, audiencia, frecuencia, estado, embed URL y visibilidad

## 3. Cobertura actual

### Ya cubierto

- listado filtrable
- vista detalle con iframe
- visibilidad pública/interna
- superficie admin para registrar/editar tableros
- separación clara respecto a la lógica propia de Power BI

### Parcial

- la protección de dashboards internos sigue basada en rol mock
- los tableros y URLs son datos mock, no registros persistentes
- `territory` es un campo libre en filtros/listado, no una taxonomía fuerte

### No cubierto

- backend/API real de dashboards
- persistencia en DB
- sesión/autorización real para tableros internos

## 4. Qué ajustar o no ampliar en Fase 1

- no implementar transformación propia de datos o filtros Power BI dentro de la plataforma
- no replicar lógica de BI del sistema fuente

## 5. Propuesta docs/

```text
docs/estadisticas-tableros-power-bi/
  requirements.md
  ux-flow.md
  technical-design.md
  content-model.md
  open-questions.md
```

- `requirements.md`: alcance del catálogo y del embed Power BI.
- `ux-flow.md`: listado -> filtro -> detalle -> acceso restringido.
- `technical-design.md`: registro admin, iframe embed, visibilidad y restricciones.
- `content-model.md`: título, descripción, tema, territorio, embed URL, visibilidad y estado.
- `open-questions.md`: si tema/territorio deben normalizarse y cómo se valida una URL de embed.

## 6. Resumen

- OK: es uno de los módulos más completos del mock.
- Ajustar: auth real y persistencia.
- Crear desde cero: API/DB y administración funcional real.

## 7. Verificación de implementación (12 de marzo de 2026)

- ✅ `/estadisticas` renderiza catálogo y filtros de tableros.
- ✅ `/estadisticas/[slug]` embebe Power BI vía `iframe` con URL de `embed`.
- ✅ tableros `internal` redirigen a `/acceso-restringido` para usuario público.
- ✅ `/admin/dashboards?role=admin` lista y filtra tableros.
- ✅ `/admin/dashboards/nuevo?role=admin` incluye campos requeridos (incluida URL embed).
- ✅ `/admin/dashboards/[id]/editar?role=admin` incluye control de visibilidad `public/internal`.

Estado: **cumplido para mock MVP**. Pendiente para cierre productivo: auth/API/DB reales.
