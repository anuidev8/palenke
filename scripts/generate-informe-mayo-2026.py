#!/usr/bin/env python3
"""Generate Mayo 2026 supervision informe from Abril 2026 Word template."""

from __future__ import annotations

import copy
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "DOCUEMNTOS_HONONARIOS/FORMATO INORME ADM_ANGEL_ARRIETA_ABRIL_2026.docx"
OUTPUT = ROOT / "DOCUEMNTOS_HONONARIOS/FORMATO INORME ADM_ANGEL_ARRIETA_MAYO_2026.docx"

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
SITE = "https://dev-palenke-two.vercel.app"

ACTIVITIES: list[tuple[str, str, str]] = [
    (
        "1. Rediseño integral del módulo SCITA (Sistema Comunitario de Información Territorial y Ambiental).",
        "Se reconstruyó la experiencia de /scita con hero de marketing, workspace por módulos (gobierno, conservación, titulación), geovisor, tableros Power BI embebidos con visibilidad por rol, iconografía propia y formulario de reportes de campo en /scita/formulario.",
        f"Código: src/app/scita/page.tsx, src/components/palenke/ScitaPageContent.tsx, ScitaWorkspace.tsx, ScitaDashboardPanel.tsx, scitaMarketingHero.tsx\n"
        f"Migraciones: supabase/migrations/018_scita_dashboards.sql, 021_create_scita_reports.sql\n{SITE}/scita",
    ),
    (
        "2. Nueva subsección Mediateca Ubuntu dentro de Memoria Afroterritorial.",
        "Se creó la ruta /memoria-afroterritorial/mediateca-ubuntu con galería audiovisual comunitaria (~28 registros imagen/video), subnavegación entre secciones de memoria, bucket Supabase y script de sincronización de medios.",
        f"Código: src/app/memoria-afroterritorial/mediateca-ubuntu/page.tsx, MediatecaUbuntuGallerySection.tsx, mediateca-ubuntu-gallery-data.ts\n"
        f"scripts/sync-mediateca-ubuntu-storage.mjs\nMigración: 019_mediateca_ubuntu_bucket.sql\n{SITE}/memoria-afroterritorial/mediateca-ubuntu",
    ),
    (
        "3. Galería multimedia y video hero en Gobierno Propio.",
        "Se incorporó galería contextual de fotos y videos (~9 piezas), video de presentación en hero, sección de red de orientación política (Tenure Facility) y poster de memoria en movimiento.",
        f"Código: GobiernoPropioMediaGallery.tsx, GobiernoPropioGallerySection.tsx, GobiernoPropioHeroVideo.tsx, gobierno-gallery-data.ts\n"
        f"public/videos/gobierno-propio-presentacion-hero.mp4\n{SITE}/gobierno-propio",
    ),
    (
        "4. Feed «Lo último» e Incidencia con contenido editorial ampliado.",
        "Se publicaron 5 piezas editoriales curadas (URT–Hileros, ILC, ONU/género, TTF, sistema ACC) con galerías de imágenes; se integraron ~42 enlaces del Foro Global de la Tierra 2025; Incidencia con búsqueda, paginación y vista enriquecida.",
        f"Código: src/lib/lo-ultimo-publications.ts, src/app/incidencia/page.tsx, LoUltimoListRow.tsx\n"
        f"Assets: public/assets/lo-ultimo/*\n{SITE}/incidencia",
    ),
    (
        "5. Panel administrativo de alertas y reportes SCITA.",
        "Nueva ruta /admin/alertas con dashboard de reportes de campo, gráficos y consolidación desde Supabase (con respaldo local).",
        f"Código: src/app/admin/alertas/page.tsx, AdminAlertsDashboard.tsx, AdminAlertsCharts.tsx\n{SITE}/admin/alertas",
    ),
    (
        "6. Refactor del panel administrativo, contacto y trazabilidad.",
        "Layout unificado AdminLayout en todas las pantallas admin; API de mensajes de contacto; registro de actividad administrativa; navegación centralizada.",
        f"Código: src/components/mock/AdminLayout.tsx, src/lib/admin-nav.ts, admin-activity.ts\n"
        f"api/contact-messages/route.ts, ContactForm.tsx, ContactModal.tsx\n"
        f"Migraciones: 023_contact_messages.sql, 024_admin_activity_log.sql\n{SITE}/admin",
    ),
    (
        "7. Memoria Afroterritorial: hero audiovisual e imagen «Nuestra memoria».",
        "Video de presentación con audio en hero de memoria; imagen comunitaria en sección Nuestra memoria; bucket dedicado en Supabase.",
        f"Código: MemoriaAfroterritorialHeroVideo.tsx, memoria-afroterritorial-assets.ts\n"
        f"Migración: 025_memoria_afroterritorial_bucket.sql\n{SITE}/memoria-afroterritorial",
    ),
    (
        "8. Mejoras en inicio (home): overlay de bienvenida y bloque Lo último.",
        "Animación de entrada «Palenke — Pensamiento y Territorio» (PageIntroOverlay); hero refactorizado; integración del feed Lo último en portada.",
        f"Código: src/components/global/PageIntroOverlay.tsx, HomeHeroSection.tsx, src/app/page.tsx\n{SITE}/",
    ),
    (
        "9. Metadata y alineación de documentos Gobierno Propio / conservación.",
        "Migraciones para metadata UI de áreas de conservación comunitaria y territorio Capitanía Páez en reglamentos; alineación con corpus interno ACC.",
        f"Migraciones: 016_align_conservacion_ui_metadata.sql, 017_reglamentos_cc_mayor_capitania_territory_paez.sql\n"
        f"docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/*",
    ),
    (
        "10. Documentación técnica y protocolo de datos SIG–BI–PostgreSQL–Power BI.",
        "Documentación MVP (HTML/MD/PDF), protocolo de integración de datos territoriales y checklist de cumplimiento RRI.",
        f"docs/technical/palenke-mvp-technical-documentation.*\n"
        f"docs/protocolo-sig-bi-postgresql-powerbi-y-palenke.md\n"
        f"docs/CHECKLIST-CUMPLIMIENTO-ANEXO-4-RRI.md",
    ),
    (
        "11. Geoportal y referencia cartográfica para SCITA.",
        "Actualización de geoportal y SVG de referencia para el geovisor integrado en SCITA.",
        f"Código: src/app/geoportal/page.tsx, ScitaGeovisor.tsx\n"
        f"public/assets/geovisor-reference-map.svg\n{SITE}/geoportal",
    ),
    (
        "12. Administración de dashboards SCITA desde panel.",
        "Formulario y guía para gestionar tableros Power BI por módulo y visibilidad; backfill de dashboards internos.",
        f"Código: ScitaDashboardAdminForm.tsx, ScitaDashboardGuideModal.tsx, scita-dashboards.ts\n"
        f"Migraciones: 019_scita_internal_dashboards_backfill.sql, 022_scita_conservacion_internal_dashboard.sql",
    ),
    (
        "13. Componentes de video hero reutilizables (Home, Gobierno Propio, Memoria).",
        "Se implementaron HomeHeroSection, GobiernoPropioHeroVideo y MemoriaAfroterritorialHeroVideo; refactor de src/app/page.tsx; mejora de ExpandableVideo para reproducción en portada y módulos.",
        "Código: src/components/home/HomeHeroSection.tsx, GobiernoPropioHeroVideo.tsx, "
        "MemoriaAfroterritorialHeroVideo.tsx, ExpandableVideo.tsx\n"
        f"{SITE}/",
    ),
    (
        "14. Embeds de publicaciones en redes sociales (Instagram, X, Facebook).",
        "Se crearon SocialPostEmbed, XPostEmbed y resolveSocialEmbed para incrustar posts externos en Incidencia y home sin redirección forzada.",
        "Código: src/components/palenke/SocialPostEmbed.tsx, XPostEmbed.tsx, src/lib/social-embed.ts, "
        "src/app/incidencia/page.tsx\n"
        f"{SITE}/incidencia",
    ),
    (
        "15. Ampliación de lo-ultimo-publications.ts y refactor del home.",
        "Se amplió el catálogo editorial (Foro Global de la Tierra, galerías, URLs externas) y se simplificó page.tsx delegando el hero y el listado Lo último.",
        "Código: src/lib/lo-ultimo-publications.ts, src/app/page.tsx, LoUltimoListRow.tsx",
    ),
    (
        "16. Actualización del video hero de Gobierno Propio (~108 MB).",
        "Se reemplazó public/videos/gobierno-propio-presentacion-hero.mp4 por la versión extendida de presentación (~108 MB) enlazada desde GobiernoPropioHeroVideo.",
        "Asset: public/videos/gobierno-propio-presentacion-hero.mp4, gobierno-propio-assets.ts\n"
        f"{SITE}/gobierno-propio",
    ),
    (
        "17. Integración de la métrica Foro Global de la Tierra (docx).",
        "Se procesó docs/METRICA FORO GLOBAL DE LA TIERRA.docx para registrar ~42 enlaces de Instagram, X y Facebook en lo-ultimo-publications.ts (categoría Foro Global de la Tierra 2025).",
        "Insumo: docs/METRICA FORO GLOBAL DE LA TIERRA.docx, docs/references/lo ultimo/*",
    ),
]

LOGROS = (
    "Rediseño completo de SCITA con tableros Power BI, geovisor y reportes de campo.\n"
    "Mediateca Ubuntu operativa con galería audiovisual en Supabase.\n"
    "Galería multimedia y video hero en Gobierno Propio.\n"
    "Feed Lo último con 5 publicaciones editoriales y cobertura del Foro Global de la Tierra 2025.\n"
    "Panel /admin/alertas para seguimiento de reportes territoriales.\n"
    "Migraciones Supabase 016–025 (SCITA, mediateca, contacto, actividad admin, memoria).\n"
    "Documentación técnica y protocolo SIG–BI para continuidad del proyecto.\n"
    "Overlay de bienvenida y mejoras visuales en el home.\n"
    "Videos hero reutilizables en Home, Gobierno Propio y Memoria.\n"
    "Embeds de redes sociales en Incidencia.\n"
    "Video hero Gobierno Propio actualizado (~108 MB).\n"
    "Métrica Foro Global de la Tierra integrada al feed Lo último."
)

RETOS = (
    "Consolidar dos naturalezas de contenido en noticias: feed automático «Entérate» (PCN) y feed editorial «Lo último» con piezas largas y enlaces externos.\n"
    "Gestionar volumen alto de medios (videos hero, galerías, bucket mediateca) sin degradar rendimiento en despliegue.\n"
    "Coordinar visibilidad pública/interna en tableros SCITA y documentos de conservación con metadata heterogénea por consejo.\n"
    "Mantener sincronización entre repositorio, Supabase Storage y contenido curado en código (Lo último, Foro Global).\n"
    "Commits con mensajes poco descriptivos que dificultan trazabilidad formal del informe (mitigado con este documento y documentación técnica)."
)

ADAPTACION = (
    "Se separó SCITA en workspace modular con dashboards configurables en BD y formulario de reportes independiente.\n"
    "Se centralizó la mediateca en bucket dedicado con script de sincronización y galería filtrada por rol.\n"
    "Se curó Lo último en código tipado (lo-ultimo-publications.ts) con assets versionados y categoría Foro Global de la Tierra.\n"
    "Se unificó el panel admin con layout, log de actividad y alertas SCITA para operación editorial autónoma.\n"
    "Se documentó arquitectura de datos y MVP para transición a backend productivo y auditoría RRI."
)

ANEXOS = (
    f"URL de referencia:\n{SITE}\n\n"
    "Insumos integrados durante mayo 2026:\n"
    "— Referencias y comentarios de publicaciones Lo último (ILC, ONU, URT, TTF, RRI) en docs/references/lo ultimo/\n"
    "— docs/METRICA FORO GLOBAL DE LA TIERRA.docx (~42 enlaces redes → lo-ultimo-publications.ts)\n"
    "— Video hero Gobierno Propio public/videos/gobierno-propio-presentacion-hero.mp4 (~108 MB)\n"
    "— Componentes SocialPostEmbed, XPostEmbed, HomeHeroSection, *HeroVideo\n"
    "— Corpus PDF de Áreas de Conservación Comunitaria por consejo en docs/files/INF. INTERNA/\n"
    "— Video hero Gobierno Propio y medios en public/assets/ y Supabase mediateca-ubuntu\n\n"
    "Capturas de pantalla sugeridas (móvil y escritorio):\n"
    "— Home: overlay de bienvenida, hero y bloque Lo último\n"
    "— SCITA: workspace, tableros y formulario de reportes\n"
    "— Memoria Afroterritorial: hero video y Mediateca Ubuntu\n"
    "— Gobierno Propio: hero video y galería multimedia\n"
    "— Incidencia: listado, búsqueda y publicaciones con galería\n"
    "— Admin: /admin/alertas y gestión de dashboards SCITA\n\n"
    "Repositorio de código: privado; solicitar acceso enviando correos al equipo técnico."
)


def set_cell_text(tc: ET.Element, text: str) -> None:
    for child in list(tc):
        if child.tag != f"{W}tcPr":
            tc.remove(child)
    for line in text.split("\n"):
        p = ET.SubElement(tc, f"{W}p")
        r = ET.SubElement(p, f"{W}r")
        t = ET.SubElement(r, f"{W}t")
        t.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
        t.text = line


def make_activity_row(template_tr: ET.Element, actividad: str, resultado: str, soporte: str) -> ET.Element:
    row = copy.deepcopy(template_tr)
    cells = row.findall(f"{W}tc")
    set_cell_text(cells[0], actividad)
    set_cell_text(cells[1], resultado)
    set_cell_text(cells[2], soporte)
    return row


def replace_table_cell_paragraph(tbl: ET.Element, row_idx: int, text: str) -> None:
    tr = tbl.findall(f"{W}tr")[row_idx]
    tc = tr.findall(f"{W}tc")[0]
    set_cell_text(tc, text)


def patch_document_xml(xml: str) -> bytes:
    root = ET.fromstring(xml.encode() if isinstance(xml, str) else xml)

    # Header table: period dates
    full = ET.tostring(root, encoding="unicode")
    full = full.replace("20 Abril 2026", "22 Mayo 2026")
    full = full.replace("Abril 2026", "Mayo 2026")
    root = ET.fromstring(full)

    tables = root.findall(".//w:tbl", NS)

    # Table 3: compliance activities
    tbl3 = tables[3]
    rows = tbl3.findall("w:tr", NS)
    template_row = rows[1]
    for tr in rows[1:]:
        tbl3.remove(tr)

    for actividad, resultado, soporte in ACTIVITIES:
        tbl3.append(make_activity_row(template_row, actividad, resultado, soporte))

    # Table 4: logros / retos / adaptación / anexos
    tbl4 = tables[4]
    replace_table_cell_paragraph(tbl4, 0, f"LOGROS:\n{LOGROS}")
    replace_table_cell_paragraph(tbl4, 1, f"RETOS:\n{RETOS}")
    replace_table_cell_paragraph(tbl4, 2, f"ADAPTACIÓN A LOS RETOS:\n{ADAPTACION}")
    replace_table_cell_paragraph(tbl4, 4, ANEXOS)

    ET.register_namespace("w", NS["w"])
    ET.register_namespace("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")
    ET.register_namespace("wp", "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing")
    ET.register_namespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main")
    ET.register_namespace("pic", "http://schemas.openxmlformats.org/drawingml/2006/picture")
    ET.register_namespace("w14", "http://schemas.microsoft.com/office/word/2010/wordml")
    ET.register_namespace("w15", "http://schemas.microsoft.com/office/word/2012/wordml")
    ET.register_namespace("mc", "http://schemas.openxmlformats.org/markup-compatibility/2006")

    return ET.tostring(root, encoding="utf-8", xml_declaration=True)


def main() -> None:
    if not TEMPLATE.exists():
        raise SystemExit(f"Template not found: {TEMPLATE}")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(TEMPLATE, "r") as zin:
        entries = {name: zin.read(name) for name in zin.namelist()}

    entries["word/document.xml"] = patch_document_xml(entries["word/document.xml"].decode("utf-8"))

    with zipfile.ZipFile(OUTPUT, "w", zipfile.ZIP_DEFLATED) as zout:
        for name, data in entries.items():
            zout.writestr(name, data)

    print(f"Created: {OUTPUT}")


if __name__ == "__main__":
    main()
