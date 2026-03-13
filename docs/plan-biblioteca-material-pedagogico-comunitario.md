# Gap Analysis Fase 1: 06 · Biblioteca Base – Material pedagógico y comunitario

**Módulo:** 06 · Biblioteca Base – Material pedagógico y comunitario  
**Fecha:** 11 de marzo de 2026  
**Fuente principal:** `docs/Plataforma Palenke_ Propuesta_fases_final.pdf`  
**Secciones usadas:** 2.2, 2.3, 2.5, 3.1, 4

## 1. Requisitos MVP extraídos del PDF

El PDF exige una sección con material:

- comunitario
- pedagógico
- cartillas
- guías
- audiovisuales

Además:

- listados con filtros por territorio y tipo
- búsqueda por título y palabra clave
- descarga o acceso respetando visibilidad
- contenido seleccionado como mínimo del MVP

## 2. Estado actual del repo

- existe la sección `Material pedagógico/comunitario`
- hay dos documentos mock visibles: una cartilla y un video
- el detalle de documento soporta acciones `external` y `video`
- MJN reutiliza esta clase de materiales en su listado temático

## 3. Cobertura actual

### Ya cubierto

- la sección existe y tiene contenido mock
- hay variedad de formato: cartilla/enlace y audiovisual
- la Biblioteca soporta filtros y detalle
- MJN puede reutilizar estos materiales

### Parcial

- las tarjetas del listado no llevan al detalle del documento
- las URLs siguen siendo mock o de demostración
- no hay gestión real de archivos ni persistencia

### No cubierto

- backend/document storage real
- autenticación/visibilidad real del lado servidor

## 4. Qué ajustar o no ampliar en Fase 1

- no agregar repositorio multimedia avanzado ni streaming propio
- mantener el foco en acceso a materiales seleccionados

## 5. Propuesta docs/

```text
docs/biblioteca-material-pedagogico-comunitario/
  requirements.md
  ux-flow.md
  technical-design.md
  content-model.md
  open-questions.md
```

- `requirements.md`: tipos de material, visibilidad y criterios mínimos.
- `ux-flow.md`: listado, acceso a cartilla, acceso a video y estados vacíos.
- `technical-design.md`: manejo de `file`, `external` y `video`.
- `content-model.md`: campos editoriales y tipos de acción por material.
- `open-questions.md`: política de alojamiento de audiovisuales y definición de materiales prioritarios.

## 6. Resumen

- OK: es una de las secciones más visibles y mejor representadas en el mock.
- Ajustar: navegación listado -> detalle y URLs reales.
- Crear desde cero: persistencia y gestión real de archivos/media.

