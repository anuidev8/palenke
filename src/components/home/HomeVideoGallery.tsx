"use client";

import { useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { ExpandableVideo } from "@/components/home/ExpandableVideo";
import { useHeroAmbientAudio } from "@/lib/useHeroAmbientAudio";
import { ORIENTACION_POLITICA_AUDIO_SRC } from "@/lib/hero-ambient-audio";

const ORIENTACION_VIDEO =
  "/generated/admin/inicio-institucional-home-hero-1774051114373-video.mp4";

const video = {
  id: "orientacion-politica",
  title: "Nuestra orientación política",
  src: ORIENTACION_VIDEO,
  thumbnail: "/assets/hero-cards/gobierno-propio.png",
  tag: "PCN",
};

export function HomeVideoGallery() {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  const audioRef = useHeroAmbientAudio({
    audioSrc: ORIENTACION_POLITICA_AUDIO_SRC,
    enabled: isAudioEnabled,
    paused: false,
    targetVolume: 0.16,
    fadeDurationMs: 900,
  });

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="relative flex min-h-[300px] sm:min-h-[380px] w-full items-center justify-center overflow-hidden rounded-[28px] bg-[#1a2a1a] shadow-2xl">
        <div className="absolute inset-0 h-full w-full">
          <ExpandableVideo videoId={video.id} fullSrc={video.src}>
            <div className="group relative h-full w-full overflow-hidden transition-transform duration-300">
              {video.src.endsWith(".mp4") ? (
                <div className="absolute inset-0 overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute left-1/2 top-1/2 h-full w-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.32] object-cover object-center opacity-80 transition-opacity duration-300 group-hover:opacity-95"
                  >
                    <source src={video.src} type="video/mp4" />
                  </video>
                </div>
              ) : (
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div
                className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(26,42,26,0.9) 100%)",
                }}
              />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#2e7d32] shadow-[0_0_0_8px_rgba(46,125,50,0.25)] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#1b5e20]">
                  <Play className="h-7 w-7 translate-x-0.5 fill-white text-white" aria-hidden="true" />
                </div>
              </div>

              {/* Content info */}
              <div className="absolute bottom-6 left-6 right-6">
                <span className="mb-3 inline-block rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
                  {video.tag}
                </span>
                <h3 className="font-display text-2xl text-white sm:text-3xl">
                  {video.title}
                </h3>
              </div>
            </div>
          </ExpandableVideo>
        </div>

        {/* Audio toggle */}
        <div className="absolute bottom-3 right-3 z-10">
          <button
            type="button"
            onClick={() => setIsAudioEnabled((prev) => !prev)}
            aria-label={isAudioEnabled ? "Silenciar sonido ambiente" : "Activar sonido ambiente"}
            aria-pressed={isAudioEnabled}
            className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition hover:scale-110 sm:h-12 sm:w-12 ${
              isAudioEnabled
                ? "bg-[#2e7d32] text-white shadow-lg"
                : "bg-black/40 text-white/80 hover:bg-[#2e7d32] hover:text-white"
            }`}
          >
            {isAudioEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </button>
        </div>

        <audio ref={audioRef} src={ORIENTACION_POLITICA_AUDIO_SRC} preload="metadata" className="sr-only" />
      </div>
    </div>
  );
}
