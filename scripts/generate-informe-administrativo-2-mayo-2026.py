#!/usr/bin/env python3
"""Fill «Formato Informe Administrativo (2)» with all Mayo 2026 tasks."""

from __future__ import annotations

import copy
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "DOCUEMNTOS_HONONARIOS/Formato Informe Administrativo (2).template.docx"
OUTPUT = ROOT / "DOCUEMNTOS_HONONARIOS/Formato Informe Administrativo (2).docx"

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
SITE = "https://pro-palenke-vw-two.vercel.app"

CONTRACTOR = {
    "NOMBRE DEL/ LA CONTRATISTA": "Angel Mateus Arrieta Morelo",
    "CARGO": "Consultor informático",
    "NIT/ No de CÉDULA": "1028033422",
    "PERIODO DEL INFORME": "Mayo 2026",
    "FECHA DE PRESENTACIÓN DEL INFORME": "22 Mayo 2026",
    "NOMBRE DEL COORDINADOR": "Francy",
}

OBJETO = (
    "Prestación de servicios de Consultoría en Tecnología de la Información para el diseño, "
    "desarrollo e implementación del Mockup Interactivo (MVP) de la Plataforma Digital Palenke "
    "de Pensamiento y Cuidadores del Territorio del Proceso de Comunidades Negras (PCN), que "
    "incluye: portal público/interno con control de visibilidad por rol, biblioteca documental "
    "temática (Memoria Afroterritorial), módulo de Mujeres, Juventudes y Niñez (MJN), catálogo "
    "de tableros estadísticos con integración Power BI, punto de entrada al geoportal externo "
    "(SIG afrodescendiente) y panel de administración completo para la gestión de contenidos."
)

# (obligación específica, actividad ejecutada)
ACTIVITIES: list[tuple[str, str]] = [
    (
        "Módulo SCITA: portal territorial, geovisor, tableros Power BI y reportes de campo.",
        (
            "Rediseño completo de /scita respecto al estado de abril (mapa simplificado y redirección básica). "
            "Se implementó: hero de marketing (scitaMarketingHero), workspace por módulos (gobierno, conservación, "
            "titulación) con iconografía propia, ScitaGeovisor y mapa de referencia, ScitaPowerBiBoard con embeds "
            "filtrados por rol, ScitaDashboardPanel, formulario de reportes territoriales en /scita/formulario "
            "(persistencia Supabase + respaldo local) y panel /admin/alertas con gráficos de seguimiento. "
            f"Migraciones: 018, 019, 021, 022. Componentes: ScitaPageContent, ScitaWorkspace, ScitaFieldReportForm. {SITE}/scita"
        ),
    ),
    (
        "Memoria Afroterritorial: mediateca audiovisual, hero de presentación y memoria comunitaria.",
        (
            "Nueva subsección /memoria-afroterritorial/mediateca-ubuntu con ~28 registros (fotos y videos en bucket "
            "Supabase mediateca-ubuntu), MediatecaUbuntuGallerySection con filtros por rol, MemoriaAfroterritorialSubnav "
            "y script sync-mediateca-ubuntu-storage.mjs. Video hero MemoriaAfroterritorialHeroVideo "
            "(memoria-afroterritorial-presentacion-hero.mp4) con audio de apoyo; pieza «Somos la voz del territorio»; "
            "imagen «Nuestra memoria» (IMG_7018) vía upload-memoria-nuestra-memoria-image.mjs; migración 025. "
            f"Scripts: upload-memoria-hero-media.mjs. {SITE}/memoria-afroterritorial"
        ),
    ),
    (
        "Gobierno Propio: galería contextual, video hero y red de orientación política.",
        (
            "GobiernoPropioMediaGallery (~9 piezas foto/video con lightbox, filtros por sección e instrumento), "
            "GobiernoPropioGallerySection, OrientationNetworkSection (logo Tenure Facility), mejoras en "
            "BibliotecaMemoriaGrid y BookPreviewLightbox. Video de presentación GobiernoPropioHeroVideo enlazado a "
            "public/videos/gobierno-propio-presentacion-hero.mp4 (versión extendida ~108 MB). Ajustes en "
            "/gobierno-propio/[instrumento] y metadata de conservación (migraciones 016, 017; corpus PDF ACC en docs/). "
            f"{SITE}/gobierno-propio"
        ),
    ),
    (
        "Feed «Lo último», Incidencia y cobertura del Foro Global de la Tierra 2025.",
        (
            "Se amplió lo-ultimo-publications.ts con 5 publicaciones editoriales de largo aliento y galería: "
            "(1) Convenio URT–Hileros–caracterización y demanda; (2) PCN e ILC–Foro Global de la Tierra; "
            "(3) ONU/género–Valle, Antioquia y Nariño; (4) alianza Turning Tides Facility–agua y territorio; "
            "(5) Sistema ACC 2018–2025 (~144.580 ha). Se integraron ~42 enlaces del Foro Global desde "
            "docs/METRICA FORO GLOBAL DE LA TIERRA.docx (Instagram, X, Facebook) más referencias en docs/references/lo ultimo/. "
            "Assets en public/assets/lo-ultimo/. Vista /incidencia con búsqueda (q), paginación (8 ítems/página), "
            "LoUltimoListRow, LoUltimoPublicationGallery, LoUltimoImage; páginas detalle /incidencia/[slug]; "
            f"integración en content.ts (listLoUltimoNews). {SITE}/incidencia"
        ),
    ),
    (
        "Embeds de redes sociales en Incidencia y portada.",
        (
            "Nuevos componentes SocialPostEmbed y XPostEmbed con resolveSocialEmbed (social-embed.ts) para incrustar "
            "publicaciones de Instagram, X (Twitter) y Facebook sin sacar al usuario del sitio. Aplicado en listado "
            "de Incidencia y en entradas del home que tienen externalUrl de redes."
        ),
    ),
    (
        "Portada (home): intro de marca, hero audiovisual, Lo último e Instagram.",
        (
            "PageIntroOverlay (animación «Palenke — Pensamiento y Territorio» con sessionStorage). "
            "HomeHeroSection y ExpandableVideo para video principal; refactor de page.tsx extrayendo lógica del hero. "
            "Bloque «Lo último» con las 5 noticias destacadas vía LoUltimoListRow. InstagramSlider para mostrar "
            "publicaciones tipo Entérate/Instagram en carrusel. Mantiene feed «Entérate» (PCN) implementado en abril. "
            f"{SITE}/"
        ),
    ),
    (
        "Panel administrativo: layout unificado, contacto, actividad y módulos operativos.",
        (
            "AdminLayout y admin-nav en todas las pantallas admin (documentos, usuarios, solicitudes, campañas, ACCs, "
            "dashboards, novedades/eventos/noticias, contenido-visual). Registro admin-activity (migración 024). "
            "API y formulario de mensajes de contacto (ContactForm, ContactModal, migración 023). "
            "ScitaDashboardAdminForm y guía de tableros. Evolución de solicitudes de acceso y validación de instrumentos "
            "entregadas en abril (Nivel 1 administrador / Nivel 2 coordinación), sin regresión en mayo. "
            f"{SITE}/admin"
        ),
    ),
    (
        "Geoportal, estadísticas y continuidad de módulos transversales.",
        (
            "Actualización de /geoportal; SVG geovisor-reference-map.svg integrado en ScitaGeovisor. "
            "Refinamientos en /noticias y estilos globales (globals.css). Búsqueda asistida ai-search.ts para "
            "sugerencias de contenido visual en administración. Los módulos MJN, biblioteca, estadísticas y agenda "
            "permanecen operativos con los ajustes de visibilidad y acceso definidos en ciclos anteriores."
        ),
    ),
    (
        "Documentación técnica, protocolo de datos y soporte a auditoría RRI.",
        (
            "Elaboración y actualización de: palenke-mvp-technical-documentation (HTML, MD, PDF), "
            "protocolo-sig-bi-postgresql-powerbi-y-palenke.md (arquitectura SIG–PostgreSQL–Power BI–Palenke), "
            "CHECKLIST-CUMPLIMIENTO-ANEXO-4-RRI.md, corpus de Áreas de Conservación Comunitaria por consejo en "
            "docs/files/INF. INTERNA/ (Cimarrones, Patianos, Diego Luis Córdoba, Las Acacias, MLK, Páez, etc.)."
        ),
    ),
    (
        "Comparación abril → mayo (evolución del MVP, no repetición de entregables).",
        (
            "Abril 2026 priorizó: acceso documental Nivel 1/2, PDFs normativa vigente, hero full-bleed, feed Entérate, "
            "validación de instrumentos y descargas. Mayo 2026 profundizó: SCITA productivo, Mediateca Ubuntu, "
            "galerías audiovisuales Gobierno Propio, contenido editorial masivo Lo último/Foro Global, videos hero en "
            "tres módulos, embeds sociales, panel de alertas SCITA y migraciones Supabase 016–025. "
            "Ambos meses son complementarios en la ruta hacia el MVP contractual."
        ),
    ),
]

SIGNATURE_BLOCK = (
    "FIRMA CONTRATISTA\n\n"
    "NOMBRE: Angel Mateus Arrieta Morelo\n"
    "C.C: 1028033422\n\n"
    "FIRMA\n\n"
    "COORDINADOR(A)"
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


def row_label(tr: ET.Element) -> str:
    cells = tr.findall(f"{W}tc")
    if not cells:
        return ""
    parts = []
    for t in cells[0].iter(f"{W}t"):
        if t.text:
            parts.append(t.text)
    return "".join(parts).strip()


def make_two_col_row(template_tr: ET.Element, col1: str, col2: str) -> ET.Element:
    row = copy.deepcopy(template_tr)
    cells = row.findall(f"{W}tc")
    set_cell_text(cells[0], col1)
    set_cell_text(cells[1], col2)
    return row


def patch_document_xml(xml: str) -> bytes:
    root = ET.fromstring(xml)

    tables = root.findall(".//w:tbl", NS)

    tbl0 = tables[0]
    for tr in tbl0.findall("w:tr", NS):
        label = row_label(tr)
        if label in CONTRACTOR:
            cells = tr.findall("w:tc", NS)
            if len(cells) >= 2:
                set_cell_text(cells[1], CONTRACTOR[label])

    tbl1 = tables[1]
    rows1 = tbl1.findall("w:tr", NS)
    if len(rows1) >= 2:
        set_cell_text(rows1[1].findall("w:tc", NS)[0], OBJETO)

    tbl2 = tables[2]
    rows2 = tbl2.findall("w:tr", NS)
    template_row = rows2[1]
    for tr in rows2[1:]:
        tbl2.remove(tr)
    for obligacion, actividad in ACTIVITIES:
        tbl2.append(make_two_col_row(template_row, obligacion, actividad))

    tbl3 = tables[3]
    rows3 = tbl3.findall("w:tr", NS)
    if len(rows3) >= 2:
        tcs = rows3[1].findall("w:tc", NS)
        if tcs:
            set_cell_text(tcs[0], SIGNATURE_BLOCK)

    return ET.tostring(root, encoding="utf-8", xml_declaration=True)


def main() -> None:
    source = TEMPLATE
    if not source.exists():
        fallback = ROOT / "DOCUEMNTOS_HONONARIOS/Formato Informe Administrativo (2).docx"
        if fallback.exists():
            source = fallback
        else:
            raise SystemExit(f"Template not found: {TEMPLATE}")

    with zipfile.ZipFile(source, "r") as zin:
        entries = {name: zin.read(name) for name in zin.namelist()}

    entries["word/document.xml"] = patch_document_xml(entries["word/document.xml"].decode("utf-8"))

    with zipfile.ZipFile(OUTPUT, "w", zipfile.ZIP_DEFLATED) as zout:
        for name, data in entries.items():
            zout.writestr(name, data)

    print(f"Updated: {OUTPUT}")
    print(f"Activities: {len(ACTIVITIES)}")


if __name__ == "__main__":
    main()
