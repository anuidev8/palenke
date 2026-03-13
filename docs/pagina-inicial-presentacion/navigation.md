# Módulo 01 · Navegación Home

## 1. Entradas al módulo

- Ruta principal: `/`
- Variantes por rol mock:
  - público: `/`
  - interno: `/?role=internal`
  - admin: `/?role=admin`

## 2. Navegación principal (header)

Siempre visibles:

- Inicio
- Biblioteca
- MJN
- Estadísticas

Condicional:

- Geoportal (solo `internal` y `admin`)
- Ir al panel (`admin`)
- Iniciar sesión (`public`)

## 3. Navegación desde accesos rápidos

La grilla de accesos rápidos de Home enlaza a:

- `/biblioteca`
- `/mujeres-juventudes-ninez`
- `/estadisticas`
- `/geoportal` (si rol interno/admin) o `/login` (si rol público)

Todos los enlaces preservan el rol mock por query string.

## 4. Flujos mínimos esperados

1. Público entra a Home y navega a Biblioteca/MJN/Estadísticas.
2. Público intenta Geoportal y es enviado a login.
3. Interno/Admin entra a Home y puede abrir Geoportal.
4. Admin puede saltar al panel desde Home.

## 5. Consideración de acceso denegado

Si una persona sin rol admin intenta entrar al área admin y vuelve a Home con `?notice=admin-denied`, el Home muestra un banner de advertencia.
