# Palenke — Design System

Sistema de diseno de la Plataforma Palenke. Documenta tokens, tipografia, componentes, animaciones y filosofia visual del proyecto.

---

## Indice

1. [Filosofia Visual](#1-filosofia-visual)
2. [Paleta de Colores](#2-paleta-de-colores)
3. [Tipografia](#3-tipografia)
4. [Espaciado y Layout](#4-espaciado-y-layout)
5. [Componentes UI](#5-componentes-ui)
6. [Componentes de Pagina](#6-componentes-de-pagina)
7. [Animaciones y Transiciones](#7-animaciones-y-transiciones)
8. [Sistema de Visibilidad](#8-sistema-de-visibilidad)
9. [Modo Oscuro](#9-modo-oscuro)
10. [Archivos Clave](#10-archivos-clave)

---

## 1. Filosofia Visual

**"Estetica afro-contemporanea con raices territoriales"**

El diseno de Palenke no es decorativo. Cada decision — colores, tipografia, espaciado, animaciones — refleja los valores del Consejo Comunitario: soberania de datos, memoria institucional, acceso democratico y orgullo territorial.

### Principios

| Principio | Expresion en diseno |
|---|---|
| **Soberania** | Niveles de visibilidad (publico / interno / sensible) como elemento visual de primer nivel |
| **Memoria** | Tipografia serif con autoridad y permanencia (Fraunces) |
| **Acceso democratico** | Interfaces legibles, contraste alto, componentes accesibles |
| **Orgullo territorial** | Paleta organica derivada del paisaje natural del territorio |
| **Etica visual** | Evitar explicitamente la folklorization o la estetica "afro" decorativa |

---

## 2. Paleta de Colores

Todos los tokens se definen como variables CSS en `:root` en `src/app/globals.css`.

### Fondos y Superficies

```css
--page:          #f5edd6   /* Fondo principal — arena calida */
--surface:       #fff9ec   /* Fondo de tarjetas — crema claro */
--surface-muted: #efe4c5   /* Superficie secundaria — arena apagada */
--sand:          #f5edd6   /* Alias de --page */
--sand-strong:   #eadcb6   /* Arena oscura para contraste sutil */
```

### Verde Bosque — Color Primario de Marca

```css
--forest:        #0d1f0a   /* Verde bosque profundo — texto principal, fondos hero, footer */
--forest-soft:   #173114   /* Verde bosque claro — hover, variante */
```

### Dorado — Acento Primario

```css
--gold-100:      #f1e0b6   /* Dorado muy claro */
--gold-300:      #ddb66d   /* Dorado medio */
--gold-500:      #c8943a   /* Dorado principal — CTA, iconos de accion */
--gold-700:      #9f6f24   /* Dorado oscuro — eyebrows, badges, texto de acento */
```

### Neutrales

```css
--muted:         #697560   /* Gris-verde — texto secundario, placeholders */
--muted-strong:  #465244   /* Neutro mas oscuro */
```

### Semanticos / Estado

```css
--info:          #d7e5f2   /* Fondo azul claro — Callout informativo */
--warning:       #f2e0b4   /* Fondo amarillo claro — advertencia */
--danger:        #a54a46   /* Rojo/marron — error, acceso denegado */
--danger-soft:   #f8d5d5   /* Fondo peligro suave */
--success:       #d8ead2   /* Fondo verde claro — exito */
--success-strong:#21542c   /* Texto verde oscuro sobre fondo success */
```

### Bordes y Sombras

```css
--border-soft:   rgba(13, 31, 10, 0.10)              /* Borde sutil */
--border-strong: rgba(13, 31, 10, 0.22)              /* Borde pronunciado */
--shadow-card:   0 20px 60px rgba(13, 31, 10, 0.08) /* Sombra suave de tarjeta */
```

### Referencia Visual de la Paleta

```
arena clara   #f5edd6 ████
crema         #fff9ec ████
dorado claro  #f1e0b6 ████
dorado        #c8943a ████
dorado oscuro #9f6f24 ████
bosque claro  #173114 ████
bosque        #0d1f0a ████
```

---

## 3. Tipografia

### Fuentes

Las fuentes se importan via `next/font/google` en `src/app/layout.tsx` y se registran como variables CSS.

| Variable CSS | Fuente Google | Tipo | Uso |
|---|---|---|---|
| `--font-display` | [Fraunces](https://fonts.google.com/specimen/Fraunces) | Serif variable | Titulos h1–h6, logo, headings de marca |
| `--font-sans` | [Public Sans](https://fonts.google.com/specimen/Public+Sans) | Sans-serif | Cuerpo, UI, formularios, labels, navegacion |

**Registro en Tailwind v4 (`@theme` en globals.css):**

```css
@theme {
  --font-sans:    var(--font-public-sans), ui-sans-serif, sans-serif;
  --font-display: var(--font-fraunces), ui-serif, Georgia, serif;
}
```

**Uso en Tailwind:**
- `font-display` → activa Fraunces
- `font-sans` (default) → activa Public Sans

### Escala Tipografica

| Elemento | Clases Tailwind | Tamano |
|---|---|---|
| Hero h1 | `font-display text-4xl lg:text-5xl` | 36–48px |
| Seccion h2 | `font-display text-3xl lg:text-5xl` | 30–48px |
| Tarjeta h3 | `font-display text-2xl` | 24px |
| Cuerpo | `text-base` | 16px |
| UI / Labels | `text-sm` | 14px |
| Eyebrow | `text-xs tracking-[0.28em] uppercase font-semibold` | 12px |
| Badge | `text-xs tracking-[0.14em] uppercase font-semibold` | 12px |

### Clase `.eyebrow`

Usada sobre titulos de seccion para introducir el tema:

```css
.eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--gold-700);
}
```

---

## 4. Espaciado y Layout

### Contenedores

```
max-w-7xl  →  Contenedor estandar (1280px)
max-w-6xl  →  Secciones de contenido amplio
max-w-4xl  →  Texto centrado / columnas editoriales
max-w-3xl  →  Formularios y vistas estrechas
```

### Padding Horizontal Responsive (patron estandar)

```
px-4 sm:px-6 lg:px-8
```

### Padding Vertical de Secciones

```
py-8   →  Secciones compactas (callouts, toolbars)
py-12  →  Secciones estandar
py-16  →  Secciones importantes
py-20  →  Secciones principales
py-24  →  Hero del landing
```

### Grids Tipicos

```css
/* Tarjetas responsive */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* Grid de 4 columnas */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4

/* Grid asimetrico (hero / objetivo) */
lg:grid-cols-[0.92fr_1.08fr]

/* Admin con sidebar fijo */
grid grid-cols-[240px_1fr]
```

### Border Radius — Formas Organicas

```
rounded-full    →  Botones, pills, avatares, badges
rounded-[32px]  →  Tarjetas principales
rounded-3xl     →  Tarjetas secundarias (24px)
rounded-[20px]  →  Inputs de texto
rounded-[24px]  →  Textareas
rounded-2xl     →  Modales, paneles
```

---

## 5. Componentes UI

Todos los componentes estan en `src/components/mock/ui.tsx`.

### Layout

| Componente | Descripcion |
|---|---|
| `SiteLayout` | Wrapper principal: header + main + footer, soporte para banner y breadcrumbs |
| `SiteHeader` | Header sticky con logo "PK", navegacion desktop y menu responsive |
| `SiteFooter` | Footer con fondo `--forest`, links y branding |
| `AdminLayout` | Layout de dos columnas: sidebar fijo 240px + area de contenido |
| `Breadcrumbs` | Migas de pan con links conscientes del rol activo |

### Display y Contenido

| Componente | Props clave | Descripcion |
|---|---|---|
| `PageHero` | `eyebrow`, `title`, `description`, `actions`, `media` | Hero de paginas interiores |
| `SectionHeader` | `eyebrow`, `title`, `description` | Encabezado de seccion |
| `PageBanner` | `tone`, `message`, `action` | Banner de notificacion ancho completo |
| `Callout` | `tone` (info/warning/danger/success), `title`, `body` | Caja de alerta contextual |
| `MediaPlaceholder` | `label`, `aspect` | Placeholder para imagenes/videos |

### Tarjetas de Contenido

| Componente | Props clave | Descripcion |
|---|---|---|
| `DocumentCard` | `title`, `type`, `visibility`, `keywords[]`, `action` | Documento del repositorio |
| `DashboardCard` | `title`, `visibility`, `topic`, `embedUrl` | Tablero Power BI |
| `CampaignCard` | `title`, `dateRange`, `visibility`, `media` | Campana editorial |
| `StoryCard` | `type` (text/audio/video/photo), `duration`, `title` | Historia autorizada |
| `MetricCard` | `label`, `value` | Estadistica destacada con numero grande |

### Formularios

| Componente | Descripcion |
|---|---|
| `TextInput` | Input text/email/password/number con estado de error |
| `TextArea` | Textarea con filas configurables y estado de error |
| `SelectInput` | Select nativo con lista de opciones |
| `Field` | Wrapper de campo: label + input + hint + error integrados |
| `InputLabel` | Label con indicador requerido (*) y hint opcional |
| `DropZone` | Zona de subida: idle / loading / success / error |

### Badges y Estado

| Componente | Variantes | Descripcion |
|---|---|---|
| `VisibilityBadge` | `public` / `internal` / `sensitive` | Badge de nivel de acceso con icono |
| `StatusPill` | `neutral` / `success` / `warning` / `danger` | Pill de estado de contenido |
| `Badge` | `.badge-public` / `.badge-internal` / `.badge-sensitive` | Badge inline compacto |
| `Chip` | — | Etiqueta pequena con borde para tags |
| `FilterChip` | `active`, `onRemove` | Chip de filtro activo con × para eliminar |

### Tablas y Datos

| Componente | Descripcion |
|---|---|
| `TableCard` | Tabla responsive con headers, filas y footer opcional |
| `Toolbar` | Barra de filtros y acciones con grid responsive |
| `DetailList` | Lista de definicion para metadatos (clave: valor) |
| `SkeletonGrid` | Grid de 3 skeletons para estados de carga |
| `EmptyState` | Estado vacio con icono de libreria, titulo, descripcion y accion opcional |

### Botones — Clases CSS

```css
/* Primario — fondo dorado, texto bosque */
.button-primary {
  background-color: var(--gold-500);
  color: var(--forest);
  border-radius: 9999px;
  padding: 12px 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Secundario — fondo blanco, borde, hover dorado */
.button-secondary {
  background-color: white;
  border: 1px solid var(--border-strong);
  /* hover: background var(--gold-100) */
}

/* Ghost — transparente, hover sutil */
.button-ghost {
  background-color: transparent;
  /* hover: background var(--surface-muted) */
}
```

---

## 6. Componentes de Pagina

Ubicados en `src/components/`. Componen el landing page de la plataforma.

| Componente | Descripcion tecnica |
|---|---|
| `Hero` | Hero full-height con patron SVG de fondo, titulo animado, dos CTA, tarjetas de datos numeradas |
| `MVP` | Grid de 5 tarjetas de caracteristicas (iconos lucide) + tarjeta narrativa lateral |
| `Objective` | Dos columnas: tarjeta de objetivo con borde izquierdo dorado + tarjeta de cita en verde bosque |
| `Governance` | Tres actores comunitarios + tres niveles de acceso con iconos de candado |
| `SIG` | Visor de mapa SVG interactivo: 4 capas animadas con `AnimatePresence` y seleccion por boton |
| `Phase2` | Grid de 5 columnas para roadmap de fase 2 |
| `Technical` | Arquitectura tecnica: backend, SIG, seguridad, hosting, capacitacion |
| `CoDesign` | Seccion CTA con 5 puntos clave, decoracion SVG y enlace WhatsApp |
| `Navbar` | Header con logo, links de navegacion desktop y menu hamburguesa con Framer Motion |
| `Footer` | Footer oscuro (`--forest`) con nombre de plataforma, descripcion y copyright |

---

## 7. Animaciones y Transiciones

### Transiciones Globales CSS

Aplicadas automaticamente a todos los elementos interactivos via `globals.css`:

```css
a, button, input, select, textarea, summary {
  transition:
    background-color 180ms ease,
    border-color     180ms ease,
    color            180ms ease,
    box-shadow       180ms ease,
    transform        180ms ease;
}
```

### Patrones Framer Motion

**Entrada con fade + slide-up (el patron base):**
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, delay: 0.3 }}
```

**Stagger en grids (entrada escalonada):**
```tsx
transition={{ delay: idx * 0.1 }}
```

**Lift en hover de tarjetas:**
```tsx
whileHover={{ y: -5 }}
```

**Bounce de chevron (indicador de scroll):**
```tsx
animate={{ y: [0, 10, 0] }}
transition={{ repeat: Infinity, duration: 2 }}
```

**Menu mobile (slide-down / collapse):**
```tsx
initial={{ opacity: 0, height: 0 }}
animate={{ opacity: 1, height: "auto" }}
exit={{    opacity: 0, height: 0 }}
```

**Trayectoria SVG del mapa:**
```tsx
initial={{ pathLength: 0 }}
animate={{ pathLength: 1 }}
transition={{ duration: 1, ease: "easeInOut" }}
```

**Pulso de punto en mapa:**
```tsx
animate={{ r: [6, 15], opacity: [1, 0] }}
transition={{ repeat: Infinity, duration: 1.5 }}
```

---

## 8. Sistema de Visibilidad

La visibilidad es un elemento de diseno de primer orden en Palenke. Cada pieza de contenido tiene un nivel que se muestra visualmente en toda la interfaz.

| Nivel | Badge | Color base | Descripcion |
|---|---|---|---|
| `public` | Publico | `--success` (verde) | Visible para cualquier visitante |
| `internal` | Interno | `--gold-300` (dorado) | Solo miembros autenticados del consejo |
| `sensitive` | Sensible | `--danger-soft` (rojo) | Solo administradores y custodios de datos |

**Clases CSS de badge:**

```css
.badge-public    { background: var(--success);     color: var(--success-strong); }
.badge-internal  { background: var(--gold-100);    color: var(--gold-700); }
.badge-sensitive { background: var(--danger-soft); color: var(--danger); }
```

**Logica de acceso (ver `src/lib/viewer.ts`):**
- `public` → visible para todos
- `internal` → visible para roles `internal` y `admin`
- `sensitive` → solo en admin; en frontend publico/interno retorna 404

---

## 9. Modo Oscuro

**No implementado.** Decision de diseno intencional.

La identidad visual de Palenke — arena calida, verde bosque profundo, dorado — es inseparable del tema claro. No existe `prefers-color-scheme` ni toggle de tema. El alto contraste entre `--forest` (#0d1f0a) sobre `--page` (#f5edd6) satisface los requisitos de accesibilidad WCAG AA sin necesitar un modo oscuro alternativo.

---

## 10. Archivos Clave

| Archivo | Contenido |
|---|---|
| `src/app/globals.css` | Variables CSS, tokens de diseno, clases utilitarias, `@theme` Tailwind |
| `src/app/layout.tsx` | Importacion de fuentes Google, metadata, layout raiz |
| `src/components/mock/ui.tsx` | Biblioteca completa de 30+ componentes UI |
| `src/components/mock/admin-forms.tsx` | Formularios y tablas del panel de administracion |
| `src/components/Hero.tsx` | Hero del landing con animaciones |
| `src/components/Navbar.tsx` | Navegacion principal |
| `src/components/Footer.tsx` | Pie de pagina |
| `src/components/Governance.tsx` | Estructura de gobernanza y niveles de acceso |
| `src/components/SIG.tsx` | Visor de mapa interactivo |
| `postcss.config.mjs` | PostCSS + Tailwind CSS v4 |
| `package.json` | Dependencias: React 19, Next 15, Framer Motion 12, lucide-react |
