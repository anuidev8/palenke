# Gap Analysis Fase 1: 03 · Biblioteca Base – Planes (uso, manejo, etnodesarrollo)

**Módulo:** 03 · Biblioteca Base – Planes (uso, manejo, etnodesarrollo)  
**Fecha:** 11 de marzo de 2026  
**Fuente principal:** `docs/Plataforma Palenke_ Propuesta_fases_final.pdf`  
**Secciones usadas:** 2.2, 2.5, 3.1, 4

## 1. Requisitos MVP extraídos del PDF

El PDF ubica dentro de Biblioteca Base:

- **Planes de uso y manejo**
- **Planes de etnodesarrollo**

Y exige para estas secciones:

- listado por sección con filtros por territorio y tipo
- búsqueda por título y palabra clave
- descarga según visibilidad
- gestión interna de metadatos, etiquetas, archivo y visibilidad

## 2. Estado actual del repo

- ambas secciones existen en `librarySections`
- `/biblioteca` permite filtrar por una o varias secciones
- existe un documento mock para `Planes de uso y manejo`
- existe un documento mock para `Planes de etnodesarrollo`
- la gestión admin documental es genérica y sí permite asignar sección/visibilidad

## 3. Cobertura actual

### Ya cubierto

- taxonomía de ambas secciones
- filtros compartidos de Biblioteca
- capacidad de clasificar documentos en admin
- contenido mock inicial en ambos grupos

### Parcial

- no existe una vista combinada específica del módulo “Planes”; todo depende del filtro manual de Biblioteca
- las tarjetas del listado no abren el detalle directamente
- las acciones de archivo/enlace siguen siendo mock
- la visibilidad depende de rol simulado

### No cubierto

- persistencia real de documentos, filtros y archivos
- autenticación/autoridad real sobre materiales internos

## 4. Qué ajustar o no ampliar en Fase 1

- no crear subproductos separados para cada tipo de plan si la Biblioteca ya resuelve el caso con taxonomía
- no agregar buscador semántico, versionado o workflows documentales complejos

## 5. Propuesta docs/

```text
docs/biblioteca-planes/
  requirements.md
  ux-flow.md
  technical-design.md
  content-model.md
  open-questions.md
```

- `requirements.md`: alcance conjunto de planes de uso/manejo y etnodesarrollo. Incluir criterios por sección.
- `ux-flow.md`: navegación desde Biblioteca, filtros multi-sección, detalle y descarga.
- `technical-design.md`: modelo de secciones, filtros, visibilidad y administración interna.
- `content-model.md`: diferencias entre tipos de plan, campos compartidos y campos opcionales.
- `open-questions.md`: si el equipo quiere una landing específica para “Planes” o si basta la taxonomía actual.

## 6. Resumen

- OK: la base estructural del módulo ya existe.
- Ajustar: navegación del listado y decisión sobre si este módulo necesita entrada propia o solo filtro.
- Crear desde cero: backend, DB y archivos reales.

