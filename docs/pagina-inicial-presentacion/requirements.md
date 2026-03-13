# Módulo 01 · Página inicial / Presentación

## 1. Objetivo del módulo

Proveer un punto de entrada público a la plataforma Palenke que:

- comunique el propósito institucional del portal;
- conduzca a los módulos principales de Fase 1;
- refleje reglas de acceso por rol en la navegación.

## 2. Alcance MVP (Fase 1)

### Requisitos explícitos del PDF (mínimo obligatorio)

- entrada pública disponible en `/`;
- mensaje institucional claro del Palenke/PCN;
- navegación hacia Biblioteca, MJN, Estadísticas y acceso condicionado a Geoportal;
- comportamiento visible acorde con roles y visibilidad.

### Requisitos inferidos para el mock funcional

- hero con propuesta de valor;
- bloque de presentación institucional;
- accesos rápidos por módulo;
- bloque de campañas activas visibles por rol.

## 3. Criterios de aceptación

- al abrir `/` sin rol, la persona usuaria ve portada pública y enlaces principales;
- con `?role=internal` o `?role=admin`, aparece acceso a Geoportal y se preserva el rol en enlaces;
- el Home comunica propósito institucional en lenguaje editorial claro;
- los contenidos destacados solo muestran campañas activas autorizadas para el rol;
- no se expone contenido marcado como sensible.

## 4. Fuera de alcance (Fase 1)

- autenticación real;
- CMS completo de portada;
- versionado editorial y flujos de aprobación;
- personalización por organización o territorio en tiempo real.
