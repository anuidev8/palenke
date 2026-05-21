export type ScitaReport = {
  id: string;
  categoria: "hidrica" | "deforestacion" | "mineria" | "fauna" | "otro";
  formato: "texto" | "imagen" | "voz";
  descripcion: string;
  nombre?: string | null;
  contacto?: string | null;
  tablero_origen?: string | null;
  created_at: string;
};

// Global container to preserve state across hot-reloads in Next.js development
declare global {
  var __scita_reports_store: ScitaReport[] | undefined;
}

const INITIAL_MOCK_REPORTS: ScitaReport[] = [
  {
    id: "mock-report-1",
    categoria: "deforestacion",
    formato: "imagen",
    descripcion: "Tala no autorizada detectada en la zona de reserva forestal comunitaria cerca de la cabecera del río. Alrededor de 2 hectáreas afectadas.",
    nombre: "Rosa Mena",
    contacto: "+57 312 456 7890",
    tablero_origen: "conservacion",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "mock-report-2",
    categoria: "hidrica",
    formato: "texto",
    descripcion: "Vertimiento de aguas residuales con coloración oscura y fuerte olor químico directo a la quebrada comunitaria, afectando el acueducto local.",
    nombre: "Anónimo",
    contacto: null,
    tablero_origen: "gobierno",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: "mock-report-3",
    categoria: "mineria",
    formato: "imagen",
    descripcion: "Avistamiento de maquinaria pesada (retroexcavadora) y dragas operando ilegalmente en el lecho del río. Hay presencia de sedimentos flotantes.",
    nombre: "Carlos Caicedo",
    contacto: "carlos.c@pcn.org",
    tablero_origen: "titulacion",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
  {
    id: "mock-report-4",
    categoria: "fauna",
    formato: "voz",
    descripcion: "Nota de voz alertando sobre cazadores furtivos capturando aves silvestres protegidas (loros y guacamayas) en el sendero del bosque primario.",
    nombre: "Anónimo",
    contacto: null,
    tablero_origen: "conservacion",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
  },
  {
    id: "mock-report-5",
    categoria: "otro",
    formato: "texto",
    descripcion: "Quema descontrolada de pastizales y rastrojos en predios colindantes con el territorio colectivo, el humo está afectando la escuela local.",
    nombre: "Marlon Estupiñán",
    contacto: "+57 320 987 6543",
    tablero_origen: "gobierno",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
  },
  {
    id: "mock-report-6",
    categoria: "deforestacion",
    formato: "texto",
    descripcion: "Pérdida paulatina de cobertura boscosa por ampliación ilegal de linderos ganaderos en la frontera sur del consejo comunitario.",
    nombre: "Anónimo",
    contacto: null,
    tablero_origen: "conservacion",
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
  },
  {
    id: "mock-report-7",
    categoria: "hidrica",
    formato: "voz",
    descripcion: "Disminución súbita y alarmante del caudal de la microcuenca abastecedora del corregimiento, sospechamos de desvío de cauce río arriba.",
    nombre: "Elena Riascos",
    contacto: "+57 315 222 3344",
    tablero_origen: "gobierno",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  }
];

if (!globalThis.__scita_reports_store) {
  globalThis.__scita_reports_store = [...INITIAL_MOCK_REPORTS];
}

export function getMockReports(): ScitaReport[] {
  return globalThis.__scita_reports_store || INITIAL_MOCK_REPORTS;
}

export function addMockReport(report: Omit<ScitaReport, "id" | "created_at">): ScitaReport {
  const newReport: ScitaReport = {
    ...report,
    id: `mock-report-${Math.random().toString(36).substring(2, 9)}`,
    created_at: new Date().toISOString(),
  };
  globalThis.__scita_reports_store = [newReport, ...(globalThis.__scita_reports_store || [])];
  return newReport;
}
