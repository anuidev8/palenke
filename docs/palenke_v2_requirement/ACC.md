# Pantalla: SCITA – Sistema Comunitario de Información Territorial Afrodescendiente

Diseña la pantalla del módulo **SCITA**, donde el público ve un **mapa sencillo** con las Áreas de Conservación Comunitaria (ACC) y algunas capas ambientales muy específicas, puede entender qué es el sistema y tiene un camino claro para enviar información ambiental y abrir el **sistema de información geográfica completo** (geoportal).

---

## 1. Rol y objetivo

- Ser la **puerta de entrada a la lectura territorial** desde el portal, **sin sustituir el sistema SIG completo**.
- Objetivos UX:
  - Mostrar de inmediato un **mapa con todas las ACC** y permitir zoom para ver qué consejos comunitarios las tienen.
  - Permitir activar/desactivar **solo algunas capas específicas** (ambientales y territoriales) clave para los proyectos del Palenke/PCN.
  - Explicar de forma sencilla **qué es y qué hace** el sistema comunitario de información territorial.
  - Dar un camino claro para **enviar información ambiental** desde el territorio.
  - Dar un camino claro para **abrir el sistema de información geográfica completo** (geoportal) cuando alguien quiera interactuar a profundidad.

---

## 2. Paleta e identidad

- Misma base que la plataforma: fondo claro, tonos tierra, verdes suaves.
- Acentos PCN:
  - **Verde**: color principal (territorio, ACC, naturaleza).
  - **Negro**: títulos importantes y labels del mapa.
  - **Rojo**: pequeños indicadores de alerta/denuncia/capas críticas.
  - **Amarillo**: detalles que expresan riqueza del territorio (iconos pequeños, líneas).

---

## 3. Estructura UX/UI (de arriba hacia abajo)

### 3.1. Encabezado de sección

- Título grande: **"SCITA – Sistema comunitario de información territorial afrodescendiente"**.
- Frase corta debajo, tipo:
  - "Aquí ves las Áreas de Conservación Comunitaria y algunas capas clave del territorio, sin reemplazar el sistema SIG completo." (placeholder).

### 3.2. Hero: Mapa sencillo con ACC

- Primera vista: mapa / geovisor sencillo que ocupa gran parte del ancho.
- Requerimientos:
  - El mapa muestra **todas las Áreas de Conservación Comunitaria (ACC)** ya definidas.
  - El usuario puede acercarse / alejarse (zoom) y moverse para ver qué consejos comunitarios tienen esas áreas.
  - Controles básicos: zoom +/–, arrastre, leyenda mínima.
- Fuente del mapa:
  - Puede ser un embed simplificado del geoportal actual o un mockup propio, pero **solo con las capas que SCITA permite ver**.
  - **No intenta reemplazar** todas las funciones del sistema SIG completo; solo presenta una **vista curada**.
- UX:
  - Al entrar, la persona ve mapa + ACC sin hacer clic.
  - Clic en una ACC podría, en el futuro, llevar a una ficha de ACC o documento relacionado, pero en el MVP basta con que se reconozcan visualmente.

### 3.3. Bloque "Qué es y qué hace"

- Sección en **dos columnas** debajo del mapa:
  - **Columna izquierda**:
    - Un **video de presentación** del sistema (placeholder de reproductor).
    - Explica en lenguaje visual qué es el sistema comunitario de información territorial y cómo se relaciona con las luchas territoriales.
  - **Columna derecha**:
    - Título: "¿Qué es el Sistema comunitario de información territorial afrodescendiente?"
    - 1–2 párrafos cortos explicando:
      - Que organiza y articula información territorial de las comunidades negras.
      - **Que el mapa de arriba muestra solo algunas capas clave; el sistema completo vive en el SIG.**
- Estética:
  - Indicar visualmente la relación con el mapa de arriba (ej. pequeña etiqueta "Este sistema se ve parcialmente en el mapa superior").

### 3.4. Selector de capas ("Capas de información")

- Título de sección: **"Capas de información (vista parcial)"**.
- Concepto:
  - Aquí **solo se muestran unas capas específicas** que ellas han definido como prioritarias (ambientales, ACC, etc.).
  - **No es un catálogo completo de capas del SIG**; es una vista curada.
- Componente:
  - Grid de tarjetas / botones (por ejemplo 2×3):
    - Capa A: **"Áreas de conservación comunitaria"** (capa base, siempre activa).
    - Capa B: **"Información hídrica"**.
    - Capa C: **"Fauna y flora"**.
    - Capa D: **"Cobertura boscosa"** (ejemplo).
    - Capa E: **"Infraestructura comunitaria"** (ejemplo).
    - Capa F: otra capa específica que definan.
- Cada card:
  - Título de la capa.
  - Ícono simple (agua, hoja, bosque, infraestructura…).
  - **Estado inactivo**: fondo claro, borde gris/verde suave.
  - **Estado activo**: fondo verde suave, borde verde más fuerte, detalle rojo/amarillo.
- UX:
  - Clic en una card **no cambia de página**, solo activa/oculta la capa en el mapa de arriba.
  - Se debe entender visualmente que se pueden activar **varias capas a la vez**.

### 3.5. Bloque "Abrir sistema de información geográfica"

- **Nuevo bloque** que da salida al SIG completo.
- Coloca debajo de las capas o al costado un bloque con:
  - Título: **"Abrir sistema de información geográfica completo"**.
  - Texto corto: "Si quieres interactuar con todas las capas y herramientas del sistema de información geográfica, entra al geoportal del equipo SIG."
  - Botón: **"Ir al geoportal SIG"** o "Abrir sistema de información geográfica".
- Comportamiento:
  - Para **usuarios con permisos** (interno/admin):
    - Clic → abre el geoportal en una nueva pestaña (login se maneja en el propio geoportal).
  - Para **público**:
    - Pueden ver el texto (según lo que definan) o no ver el botón si así lo acuerdan.
    - El diseño debe dejar claro que el portal **NO reemplaza** al geoportal, solo lo enlaza.

### 3.6. Bloque "Envía información ambiental"

- Al final de la página, bloque de participación:
  - Título: **"Envía información ambiental"**.
  - Texto: explica que las comunidades pueden corregir y actualizar lo que ven en el mapa (ej. "esta quebrada ya no tiene agua").
  - Botón grande: **"Enviar información ambiental"** o "Aportar información desde el territorio".
- Estilo:
  - Botón muy visible: fondo verde intenso, texto blanco, detalle rojo discreto (alerta/seriedad).
- Comportamiento:
  - Clic → abre un formulario sencillo (modal o panel lateral) con:
    - Tipo de observación (select).
    - Descripción.
    - Referencia al lugar (texto; en el futuro podría ser selección en el mapa).
    - Contacto opcional.
  - Después de enviar: mensaje de agradecimiento y botón "Volver al mapa".

---

## 4. Conexiones con otras pantallas

- **Desde Home**:
  - Acceso rápido "Área de conservación comunitaria" → a esta pantalla SCITA, con el mapa centrado en ACC.
  - Acceso rápido "SIG Afro" → puede llevar a SCITA o directamente al geoportal, pero en SCITA siempre debe quedar claro que el geoportal es otro sistema.
- **Desde Mirador de datos del territorio** (módulo de dashboards Power BI):
  - Puedes añadir enlaces desde algunos tableros hacia SCITA ("ver mapa de ACC") pero SCITA no se llena de dashboards; SCITA sigue siendo mapa + capas + botón al SIG + envío de info.
- **Desde SCITA hacia fuera**:

| Elemento clickeable | Acción | Pantalla destino |
|---------------------|--------|-----------------|
| Menú → Inicio | Clic | **Inicio** |
| Menú → Memoria Afroterritorial | Clic | **Memoria Afroterritorial** |
| Menú → Gobierno propio | Clic | **Gobierno propio** |
| Clic en ACC en mapa | Clic | Ficha ACC o doc en **Memoria** |
| Capas de información | Toggle | No cambia pantalla (activa/desactiva capa en mapa) |
| "Ir al geoportal SIG" | Clic | **Geoportal** (nueva pestaña, URL externa) |
| "Enviar información ambiental" | Clic | **Formulario info ambiental** (modal/panel) |
| "Ver tableros territoriales" | Clic | **Mirador de datos del territorio** |

---

## 5. Reglas UX específicas

- En muy pocos segundos la persona debe entender:
  1. Que está viendo un **mapa parcial** con ACC y algunas capas clave.
  2. Que si quiere algo más profundo, existe un **botón al sistema SIG completo**.
  3. Que puede **enviar información ambiental** para corregir/ajustar lo que ve.
- El diseño debe dejar claro que:
  - El portal **no intenta ser el SIG completo**.
  - SCITA es un **visor político-comunitario** sobre unos datos seleccionados, con salida directa al sistema técnico (geoportal) y a la participación comunitaria (formulario).
