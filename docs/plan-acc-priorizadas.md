# Gap Analysis Fase 1: 14 · Área interna – Fichas de ACC priorizadas

**Módulo:** 14 · Área interna – Fichas de ACC priorizadas  
**Fecha:** 11 de marzo de 2026  
**Fuente principal:** `docs/Plataforma Palenke_ Propuesta_fases_final.pdf`  
**Secciones usadas:** 2.5, 3.1, 4

## 1. Requisitos MVP extraídos del PDF

El PDF exige:

- gestión básica de fichas de **2–3 Áreas de Conservación Comunitaria**
- almacenar **metadatos**, no geometrías
- permitir enlace a tableros o al geoportal
- la gestión ocurre dentro del área interna

## 2. Estado actual del repo

- existe panel admin de ACCs en `src/app/admin/accs/page.tsx`
- existen formularios `nuevo` y `editar`
- el modelo mock incluye 3 ACCs
- el formulario ya contempla nombre, consejo, metadatos territoriales, descripción, presencia en geoportal, vínculo a dashboard, documentos relacionados y visibilidad
- no hay campos de coordenadas o geometría

## 3. Cobertura actual

### Ya cubierto

- cantidad mock alineada a “2–3 ACCs”
- enfoque en metadatos y no geometría
- vínculo a geoportal y dashboards
- superficie admin de listado/alta/edición

### Parcial

- la gestión sigue siendo solo mock; no guarda cambios
- la protección del área interna depende de rol mock
- el modelo actual añade extras como `visibilidad` y `Meta 30x30`, que no están cerrados en el PDF

### No cubierto

- CRUD real con DB
- sesión/autorización real

## 4. Qué ajustar o no ampliar en Fase 1

- no agregar coordenadas, shapefiles o capas SIG
- tratar `visibilidad pública/interna` y `Meta 30x30` como decisiones del mock, no como requisito cerrado del PDF

## 5. Propuesta docs/

```text
docs/acc-priorizadas/
  requirements.md
  ux-flow.md
  technical-design.md
  content-model.md
  open-questions.md
```

- `requirements.md`: alcance de las fichas ACC y restricciones de Fase 1.
- `ux-flow.md`: listado admin -> crear/editar -> vincular a tablero/geoportal.
- `technical-design.md`: restricciones de geometría, seguridad y relaciones externas.
- `content-model.md`: nombre, consejo, metadatos territoriales y enlaces relacionados.
- `open-questions.md`: definir si la visibilidad pública/interna de ACC queda en Fase 1.

## 6. Resumen

- OK: el mock está bastante alineado con el alcance del PDF.
- Ajustar: separar claramente los campos extra del mock de los requisitos confirmados.
- Crear desde cero: persistencia, auth y CRUD real.

