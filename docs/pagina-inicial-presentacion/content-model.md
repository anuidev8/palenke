# Módulo 01 · Modelo de contenido

## 1. Hero

Campos renderizados en Home:

- `title` (ReactNode, 1-2 líneas editoriales)
- `description` (copy institucional corto)
- `generatedImageUrl` (opcional, imagen de apoyo)
- `actions` (CTAs según rol)

## 2. Presentación institucional

Fuente: `homeIntro` (`src/lib/mock-data.ts`)

Estructura:

- arreglo de párrafos (`string[]`);
- entre 2 y 4 párrafos cortos;
- tono institucional y público, sin datos sensibles.

## 3. Accesos rápidos

Modelo actual en código (hardcoded en Home):

- `title`
- `description`
- `href`
- `label`

Regla:

- Geoportal cambia destino y etiqueta según rol.

## 4. Destacados de campaña

Fuente: `campaigns` (`src/lib/mock-data.ts`) filtrada por `getVisibleCampaigns`.

Campos clave usados por Home:

- `id`
- `title`
- `intro`
- `startDate` / `endDate`
- `visibility`
- `active`
- `placements`

## 5. Reglas editoriales mínimas

- solo campañas activas pueden mostrarse;
- campañas internas no se muestran en rol público;
- no publicar contenido marcado como sensible en Home.
