"use client";

type LayerMeta = {
  id: MapLayerId;
  label: string;
  hint: string;
  color: string;
};

export type MapLayerId = "acc" | "forest" | "water";

export const MAP_LAYER_OPTIONS: LayerMeta[] = [
  {
    id: "acc",
    label: "Consejos comunitarios",
    hint: "Linderos y presencia territorial priorizada",
    color: "#2e7d32",
  },
  {
    id: "forest",
    label: "Cobertura boscosa",
    hint: "Índice agregado de conservación del bosque",
    color: "#1b5e20",
  },
  {
    id: "water",
    label: "Ríos y cuencas",
    hint: "Sistema hídrico principal para lectura territorial",
    color: "#1565c0",
  },
];

interface ScitaTerritorialMapCanvasProps {
  isFullScreen: boolean;
  activeLayers: MapLayerId[];
}

export function ScitaTerritorialMapCanvas({ isFullScreen, activeLayers }: ScitaTerritorialMapCanvasProps) {
  const activeLayerMeta = MAP_LAYER_OPTIONS.filter((layer) => activeLayers.includes(layer.id));

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-[#dfe8d5]">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(46,125,50,0.22), transparent 38%), radial-gradient(circle at 75% 30%, rgba(21,101,192,0.2), transparent 36%), radial-gradient(circle at 45% 72%, rgba(27,94,32,0.18), transparent 40%)",
        }}
        aria-hidden
      />

      <div className="absolute inset-0" aria-hidden>
        <svg className="h-full w-full opacity-70" viewBox="0 0 1200 700" preserveAspectRatio="none">
          <path d="M40 520 C 180 420, 300 410, 430 450 S 680 540, 820 500 S 1080 420, 1180 470" fill="none" stroke="#1565c0" strokeWidth="5" />
          <path d="M60 580 C 200 520, 300 545, 460 600 S 720 650, 930 620 S 1120 560, 1180 585" fill="none" stroke="#1e88e5" strokeWidth="3" />
          <path d="M120 130 L380 90 L550 190 L760 170 L980 260 L860 410 L620 380 L410 460 L190 390 Z" fill="rgba(27,94,32,0.18)" stroke="rgba(27,94,32,0.55)" strokeWidth="3" />
          <circle cx="430" cy="320" r="12" fill="#2e7d32" />
          <circle cx="700" cy="290" r="10" fill="#2e7d32" />
          <circle cx="560" cy="430" r="9" fill="#2e7d32" />
        </svg>
      </div>

      <div className="absolute left-3 top-3 max-w-[min(86vw,22rem)] rounded-xl border border-[#d7d0c5] bg-white/95 p-3 shadow-sm sm:left-4 sm:top-4 sm:p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a756e]">GeoVisor SCITA</p>
        <p className="mt-1 text-xs leading-relaxed text-[#4a4540]">
          Prototipo visual para capas priorizadas del territorio colectivo.
        </p>
        <p className="mt-2 text-[11px] font-semibold text-[#1a1a1a]">
          {activeLayerMeta.length > 0 ? `${activeLayerMeta.length} capas activas` : "No hay capas activas"}
        </p>
      </div>

      <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-[#d7d0c5] bg-white/95 p-3 shadow-sm sm:bottom-4 sm:left-4 sm:right-auto sm:w-[22rem] sm:p-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a756e]">Leyenda</p>
        <ul className="space-y-1.5">
          {MAP_LAYER_OPTIONS.map((layer) => {
            const active = activeLayers.includes(layer.id);
            return (
              <li key={layer.id} className="flex items-start gap-2">
                <span
                  className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: layer.color, opacity: active ? 1 : 0.35 }}
                  aria-hidden
                />
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold leading-snug text-[#1a1a1a]">
                    {layer.label}
                  </span>
                  <span className="block text-[10px] leading-tight text-[#7a756e]">{layer.hint}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="absolute right-3 top-3 rounded-lg bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white sm:right-4 sm:top-4">
        {isFullScreen ? "Pantalla completa" : "Vista integrada"}
      </div>
    </div>
  );
}
