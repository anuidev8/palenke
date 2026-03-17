# Pantalla: Detalle de noticia / evento

Diseña la pantalla de **detalle de noticia / evento**, que se abre cuando la persona hace clic en un ítem de:

- "Entérate" en la Home.
- "Lo último" en la Home.
- "Vení te contamos" en Memoria Afroterritorial.

---

## 1. Rol y objetivo

- Contar con más profundidad qué pasó: noticia, evento, taller o acción política.
- Ofrecer enlaces a documentos, memoria o territorio relacionados.
- Mantener al usuario dentro del ecosistema Palenke (no un blog genérico).

## 2. Paleta e identidad

- Misma base del sitio (fondos claros, beige, verdes suaves).
- Negro en título y meta-info. Verde en enlaces relacionados con territorio. Rojo en etiquetas de tipo (pronunciamiento, acción política). Amarillo en acentos culturales.

---

## 3. Estructura (de arriba hacia abajo)

### 3.1 Encabezado

- **Título grande** de la noticia/evento (tipografía display, peso fuerte).
- Debajo, **meta-info** en fila horizontal:
  - Fecha (ej. "12 de marzo de 2026").
  - Lugar / territorio (ej. "Buenaventura, Valle del Cauca").
  - Tipo: etiqueta con color → Noticia (verde), Taller (amarillo), Evento (verde-tierra), Pronunciamiento (rojo).

### 3.2 Imagen destacada

- Imagen ancha (full width del contenedor) arriba del cuerpo de texto.
- Opcional: caption debajo con crédito o descripción corta.

### 3.3 Cuerpo

- Bloque de texto principal (varios párrafos).
- Elementos opcionales intercalados:
  - Galería pequeña de fotos (grid 2–3 columnas).
  - Citas cortas en negrilla con acento verde o rojo en borde izquierdo.
  - Video embebido si aplica.

### 3.4 Bloque "Enlaces relacionados"

- Título: **"Explora más sobre esto"**.
- Lista de 2–4 mini-cards, cada una con:
  - Icono indicando el módulo de destino.
  - Título del recurso.
  - Módulo de origen (etiqueta: Memoria, Gobierno propio, Mirador).
- Destinos posibles:
  - Documentos en **Memoria Afroterritorial** (informe, pronunciamiento).
  - Instrumentos en **Gobierno propio** (reglamento relacionado).
  - Tableros en el **Mirador de datos del territorio** si aplica.

### 3.5 Navegación inferior

- Botón **"Volver a…"** que se adapta según origen:
  - Si vino de Entérate / Lo último → "Volver al Inicio".
  - Si vino de Vení te contamos → "Volver a Memoria Afroterritorial".
- Opcional: navegación anterior/siguiente entre noticias.

---

## 4. Reglas UX

- Mantener el mismo look & feel de la Home y Memoria.
- Que se sienta claramente una "crónica/noticia" ligada a los módulos políticos, no un blog genérico.
- Textos legibles, buena respiración. Máximo 800px de ancho para el cuerpo de texto.
- La imagen destacada y las citas dan identidad visual sin saturar.

---

## 5. Conexiones con otras pantallas

| Origen | Clic | Llega aquí |
|--------|------|------------|
| Home → Entérate (noticia) | Clic en card | Esta pantalla |
| Home → Lo último (evento) | Clic en ítem | Esta pantalla |
| Memoria → Vení te contamos | Clic en evento | Esta pantalla |
| **Desde aquí** → Enlaces relacionados | Clic en mini-card | Memoria, Gobierno propio o Mirador |
| **Desde aquí** → Volver | Clic en botón | Home o Memoria (según origen) |
