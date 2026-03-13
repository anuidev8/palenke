# Gap Analysis Fase 1: 05 · Biblioteca Base – Producción técnica y política

**Módulo:** 05 · Biblioteca Base – Producción técnica y política  
**Fecha:** 11 de marzo de 2026  
**Fuente principal:** `docs/Plataforma Palenke_ Propuesta_fases_final.pdf`  
**Secciones usadas:** 2.2, 2.5, 3.1, 4

## 1. Requisitos MVP extraídos del PDF

El PDF exige una sección de Biblioteca Base para:

- informes
- estudios
- documentos de análisis
- pronunciamientos del Palenke/PCN

Además, esta sección debe participar del mismo sistema de:

- listado y filtros
- búsqueda
- descarga según visibilidad
- gestión interna de metadatos y visibilidad

## 2. Estado actual del repo

- la sección `Producción técnica/política` existe en `librarySections`
- la gestión admin documental sí permite asignar documentos a esa sección
- actualmente solo hay un documento mock en esta sección
- ese documento está marcado como `sensitive`, por lo que no aparece en la web pública ni interna

## 3. Cobertura actual

### Ya cubierto

- la taxonomía existe
- la administración interna puede clasificar documentos en esta sección
- el modelo de visibilidad contempla que cierto contenido técnico/político nunca salga a la web

### Parcial

- la experiencia de Biblioteca para esta sección existe solo estructuralmente; en la práctica, el listado visible queda vacío
- no hay contenido visible de referencia para validar la experiencia pública/interna del módulo

### No cubierto

- no hay mock visible de “producción técnica/política priorizada” para usuarios web
- no hay backend ni persistencia real

## 4. Qué ajustar o no ampliar en Fase 1

- agregar al menos un ejemplo mock visible, si el objetivo es validar la experiencia de esta sección
- no confundir este módulo con el módulo de incidencia política ampliado de Fase 2

## 5. Propuesta docs/

```text
docs/biblioteca-produccion-tecnica-politica/
  requirements.md
  ux-flow.md
  technical-design.md
  content-model.md
  open-questions.md
```

- `requirements.md`: tipos de contenido, alcance y criterios de publicación.
- `ux-flow.md`: comportamiento cuando hay resultados visibles vs contenidos restringidos.
- `technical-design.md`: visibilidad, clasificación y publicación interna/admin.
- `content-model.md`: informe, estudio, análisis, pronunciamiento y metadatos comunes.
- `open-questions.md`: cuántos contenidos de esta sección deben ser visibles en Fase 1 y con qué visibilidad.

## 6. Resumen

- OK: la sección existe a nivel de modelo y panel admin.
- Ajustar: hoy el módulo no se valida bien porque solo tiene un contenido `sensitive`.
- Crear desde cero: contenido visible real, API y persistencia.

