/** Fondo territorial compartido: lo aplica el padre (p. ej. ScitaPageContent, ScitaDashboardHero). */
export const SCITA_TERRITORIAL_SURFACE_CLASS =
  "border-b border-emerald-950/50 bg-gradient-to-b from-[#070f0c] via-[#0c1a12] to-[#0a1610]";

/** Runway bajo el bloque fijo (scroll) — mismo tono que el degradado inferior del hero. */
export const SCITA_RUNWAY_SCROLL_CLASS =
  "bg-gradient-to-b from-[#0a1610] via-[#0c1a12] to-[#080f0d]";

/** Bullets para “¿Qué hace el SCITA?” — compartidas entre modo sección y capa pegajosa */
export function getScitaMarketingBullets() {
  return [
    "Generar información territorial propia para la toma de decisiones.",
    "Monitorear ecosistemas, cobertura boscosa y dinámicas territoriales.",
    "Identificar amenazas ambientales y territoriales desde el campo.",
    "Fortalecer el control comunitario del territorio con soberanía de información.",
    "Articular información para incidencia política a nivel nacional e internacional.",
  ];
}

/** Fondo decorativo (sin pointer-events). */
export function ScitaMarketingBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="absolute -left-[25%] -top-[30%] h-[min(90vw,720px)] w-[min(90vw,720px)] rounded-full bg-[#1b5e20]/35 blur-[100px]" />
      <div className="absolute -right-[20%] top-[10%] h-[min(85vw,640px)] w-[min(85vw,640px)] rounded-full bg-[#2e7d32]/25 blur-[110px]" />
      <div className="absolute bottom-[-20%] left-[30%] h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-[130px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(74,222,128,0.08),transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <svg className="absolute -left-24 top-1/4 h-[420px] w-[420px] rotate-[-8deg] text-[#4ade80]/[0.14]" viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
        <path d="M 40 200 Q 120 80 200 200 T 360 200" />
        <path d="M 40 240 Q 120 120 200 240 T 360 240" />
        <path d="M 40 280 Q 120 160 200 280 T 360 280" />
        <circle cx="200" cy="200" r="120" strokeWidth="3" strokeDasharray="14 18" opacity="0.8" />
        <circle cx="200" cy="200" r="180" strokeWidth="2" opacity="0.6" />
      </svg>

      <svg className="absolute -right-16 bottom-0 h-[380px] w-[380px] text-[#86efac]/[0.12]" viewBox="0 0 300 300" fill="currentColor">
        <path opacity="0.5" d="M280 20 L260 120 L180 80 L140 160 L60 100 L20 200 L100 280 L220 260 L280 20Z" />
        <path opacity="0.35" d="M240 200 L200 240 L160 200 L200 140 Z" />
      </svg>

      <svg className="absolute left-[8%] top-[12%] h-32 w-32 text-white/[0.06]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M10 50 L50 15 L90 50 L50 85 Z" />
        <circle cx="50" cy="50" r="28" strokeDasharray="4 6" />
      </svg>
      <svg className="absolute right-[12%] bottom-[18%] h-40 w-40 text-[#bbf7d0]/[0.08]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M20 80 L35 25 L80 40 L55 90 Z" />
        <path d="M50 10 L65 45 L95 55 L70 85 L30 75 Z" opacity="0.7" />
      </svg>
    </div>
  );
}

function GraphicPanel({ filterSvgId }: { filterSvgId: string }) {
  return (
    <div
      className="relative min-h-[380px] overflow-hidden rounded-[32px] border border-white/15 bg-black/20 shadow-2xl shadow-black/40 backdrop-blur-[2px] sm:min-h-[440px] lg:min-h-[min(58vh,720px)] xl:min-h-[min(62vh,780px)]"
      style={{
        background:
          "radial-gradient(ellipse at 25% 75%, rgba(46,125,50,0.5), transparent 55%), radial-gradient(ellipse at 75% 25%, rgba(21,101,192,0.32), transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(251,192,45,0.1), transparent 70%), linear-gradient(155deg, rgba(13,31,20,0.92) 0%, rgba(21,42,31,0.88) 45%, rgba(15,39,40,0.9) 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)
                `,
          backgroundSize: "56px 56px",
        }}
        aria-hidden
      />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <filter id={filterSvgId}>
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>
        <circle cx="120" cy="280" r="90" fill="#2e7d32" opacity="0.22" filter={`url(#${filterSvgId})`} />
        <circle cx="480" cy="100" r="110" fill="#1565c0" opacity="0.18" filter={`url(#${filterSvgId})`} />
        <circle cx="400" cy="300" r="70" fill="#fbc02d" opacity="0.14" filter={`url(#${filterSvgId})`} />

        <polygon
          points="80,100 180,70 220,160 140,200 60,170"
          fill="#2e7d32"
          opacity="0.35"
          stroke="white"
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />
        <polygon
          points="260,120 400,95 440,210 320,250 240,200"
          fill="#1565c0"
          opacity="0.3"
          stroke="white"
          strokeWidth="0.5"
          strokeOpacity="0.25"
        />
        <polygon
          points="320,240 500,220 540,340 380,360 300,300"
          fill="#2e7d32"
          opacity="0.25"
          stroke="white"
          strokeWidth="0.5"
          strokeOpacity="0.2"
        />
        <polygon
          points="140,220 240,200 270,290 190,320 110,280"
          fill="#f57f17"
          opacity="0.2"
          stroke="white"
          strokeWidth="0.5"
          strokeOpacity="0.2"
        />
        <polygon
          points="430,238 500,226 526,278 470,306 416,278"
          fill="#d32f2f"
          opacity="0.28"
          stroke="#fecaca"
          strokeWidth="0.8"
          strokeOpacity="0.55"
        />

        <path
          d="M40,360 Q140,280 220,200 Q320,120 420,140 Q500,155 580,90"
          stroke="white"
          strokeWidth="1.2"
          fill="none"
          opacity="0.35"
          strokeDasharray="6 10"
        />
        <path d="M0,250 Q100,230 200,245 Q300,260 400,235 Q500,210 600,240" stroke="white" strokeWidth="0.8" fill="none" opacity="0.25" />
        <path
          d="M120,308 Q190,248 258,216 Q326,186 406,194 Q476,200 548,158"
          stroke="rgba(255,255,255,0.52)"
          strokeWidth="2.2"
          fill="none"
          strokeDasharray="10 14"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-140" dur="8s" repeatCount="indefinite" />
        </path>

        <g>
          <circle cx="200" cy="200" r="5" fill="white" opacity="0.95" />
          <rect x="212" y="188" width="118" height="26" rx="13" fill="white" opacity="0.92" />
          <text x="222" y="205" fill="#1a1a1a" fontSize="11" fontWeight="700">
            CC Alto San Juan
          </text>
        </g>
        <g>
          <circle cx="380" cy="150" r="5" fill="white" opacity="0.95" />
          <rect x="392" y="138" width="100" height="26" rx="13" fill="white" opacity="0.92" />
          <text x="402" y="155" fill="#1a1a1a" fontSize="11" fontWeight="700">
            Cuenca Atrato
          </text>
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute left-[14%] top-[28%] rounded-full border border-white/30 bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#1a1a1a] shadow-lg shadow-black/20"
          style={{ animation: "scita-float-a 6.2s ease-in-out infinite" }}
        >
          Información propia
        </div>
        <div
          className="absolute right-[14%] top-[22%] rounded-full border border-[#bbf7d0]/40 bg-[#1b5e20]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#dcfce7] shadow-lg shadow-black/25"
          style={{ animation: "scita-float-b 5.6s ease-in-out infinite 0.4s" }}
        >
          Monitoreo ecosistemas
        </div>
        <div
          className="absolute left-[18%] bottom-[24%] rounded-full border border-[#fecaca]/50 bg-[#7f1d1d]/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#fee2e2] shadow-lg shadow-black/30"
          style={{ animation: "scita-float-c 5.1s ease-in-out infinite 0.2s" }}
        >
          Amenaza detectada
        </div>
        <div
          className="absolute right-[20%] bottom-[26%] rounded-full border border-[#86efac]/45 bg-[#14532d]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#dcfce7] shadow-lg shadow-black/25"
          style={{ animation: "scita-float-a 5.9s ease-in-out infinite 0.7s" }}
        >
          Control comunitario
        </div>
        <div
          className="absolute left-[42%] bottom-[14%] rounded-full border border-[#93c5fd]/50 bg-[#1e3a8a]/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#dbeafe] shadow-lg shadow-black/25"
          style={{ animation: "scita-float-b 6.4s ease-in-out infinite 0.1s" }}
        >
          Incidencia nacional
        </div>

        <div
          className="absolute left-[31%] top-[48%] h-3 w-3 rounded-full bg-[#4ade80] shadow-[0_0_0_6px_rgba(74,222,128,0.24)]"
          style={{ animation: "scita-beacon 2.1s ease-in-out infinite" }}
        />
        <div
          className="absolute right-[30%] top-[40%] h-3 w-3 rounded-full bg-[#60a5fa] shadow-[0_0_0_6px_rgba(96,165,250,0.22)]"
          style={{ animation: "scita-beacon 1.9s ease-in-out infinite 0.5s" }}
        />
        <div
          className="absolute right-[18%] bottom-[31%] h-3 w-3 rounded-full bg-[#ef4444] shadow-[0_0_0_6px_rgba(239,68,68,0.22)]"
          style={{ animation: "scita-beacon 1.6s ease-in-out infinite 0.2s" }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-8 text-center sm:p-10">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm sm:h-[4.5rem] sm:w-[4.5rem]">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white/90 sm:h-7 sm:w-7" aria-hidden>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              stroke="currentColor"
              strokeWidth="1.25"
              fill="currentColor"
              fillOpacity="0.15"
            />
          </svg>
        </div>
        <p className="max-w-[16rem] text-xs font-semibold uppercase leading-snug tracking-[0.2em] text-white/85 sm:text-[13px]">
          ¿Qué es el SCITA?
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-5 right-5 rounded-lg bg-black/55 px-2.5 py-1.5 text-[11px] font-semibold tabular-nums text-white/80 backdrop-blur-sm sm:bottom-6 sm:right-6">
        Territorio en datos
      </div>

      <style jsx>{`
        @keyframes scita-float-a {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -8px, 0);
          }
        }
        @keyframes scita-float-b {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(7px, -6px, 0);
          }
        }
        @keyframes scita-float-c {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-7px, -5px, 0);
          }
        }
        @keyframes scita-beacon {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.22);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

/** Bloque derecho solo texto (marketing). headingId para aria-labelledby desde la section. */
function CopyColumn({
  bullets,
  headingId = "scita-hero-heading",
}: {
  bullets: readonly string[];
  headingId?: string;
}) {
  return (
    <div className="lg:py-2">
      <h2
        id={headingId}
        className="font-display text-3xl text-white sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-5xl lg:leading-[1.12]"
      >
        ¿Qué hace el SCITA?
      </h2>
      <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 sm:mt-7 sm:text-lg sm:leading-8 lg:text-[1.125rem] lg:leading-9">
        El SCITA es la infraestructura de información territorial del Palenke. Integra datos geoespaciales, alertas
        ambientales y monitoreo comunitario en una sola plataforma — para que las comunidades produzcan, gestionen y
        protejan información sobre su propio territorio.
      </p>
      <ul className="mt-10 space-y-5 sm:mt-12 sm:space-y-5">
        {bullets.map((line) => (
          <li
            key={line}
            className="flex items-start gap-4 text-sm leading-7 text-white/80 sm:text-base sm:leading-8 lg:text-[1.05rem] lg:leading-8"
          >
            <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#4ade80] sm:mt-3" aria-hidden />
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Solo contenido (grid gráfico + copy). Fondo degradado, borde y ScitaMarketingBackdrop los pinta el padre
 * — evita “dos secciones” con estilos duplicados entre hero y página SCITA.
 */
type ScitaMarketingHeroProps = {
  filterSvgId: string;
  /** `fill`: ocupa la ventana pegajosa (useScroll). `page`: bloque hero en página completa (p. ej. reduced motion). */
  variant: "fill" | "page";
};

export function ScitaMarketingHero({ variant, filterSvgId }: ScitaMarketingHeroProps) {
  const bullets = getScitaMarketingBullets();

  const innerGrid = (
    <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
      <GraphicPanel filterSvgId={filterSvgId} />
      <CopyColumn bullets={bullets} />
    </div>
  );

  const paddedPage = (
    <div className="relative z-10 mx-auto flex min-h-[60vh] max-w-[1800px] flex-col justify-center px-4 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
      {innerGrid}
    </div>
  );

  const paddedFill = (
    <div className="relative z-10 mx-auto flex min-h-full w-full max-w-[1800px] flex-col justify-center px-4 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
      {innerGrid}
    </div>
  );

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col">{variant === "page" ? paddedPage : paddedFill}</div>
  );
}
