"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Search, Video, VideoOff, Volume2, VolumeX } from "lucide-react";
import { withRole } from "@/lib/viewer";
import type { ViewerRole } from "@/lib/mock-data";
import { HeroCards } from "@/components/home/HeroCards";
import { ExpandableVideo } from "@/components/home/ExpandableVideo";

const HERO_VIDEO_SRC = "/videos/home-hero-presentacion.mp4";
const HERO_AUDIO_TARGET_VOLUME = 0.16;
const AUDIO_FADE_DURATION_MS = 900;

function clampVolume(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function HomeHeroSection({ role }: { role: ViewerRole }) {
  const cardVideoRef = useRef<HTMLVideoElement>(null);
  const volumeFadeRafRef = useRef<number | null>(null);
  const queuedAudioResumeRef = useRef<(() => void) | null>(null);

  const [isHeroMediaPlaying, setIsHeroMediaPlaying] = useState(true);
  const [isHeroAudioEnabled, setIsHeroAudioEnabled] = useState(true);
  const [hasScrolledPastHeroTop, setHasScrolledPastHeroTop] = useState(false);

  const stopVolumeFade = useCallback(() => {
    if (volumeFadeRafRef.current !== null) {
      cancelAnimationFrame(volumeFadeRafRef.current);
      volumeFadeRafRef.current = null;
    }
  }, []);

  const clearQueuedAudioResume = useCallback(() => {
    const queuedResume = queuedAudioResumeRef.current;
    if (!queuedResume || typeof window === "undefined") {
      return;
    }

    window.removeEventListener("pointerdown", queuedResume);
    window.removeEventListener("keydown", queuedResume);
    queuedAudioResumeRef.current = null;
  }, []);

  const fadeVideoVolumeTo = useCallback(
    (target: number, durationMs: number) => {
      const video = cardVideoRef.current;
      if (!video) {
        return;
      }

      const safeTarget = clampVolume(target);
      stopVolumeFade();

      const startVolume = clampVolume(video.volume);
      if (durationMs <= 0 || Math.abs(startVolume - safeTarget) < 0.005) {
        video.volume = safeTarget;
        return;
      }

      const startTime = performance.now();

      const step = (now: number) => {
        const progress = Math.min(1, (now - startTime) / durationMs);
        const eased = 1 - Math.pow(1 - progress, 3);
        video.volume = clampVolume(startVolume + (safeTarget - startVolume) * eased);

        if (progress < 1) {
          volumeFadeRafRef.current = requestAnimationFrame(step);
          return;
        }

        volumeFadeRafRef.current = null;
        video.volume = safeTarget;
      };

      volumeFadeRafRef.current = requestAnimationFrame(step);
    },
    [stopVolumeFade],
  );

  useEffect(() => {
    const video = cardVideoRef.current;
    if (!video) {
      return;
    }

    video.volume = 0;
    video.muted = true;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateScrollState = () => {
      setHasScrolledPastHeroTop(window.scrollY > 24);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  useEffect(() => {
    const videos = [cardVideoRef.current].filter(
      (video): video is HTMLVideoElement => Boolean(video),
    );

    videos.forEach((video) => {
      if (isHeroMediaPlaying) {
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [isHeroMediaPlaying]);

  useEffect(() => {
    const video = cardVideoRef.current;
    if (!video) {
      return;
    }

    let cancelled = false;

    async function tryPlayWithAudio() {
      const currentVideo = cardVideoRef.current;
      if (!currentVideo) {
        return;
      }

      try {
        currentVideo.muted = false;
        await currentVideo.play();

        if (!cancelled) {
          fadeVideoVolumeTo(HERO_AUDIO_TARGET_VOLUME, AUDIO_FADE_DURATION_MS);
        }
      } catch {
        if (
          cancelled ||
          typeof window === "undefined" ||
          queuedAudioResumeRef.current !== null ||
          !isHeroMediaPlaying ||
          !isHeroAudioEnabled ||
          hasScrolledPastHeroTop
        ) {
          return;
        }

        const resumeOnInteraction = async () => {
          clearQueuedAudioResume();

          if (!isHeroMediaPlaying || !isHeroAudioEnabled || hasScrolledPastHeroTop) {
            return;
          }

          const resumedVideo = cardVideoRef.current;
          if (!resumedVideo) {
            return;
          }

          try {
            resumedVideo.muted = false;
            await resumedVideo.play();
            fadeVideoVolumeTo(HERO_AUDIO_TARGET_VOLUME, AUDIO_FADE_DURATION_MS);
          } catch {
            // Browser still blocked playback. User can tap the audio toggle again.
          }
        };

        queuedAudioResumeRef.current = resumeOnInteraction;
        window.addEventListener("pointerdown", resumeOnInteraction, { once: true });
        window.addEventListener("keydown", resumeOnInteraction, { once: true });
      }
    }

    if (isHeroMediaPlaying && isHeroAudioEnabled && !hasScrolledPastHeroTop) {
      void tryPlayWithAudio();
    } else {
      clearQueuedAudioResume();
      video.muted = true;
      fadeVideoVolumeTo(0, AUDIO_FADE_DURATION_MS);
    }

    return () => {
      cancelled = true;
    };
  }, [
    clearQueuedAudioResume,
    fadeVideoVolumeTo,
    hasScrolledPastHeroTop,
    isHeroAudioEnabled,
    isHeroMediaPlaying,
  ]);

  useEffect(() => {
    return () => {
      stopVolumeFade();
      clearQueuedAudioResume();
    };
  }, [clearQueuedAudioResume, stopVolumeFade]);

  return (
    <section className="relative overflow-hidden bg-[#1a2a1a]">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(44,62,42,0.85) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[90vh] w-full max-w-7xl flex-col px-4 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-10 lg:px-8 lg:pb-10 lg:pt-10">
        <div className="flex flex-col gap-4 overflow-visible sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={withRole("/", role)}
            className="flex shrink-0 items-center gap-3 overflow-visible py-0.5"
          >
            <img
              src="/brands/PALENKE.svg"
              alt="Logo Palenke / PCN"
              width={48}
              height={96}
              decoding="async"
              fetchPriority="high"
              className="h-16 w-auto shrink-0 object-contain sm:h-[4.5rem]"
            />
            <span className="min-w-0 py-0.5">
              <span className="block font-display text-xl leading-tight text-white sm:text-2xl">Palenke</span>
              <span className="mt-1 block text-[11px] font-medium uppercase leading-snug tracking-[0.24em] text-white/60 sm:text-xs">
                Pensamiento y Territorio
              </span>
            </span>
          </Link>

          <form
            action="/biblioteca"
            className="flex w-full items-center gap-3 rounded-full border border-white/15 bg-black/20 px-4 py-2.5 backdrop-blur-md transition focus-within:border-white/35 focus-within:bg-black/30 sm:max-w-sm lg:max-w-md"
          >
            <Search className="h-4 w-4 shrink-0 text-white/60" aria-hidden="true" />
            <label htmlFor="hero-search" className="sr-only">
              Buscar en la biblioteca
            </label>
            <input
              id="hero-search"
              name="q"
              type="search"
              placeholder="Buscar en la biblioteca..."
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/45 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#1a1a1a] transition hover:bg-[#f0eae0]"
            >
              Buscar
            </button>
          </form>
        </div>

        <div className="flex flex-1 items-center py-8 sm:py-10 lg:py-12">
          <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center xl:gap-14">
            <div className="flex flex-col items-start text-left">
              <div className="mb-8 flex h-1 w-48 overflow-hidden rounded-full" aria-hidden="true">
                <span className="flex-1 bg-[#2e7d32]" />
                <span className="flex-1 bg-[#fbc02d]" />
                <span className="flex-1 bg-[#d32f2f]" />
              </div>

              <h1 className="font-display text-5xl leading-[0.95] text-white sm:text-6xl lg:text-[72px]">
                Nuestras Raíces,<br />Nuestro Territorio
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
                Infraestructura digital para gestionar, proteger y comunicar información territorial,
                conocimiento propio y procesos de gobernanza del pueblo negro.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="https://renacientes.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#2e7d32] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-900/20 transition hover:bg-[#1b5e20]"
                >
                  Conoce Nuestra Lucha
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <ExpandableVideo videoId="hero" fullSrc={HERO_VIDEO_SRC}>
                <div className="group relative aspect-video overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-2xl shadow-black/50 transition-transform duration-300 hover:scale-[1.02]">
                  <div className="absolute inset-0 overflow-hidden">
                    <video
                      ref={cardVideoRef}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute left-1/2 top-1/2 h-full w-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.32] object-cover object-center opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                    >
                      <source src={HERO_VIDEO_SRC} type="video/mp4" />
                    </video>
                  </div>

                  <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />

                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2e7d32] shadow-[0_0_0_8px_rgba(46,125,50,0.25)] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#1b5e20]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="white"
                        className="h-7 w-7 translate-x-0.5"
                        aria-hidden="true"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  <div className="absolute bottom-5 left-5 z-10 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    Video de presentación
                  </div>
                </div>
              </ExpandableVideo>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-2">
          <HeroCards role={role} />
        </div>
      </div>

      <div className="absolute bottom-3 right-1 z-20 flex flex-col items-end gap-2 sm:bottom-4 sm:right-2 lg:bottom-5 lg:right-3">
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => setIsHeroAudioEnabled((prev) => !prev)}
            aria-label={isHeroAudioEnabled ? "Silenciar sonido ambiente" : "Activar sonido ambiente"}
            aria-pressed={isHeroAudioEnabled}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition ${
              isHeroAudioEnabled
                ? "border-white/35 bg-black/45 text-white hover:bg-black/60"
                : "border-[#d32f2f]/55 bg-black/45 text-[#ffd5d5] hover:bg-black/60"
            }`}
          >
            {isHeroAudioEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsHeroMediaPlaying((prev) => !prev)}
            aria-label={isHeroMediaPlaying ? "Pausar video y sonido" : "Reanudar video y sonido"}
            aria-pressed={isHeroMediaPlaying}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition ${
              isHeroMediaPlaying
                ? "border-white/35 bg-black/45 text-white hover:bg-black/60"
                : "border-[#d32f2f]/55 bg-black/45 text-[#ffd5d5] hover:bg-black/60"
            }`}
          >
            {isHeroMediaPlaying ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>
        </div>

        <a
          href="#quienes-somos"
          aria-label="Hay más contenido. Desplazarse a la siguiente sección"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-black/45 text-white shadow-lg backdrop-blur-md transition hover:bg-black/65 motion-reduce:transition-none"
        >
          <ChevronDown className="h-5 w-5 animate-bounce motion-reduce:animate-none" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
