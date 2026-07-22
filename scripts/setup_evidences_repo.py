#!/usr/bin/env python3
"""Create numbered evidence folders linked to the compliance matrix."""

from __future__ import annotations

from pathlib import Path

from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[1]
MATRIX = ROOT / "docs/final-formats/02_Matriz_cumplimiento_ANGEL_MATEUS_final.xlsx"
EVID = ROOT / "docs/final-formats/evidences"

# Folder id -> relative path under evidences/
FOLDER_IDS = [
    "01",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    *[f"14_{i}" for i in range(1, 11)],
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    *[f"25_{i}" for i in range(1, 9)],
]


def matrix_index() -> dict[str, dict]:
    wb = load_workbook(MATRIX, data_only=True)
    ws = wb["Matriz contractual"]
    out: dict[str, dict] = {}
    for r in range(9, 48):
        no = ws.cell(r, 1).value
        if no is None:
            continue
        key = str(no).strip().replace(".", "_")
        out[key] = {
            "no": str(no).strip(),
            "fase": (ws.cell(r, 2).value or "").strip(),
            "obligacion": (ws.cell(r, 3).value or "").strip(),
            "producto": (ws.cell(r, 6).value or "").strip(),
            "enlace": (ws.cell(r, 7).value or "").strip(),
            "estado": (ws.cell(r, 8).value or "").strip(),
            "pct": ws.cell(r, 9).value,
        }
    return out


def write_folder_readme(folder: Path, meta: dict | None) -> None:
    if meta:
        body = f"""# Evidencia {meta['no']}

**Fase / componente:** {meta['fase']}

**Obligación:** {meta['obligacion']}

**Estado:** {meta['estado']} | **Avance:** {meta['pct']}%

**Producto / evidencia (matriz):** {meta['producto']}

**Enlace / anexo (matriz):** {meta['enlace']}

## Contenido de esta carpeta

Colocar aquí capturas, PDFs, actas, correos o exports que soporten esta obligación.
Si la evidencia es solo código o URL, dejar un archivo `ENLACES.md` con las rutas.
"""
    else:
        body = (
            f"# Evidencia {folder.name}\n\n"
            "Carpeta alineada a la matriz de cumplimiento. Agregar soportes aquí.\n"
        )
    (folder / "README.md").write_text(body, encoding="utf-8")


def write_root_index(idx: dict[str, dict]) -> None:
    lines = [
        "# Repositorio de evidencias — Angel Mateus / HILEROS 055-2026",
        "",
        "Carpetas numeradas según la matriz `02_Matriz_cumplimiento_ANGEL_MATEUS_final.xlsx`.",
        "",
        "URL MVP: https://dev-palenke-two.vercel.app/",
        "",
        "| Carpeta | Obligación | Estado | Avance |",
        "|---------|------------|--------|--------|",
    ]
    for fid in FOLDER_IDS:
        meta = idx.get(fid)
        if meta:
            obl = meta["obligacion"].replace("|", "/")[:70]
            lines.append(
                f"| `{fid}` | {meta['no']}. {obl} | {meta['estado']} | {meta['pct']}% |"
            )
        else:
            lines.append(f"| `{fid}` | (sin fila) | — | — |")
    lines += [
        "",
        "## Screenshots",
        "",
        "Ver `screenshots/` para capturas sugeridas de la plataforma.",
        "",
    ]
    (EVID / "README.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    EVID.mkdir(parents=True, exist_ok=True)
    (EVID / "screenshots").mkdir(parents=True, exist_ok=True)
    idx = matrix_index()
    for fid in FOLDER_IDS:
        folder = EVID / fid
        folder.mkdir(parents=True, exist_ok=True)
        write_folder_readme(folder, idx.get(fid))
        # Placeholder so empty folders stay in git if needed
        keep = folder / ".gitkeep"
        if not any(folder.iterdir()) or not keep.exists():
            keep.write_text("", encoding="utf-8")
    write_root_index(idx)
    print(f"Created/updated {len(FOLDER_IDS)} evidence folders under {EVID}")


if __name__ == "__main__":
    main()
