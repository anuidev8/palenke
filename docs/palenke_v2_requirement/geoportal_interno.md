# Pantalla: Acceso al Geoportal interno

Diseña el acceso al **Geoportal interno** del equipo SIG de PCN/Hileros. No se diseña UI interna del geoportal — solo el punto de entrada.

---

## 1. Rol y objetivo

- Dar a usuarios internos/admin un enlace claro al geoportal SIG externo donde se gestionan capas y datos geográficos.
- No duplicar funcionalidad del geoportal; solo enlazar.

## 2. Ubicación

- En la navegación para **usuarios internos/admin**, agregar un ítem: **"Geoportal interno"**.
- Puede estar:
  - En el menú principal (visible solo para rol interno/admin).
  - Como sub-opción dentro de SCITA.
  - Como enlace en el footer del área interna.

---

## 3. Comportamiento

- **Clic** → se abre **nueva pestaña** del navegador con la URL del geoportal SIG administrado por Hileros/PCN.
- La URL se configura vía variable de entorno (`NEXT_PUBLIC_GEOPORTAL_URL`).

---

## 4. Página intermedia (opcional pero recomendada)

Si se decide mostrar una página antes de redirigir:

### 4.1 Contenido

- Icono de mapa/globo.
- Título: **"Geoportal interno"**.
- Texto: "Estás entrando al Geoportal interno del equipo SIG. Aquí se gestionan las capas y datos geográficos del territorio. El acceso y login se manejan desde el geoportal."
- Botón principal: "Ir al Geoportal" (abre nueva pestaña).
- Enlace secundario: "Volver a SCITA" o "Volver al inicio".

### 4.2 Estética

- Simple, centrado, con mucho espacio en blanco.
- Icono grande verde (territorio). Botón verde intenso.

---

## 5. Reglas UX

- Dejar claro que el geoportal es un sistema **externo** — no parte de la plataforma Palenke.
- No confundir con SCITA (que es la vista pública del mapa). El Geoportal es la herramienta de gestión SIG del equipo.
- Solo visible para usuarios con rol interno o admin.

---

## 6. Conexiones con otras pantallas

| Origen | Clic | Destino |
|--------|------|---------|
| Menú interno → "Geoportal interno" | Clic | Página intermedia o directo a URL externa |
| SCITA → sub-opción "Geoportal" (si se incluye) | Clic | Página intermedia o directo a URL externa |
| Página intermedia → "Ir al Geoportal" | Clic | Nueva pestaña: URL geoportal externo |
| Página intermedia → "Volver" | Clic | SCITA o Inicio |
