"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BookPreviewLightbox } from "@/components/palenke/BookPreviewLightbox";

const EN_ALIANZA = [
  { name: "RRI", src: "/brands/RRI.png" },
  { name: "TTF", src: "/brands/TTF.png" },
  { name: "Tenure Facility", src: "/brands/Tenure-Facility.png", wide: true },
  { name: "ILC", src: "/brands/ILC.png" },
] as const;

type OrientationNetworkSectionProps = {
  variant?: "light" | "dark";
  /** SCITA: only “Red de orientación y apoyo”, without Gobierno Propio subheading/copy */
  introVariant?: "full" | "title-only";
  className?: string;
};

export function OrientationNetworkSection({
  variant = "light",
  introVariant = "full",
  className = "",
}: OrientationNetworkSectionProps) {
  const isDark = variant === "dark";
  const titleOnly = introVariant === "title-only";

  return (
    <section
      className={
        isDark
          ? `border-t border-white/10 bg-[#080f0d] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28 ${className}`
          : `border-t border-[#e8dfd3] bg-[#FDFBF7] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28 ${className}`
      }
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-2xl sm:mb-10">
          {titleOnly ? (
            <h2
              className={
                isDark
                  ? "font-display text-3xl text-white sm:text-4xl"
                  : "font-display text-3xl text-[#1a1a1a] sm:text-4xl"
              }
            >
              Red de orientación y apoyo
            </h2>
          ) : (
            <>
              <p
                className={
                  isDark
                    ? "text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/70"
                    : "text-xs font-semibold uppercase tracking-[0.18em] text-[#7a6f63]"
                }
              >
                Red de orientación y apoyo
              </p>
              <h2
                className={
                  isDark
                    ? "mt-3 font-display text-3xl text-white sm:text-4xl"
                    : "mt-3 font-display text-3xl text-[#1a1a1a] sm:text-4xl"
                }
              >
                Construcción colectiva del Gobierno Propio
              </h2>
              <p
                className={
                  isDark
                    ? "mt-3 text-base leading-relaxed text-white/70"
                    : "mt-3 text-base leading-relaxed text-[#4a4540]"
                }
              >
                Visibilizamos la organización orientadora y las alianzas que fortalecen este proceso
                comunitario.
              </p>
            </>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-6 lg:grid-cols-2 lg:gap-8 lg:items-stretch"
        >
          {/* Orientado por — feature card */}
          <article
            className={
              isDark
                ? "flex min-h-[420px] flex-col rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#163325] to-[#0f2219] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)] sm:min-h-[460px] sm:p-8"
                : "flex min-h-[420px] flex-col rounded-3xl border border-[#c8e6c9] bg-[#E8F5E9] p-6 shadow-[0_12px_40px_rgba(46,125,50,0.12)] sm:min-h-[460px] sm:p-8"
            }
          >
            <p
              className={
                isDark
                  ? "text-xs font-bold uppercase tracking-[0.2em] text-emerald-300"
                  : "text-xs font-bold uppercase tracking-[0.2em] text-[#2e7d32]"
              }
            >
              Orientado por
            </p>
            <p
              className={
                isDark
                  ? "mt-1 text-sm font-medium text-emerald-100/80"
                  : "mt-1 text-sm font-medium text-[#3f5343]"
              }
            >
              Proceso de Comunidades Negras (PCN)
            </p>

            <div className="mt-6 flex flex-1 flex-col">
              <div className="flex flex-1 items-center justify-center rounded-2xl border border-[#e0e0e0]/80 bg-white p-6 shadow-sm sm:p-8">
                <Image
                  src="/assets/logo.svg"
                  alt="Logo de Proceso de Comunidades Negras (PCN)"
                  width={240}
                  height={120}
                  className="max-h-[120px] w-auto max-w-full object-contain sm:max-h-[140px]"
                />
              </div>

              <h3
                className={
                  isDark
                    ? "mt-6 text-xl font-semibold leading-snug text-white sm:text-2xl"
                    : "mt-6 text-xl font-semibold leading-snug text-[#1a1a1a] sm:text-2xl"
                }
              >
                Proceso de Comunidades Negras (PCN)
              </h3>

              <div className="mt-4">
                <BookPreviewLightbox
                  src="/assets/logo.svg"
                  alt="Logo de Proceso de Comunidades Negras (PCN)"
                  buttonClassName={
                    isDark
                      ? "inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
                      : "inline-flex items-center gap-1.5 text-sm font-medium text-[#2e7d32] transition hover:text-[#1b5e20]"
                  }
                />
              </div>
            </div>
          </article>

          {/* En alianza con — 2×2 grid */}
          <div className="flex flex-col">
            <div className="mb-5 lg:mb-6">
              <h3
                className={
                  isDark
                    ? "text-sm font-bold uppercase tracking-[0.2em] text-sky-400"
                    : "text-sm font-bold uppercase tracking-[0.2em] text-[#1565C0]"
                }
              >
                En alianza con
              </h3>
              <p
                className={
                  isDark
                    ? "mt-2 max-w-md text-sm leading-relaxed text-white/60"
                    : "mt-2 max-w-md text-sm leading-relaxed text-[#4a4540]"
                }
              >
                Organizaciones aliadas que acompañan el fortalecimiento del proceso territorial.
              </p>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-4 sm:gap-5">
              {EN_ALIANZA.map((brand, index) => {
                const isWide = "wide" in brand && brand.wide;
                return (
                  <motion.article
                    key={brand.name}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: 0.08 + index * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={
                      isDark
                        ? "flex min-h-[140px] items-center justify-center rounded-2xl border border-white/10 bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.28)] sm:min-h-[160px] sm:p-6"
                        : "flex min-h-[140px] items-center justify-center rounded-2xl border border-[#ececec] bg-white p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)] sm:min-h-[160px] sm:p-6"
                    }
                  >
                    <Image
                      src={brand.src}
                      alt={`Logo de ${brand.name}`}
                      width={isWide ? 160 : 120}
                      height={64}
                      className="max-h-[72px] w-auto max-w-[90%] object-contain sm:max-h-[80px]"
                    />
                    <span className="sr-only">{brand.name}</span>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
