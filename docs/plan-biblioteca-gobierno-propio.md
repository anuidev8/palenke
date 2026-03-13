# Gap Analysis Fase 1: 02 · Biblioteca Base – Gobierno Propio

**Módulo:** 02 · Biblioteca Base – Gobierno Propio  
**Fecha:** 11 de marzo de 2026  
**Fuente principal:** `docs/Plataforma Palenke_ Propuesta_fases_final.pdf`  
**Secciones usadas:** 2.2, 2.5, 3.1, 4

## 1. Requisitos MVP extraídos del PDF

Para esta sección de Biblioteca Base, el PDF exige:

- organizar documentos de **Gobierno Propio**
- incluir instrumentos principales de gobierno propio seleccionados por Palenke
- soportar listados por sección con filtros por territorio y tipo
- soportar búsqueda por título y palabra clave
- respetar visibilidad `público / interno / sensible-restringido`
- permitir gestión interna de metadatos, sección, etiquetas, archivo y visibilidad

## 2. Estado actual del repo

- la sección `Gobierno Propio` existe en `librarySections` en `src/lib/mock-data.ts`
- `/biblioteca` permite filtrar por sección, territorio, tipo, año y texto
- existe detalle de documento en `src/app/biblioteca/[slug]/page.tsx`
- existe gestión admin genérica de documentos en `src/app/admin/documentos/page.tsx` y `src/components/mock/admin-forms.tsx`
- hay un documento mock de Gobierno Propio

## 3. Cobertura actual

### Ya cubierto

- taxonomía de sección
- filtros base de Biblioteca
- detalle de documento con metadatos y visibilidad
- gestión admin de clasificación y visibilidad

### Parcial

- la tarjeta usada en `/biblioteca` no enlaza al detalle del documento; el detalle existe, pero la navegación desde el listado no
- la descarga es mock; los archivos apuntan a placeholders
- las reglas de visibilidad existen, pero dependen de rol mock por URL

### No cubierto

- no hay backend/API ni persistencia real para documentos
- no hay almacenamiento o publicación real de archivos

## 4. Qué ajustar o no ampliar en Fase 1

- corregir la navegación listado -> detalle antes de dar este módulo por cubierto
- no agregar versionado documental, flujos de aprobación o repositorio avanzado

## 5. Propuesta docs/

```text
docs/biblioteca-gobierno-propio/
  requirements.md
  ux-flow.md
  technical-design.md
  content-model.md
  open-questions.md
```

- `requirements.md`: alcance de la sección. Secciones: tipos de documento, filtros, visibilidad, criterios de aceptación. Incluir referencia explícita a 2.2.
- `ux-flow.md`: exploración, filtrado, detalle y descarga. Incluir diagrama listado -> ficha -> acción.
- `technical-design.md`: rutas, filtros, visibilidad y administración interna. Incluir decisión sobre archivo vs enlace.
- `content-model.md`: campos mínimos del documento. Secciones: metadatos, visibilidad, keywords, territorio, archivo.
- `open-questions.md`: selección exacta de instrumentos prioritarios y política de publicación pública vs interna.

## 6. Resumen

- OK: la estructura de Biblioteca ya soporta esta sección.
- Ajustar: enlazar correctamente las tarjetas del listado y separar mock de implementación real.
- Crear desde cero: persistencia, auth real y archivos reales.

