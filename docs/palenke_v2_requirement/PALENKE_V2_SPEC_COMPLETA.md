# Palenke Pensamiento v2 — Especificación completa

**Un solo documento**: plataforma, flujos, pantallas, secciones, componentes e interacciones según los requisitos Palenke v2.

---

## 1. Visión general

| Concepto | Detalle |
|--------|---------|
| **Nombre** | Palenke Pensamiento |
| **Vinculación** | Proceso de Comunidades Negras (PCN) |
| **Concepto** | “Casa digital” del Palenke/PCN: política, comunitaria, territorial. |
| **Objetivo global** | Que al entrar la persona entienda rápido: quiénes son, qué hacen, qué es importante ahora (Entérate / Lo último) y por dónde entrar (Memoria Afroterritorial, Gobierno propio, SCITA, ACC). |

---

## 2. Sistema de diseño global

### 2.1 Paleta de color

- **Base (toda la plataforma)**  
  - Fondos claros: blanco roto / beige suave.  
  - Tonos tierra y verdes suaves: calma, legibilidad, continuidad.

- **Acentos PCN (significado en el diseño)**  

| Color | Uso en UI | Significado |
|-------|-----------|-------------|
| **Negro** | Barra superior, títulos clave, textos importantes. | Identidad, dignidad, raíces afro. |
| **Verde** | Botones, estados activos, territorio, ACC, SIG. | Naturaleza, tierra, territorios. |
| **Rojo** | CTAs fuertes, etiquetas de lucha, énfasis político. | Lucha, resistencia, sacrificios históricos. |
| **Amarillo** | Detalles, esperanza, riqueza cultural. | Esperanza, riqueza cultural, aportes afro. |

- **Regla**: No saturar con los cuatro colores a la vez. Negro y verde como acentos principales; rojo solo en puntos clave; amarillo en detalles (líneas, iconos, etiquetas).

### 2.2 Tipografía y estética

- Títulos con peso (serif o sans según sistema).  
- Líneas o motivos finos en colores PCN (verde/rojo/amarillo) para identidad.  
- Estética **política, comunitaria y cálida**, sin perder profesionalismo. Evitar look “muy tech” o frío.

### 2.3 Componente global: Header

- **Ubicación**: Barra superior fija o muy visible en todas las pantallas.
- **Contenido**:
  - **Izquierda**: Logo Palenke/PCN (negro, verde, rojo).
  - **Derecha**: Menú principal:
    - Inicio  
    - Memoria Afroterritorial (módulo Biblioteca)  
    - Gobierno propio  
    - SCITA (Sistema Comunitario de Información Territorial Afrodescendiente)
  - **Campo de búsqueda**: “Buscar”, sencillo y visible (debajo del menú o alineado a la derecha del hero).
- **Estilos**: Fondo claro o ligeramente teñido (beige/tierra). Texto del menú en negro; ítem activo con subrayado o acento en verde o rojo.

### 2.4 Componente global: Footer

- **Contenido**: Logos (PCN, Palenke, aliados), Aviso legal, Política de datos, contacto y/o redes.
- **Estilos**: Fondo más oscuro (tierra profundo o negro suave), texto claro, acentos verde/amarillo en iconos o líneas.

### 2.5 Adaptabilidad (todas las pantallas)

- Desktop como referencia; estructura adaptable a **mobile**:
  - Menú colapsable (hamburger).
  - Secciones en dos columnas que se apilan (primero imagen/video, luego texto).
  - Accesos rápidos / grids: en móvil, cards apiladas o scroll horizontal suave.

---

## 3. Inventario completo de pantallas

| # | Pantalla | Tipo | Archivo de spec |
|---|----------|------|----------------|
| 1 | Inicio (Home) | Pantalla principal | `palenke_home.md` |
| 2 | Memoria Afroterritorial | Módulo | `Memoria Afroterritorial la Biblioteca-módulo de memoria.md` |
| 3 | Gobierno propio | Módulo | `Pantalla: Gobierno propio.md` |
| 4 | SCITA | Módulo | `ACC.md` |
| 5 | Detalle de noticia / evento | Sub-pantalla | `detalle_noticia_evento.md` |
| 6 | Listado de documentos | Sub-pantalla (plantilla) | `listado_documentos.md` |
| 7 | Formulario información ambiental | Modal / panel | `formulario_informacion_ambiental.md` |
| 8 | Mirador de datos del territorio | Módulo | `mirador_datos_territorio.md` |
| 9 | Detalle de tablero | Sub-pantalla | `mirador_datos_territorio.md` (sección B) |
| 10 | Geoportal interno | Enlace externo | `geoportal_interno.md` |

Mapa completo de conexiones entre pantallas: `screen_connections.md`

---

## 3b. Flujos de navegación y comportamiento al hacer clic

### 3b.1 Desde Inicio (Home)

| Elemento | Acción (clic) | Destino |
|---------|----------------|---------|
| Menú **Memoria Afroterritorial** | Clic | Pantalla Memoria Afroterritorial (biblioteca). |
| Menú **Gobierno propio** | Clic | Pantalla Gobierno propio. |
| Menú **SCITA** | Clic | Pantalla SCITA (mapa y capas). |
| Card **Área de conservación comunitaria** | Clic | SCITA (mapa + ACC). |
| Card **Protección hídrica** | Clic | Gobierno propio o SCITA. |
| Card **SIG Afro** | Clic | SCITA o geoportal directo. |
| Card **Mirador de datos** (si se incluye) | Clic | → Mirador de datos del territorio. |
| **Entérate** (cada noticia) | Clic | → **Detalle de noticia/evento**. |
| **Lo último** (cada evento) | Clic | → **Detalle de noticia/evento**. |

### 3b.2 Desde Memoria Afroterritorial

| Elemento | Acción (clic) | Destino |
|---------|----------------|---------|
| Menú superior | Clic | Inicio, Gobierno propio, SCITA (siempre disponibles). |
| Video de presentación | “Ver más documentos” (opcional) | Listados internos de biblioteca. |
| Card **Normativa vigente** | Clic | Listado de documentos normativos (puede cruzarse con Gobierno propio; acceso desde lógica de memoria). |
| Card **Memoria viva del territorio** | Clic | Listado de artículos, relatos, materiales culturales. |
| **Vení te contamos** (evento) | Clic | Ficha del evento o noticia relacionada (también visible en “Lo último” de la home). |

### 3.3 Desde SCITA

| Elemento | Acción (clic) | Destino |
|---------|----------------|---------|
| Menú superior | Clic | Inicio, Memoria Afroterritorial, Gobierno propio. |
| **Mapa** (clic sobre un ACC) | Clic en polígono/pin | Ficha de ACC o documento en Memoria Afroterritorial. |
| **Capas de información** (vista parcial) | Clic en capa | No cambia de pantalla; activa/desactiva capa en el mapa. Solo capas prioritarias, no el catálogo SIG completo. |
| **“Ir al geoportal SIG”** | Clic | Geoportal externo en nueva pestaña (SIG completo). Internos: acceso directo. Público: según config. |
| **“Ver tableros territoriales”** | Clic | Mirador de datos del territorio. |
| **“Enviar información ambiental”** | Clic | Formulario (modal/panel). Tras enviar: “Gracias” + volver al mapa o Memoria Afroterritorial. |

### 3.4 Desde Gobierno propio

| Elemento | Acción (clic) | Destino |
|---------|----------------|---------|
| Menú superior | Clic | Inicio, Memoria Afroterritorial, SCITA. |
| Cada botón del grid (Reglamentos, Planes de uso y manejo, etc.) | Clic | Listado de documentos de esa categoría (subpantalla o vista de biblioteca filtrada). Los documentos pueden vivir en la Biblioteca base; el acceso conceptual es desde Gobierno propio. |
| Desde un documento (dentro de una categoría) | Enlaces contextuales | Volver a Memoria Afroterritorial (vista general) o a SCITA (si hay vínculo con ACC o capas). |

### 3.5 Flujos por tipo de persona

- **Persona externa / comunidad**  
  Entra por Inicio → hero, ¿Quiénes somos?, Nuestro quehacer político → baja a Entérate / Lo último → abre noticia → puede ir a Memoria o Gobierno propio. Si le interesa territorio → Accesos rápidos → SCITA → explora mapa y capas → puede enviar información ambiental.

- **Equipo PCN / Palenke**  
  Entra por Inicio → menú directo a Gobierno propio o Memoria Afroterritorial. Desde Gobierno propio → Reglamentos o Planes de uso → consulta documentos. Desde SCITA → revisa ACC, capas, analiza información que luego se documenta en Memoria Afroterritorial.

---

## 4. Pantalla 1: Inicio (Home)

### 4.1 Rol y objetivo

- “Casa digital” del Palenke/PCN.
- Comunicar rápido: quiénes son, qué hacen, qué es importante ahora, por dónde entrar (Memoria, Gobierno propio, SCITA, ACC).

### 4.2 Estructura (de arriba hacia abajo)

#### 4.2.1 Header / Navegación principal

- Ya descrito en sección 2.3 (componente global).

#### 4.2.2 Hero: “Imagen con movimiento”

| Atributo | Detalle |
|----------|---------|
| **Layout** | Bloque ancho (full width dentro del contenedor principal). |
| **Contenido** | Imagen con movimiento: video de fondo, slider suave o animación (territorio, comunidad, procesos organizativos). Foco visual al entrar. |
| **Estética** | Movimientos suaves y dignos; overlays sutiles en negro translúcido permitidos si se añade frase corta. |
| **Interacción** | Ningún clic obligatorio; puede enlazar a módulos si se define. |

#### 4.2.3 Sección “¿Quiénes somos?”

| Atributo | Detalle |
|----------|---------|
| **Layout** | Dos columnas. |
| **Columna izquierda** | Título “¿Quiénes somos?”; opcional ícono o pequeño gráfico (sobrio). |
| **Columna derecha** | Bloque de texto (varios renglones) descripción de la organización. |
| **Estética** | Fondo claro. Título en negro; línea verde o roja a la izquierda como acento. |

#### 4.2.4 Bloque “Video + Nuestro quehacer político”

| Atributo | Detalle |
|----------|---------|
| **Layout** | Dos columnas. |
| **Columna izquierda** | Reproductor de video (placeholder con botón play claro); video de presentación/campaña. |
| **Columna derecha** | Tarjeta grande: título “Nuestro quehacer político”, texto breve (sustituye misión/visión), botón “Ver más” opcional. |
| **Estética** | Peso visual en “Nuestro quehacer político”: borde verde/rojo o fondo ligeramente distinto; tipografía fuerte en el título. |

#### 4.2.5 Sección “Accesos rápidos”

| Atributo | Detalle |
|----------|---------|
| **Título** | “Accesos rápidos”. |
| **Contenido** | 3 tarjetas/botones grandes en fila, diseño consistente: (1) Área de conservación comunitaria, (2) Protección hídrica, (3) Sistema de información geográfica afrodescendiente (SIG Afro). |
| **Cada tarjeta** | Icono (territorio, agua, mapa), texto corto, estilo card/botón grande clickeable; hover: ligero levantamiento y cambio de borde/color. |
| **Colores** | Verde y tierra como base; detalles en rojo/amarillo (iconos, borde superior) donde tenga sentido. |
| **Clic** | Ver tabla 3.1 (ACC → SCITA o subsección; Protección hídrica → sección específica; SIG Afro → SCITA o geoportal). |

#### 4.2.6 Sección “Entérate” y “Lo último”

| Atributo | Detalle |
|----------|---------|
| **Layout** | Dos columnas (o título general opcional + dos columnas). |

**Columna izquierda — “Entérate”**

- Título: “Entérate”.
- Subtítulo: “Noticias publicadas por PCN”.
- Componente: card o listado de 2–3 noticias con: miniatura, título, resumen o primera línea, enlace “Ver más”.
- Clic en noticia: puede llevar a Memoria, Gobierno propio o SCITA según contenido.

**Columna derecha — “Lo último”**

- Título: “Lo último”.
- Subtítulo opcional: “Talleres, actividades y eventos recientes”.
- Componente: lista vertical de 3–5 ítems con título breve, fecha, lugar, etiqueta (evento, taller, reunión).
- Clic en evento: ficha de evento o noticia relacionada.

**Estética**: Coherencia entre ambos bloques; acentos PCN en etiquetas, títulos o líneas.

#### 4.2.7 Frase icónica + navegación inferior

- Bloque centrado: **frase icónica** (placeholder) que represente fuerza política y espiritual del proceso.
- Tipografía distintiva, más grande, mucho espacio en blanco; cierre simbólico antes del footer.
- Banda de **navegación secundaria**: enlaces a secciones importantes, contacto, discreta.

#### 4.2.8 Footer

- Descrito en sección 2.4 (componente global).

### 4.3 Reglas UX (Inicio)

- Claridad: cada bloque con título visible y propósito obvio.
- Scroll fluido: secciones separadas pero parte de una misma narrativa.
- Nav clara para: Memoria Afroterritorial, Gobierno propio, SCITA, noticias y “Lo último”.

---

## 5. Pantalla 2: Memoria Afroterritorial

### 5.1 Rol y objetivo

- Módulo de **Biblioteca / Memoria Afroterritorial**.
- Objetivos: explicar qué es la Memoria Afroterritorial; acceso rápido a normativa vigente; visibilizar memoria viva (artículos, cultura, procesos); invitar con tono cercano (“Vení te contamos”).

### 5.2 Paleta (esta pantalla)

- Misma base (fondos claros, beige, verdes suaves). Negro en títulos; verde en territorio y botones; rojo en acentos de normativa y memoria viva; amarillo en riqueza cultural.

### 5.3 Estructura (de arriba hacia abajo)

#### 5.3.1 Encabezado local de sección

- **Contenido**: Título “Memoria Afroterritorial” (grande, centrado o alineado a la izquierda). Subtítulo opcional: espacio de biblioteca/memoria documental y viva del territorio.
- **Estética**: Tipografía fuerte; línea o acento en colores PCN (verde/rojo/amarillo).

#### 5.3.2 Hero: video de presentación

- **Contenido**: Video de presentación grande, horizontal, ancho del contenedor; etiqueta “Video de presentación” o similar.
- **Controles**: Play, pausa, tiempo estándar.
- **Opcional**: Pequeño texto debajo o al lado para contexto.
- **Clic**: Opcional “Ver más documentos” → listados internos de biblioteca.

#### 5.3.3 Sección “¿Qué es?” (introducción)

- **Layout**: Dos columnas.
- **Columna izquierda**: Título “¿Qué es?”, bloque de texto (varias líneas) explicando qué es la Memoria Afroterritorial.
- **Columna derecha**: Imagen representativa (territorio, archivo, comunidad); protagonismo visual sin competir con el video.
- **Estética**: Fondo claro; título en negro; acento (línea verde o amarilla) junto al título.

#### 5.3.4 Bloque “Normativa vigente” + “Qué se va a encontrar”

- **Layout**: Dos columnas.
- **Columna izquierda**: Tarjeta/box CTA **“Normativa vigente”** (enlace a colección de documentos normativos). Claramente clickeable; borde verde, fondo suave con acento amarillo o rojo discreto.
- **Columna derecha**: Título “Qué se va a encontrar”; párrafo o listado de qué contiene la sección (tipos de documentos, temas).
- **Clic en “Normativa vigente”**: Listado de documentos normativos (leyes, reglamentos, acuerdos).

#### 5.3.5 Bloque “¿Qué es? / Memoria viva del territorio”

- **Layout**: Dos columnas (contenido alternado).
- **Columna izquierda**: Título “¿Qué es?” o “¿Qué es la memoria viva?”; texto sobre memoria viva, procesos, relatos.
- **Columna derecha**: Tarjeta/bloque destacado **“Memoria viva del territorio”** (card con foto y overlay de texto, o imagen fuerte con título superpuesto). Sensación de contenidos vivos (artículos, crónicas, materiales culturales).
- **Colores**: Verde + amarillo + detalles rojos (vitalidad, riqueza cultural, lucha).
- **Clic en “Memoria viva del territorio”**: Listado de artículos, relatos, materiales culturales.

#### 5.3.6 Sección “Vení te contamos”

- **Título**: “Vení te contamos”.
- **Contenido**: Listado de eventos/actividades/contenidos académicos y normativos (memoria y biblioteca), o carrusel horizontal / listado vertical de tarjetas de eventos.
- **Cada ítem**: Título del evento, fecha, lugar, breve texto.
- **Estética**: Tono cercano; título en negro con ícono cálido opcional.
- **Clic en evento**: Ficha del evento o noticia relacionada (también en “Lo último” de la home).

#### 5.3.7 Footer de sección / “Lo normal”

- Enlaces internos: Inicio, Gobierno propio, SCITA; información básica o políticas.
- Estética alineada al footer global.

### 5.4 Reglas UX (Memoria Afroterritorial)

- Narrativa al scroll: título → video → ¿Qué es? → Normativa + qué hay dentro → Memoria viva → Vení te contamos.
- “Normativa vigente” y “Memoria viva del territorio” muy claros y clickeables como entradas a subsecciones.
- Textos cortos y claros; buena respiración visual.

---

## 6. Pantalla 3: Gobierno propio

### 6.1 Rol y objetivo

- Reúne los **instrumentos de Gobierno Propio**: reglamentos, planes, rutas.
- Objetivos: explicar qué es Gobierno propio; botones claros por tipo de instrumento; contexto político y técnico sin abrumar.

### 6.2 Paleta (esta pantalla)

- Base igual al sitio. Negro en títulos y categorías; verde en territorio y planes; rojo en litigio/defensa; amarillo en riqueza normativa (líneas, iconos).

### 6.3 Estructura (de arriba hacia abajo)

#### 6.3.1 Encabezado de sección

- Título: “Gobierno propio”.
- Texto intro: “Espacio donde se organizan los reglamentos, planes y rutas de acción del Gobierno propio comunitario” (placeholder).
- Estética: Título en negro, fuerte; acento gráfico (línea o motivo PCN).

#### 6.3.2 Bloque “¿Qué es? / ¿Qué hace? Gobierno propio”

- **Opción A (dos columnas)**: Izquierda “¿Qué es Gobierno propio?” + párrafo; derecha “¿Qué hace?” o “¿Para qué sirve?” + lista corta (defensa del territorio, regulación interna, etc.).
- **Opción B (una columna)**: Un bloque con título y texto que combine “qué es” y “qué hace”.
- Objetivo: Base conceptual antes del grid de instrumentos.

#### 6.3.3 Grid de botones principales (Instrumentos)

- **Layout**: Cuadrícula 2 columnas × 3 filas (6 tarjetas de igual peso).
- **Tarjetas**:
  1. Reglamentos  
  2. Planes de uso y manejo  
  3. Litigio estratégico  
  4. Conservación comunitaria  
  5. Planes de etnodesarrollo  
  6. Protección hídrica  

- **Cada tarjeta**: Título del instrumento; una línea de texto (placeholder) de qué se encuentra; ícono (documento, mapa, balanza para litigio, agua, etc.); fondo claro, borde suave; hover: borde verde más fuerte y ligero sombreado.
- **Colores por tipo**: Reglamentos/planes: verde; Litigio estratégico: toque rojo (título o icono); Protección hídrica: azul/verde con paleta general.
- **Clic**: Listado de documentos de esa categoría (subpantalla o vista de biblioteca filtrada).

#### 6.3.4 Contexto “Gobierno propio en acción” (opcional)

- **Desktop**: Grid a la izquierda; a la derecha bloque con título “Gobierno propio en acción” y párrafo de cómo se usan los instrumentos en la práctica.
- **Mobile**: Este bloque debajo del grid.

#### 6.3.5 Logos de aliados

- Título: “Aliados” o “Con aliados y procesos articulados con el PCN”.
- Fila de logos (placeholder).
- Estética: Fondo ligeramente distinto (gris muy suave o tierra clara).

### 6.4 Reglas UX (Gobierno propio)

- Foco en los 6 botones de instrumentos; reconocibles como puertas de entrada.
- No saturar con listados de documentos; esta pantalla define y organiza.
- Cada tarjeta como “módulo” que luego tiene su propia página o listado.
- Seriedad y estructura; estética comunitaria y política.

---

## 7. Pantalla 4: SCITA (Sistema Comunitario de Información Territorial Afrodescendiente)

### 7.1 Rol y objetivo

- **Puerta de entrada a la lectura territorial** desde el portal, **sin sustituir el sistema SIG completo**.
- Objetivos: mostrar de inmediato mapa con todas las ACC; activar/desactivar solo algunas capas específicas (ambientales/territoriales) clave para los proyectos del Palenke/PCN; explicar qué es y qué hace el sistema; camino claro para enviar información ambiental; camino claro para **abrir el sistema de información geográfica completo** (geoportal).

### 7.2 Paleta (esta pantalla)

- Verde como color principal (territorio, ACC, naturaleza). Negro en títulos y labels del mapa. Rojo en indicadores (alertas, denuncias, capas críticas). Amarillo en detalles de riqueza del territorio.

### 7.3 Estructura (de arriba hacia abajo)

#### 7.3.1 Encabezado de sección

- Título: “SCITA – Sistema comunitario de información territorial afrodescendiente”.
- Frase corta: "Aquí ves las Áreas de Conservación Comunitaria y algunas capas clave del territorio, sin reemplazar el sistema SIG completo."

#### 7.3.2 Hero: Mapa sencillo con ACC

- **Contenido**: Mapa o geovisor sencillo ocupando gran parte del ancho; **todas las ACC** visibles. Controles: zoom +/–, arrastre, leyenda mínima.
- **Fuente**: Embed simplificado del geoportal o mockup, pero **solo con las capas que SCITA permite ver**. No intenta reemplazar todas las funciones del SIG completo; solo una **vista curada**.
- **UX**: Al entrar se ve mapa + ACC sin clic previo.
- **Clic en un ACC**: Ficha de ACC o documento en Memoria Afroterritorial (MVP: reconocimiento visual).

#### 7.3.3 Bloque "¿Qué es y qué hace?"

- **Layout**: Dos columnas.
- **Columna izquierda**: Video sobre el sistema (placeholder); explica el sistema en lenguaje visual y cómo se relaciona con las luchas territoriales.
- **Columna derecha**: Título "¿Qué es el Sistema comunitario de información territorial afrodescendiente?"; párrafos cortos: organiza información territorial de las comunidades negras; **el mapa de arriba muestra solo algunas capas clave; el sistema completo vive en el SIG**.
- **Estética**: Etiqueta "Este sistema se ve parcialmente en el mapa superior".

#### 7.3.4 Selector "Capas de información (vista parcial)"

- **Título**: "Capas de información (vista parcial)".
- **Concepto**: Solo se muestran capas específicas definidas como prioritarias. **No es el catálogo completo del SIG**; es una vista curada.
- **Componente**: Grid de botones/tarjetas (ej. 2×3 = 6+1 capas).
- **Capas**: Áreas de conservación comunitaria (capa base, siempre activa); Información hídrica; Fauna y flora; Cobertura boscosa; Infraestructura comunitaria; Alertas ambientales; Límites territoriales.
- **Cada card**: Nombre de la capa, icono. **Estado inactivo**: fondo claro, borde gris/verde suave. **Estado activo**: fondo verde suave, borde verde más fuerte, acento rojo/amarillo. Clic activa/oculta la capa **en el mapa** (no cambia de pantalla).
- **UX**: Múltiples capas seleccionables; solo cambia el contenido visual del mapa.

#### 7.3.5 Bloque "Abrir sistema de información geográfica"

- **Título**: "Abrir sistema de información geográfica completo".
- **Texto**: "Si quieres interactuar con todas las capas y herramientas del sistema de información geográfica, entra al geoportal del equipo SIG."
- **Botón**: "Ir al geoportal SIG" (abre nueva pestaña).
- **Comportamiento**: Internos/admin: clic → geoportal en nueva pestaña. Público: según config.
- **UX**: El diseño deja claro que el portal NO reemplaza al geoportal, solo lo enlaza.
- **Enlace complementario**: "Ver tableros territoriales" → Mirador de datos del territorio.

#### 7.3.6 Bloque "Enviar información ambiental"

- **Título**: "Envía información ambiental".
- **Texto**: Las comunidades pueden corregir/actualizar información (ej. "aquí no hay tanta agua", "esta quebrada está seca").
- **CTA**: Botón grande "Enviar información ambiental" o "Aportar información desde el territorio".
- **Estilo**: Fondo verde intenso, texto blanco; detalle rojo discreto.
- **Clic**: Abre formulario (modal/panel). Tras envío: "Gracias por tu aporte"; opción volver al mapa o ir a Memoria Afroterritorial.

### 7.4 Reglas UX (SCITA)

- Al entrar se entienden tres cosas: (1) mapa parcial con ACC y capas clave, (2) si quiere algo más profundo, existe un botón al sistema SIG completo, (3) se puede enviar información ambiental.
- SCITA es un **visor político-comunitario** sobre datos seleccionados, con salida directa al sistema técnico (geoportal) y a la participación comunitaria (formulario).
- Priorizar lo visual: mapa grande, botones de capas claros, botón geoportal visible, botón de enviar muy destacado.

---

## 8. Pantalla 5: Detalle de noticia / evento

Spec completa en `detalle_noticia_evento.md`.

**Resumen**: Se abre al hacer clic en noticias (Entérate, Lo último) o eventos (Vení te contamos). Muestra título, meta-info (fecha, lugar, tipo), imagen destacada, cuerpo de texto, bloque "Explora más sobre esto" con mini-cards a Memoria/Gobierno/Mirador, y botón "Volver a..." adaptativo según origen.

---

## 9. Pantalla 6: Listado de documentos (plantilla reutilizable)

Spec completa en `listado_documentos.md`.

**Resumen**: Plantilla única reutilizada para Normativa vigente, Memoria viva, y los 6 instrumentos de Gobierno propio. Título dinámico, barra de filtros (búsqueda, territorio, tipo, año), tabla/cards de documentos con título, tipo, territorio, año, etiquetas, visibilidad, botón Ver/Descargar. Breadcrumb para volver al módulo de origen.

---

## 10. Pantalla 7: Formulario "Enviar información ambiental"

Spec completa en `formulario_informacion_ambiental.md`.

**Resumen**: Modal o panel lateral desde SCITA. Campos: tipo de observación (select), descripción (textarea), referencia al lugar (texto), nombre y contacto (opcionales). Post-envío: mensaje de agradecimiento + botones "Volver al mapa" y "Ver Memoria Afroterritorial".

---

## 11. Pantalla 8: Mirador de datos del territorio

Spec completa en `mirador_datos_territorio.md`.

**Resumen**: Dos sub-pantallas. (A) Listado de tableros: grid de cards con título, descripción, tema, territorio, thumbnail, botón "Ver tablero". (B) Detalle de tablero: breadcrumb, título, descripción, iframe Power BI embebido, info complementaria, "Volver al Mirador".

Se llega desde SCITA ("Ver tableros territoriales"), opcionalmente desde Home (Accesos rápidos) o desde enlaces en Detalle de noticia/evento.

---

## 12. Pantalla 9: Geoportal interno (acceso externo)

Spec completa en `geoportal_interno.md`.

**Resumen**: Enlace para usuarios internos/admin al geoportal SIG externo (Hileros/PCN). Clic abre nueva pestaña. Página intermedia opcional con texto explicativo y botón "Ir al Geoportal". Solo visible para rol interno/admin.

---

## 13. Resumen de componentes por pantalla

| Pantalla | Secciones / componentes principales |
|----------|-------------------------------------|
| **Inicio** | Header, Hero (imagen con movimiento), ¿Quiénes somos?, Video + Nuestro quehacer político, Accesos rápidos (3+ cards), Entérate, Lo último, Frase icónica, Nav secundaria, Footer. |
| **Memoria Afroterritorial** | Encabezado local, Video presentación, ¿Qué es? + imagen, Normativa vigente + Qué se va a encontrar, Memoria viva del territorio, Vení te contamos, Footer sección. |
| **Gobierno propio** | Encabezado, ¿Qué es?/¿Qué hace?, Grid 6 instrumentos, Gobierno propio en acción (opc.), Logos aliados. |
| **SCITA** | Encabezado, Mapa sencillo ACC (vista curada), ¿Qué es y qué hace?, Capas de información (vista parcial, grid), Abrir sistema SIG completo (botón geoportal), Ver tableros territoriales, Enviar información ambiental. |
| **Detalle noticia/evento** | Título, meta-info, imagen destacada, cuerpo texto, enlaces relacionados, botón volver. |
| **Listado de documentos** | Breadcrumb, título dinámico, barra filtros, tabla/cards de documentos, paginación. |
| **Formulario info ambiental** | Modal/panel: tipo observación, descripción, lugar, contacto, enviar, mensaje éxito. |
| **Mirador de datos** | Listado: grid tableros + filtros. Detalle: iframe Power BI + info. |
| **Geoportal interno** | Enlace/página intermedia → URL externa (nueva pestaña). |

---

## 14. Resumen de destinos de clic (por componente)

- **Header (todas)**: Inicio, Memoria Afroterritorial, Gobierno propio, SCITA; Buscar.
- **Home – Accesos rápidos**: ACC → SCITA; Protección hídrica → Gobierno propio/SCITA; SIG Afro → SCITA/geoportal; Mirador → Mirador de datos.
- **Home – Entérate / Lo último**: → **Detalle de noticia/evento**.
- **Memoria – Normativa vigente**: → **Listado de documentos** (Normativa vigente).
- **Memoria – Memoria viva**: → **Listado de documentos** (Memoria viva).
- **Memoria – Vení te contamos**: → **Detalle de noticia/evento**.
- **SCITA – Mapa (clic ACC)**: Ficha ACC o documento Memoria.
- **SCITA – Capas (vista parcial)**: Activa/desactiva capa en mapa (sin cambio de pantalla). Solo capas prioritarias, no el catálogo SIG completo.
- **SCITA – “Ir al geoportal SIG”**: → Geoportal externo en **nueva pestaña** (SIG completo). Internos: acceso directo.
- **SCITA – Ver tableros**: → **Mirador de datos del territorio**.
- **SCITA – Enviar información**: → **Formulario info ambiental** → mensaje éxito → SCITA o Memoria.
- **SCITA – Geoportal** (internos/admin): → URL externa nueva pestaña.
- **Gobierno propio – Cada instrumento**: → **Listado de documentos** de esa categoría.
- **Detalle noticia – Enlaces relacionados**: → Memoria, Gobierno propio o Mirador.
- **Listado docs – Ver/Descargar**: → PDF nueva pestaña.
- **Mirador – Ver tablero**: → **Detalle de tablero** (iframe).

---

Mapa completo de conexiones entre todas las pantallas: `screen_connections.md`

Con este documento se tiene **toda la especificación v2 en un solo archivo**: visión, diseño global, flujos, las 4 pantallas principales + 5 pantallas secundarias + 1 acceso externo, con todos los componentes, interacciones y reglas UX. **Todos los botones y clics tienen destino definido.**

---

## 15. Auditoría de wireframes — Enlaces vivos vs muertos (marzo 2026)

Revisión completa de todos los `href` y elementos clickeables en los 10 archivos HTML (`wireframes/*.html`).

### 15.1 Resumen ejecutivo

| Pantalla | Enlaces vivos | Enlaces muertos (críticos) | Estado |
|----------|:------------:|:--------------------------:|--------|
| Inicio (`index.html`) | 10 | **6** | Necesita corrección |
| Memoria (`memoria.html`) | 8 | **3** (afectan ~6 elementos) | Necesita corrección |
| Gobierno (`gobierno.html`) | 8 | **6** (los 6 instrumentos!) | Necesita corrección |
| SCITA (`scita.html`) | 10 | **1** | Corrección menor |
| Detalle noticia (`detalle-noticia.html`) | 7 | 0 | Completo |
| Listado docs (`listado-documentos.html`) | 6 | 0 críticos | Completo |
| Formulario (`formulario-ambiental.html`) | 2 | 0 | Completo |
| Mirador (`mirador.html`) | 8 | **3** + 1 faltante | Necesita corrección + pantalla nueva |
| Geoportal (`geoportal.html`) | 4 | 0 críticos | Completo |

**Total: 19 enlaces muertos críticos + 1 pantalla HTML faltante (`detalle-tablero.html`)**

### 15.2 Detalle de enlaces muertos por pantalla

#### Inicio — 6 muertos

1. Card "Protección hídrica" → `href="#"` → debe ir a `gobierno.html`
2. Hero "Conoce Nuestra Lucha" → `href="#"` → debe ir a `memoria.html`
3. "Ver más" (quehacer político) → `href="#"` → debe ir a `gobierno.html`
4. Entérate → "Leer más" (×2) → `href="#"` → debe ir a `detalle-noticia.html`
5. Lo último → 4 eventos → sin `<a>` → deben enlazar a `detalle-noticia.html`

#### Memoria — 3 muertos

6. "Normativa vigente" → Explorar documentos → `href="#"` → `listado-documentos.html`
7. "Memoria viva" card → es `<div>`, no `<a>` → `listado-documentos.html`
8. Vení te contamos → 3 cards sin `<a>` → `detalle-noticia.html`

#### Gobierno — 6 muertos

9–14. Las 6 tarjetas de instrumentos (Reglamentos, Planes, Litigio, Conservación, Etnodesarrollo, Protección hídrica) son `<div>`, no `<a>` → todas deben envolver en `<a href="listado-documentos.html">`

#### SCITA — 1 muerto

15. CTA "Aportar información desde el territorio" → `href="#"` → `formulario-ambiental.html`

#### Mirador — 3 muertos + 1 faltante

16–18. "Ver tablero" (×3 cards) → `href="#"` → `detalle-tablero.html` (archivo NO existe)
19. Falta enlace "Volver a SCITA" → debe añadirse apuntando a `scita.html`

### 15.3 Pantalla faltante: Detalle de tablero

La pantalla #9 (Detalle de tablero) aparece en el inventario de pantallas (sección 3) y en `screen_connections.md`, pero **no tiene wireframe HTML**. Debe crearse `wireframes/detalle-tablero.html` con:

- Breadcrumb: Inicio > Mirador > [nombre del tablero]
- Título y descripción
- iframe Power BI (placeholder)
- Información complementaria (territorio, fecha, fuente)
- "Volver al Mirador" → `mirador.html`
- "Ver en SCITA" (opcional) → `scita.html`

### 15.4 Plan de corrección

| Fase | Acción | Archivos afectados |
|------|--------|--------------------|
| 1 | Crear `detalle-tablero.html` | Nuevo archivo |
| 2 | Conectar 6 instrumentos de Gobierno | `gobierno.html` |
| 3 | Conectar Normativa, Memoria viva, eventos | `memoria.html` |
| 4 | Conectar cards Home, CTAs hero, noticias, eventos | `index.html` |
| 5 | Conectar CTA SCITA + tableros Mirador + back-link | `scita.html`, `mirador.html` |
| 6 | Re-capturar wireframes actualizados a Figma | Todos los modificados |

Ver detalle completo de la auditoría y los 19 enlaces en: `screen_connections.md` (sección "Auditoría de wireframes HTML").
