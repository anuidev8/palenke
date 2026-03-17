# Mapa completo de conexiones entre pantallas — Palenke v2

Todas las pantallas, todos los clics, todos los destinos. Cada botón de la plataforma tiene un destino definido.

---

## Inventario de pantallas

| # | Pantalla | Archivo de spec | Tipo |
|---|----------|----------------|------|
| 1 | Inicio (Home) | `palenke_home.md` | Pantalla principal |
| 2 | Memoria Afroterritorial | `Memoria Afroterritorial la Biblioteca-módulo de memoria.md` | Módulo |
| 3 | Gobierno propio | `Pantalla: Gobierno propio.md` | Módulo |
| 4 | SCITA | `ACC.md` | Módulo |
| 5 | Detalle de noticia / evento | `detalle_noticia_evento.md` | Sub-pantalla |
| 6 | Listado de documentos | `listado_documentos.md` | Sub-pantalla (plantilla) |
| 7 | Formulario información ambiental | `formulario_informacion_ambiental.md` | Modal / panel |
| 8 | Mirador de datos del territorio | `mirador_datos_territorio.md` | Módulo |
| 9 | Detalle de tablero | `mirador_datos_territorio.md` (sección B) | Sub-pantalla |
| 10 | Geoportal interno | `geoportal_interno.md` | Enlace externo |

---

## Diagrama de flujo (texto)

```
                            ┌─────────────────┐
                            │   INICIO (HOME)  │
                            └────────┬────────┘
                 ┌───────────────────┼───────────────────┐
                 │                   │                   │
                 ▼                   ▼                   ▼
        ┌────────────────┐  ┌───────────────┐  ┌────────────────┐
        │    MEMORIA     │  │   GOBIERNO    │  │     SCITA      │
        │ AFROTERRITORIAL│  │    PROPIO     │  │                │
        └───────┬────────┘  └──────┬────────┘  └───────┬────────┘
                │                  │                    │
        ┌───────┴───────┐  ┌──────┴──────┐     ┌───────┴───────┐
        │               │  │             │     │               │
        ▼               ▼  ▼             │     ▼               ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ LISTADO  │  │ DETALLE  │  │ LISTADO  │  │FORMULARIO│  │ MIRADOR  │
  │ DOCS     │  │ NOTICIA/ │  │ DOCS     │  │ INFO     │  │ DATOS    │
  │(Normativa│  │ EVENTO   │  │(Reglam., │  │AMBIENTAL │  │TERRITORIO│
  │ Mem.viva)│  │          │  │ Planes..)│  │          │  │          │
  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └────┬─────┘
                                                                │
                                                           ┌────▼─────┐
                                                           │ DETALLE  │
                                                           │ TABLERO  │
                                                           │(iframe)  │
                                                           └──────────┘

  Solo internos/admin:
  ┌──────────────┐
  │  GEOPORTAL   │ → abre URL externa en nueva pestaña
  │  INTERNO     │
  └──────────────┘
```

---

## Tabla completa de conexiones

### Desde INICIO (Home)

| Elemento clickeable | Acción | Pantalla destino |
|---------------------|--------|-----------------|
| Menú → Memoria Afroterritorial | Clic | **Memoria Afroterritorial** |
| Menú → Gobierno propio | Clic | **Gobierno propio** |
| Menú → SCITA | Clic | **SCITA** |
| Card "Área de conservación comunitaria" | Clic | **SCITA** (mapa + ACC) |
| Card "Protección hídrica" | Clic | **Gobierno propio** (sección) o **SCITA** |
| Card "SIG Afro" | Clic | **SCITA** o **Geoportal** directo |
| Entérate → noticia | Clic | **Detalle de noticia/evento** |
| Lo último → evento | Clic | **Detalle de noticia/evento** |
| Accesos rápidos → Mirador (si se incluye) | Clic | **Mirador de datos** |

### Desde MEMORIA AFROTERRITORIAL

| Elemento clickeable | Acción | Pantalla destino |
|---------------------|--------|-----------------|
| Menú → Inicio | Clic | **Inicio** |
| Menú → Gobierno propio | Clic | **Gobierno propio** |
| Menú → SCITA | Clic | **SCITA** |
| Video → "Ver más documentos" | Clic | **Listado de documentos** (biblioteca general) |
| Card "Normativa vigente" | Clic | **Listado de documentos** (título: Normativa vigente) |
| Card "Memoria viva del territorio" | Clic | **Listado de documentos** (título: Memoria viva) |
| Vení te contamos → evento | Clic | **Detalle de noticia/evento** |

### Desde GOBIERNO PROPIO

| Elemento clickeable | Acción | Pantalla destino |
|---------------------|--------|-----------------|
| Menú → Inicio | Clic | **Inicio** |
| Menú → Memoria Afroterritorial | Clic | **Memoria Afroterritorial** |
| Menú → SCITA | Clic | **SCITA** |
| Tarjeta "Reglamentos" | Clic | **Listado de documentos** (título: Reglamentos) |
| Tarjeta "Planes de uso y manejo" | Clic | **Listado de documentos** (título: Planes de uso y manejo) |
| Tarjeta "Litigio estratégico" | Clic | **Listado de documentos** (título: Litigio estratégico) |
| Tarjeta "Conservación comunitaria" | Clic | **Listado de documentos** (título: Conservación comunitaria) |
| Tarjeta "Planes de etnodesarrollo" | Clic | **Listado de documentos** (título: Planes de etnodesarrollo) |
| Tarjeta "Protección hídrica" | Clic | **Listado de documentos** (título: Protección hídrica) |

### Desde SCITA

| Elemento clickeable | Acción | Pantalla destino |
|---------------------|--------|-----------------|
| Menú → Inicio | Clic | **Inicio** |
| Menú → Memoria Afroterritorial | Clic | **Memoria Afroterritorial** |
| Menú → Gobierno propio | Clic | **Gobierno propio** |
| Clic en ACC en mapa | Clic | **Ficha ACC** (sub-pantalla) o doc en **Memoria** |
| Capas de información (vista parcial) | Toggle | No cambia pantalla (activa/desactiva capa en mapa). Solo capas prioritarias, no el catálogo SIG completo. |
| "Ir al geoportal SIG" | Clic | **Geoportal** externo en nueva pestaña (SIG completo). Internos: acceso directo. Público: según config. |
| "Ver tableros territoriales" | Clic | **Mirador de datos del territorio** |
| "Enviar información ambiental" | Clic | **Formulario información ambiental** (modal/panel) |
| Geoportal interno (solo internos/admin) | Clic | **Geoportal** (nueva pestaña, URL externa) |

### Desde DETALLE DE NOTICIA/EVENTO

| Elemento clickeable | Acción | Pantalla destino |
|---------------------|--------|-----------------|
| Enlace relacionado → Memoria | Clic | **Memoria Afroterritorial** o **Listado docs** |
| Enlace relacionado → Gobierno | Clic | **Gobierno propio** o **Listado docs** |
| Enlace relacionado → Mirador | Clic | **Mirador de datos** o **Detalle tablero** |
| "Volver al Inicio" | Clic | **Inicio** |
| "Volver a Memoria" | Clic | **Memoria Afroterritorial** |

### Desde LISTADO DE DOCUMENTOS

| Elemento clickeable | Acción | Pantalla destino |
|---------------------|--------|-----------------|
| Breadcrumb → módulo origen | Clic | **Gobierno propio** o **Memoria** |
| Breadcrumb → Inicio | Clic | **Inicio** |
| "Ver / Descargar" | Clic | Abre PDF en nueva pestaña |

### Desde FORMULARIO INFORMACIÓN AMBIENTAL

| Elemento clickeable | Acción | Pantalla destino |
|---------------------|--------|-----------------|
| Cancelar / X | Clic | Cierra → vuelve a **SCITA** |
| Enviar → "Volver al mapa" | Clic | Cierra → vuelve a **SCITA** |
| Enviar → "Ver Memoria" | Clic | **Memoria Afroterritorial** |

### Desde MIRADOR DE DATOS

| Elemento clickeable | Acción | Pantalla destino |
|---------------------|--------|-----------------|
| "Ver tablero" | Clic | **Detalle de tablero** (iframe) |
| Menú / breadcrumb | Clic | **Inicio** u otro módulo |

### Desde DETALLE DE TABLERO

| Elemento clickeable | Acción | Pantalla destino |
|---------------------|--------|-----------------|
| "Volver al Mirador" | Clic | **Mirador de datos** (listado) |
| "Ver en SCITA" | Clic | **SCITA** |
| Breadcrumb | Clic | **Mirador** o **Inicio** |

---

## Resumen: pantallas que faltaban y ahora están cubiertas

| Pantalla nueva | Resuelve el clic de... |
|----------------|----------------------|
| **Detalle noticia/evento** | Entérate, Lo último, Vení te contamos |
| **Listado de documentos** | Normativa vigente, Memoria viva, los 6 botones de Gobierno propio |
| **Formulario info ambiental** | Botón "Enviar información ambiental" en SCITA |
| **Mirador de datos** | "Ver tableros territoriales" desde SCITA, acceso rápido desde Home |
| **Geoportal interno** | Acceso SIG para usuarios internos desde menú o SCITA |

Con estas 5 pantallas adicionales, **todos los botones y clics de la plataforma tienen destino definido**.

---

## Auditoría de wireframes HTML — Estado real de los enlaces (marzo 2026)

Revisión de todos los `href` en los 10 archivos HTML de `wireframes/`. Se clasifica cada enlace como:

- **LIVE** = `href` apunta a un archivo `.html` existente en el proyecto.
- **DEAD** = `href="#"` o el elemento no tiene `<a>` (es un `<div>` sin clic).
- **BY DESIGN** = muerto intencionalmente (abre PDF externo, URL externa, paginación placeholder).

### INICIO (`index.html`) — 6 enlaces muertos

| Elemento | href actual | Estado | Debe ir a |
|----------|------------|--------|-----------|
| Nav → Memoria | `memoria.html` | LIVE | — |
| Nav → Gobierno | `gobierno.html` | LIVE | — |
| Nav → SCITA | `scita.html` | LIVE | — |
| Card "Área conservación" | `scita.html` | LIVE | — |
| Card "SIG Afro" | `scita.html` | LIVE | — |
| **Card "Protección hídrica"** | `#` | **DEAD** | `gobierno.html` o `listado-documentos.html` |
| **Hero "Conoce Nuestra Lucha"** | `#` | **DEAD** | `memoria.html` |
| **"Ver más" (quehacer político)** | `#` | **DEAD** | `gobierno.html` |
| **Entérate → "Leer más" (×2)** | `#` | **DEAD** | `detalle-noticia.html` |
| **Lo último → eventos (×4)** | sin `<a>` | **DEAD** | `detalle-noticia.html` |
| Footer nav (4 módulos) | `.html` | LIVE | — |
| Secondary nav (3 módulos) | `.html` | LIVE | — |
| Contacto / legal (×4) | `#` | DEAD (no esencial) | — |

### MEMORIA AFROTERRITORIAL (`memoria.html`) — 3 enlaces muertos

| Elemento | href actual | Estado | Debe ir a |
|----------|------------|--------|-----------|
| Nav (Inicio, Gobierno, SCITA) | `.html` | LIVE | — |
| **"Normativa vigente" → Explorar** | `#` | **DEAD** | `listado-documentos.html` |
| **"Memoria viva" card → Explorar** | sin `<a>` (`<div>`) | **DEAD** | `listado-documentos.html` |
| **Vení te contamos (×3 cards)** | sin `<a>` | **DEAD** | `detalle-noticia.html` |
| Footer nav | `.html` | LIVE | — |

### GOBIERNO PROPIO (`gobierno.html`) — 6 enlaces muertos

| Elemento | href actual | Estado | Debe ir a |
|----------|------------|--------|-----------|
| Nav (Inicio, Memoria, SCITA) | `.html` | LIVE | — |
| **Card "Reglamentos"** | sin `<a>` (`<div>`) | **DEAD** | `listado-documentos.html` |
| **Card "Planes de uso y manejo"** | sin `<a>` | **DEAD** | `listado-documentos.html` |
| **Card "Litigio estratégico"** | sin `<a>` | **DEAD** | `listado-documentos.html` |
| **Card "Conservación comunitaria"** | sin `<a>` | **DEAD** | `listado-documentos.html` |
| **Card "Planes de etnodesarrollo"** | sin `<a>` | **DEAD** | `listado-documentos.html` |
| **Card "Protección hídrica"** | sin `<a>` | **DEAD** | `listado-documentos.html` |
| Footer nav | `.html` | LIVE | — |

### SCITA (`scita.html`) — 1 enlace muerto

| Elemento | href actual | Estado | Debe ir a |
|----------|------------|--------|-----------|
| Nav (Inicio, Memoria, Gobierno) | `.html` | LIVE | — |
| "Ir al geoportal SIG" | `geoportal.html` | LIVE | — |
| "Ir al Mirador de datos" | `mirador.html` | LIVE | — |
| **"Aportar información" (CTA)** | `#` | **DEAD** | `formulario-ambiental.html` |
| Capas (toggle) | sin link | OK (toggle) | — |
| Footer nav | `.html` | LIVE | — |

### DETALLE NOTICIA (`detalle-noticia.html`) — 0 muertos

| Elemento | href actual | Estado |
|----------|------------|--------|
| Breadcrumb → Inicio | `index.html` | LIVE |
| Related → Listado docs (×2) | `listado-documentos.html` | LIVE |
| Related → Mirador | `mirador.html` | LIVE |
| Volver al Inicio | `index.html` | LIVE |
| Volver a Memoria | `memoria.html` | LIVE |

### LISTADO DOCUMENTOS (`listado-documentos.html`) — 0 muertos críticos

| Elemento | href actual | Estado |
|----------|------------|--------|
| Breadcrumb → Inicio | `index.html` | LIVE |
| Breadcrumb → Gobierno | `gobierno.html` | LIVE |
| Ver PDF (×4) | `#` | BY DESIGN (PDF) |
| Paginación | `#` | BY DESIGN |

### FORMULARIO AMBIENTAL (`formulario-ambiental.html`) — 0 muertos

| Elemento | href actual | Estado |
|----------|------------|--------|
| Volver al mapa | `scita.html` | LIVE |
| Ver Memoria | `memoria.html` | LIVE |

### MIRADOR (`mirador.html`) — 3 muertos + 1 faltante

| Elemento | href actual | Estado | Debe ir a |
|----------|------------|--------|-----------|
| Nav (4 módulos) | `.html` | LIVE | — |
| **"Ver tablero" (×3 cards)** | `#` | **DEAD** | `detalle-tablero.html` (**NO EXISTE**) |
| **Link "Volver a SCITA"** | — | **FALTANTE** | `scita.html` |

### GEOPORTAL (`geoportal.html`) — 0 muertos críticos

| Elemento | href actual | Estado |
|----------|------------|--------|
| Volver a SCITA | `scita.html` | LIVE |
| Ir al Geoportal | `#` | BY DESIGN (URL externa) |

---

## Pantalla faltante: Detalle de tablero (`detalle-tablero.html`)

El inventario de pantallas (sección 3 de SPEC_COMPLETA) lista el **"Detalle de tablero"** como pantalla #9, pero **no existe wireframe HTML**. Debe crearse con:

- Breadcrumb: Inicio > Mirador > [Nombre del tablero]
- Título y descripción del tablero
- iframe Power BI embebido (placeholder)
- Info complementaria (territorio, fecha, fuente)
- Botón "Volver al Mirador" → `mirador.html`
- Enlace opcional "Ver en SCITA" → `scita.html`

---

## Plan de corrección (19 enlaces + 1 pantalla)

### Fase 1 — Crear pantalla faltante
- [ ] Crear `wireframes/detalle-tablero.html` (pantalla #9)

### Fase 2 — Conectar Gobierno Propio (6 enlaces)
- [ ] Envolver las 6 tarjetas `<div class="instrument-card">` en `<a href="listado-documentos.html">`

### Fase 3 — Conectar Memoria Afroterritorial (3 enlaces)
- [ ] Botón "Explorar documentos" (Normativa) → `href="listado-documentos.html"`
- [ ] Card "Memoria viva" → envolver en `<a href="listado-documentos.html">`
- [ ] 3 event cards (Vení te contamos) → envolver en `<a href="detalle-noticia.html">`

### Fase 4 — Conectar Inicio (6 enlaces)
- [ ] Card "Protección hídrica" → `href="gobierno.html"`
- [ ] Hero "Conoce Nuestra Lucha" → `href="memoria.html"`
- [ ] "Ver más" (quehacer) → `href="gobierno.html"`
- [ ] "Leer más" (×2 noticias Entérate) → `href="detalle-noticia.html"`
- [ ] Lo último (×4 eventos) → envolver en `<a href="detalle-noticia.html">`

### Fase 5 — Conectar SCITA + Mirador (4 enlaces)
- [ ] CTA "Aportar información" → `href="formulario-ambiental.html"`
- [ ] Mirador: 3× "Ver tablero" → `href="detalle-tablero.html"`
- [ ] Mirador: añadir enlace "Volver a SCITA" → `href="scita.html"`

### Fase 6 — Re-capturar a Figma
- [ ] Re-capturar todas las pantallas modificadas al archivo Figma
