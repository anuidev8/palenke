export default function Loading() {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-[#141210]">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 100% 70% at 0% 15%, rgba(211,47,47,0.38), transparent 52%), radial-gradient(ellipse 90% 60% at 100% 10%, rgba(251,192,45,0.28), transparent 48%), radial-gradient(ellipse 110% 85% at 50% 100%, rgba(46,125,50,0.35), transparent 55%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <h1 className="font-display text-[clamp(3.25rem,14vw,9rem)] font-semibold leading-[0.95] tracking-tight text-white">
          Palenke
        </h1>
        <p className="mt-6 max-w-md text-xs font-semibold uppercase tracking-[0.28em] text-[#fbc02d]/80 sm:text-sm">
          Pensamiento y Territorio
        </p>
        <div className="mt-8 h-1 w-[min(14rem,55vw)] overflow-hidden rounded-full bg-black/35">
          <div className="h-full w-full animate-pulse bg-[linear-gradient(90deg,#2e7d32_0%,#2e7d32_33.33%,#fbc02d_33.33%,#fbc02d_66.66%,#d32f2f_66.66%,#d32f2f_100%)]" />
        </div>
      </div>
    </div>
  );
}
