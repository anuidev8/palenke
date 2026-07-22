#!/usr/bin/env python3
"""Generate Informe Final from Hileros admin format + compliance matrix."""

from __future__ import annotations

import copy
from pathlib import Path

from docx import Document
from docx.oxml.ns import qn
from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "docs/final-formats/Formato Informe Administrativo (1).docx"
MATRIX = ROOT / "docs/final-formats/02_Matriz_cumplimiento_ANGEL_MATEUS_final.xlsx"
OUTPUT = ROOT / "docs/final-formats/INFORME_FINAL_ANGEL_MATEUS_HILEROS_055-2026.docx"

# Skip mirror product rows (14.x / 25.x) — covered by parent obligations.
SKIP_PREFIXES = ("14.", "25.")

CONTRACTOR = {
    "NOMBRE DEL/ LA CONTRATISTA": "Angel Mateus Arrieta Morelo",
    "CARGO": "Consultor informático / Personal de comunicación y visibilidad",
    "NIT/ No de CÉDULA": "1028033422",
    "PERIODO DEL INFORME": "1 de marzo de 2026 – 17 de julio de 2026 (corte informe final)",
    "FECHA DE PRESENTACIÓN DEL INFORME": "17 de julio de 2026",
    "NOMBRE DEL COORDINADOR": "Francy Conu",
}

OBJETO = (
    "Prestación de servicios de Consultoría en Tecnología de la Información para el diseño, "
    "desarrollo e implementación del Mockup Interactivo (MVP) de la Plataforma Digital Palenke "
    "de Pensamiento y Cuidadores del Territorio del Proceso de Comunidades Negras (PCN), que "
    "incluye: portal público/interno con control de visibilidad por rol, biblioteca documental "
    "temática (Memoria Afroterritorial), módulo de Mujeres, Juventudes y Niñez (MJN), catálogo "
    "de tableros estadísticos con integración Power BI y panel de administración para la gestión "
    "de contenidos. El geoportal/geovisor interno no forma parte del cierre del MVP y queda "
    "para la siguiente etapa del proyecto. Contrato HILEROS 055-2026 – Proyecto Turning Tides P1010."
)

ANEXO_TEXT = (
    "ANEXOS DEL INFORME FINAL\n"
    "1. Matriz de cumplimiento: docs/final-formats/02_Matriz_cumplimiento_ANGEL_MATEUS_final.xlsx\n"
    "2. Documentación / evidencias legibles (Fumadocs en la plataforma):\n"
    "   https://dev-palenke-two.vercel.app/docs\n"
    "   https://dev-palenke-two.vercel.app/docs/informe-y-matriz\n"
    "   https://dev-palenke-two.vercel.app/docs/accesos\n"
    "   https://dev-palenke-two.vercel.app/docs/modulos-y-urls\n"
    "   https://dev-palenke-two.vercel.app/docs/arquitectura-y-base-de-datos\n"
    "   https://dev-palenke-two.vercel.app/docs/como-esta-construido\n"
    "   https://dev-palenke-two.vercel.app/docs/repositorio-codigo\n"
    "3. URL producto MVP: https://dev-palenke-two.vercel.app/\n"
    "4. Repositorio código (privado): https://github.com/anuidev8/palenke "
    "(invitar por email; ver /docs/repositorio-codigo)\n"
    "5. Documentación técnica fuente en repo: docs/technical/palenke-mvp-technical-documentation.md\n"
    "6. Informes administrativos previos ABRIL/MAYO 2026\n"
    "7. Documentos de pago de honorarios: ya remitidos por el canal institucional.\n\n"
    "ACCESOS A LA PLATAFORMA\n"
    "Guía: https://dev-palenke-two.vercel.app/docs/accesos\n"
    "Login: https://dev-palenke-two.vercel.app/login\n"
    "Admin — angelarrieta34@gmail.com / welcome123 → https://dev-palenke-two.vercel.app/admin\n"
    "Interno — fconu@renacientes.org / @welcome123 → login con rol internal.\n"
    "Recomendación: cambiar contraseñas de validación tras revisión.\n\n"
    "CRITERIO DE EVIDENCIA\n"
    "Toda la evidencia verificable del MVP está en Fumadocs (/docs) y en las URLs reales "
    "del producto. No se usa carpeta evidences ni capturas de pantalla obligatorias.\n\n"
    "NOTA GEOPORTAL\n"
    "Fuera del cierre MVP (siguiente etapa). Acceso preparatorio: "
    "https://dev-palenke-two.vercel.app/geoportal — ver /docs/modulos-y-urls.\n\n"
    "PENDIENTES\n"
    "- Geoportal SIG completo: siguiente etapa.\n"
    "- Capacitación (obl. 12 y 23).\n"
    "- Acta formal de transferencia (obl. 10).\n"
    "- Optimización avanzada (obl. 21)."
)



def set_cell_text(cell, text: str) -> None:
    cell.text = ""
    p = cell.paragraphs[0]
    run = p.add_run(text)
    run.font.name = "Arial"
    r = run._element
    rPr = r.get_or_add_rPr()
    rFonts = rPr.find(qn("w:rFonts"))
    if rFonts is None:
        from docx.oxml import OxmlElement

        rFonts = OxmlElement("w:rFonts")
        rPr.append(rFonts)
    rFonts.set(qn("w:ascii"), "Arial")
    rFonts.set(qn("w:hAnsi"), "Arial")


def ensure_obligation_rows(table, needed: int) -> None:
    """Ensure table has header + needed data rows (clone last data row XML)."""
    while len(table.rows) - 1 < needed:
        tbl = table._tbl
        last_tr = table.rows[-1]._tr
        new_tr = copy.deepcopy(last_tr)
        for tc in new_tr.iterchildren(qn("w:tc")):
            for p in tc.iterchildren(qn("w:p")):
                for child in list(p):
                    if child.tag != qn("w:pPr"):
                        p.remove(child)
        tbl.append(new_tr)


def load_matrix_rows() -> list[dict]:
    wb = load_workbook(MATRIX, data_only=True)
    ws = wb["Matriz contractual"]
    rows: list[dict] = []
    for r in range(9, 48):
        no = ws.cell(r, 1).value
        if no is None:
            continue
        no_s = str(no).strip()
        if no_s.startswith(SKIP_PREFIXES):
            continue
        oblig = (ws.cell(r, 3).value or "").strip()
        acts = (ws.cell(r, 5).value or "").strip()
        product = (ws.cell(r, 6).value or "").strip()
        link = (ws.cell(r, 7).value or "").strip()
        estado = (ws.cell(r, 8).value or "").strip()
        pct = ws.cell(r, 9).value
        pct_s = f"{pct}%" if pct is not None and pct != "" else "—"
        actividad = (
            f"{acts}\n\n"
            f"Producto / evidencia: {product}\n"
            f"URL / acceso (página original): {link}\n"
            f"Estado: {estado} | Avance: {pct_s}"
        )
        rows.append(
            {
                "no": no_s,
                "obligacion": f"{no_s}. {oblig}",
                "actividad": actividad,
            }
        )
    return rows


def fill_header(doc: Document) -> None:
    t0 = doc.tables[0]
    for row in t0.rows:
        key = row.cells[0].text.strip()
        if key in CONTRACTOR:
            set_cell_text(row.cells[1], CONTRACTOR[key])

    t1 = doc.tables[1]
    set_cell_text(t1.rows[1].cells[0], OBJETO)


def fill_obligations(doc: Document, rows: list[dict]) -> None:
    t2 = doc.tables[2]
    ensure_obligation_rows(t2, len(rows))
    for i, item in enumerate(rows):
        row = t2.rows[i + 1]
        set_cell_text(row.cells[0], item["obligacion"])
        set_cell_text(row.cells[1], item["actividad"])


def fill_anexo_and_signature(doc: Document) -> None:
    # Find ANEXO paragraph and replace following empty content if needed
    for p in doc.paragraphs:
        if p.text.strip().startswith("ANEXO"):
            p.clear()
            run = p.add_run(ANEXO_TEXT)
            run.font.name = "Arial"
            break

    # Signature table
    t_sig = doc.tables[3]
    set_cell_text(
        t_sig.rows[1].cells[0],
        "FIRMA CONTRATISTA\nNOMBRE: Angel Mateus Arrieta Morelo\nC.C: 1028033422\n(Pendiente firma manuscrita / digital)",
    )
    set_cell_text(
        t_sig.rows[1].cells[1],
        "FIRMA\nCOORDINADOR(A): Francy Conu\n(Pendiente visto bueno)",
    )


def main() -> None:
    rows = load_matrix_rows()
    doc = Document(str(TEMPLATE))
    fill_header(doc)
    fill_obligations(doc, rows)
    fill_anexo_and_signature(doc)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(OUTPUT))
    print(f"Wrote {OUTPUT} with {len(rows)} obligations")


if __name__ == "__main__":
    main()
