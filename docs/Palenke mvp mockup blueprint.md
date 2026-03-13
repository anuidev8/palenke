# Plataforma Palenke — MVP Fase 1
# Blueprint Completo: Mockups, Flujos y Documentación de Diseño

> **Propósito de este documento:** Guía exhaustiva para que un diseñador pueda construir mockups low-fidelity completos sin necesidad de hacer preguntas adicionales. Cada módulo, pantalla, componente, estado e interacción está descrito en detalle.

---

## ÍNDICE

1. [Contexto y objetivos del MVP](#1-contexto-y-objetivos-del-mvp)
2. [Sistema de roles y visibilidad](#2-sistema-de-roles-y-visibilidad)
3. [Mapa del sitio y navegación](#3-mapa-del-sitio-y-navegacion)
4. [Módulos y páginas — descripción detallada](#4-modulos-y-paginas)
   - 4.1 [Página de inicio (Home)](#41-pagina-de-inicio-home)
   - 4.2 [Biblioteca Base — Listado](#42-biblioteca-base--listado)
   - 4.3 [Biblioteca Base — Detalle de documento](#43-biblioteca-base--detalle-de-documento)
   - 4.4 [Página Mujeres, Juventudes y Niñez (MJN)](#44-pagina-mujeres-juventudes-y-ninez-mjn)
   - 4.5 [Detalle de campaña](#45-detalle-de-campana)
   - 4.6 [Estadísticas y Tableros — Listado](#46-estadisticas-y-tableros--listado)
   - 4.7 [Estadísticas y Tableros — Detalle (embed Power BI)](#47-estadisticas-y-tableros--detalle-embed-power-bi)
   - 4.8 [Geoportal Interno — Acceso](#48-geoportal-interno--acceso)
   - 4.9 [Login](#49-login)
   - 4.10 [Panel Admin — Home](#410-panel-admin--home)
   - 4.11 [Panel Admin — Gestión de Documentos (Biblioteca)](#411-panel-admin--gestion-de-documentos)
   - 4.12 [Panel Admin — Crear / Editar Documento](#412-panel-admin--crear--editar-documento)
   - 4.13 [Panel Admin — Gestión de Dashboards Power BI](#413-panel-admin--gestion-de-dashboards-power-bi)
   - 4.14 [Panel Admin — Crear / Editar Dashboard](#414-panel-admin--crear--editar-dashboard)
   - 4.15 [Panel Admin — Gestión de ACCs](#415-panel-admin--gestion-de-accs)
   - 4.16 [Panel Admin — Crear / Editar ACC](#416-panel-admin--crear--editar-acc)
   - 4.17 [Panel Admin — Gestión de Usuarios](#417-panel-admin--gestion-de-usuarios)
   - 4.18 [Panel Admin — Campañas / Contenidos Destacados](#418-panel-admin--campanas--contenidos-destacados)
5. [Flujos de usuario detallados](#5-flujos-de-usuario-detallados)
   - 5.1 [Flujo: Usuario público navega el sitio](#51-flujo-usuario-publico-navega-el-sitio)
   - 5.2 [Flujo: Usuario interno accede a recursos protegidos](#52-flujo-usuario-interno-accede-a-recursos-protegidos)
   - 5.3 [Flujo: Admin gestiona documentos, dashboards y ACCs](#53-flujo-admin-gestiona-documentos-dashboards-y-accs)
6. [Componentes de UI transversales](#6-componentes-de-ui-transversales)
7. [Comportamiento de visibilidad en UI](#7-comportamiento-de-visibilidad-en-ui)
8. [Elementos legales, privacidad y seguridad](#8-elementos-legales-privacidad-y-seguridad)
9. [Estados de error y éxito](#9-estados-de-error-y-exito)
10. [Notas para el diseñador](#10-notas-para-el-disenador)

---

## 1. Contexto y Objetivos del MVP

### 1.1 Qué es la Plataforma Palenke
Portal web del Palenke de Pensamiento y Cuidadores del Territorio / Proceso de Comunidades Negras (PCN), Colombia. Es el espacio digital donde se organiza, custodia y comunica el trabajo político, técnico y comunitario del Palenke y el PCN.

### 1.2 Objetivos del MVP (Fase 1)
- Organizar y hacer accesible el corpus documental del Palenke (Biblioteca Base)
- Visibilizar la agenda de Mujeres, Juventudes y Niñez negra
- Conectar con tableros de estadísticas (Power BI) y el geoportal SIG del equipo Hileros/PCN
- Dar autonomía al equipo Palenke/Hileros para gestionar contenidos sin depender del desarrollador
- Proteger información sensible mediante niveles de visibilidad y control de acceso por roles

### 1.3 Principios de diseño a respetar
- La comunidad y los consejos comunitarios son el eje político: el diseño debe honrar esto
- Accesibilidad para conexiones lentas (3G): páginas ligeras, sin animaciones pesadas
- El sistema de visibilidad (público/interno/sensible) es no negociable: cada elemento de UI debe reflejarlo
- Nada de datos SIG se almacena en la plataforma: solo enlaces y metadatos

---

## 2. Sistema de Roles y Visibilidad

### 2.1 Roles de usuario

| Rol | Autenticación | Qué puede ver | Qué puede hacer |
|-----|--------------|---------------|-----------------|
| **Público** | Sin login | Contenidos marcados como "Público" | Ver, filtrar, buscar, descargar públicos |
| **Interno (Palenke/Hileros)** | Login requerido | Público + Interno + Geoportal + Dashboards internos | Ver, filtrar, buscar, descargar internos |
| **Admin (coordinación/técnico)** | Login requerido | Todo lo anterior | Crear, editar, definir visibilidad, gestionar usuarios |

### 2.2 Niveles de visibilidad por recurso

| Nivel | Icono sugerido | Comportamiento en UI |
|-------|---------------|---------------------|
| 🟢 **Público** | Globo / mundo abierto | Aparece en listados públicos. Descarga disponible sin login |
| 🔒 **Interno** | Candado cerrado | No aparece en listados para el público. Solo visible tras login. Etiqueta "Solo para miembros" |
| ⛔ **Sensible/Restringido** | Escudo / prohibido | No aparece en ningún listado web (ni público ni interno). Admin puede ver solo el título sin enlace en panel privado |

### 2.3 Regla de filtrado automático
El frontend nunca muestra recursos que el usuario no puede ver:
- Usuario público → solo ve recursos `visibilidad = Público`
- Usuario interno/admin → ve recursos `visibilidad = Público` y `visibilidad = Interno`
- Recurso `Sensible` → nunca aparece en interfaz web

---

## 3. Mapa del Sitio y Navegación

### 3.1 Navegación Pública (sin login)

```
/ (Inicio / Home)
├── /biblioteca
│   ├── /biblioteca?seccion=gobierno-propio
│   ├── /biblioteca?seccion=planes-uso-manejo
│   ├── /biblioteca?seccion=planes-etnodesarrollo
│   ├── /biblioteca?seccion=rutas-litigio
│   ├── /biblioteca?seccion=produccion-tecnica
│   └── /biblioteca?seccion=material-pedagogico
│       └── /biblioteca/[slug-documento]  (detalle)
├── /mujeres-juventudes-ninez
│   └── /mujeres-juventudes-ninez/campanas/[slug]  (detalle campaña)
├── /estadisticas
│   └── /estadisticas/[slug-tablero]  (solo tableros públicos)
└── /login  (enlace en header)
```

### 3.2 Navegación Interna (con login — rol Interno o Admin)

```
Todo lo anterior, más:
├── /estadisticas/[slug-tablero]  (tableros internos visibles)
└── /geoportal  (enlace visible solo con login)
```

### 3.3 Panel Admin (solo rol Admin)

```
/admin  (home del panel)
├── /admin/documentos  (listado)
│   ├── /admin/documentos/nuevo
│   └── /admin/documentos/[id]/editar
├── /admin/dashboards  (listado)
│   ├── /admin/dashboards/nuevo
│   └── /admin/dashboards/[id]/editar
├── /admin/accs  (listado)
│   ├── /admin/accs/nuevo
│   └── /admin/accs/[id]/editar
├── /admin/usuarios  (listado)
│   ├── /admin/usuarios/nuevo
│   └── /admin/usuarios/[id]/editar
└── /admin/campanas  (gestión de contenidos destacados)
    ├── /admin/campanas/nueva
    └── /admin/campanas/[id]/editar
```

### 3.4 Estructura del menú de navegación principal

**Header — versión Público:**
```
[Logo Palenke]   [Inicio] [Biblioteca] [Mujeres/Juventudes/Niñez] [Estadísticas]   [Iniciar sesión]
```

**Header — versión Interno/Admin (con login):**
```
[Logo Palenke]   [Inicio] [Biblioteca] [Mujeres/Juventudes/Niñez] [Estadísticas] [Geoportal]   [Usuario ▼] [Cerrar sesión]
```
El ítem "Geoportal" aparece únicamente cuando el usuario está autenticado.
El botón "Iniciar sesión" se reemplaza por nombre del usuario + menú desplegable con "Ir al Panel" (si es Admin) y "Cerrar sesión".

**Footer:**
```
[Logo]  [Descripción breve]  |  Biblioteca | MJN | Estadísticas  |  Política de tratamiento de datos  |  Contacto
```

---

## 4. Módulos y Páginas

---

### 4.1 Página de Inicio (Home)

**URL:** `/`
**Objetivo:** Dar la bienvenida, explicar qué es el Palenke/PCN y la plataforma, y guiar al visitante hacia los módulos principales.
**Usuarios:** Público, Interno, Admin

#### Layout (de arriba a abajo)

```
┌─────────────────────────────────────────────────────┐
│ HEADER — navegación global (ver §3.4)               │
├─────────────────────────────────────────────────────┤
│ HERO SECTION                                        │
│  - Imagen de fondo: fotografía territorial real     │
│    (río, selva, comunidad) — full width             │
│  - Superposición oscura semitransparente            │
│  - Texto centrado:                                  │
│    Título principal: "Plataforma Palenke"           │
│    Subtítulo: 1 línea describiendo la plataforma    │
│    [Botón CTA] → "Explorar la Biblioteca"           │
├─────────────────────────────────────────────────────┤
│ BLOQUE DE PRESENTACIÓN                              │
│  - Logo del Palenke/PCN (izquierda o centrado)      │
│  - Texto institucional: 2-3 párrafos                │
│    (quiénes son / para qué sirve / a quién sirve)   │
├─────────────────────────────────────────────────────┤
│ SECCIÓN: ACCESOS RÁPIDOS A MÓDULOS                  │
│  Grid de 3-4 tarjetas (cards):                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │  Icono   │ │  Icono   │ │  Icono   │            │
│  │Biblioteca│ │  MJN     │ │Estadíst. │            │
│  │  Base    │ │          │ │          │            │
│  │[Explorar]│ │[Explorar]│ │[Ver datos│            │
│  └──────────┘ └──────────┘ └──────────┘            │
├─────────────────────────────────────────────────────┤
│ BLOQUE: CONTENIDOS DESTACADOS / CAMPAÑAS            │
│  - Título de sección: "Campañas y contenidos        │
│    prioritarios"                                    │
│  - Cards horizontales (máx. 2-3 campañas activas)  │
│    Cada card: imagen | título | texto breve | [Ver] │
│  - Si no hay campañas activas: sección oculta       │
├─────────────────────────────────────────────────────┤
│ FOOTER — pie de página global (ver §3.4)            │
└─────────────────────────────────────────────────────┘
```

#### Componentes detallados

**Hero:**
- Imagen: full-width, height 60-70vh
- Overlay: `rgba(0,0,0,0.45)` sobre la imagen
- Título: h1, ~36px, blanco
- Subtítulo: párrafo corto, ~18px, blanco
- Botón CTA primario: fondo sólido (ochre/dorado), texto oscuro, bordes redondeados, hover con ligero cambio de tono

**Cards de accesos rápidos:**
- 3 columnas en desktop, 1 columna en mobile
- Cada card: ícono (SVG), título del módulo, descripción de 1 línea, botón "Explorar →"
- Fondo claro, borde sutil, hover con sombra

**Cards de campañas:**
- Imagen (rectangular 16:9), título de campaña, texto de máx. 100 palabras, botón "Ver campaña →"
- Si la campaña es `Interna`: solo se muestra para usuarios autenticados (aplicar misma lógica de visibilidad)

---

### 4.2 Biblioteca Base — Listado

**URL:** `/biblioteca`
**Objetivo:** Permitir explorar y filtrar el corpus documental completo del Palenke.
**Usuarios:** Público (ve solo documentos Públicos), Interno/Admin (ve también Internos)

#### Layout

```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
├─────────────────────────────────────────────────────┤
│ BREADCRUMB: Inicio > Biblioteca Base                │
├──────────────────┬──────────────────────────────────┤
│ SIDEBAR FILTROS  │ ÁREA PRINCIPAL DE RESULTADOS     │
│ (izquierda)      │ (derecha)                        │
│                  │                                  │
│ [Buscador texto  │ Subtítulo: "Biblioteca Base"     │
│  libre]          │ Descripción breve del módulo     │
│                  │                                  │
│ Filtro: Sección  │ Contador: "X documentos          │
│  □ Gobierno      │  encontrados"                    │
│    Propio        │                                  │
│  □ Planes uso    │ Ordenar por: [Más reciente ▼]    │
│  □ Planes etno   │                                  │
│  □ Rutas litigio │ ┌──────────────────────────────┐ │
│  □ Prod. técnica │ │ CARD DOCUMENTO               │ │
│  □ Mat. pedagóg. │ │ [🔒 Interno] o [🌐 Público]  │ │
│                  │ │ Título del documento           │ │
│ Filtro: Territ.  │ │ Sección · Territorio · Año    │ │
│  [Selector ▼]    │ │ Descripción breve (2 líneas)   │ │
│                  │ │ Palabras clave: tag tag tag    │ │
│ Filtro: Tipo     │ │           [Descargar / Ver →]  │ │
│  [Selector ▼]    │ └──────────────────────────────┘ │
│                  │ ┌──────────────────────────────┐ │
│ Filtro: Año      │ │ CARD DOCUMENTO               │ │
│  [Selector ▼]    │ │ ...                          │ │
│                  │ └──────────────────────────────┘ │
│ Filtro: Enfoque  │                                  │
│  □ Con enfoque   │ [Cargar más] o paginación        │
│    de género     │                                  │
│                  │                                  │
│ [Limpiar filtros]│                                  │
└──────────────────┴──────────────────────────────────┘
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

#### Componentes del sidebar (filtros)

**Buscador de texto libre:**
- Input tipo `search`, placeholder: "Buscar por título o palabra clave…"
- Icono lupa a la izquierda dentro del input
- Búsqueda en tiempo real (debounce 300ms) o con botón "Buscar"
- Al tener texto activo: mostrar [×] para limpiar

**Filtros:**
- Todos colapsables/expandibles con toggle (▾/▴)
- Sección: checkboxes múltiples (se puede seleccionar más de una)
- Territorio: selector dropdown con opciones dinámicas
- Tipo de instrumento: selector dropdown
- Año: selector dropdown (o rango desde-hasta)
- Enfoque de género: checkbox simple
- Botón "Limpiar filtros" al final: solo visible si hay algún filtro activo

**Estado de filtros activos:**
- Chips/etiquetas sobre el listado mostrando filtros activos: `[Gobierno Propio ×] [2022 ×]`
- Al hacer clic en [×] se remueve ese filtro

#### Componentes del card de documento

```
┌────────────────────────────────────────────┐
│ [BADGE VISIBILIDAD] — arriba derecha:       │
│   🌐 Público  ó  🔒 Interno                │
│                                            │
│ TÍTULO DEL DOCUMENTO                       │
│ (h3, hasta 2 líneas, luego truncar)        │
│                                            │
│ Metadatos en línea (gris, tamaño pequeño): │
│ Sección · Territorio · Año                 │
│                                            │
│ DESCRIPCIÓN BREVE (2 líneas, truncar)      │
│                                            │
│ TAGS: [gobierno propio] [río Naya] [2022]  │
│                                            │
│                    [Descargar] ó [Ver →]   │
└────────────────────────────────────────────┘
```

**Nota sobre el botón de acción:**
- Si el documento tiene archivo adjunto (PDF): botón "Descargar" con ícono de descarga
- Si el documento es un enlace externo: botón "Ver →" que abre nueva pestaña
- Si el usuario es Público y el documento es Interno: el card directamente NO aparece en el listado (no se muestra mensaje de "no tienes acceso")

#### Estado vacío (sin resultados)
```
┌────────────────────────────────────────────┐
│        🔍                                  │
│   No encontramos documentos                │
│   con los filtros seleccionados.           │
│   [Limpiar filtros]                        │
└────────────────────────────────────────────┘
```

#### Estado de carga
- Skeleton loaders (rectángulos grises pulsantes) en lugar de los cards mientras cargan

---

### 4.3 Biblioteca Base — Detalle de Documento

**URL:** `/biblioteca/[slug-documento]`
**Objetivo:** Mostrar toda la información de un documento y permitir su descarga.
**Usuarios:** Según visibilidad del documento

#### Layout

```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
├─────────────────────────────────────────────────────┤
│ BREADCRUMB: Inicio > Biblioteca > [Sección] >       │
│             [Título truncado]                       │
├─────────────────────────────────────────────────────┤
│ CONTENIDO PRINCIPAL                                 │
│                                                     │
│  [BADGE] 🌐 Público  ó  🔒 Solo para miembros      │
│                                                     │
│  H1: Título completo del documento                  │
│                                                     │
│  METADATOS (tabla o lista de definición):           │
│  ┌─────────────────┬───────────────────────┐        │
│  │ Sección         │ Gobierno Propio        │        │
│  │ Tipo            │ Reglamento interno     │        │
│  │ Territorio      │ Río Naya               │        │
│  │ Municipio       │ López de Micay         │        │
│  │ Año             │ 2021                   │        │
│  │ Vigencia        │ Vigente                │        │
│  │ Enfoque género  │ Sí                     │        │
│  └─────────────────┴───────────────────────┘        │
│                                                     │
│  DESCRIPCIÓN:                                       │
│  Texto completo de la descripción del documento.   │
│                                                     │
│  PALABRAS CLAVE:                                    │
│  [gobierno propio] [reglamento] [Naya] [2021]       │
│                                                     │
│  ─────────────────────────────────────────          │
│  [Botón principal: ⬇ Descargar PDF]                 │
│  Tamaño del archivo: X MB                           │
│  ─────────────────────────────────────────          │
│                                                     │
│  ← Volver a la Biblioteca                           │
└─────────────────────────────────────────────────────┘
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

#### Comportamiento de acceso

- Si el usuario es **Público** e intenta acceder vía URL directa a un documento **Interno**: mostrar página de "acceso restringido" con mensaje y botón "Iniciar sesión"
- Si el documento es **Sensible**: URL no existe / redirige a 404 o a Biblioteca

#### Documento con video embebido
Si el tipo es Video (enlace YouTube/Vimeo):
- En lugar del botón "Descargar": mostrar iframe del video (responsive, 16:9)
- Debajo del iframe: enlace "Ver en YouTube/Vimeo" como respaldo

---

### 4.4 Página Mujeres, Juventudes y Niñez (MJN)

**URL:** `/mujeres-juventudes-ninez`
**Objetivo:** Centralizar la agenda de MJN negra con contexto político, documentos etiquetados, materiales audiovisuales, memoria y campañas.
**Usuarios:** Público e Interno (misma página, diferente contenido visible según rol)

#### Layout

```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
├─────────────────────────────────────────────────────┤
│ BLOQUE HERO/ENCABEZADO DE SECCIÓN                   │
│  - Imagen representativa (mujeres/jóvenes/niñez     │
│    en contexto territorial) — full width            │
│  - Superposición + título: "Mujeres, Juventudes     │
│    y Niñez"                                         │
│  - Subtítulo: 1 línea sobre la agenda               │
├─────────────────────────────────────────────────────┤
│ BLOQUE: TEXTO POLÍTICO DE CONTEXTO                  │
│  - Título de sección: h2                            │
│  - Cuerpo: 3-4 párrafos (texto editable desde admin)│
│  - Si hay cita destacada: bloque visual diferenciado│
│    (borde izquierdo, tipografía mayor, itálica)     │
├─────────────────────────────────────────────────────┤
│ BLOQUE: DOCUMENTOS Y MATERIALES                     │
│  - Título de sección: "Documentos y materiales"     │
│  - Sub-filtro horizontal (tabs o pills):            │
│    [Todos] [Rutas de litigio] [Pedagógico]          │
│    [Memorias y relatos]                             │
│  - Grid de cards de documentos                      │
│    (mismo componente que Biblioteca Base)           │
│  - Botón al final: "Ver todos en la Biblioteca →"   │
├─────────────────────────────────────────────────────┤
│ BLOQUE: MEMORIA Y RELATOS                           │
│  (solo si hay piezas publicadas con autorización)   │
│  - Título de sección: "Memoria y relatos"           │
│  - Grid de cards multimedia:                        │
│    - Card Texto: ícono documento + título + extracto│
│    - Card Audio: ícono audio + título + duración    │
│      + botón "Escuchar"                             │
│    - Card Video: thumbnail + ícono play + título    │
│      + duración                                     │
│    - Card Foto: imagen preview + título             │
│  - Si no hay piezas: sección oculta                 │
│    (o mensaje "Próximamente" si el admin configura) │
├─────────────────────────────────────────────────────┤
│ BLOQUE: CAMPAÑAS Y CONTENIDOS DESTACADOS            │
│  - Título de sección: "Campañas"                    │
│  - Cards de campaña (imagen + título + texto +      │
│    botón "Ver campaña")                             │
│  - Si no hay campañas activas: sección oculta       │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

#### Card multimedia (para Memoria y relatos)

```
╔══════════════════════════╗  ╔══════════════════════════╗
║ [🎥 Thumbnail / overlay] ║  ║ [🎵 Ícono audio grande]   ║
║  ▶ (ícono play centrado) ║  ║                          ║
╠══════════════════════════╣  ╠══════════════════════════╣
║ Título de la pieza       ║  ║ Título del testimonio    ║
║ Territorio · Año         ║  ║ Territorio · Año         ║
║ Descripción breve        ║  ║ Duración: 12 min         ║
║ [▶ Ver video]            ║  ║ [▶ Escuchar]             ║
╚══════════════════════════╝  ╚══════════════════════════╝
```

---

### 4.5 Detalle de Campaña

**URL:** `/mujeres-juventudes-ninez/campanas/[slug]`
**Objetivo:** Mostrar información completa de una campaña y permitir descargar sus materiales.
**Usuarios:** Según visibilidad (Público o Interno)

#### Layout

```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
├─────────────────────────────────────────────────────┤
│ BREADCRUMB: Inicio > MJN > [Nombre campaña]         │
├─────────────────────────────────────────────────────┤
│ IMAGEN DE PORTADA DE CAMPAÑA (full width, 16:9)     │
├─────────────────────────────────────────────────────┤
│ CONTENIDO PRINCIPAL                                 │
│                                                     │
│  H1: Nombre de la campaña                           │
│  Fechas: [Inicio: DD/MM/AAAA] — [Fin: indefinido]  │
│                                                     │
│  TEXTO DE PRESENTACIÓN (hasta 100 palabras)         │
│                                                     │
│  MATERIALES DESCARGABLES:                           │
│  Subtítulo: "Materiales de la campaña"              │
│  ┌──────────────────────────────────────┐           │
│  │ 📄 Afiche de campaña    [Descargar] │           │
│  │ 📚 Cartilla formativa   [Descargar] │           │
│  │ 🎥 Video de campaña     [Ver ▶]     │           │
│  └──────────────────────────────────────┘           │
│                                                     │
│  ← Volver a Mujeres, Juventudes y Niñez             │
└─────────────────────────────────────────────────────┘
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

### 4.6 Estadísticas y Tableros — Listado

**URL:** `/estadisticas`
**Objetivo:** Mostrar el catálogo de tableros de Power BI disponibles, con filtros por tema y territorio.
**Usuarios:** Público (ve tableros Públicos), Interno/Admin (ve también tableros Internos)

#### Layout

```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
├─────────────────────────────────────────────────────┤
│ BREADCRUMB: Inicio > Estadísticas y tableros        │
├─────────────────────────────────────────────────────┤
│ ENCABEZADO DE SECCIÓN                               │
│  H1: "Estadísticas y tableros"                      │
│  Párrafo descriptivo breve                          │
│  Nota informativa (callout): "Los tableros son       │
│  generados por el equipo SIG de Hileros/PCN. Los    │
│  filtros y mapas son parte de Power BI."            │
├──────────────────┬──────────────────────────────────┤
│ SIDEBAR FILTROS  │ GRID DE CARDS DE TABLEROS        │
│                  │                                  │
│ Filtro: Tema     │ ┌──────────┐ ┌──────────┐        │
│  [Selector ▼]    │ │  CARD    │ │  CARD    │        │
│                  │ │ Tablero  │ │ Tablero  │        │
│ Filtro: Territ.  │ │          │ │          │        │
│  [Selector ▼]    │ └──────────┘ └──────────┘        │
│                  │                                  │
│ [Limpiar]        │ ┌──────────┐ ┌──────────┐        │
│                  │ │  CARD    │ │  CARD    │        │
└──────────────────┴──────────────────────────────────┘
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

#### Card de tablero

```
┌────────────────────────────────────────┐
│ [🌐 Público] ó [🔒 Solo miembros]     │
│                                        │
│ TÍTULO DEL TABLERO                     │
│                                        │
│ DESCRIPCIÓN (qué pregunta responde)    │
│ (2 líneas, luego truncar)              │
│                                        │
│ Tema: Biodiversidad   Territorio: Naya │
│ Período de datos: 2020–2023            │
│                                        │
│               [Ver tablero →]          │
└────────────────────────────────────────┘
```

- Tableros Internos: no visibles para usuarios Públicos

---

### 4.7 Estadísticas y Tableros — Detalle (embed Power BI)

**URL:** `/estadisticas/[slug-tablero]`
**Objetivo:** Mostrar el tablero de Power BI embebido en iframe.
**Usuarios:** Según visibilidad del tablero

#### Layout

```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
├─────────────────────────────────────────────────────┤
│ BREADCRUMB: Inicio > Estadísticas > [Nombre]        │
├─────────────────────────────────────────────────────┤
│ ENCABEZADO DEL TABLERO                              │
│  [🔒 Solo miembros] ó [🌐 Público]                  │
│  H1: Título del tablero                             │
│  Descripción: "¿Qué pregunta responde este tablero?"│
│  Metadatos: Tema · Territorio · Período de datos    │
├─────────────────────────────────────────────────────┤
│ IFRAME POWER BI                                     │
│ ┌───────────────────────────────────────────────┐   │
│ │                                               │   │
│ │         [Contenido de Power BI]               │   │
│ │         width: 100%, height: 600px            │   │
│ │         (responsive)                          │   │
│ │                                               │   │
│ └───────────────────────────────────────────────┘   │
│                                                     │
│ NOTA INFORMATIVA:                                   │
│ "Los filtros, mapas y datos de este tablero son     │
│  gestionados por el equipo SIG de Hileros/PCN.      │
│  Esta plataforma solo lo muestra."                  │
├─────────────────────────────────────────────────────┤
│ ← Volver a Estadísticas                             │
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

**Estado de carga del iframe:**
- Spinner centrado mientras carga el iframe
- Después de 8 segundos sin carga: mostrar mensaje "El tablero no está disponible en este momento. Intenta más tarde."

**Si el usuario Público intenta acceder a un tablero Interno vía URL directa:**
- Mostrar pantalla de acceso restringido (ver §4.9 para el diseño del componente)

---

### 4.8 Geoportal Interno — Acceso

**URL:** `/geoportal`
**Objetivo:** Proveer acceso al geoportal del equipo SIG de Hileros/PCN. Solo visible con login.
**Usuarios:** Interno, Admin

**Comportamiento:** Si un usuario Público intenta acceder a `/geoportal`, redirigir a `/login` con mensaje "Debes iniciar sesión para acceder al geoportal."

#### Layout (Opción A — recomendada: nueva pestaña)

```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
├─────────────────────────────────────────────────────┤
│ BREADCRUMB: Inicio > Geoportal                      │
├─────────────────────────────────────────────────────┤
│ CONTENIDO CENTRAL                                   │
│                                                     │
│  [Ícono de mapa / globo terráqueo]                  │
│                                                     │
│  H2: "Geoportal territorial – Hileros/PCN"          │
│                                                     │
│  Párrafo: Descripción de lo que contiene el         │
│  geoportal (capas disponibles, quién lo gestiona)   │
│                                                     │
│  [Botón primario: 🗺 Abrir Geoportal]               │
│  (abre en nueva pestaña)                            │
│                                                     │
│  Nota: "El geoportal es administrado por el equipo  │
│  SIG de Hileros/PCN. Requiere autenticación propia."│
└─────────────────────────────────────────────────────┘
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

#### Variante Opción B (iframe)
Si el equipo SIG confirma que X-Frame-Options lo permite:
- Reemplazar el botón por un iframe full-width (altura: 80vh)
- Mantener la nota informativa debajo del iframe

---

### 4.9 Login

**URL:** `/login`
**Objetivo:** Autenticar a usuarios Internos y Admin.
**Usuarios:** Cualquiera que intente acceder a contenido restringido

#### Layout

```
┌─────────────────────────────────────────────────────┐
│ HEADER (simplificado — solo logo, sin nav completa) │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Logo Palenke centrado]                            │
│                                                     │
│  ┌──────────────────────────────────────┐           │
│  │  H2: "Iniciar sesión"               │           │
│  │                                      │           │
│  │  [Mensaje contextual — si viene de   │           │
│  │   acceso denegado]:                  │           │
│  │  "⚠ Este contenido es solo para     │           │
│  │   miembros del Palenke/PCN.          │           │
│  │   Inicia sesión para continuar."     │           │
│  │                                      │           │
│  │  Label: Correo electrónico           │           │
│  │  [Input type=email] ────────────────│           │
│  │                                      │           │
│  │  Label: Contraseña                   │           │
│  │  [Input type=password] ─────────────│           │
│  │  [enlace: ¿Olvidaste tu contraseña?] │           │
│  │                                      │           │
│  │  [Botón: Iniciar sesión]             │           │
│  │                                      │           │
│  │  ─────────────────────────────────── │           │
│  │  No se aceptan registros públicos.   │           │
│  │  Las cuentas son gestionadas por     │           │
│  │  la coordinación del Palenke.        │           │
│  └──────────────────────────────────────┘           │
│                                                     │
└─────────────────────────────────────────────────────┘
│ FOOTER (simplificado)                               │
└─────────────────────────────────────────────────────┘
```

#### Estados del formulario de login

**Estado: Error de credenciales**
- Borde rojo en ambos inputs
- Mensaje debajo del botón: "❌ Correo o contraseña incorrectos. Intenta de nuevo."

**Estado: Cargando (tras hacer clic en el botón)**
- Botón deshabilitado + spinner dentro del botón + texto "Entrando…"

**Estado: Éxito**
- Redirigir al destino original (si venía de una URL protegida) o al Home

**Estado: Cuenta desactivada**
- Mensaje: "⚠ Tu cuenta ha sido desactivada. Contacta a la coordinación del Palenke."

#### Recuperación de contraseña
**URL:** `/recuperar-contrasena`
- Campo de correo electrónico
- Botón "Enviar instrucciones"
- Estado éxito: "Te enviamos un correo con instrucciones para restablecer tu contraseña."

---

### 4.10 Panel Admin — Home

**URL:** `/admin`
**Objetivo:** Dar al Admin una vista general del estado del sistema y acceso rápido a todas las secciones de gestión.
**Usuarios:** Admin únicamente (si un usuario Interno intenta acceder: redirigir a Home con mensaje de acceso denegado)

#### Layout

```
┌─────────────────────────────────────────────────────┐
│ HEADER ADMIN                                        │
│  [Logo] [Nombre del usuario] [Cerrar sesión]        │
│  [← Volver al sitio público]                        │
├───────────────┬─────────────────────────────────────┤
│ MENÚ LATERAL  │ CONTENIDO PRINCIPAL                 │
│ (sidebar)     │                                     │
│               │ H1: "Panel de gestión"              │
│ 📚 Biblioteca │                                     │
│ 📊 Dashboards │ TARJETAS DE RESUMEN (stats rápidas) │
│ 🗺 ACCs       │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│ 👥 Usuarios   │ │  24  │ │   5  │ │   3  │ │   8  ││
│ 📢 Campañas   │ │ docs │ │ dash │ │ ACCs │ │users ││
│               │ └──────┘ └──────┘ └──────┘ └──────┘│
│ ─────────────  │                                     │
│ [← Sitio      │ ACCESOS DIRECTOS:                   │
│  público]     │ [+ Nuevo documento]                 │
│               │ [+ Nuevo dashboard]                 │
│               │ [+ Nueva ACC]                       │
│               │                                     │
│               │ ACTIVIDAD RECIENTE:                 │
│               │ Lista de últimos 5 documentos       │
│               │ creados/editados con fecha y admin  │
└───────────────┴─────────────────────────────────────┘
```

**Menú lateral (sidebar):**
- Siempre visible en desktop
- En mobile: colapsable con ícono hamburguesa
- Ítem activo: resaltado con borde izquierdo o fondo diferente
- Accesos: Biblioteca, Dashboards, ACCs, Usuarios, Campañas

---

### 4.11 Panel Admin — Gestión de Documentos (Biblioteca)

**URL:** `/admin/documentos`
**Objetivo:** Listar todos los documentos con herramientas para filtrar, buscar, editar y cambiar visibilidad.
**Usuarios:** Admin

#### Layout

```
┌───────────────┬─────────────────────────────────────┐
│ MENÚ LATERAL  │ CONTENIDO PRINCIPAL                 │
│               │                                     │
│               │ H1: "Biblioteca Base — Documentos"  │
│               │                                     │
│               │ Barra de herramientas:              │
│               │ [Buscador] [Filtro sección ▼]       │
│               │ [Filtro visibilidad ▼]              │
│               │ [Filtro territorio ▼]               │
│               │                    [+ Nuevo doc]    │
│               │                                     │
│               │ TABLA DE DOCUMENTOS                 │
│               │ ┌────┬──────────┬──────┬──────┬───┐ │
│               │ │ □  │ Título   │Secc. │Visib.│ ⋮ │ │
│               │ ├────┼──────────┼──────┼──────┼───┤ │
│               │ │ □  │ Reglam…  │ GobP │🌐 Púb│ ⋮ │ │
│               │ │ □  │ Plan et… │ Plan │🔒 Int│ ⋮ │ │
│               │ │ □  │ Ruta li… │ Ruta │🔒 Int│ ⋮ │ │
│               │ └────┴──────────┴──────┴──────┴───┘ │
│               │                                     │
│               │ Paginación: [< 1 2 3 >]             │
└───────────────┴─────────────────────────────────────┘
```

#### Tabla de documentos — columnas

| # | Columna | Contenido |
|---|---------|-----------|
| 1 | Checkbox | Para selección múltiple |
| 2 | Título | Nombre del documento (clicable → va a edición) |
| 3 | Sección | Badge con nombre de sección |
| 4 | Territorio | Texto corto |
| 5 | Año | AAAA |
| 6 | Visibilidad | Badge: 🌐 Público / 🔒 Interno / ⛔ Sensible |
| 7 | Última edición | Fecha + usuario que editó |
| 8 | Acciones (⋮) | Menú contextual: "Editar" / "Cambiar visibilidad" / "Archivar" |

**Acción masiva:**
- Al seleccionar múltiples registros: aparece barra flotante en la parte inferior: `"X documentos seleccionados" [Cambiar visibilidad] [Archivar]`

---

### 4.12 Panel Admin — Crear / Editar Documento

**URL:** `/admin/documentos/nuevo` y `/admin/documentos/[id]/editar`
**Objetivo:** Formulario completo para crear o editar un documento de la Biblioteca.
**Usuarios:** Admin

#### Layout

```
┌───────────────┬─────────────────────────────────────┐
│ MENÚ LATERAL  │ CONTENIDO PRINCIPAL                 │
│               │                                     │
│               │ H1: "Nuevo documento" ó             │
│               │     "Editar documento"              │
│               │ Breadcrumb: Panel > Biblioteca >    │
│               │             Nuevo / Editar          │
│               │                                     │
│               │ FORMULARIO (scroll vertical)        │
│               │                                     │
│               │ ── INFORMACIÓN BÁSICA ──            │
│               │ Label: Título oficial *             │
│               │ [Input text] ─────────────────────  │
│               │                                     │
│               │ Label: Sección *                    │
│               │ [Select ▼] ──────────────────────── │
│               │  - Gobierno Propio                  │
│               │  - Planes de uso y manejo           │
│               │  - Planes de etnodesarrollo         │
│               │  - Rutas de litigio estratégico     │
│               │  - Producción técnica/política      │
│               │  - Material pedagógico/comunitario  │
│               │                                     │
│               │ Label: Descripción *                │
│               │ [Textarea — 3-4 líneas] ──────────  │
│               │ Nota: "Máx. 300 caracteres.         │
│               │  Aparece en el listado público."    │
│               │ Contador: 0/300 caracteres          │
│               │                                     │
│               │ ── CLASIFICACIÓN ──                 │
│               │ Label: Tipo de instrumento *        │
│               │ [Select ▼] ──────────────────────── │
│               │                                     │
│               │ Label: Territorio / Región          │
│               │ [Input text] ─────────────────────  │
│               │                                     │
│               │ Label: Consejo comunitario          │
│               │ [Input text] ─────────────────────  │
│               │                                     │
│               │ Label: Departamento                 │
│               │ [Input text] ─────────────────────  │
│               │                                     │
│               │ Label: Municipio                    │
│               │ [Input text] ─────────────────────  │
│               │                                     │
│               │ Label: Año *                        │
│               │ [Input number / AAAA] ─────────────  │
│               │                                     │
│               │ Label: Vigencia                     │
│               │ [Radio: Vigente | En actualiz.      │
│               │         | Histórico]                │
│               │                                     │
│               │ Label: Palabras clave               │
│               │ [Input tags — escribir y presionar  │
│               │  Enter para añadir]                 │
│               │ Tags creadas: [gobierno] [×]        │
│               │              [Naya] [×]             │
│               │                                     │
│               │ ── ENFOQUE ──                       │
│               │ [☐] Tiene enfoque de género         │
│               │     explícito                       │
│               │ Nota: "Si marcas esta casilla, el   │
│               │  documento aparecerá también en la  │
│               │  página Mujeres, Juventudes y Niñez"│
│               │                                     │
│               │ ── ARCHIVO / ENLACE ──              │
│               │ Label: Adjuntar archivo             │
│               │ [Zona de drop: arrastrar o          │
│               │  clic para subir PDF/DOCX]          │
│               │  Formatos: PDF, DOCX. Máx. 20 MB   │
│               │ — o —                               │
│               │ Label: Enlace externo               │
│               │ [Input URL] ──────────────────────  │
│               │                                     │
│               │ ── VISIBILIDAD ──                   │
│               │ Label: Visibilidad *                │
│               │                                     │
│               │ [Radio o Select:]                   │
│               │   ● 🌐 Público                      │
│               │     "Cualquier visitante puede      │
│               │      ver y descargar este documento"│
│               │   ○ 🔒 Interno                      │
│               │     "Solo miembros autenticados     │
│               │      del Palenke/Hileros"           │
│               │   ○ ⛔ Sensible/Restringido          │
│               │     "No aparece en la web.          │
│               │      Se gestiona fuera de la        │
│               │      plataforma."                   │
│               │                                     │
│               │ [ADVERTENCIA — si selecciona Púb]:  │
│               │ ┌─────────────────────────────────┐ │
│               │ │ ⚠ Al marcar como "Público",    │ │
│               │ │  este documento será visible     │ │
│               │ │  para cualquier persona que      │ │
│               │ │  visite la plataforma, sin       │ │
│               │ │  necesidad de autenticación.     │ │
│               │ │  Asegúrate de que el contenido   │ │
│               │ │  no incluye información sensible │ │
│               │ │  de personas o comunidades.      │ │
│               │ └─────────────────────────────────┘ │
│               │                                     │
│               │ ── VINCULACIÓN MJN ──               │
│               │ [☐] Aparece en página MJN           │
│               │     (además del campo de género)    │
│               │ Si marcado → Relación MJN:          │
│               │ [Multi-select: Mujeres / Juventudes │
│               │  / Niñez / MJN general]             │
│               │                                     │
│               │ ─────────────────────────────────── │
│               │ [Cancelar]   [Guardar como borrador]│
│               │                     [Publicar ✓]   │
└───────────────┴─────────────────────────────────────┘
```

#### Validaciones inline

- Campos obligatorios (marcados con `*`): borde rojo + mensaje debajo si se intenta guardar vacíos
- Campo Descripción: contador de caracteres en tiempo real, rojo si supera 300
- Campo URL: validar que comienza con `https://`
- Archivo: validar tamaño (<20MB) y formato (PDF/DOCX) al seleccionar
- Si se sube archivo Y se escribe URL: mostrar advertencia "Solo se puede usar archivo o enlace, no ambos. Por favor elige uno."

#### Estado tras guardar
- Éxito: Banner verde en la parte superior: "✓ Documento guardado exitosamente." + redirección al listado después de 2 segundos
- Error: Banner rojo: "✗ Hubo un error al guardar. Intenta de nuevo." + el formulario permanece con los datos

---

### 4.13 Panel Admin — Gestión de Dashboards Power BI

**URL:** `/admin/dashboards`
**Objetivo:** Listar, crear y editar los registros de tableros de Power BI.
**Usuarios:** Admin

#### Layout

```
┌───────────────┬─────────────────────────────────────┐
│ MENÚ LATERAL  │ H1: "Estadísticas — Tableros Power BI│
│               │                                     │
│               │ [Buscador] [Filtro tema ▼]          │
│               │ [Filtro visibilidad ▼]              │
│               │                   [+ Nuevo tablero] │
│               │                                     │
│               │ TABLA DE DASHBOARDS                 │
│               │ ┌───────────┬──────┬──────┬────┬───┐│
│               │ │ Título    │ Tema │ Terr.│Vis.│ ⋮ ││
│               │ ├───────────┼──────┼──────┼────┼───┤│
│               │ │ Biodiver… │ Bio  │ Naya │🌐  │ ⋮ ││
│               │ │ ACC 2023  │ ACC  │ Baud.│🔒  │ ⋮ ││
│               │ └───────────┴──────┴──────┴────┴───┘│
│               │                                     │
│               │ Paginación                          │
└───────────────┴─────────────────────────────────────┘
```

---

### 4.14 Panel Admin — Crear / Editar Dashboard

**URL:** `/admin/dashboards/nuevo` y `/admin/dashboards/[id]/editar`
**Objetivo:** Registrar o actualizar un tablero de Power BI.
**Usuarios:** Admin

#### Formulario

```
H1: "Nuevo tablero" ó "Editar tablero"

── INFORMACIÓN ──
Label: Título del tablero *
[Input text] "Ej: Monitoreo de cobertura vegetal — Cuenca Naya"

Label: Descripción / ¿Qué pregunta responde? *
[Textarea — 2 líneas]
Nota: "Esta descripción aparece en el listado y ayuda a los usuarios
       a entender qué muestra este tablero antes de abrirlo."

Label: Tema *
[Select ▼: Biodiversidad | ACCs | Demografía | Justicia climática
           | Monitoreo ambiental | Otro]

Label: Territorio(s) relacionado(s) *
[Input text — puede indicar varios, ej: "Cuenca Naya, Baudó"]

Label: Período de datos
[Input text — ej: "2020–2023"]

Label: Público objetivo
[Select ▼: Público general | Equipo Palenke/Hileros | Técnicos y donantes]

Label: Frecuencia de actualización de datos
[Select ▼: Tiempo real | Semanal | Mensual | Anual | Puntual]

── INTEGRACIÓN ──
Label: URL de embed Power BI *
[Input URL — placeholder: "https://app.powerbi.com/reportEmbed?reportId=…"]
Nota: "Obtén esta URL en Power BI: Publicar > Insertar informe > Sitio web o portal"
Validación: Debe comenzar con https://app.powerbi.com/

[Botón: Previsualizar tablero]
→ Abre un modal con un iframe de 500×350px para verificar que la URL carga correctamente

── VISIBILIDAD ──
Label: Visibilidad *
[Radio:]
  ● 🌐 Público — visible para todos
  ○ 🔒 Interno — solo usuarios autenticados

── ESTADO ──
[Select ▼: Activo | En actualización | Desactivado temporalmente]

──────────────────────────────────────────
[Cancelar]                    [Guardar ✓]
```

---

### 4.15 Panel Admin — Gestión de ACCs

**URL:** `/admin/accs`
**Objetivo:** Listar y gestionar las fichas de Áreas de Conservación Comunitaria.
**Usuarios:** Admin

#### Layout

```
┌───────────────┬─────────────────────────────────────┐
│ MENÚ LATERAL  │ H1: "Áreas de Conservación           │
│               │      Comunitaria (ACCs)"             │
│               │                                     │
│               │ Nota: "El MVP incluye 2–3 ACCs       │
│               │  priorizadas. No se almacenan datos  │
│               │  geográficos."                      │
│               │                                     │
│               │ [Buscador] [Filtro territorio ▼]    │
│               │                       [+ Nueva ACC] │
│               │                                     │
│               │ TABLA DE ACCs                       │
│               │ ┌──────────┬──────────┬──────┬────┐  │
│               │ │ Nombre   │ Consejo  │ Vis. │ ⋮  │  │
│               │ ├──────────┼──────────┼──────┼────┤  │
│               │ │ ACC Naya │ Consejo… │ 🌐   │ ⋮  │  │
│               │ │ ACC Baud │ Consejo… │ 🔒   │ ⋮  │  │
│               │ └──────────┴──────────┴──────┴────┘  │
└───────────────┴─────────────────────────────────────┘
```

---

### 4.16 Panel Admin — Crear / Editar ACC

**URL:** `/admin/accs/nuevo` y `/admin/accs/[id]/editar`
**Objetivo:** Gestionar la ficha estructurada de una ACC con metadatos, vínculos y sin datos geográficos.
**Usuarios:** Admin

#### Formulario

```
H1: "Nueva ACC" ó "Editar ACC"

── IDENTIFICACIÓN ──
Label: Nombre oficial *
[Input text]

Label: Nombre coloquial (como la conoce la comunidad)
[Input text]

Label: Consejo comunitario responsable *
[Input text]

── UBICACIÓN ──
Label: Cuenca hidrográfica principal
[Input text]

Label: Municipio(s)
[Input text]

Label: Departamento(s)
[Input text]

Label: Extensión aproximada (hectáreas)
[Input number — opcional, solo si es información pública]

── DESCRIPCIÓN ──
Label: Descripción *
[Textarea — placeholder: "3–5 oraciones sobre ubicación, ecosistemas principales
y relevancia para el gobierno propio"]

── VINCULACIONES ──
Label: ¿Está en el geoportal del equipo SIG?
[Radio: Sí — ¿nombre de capa? [Input text] | No]

Label: ¿Tiene tablero Power BI vinculado?
[Select ▼ con listado de tableros ya registrados en el sistema | "Ninguno"]
(Al seleccionar, se muestra el título del tablero seleccionado para confirmar)

Label: Documentos de la Biblioteca relacionados
[Multi-selector: buscar y seleccionar documentos existentes por título]
Tags seleccionados: [Plan etnodesarrollo Naya 2020 ×] [Reglamento… ×]

── AGENDA ──
[☐] Vinculada a agenda Meta 30x30 / justicia climática

── VISIBILIDAD ──
Label: Visibilidad de la ficha *
[Radio:]
  ● 🌐 Pública
  ○ 🔒 Solo interna

──────────────────────────────────────────
[Cancelar]                    [Guardar ✓]
```

---

### 4.17 Panel Admin — Gestión de Usuarios

**URL:** `/admin/usuarios`
**Objetivo:** Crear, editar y desactivar cuentas de acceso.
**Usuarios:** Admin (solo el admin principal o quien tenga permiso)

#### Layout

```
┌───────────────┬─────────────────────────────────────┐
│ MENÚ LATERAL  │ H1: "Gestión de usuarios"            │
│               │                                     │
│               │ Nota informativa:                   │
│               │ "Las cuentas son cerradas. No hay    │
│               │  registro público. Máx. 15 usuarios  │
│               │  en el MVP."                        │
│               │                                     │
│               │ [Buscador nombre/correo]             │
│               │ [Filtro rol ▼]                      │
│               │                    [+ Nuevo usuario]│
│               │                                     │
│               │ TABLA DE USUARIOS                   │
│               │ ┌─────────┬──────┬──────┬──────┬──┐  │
│               │ │ Nombre  │Correo│ Rol  │Estado│⋮ │  │
│               │ ├─────────┼──────┼──────┼──────┼──┤  │
│               │ │ María T.│ m@…  │Admin │✅ Act│⋮ │  │
│               │ │ Carlos R│ c@…  │Intern│✅ Act│⋮ │  │
│               │ │ Ana P.  │ a@…  │Intern│❌Des│⋮ │  │
│               │ └─────────┴──────┴──────┴──────┴──┘  │
└───────────────┴─────────────────────────────────────┘
```

#### Formulario Crear/Editar Usuario

```
Label: Nombre completo *
[Input text]

Label: Correo electrónico *
[Input email]

Label: Rol *
[Radio: Admin | Interno]

Label: Organización / consejo
[Input text]

[☐] Administrador principal
(Solo uno puede serlo. Advertencia si se intenta cambiar.)

Label: Contraseña temporal *
[Input password — solo en creación. En edición: botón "Enviar enlace de restablecimiento"]
Nota: "El usuario deberá cambiar esta contraseña en su primer ingreso."

Estado de la cuenta:
[Toggle: Activa ●——○ Desactivada]
Si se desactiva: confirmación modal "¿Desactivar la cuenta de [nombre]?
Esta persona ya no podrá iniciar sesión."
```

---

### 4.18 Panel Admin — Campañas / Contenidos Destacados

**URL:** `/admin/campanas`
**Objetivo:** Crear, editar, activar/desactivar campañas que aparecen en Home y/o en la página MJN.
**Usuarios:** Admin

#### Formulario Crear/Editar Campaña

```
H1: "Nueva campaña" ó "Editar campaña"

Label: Título de la campaña *
[Input text]

Label: Texto de presentación *
[Textarea — máx. 100 palabras]
Contador: 0/100 palabras

Label: Imagen de portada *
[Zona de drop: JPG/PNG, mín. 1200px, máx. 2MB]
[Vista previa de la imagen cargada]

── MATERIALES ──
Label: Materiales descargables
[Botón + Agregar material]
→ Por cada material: [Tipo ▼] [Título] [Archivo o URL] [×]
   Tipos: Afiche | Cartilla | Video | Otro
   Para Video: input URL (YouTube/Vimeo)
   Para Archivo: zona de drop (PDF/PNG, máx. 10MB)

── FECHAS ──
Label: Fecha de inicio *
[Input date]

Label: Fecha de fin
[Input date]  ó  [☐ Indefinido]

── UBICACIÓN EN LA PLATAFORMA ──
Label: ¿Dónde aparece esta campaña? *
[Multi-checkbox:]
  ☑ Portada (Home)
  ☑ Página Mujeres, Juventudes y Niñez
  ☐ Sección Biblioteca
  ☐ Todas las secciones

── VISIBILIDAD ──
[Radio: 🌐 Pública | 🔒 Solo para miembros]

── ESTADO ──
[Toggle: Activa ●——○ Inactiva]
Nota: "Solo las campañas activas aparecen en el sitio."

──────────────────────────────────────────
[Cancelar]                    [Guardar ✓]
```

---

## 5. Flujos de Usuario Detallados

---

### 5.1 Flujo: Usuario Público navega el sitio

**Escenario:** Una persona externa descubre la plataforma, explora la Biblioteca, accede a la página MJN y ve un tablero de estadísticas.

```
PASO 1: LLEGADA AL HOME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Usuario llega a / (Home)
→ Ve el HERO: imagen territorial, título, botón "Explorar la Biblioteca"
→ Ve el bloque de presentación del Palenke/PCN
→ Ve las 3 cards de accesos rápidos
→ Ve (si hay) campañas activas
→ Header: ve opciones [Inicio][Biblioteca][MJN][Estadísticas][Iniciar sesión]
→ Footer: links, política de datos

PASO 2A: NAVEGA A BIBLIOTECA BASE (desde CTA del Hero)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Hace clic en "Explorar la Biblioteca"
→ Llega a /biblioteca
→ Ve el listado de documentos PÚBLICOS (los internos no aparecen)
→ Ve el sidebar con filtros
→ Lee el breadcrumb: Inicio > Biblioteca Base

PASO 2B: FILTRA POR SECCIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Hace clic en checkbox "Material pedagógico/comunitario" en el sidebar
→ El listado se actualiza mostrando solo documentos de esa sección
→ Aparece chip activo: [Material pedagógico ×]
→ El contador cambia: "X documentos encontrados"

PASO 2C: BUSCA POR TEXTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Escribe "cartilla" en el buscador
→ El listado filtra en tiempo real (o al hacer Enter)
→ Si no hay resultados: muestra estado vacío con "No encontramos documentos" y [Limpiar filtros]

PASO 2D: ABRE UN DOCUMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Hace clic en el título o el botón "Ver →" de un documento Público
→ Llega a /biblioteca/[slug]
→ Ve: badge Público, título, tabla de metadatos, descripción completa, palabras clave
→ Ve botón "⬇ Descargar PDF"
→ Hace clic → el PDF se descarga directamente (o se abre en nueva pestaña)
→ Hace clic en "← Volver a la Biblioteca" → regresa al listado

PASO 3: VA A MUJERES/JUVENTUDES/NIÑEZ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Hace clic en "Mujeres, Juventudes y Niñez" en el menú principal
→ Llega a /mujeres-juventudes-ninez
→ Ve: imagen hero, texto de contexto político
→ Ve grid de documentos etiquetados MJN (solo los Públicos)
→ Ve bloque de campañas activas (si las hay)

PASO 4: ABRE UNA CAMPAÑA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Hace clic en "Ver campaña →" de un card de campaña
→ Llega a /mujeres-juventudes-ninez/campanas/[slug]
→ Ve: imagen de portada, título, texto, materiales descargables
→ Hace clic en "Descargar afiche" → descarga el PDF

PASO 5: VE UN TABLERO DE ESTADÍSTICAS (Público)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Hace clic en "Estadísticas" en el menú
→ Llega a /estadisticas
→ Ve grid de tableros con badge 🌐 Público (los Internos no aparecen)
→ Lee la nota: "Los tableros son generados por el equipo SIG de Hileros/PCN"
→ Hace clic en "Ver tablero →" de un tablero Público
→ Llega a /estadisticas/[slug]
→ Ve el iframe de Power BI cargando (spinner)
→ Tras carga: interactúa directamente con los filtros de Power BI (no con la plataforma)
→ Ve la nota informativa debajo del iframe

CASO BORDE: INTENTA ACCEDER A CONTENIDO INTERNO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Si el usuario intenta ir directamente a /geoportal:
   Redirigir a /login con mensaje "⚠ Debes iniciar sesión para acceder al geoportal."
→ Si intenta acceder a /biblioteca/[slug-de-documento-interno]:
   Ver pantalla de acceso restringido:
   ┌──────────────────────────────────────┐
   │  🔒                                  │
   │  Este contenido es solo para         │
   │  miembros del Palenke/PCN.           │
   │  [Iniciar sesión]                    │
   │  ← Volver a la Biblioteca            │
   └──────────────────────────────────────┘
```

---

### 5.2 Flujo: Usuario Interno accede a recursos protegidos

**Escenario:** Un miembro del equipo Palenke/Hileros inicia sesión y accede a documentos internos, tableros internos y el geoportal.

```
PASO 1: LOGIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Va a /login (o hace clic en "Iniciar sesión" en el header)
→ Ve el formulario de login
→ Ingresa correo + contraseña
→ Hace clic en "Iniciar sesión"
→ [Estado cargando: botón deshabilitado + spinner]
→ [Éxito]: redirige a la página desde donde vino, o al Home
→ Header se actualiza: aparece "Geoportal" en el menú y el nombre del usuario

PASO 2: NAVEGA A BIBLIOTECA — VE DOCUMENTOS INTERNOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Va a /biblioteca
→ Ahora ve TODOS los documentos: Públicos + Internos
→ Los documentos Internos tienen badge 🔒 "Solo para miembros"
→ Filtra por sección "Rutas de litigio estratégico"
→ Ve rutas marcadas como Internas
→ Abre un documento Interno → descarga el PDF

PASO 3: ACCEDE A TABLERO INTERNO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Va a /estadisticas
→ Ahora ve tableros Públicos + tableros Internos (con badge 🔒)
→ Hace clic en un tablero Interno
→ El iframe de Power BI carga
→ Ve la nota: "Solo visible para miembros"

PASO 4: ACCEDE AL GEOPORTAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Hace clic en "Geoportal" en el menú principal (visible porque está autenticado)
→ Llega a /geoportal
→ Ve: descripción del geoportal, capas disponibles listadas, botón [🗺 Abrir Geoportal]
→ Hace clic → el geoportal se abre en una nueva pestaña del navegador
→ En la nueva pestaña: el geoportal del equipo SIG gestiona su propio login/acceso

PASO 5: CERRAR SESIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Hace clic en su nombre en el header → menú desplegable
→ Hace clic en "Cerrar sesión"
→ Se destruye la sesión → redirige al Home
→ Header vuelve a mostrar "Iniciar sesión"
→ El menú "Geoportal" desaparece
```

---

### 5.3 Flujo: Admin gestiona documentos, dashboards y ACCs

**Escenario:** Un administrador crea un documento en la Biblioteca, registra un nuevo tablero de Power BI y crea/edita una ficha de ACC.

```
PASO 1: LOGIN COMO ADMIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Igual que flujo Interno (paso 1)
→ Tras login: en el menú del usuario aparece "Ir al Panel de gestión"

PASO 2: ACCEDE AL PANEL ADMIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Hace clic en "Ir al Panel de gestión" ó va a /admin
→ Ve el home del panel: contadores de documentos, tableros, ACCs, usuarios
→ Ve los accesos directos: [+ Nuevo documento] [+ Nuevo dashboard] [+ Nueva ACC]

FLUJO A: CREAR UN DOCUMENTO EN LA BIBLIOTECA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A1. Va a /admin/documentos
A2. Hace clic en [+ Nuevo documento]
A3. Llega al formulario vacío en /admin/documentos/nuevo
A4. Completa campos:
    - Título: "Reglamento interno Consejo Naya"
    - Sección: [Gobierno Propio]
    - Descripción: "Reglamento que rige el gobierno propio del..."
      → El contador muestra 78/300 caracteres
    - Tipo: [Reglamento interno]
    - Territorio: "Río Naya"
    - Consejo: "Consejo Comunitario Naya"
    - Departamento: "Cauca"
    - Municipio: "López de Micay"
    - Año: 2021
    - Vigencia: [Vigente]
    - Palabras clave: escribe "gobierno propio" + Enter → aparece tag
      escribe "Naya" + Enter → aparece tag
    - Enfoque de género: [☐] (no marcado)
    - Vinculado a MJN: [☐] (no marcado)
A5. Sube el archivo PDF:
    → Arrastra PDF al área de drop
    → Progreso de carga: barra de progreso
    → Éxito: "reglamento_naya_2021.pdf — 2.3 MB ✓" con [× eliminar]
A6. Define visibilidad:
    → Selecciona [🔒 Interno]
    → La advertencia de "Público" no aparece (solo aparece si selecciona Público)
A7. Hace clic en [Publicar ✓]
    → [Estado cargando: botón spinner]
    → [Éxito]: banner verde "✓ Documento guardado exitosamente"
    → Redirige al listado /admin/documentos
    → El nuevo documento aparece en la tabla con badge 🔒 Interno

FLUJO B: EDITAR VISIBILIDAD DE UN DOCUMENTO EXISTENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
B1. En el listado /admin/documentos
B2. Busca el documento por título
B3. Hace clic en ⋮ (menú contextual) → "Editar"
B4. Llega al formulario en modo edición (campos pre-cargados con datos existentes)
B5. Cambia visibilidad de [🔒 Interno] a [🌐 Público]
B6. Aparece la ADVERTENCIA:
    "⚠ Al marcar como Público, este documento será visible para cualquier persona..."
B7. Admin lee la advertencia, confirma que está bien
B8. Hace clic en [Publicar ✓]
B9. Éxito → el badge del documento en el listado cambia a 🌐 Público

FLUJO C: REGISTRAR UN NUEVO DASHBOARD POWER BI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
C1. Va a /admin/dashboards
C2. Hace clic en [+ Nuevo tablero]
C3. Llega al formulario en /admin/dashboards/nuevo
C4. Completa campos:
    - Título: "Cobertura vegetal ACCs — Cuenca Baudó"
    - Descripción: "¿Cuántas hectáreas de bosque primario se mantienen en las ACCs del Baudó?"
    - Tema: [Biodiversidad]
    - Territorio: "Cuenca Baudó"
    - Período de datos: "2020–2023"
    - Público objetivo: [Técnicos y donantes]
    - Frecuencia: [Anual]
    - URL de embed: pega la URL de Power BI
C5. Hace clic en [Previsualizar tablero]
    → Modal con iframe: verifica que el tablero carga correctamente
    → Si no carga: mensaje "No pudimos cargar este tablero. Verifica la URL."
    → Si carga: botón "Confirmar URL" para cerrar el modal
C6. Selecciona visibilidad: [🔒 Interno]
C7. Estado: [Activo]
C8. Hace clic en [Guardar ✓]
C9. Éxito → aparece en el listado de tableros

FLUJO D: CREAR UNA FICHA DE ACC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
D1. Va a /admin/accs
D2. Hace clic en [+ Nueva ACC]
D3. Completa formulario:
    - Nombre oficial: "ACC Río Naya"
    - Nombre coloquial: "La ACC del Naya"
    - Consejo: "Consejo Comunitario Naya"
    - Cuenca: "Río Naya"
    - Municipio: "López de Micay, El Tambo"
    - Departamento: "Cauca"
    - Extensión: 45000 (ha)
    - Descripción: "El ACC del Naya abarca..."
    - ¿En el geoportal?: [Sí] → nombre de capa: "acc_naya"
    - Tablero Power BI: selecciona "Cobertura vegetal ACCs — Cuenca Baudó" (recién creado)
      → Se muestra el título del tablero seleccionado como confirmación
    - Documentos relacionados: busca y selecciona:
      → "Plan de etnodesarrollo Naya 2020"
      → "Reglamento interno Consejo Naya"
    - Vinculada a Meta 30x30: [☑]
    - Visibilidad: [🌐 Pública]
D4. Hace clic en [Guardar ✓]
D5. Éxito → aparece en el listado de ACCs
```

---

## 6. Componentes de UI Transversales

### 6.1 Header

```
VERSIÓN DESKTOP:
┌─────────────────────────────────────────────────────────────┐
│ [Logo] [Palenke]  │ Inicio  Biblioteca  MJN  Estadísticas  │ [Iniciar sesión]
└─────────────────────────────────────────────────────────────┘

VERSIÓN DESKTOP (autenticado):
┌─────────────────────────────────────────────────────────────┐
│ [Logo] [Palenke]  │ Inicio  Biblioteca  MJN  Estadísticas  Geoportal  │ [👤 Nombre ▼]
└─────────────────────────────────────────────────────────────┘

VERSIÓN MOBILE:
┌─────────────────────────────────────────────────────┐
│ [Logo]                               [≡ Menú]        │
└─────────────────────────────────────────────────────┘
(Menú expandible hacia abajo con todos los ítems en lista vertical)
```

### 6.2 Footer

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo Palenke]                                              │
│ Descripción breve de 1-2 líneas sobre el Palenke/PCN       │
│                                                             │
│  Navegación:              Legal:                           │
│  Inicio                   Política de tratamiento           │
│  Biblioteca               de datos personales              │
│  MJN                      Contacto                         │
│  Estadísticas                                              │
│                                                             │
│  © [año] Palenke de Pensamiento y Cuidadores del           │
│  Territorio / PCN. Todos los derechos reservados.          │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 Breadcrumb

```
Inicio  >  Biblioteca Base  >  [Título truncado]
```
- Todos los nodos menos el último son links clicables
- El último nodo es texto plano (página actual)

### 6.4 Badge de Visibilidad

```
Público:  [🌐 Público]      → fondo verde claro, texto verde oscuro
Interno:  [🔒 Solo miembros] → fondo amarillo/ocre claro, texto oscuro
Sensible: No aparece en la UI pública
```

### 6.5 Modal de Confirmación

Usado para acciones destructivas o importantes (desactivar usuario, cambiar a Sensible, etc.):

```
┌─────────────────────────────────────────┐
│  ⚠ ¿Estás seguro?                       │
│                                         │
│  [Texto de confirmación específico]     │
│                                         │
│  [Cancelar]            [Confirmar]      │
└─────────────────────────────────────────┘
Overlay oscuro detrás del modal
El foco queda atrapado dentro del modal (accesibilidad)
```

### 6.6 Callout / Bloque informativo

```
┌──────────────────────────────────────────────────┐
│ ℹ [Texto informativo o nota aclaratoria]          │
└──────────────────────────────────────────────────┘
Estilos: ℹ azul claro | ⚠ amarillo | ❌ rojo | ✓ verde
```

### 6.7 Zona de Carga de Archivos (Drop Zone)

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                                       │
│   [Ícono de nube con flecha arriba]   │
│   Arrastra tu archivo aquí            │
│        — o —                          │
│   [Botón: Seleccionar archivo]        │
│                                       │
│   PDF, DOCX. Máximo 20 MB             │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘

Estado: archivo cargando:
[████████░░░░░░░░░░] 45%  nombre_archivo.pdf

Estado: archivo cargado exitosamente:
[✓] nombre_archivo.pdf — 2.3 MB    [× Eliminar]

Estado: error de formato/tamaño:
[✗] nombre_archivo.exe — Formato no permitido.
    Solo se aceptan PDF y DOCX.
```

---

## 7. Comportamiento de Visibilidad en UI

### 7.1 Tabla de comportamientos por pantalla

| Pantalla | Usuario Público | Usuario Interno | Admin |
|---------|----------------|-----------------|-------|
| `/biblioteca` (listado) | Solo docs Públicos | Públicos + Internos | Públicos + Internos |
| `/biblioteca/[doc]` (detalle) | Solo si doc es Público | Público + Interno | Público + Interno |
| `/estadisticas` (listado) | Solo tableros Públicos | Públicos + Internos | Públicos + Internos |
| `/estadisticas/[tablero]` | Solo si Público | Público + Interno | Público + Interno |
| `/geoportal` | Redirige a Login | Acceso completo | Acceso completo |
| `/admin/*` | Redirige a Home | Redirige a Home | Acceso completo |
| `/mujeres-juventudes-ninez` | Contenido Público | Público + Interno | Público + Interno |
| Menú "Geoportal" | Oculto | Visible | Visible |
| Botón "Panel de gestión" | Oculto | Oculto | Visible |

### 7.2 Reglas de redirección
- URL directa a recurso Interno sin sesión → `/login?redirect=[URL original]`
- Tras login exitoso → redirige a `[URL original]` del `redirect` param
- URL directa a `/admin/*` sin ser Admin → redirige a `/` con mensaje de error
- Recurso Sensible → siempre 404 (no hay URL pública)

### 7.3 Badges en listados admin
- El admin siempre ve los badges de visibilidad en todas las tablas
- Puede filtrar por visibilidad en todos los listados del panel
- Documentos Sensibles: aparecen en el panel admin con badge ⛔ rojo, sin botón de vista previa pública

---

## 8. Elementos Legales, Privacidad y Seguridad

### 8.1 Política de tratamiento de datos personales

**Dónde aparece:**
- Enlace en el footer en todas las páginas: "Política de tratamiento de datos personales"
- URL sugerida: `/politica-de-datos`

**Contenido mínimo de la página `/politica-de-datos`:**
- Quién recopila los datos (Palenke/PCN)
- Qué datos se recopilan (correo, nombre para usuarios autenticados)
- Para qué se usan (acceso a la plataforma)
- Derechos del titular (acceso, corrección, supresión)
- Contacto para ejercer derechos
- Fecha de vigencia

**En el formulario de login:**
- Texto pequeño debajo del botón: "Al iniciar sesión aceptas nuestra [Política de tratamiento de datos]"

### 8.2 Advertencia al publicar contenido como "Público"

**Cuándo aparece:** Al seleccionar visibilidad "Público" en el formulario de documento (formulario Admin)

```
┌────────────────────────────────────────────────────────┐
│ ⚠ Atención: Contenido público                          │
│                                                        │
│ Al marcar este documento como "Público", quedará       │
│ visible para cualquier persona que visite la           │
│ plataforma, sin necesidad de autenticación.            │
│                                                        │
│ Antes de publicar, verifica que:                       │
│ • El documento no contiene nombres de personas         │
│   en situación de riesgo                               │
│ • El contenido ha sido validado por la                 │
│   coordinación del Palenke                             │
│ • Los datos sensibles de territorio o comunidades      │
│   han sido removidos o no aplican                      │
└────────────────────────────────────────────────────────┘
```
El administrador debe ver esta advertencia y puede continuar sin requerir confirmación adicional (no es un modal bloqueante, es un callout informativo persistente).

### 8.3 Advertencia para documentos con casos activos / personas en riesgo

**En el formulario de documento:** Si el admin marca "¿Contiene información de casos activos o comunidades en riesgo?: Sí":

```
┌────────────────────────────────────────────────────────┐
│ ⚠ Este documento contiene información sensible        │
│                                                        │
│ Se recomienda marcarlo como "Interno" o               │
│ "Sensible/Restringido" para proteger la               │
│ seguridad de las personas y comunidades involucradas.  │
│                                                        │
│ Consulta con la coordinación antes de publicarlo.      │
└────────────────────────────────────────────────────────┘
```
Si el admin aun así selecciona "Público" con esta advertencia activa → modal de confirmación obligatoria: "¿Confirmas que deseas publicar este documento con información de casos activos de forma pública?"

### 8.4 Seguridad en el formulario de login

- Mensajes de error genéricos (no especificar si el correo no existe o si la contraseña es incorrecta): usar siempre "Correo o contraseña incorrectos"
- No hay registro público: el formulario no tiene botón "Crear cuenta"
- Nota explícita: "Las cuentas son administradas por la coordinación del Palenke. Si necesitas acceso, contacta al equipo técnico."

### 8.5 Seguridad territorial digital en contenidos MJN

**En el bloque de Memoria y Relatos (admin):** Al cargar cualquier pieza de testimonio o foto:
```
┌────────────────────────────────────────────────────────┐
│ ℹ Antes de publicar contenido de memoria o relatos:   │
│                                                        │
│ • ¿Tienes autorización firmada de la persona           │
│   protagonista o su representante?                     │
│ • ¿El contenido puede publicarse sin comprometer       │
│   la seguridad de las personas involucradas?           │
│                                                        │
│ Sin autorización firmada, selecciona visibilidad       │
│ "No publicar aún".                                     │
└────────────────────────────────────────────────────────┘
```

---

## 9. Estados de Error y Éxito

### 9.1 Mensajes del sistema (banners)

**Ubicación:** Parte superior del contenido principal, debajo del header. Se cierra con [×] o automáticamente tras 5 segundos (excepto errores).

| Tipo | Color | Ícono | Ejemplo |
|------|-------|-------|---------|
| Éxito | Verde | ✓ | "Documento guardado exitosamente." |
| Error | Rojo | ✗ | "Hubo un error al guardar. Intenta de nuevo." |
| Advertencia | Amarillo | ⚠ | "Este documento tiene campos sin completar." |
| Información | Azul | ℹ | "Los cambios se guardarán como borrador." |

### 9.2 Validación inline en formularios

- Campos requeridos sin completar (al intentar guardar): borde rojo + texto de error debajo del campo
- Ejemplo: `[Input con borde rojo]` + `"Este campo es obligatorio."`
- Correo con formato inválido: `"Ingresa un correo electrónico válido."`
- URL sin formato https://: `"La URL debe comenzar con https://"`
- Archivo demasiado grande: `"El archivo supera el límite de 20 MB. Comprime el PDF antes de subirlo."`
- Archivo con formato incorrecto: `"Formato no permitido. Solo se aceptan PDF y DOCX."`

### 9.3 Página 404

```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│   404                                               │
│   Esta página no existe                             │
│                                                     │
│   Es posible que el enlace haya cambiado            │
│   o que el contenido ya no esté disponible.         │
│                                                     │
│   [← Volver al inicio]   [Ir a la Biblioteca]       │
│                                                     │
└─────────────────────────────────────────────────────┘
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

### 9.4 Página de acceso restringido (401)

```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│   🔒                                                │
│   Contenido restringido                             │
│                                                     │
│   Este contenido es solo para miembros             │
│   del Palenke/PCN.                                  │
│                                                     │
│   [Iniciar sesión]   [← Volver al inicio]           │
│                                                     │
└─────────────────────────────────────────────────────┘
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

### 9.5 Estado de carga de páginas

- Listas/grids de documentos o tableros: **skeleton loaders** (formas grises pulsantes que imitan el layout real)
- Botones tras hacer clic: **spinner inline** + texto "Guardando…" / "Entrando…" + botón deshabilitado
- Iframe Power BI: **spinner centrado** dentro del área del iframe durante la carga

---

## 10. Notas para el Diseñador

### 10.1 Identidad visual de referencia
- La plataforma ya existe en producción: https://palenke-two.vercel.app
- Paleta base (para mantener consistencia):
  - Fondo oscuro: `#0D1F0A` (verde bosque profundo)
  - Texto principal: `#F5EDD6` (marfil cálido)
  - Acento / CTA: `#C8943A` (ocre dorado)
- Los mockups low-fidelity pueden ser en escala de grises, pero se debe respetar la jerarquía visual usando estos tonos como referencia de contraste

### 10.2 Mobile-first
- La mayoría de usuarios en zona rural accede desde teléfono con conexión limitada
- Diseñar primero la versión mobile de cada pantalla
- El sidebar de filtros en mobile colapsa en un botón "Filtrar" que abre un panel inferior (bottom sheet)
- El menú de navegación en mobile: hamburguesa → menú desplegable vertical
- Los iframes de Power BI deben ser scrollables horizontalmente en mobile o tener fallback de enlace

### 10.3 Convenciones de nomenclatura en Figma
Se recomienda organizar el archivo así:
```
📄 Palenke MVP — Mockups
  ├── 🗂 00 — Componentes base (header, footer, cards, badges, botones)
  ├── 🗂 01 — Flujo Público (Home, Biblioteca, MJN, Estadísticas)
  ├── 🗂 02 — Flujo Interno (Login, páginas con contenido interno)
  ├── 🗂 03 — Panel Admin (todas las vistas del panel)
  └── 🗂 04 — Estados (error, vacío, carga, acceso restringido)
```

### 10.4 Elementos que requieren decisión antes de diseñar
Estas definiciones deben confirmarse con el equipo Palenke antes o durante el diseño:
1. ¿El menú "Geoportal" se llama exactamente así, o tiene un nombre específico? (máx. 40 caracteres)
2. ¿Cuántas secciones de la Biblioteca aparecen como tabs o en el menú secundario?
3. ¿La página MJN tiene URL simplificada como `/mjn` o el nombre completo?
4. ¿El panel admin está completamente separado del sitio público (URL /admin) o se integra en el mismo header?
5. ¿El formulario de documentos necesita un campo "Normativa aplicable" visible en la UI pública?

### 10.5 Accesibilidad básica requerida
- Contraste mínimo WCAG AA en todos los textos sobre fondos
- Todos los inputs tienen `<label>` asociado
- Los badges de visibilidad no dependen solo del color (incluir ícono + texto)
- Los errores de formulario se anuncian con rol ARIA `alert`
- Los modales atrapan el foco mientras están abiertos

### 10.6 Resumen de páginas a mockupear (total: 20 pantallas)

| # | Pantalla | Tipo | Notas |
|---|----------|------|-------|
| 1 | Home | Público | Desktop + Mobile |
| 2 | Biblioteca — Listado | Público | Con y sin filtros activos |
| 3 | Biblioteca — Detalle | Público | Doc PDF + Doc Video |
| 4 | MJN | Público | Todos los bloques |
| 5 | Detalle Campaña | Público | |
| 6 | Estadísticas — Listado | Público/Interno | |
| 7 | Estadísticas — Detalle (embed) | Público/Interno | |
| 8 | Geoportal | Interno | Opción A (nueva pestaña) |
| 9 | Login | Público | Todos los estados |
| 10 | Acceso restringido (401) | Público | |
| 11 | 404 | Público | |
| 12 | Panel Admin — Home | Admin | |
| 13 | Panel Admin — Lista docs | Admin | |
| 14 | Panel Admin — Form doc (crear) | Admin | Todos los campos |
| 15 | Panel Admin — Form doc (editar) | Admin | Con warnings de visibilidad |
| 16 | Panel Admin — Lista dashboards | Admin | |
| 17 | Panel Admin — Form dashboard | Admin | Con previsualización |
| 18 | Panel Admin — Lista ACCs | Admin | |
| 19 | Panel Admin — Form ACC | Admin | |
| 20 | Panel Admin — Gestión usuarios | Admin | Lista + form |
| 21 | Panel Admin — Campañas | Admin | Lista + form |

---

*Documento generado para uso interno del equipo Palenke / PCN. Versión: MVP Fase 1. Última actualización: marzo 2026.*