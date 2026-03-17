# Pantalla: Listado de documentos (plantilla reutilizable)

Diseña una **plantilla de listado de documentos** reutilizable para:

- El botón "Normativa vigente" en Memoria Afroterritorial.
- Cada botón de Gobierno propio: Reglamentos, Planes de uso y manejo, Litigio estratégico, Conservación comunitaria, Planes de etnodesarrollo, Protección hídrica.
- Cualquier categoría futura de la Biblioteca Base.

---

## 1. Rol y objetivo

- Mostrar de forma clara los documentos disponibles en esa categoría, con filtros simples.
- Respetar visibilidad público/interno (los documentos sensibles no aparecen en vista pública).
- Un solo patrón de listado que se recicla en todas las secciones.

## 2. Paleta e identidad

- Misma base del sitio. El color de acento del encabezado varía según el módulo de origen:
  - Desde Memoria → acento verde.
  - Desde Gobierno propio → acento verde (instrumentos generales) o rojo (litigio estratégico).

---

## 3. Estructura (de arriba hacia abajo)

### 3.1 Encabezado

- **Título dinámico** según la categoría:
  - "Normativa vigente", "Reglamentos", "Planes de uso y manejo", "Litigio estratégico", "Conservación comunitaria", "Planes de etnodesarrollo", "Protección hídrica".
- **Subtítulo corto** explicando qué tipo de documentos hay aquí (placeholder por categoría).
- **Breadcrumb**: Inicio > Gobierno propio > Reglamentos (o Inicio > Memoria > Normativa vigente).

### 3.2 Barra de filtros

- **Búsqueda** por título/palabra clave (campo de texto con icono lupa).
- **Filtros** (dropdowns o chips):
  - Territorio (región, consejo comunitario).
  - Tipo (solo en Normativa si aplica: ley, decreto, acuerdo, resolución).
  - Año (si aplica).
- Botón "Limpiar filtros".

### 3.3 Lista / tabla de documentos

Cada fila/card muestra:

| Campo | Descripción |
|-------|-------------|
| **Título** | Nombre del documento |
| **Tipo** | Reglamento, plan, ruta, informe, ley, decreto… |
| **Territorio** | Región o consejo comunitario asociado |
| **Año** | Fecha de expedición o publicación |
| **Etiquetas** | Género/MJN, ACC, litigio, etc. (chips de color) |
| **Visibilidad** | Icono candado solo visible para internos |
| **Acción** | Botón "Ver / Descargar" |

**Vista desktop**: Tabla con filas (sortable por columna).
**Vista mobile**: Cards apiladas con los campos relevantes.

### 3.4 Paginación

- Paginación simple (1, 2, 3… o "Cargar más").
- Contador: "Mostrando 1–10 de 47 documentos".

### 3.5 Al hacer clic en "Ver / Descargar"

Comportamiento MVP:
- Abrir el documento en una pestaña nueva (PDF) o descarga directa.
- **Opcional (fase futura)**: ficha sencilla con resumen, metadata y botón de descarga.

---

## 4. Reglas UX

- Minimalista, muy orientado a encontrar rápido el documento.
- Filtros siempre visibles en desktop; en mobile, colapsables tras un botón "Filtrar".
- Tabla limpia, sin decoraciones excesivas. Las etiquetas de color son el único acento visual fuerte.
- El breadcrumb permite volver al módulo de origen sin usar el botón atrás del navegador.

---

## 5. Conexiones con otras pantallas

| Origen | Clic | Llega aquí |
|--------|------|------------|
| Memoria → Normativa vigente | Clic en card CTA | Listado con título "Normativa vigente" |
| Memoria → Memoria viva | Clic en card | Listado con título "Memoria viva del territorio" |
| Gobierno propio → Reglamentos | Clic en tarjeta grid | Listado con título "Reglamentos" |
| Gobierno propio → Planes de uso | Clic en tarjeta grid | Listado con título "Planes de uso y manejo" |
| Gobierno propio → Litigio | Clic en tarjeta grid | Listado con título "Litigio estratégico" |
| Gobierno propio → Conservación | Clic en tarjeta grid | Listado con título "Conservación comunitaria" |
| Gobierno propio → Etnodesarrollo | Clic en tarjeta grid | Listado con título "Planes de etnodesarrollo" |
| Gobierno propio → Protección hídrica | Clic en tarjeta grid | Listado con título "Protección hídrica" |
| **Desde aquí** → Ver/Descargar | Clic en botón | Abre PDF en nueva pestaña |
| **Desde aquí** → Breadcrumb | Clic | Vuelve al módulo de origen |
