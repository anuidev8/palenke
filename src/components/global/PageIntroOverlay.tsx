"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const easeOut = [0.22, 1, 0.36, 1] as const;
const easeInDown = [0.45, 0, 0.55, 1] as const;

export type PageIntroOverlayProps = {
  children: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Fase 1: revelación del título, subtítulo y línea (s). @default 3 */
  revealDurationSec?: number;
  /** Fase 2: el bloque baja y desaparece con la línea (s). @default 0.65 */
  titleSinkDurationSec?: number;
  /** Fase 3: fade-out del overlay completo (s). @default 0.85 */
  overlayFadeDurationSec?: number;
  /** Usado sobre todo para la textura de puntos; el lienzo fullscreen es opaco desde el primer frame. @default 0.45 */
  backdropFadeInSec?: number;
  sessionStorageKey?: string;
  overlayClassName?: string;
  contentWrapperClassName?: string;
  titleClassName?: string;
  titleFontSize?: string;
  titleStyle?: CSSProperties;
  subtitleClassName?: string;
  showAccentLine?: boolean;
  accentLineClassName?: string;
  showDotGrid?: boolean;
  dotGridOpacity?: number;
  /** Passed to dot grid layer `backgroundImage`. @default emerald-tint radial dots */
  dotGridBackgroundImage?: string;
  /** Seconds to wait after overlay opens before fading in the dot grid (after title/backdrop). @default 2 */
  dotGridDelaySec?: number;
  zIndexClass?: string;
  onDismiss?: () => void;
  respectReducedMotion?: boolean;
};

const DEFAULT_OVERLAY =
  "bg-gradient-to-b from-[#070f0c] via-[#0c1a12] to-[#0a1610]";

const DEFAULT_DOT_GRID_BG =
  "radial-gradient(rgba(74,222,128,0.12) 1px, transparent 1px)";

type Stage = "reveal" | "sink" | "fade";

export function PageIntroOverlay({
  children,
  title,
  subtitle,
  revealDurationSec = 3,
  titleSinkDurationSec = 0.65,
  overlayFadeDurationSec = 0.85,
  backdropFadeInSec = 0.45,
  sessionStorageKey,
  overlayClassName = DEFAULT_OVERLAY,
  contentWrapperClassName = "relative z-10 flex flex-col items-center px-6 text-center",
  titleClassName = "font-display font-semibold tracking-tight text-white",
  titleFontSize = "clamp(3.25rem, 14vw, 9rem)",
  titleStyle,
  subtitleClassName = "mt-6 max-w-md text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200/75 sm:text-sm",
  showAccentLine = true,
  accentLineClassName = "mt-8 h-px w-[min(12rem,40vw)] origin-center bg-gradient-to-r from-transparent via-[#4ade80]/60 to-transparent",
  showDotGrid = true,
  dotGridOpacity = 0.2,
  dotGridBackgroundImage = DEFAULT_DOT_GRID_BG,
  dotGridDelaySec = 2,
  /** Keep above sticky headers (~50) and in-app fullscreen overlays (e.g. z-[999]). */
  zIndexClass = "z-[10000]",
  onDismiss,
  respectReducedMotion = true,
}: PageIntroOverlayProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [stage, setStage] = useState<Stage>("reveal");
  const skippedRef = useRef(false);
  const titleId = useId();

  useLayoutEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const seen =
        sessionStorageKey != null && sessionStorage.getItem(sessionStorageKey) === "1";
      const reduceMotion =
        respectReducedMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (seen || reduceMotion) {
        skippedRef.current = true;
        setShowIntro(false);
      }
    } catch {
      /* ignore */
    }
  }, [sessionStorageKey, respectReducedMotion]);

  useEffect(() => {
    if (!showIntro || skippedRef.current) return;
    document.documentElement.style.overflow = "hidden";
    const revealMs = revealDurationSec * 1000;
    const sinkMs = titleSinkDurationSec * 1000;
    const fadeMs = overlayFadeDurationSec * 1000;

    const tSink = window.setTimeout(() => setStage("sink"), revealMs);
    const tFade = window.setTimeout(() => setStage("fade"), revealMs + sinkMs);
    const tDone = window.setTimeout(() => setShowIntro(false), revealMs + sinkMs + fadeMs);

    return () => {
      window.clearTimeout(tSink);
      window.clearTimeout(tFade);
      window.clearTimeout(tDone);
    };
  }, [showIntro, revealDurationSec, titleSinkDurationSec, overlayFadeDurationSec]);

  function handleExitComplete() {
    document.documentElement.style.overflow = "";
    if (sessionStorageKey) {
      try {
        sessionStorage.setItem(sessionStorageKey, "1");
      } catch {
        /* ignore */
      }
    }
    onDismiss?.();
  }

  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  const titleMergedStyle: CSSProperties = {
    fontSize: titleFontSize,
    lineHeight: 0.95,
    ...titleStyle,
  };

  /** Ocultar la página bajo la intro para que no flashée antes de que el overlay sea opaco. */
  const pageVisibleUnderIntro = !showIntro || stage === "fade";

  return (
    <>
      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        {showIntro ? (
          <motion.div
            key="page-intro-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            variants={{
              entering: { opacity: 1 },
              visible: { opacity: 1 },
              fading: {
                opacity: 0,
                transition: { duration: overlayFadeDurationSec, ease: easeOut },
              },
            }}
            initial="entering"
            animate={stage === "fade" ? "fading" : "visible"}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            className={`!fixed inset-0 min-h-0 ${zIndexClass} flex flex-col items-center justify-center ${overlayClassName}`}
          >
            {showDotGrid ? (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 0 }}
                animate={
                  stage === "fade"
                    ? { opacity: 0, transition: { duration: overlayFadeDurationSec * 0.9, ease: easeOut } }
                    : {
                        opacity: dotGridOpacity,
                        transition: {
                          delay: dotGridDelaySec,
                          duration: Math.min(0.65, backdropFadeInSec + 0.25),
                          ease: easeOut,
                        },
                      }
                }
                style={{
                  backgroundImage: dotGridBackgroundImage,
                  backgroundSize: "32px 32px",
                }}
              />
            ) : null}

            <motion.div
              className={contentWrapperClassName}
              initial={{
                opacity: 0,
                y: 52,
                scale: 0.93,
                filter: "blur(12px)",
              }}
              animate={
                stage === "reveal"
                  ? {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: "blur(0px)",
                      transition: { duration: revealDurationSec, ease: easeOut },
                    }
                  : stage === "sink"
                    ? {
                        opacity: 0,
                        y: 140,
                        scale: 0.96,
                        filter: "blur(8px)",
                        transition: { duration: titleSinkDurationSec, ease: easeInDown },
                      }
                    : {
                        opacity: 0,
                        transition: { duration: 0 },
                      }
              }
            >
              <h1 id={titleId} className={titleClassName} style={titleMergedStyle}>
                {title}
              </h1>

              {subtitle != null ? <div className={subtitleClassName}>{subtitle}</div> : null}

              {showAccentLine ? (
                <motion.div
                  initial={{ scaleX: 1, opacity: 1 }}
                  animate={
                    stage === "reveal"
                      ? { scaleX: 1, opacity: 1 }
                      : stage === "sink"
                        ? {
                            scaleX: 0,
                            opacity: 0,
                            y: 12,
                            transition: {
                              duration: titleSinkDurationSec * 0.85,
                              ease: easeInDown,
                            },
                          }
                        : { opacity: 0, scaleX: 0 }
                  }
                  className={`${accentLineClassName} mx-auto`}
                  style={{ transformOrigin: "center center" }}
                />
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div
        className={`relative ${pageVisibleUnderIntro ? "" : "invisible pointer-events-none"}`}
        aria-hidden={pageVisibleUnderIntro ? undefined : true}
      >
        {children}
      </div>
    </>
  );
}
