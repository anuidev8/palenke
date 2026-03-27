# INFORME DE CUMPLIMIENTO — Plataforma Digital Palenke (MVP Fase 1)
**Periodo reportado:** Marzo 2026  
**Proyecto:** Diseño y desarrollo del MVP de la Plataforma Digital Palenke Pensamiento.

**Stack tecnológico — Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, animación con Framer Motion, iconografía con Lucide React.

**Stack tecnológico — Backend y datos:** runtime **Node.js**; capa de aplicación y API mediante **Next.js** (Route Handlers / Server Actions o API REST según diseño); base de datos relacional **PostgreSQL**; acceso y modelo de datos con **ORM** (p. ej. Prisma o Drizzle) y migraciones de esquema; **autenticación y autorización** por roles (sesión/JWT u otro mecanismo acordado); **almacenamiento de archivos** (documentos PDF/imágenes) en volumen seguro o **almacenamiento de objetos** compatible S3, según política del proyecto.

**Integraciones y herramientas transversales:** **Microsoft Power BI** (informes embebidos vía URL de embed), **geoportal / SIG** externo (enlaces y metadatos, sin replicar el motor geográfico en la plataforma), APIs de terceros cuando apliquen (p. ej. asistentes de búsqueda); **variables de entorno** para secretos y URLs; **ESLint** para calidad de código; **despliegue** (p. ej. Vercel o infraestructura equivalente); capturas o pruebas E2E con **Playwright** de forma opcional.

> **Nota de alcance del repositorio actual:** el MVP en curso implementa de forma prioritaria el **frontend** y una **capa de datos simulada** para validar flujos; la conexión productiva a **PostgreSQL**, API estable y almacenamiento persistente forma parte del cierre arquitectónico o de fases contractuales posteriores, según lo acordado con el contratante.

Guía detallada por sección (campos, checklist y mapeo técnico): [INFORME-CUMPLIMIENTO-OBLIGACIONES-CONTRATO-PARTES.md](./INFORME-CUMPLIMIENTO-OBLIGACIONES-CONTRATO-PARTES.md). Sección **ANEXOS** ampliada: [INFORME-CUMPLIMIENTO-ANEXOS.md](./INFORME-CUMPLIMIENTO-ANEXOS.md).

---

## ACTIVIDADES Y/O PRODUCTOS DEFINIDOS EN EL CONTRATO  
## ACTIVIDADES O PRODUCTOS CONTRATADO

- Diseño y desarrollo del MVP de la Plataforma Digital Palenke Pensamiento sobre un stack **full stack** coherente: **frontend** (Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Lucide); **backend** (Node.js, API/capa server en Next.js); **datos** (PostgreSQL, ORM y migraciones); **archivos** (almacenamiento seguro u objeto); **integraciones** (Power BI, SIG/geoportal externo); **herramientas** (ESLint, despliegue, variables de entorno).
- Implementación del sistema de roles y visibilidad diferenciada (**público / interno / administrador**) para control de acceso a contenidos.
- Módulo de **Memoria Afroterritorial (Biblioteca Documental)** con:
  - **2 macro-secciones** de entrada (Normativa vigente y Memoria viva del territorio).
  - **Secciones documentales adicionales** para clasificación del corpus (Gobierno Propio, Planes, Rutas, Producción técnica/política, Material pedagógico/comunitario).
  - **Filtros avanzados** (búsqueda, sección, territorio, tipo de instrumento, año, enfoque de género).
- Módulo de **Mujeres, Juventudes y Niñez (MJN)** con piezas autorizadas (audio/video/testimonio/foto) y **campañas destacadas**.
- Módulo de **Estadísticas y Tableros** con integración (embed) de **Power BI** y control de visibilidad (público/interno).
- Módulo de **SCITA** (Sistema Comunitario de Información Territorial y Ambiental) como portal de acceso a capas priorizadas y vínculo al geoportal.
- Módulo de **Geoportal** — acceso controlado al Sistema de Información Geográfica (SIG) externo (sin almacenar datos geoespaciales en la plataforma).
- **Panel Administrativo** (superficie de gestión) para Documentos, Dashboards, ACCs, Usuarios y Campañas, orientado a autonomía editorial del equipo.
- Diseño e implementación de lineamientos de **Identidad Visual PCN** y base de **Design System** (tipografía, paleta, componentes UI reutilizables).
- Documentación técnica de soporte (planes de módulos, criterios de visibilidad, alcances del mock MVP) para continuidad y transición a backend real.

---

## CUMPLIMIENTO DE LAS OBLIGACIONES DEL CONTRATO  
## ACTIVIDADES REALIZADAS DURANTE EL PERIODO REPORTADO

> Nota de alcance del periodo: en esta sección se reportan solo los avances solicitados en `docs/user-messages-requiremnt` durante el mes, no el total acumulado del MVP.

### Actividades cumplidas del mes (segun requerimientos de usuario)

| Actividad / producto contratado | Resultados (evidencia de cumplimiento) | Soportes¹ |
|---|---|---|
| Desarrollo y ajuste de página de Inicio con estructura solicitada en croquis | Se implemento estructura de portada con logo, navegacion principal, bloque institucional, seccion de busqueda/entrada y accesos rapidos alineados al flujo descrito por el equipo PCN | Código: `src/app/page.tsx`, `src/app/layout.tsx` |
| Implementacion de bloque informativo tipo "Enterate / Lo ultimo" para noticias y actualizaciones | Se habilitaron rutas y vistas para publicacion/listado de novedades, permitiendo mostrar contenidos recientes de forma diferenciada | Código: `src/app/noticias/page.tsx`, `src/app/noticias/[slug]/page.tsx`, `src/app/incidencia/page.tsx` |
| Implementacion de pagina Memoria Afroterritorial segun secuencia narrada | Se construyo la pagina con video de presentacion, bloque "que es", acceso a normativa vigente, bloque memoria viva del territorio y seccion de agenda/eventos ("Veni te contamos") | Código: `src/app/memoria-afroterritorial/page.tsx`, `src/app/biblioteca/page.tsx` |
| Implementacion de pagina SCITA con mapa inicial, capas y acceso a envio de informacion | Se implemento pantalla SCITA con foco en visualizacion inicial del mapa, toggles de capas priorizadas y boton/formulario para reporte ambiental ciudadano | Código: `src/app/scita/page.tsx`, `src/app/scita/formulario/page.tsx` |
| Implementacion de pagina Gobierno propio con entradas por instrumentos | Se implemento pagina de Gobierno propio con acceso a instrumentos/lineas de trabajo (reglamentos, planes y rutas), respondiendo al requerimiento de tener botones de entrada por tema | Código: `src/app/gobierno-propio/page.tsx`, `src/app/gobierno-propio/[instrumento]/page.tsx` |
| Ajuste visual base con colores institucionales PCN en pantallas priorizadas del mes | Se aplicaron estilos consistentes para cabeceras, bloques de contenido y botones principales en las paginas trabajadas, manteniendo identidad visual institucional descrita por el usuario | Código: `src/app/page.tsx`, `src/app/memoria-afroterritorial/page.tsx`, `src/app/scita/page.tsx` |
| Creacion y curaduria de contenido visual (imagenes y videos) alineado a marca y temas del portal | Se habilito un modulo de generacion/gestion de contenido visual para producir imagenes, videos y paquetes de diseno alineados con marca PCN, tema seleccionado y pantalla donde se usaran (soporte para hero, miniaturas y piezas institucionales) | Código: `src/app/admin/contenido-visual/page.tsx`, `src/app/api/admin/visual-content/route.ts`, `src/app/api/admin/visual-content/suggestions/route.ts` |

---

## INFORME NARRATIVO DE LAS LECCIONES APRENDIDAS

### LOGROS
- Implementacion y ajuste de la pagina de **Inicio** conforme al croquis de referencia, incorporando navegacion visible, estructura institucional y accesos rapidos prioritarios.
- Desarrollo del bloque editorial de novedades tipo **"Enterate / Lo ultimo"**, habilitando rutas para publicacion y consulta de noticias/actualizaciones del proceso.
- Construccion de la pagina **Memoria Afroterritorial** con la secuencia solicitada para el periodo: video de presentacion, bloque "que es", acceso a normativa vigente, memoria viva y agenda/eventos ("Veni te contamos").
- Implementacion de la pagina **SCITA** con mapa inicial, seleccion de capas y formulario de envio de informacion ambiental como mecanismo de participacion comunitaria.
- Implementacion de la pagina **Gobierno propio** con entradas por instrumentos/temas para facilitar la navegacion por reglamentos, planes y rutas.
- Puesta en marcha de capacidades de **creacion y curaduria de contenido visual** (imagenes, videos y piezas de diseno) alineadas a identidad de marca PCN para uso en pantallas del portal.

### RETOS
- Traducir requerimientos narrados (audio/croquis) a decisiones de interfaz concretas sin perder la intencion politica y territorial del contenido.
- Mantener coherencia visual entre secciones heterogeneas (Inicio, Memoria, SCITA, Gobierno propio, noticias) respetando la identidad institucional PCN.
- Integrar piezas visuales (imagen/video) utiles para portada y modulos sin romper rendimiento ni consistencia de componentes.

### ADAPTACIÓN A LOS RETOS
- Se adopto un trabajo iterativo por pantallas priorizadas del mes, validando cada bloque funcional (contenido, navegacion y jerarquia visual) antes de pasar al siguiente.
- Se estandarizaron patrones de UI (cabeceras, bloques, botones y llamadas a accion) para sostener unidad grafica entre modulos construidos en el periodo.
- Se habilito un flujo de generacion/sugerencias de contenido visual desde el area administrativa para producir y ajustar piezas de marca segun tema y pantalla objetivo.
- Se adapto la forma de trabajo y comunicacion del equipo a un esquema iterativo de entregas cortas con retroalimentacion continua, integrando en paralelo ajustes funcionales y visuales para mantener coherencia de marca en todo el periodo.

---

## ANEXOS

La descripción completa del catálogo de anexos, convenciones de nombres, plantillas por anexo (A–F) y el inventario sugerido de capturas están en el documento dedicado: [INFORME-CUMPLIMIENTO-ANEXOS.md](./INFORME-CUMPLIMIENTO-ANEXOS.md).

¹ **Soportes:** en el texto principal se citan rutas del código fuente. Los **anexos** sirven para material no textual (capturas, PDF, actas) que complementa esas referencias; véase el archivo de anexos enlazado arriba.

