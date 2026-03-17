# Pantalla: Formulario "Enviar información ambiental"

Este formulario se abre al hacer clic en el botón **"Enviar información ambiental"** en la pantalla SCITA.

---

## 1. Rol y objetivo

- Permitir que personas en territorio envíen correcciones y observaciones sobre lo que se ve en el mapa/capas.
- Mantenerlo simple en el MVP: texto libre + tipo de observación + referencia al lugar.
- No requiere login en esta fase; cualquier persona puede aportar.

## 2. Paleta e identidad

- Verde intenso como color principal del formulario (coherencia con SCITA).
- Fondo del formulario: blanco o beige claro. Botón principal en verde intenso.

---

## 3. Ubicación y comportamiento

- Se abre como:
  - **Modal centrado**, o
  - **Panel lateral** que entra desde la derecha.
- El mapa de SCITA se sigue viendo de fondo para contexto (con overlay oscuro si es modal).
- Al cerrar (sin enviar) vuelve al mapa sin perder estado.

---

## 4. Campos del formulario

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| **Tipo de observación** | Select/dropdown | Sí | Opciones: Agua / fuentes hídricas, Bosques / cobertura, Fauna y flora, Infraestructura, Otro |
| **Descripción** | Textarea | Sí | Texto libre. Placeholder: "Cuéntanos qué está pasando (ej. 'La quebrada que aquí aparece con agua está seca desde hace meses')" |
| **Referencia al lugar** | Texto libre | Sí | Nombre local, vereda, río, punto de referencia. Placeholder: "Ej. Quebrada La Honda, vereda El Firme" |
| **Nombre** | Texto | No | Nombre de quien reporta |
| **Medio de contacto** | Texto | No | Teléfono, WhatsApp o correo. Placeholder: "Para que podamos contactarte si necesitamos más info" |

**Nota fase futura**: El campo "Referencia al lugar" se puede vincular directamente a un punto del mapa (pin drop). En MVP es texto libre.

---

## 5. Controles

- **Botón principal**: "Enviar información" (verde intenso, ancho completo o prominente).
- **Botón secundario**: "Cancelar" o icono X para cerrar el formulario.
- Validación inline: campos obligatorios marcados con asterisco; mensaje de error si se intenta enviar vacío.

---

## 6. Estado de éxito (post-envío)

Tras enviar exitosamente:

- El formulario se reemplaza por un **mensaje de confirmación**:
  - Icono de check verde.
  - Texto: **"Gracias por tu aporte desde el territorio. Tu información será revisada por el equipo del Palenke/PCN."**
- Dos botones:
  - "Volver al mapa" → cierra el modal y vuelve a SCITA.
  - "Ver Memoria Afroterritorial" → navega a Memoria (para explorar más info sobre el territorio).

---

## 7. Reglas UX

- Máximo 5 campos visibles; no abrumar.
- El placeholder del textarea es clave: debe dar ejemplos reales para que la persona entienda qué escribir.
- Los campos opcionales (nombre, contacto) claramente marcados como "Opcional".
- Responsive: en mobile el modal ocupa pantalla completa con scroll.

---

## 8. Conexiones con otras pantallas

| Origen | Clic | Llega aquí |
|--------|------|------------|
| SCITA → "Enviar información ambiental" | Clic en CTA verde | Abre este formulario |
| **Desde aquí** → Cancelar/X | Clic | Cierra y vuelve a SCITA (mapa) |
| **Desde aquí** → Enviar → "Volver al mapa" | Clic | Cierra y vuelve a SCITA |
| **Desde aquí** → Enviar → "Ver Memoria" | Clic | Navega a Memoria Afroterritorial |
