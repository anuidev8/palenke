# Gap Analysis Fase 1: 09 · Página MJN – Memoria y relatos

**Módulo:** 09 · Página MJN – Memoria y relatos  
**Fecha:** 11 de marzo de 2026  
**Fuente principal:** `docs/Plataforma Palenke_ Propuesta_fases_final.pdf`  
**Secciones usadas:** 2.3, 3.1, 4

## 1. Requisitos MVP extraídos del PDF

El PDF exige que MJN pueda mostrar:

- contenidos de memoria y relatos
- solo cuando estén disponibles

No exige explícitamente:

- detalle propio por historia
- reproductores avanzados
- panel admin dedicado para relatos

## 2. Estado actual del repo

- la sección `Memoria y relatos` existe en `/mujeres-juventudes-ninez`
- hay 4 historias mock: audio, video, texto y foto
- los datos viven en `mjnStories` dentro de `src/lib/mock-data.ts`
- `StoryCard` muestra cada pieza, pero sus acciones son placeholders

## 3. Cobertura actual

### Ya cubierto

- existe un bloque visual específico para memoria y relatos
- hay variedad de tipos de contenido
- el módulo expresa la idea de “solo piezas autorizadas”

### Parcial

- no hay rutas de detalle ni assets reales para abrir/escuchar/ver
- no hay modelo explícito de autorización de publicación; hoy es una suposición del mock
- no hay superficie admin para gestionar estas historias

### No cubierto

- persistencia real de piezas de memoria
- carga o administración real de audio/video/foto/texto

## 4. Qué ajustar o no ampliar en Fase 1

- no convertir este módulo en archivo oral o repositorio audiovisual completo
- mantenerlo como selección curada de piezas autorizadas

## 5. Propuesta docs/

```text
docs/mjn-memoria-relatos/
  requirements.md
  ux-flow.md
  technical-design.md
  content-model.md
  open-questions.md
```

- `requirements.md`: condiciones mínimas para publicar una pieza de memoria.
- `ux-flow.md`: visualización en MJN y acciones posibles por tipo de pieza.
- `technical-design.md`: representación de tipos de media, URLs, permisos y fallback states.
- `content-model.md`: `kind`, título, territorio, año, descripción, duración y URL/asset si aplica.
- `open-questions.md`: si Fase 1 necesita solo tarjetas-resumen o acceso real a cada pieza.

## 6. Resumen

- OK: la sección existe y representa bien el universo de contenidos.
- Ajustar: hoy es vitrina visual, no módulo realmente utilizable.
- Crear desde cero: assets reales, rutas o reproductores mínimos, y persistencia.

