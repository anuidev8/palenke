export const RUTAS_METODOLOGICAS_INSTRUMENTS = [
  {
    instrument: "reglamentos",
    label: "Reglamentos internos",
    defaultTitle: "Documento Base Metodológico - Reglamentos Internos",
    storageFileName: "ruta-metodologica-reglamentos.pdf",
  },
  {
    instrument: "planes-uso",
    label: "Planes de uso y manejo",
    defaultTitle: "Documento Base Metodológico - Planes de Uso y Manejo",
    storageFileName: "ruta-metodologica-planes-uso.pdf",
  },
  {
    instrument: "etnodesarrollo",
    label: "Etnodesarrollo",
    defaultTitle: "Documento Base Metodológico - Etnodesarrollo",
    storageFileName: "ruta-metodologica-etnodesarrollo.pdf",
  },
  {
    instrument: "conservacion",
    label: "Áreas bioculturales de conservación",
    defaultTitle: "Documento Base Metodológico - Áreas Bioculturales de Conservación",
    storageFileName: "ruta-metodologica-conservacion.pdf",
  },
] as const;

export type RutaMetodologicaInstrument = (typeof RUTAS_METODOLOGICAS_INSTRUMENTS)[number]["instrument"];

export function isRutaMetodologicaInstrument(value: string): value is RutaMetodologicaInstrument {
  return RUTAS_METODOLOGICAS_INSTRUMENTS.some((item) => item.instrument === value);
}

export function getRutaMetodologicaTitleForInstrument(instrument: RutaMetodologicaInstrument) {
  return (
    RUTAS_METODOLOGICAS_INSTRUMENTS.find((item) => item.instrument === instrument)?.defaultTitle ??
    "Documento Base Metodológico"
  );
}

export function getRutaMetodologicaStoragePath(instrument: RutaMetodologicaInstrument) {
  const fileName =
    RUTAS_METODOLOGICAS_INSTRUMENTS.find((item) => item.instrument === instrument)?.storageFileName ??
    "ruta-metodologica.pdf";
  return `${instrument}/${fileName}`;
}
