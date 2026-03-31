export const RUTAS_METODOLOGICAS_INSTRUMENTS = [
  {
    instrument: "reglamentos",
    label: "Reglamentos internos",
    defaultTitle: "Documento Base Metodológico - Reglamentos Internos",
  },
  {
    instrument: "planes-uso",
    label: "Planes de uso y manejo",
    defaultTitle: "Documento Base Metodológico - Planes de Uso y Manejo",
  },
  {
    instrument: "etnodesarrollo",
    label: "Etnodesarrollo",
    defaultTitle: "Documento Base Metodológico - Etnodesarrollo",
  },
  {
    instrument: "conservacion",
    label: "Áreas bioculturales de conservación",
    defaultTitle: "Documento Base Metodológico - Áreas Bioculturales de Conservación",
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
