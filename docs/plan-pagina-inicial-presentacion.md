# Gap Analysis Fase 1: 01 · Página inicial / Presentación

**Módulo:** 01 · Página inicial / Presentación  
**Fecha:** 11 de marzo de 2026  
**Fuente principal:** `docs/Plataforma Palenke_ Propuesta_fases_final.pdf`  
**Base de comparación:** implementación actual del mock en Next.js

## 1. Requisitos MVP extraídos del PDF

El PDF no define una ficha funcional detallada para Home. Lo que sí permite inferir, de forma estricta, es:

- debe existir un punto de entrada público a la plataforma
- la plataforma debe comunicar su propósito como portal del Palenke/PCN
- la navegación principal debe conducir a Biblioteca Base, MJN, estadísticas y acceso condicionado al geoportal
- el comportamiento de acceso debe reflejar roles y visibilidad

No aparecen en el PDF, como requisitos cerrados de Fase 1 para Home:

- layout exacto del hero
- campañas en portada como obligación explícita
- estructura detallada de bloques editoriales

## 2. Estado actual del repo

- existe la ruta `/` en `src/app/page.tsx`
- la página muestra hero, texto institucional, accesos rápidos y bloque de campañas visibles por rol
- la portada usa `homeIntro` y `getVisibleCampaigns()` desde `src/lib/mock-data.ts`
- el header cambia según el rol mock y el acceso al geoportal depende de `?role=`

## 3. Cobertura actual

### Ya cubierto

- existe una entrada pública clara al portal
- la página comunica la misión general de la plataforma
- hay accesos visibles a Biblioteca, MJN, Estadísticas y Geoportal

### Parcial

- la navegación por rol existe, pero depende de sesión mock vía query param
- el estado autenticado del header es visual, no real
- el bloque de campañas en portada existe, pero no está claramente especificado en el PDF como obligación del Home

### No cubierto

- no hay autenticación real para que el Home refleje estado real de usuario
- no hay fuente de contenido persistente para textos o destacados del Home

## 4. Qué ajustar o no ampliar en Fase 1

- documentar Home como módulo **inferido**, no como pantalla detallada cerrada por el PDF
- no agregar más bloques editoriales, timelines o experiencia tipo magazine
- no convertir la portada en un CMS complejo en Fase 1

## 5. Propuesta docs/

```text
docs/pagina-inicial-presentacion/
  requirements.md
  navigation.md
  technical-design.md
  content-model.md
  open-questions.md
```

- `requirements.md`: propósito y alcance mínimo del Home. Secciones: objetivos, rutas de entrada, relación con otros módulos, criterios de aceptación. Incluir qué viene del PDF y qué es inferencia.
- `navigation.md`: flujo de navegación pública vs interna. Secciones: header, accesos rápidos, comportamiento por rol, enlaces a módulos. Incluir mapa simple de navegación.
- `technical-design.md`: implementación del Home. Secciones: fuentes de datos, composición de bloques, dependencias de auth/roles. Incluir decisiones sobre qué viene de mock data.
- `content-model.md`: textos y bloques configurables. Secciones: hero, intro institucional, accesos rápidos, destacados. Incluir ejemplos de contenido mock.
- `open-questions.md`: decisiones no cerradas. Secciones: campañas en portada, editabilidad del contenido, gobernanza editorial.

## 6. Resumen

- OK: la plataforma ya tiene una portada funcional y coherente con el propósito general.
- Ajustar: separar claramente lo que el PDF exige de lo que el mock agregó como diseño.
- Crear desde cero: autenticación real y fuente persistente para contenido del Home, si se decide administrarlo.

