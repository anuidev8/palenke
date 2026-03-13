# Módulo 01 · Diseño técnico

## 1. Implementación actual

- Ruta: `src/app/page.tsx`
- Layout compartido: `src/components/mock/ui.tsx` (`SiteLayout`)
- Hero: `src/components/palenke/HeroSection.tsx`
- Datos mock: `src/lib/mock-data.ts`
- Resolución de rol y enlaces: `src/lib/viewer.ts`

## 2. Composición del Home

El Home se compone de:

- banner opcional de acceso denegado (`notice=admin-denied`);
- hero institucional con CTA primario/secundario;
- bloque “Quiénes somos”;
- sección de accesos rápidos;
- campañas activas visibles por rol.

## 3. Datos y reglas

- `homeIntro`: fuente del texto institucional;
- `getVisibleCampaigns(role, "home")`: filtra campañas por estado (`active`), ubicación (`placement`) y visibilidad (`public/internal`);
- el rol se obtiene por `getViewerRole(searchParams)` y se propaga en enlaces con `withRole`.

## 4. Dependencias y estado

- No hay backend ni base de datos.
- No hay sesión real ni middleware de autenticación real.
- El estado de usuario y visibilidad se simula con query params.

## 5. Decisiones técnicas para Fase 1

- mantener Home como Server Component para resolver rol/visibilidad desde `searchParams`;
- mantener Hero como Client Component por animaciones (`framer-motion`);
- no introducir nueva complejidad de fetching remoto para contenidos editoriales.
