# Gap Analysis Fase 1: 08 · Página MJN – Documentos y rutas

**Módulo:** 08 · Página MJN – Documentos y rutas  
**Fecha:** 11 de marzo de 2026  
**Fuente principal:** `docs/Plataforma Palenke_ Propuesta_fases_final.pdf`  
**Secciones usadas:** 2.3, 2.5, 3.1, 4

## 1. Requisitos MVP extraídos del PDF

La página MJN debe incluir:

- listado de documentos etiquetados para esta agenda
- rutas de litigio con enfoque de género
- materiales pedagógicos específicos
- contenidos de memoria y relatos, cuando estén disponibles

## 2. Estado actual del repo

- `/mujeres-juventudes-ninez` tiene tabs `all`, `litigio`, `pedagogico`, `memorias`
- la data sale de `getVisibleMjnDocuments()`
- la asignación MJN se modela desde documentos con `genderFocus` y `mjnTags`
- la gestión admin documental sí muestra campos de vinculación MJN en `DocumentForm`

## 3. Cobertura actual

### Ya cubierto

- hay un listado específico de documentos para MJN
- existe separación funcional entre litigio, pedagógico y memorias
- el modelo documental ya soporta tags MJN y enfoque de género

### Parcial

- las tarjetas usadas en MJN no abren el detalle del documento
- el tab `memorias` depende de una heurística simple (`video` o `Cartilla`), no de un modelo documental específico para memoria/relatos
- toda la lógica de visibilidad sigue siendo mock

### No cubierto

- backend real para etiquetado y publicación
- validación/persistencia real de la vinculación MJN

## 4. Qué ajustar o no ampliar en Fase 1

- no crear un repositorio paralelo al de Biblioteca; la reutilización de documentos ya es la dirección correcta
- definir mejor el criterio de “memorias” antes de endurecerlo en código o DB

## 5. Propuesta docs/

```text
docs/mjn-documentos-rutas/
  requirements.md
  ux-flow.md
  technical-design.md
  content-model.md
  open-questions.md
```

- `requirements.md`: criterios para que un documento pertenezca a MJN.
- `ux-flow.md`: navegación por tabs, acceso al detalle y relación con Biblioteca.
- `technical-design.md`: reglas de tagging, filtros, visibilidad y reutilización.
- `content-model.md`: `mjnTags`, `genderFocus`, sección fuente y comportamiento por tab.
- `open-questions.md`: definición exacta del tab `memorias` y criterios de curaduría.

## 6. Resumen

- OK: la estructura temática existe y reutiliza bien el modelo documental.
- Ajustar: tarjetas sin link y criterio incompleto del tab de memorias.
- Crear desde cero: persistencia, auth y tagging real.

