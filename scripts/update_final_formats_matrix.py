#!/usr/bin/env python3

from __future__ import annotations

import io
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path


WORKBOOK = Path("docs/final-formats/02_Matriz_cumplimiento_ANGEL_MATEUS_final.xlsx")
NS = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
ET.register_namespace("", NS["main"])


def load_sheet(source: bytes, member: str) -> ET.ElementTree:
    with zipfile.ZipFile(io.BytesIO(source), "r") as zf:
        return ET.ElementTree(ET.fromstring(zf.read(member)))


def get_cell(root: ET.Element, ref: str) -> ET.Element:
    for cell in root.findall(".//main:c", NS):
        if cell.attrib.get("r") == ref:
            return cell
    raise KeyError(f"Cell {ref} not found")


def set_inline(root: ET.Element, ref: str, text: str) -> None:
    cell = get_cell(root, ref)
    cell.attrib["t"] = "inlineStr"
    for child in list(cell):
        cell.remove(child)
    is_el = ET.SubElement(cell, f"{{{NS['main']}}}is")
    t_el = ET.SubElement(is_el, f"{{{NS['main']}}}t")
    if text.strip() != text or "\n" in text:
        t_el.attrib["{http://www.w3.org/XML/1998/namespace}space"] = "preserve"
    t_el.text = text


def set_number(root: ET.Element, ref: str, value: int) -> None:
    cell = get_cell(root, ref)
    cell.attrib.pop("t", None)
    for child in list(cell):
        cell.remove(child)
    v_el = ET.SubElement(cell, f"{{{NS['main']}}}v")
    v_el.text = str(value)


S1 = {
    "E9": "Se sostuvo comunicación continua con la coordinación del proyecto para revisar prioridades funcionales, ajustes de contenido, definición de accesos y validación de avances de la plataforma. Los avances se reportaron mediante informes mensuales y espacios de seguimiento.",
    "F9": "Informes administrativos firmados de abril y mayo de 2026; registro base de reunión del 27 de marzo de 2026 (Google Meet, 49 minutos); trazabilidad de requerimientos funcionales y ajustes atendidos durante el periodo.",
    "G9": "FORMATO INFORME ADM_ANGEL_ARRIETA_ABRIL_2026.docx; FORMATO INFORME ADM_ANGEL_ARRIETA_MAYO_2026.docx; https://pro-palenke-vw-two.vercel.app/docs",
    "E10": "Se diseñó, desarrolló y desplegó el MVP de la plataforma con Next.js, React, TypeScript y Tailwind. El alcance funcional entregado en Fase 1 incluye inicio, biblioteca, memoria afroterritorial, MJN, gobierno propio, incidencia, mirador de datos (Power BI) y paneles administrativos base. El geoportal/geovisor interno no se incluye como entregable cerrado del MVP; corresponde a la siguiente etapa.",
    "F10": "MVP funcional publicado en entorno web, con navegación operativa, módulos de Fase 1 visibles, rutas públicas e internas y base técnica lista para continuidad contractual. Geoportal: diferido a siguiente etapa (fuera del cierre MVP).",
    "G10": "https://pro-palenke-vw-two.vercel.app/",
    "E11": "Se implementó autenticación con Supabase SSR, validación de sesión, control de permisos por rol y flujos de solicitud/aprobación de acceso. También se habilitaron superficies diferenciadas para visitante público, usuario interno y administración.",
    "F11": "Sistema de usuarios y roles operativo: login, control de sesión, lectura de permisos, solicitudes de acceso y revisión administrativa de solicitudes. Credenciales de validación: admin angelarrieta34@gmail.com / welcome123; interno fconu@renacientes.org / @welcome123.",
    "G11": "src/middleware.ts; src/lib/auth/permissions.ts; src/lib/viewer.ts; src/app/login; src/app/admin/solicitudes; src/app/solicitar-acceso; https://pro-palenke-vw-two.vercel.app/docs",
    "E12": "Se configuraron reglas de apertura y descarga por nivel de visibilidad, junto con validaciones por sesión y por rol para contenidos públicos e internos. El comportamiento también contempla accesos aprobados a documentos puntuales.",
    "F12": "Lógica de visibilidad y permisos activa para documentos, vistas protegidas y recursos con acceso condicionado por rol o por aprobación previa.",
    "G12": "src/lib/document-access.ts; src/lib/auth/permissions.ts; src/lib/viewer.ts; src/app/gobierno-propio/[instrumento]/page.tsx; https://pro-palenke-vw-two.vercel.app/docs",
    "E13": "Se desarrolló la Biblioteca Base con barra de búsqueda, filtros por sección, territorio, tipo, año y temas, además de resumen de filtros activos y paginación. Se integró la sección de normativa con registros visibles por rol.",
    "F13": "Biblioteca Base navegable y filtrable, con búsqueda funcional, resumen de filtros y acceso al corpus documental del MVP.",
    "G13": "src/app/biblioteca/page.tsx; src/components/palenke/BibliotecaSearchBar.tsx; src/components/palenke/BibliotecaFilterSummary.tsx; https://pro-palenke-vw-two.vercel.app/biblioteca",
    "E14": "Se construyó la sección Mujeres, Juventudes y Niñez con hero editorial, contexto político, documentos filtrados por agenda, piezas autorizadas y campañas destacadas. Parte del componente de litigio estratégico sigue dependiendo de contenido definitivo del equipo.",
    "F14": "Sección MJN publicada con estructura editorial, tabs de contenido, piezas autorizadas y campañas visibles; pendiente completar insumos definitivos en algunos contenidos asociados a litigio.",
    "G14": "src/app/mujeres-juventudes-ninez/page.tsx; src/app/mujeres-juventudes-ninez/campanas/[slug]/page.tsx; https://pro-palenke-vw-two.vercel.app/mujeres-juventudes-ninez",
    "E15": "Se integró el mirador de datos con tableros Power BI visibles según rol, panel SCITA para consumo de dashboards y superficie administrativa para crear y editar tableros. Respecto al geoportal interno: no se entrega como módulo implementado del MVP; solo se deja preparada una ruta/punto de acceso para la siguiente etapa del proyecto, donde corresponde la integración plena con el geoportal SIG del equipo.",
    "F15": "Power BI / mirador de datos: implementado (catálogo, SCITA/estadísticas, administración de tableros). Geoportal interno: NO implementado como módulo del MVP; diferido a la siguiente etapa. Geoportal: solo URL preparatoria https://pro-palenke-vw-two.vercel.app/geoportal (no constituye cierre del módulo SIG).",
    "G15": "src/app/estadisticas/page.tsx; src/app/scita/page.tsx; src/components/palenke/ScitaDashboardPanel.tsx; src/components/palenke/ScitaDashboardAdminForm.tsx; src/app/admin/dashboards; https://pro-palenke-vw-two.vercel.app/estadisticas; https://pro-palenke-vw-two.vercel.app/docs; Geoportal (siguiente etapa / no MVP): src/app/geoportal/page.tsx; https://pro-palenke-vw-two.vercel.app/geoportal; https://pro-palenke-vw-two.vercel.app/docs",
    "H15": "En proceso",
    "I15": 70,
    "E16": "Se aseguró el acceso HTTPS en despliegue y se implementaron validaciones de sesión, protección de rutas, control de permisos y separación de vistas según rol. La protección cubre páginas internas y superficies administrativas.",
    "F16": "Seguridad básica operativa en despliegue: HTTPS/SSL, validación de sesión, middleware de control y restricción de acceso a rutas y recursos internos. Validación interna: fconu@renacientes.org / @welcome123.",
    "G16": "src/middleware.ts; src/lib/auth/permissions.ts; despliegue en Vercel con HTTPS; https://pro-palenke-vw-two.vercel.app/docs",
    "E17": "El código fuente permanece versionado en GitHub privado https://github.com/anuidev8/palenke. Acceso por invitación email. Paneles admin funcionales; pendiente acta y credenciales formales.",
    "F17": "Repositorio privado GitHub https://github.com/anuidev8/palenke (invitar por email). Código + docs técnicas + migraciones; pendiente transferencia formal.",
    "G17": "https://github.com/anuidev8/palenke; https://pro-palenke-vw-two.vercel.app/docs; src/app/admin; https://pro-palenke-vw-two.vercel.app/docs",
    "E18": "Se elaboró documentación técnica del MVP en formatos Markdown, HTML y PDF, junto con el protocolo operativo de integración SIG - BI - PostgreSQL - Power BI - Palenke.",
    "F18": "Paquete documental técnico básico entregado y reutilizable para continuidad: documentación del MVP, versión exportada en PDF/HTML y protocolo de integración funcional.",
    "G18": "docs/technical/palenke-mvp-technical-documentation.md; docs/technical/palenke-mvp-technical-documentation.html; docs/technical/palenke-mvp-technical-documentation.pdf; docs/protocolo-sig-bi-postgresql-powerbi-y-palenke.md; https://pro-palenke-vw-two.vercel.app/docs",
    "E19": "No se encontró evidencia formal en el repositorio de una sesión de capacitación cerrada con lista de asistencia, agenda, material o grabación entregable para este ítem.",
    "F19": "Sin evidencia formal de capacitación al equipo designado dentro del corte revisado.",
    "G19": "https://pro-palenke-vw-two.vercel.app/docs",
    "E20": "Durante el periodo se atendieron ajustes funcionales, visuales y de estructura de datos, incluyendo refactors, rediseños de módulos y correcciones derivadas de requerimientos nuevos o cambios editoriales.",
    "F20": "Historial de mejoras y correcciones en curso, soportado por cambios en el repositorio y por la trazabilidad consignada en informes mensuales.",
    "G20": "Informes ABRIL y MAYO 2026; repositorio Git del proyecto; https://pro-palenke-vw-two.vercel.app/docs",
    "E21": "Producto consolidado a partir de la obligación 3: MVP publicado y verificable en la URL vigente del proyecto.",
    "F21": "Plataforma web MVP completamente funcional para validación cliente/supervisión.",
    "G21": "https://pro-palenke-vw-two.vercel.app/",
    "E22": "Producto consolidado a partir de la obligación 4: autenticación, roles y superficies diferenciadas.",
    "F22": "Sistema de usuarios y roles implementado y listo para continuidad operativa.",
    "G22": "src/middleware.ts; src/lib/auth/permissions.ts; src/app/admin/solicitudes; https://pro-palenke-vw-two.vercel.app/docs",
    "E23": "Producto consolidado a partir de la obligación 5: reglas de visibilidad por rol y por acceso aprobado.",
    "F23": "Configuración de visibilidad operativa para contenidos públicos e internos.",
    "G23": "src/lib/document-access.ts; src/lib/viewer.ts; src/app/gobierno-propio/[instrumento]/page.tsx; https://pro-palenke-vw-two.vercel.app/docs",
    "E24": "Producto consolidado a partir de la obligación 6: módulo de Biblioteca Base navegable y filtrable.",
    "F24": "Biblioteca Base disponible en entorno vigente del proyecto.",
    "G24": "https://pro-palenke-vw-two.vercel.app/biblioteca",
    "E25": "Producto consolidado a partir de la obligación 7: arquitectura editorial del módulo MJN ya publicada.",
    "F25": "Sección MJN operativa, con contenidos aún abiertos a completitud editorial.",
    "G25": "https://pro-palenke-vw-two.vercel.app/mujeres-juventudes-ninez",
    "E26": "Producto consolidado a partir de la obligación 8: paneles de datos y administración de dashboards ya integrados en la plataforma.",
    "F26": "Integración funcional de tableros Power BI dentro del ecosistema Palenke.",
    "G26": "src/app/estadisticas/page.tsx; src/components/palenke/ScitaDashboardPanel.tsx; src/components/palenke/ScitaDashboardAdminForm.tsx; src/app/admin/dashboards; https://pro-palenke-vw-two.vercel.app/docs",
    "E27": "Este entregable (enlace/módulo seguro al geoportal interno) no se cierra dentro del MVP. En Fase 1 solo existe una página/punto de entrada preparatorio. La implementación del módulo geoportal corresponde a la siguiente etapa del proyecto.",
    "F27": "Insumo de continuidad / siguiente etapa: ruta de acceso preparada (/geoportal), sin cierre del módulo geoportal SIG como parte del MVP.",
    "G27": "https://pro-palenke-vw-two.vercel.app/geoportal; src/app/geoportal/page.tsx; https://pro-palenke-vw-two.vercel.app/docs",
    "H27": "Insumo de continuidad",
    "I27": 30,
    "E28": "Producto consolidado a partir de la obligación 9: despliegue HTTPS y control de accesos por sesión/rol.",
    "F28": "Seguridad básica implementada según alcance Fase 1.",
    "G28": "src/middleware.ts; src/lib/auth/permissions.ts; https://pro-palenke-vw-two.vercel.app/docs",
    "E29": "Producto consolidado a partir de la obligación 10: repositorio activo, pendiente formalización documental de entrega.",
    "F29": "Código fuente versionado y listo para transferencia final.",
    "G29": "Repositorio Git del proyecto; https://pro-palenke-vw-two.vercel.app/docs",
    "E30": "Producto consolidado a partir de la obligación 11: documentación del MVP y protocolo técnico disponibles.",
    "F30": "Documentación técnica básica entregada.",
    "G30": "docs/technical/palenke-mvp-technical-documentation.md; docs/protocolo-sig-bi-postgresql-powerbi-y-palenke.md; https://pro-palenke-vw-two.vercel.app/docs",
    "E31": "Se avanzó en metadatos y taxonomías mediante varias migraciones y ajustes editoriales para gobierno propio, conservación, reglamentos y publicaciones. El modelo ya organiza mejor el contenido, pero aún no cubre de forma homogénea todos los módulos documentales.",
    "F31": "Taxonomías y metadatos parciales implementados en varios componentes del sistema, reutilizables para la fase integral.",
    "G31": "supabase/migrations/013_update_gobierno_propio_document_metadata.sql; supabase/migrations/014_align_gobierno_propio_ui_metadata.sql; supabase/migrations/015_backfill_gobierno_propio_supporting_docs_metadata.sql; supabase/migrations/016_align_conservacion_ui_metadata.sql; supabase/migrations/017_reglamentos_cc_mayor_capitania_territory_paez.sql; src/lib/lo-ultimo-publications.ts",
    "I31": 55,
    "E32": "Actualmente existen búsqueda por texto, filtros múltiples, chips de temas, buscadores por módulo y una capa adicional de búsqueda asistida para biblioteca/mediateca. Aún no existe un único motor transversal para todos los módulos de la plataforma integral.",
    "F32": "Capacidades de búsqueda avanzada parciales: filtros múltiples en biblioteca, búsqueda por módulo, búsqueda jurídica y panel de búsqueda asistida.",
    "G32": "src/components/palenke/BibliotecaSearchBar.tsx; src/components/palenke/SeguridadJuridicaSearchBar.tsx; src/components/palenke/GlobalBibliotecaSearchDock.tsx; src/components/palenke/BibliotecaAiSearchPanel.tsx; src/lib/ai-search.ts",
    "I32": 60,
    "E33": "Se implementó un módulo administrativo de ACCs y su correlato público en gobierno propio, con metadatos territoriales, visibilidad, vínculo a dashboard y referencia preparatoria al geoportal (módulo diferido a siguiente etapa, fuera del MVP). El módulo ACC ya es demostrable, aunque el cierre fino de contenido y operación sigue abierto.",
    "F33": "Módulo ACC funcional para gestión y visualización, con estructura pública y administrativa disponible.",
    "G33": "src/app/admin/accs/page.tsx; src/app/admin/accs/[id]/editar/page.tsx; src/app/gobierno-propio/page.tsx; https://pro-palenke-vw-two.vercel.app/gobierno-propio",
    "E34": "Se habilitó la sección de Incidencia/Lo Último con listado, detalle, búsqueda, paginación y soporte para publicaciones con imagen o embeds sociales. El componente de litigio estratégico estructurado sigue dependiendo de insumos definitivos y de consolidación editorial.",
    "F34": "Módulo de incidencia publicado y utilizable; componente de litigio estratégico aún en consolidación.",
    "G34": "src/app/incidencia/page.tsx; src/app/incidencia/[slug]/page.tsx; docs/plan-biblioteca-rutas-litigio.md; https://pro-palenke-vw-two.vercel.app/incidencia",
    "I34": 55,
    "E35": "Se construyeron APIs internas de la propia plataforma para solicitudes de acceso, mensajes de contacto, carga/preparación de evidencias SCITA y previsualización/URL firmada de documentos. No se documentan integraciones amplias con APIs externas de terceros dentro de este entregable.",
    "F35": "Conjunto de endpoints internos implementados para soporte funcional del portal, administración de acceso y gestión documental.",
    "G35": "src/app/api/access-requests/route.ts; src/app/api/contact-messages/route.ts; src/app/api/scita/reports/prepare-upload/route.ts; src/app/api/scita/reports/[id]/evidence/route.ts; src/app/api/documents/[id]/preview/route.ts; src/app/api/documents/[id]/signed-url/route.ts",
    "I35": 60,
    "E36": "No se encontró evidencia suficiente de una fase formal de optimización de rendimiento ni de hardening adicional de seguridad más allá del control de acceso básico ya implementado.",
    "F36": "Sin evidencia formal de optimización ampliada o auditoría específica de performance/seguridad.",
    "G36": "https://pro-palenke-vw-two.vercel.app/docs",
    "I36": 0,
    "E37": "Además de la documentación básica del MVP, ya existen un protocolo técnico de integración y un checklist de cumplimiento que sirven como base para ampliar la documentación del sistema. Aún falta consolidar un paquete único de documentación ampliada de Fase 2.",
    "F37": "Base documental ampliada en construcción: protocolo técnico, checklist de cumplimiento y materiales de continuidad.",
    "G37": "docs/protocolo-sig-bi-postgresql-powerbi-y-palenke.md; docs/CHECKLIST-CUMPLIMIENTO-ANEXO-4-RRI.md; docs/technical/palenke-mvp-technical-documentation.md",
    "I37": 60,
    "E38": "No se encontró evidencia formal de capacitación complementaria documentada en el repositorio para este corte.",
    "F38": "Sin evidencia formal de capacitación complementaria.",
    "G38": "https://pro-palenke-vw-two.vercel.app/docs",
    "E39": "La plataforma ha mantenido desarrollo y despliegue continuo durante el periodo revisado, con seguimiento mensual y sin evidencia en el repositorio de una caída estructural documentada del servicio. El aseguramiento definitivo de estabilidad sigue siendo una obligación vigente hasta el cierre del contrato.",
    "F39": "Historial de continuidad técnica y mantenimiento funcional del portal durante el periodo evaluado.",
    "G39": "Repositorio Git del proyecto; informes ABRIL y MAYO 2026; https://pro-palenke-vw-two.vercel.app/docs",
    "E40": "Entregable asociado a la obligación 16: taxonomías y metadatos ya avanzados, todavía no cerrados para todo el sistema.",
    "F40": "Implementación parcial y verificable de metadatos avanzados.",
    "G40": "supabase/migrations/013_update_gobierno_propio_document_metadata.sql; supabase/migrations/016_align_conservacion_ui_metadata.sql; supabase/migrations/017_reglamentos_cc_mayor_capitania_territory_paez.sql",
    "I40": 55,
    "E41": "Entregable asociado a la obligación 17: filtros múltiples, búsqueda por módulos y búsqueda asistida, aún sin motor único transversal.",
    "F41": "Motor de búsqueda avanzada parcial, con varias piezas funcionales ya implementadas.",
    "G41": "src/components/palenke/BibliotecaSearchBar.tsx; src/components/palenke/GlobalBibliotecaSearchDock.tsx; src/components/palenke/BibliotecaAiSearchPanel.tsx",
    "I41": 60,
    "E42": "Entregable asociado a la obligación 18: módulo ACC visible en administración y componente público relacionado.",
    "F42": "Módulo ACC funcional y demostrable.",
    "G42": "https://pro-palenke-vw-two.vercel.app/gobierno-propio; src/app/admin/accs/page.tsx",
    "E43": "Entregable asociado a la obligación 19: módulo de incidencia visible, con litigio aún como línea en consolidación.",
    "F43": "Incidencia publicada y litigio estratégico aún en proceso.",
    "G43": "src/app/incidencia/page.tsx; src/app/incidencia/[slug]/page.tsx",
    "I43": 55,
    "E44": "Entregable asociado a la obligación 20: APIs internas del portal ya implementadas para soportar acceso, contacto, SCITA y documentos.",
    "F44": "Integraciones técnicas internas operativas dentro del propio sistema.",
    "G44": "src/app/api/access-requests/route.ts; src/app/api/contact-messages/route.ts; src/app/api/scita/reports/prepare-upload/route.ts; src/app/api/documents/[id]/preview/route.ts; src/app/api/documents/[id]/signed-url/route.ts",
    "I44": 60,
    "E45": "Entregable asociado a la obligación 21: no se evidencia aún una línea formal de optimización avanzada o refuerzo adicional de seguridad.",
    "F45": "Sin evidencia formal de optimización ampliada.",
    "G45": "https://pro-palenke-vw-two.vercel.app/docs",
    "I45": 0,
    "E46": "Entregable asociado a la obligación 22: base documental robusta disponible, pendiente consolidación ampliada final.",
    "F46": "Documentación técnica ampliada en construcción, con base ya existente.",
    "G46": "docs/protocolo-sig-bi-postgresql-powerbi-y-palenke.md; docs/CHECKLIST-CUMPLIMIENTO-ANEXO-4-RRI.md; docs/technical/palenke-mvp-technical-documentation.md",
    "I46": 60,
    "E47": "Entregable asociado a la obligación 23: no se encontró evidencia documental de la capacitación complementaria.",
    "F47": "Sin evidencia formal de capacitación complementaria.",
    "G47": "https://pro-palenke-vw-two.vercel.app/docs",
}

S2 = {
    "D4": "No iniciado",
    "E4": "",
    "F4": "Formato final pendiente de elaboración, firma y exportación a PDF.",
    "D5": "No iniciado",
    "E5": "",
    "F5": "No se encontró una presentación ejecutiva final cerrada dentro del repositorio.",
    "D6": "En proceso",
    "E6": "docs/final-formats/02_Matriz_cumplimiento_ANGEL_MATEUS_final.xlsx",
    "F6": "Matriz revisada y ajustada con corte al 17 de julio de 2026; queda pendiente validación final de supervisión.",
    "D7": "Cumplido",
    "E7": "https://pro-palenke-vw-two.vercel.app/docs; https://pro-palenke-vw-two.vercel.app/docs/modulos-y-urls; https://pro-palenke-vw-two.vercel.app/docs",
    "F7": "Toda la evidencia verificable vive en Fumadocs (/docs) y URLs del producto. Sin carpeta evidences.",
    "D8": "No iniciado",
    "E8": "",
    "F8": "Documento administrativo no localizado en el repositorio del proyecto.",
    "D9": "No iniciado",
    "E9": "",
    "F9": "Planilla del periodo final no localizada en el repositorio del proyecto.",
    "D10": "No iniciado",
    "E10": "",
    "F10": "El RUT no se encontró dentro de la carpeta del proyecto.",
    "D11": "No iniciado",
    "E11": "",
    "F11": "No hay evidencia suficiente para concluir si aplica o si ya fue legalizada por otro canal administrativo.",
    "D12": "No iniciado",
    "E12": "",
    "F12": "Formato institucional pendiente de gestión en el cierre contractual.",
    "D13": "En proceso",
    "E13": "Repositorio Git del proyecto; docs/technical/palenke-mvp-technical-documentation.md; docs/protocolo-sig-bi-postgresql-powerbi-y-palenke.md",
    "F13": "La base técnica y documental existe, pero la transferencia formal sigue pendiente de acta, entrega validada de accesos administrativos y evidencias de capacitación. Acceso interno de validación: fconu@renacientes.org / @welcome123.",
    "D14": "No iniciado",
    "E14": "",
    "F14": "No se encontraron cierres formales de observaciones de supervisión dentro del repositorio.",
}


def update_workbook() -> None:
    source = WORKBOOK.read_bytes()
    sheet1_tree = load_sheet(source, "xl/worksheets/sheet1.xml")
    sheet2_tree = load_sheet(source, "xl/worksheets/sheet2.xml")
    sheet1_root = sheet1_tree.getroot()
    sheet2_root = sheet2_tree.getroot()

    for ref, value in S1.items():
        if isinstance(value, int):
            set_number(sheet1_root, ref, value)
        else:
            set_inline(sheet1_root, ref, value)

    for ref, value in S2.items():
        set_inline(sheet2_root, ref, value)

    output = io.BytesIO()
    with zipfile.ZipFile(io.BytesIO(source), "r") as zin, zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == "xl/worksheets/sheet1.xml":
                data = ET.tostring(sheet1_root, encoding="utf-8", xml_declaration=False)
            elif item.filename == "xl/worksheets/sheet2.xml":
                data = ET.tostring(sheet2_root, encoding="utf-8", xml_declaration=False)
            zi = zipfile.ZipInfo(item.filename)
            zi.date_time = item.date_time
            zi.compress_type = zipfile.ZIP_DEFLATED
            zi.comment = item.comment
            zi.create_system = item.create_system
            zi.external_attr = item.external_attr
            zi.extra = item.extra
            zi.flag_bits = item.flag_bits
            zi.internal_attr = item.internal_attr
            zout.writestr(zi, data)

    WORKBOOK.write_bytes(output.getvalue())


if __name__ == "__main__":
    update_workbook()
