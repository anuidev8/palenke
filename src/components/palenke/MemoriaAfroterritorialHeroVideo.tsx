"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Video, VideoOff, Volume2, VolumeX } from "lucide-react";
import { ExpandableVideo } from "@/components/home/ExpandableVideo";
import { useHeroAmbientAudio } from "@/lib/useHeroAmbientAudio";

const TERRITORY_GREEN_OVERLAY =
  "radial-gradient(ellipse at 35% 65%, rgba(46,125,50,0.6), transparent 55%), linear-gradient(160deg, #0d1f0d 0%, #1a2a1a 100%)";

interface MemoriaAfroterritorialHeroVideoProps {
  videoSrc: string;
  audioSrc: string;
  fallbackVideoSrc?: string;
  duration?: string;
  tag?: string;
  label?: string;
  style?: React.CSSProperties;
}

export function MemoriaAfroterritorialHeroVideo({
  videoSrc,
  audioSrc,
  fallbackVideoSrc,
  duration,
  tag = "Memoria Afroterritorial",
  label = "Video de presentación",
  style,
}: MemoriaAfroterritorialHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stallFallbackTimeoutRef = useRef<number | null>(null);

  const [isMediaPlaying, setIsMediaPlaying] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeVideoSrc, setActiveVideoSrc] = useState(videoSrc);

  const audioRef = useHeroAmbientAudio({
    audioSrc,
    enabled: isAudioEnabled && !isExpanded,
    paused: !isMediaPlaying,
    targetVolume: 0.2,
    fadeDurationMs: 900,
  });

  const clearStallFallbackTimeout = useCallback(() => {
    if (stallFallbackTimeoutRef.current !== null && typeof window !== "undefined") {
      window.clearTimeout(stallFallbackTimeoutRef.current);
      stallFallbackTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    setActiveVideoSrc(videoSrc);
  }, [videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.muted = true;
    video.volume = 0;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    function switchToFallback() {
      const currentVideo = videoRef.current;
      if (!fallbackVideoSrc || activeVideoSrc === fallbackVideoSrc) {
        return;
      }
      if (!currentVideo) {
        return;
      }

      const wasPaused = currentVideo.paused;
      const currentTime = currentVideo.currentTime;
      setActiveVideoSrc(fallbackVideoSrc);

      const onLoadedMetadata = () => {
        const fallbackVideo = videoRef.current;
        if (!fallbackVideo) {
          return;
        }

        fallbackVideo.currentTime = currentTime;
        if (!wasPaused && isMediaPlaying) {
          void fallbackVideo.play().catch(() => {});
        }
      };

      currentVideo.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
    }

    const onWaiting = () => {
      clearStallFallbackTimeout();
      if (!isMediaPlaying || activeVideoSrc === fallbackVideoSrc) {
        return;
      }

      if (typeof window !== "undefined") {
        stallFallbackTimeoutRef.current = window.setTimeout(() => {
          switchToFallback();
        }, 1400);
      }
    };

    const onStalled = () => {
      switchToFallback();
    };

    const onError = () => {
      switchToFallback();
    };

    const onPlaying = () => {
      clearStallFallbackTimeout();
    };

    const onCanPlay = () => {
      clearStallFallbackTimeout();
    };

    video.addEventListener("waiting", onWaiting);
    video.addEventListener("stalled", onStalled);
    video.addEventListener("error", onError);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("canplay", onCanPlay);

    return () => {
      clearStallFallbackTimeout();
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("stalled", onStalled);
      video.removeEventListener("error", onError);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("canplay", onCanPlay);
    };
  }, [activeVideoSrc, clearStallFallbackTimeout, fallbackVideoSrc, isMediaPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || isExpanded) {
      return;
    }

    if (isMediaPlaying) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isExpanded, isMediaPlaying]);

  useEffect(() => {
    return () => {
      clearStallFallbackTimeout();
    };
  }, [clearStallFallbackTimeout]);

  function handleExpandedChange(open: boolean) {
    setIsExpanded(open);
    const video = videoRef.current;

    if (open) {
      video?.pause();
      return;
    }

    if (isMediaPlaying && video) {
      void video.play().catch(() => {});
    }
  }

  const controlButtonClass = (active: boolean) =>
    `inline-flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition ${
      active
        ? "border-white/35 bg-black/45 text-white hover:bg-black/60"
        : "border-[#d32f2f]/55 bg-black/45 text-[#ffd5d5] hover:bg-black/60"
    }`;

  return (
    <div className="relative overflow-hidden" style={style}>
      <audio ref={audioRef} src={audioSrc} preload="metadata" className="sr-only" />

      <ExpandableVideo
        videoId="memoria-afroterritorial-hero"
        fullSrc={activeVideoSrc}
        expandedMuted
        expandedLoop
        expandedObjectFit="cover"
        open={isExpanded}
        clickToExpand={false}
        onOpenChange={handleExpandedChange}
      >
        <div className="group relative min-h-[480px] w-full overflow-hidden">
          <video
            ref={videoRef}
            src={activeVideoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
            style={{ opacity: isMediaPlaying ? 0.85 : 0.45 }}
          />

          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: 0.7 }}
            whileHover={{ opacity: 0.5 }}
            transition={{ duration: 0.3 }}
            style={{ background: TERRITORY_GREEN_OVERLAY }}
          />

          <svg
            className="absolute inset-0 h-full w-full opacity-[0.18]"
            viewBox="0 0 600 420"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <path
              d="M30,420 Q130,280 190,220 Q270,140 340,160 Q430,180 520,100"
              stroke="white"
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M0,310 Q100,280 190,270 Q290,255 360,290 Q440,330 600,290"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
            />
            <ellipse cx="200" cy="220" rx="70" ry="48" fill="#2e7d32" opacity="0.35" />
            <ellipse cx="430" cy="150" rx="90" ry="55" fill="#1b5e20" opacity="0.28" />
          </svg>

          {duration ? (
            <div className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">
              {duration}
            </div>
          ) : null}

          {tag ? (
            <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/70 backdrop-blur-sm">
              {tag}
            </div>
          ) : null}
        </div>
      </ExpandableVideo>

      <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-2 sm:right-6 lg:right-10">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleExpandedChange(true);
          }}
          aria-label={`Ampliar ${label}`}
          className={controlButtonClass(true)}
        >
          <Maximize2 className="h-5 w-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setIsAudioEnabled((prev) => !prev);
          }}
          aria-label={isAudioEnabled ? "Silenciar sonido ambiente" : "Activar sonido ambiente"}
          aria-pressed={isAudioEnabled}
          className={controlButtonClass(isAudioEnabled)}
        >
          {isAudioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setIsMediaPlaying((prev) => !prev);
          }}
          aria-label={isMediaPlaying ? "Pausar video y sonido" : "Reanudar video y sonido"}
          aria-pressed={isMediaPlaying}
          className={controlButtonClass(isMediaPlaying)}
        >
          {isMediaPlaying ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
