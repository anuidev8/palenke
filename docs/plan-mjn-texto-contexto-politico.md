# Gap Analysis Fase 1: 07 · Página MJN – Texto de contexto político

**Módulo:** 07 · Página MJN – Texto de contexto político  
**Fecha:** 11 de marzo de 2026  
**Fuente principal:** `docs/Plataforma Palenke_ Propuesta_fases_final.pdf`  
**Secciones usadas:** 2.3, 3.1, 4

## 1. Requisitos MVP extraídos del PDF

El PDF exige que la página MJN incluya:

- un texto político y de contexto sobre Mujeres, Juventudes y Niñez negra

El PDF no exige explícitamente:

- editor WYSIWYG
- una cita destacada
- gestión CMS específica para este bloque

## 2. Estado actual del repo

- existe la ruta `/mujeres-juventudes-ninez`
- la página incluye hero, bloque de contexto y una cita destacada
- el contenido sale de `mjnContext` y `mjnQuote` en `src/lib/mock-data.ts`

## 3. Cobertura actual

### Ya cubierto

- hay una página específica de MJN
- existe un bloque textual de contexto político
- el módulo es visible públicamente

### Parcial

- el contenido es estático en código; no existe fuente persistente o administrable
- la cita destacada es una buena decisión de UI, pero no viene del PDF como requisito explícito

### No cubierto

- no hay backend/persistencia para contenido editorial si se requiere gestión interna real

## 4. Qué ajustar o no ampliar en Fase 1

- no convertir este bloque en sistema editorial complejo
- documentar claramente que la editabilidad desde panel es una decisión pendiente, no un requisito explícito del PDF

## 5. Propuesta docs/

```text
docs/mjn-texto-contexto-politico/
  requirements.md
  ux-flow.md
  technical-design.md
  content-model.md
  open-questions.md
```

- `requirements.md`: alcance del bloque de contexto y criterios de contenido.
- `ux-flow.md`: ubicación del bloque dentro de la página MJN y relación con el resto de secciones.
- `technical-design.md`: fuente de contenido, render y estrategia de futura edición.
- `content-model.md`: título, párrafos, cita y metadatos editoriales si aplica.
- `open-questions.md`: si el texto debe editarse desde panel o si basta configuración por código en Fase 1.

## 6. Resumen

- OK: el bloque existe y comunica bien la agenda.
- Ajustar: separar claramente “contenido presente” de “editabilidad real”.
- Crear desde cero: persistencia o panel de edición solo si el equipo lo confirma.

