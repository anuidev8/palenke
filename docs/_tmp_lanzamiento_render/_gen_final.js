const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, BorderStyle, WidthType, ShadingType, AlignmentType,
  PageNumber, Header, Footer, VerticalAlign, LevelFormat,
} = require("docx");
const fs = require("fs");
const path = require("path");

const GREEN_DARK = "1A2E1F";
const GREEN_MID = "2D4A3A";
const CREAM = "F5F0E8";
const OCRE = "C4A574";
const WHITE = "FFFFFF";
const MUTED = "5C6B5F";
const ROW_ALT = "EEF2EF";
const WARN = "F4E8D8";
const SOFT_BLUE = "E8EEF0";
const SOFT_RED = "F5E6E6";
const PAGE_W = 12240;
const PAGE_H = 15840;
const MARGIN = 720;
const CONTENT_W = PAGE_W - MARGIN * 2;
const thin = { style: BorderStyle.SINGLE, size: 4, color: "C9D4CB" };
const borders = { top: thin, bottom: thin, left: thin, right: thin };

function cell(text, opts = {}) {
  const { bold = false, width = 2700, fill = WHITE, color = "1A1A1A", align = AlignmentType.LEFT, fontSize = 15 } = opts;
  return new TableCell({
    width: { size: width, type: WidthType.DXA }, borders,
    shading: { type: ShadingType.CLEAR, fill }, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: align, spacing: { before: 32, after: 32 },
      children: [new TextRun({ text, bold, color, size: fontSize, font: "Calibri" })],
    })],
  });
}
function headerCell(text, width) {
  return cell(text, { bold: true, width, fill: GREEN_DARK, color: WHITE, fontSize: 12 });
}
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1, spacing: { before: 130, after: 56 },
    children: [new TextRun({ text, bold: true, color: GREEN_DARK, size: 21, font: "Calibri" })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2, spacing: { before: 90, after: 40 },
    children: [new TextRun({ text, bold: true, color: GREEN_MID, size: 16, font: "Calibri" })],
  });
}
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 6, after: 32 },
    children: [new TextRun({ text, size: opts.size || 14, color: opts.color || "222222", italics: !!opts.italics, bold: !!opts.bold, font: "Calibri" })],
  });
}
function bullet(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 }, spacing: { before: 2, after: 10 },
    children: [new TextRun({ text, size: 13, font: "Calibri", color: "222222" })],
  });
}
function callout(title, body, fill = WARN) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: CONTENT_W, type: WidthType.DXA }, borders,
      shading: { type: ShadingType.CLEAR, fill },
      children: [
        new Paragraph({ spacing: { before: 32, after: 12 }, children: [new TextRun({ text: title, bold: true, size: 13, color: GREEN_DARK, font: "Calibri" })] }),
        new Paragraph({ spacing: { before: 0, after: 32 }, children: [new TextRun({ text: body, size: 12, color: "333333", font: "Calibri" })] }),
      ],
    })] })],
  });
}
function spacer(after = 28) { return new Paragraph({ spacing: { after }, children: [] }); }
function timelineCell(week, label, fill) {
  return new TableCell({
    width: { size: 1800, type: WidthType.DXA }, borders,
    shading: { type: ShadingType.CLEAR, fill },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 22, after: 8 }, children: [new TextRun({ text: week, bold: true, size: 10, color: WHITE, font: "Calibri" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 22 }, children: [new TextRun({ text: label, size: 9, color: WHITE, font: "Calibri" })] }),
    ],
  });
}

const moduleRows = [
  ["Inicio (/)", "Carga, hero, CTAs, navegación.", "Textos; botones correctos.", "A"],
  ["Biblioteca", "Filtros, búsqueda, público/interno, descarga.", "Buscar y abrir fichas.", "U+A"],
  ["Gobierno propio / Instrumentos", "Árbol, sensible, solicitar acceso.", "Navegar; pedidos de acceso.", "U+A"],
  ["Memoria Afroterritorial", "Textos, enlaces, imágenes.", "Claridad del recorrido.", "U"],
  ["Mediateca Ubuntu", "Galería, filtros FOSPA, móvil.", "Barrido visual.", "U"],
  ["SCITA / Estadísticas", "Tableros, formulario, permisos.", "¿Se entiende el flujo?", "U+A"],
  ["Geoportal", "Mapa/visor, login, vacío vs útil.", "¿Usable sin ayuda?", "U"],
  ["Mujeres / juventudes / niñez", "Campañas, detalle, links.", "Contenido y navegación.", "U"],
  ["Noticias / Agenda / Incidencia", "Listados, detalle, CTAs.", "Sin fichas rotas.", "U"],
  ["Login / acceso / solicitudes", "Login, solicitar acceso, mis solicitudes.", "Flujo completo.", "U+A"],
  ["Admin (panel)", "Documentos, solicitudes, usuarios, dashboards.", "Solo Angel: CRUD/subidas.", "A"],
];

const refs = ["bullets", "checks", "media", "steps", "ask", "block", "flex"];
const doc = new Document({
  numbering: {
    config: refs.map((ref) => ({
      reference: ref,
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360, hanging: 180 } } } }],
    })),
  },
  sections: [{
    properties: {
      page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } },
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: OCRE, space: 6 } },
        spacing: { after: 40 },
        children: [
          new TextRun({ text: "Palenke · Plan de lanzamiento y contenido", size: 11, color: MUTED, font: "Calibri" }),
          new TextRun({ text: "  |  ", size: 11, color: OCRE, font: "Calibri" }),
          new TextRun({ text: "Sep–Nov 2026 · post-15 oct = propuesto", size: 11, color: MUTED, font: "Calibri" }),
        ],
      })] }),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: "C9D4CB", space: 6 } },
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ text: "Fuente: reunión Angel–Karen 19 sep 2026 · fathom.video/calls/829928151  ·  p. ", size: 9, color: MUTED, font: "Calibri" }),
          new TextRun({ children: [PageNumber.CURRENT], size: 9, color: MUTED, font: "Calibri" }),
        ],
      })] }),
    },
    children: [
      new Paragraph({ spacing: { before: 20, after: 12 }, children: [new TextRun({ text: "PLATAFORMA PALENKE", bold: true, size: 13, color: OCRE, font: "Calibri" })] }),
      new Paragraph({ spacing: { after: 28 }, children: [new TextRun({ text: "Plan de lanzamiento, pruebas y producción de contenido", bold: true, size: 24, color: GREEN_DARK, font: "Calibri" })] }),
      p("Calendario, packs multimedia, QA y anuncios por etapas. Fechas post-15 oct = propuestas.", { size: 14 }),
      spacer(12),
      callout(
        "Idea simple",
        "1) Aprobar este plan (25 sep).  2) Hasta el 15 oct: web estable.  3) Después: producir packs de 3 módulos.  4) Comunicaciones publica de a uno.  5) Fechas post-15 = propuestas (confirmar con Comunicaciones y editor).",
        CREAM,
      ),
      spacer(16),


      // Milestone strip
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [2700, 2700, 2700, 2700],
        rows: [
          new TableRow({ children: [
            headerCell("Hito", 2700), headerCell("Fecha", 2700), headerCell("Qué", 2700), headerCell("Quién", 2700),
          ]}),
          new TableRow({ children: [
            cell("Aprobar plan", { width: 2700, bold: true, fill: WARN, fontSize: 11 }),
            cell("25 sep", { width: 2700, fill: WARN, fontSize: 11 }),
            cell("Frank OK", { width: 2700, fill: WARN, fontSize: 11 }),
            cell("Angel + Karen", { width: 2700, fill: WARN, fontSize: 11 }),
          ]}),
          new TableRow({ children: [
            cell("Web estable", { width: 2700, bold: true, fill: ROW_ALT, fontSize: 11 }),
            cell("15 oct (DURO)", { width: 2700, fill: ROW_ALT, fontSize: 11 }),
            cell("Toda la plataforma", { width: 2700, fill: ROW_ALT, fontSize: 11 }),
            cell("Angel + Karen", { width: 2700, fill: ROW_ALT, fontSize: 11 }),
          ]}),
          new TableRow({ children: [
            cell("1er anuncio", { width: 2700, bold: true, fontSize: 11 }),
            cell("~26–27 oct (propuesto)", { width: 2700, fontSize: 11 }),
            cell("Mediateca", { width: 2700, fontSize: 11 }),
            cell("Comunicaciones", { width: 2700, fontSize: 11 }),
          ]}),
        ],
      }),
      spacer(16),

      h1("1. Aprobar el plan y cómo se anuncia"),
      p("Frank aprueba este documento (25 sep). Packs de 3 módulos listos; Comunicaciones publica de a uno."),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [1400, 2600, 6800],
        rows: [
          new TableRow({ children: [headerCell("Etapa", 1400), headerCell("Módulo", 2600), headerCell("Qué pasa", 6800)] }),
          new TableRow({ children: [
            cell("1ª", { width: 1400, bold: true, fill: GREEN_MID, color: WHITE, align: AlignmentType.CENTER }),
            cell("Mediateca", { width: 2600, bold: true, fill: ROW_ALT, fontSize: 11 }),
            cell("1er anuncio (~26–27 oct propuesto, sujeto a Comunicaciones/editor).", { width: 6800, fill: ROW_ALT, fontSize: 11 }),
          ]}),
          new TableRow({ children: [
            cell("2ª", { width: 1400, bold: true, fill: GREEN_MID, color: WHITE, align: AlignmentType.CENTER }),
            cell("Instrumentos", { width: 2600, bold: true, fontSize: 11 }),
            cell("~1–2 semanas después (o cuando Comunicaciones pueda).", { width: 6800, fontSize: 11 }),
          ]}),
          new TableRow({ children: [
            cell("3ª", { width: 1400, bold: true, fill: GREEN_MID, color: WHITE, align: AlignmentType.CENTER }),
            cell("CID", { width: 2600, bold: true, fill: ROW_ALT, fontSize: 11 }),
            cell("Cuando digamos / tras retoque si cambió el módulo.", { width: 6800, fill: ROW_ALT, fontSize: 11 }),
          ]}),
        ],
      }),

      h1("2. Calendario"),
      callout("Lectura", "Hasta 15 oct: firmes en lo posible. Después: propuestas — se confirman con Comunicaciones y el editor.", SOFT_BLUE),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [2300, 4800, 3700],
        rows: [
          new TableRow({ children: [headerCell("Cuándo", 2300), headerCell("Qué", 4800), headerCell("Nota", 3700)] }),
          ...[
            ["Esta semana", "Reunión Comunicaciones: estrategia + plazos.", "Desbloquea fechas reales.", WARN],
            ["25 sep", "Aprobar plan con Frank.", "Firme.", WARN],
            ["28 sep – 2 oct", "QA toda la web (Angel admin / Karen usuaria).", "Flexible: 3–5 días.", WHITE],
            ["5 – 9 oct", "Fixes (sin features nuevas).", "Flexible: más corto o más largo.", ROW_ALT],
            ["10 – 15 oct", "Estabilizar web.", "15 oct DURO (salvo decisión Frank).", WHITE],
            ["~15 – 30 oct", "Producir 3 packs + video general (editor).", "Se alarga/acorta con editor.", SOFT_BLUE],
            ["Al cerrar Mediateca", "Entregar pack Mediateca a Comunicaciones.", "Buffer ~2 sem. típico.", SOFT_BLUE],
            ["~26/27 oct", "1er anuncio Mediateca.", "PROPUESTO — confirmar con Comunicaciones.", SOFT_BLUE],
            ["~2 nov", "Pedir anuncio Instrumentos.", "PROPUESTO.", SOFT_BLUE],
            ["Después", "Pedir anuncio CID.", "PROPUESTO.", SOFT_BLUE],
          ].map((r) => new TableRow({ children: [
            cell(r[0], { width: 2300, bold: true, fill: r[3], fontSize: 10 }),
            cell(r[1], { width: 4800, fill: r[3], fontSize: 10 }),
            cell(r[2], { width: 3700, fill: r[3], fontSize: 10 }),
          ]})),
        ],
      }),

      h2("2.1 Pack por módulo (recomendado)"),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [3200, 2800, 4800],
        rows: [
          new TableRow({ children: [headerCell("Pieza", 3200), headerCell("Cantidad", 2800), headerCell("Para qué", 4800)] }),
          ...[
            ["Video principal del módulo", "1 (45–90 s)", "Post / reel principal"],
            ["Shorts", "3 (15–30 s)", "Historias / reposts de la semana"],
            ["Copy / pie de texto", "1", "Comunicaciones solo publica"],
            ["Stills", "2–3", "Posts estáticos"],
            ["Aviso siguiente módulo", "1 línea", "Teaser"],
          ].map((r, i) => new TableRow({ children: [
            cell(r[0], { width: 3200, bold: true, fill: i % 2 ? ROW_ALT : WHITE, fontSize: 11 }),
            cell(r[1], { width: 2800, fill: i % 2 ? ROW_ALT : WHITE, fontSize: 11 }),
            cell(r[2], { width: 4800, fill: i % 2 ? ROW_ALT : WHITE, fontSize: 11 }),
          ]})),
        ],
      }),
      bullet("Una vez: 1 video general de plataforma. Totales: 1 general + 3 videos módulo + 9 shorts + 3 copies.", "media"),
      bullet("Ajustable si Comunicaciones pide más/menos.", "media"),

      h2("2.2 Pedir estrategia a Comunicaciones"),
      bullet("Canales, ritmo, si 1+3 está bien, días de anticipación, cómo entregar archivos.", "ask"),
      bullet("Ellos proponen estrategia; nosotros entregamos packs listos.", "ask"),

      h1("3. QA"),
      h2("3.1 Roles"),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [2700, 8100],
        rows: [
          new TableRow({ children: [headerCell("Quién", 2700), headerCell("Qué", 8100)] }),
          new TableRow({ children: [
            cell("Angel — admin", { width: 2700, bold: true, fill: WARN, fontSize: 11 }),
            cell("Panel /admin, documentos, solicitudes, seguridad.", { width: 8100, fill: WARN, fontSize: 11 }),
          ]}),
          new TableRow({ children: [
            cell("Karen — usuaria", { width: 2700, bold: true, fill: ROW_ALT, fontSize: 11 }),
            cell("Portal público, claridad, móvil/escritorio.", { width: 8100, fill: ROW_ALT, fontSize: 11 }),
          ]}),
          new TableRow({ children: [
            cell("Tercera persona", { width: 2700, bold: true, fontSize: 11 }),
            cell("Otra mirada.", { width: 8100, fontSize: 11 }),
          ]}),
        ],
      }),
      h2("3.2 Checklist común + por módulo"),
      bullet("Velocidad; textos/imágenes/botones; coherencia; enlaces/seguridad; móvil/escritorio", "checks"),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [2200, 3800, 3200, 1600],
        rows: [
          new TableRow({ children: [
            headerCell("Módulo", 2200), headerCell("Admin", 3800), headerCell("Usuaria", 3200), headerCell("Mirada", 1600),
          ]}),
          ...moduleRows.map((r, i) => new TableRow({ children: [
            cell("☐ " + r[0], { width: 2200, bold: true, fill: i % 2 ? ROW_ALT : WHITE, fontSize: 9 }),
            cell(r[1], { width: 3800, fill: i % 2 ? ROW_ALT : WHITE, fontSize: 9 }),
            cell(r[2], { width: 3200, fill: i % 2 ? ROW_ALT : WHITE, fontSize: 9 }),
            cell(r[3], { width: 1600, fill: i % 2 ? ROW_ALT : WHITE, fontSize: 9, align: AlignmentType.CENTER, bold: true }),
          ]})),
        ],
      }),
      p("Regla: anotar y corregir lo existente (5–15 oct). PROHIBIDO features nuevas.", { size: 12 }),

      h1("4. Packs — qué se entrega a Comunicaciones"),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [2400, 4200, 4200],
        rows: [
          new TableRow({ children: [headerCell("Pack", 2400), headerCell("Contiene", 4200), headerCell("Cuándo se pide publicar", 4200)] }),
          ...[
            ["General", "1 video recorrido", "Con 1er anuncio"],
            ["Mediateca", "1 video + 3 shorts + copy + stills", "PRIMERO"],
            ["Instrumentos", "1 video + 3 shorts + copy + stills", "Cuando digamos"],
            ["CID", "1 video + 3 shorts + copy + stills", "Cuando digamos / tras retoque"],
          ].map((r, i) => new TableRow({ children: [
            cell(r[0], { width: 2400, bold: true, fill: i % 2 ? ROW_ALT : WHITE, fontSize: 11 }),
            cell(r[1], { width: 4200, fill: i % 2 ? ROW_ALT : WHITE, fontSize: 11 }),
            cell(r[2], { width: 4200, fill: i % 2 ? ROW_ALT : WHITE, fontSize: 11 }),
          ]})),
        ],
      }),

      h1("5. Responsabilidades"),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [2600, 8200],
        rows: [
          new TableRow({ children: [headerCell("Persona", 2600), headerCell("Rol", 8200)] }),
          new TableRow({ children: [
            cell("Angel", { width: 2600, bold: true, fontSize: 11 }),
            cell("Plan · QA admin · fixes · web ≤15 · grabar · confirmar editor/presupuesto · entregar packs.", { width: 8200, fontSize: 11 }),
          ]}),
          new TableRow({ children: [
            cell("Karen", { width: 2600, bold: true, fill: ROW_ALT, fontSize: 11 }),
            cell("Agendar Frank + Comunicaciones · pedir estrategia · QA usuaria · guiones/copy · OK de packs.", { width: 8200, fill: ROW_ALT, fontSize: 11 }),
          ]}),
          new TableRow({ children: [
            cell("Comunicaciones", { width: 2600, bold: true, fontSize: 11 }),
            cell("Proponer estrategia; confirmar plazos; publicar pack indicado (uno a la vez).", { width: 8200, fontSize: 11 }),
          ]}),
          new TableRow({ children: [
            cell("Editor", { width: 2600, bold: true, fill: ROW_ALT, fontSize: 11 }),
            cell("Editar packs; avisar si se atrasa para mover fechas propuestas.", { width: 8200, fill: ROW_ALT, fontSize: 11 }),
          ]}),
          new TableRow({ children: [
            cell("Frank", { width: 2600, bold: true, fontSize: 11 }),
            cell("Aprobar este plan (25 sep); decidir si se mueve el 15 oct u otras fechas duras.", { width: 8200, fontSize: 11 }),
          ]}),
        ],
      }),

      h1("6. Resumen"),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [1800, 1800, 1800, 1800, 1800, 1800],
        rows: [new TableRow({ children: [
          timelineCell("sep", "Aprobar + Coms", GREEN_DARK),
          timelineCell("QA/fixes", "Flexible", GREEN_MID),
          timelineCell("15 oct", "Web DURO", OCRE),
          timelineCell("15–30", "Editor: 3 packs", "8B7355"),
          timelineCell("1er anuncio", "Mediateca", GREEN_MID),
          timelineCell("Luego", "Instr. → CID", GREEN_DARK),
        ]})],
      }),
      spacer(16),
      bullet("Aprobar plan → web 15 oct → 3 packs (1+3) → Comunicaciones publica de a uno.", "steps"),
      bullet("Fechas post-15: propuestas hasta confirmar con Comunicaciones y editor.", "steps"),
      spacer(12),
      callout("Para Frank", "Aprobar plan el 25 sep. 15 oct = web estable. Multimedia: 3 packs listos; anuncio por etapas. Comunicaciones define estrategia.", CREAM),
      spacer(12),
      p("Referencia: https://fathom.video/calls/829928151 (19 sep 2026).", { size: 10, color: MUTED, italics: true }),
    ],
  }],
});

const out = path.join("docs", "final-formats", "plan-lanzamiento-pruebas-contenido-palenke-oct2026.docx");
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(out, buf);
  console.log("Wrote", out);
});