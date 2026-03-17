# User Flow Board y espacio tipo Jam

## Qué es el Flow Board

El **User Flow Board** es una página tipo pizarra (jam/board) que reúne:

- **Las 4 pantallas** del Palenke v2 (Inicio, Memoria Afroterritorial, Gobierno propio, SCITA) como tarjetas.
- **Flechas** que indican flujos desde Inicio hacia cada módulo (según el menú).
- **Notas tipo sticky** con resúmenes de flujo (qué pasa al hacer clic en cada zona).
- **Leyenda** de uso del board.

Está en el proyecto como **wireframe capturado en Figma** y como **HTML** para seguir editándolo.

## Dónde está

- **HTML:** `wireframes/flow-board.html`
- **Figma:** mismo archivo que los wireframes; página/frame llamado tipo **User Flow Board** o **Flow board**.

Servir los wireframes (por ejemplo `python3 -m http.server 8765` desde la raíz del repo) y abrir:

`http://localhost:8765/wireframes/flow-board.html`

## Cómo usarlo como “jam” o pizarra

### En Figma (archivo de diseño)

- En el frame **User Flow Board** puedes:
  - **Añadir formas** (rectángulos, círculos) para nuevos bloques o pantallas.
  - **Dibujar líneas/connectors** (herramienta Connector o líneas con punta de flecha) para nuevos flujos.
  - **Añadir texto** o comentarios en los nodos o junto a las flechas.
- Así tienes un “board” fijo donde documentar flujos sin tocar el código.

### En FigJam (pizarra colaborativa)

Si quieres un espacio tipo **jam** (pizarra infinita, stickies, dibujo libre):

1. Crear un **nuevo archivo FigJam** en tu cuenta de Figma.
2. **Insertar → Frame o imagen:** pegar o insertar el frame del **User Flow Board** (o una exportación en imagen) como referencia.
3. Usar en FigJam:
   - **Sticky notes** para notas de flujo, ideas, cambios.
   - **Connector arrows** entre stickies o entre el board y nuevas ideas.
   - **Shapes / draw** para esquemas adicionales.
4. Opcional: en el mismo FigJam, **Insertar → Figma** y enlazar los frames de las pantallas (Inicio, Memoria, Gobierno, SCITA) del archivo de diseño; así las pantallas y el flow board viven en la misma jam.

Con eso puedes **dibujar, poner notas y flechas según el user flow** manteniendo los wireframes como referencia.

## Resumen de flujos (referencia)

- **Inicio:** menú → Memoria, Gobierno propio, SCITA; cards (ACC, protección hídrica, SIG Afro) → SCITA/Gobierno/geoportal; Entérate / Lo último → noticia o evento.
- **Memoria:** normativa → listado; memoria viva → listado; eventos → ficha.
- **Gobierno propio:** cada botón (reglamentos, planes, litigio, etc.) → listado de esa categoría.
- **SCITA:** clic en mapa (ACC) → ficha o doc; capas solo cambian mapa; “Enviar información ambiental” → formulario.

Detalle completo en `index_flow.md`.
