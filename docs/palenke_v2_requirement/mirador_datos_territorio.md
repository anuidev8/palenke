# Pantalla: Mirador de datos del territorio

Diseña el módulo **"Mirador de datos del territorio"**, que presenta tableros de datos (dashboards Power BI o similar) con información territorial y estadística del PCN.

---

## 1. Rol y objetivo

- Centralizar los tableros de datos territoriales en un solo punto de acceso.
- Permitir que personas internas y, en algunos casos, externas consulten datos visuales sobre el territorio.
- Respetar visibilidad: algunos tableros son públicos, otros solo internos.

## 2. Paleta e identidad

- Base del sitio. Verde como acento principal (datos del territorio). Amarillo en detalles de riqueza informativa. Negro en títulos.

---

## 3. Conexiones de entrada (cómo se llega aquí)

- Desde **SCITA**: bloque al final "Ver tableros territoriales" → Mirador.
- Desde **Home**: card en "Accesos rápidos" si se decide posicionarlo (opcional).
- Desde **Detalle de noticia/evento**: enlace relacionado tipo "Ver datos" → Mirador.
- Desde el **menú principal** si se añade como ítem (opcional en MVP).

---

## 4. Estructura — Pantalla A: Listado de tableros

### 4.1 Encabezado

- Título: **"Mirador de datos del territorio"**.
- Subtítulo: "Tableros de datos sobre nuestros territorios, comunidades y procesos" (placeholder).

### 4.2 Filtros

- Búsqueda por título/palabra clave.
- Filtros:
  - Tema (Agua, Territorio, Demografía, Economía, etc.).
  - Territorio / región.
  - Visibilidad (solo visible para internos): Público / Interno.

### 4.3 Grid de tableros

Cards en grid (2–3 columnas desktop, 1 columna mobile):

| Campo | Descripción |
|-------|-------------|
| **Título** | Nombre del tablero |
| **Descripción** | 1–2 líneas resumen |
| **Tema** | Etiqueta de color |
| **Territorio** | Región asociada |
| **Icono visibilidad** | Público (abierto) o Interno (candado) |
| **Thumbnail** | Imagen preview del tablero (si disponible) |
| **Acción** | "Ver tablero" |

### 4.4 Clic en "Ver tablero"

→ Navega a la pantalla de Detalle de tablero (ver sección 5).

---

## 5. Estructura — Pantalla B: Detalle de tablero

> **NOTA (auditoría marzo 2026):** Esta sub-pantalla tiene spec completa aquí abajo, pero **no tiene wireframe HTML** (`detalle-tablero.html`). Debe crearse para que los botones "Ver tablero" del Mirador tengan destino funcional. Ver plan de corrección en `screen_connections.md` y `PALENKE_V2_SPEC_COMPLETA.md` sección 15.

### 5.1 Encabezado

- Breadcrumb: Inicio > Mirador de datos > [Nombre del tablero].
- Título del tablero.
- Descripción ampliada (párrafo).
- Meta-info: Tema, Territorio, Fecha de actualización, Visibilidad.

### 5.2 Iframe / Embed del tablero

- Bloque principal: iframe que muestra el dashboard Power BI (o herramienta equivalente).
- Controles: Pantalla completa (expand), actualizar.
- Placeholder en MVP: rectángulo gris con texto "Tablero Power BI embebido aquí".

### 5.3 Información complementaria

- Debajo del iframe:
  - Fuente de datos.
  - Fecha de última actualización.
  - Contacto del equipo responsable.

### 5.4 Navegación

- "Volver al Mirador" → listado.
- "Ver en SCITA" → si el tablero tiene relación con capas del mapa (opcional).

---

## 6. Reglas UX

- El iframe del tablero debe ser lo más grande posible en pantalla (mínimo 70% del viewport en desktop).
- Los filtros del listado deben ser rápidos; no sobrecargar con opciones.
- En mobile, el iframe del tablero se adapta al ancho o se ofrece enlace a pantalla completa.

---

## 7. Conexiones con otras pantallas

| Origen | Clic | Destino |
|--------|------|---------|
| SCITA → "Ver tableros territoriales" | Clic | Listado Mirador |
| Home → Accesos rápidos (si se incluye) | Clic | Listado Mirador |
| Detalle noticia → Enlace relacionado | Clic | Listado o Detalle de tablero |
| **Listado** → "Ver tablero" | Clic | Detalle de tablero (iframe) |
| **Detalle** → "Volver al Mirador" | Clic | Listado Mirador |
| **Detalle** → "Ver en SCITA" | Clic | SCITA |

---

## 8. Área interna / Admin (gestión de tableros)

Para el equipo interno:

- Lista de tableros con acciones: Crear, Editar, Eliminar.
- Formulario de creación/edición:
  - Título.
  - Descripción.
  - URL del embed (Power BI u otro).
  - Tema.
  - Territorio.
  - Visibilidad (Público / Interno).
  - Thumbnail (upload opcional).
