# Gap Analysis Fase 1: 04 · Biblioteca Base – Rutas de litigio estratégico

**Módulo:** 04 · Biblioteca Base – Rutas de litigio estratégico  
**Fecha:** 11 de marzo de 2026  
**Fuente principal:** `docs/Plataforma Palenke_ Propuesta_fases_final.pdf`  
**Secciones usadas:** 2.2, 2.3, 2.5, 3.1, 4

## 1. Requisitos MVP extraídos del PDF

El PDF exige:

- una sección de Biblioteca para **Rutas de litigio estratégico**
- incluir rutas de litigio, también con enfoque de género
- permitir listados, filtros, búsqueda y descarga respetando visibilidad
- permitir clasificación interna por sección, etiquetas y visibilidad
- reutilizar esos contenidos en la agenda MJN cuando correspondan

## 2. Estado actual del repo

- la sección existe en `librarySections`
- hay un documento mock en esa sección con `genderFocus: true`, etiqueta MJN y `riskFlag`
- `/biblioteca` soporta filtro por sección y `gender=1`
- el detalle del documento muestra aviso de manejo cuidadoso cuando `riskFlag` está activo
- MJN puede reutilizar estos documentos a través de `getVisibleMjnDocuments()`

## 3. Cobertura actual

### Ya cubierto

- existencia de la sección
- presencia de un caso mock con enfoque de género
- filtro de género y reutilización hacia MJN
- aviso de cuidado para contenidos sensibles o de riesgo

### Parcial

- el documento de ejemplo es `internal`, así que la experiencia pública del módulo no se ve
- las tarjetas del listado no enlazan al detalle
- no hay reglas de seguridad reales más allá de UI/redirect mock

### No cubierto

- autenticación real para proteger rutas internas
- backend/document storage real

## 4. Qué ajustar o no ampliar en Fase 1

- no convertir este módulo en sistema de seguimiento de casos o litigios
- no agregar cronologías, expedientes o trazabilidad operativa
- mantener el alcance en repositorio documental con control de visibilidad

## 5. Propuesta docs/

```text
docs/biblioteca-rutas-litigio/
  requirements.md
  ux-flow.md
  technical-design.md
  content-model.md
  open-questions.md
```

- `requirements.md`: requisitos del módulo y relación con enfoque de género/MJN.
- `ux-flow.md`: búsqueda, acceso restringido, detalle y descarga.
- `technical-design.md`: visibilidad, riesgo, rutas protegidas y reutilización en MJN.
- `content-model.md`: metadatos de ruta, tags de género, flags de riesgo y visibilidad.
- `open-questions.md`: criterios editoriales para cuándo un contenido debe ser `internal` o `sensitive`.

## 6. Resumen

- OK: la estructura y el caso de ejemplo existen.
- Ajustar: navegación del listado y enforcement de acceso.
- Crear desde cero: auth real, API y persistencia.

