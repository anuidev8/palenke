# Guía por partes — Informe de cumplimiento Palenke

Documento complementario de [INFORME-CUMPLIMIENTO-OBLIGACIONES-CONTRATO.md](./INFORME-CUMPLIMIENTO-OBLIGACIONES-CONTRATO.md). Aquí se detalla **qué va en cada sección**, **qué campos conviene completar** y **referencias técnicas** del repositorio.

---

## 1. Encabezado del informe

| Campo | Qué poner | Ejemplo |
|-------|-----------|---------|
| Título | Nombre del informe y objeto técnico | Informe de cumplimiento — MVP Palenke |
| Periodo reportado | Mes o rango de fechas del corte | Marzo 2026 |
| Proyecto | Breve descripción del entregable contractual | Plataforma Digital Palenke Pensamiento; incluir stack **frontend** (Next.js, React, TypeScript, Tailwind, etc.) y **backend/datos** (Node.js, PostgreSQL, ORM, almacenamiento, integraciones) según el informe principal |

---

## 2. ACTIVIDADES Y/O PRODUCTOS DEFINIDOS EN EL CONTRATO

**Propósito:** listar lo que el contrato obliga (alcance contractual), no solo lo hecho este mes.

| Elemento | Cómo redactarlo |
|----------|-----------------|
| Cada viñeta | Un producto o paquete de trabajo cerrado (módulo, panel, sistema de roles, documentación). |
| Subviñetas | Detalles medibles (número de macro-secciones, tipos de filtro, integraciones). |
| Evitar | Mezclar aquí el detalle del mes; eso va en la sección de cumplimiento del periodo. |

**Referencia en repo:** planes y especificación general en `docs/plan-modulos-fase1-index.md`, `docs/Palenke mvp mockup blueprint.md`.

---

## 3. CUMPLIMIENTO — ACTIVIDADES REALIZADAS DURANTE EL PERIODO REPORTADO

**Propósito:** solo lo **entregado/validado en el mes** (o en el periodo que reporte la entidad).

**Tabla sugerida (columnas):**

| Columna | Contenido |
|---------|-----------|
| Actividad / producto | Nombre corto alineado al requerimiento del usuario o al plan mensual. |
| Resultados | Qué quedó funcionando o visible para el cliente (en lenguaje no técnico + 1 línea técnica si aplica). |
| Soportes | Rutas de código, URL de demo, o “ver Anexo X”. |

**Filas del informe principal (mapeo técnico):**

| Actividad en informe | Archivos / rutas útiles en el proyecto |
|----------------------|----------------------------------------|
| Inicio | `src/app/page.tsx`, `src/app/layout.tsx` |
| Enterate / Lo último (novedades) | `src/app/noticias/page.tsx`, `src/app/noticias/[slug]/page.tsx`, `src/app/incidencia/page.tsx` |
| Memoria Afroterritorial | `src/app/memoria-afroterritorial/page.tsx`, listado `src/app/biblioteca/page.tsx` |
| SCITA | `src/app/scita/page.tsx`, `src/app/scita/formulario/page.tsx` |
| Gobierno propio | `src/app/gobierno-propio/page.tsx`, `src/app/gobierno-propio/[instrumento]/page.tsx` |
| Ajuste visual PCN | Mismas páginas anteriores + componentes en `src/components/` |
| Contenido visual (marca) | `src/app/admin/contenido-visual/page.tsx`, APIs `src/app/api/admin/visual-content/` |

**Nota de alcance:** conviene repetir explícitamente si el periodo es solo avance parcial del MVP o cierre de hito.

---

## 4. INFORME NARRATIVO — LECCIONES APRENDIDAS

**Propósito:** texto cualitativo coherente con la tabla del periodo (no ampliar a todo el MVP si el informe es mensual).

### 4.1 LOGROS

- Un logro por línea de la tabla de cumplimiento, en orden de importancia para el cliente.
- Redacción: **qué se logró** + **para quién sirve** (equipo PCN, lectores, administración).

### 4.2 RETOS

- Dificultades reales del periodo: comunicación, priorización, diseño, contenido, plazos.
- Evitar retos genéricos que no aplicaron al mes reportado.

### 4.3 ADAPTACIÓN A LOS RETOS

- Cómo se cambió la forma de trabajo, la comunicación o el entregable ante esos retos.
- Puede ser una sola síntesis o viñetas cortas; debe cuadrar con lo descrito en LOGROS y RETOS.

---

## 5. ANEXOS

**Documento dedicado (catálogo, plantillas, inventario de capturas):** [INFORME-CUMPLIMIENTO-ANEXOS.md](./INFORME-CUMPLIMIENTO-ANEXOS.md)

Resumen: el cuerpo del informe cita rutas de código; los **anexos** concentran capturas, PDF, actas y tablas de entregables. Reglas de numeración, nombres de archivo y tablas listas para copiar están en el enlace anterior.

---

## 6. Nota sobre soportes (¹)

- **Soportes en el cuerpo:** referencias a archivos del código (`src/...`).
- **Anexos:** archivos binarios o documentos externos numerados.

---

## 7. Cómo usar los archivos del informe

1. Redactar o pegar el contenido breve en `INFORME-CUMPLIMIENTO-OBLIGACIONES-CONTRATO.md`.
2. Usar este archivo (`INFORME-CUMPLIMIENTO-OBLIGACIONES-CONTRATO-PARTES.md`) como **checklist** y guía por sección.
3. Montar carpetas y PDF de anexos con `INFORME-CUMPLIMIENTO-ANEXOS.md` (inventario de capturas y plantillas A–F).

---

## 8. Plantillas en blanco (copiar al Word o completar aquí)

### 8.1 Encabezado

- **Contratista / ejecutor:**  
- **Contratante / supervisión:**  
- **Objeto del contrato (1 frase):**  
- **Periodo reportado (desde — hasta):**  
- **Ciudad y fecha del informe:**

### 8.2 Actividades contratadas (solo lista contractual)

> Una viñeta por obligación del contrato. Si el contrato numera cláusulas o anexos, cite el número al final de cada viñeta.

| # | Actividad o producto contractual | Referencia contractual (opcional) |
|---|----------------------------------|-----------------------------------|
| 1 | | |
| 2 | | |
| 3 | | |

### 8.3 Cumplimiento del periodo (tabla operativa)

| # | Actividad realizada | Resultado observable | Fecha o sprint | Soportes / anexo |
|---|---------------------|----------------------|----------------|------------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

### 8.4 Lecciones aprendidas (borrador)

**Logros**  
-  
-  

**Retos**  
-  
-  

**Adaptación**  
-  

---

## 9. Checklist antes de entregar el informe

- [ ] Encabezado con periodo y firmas o espacio para firmas (si aplica).
- [ ] Sección contractual separada de la sección del mes.
- [ ] Cada fila de cumplimiento tiene **resultado** + **soporte** o **anexo**.
- [ ] Lecciones aprendidas alineadas con la tabla del periodo (sin inventar módulos no trabajados).
- [ ] Anexos numerados (A, B, C…) y citados al menos una vez en el texto.
- [ ] Ortografía y unificación de nombres propios (PCN, SCITA, Memoria Afroterritorial, Gobierno propio).

---

## 10. Mapa rápido: sección del informe → archivo principal

| En el informe breve ([INFORME-CUMPLIMIENTO-OBLIGACIONES-CONTRATO.md](./INFORME-CUMPLIMIENTO-OBLIGACIONES-CONTRATO.md)) | En esta guía |
|------------------------------------------------------------------------------------------------------------------------|---------------|
| Título y periodo | §1 Encabezado |
| Actividades contratadas | §2 |
| Actividades del periodo | §3 |
| Lecciones aprendidas | §4 |
| Anexos | §5 → [INFORME-CUMPLIMIENTO-ANEXOS.md](./INFORME-CUMPLIMIENTO-ANEXOS.md) |
| Nota ¹ soportes | §6 |
