"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Video, VideoOff, Volume2, VolumeX } from "lucide-react";
import { ExpandableVideo } from "@/components/home/ExpandableVideo";

const TERRITORY_GREEN_OVERLAY =
  "radial-gradient(ellipse at 35% 65%, rgba(46,125,50,0.6), transparent 55%), linear-gradient(160deg, #0d1f0d 0%, #1a2a1a 100%)";

const AUDIO_TARGET_VOLUME = 0.2;
const AUDIO_FADE_DURATION_MS = 900;
/** Skip intro on the ambient track (HUMANO). */
const AMBIENT_AUDIO_START_SEC = 6;

type FadeAudioOptions = {
  pauseAtEnd?: boolean;
};

function clampVolume(value: number) {
  return Math.max(0, Math.min(1, value));
}

interface MemoriaAfroterritorialHeroVideoProps {
  videoSrc: string;
  fallbackVideoSrc?: string;
  audioSrc: string;
  duration?: string;
  tag?: string;
  label?: string;
  style?: React.CSSProperties;
}

export function MemoriaAfroterritorialHeroVideo({
  videoSrc,
  fallbackVideoSrc,
  audioSrc,
  duration,
  tag = "Memoria Afroterritorial",
  label = "Video de presentación",
  style,
}: MemoriaAfroterritorialHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioFadeRafRef = useRef<number | null>(null);
  const queuedAudioResumeRef = useRef<(() => void) | null>(null);
  const stallFallbackTimeoutRef = useRef<number | null>(null);

  const [isMediaPlaying, setIsMediaPlaying] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeVideoSrc, setActiveVideoSrc] = useState(videoSrc);

  const ensureAmbientAudioOffset = useCallback((audio: HTMLAudioElement) => {
    if (audio.currentTime < AMBIENT_AUDIO_START_SEC) {
      audio.currentTime = AMBIENT_AUDIO_START_SEC;
    }
  }, []);

  const stopAudioFade = useCallback(() => {
    if (audioFadeRafRef.current !== null) {
      cancelAnimationFrame(audioFadeRafRef.current);
      audioFadeRafRef.current = null;
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

  const clearStallFallbackTimeout = useCallback(() => {
    if (stallFallbackTimeoutRef.current !== null && typeof window !== "undefined") {
      window.clearTimeout(stallFallbackTimeoutRef.current);
      stallFallbackTimeoutRef.current = null;
    }
  }, []);

  const fadeAudioTo = useCallback(
    (target: number, durationMs: number, options?: FadeAudioOptions) => {
      const audio = audioRef.current;
      if (!audio) {
        return;
      }

      const safeTarget = clampVolume(target);
      stopAudioFade();

      const startVolume = clampVolume(audio.volume);
      if (durationMs <= 0 || Math.abs(startVolume - safeTarget) < 0.005) {
        audio.volume = safeTarget;
        if (options?.pauseAtEnd && safeTarget === 0) {
          audio.pause();
        }
        return;
      }

      const startTime = performance.now();

      const step = (now: number) => {
        const progress = Math.min(1, (now - startTime) / durationMs);
        const eased = 1 - Math.pow(1 - progress, 3);
        audio.volume = clampVolume(startVolume + (safeTarget - startVolume) * eased);

        if (progress < 1) {
          audioFadeRafRef.current = requestAnimationFrame(step);
          return;
        }

        audioFadeRafRef.current = null;
        audio.volume = safeTarget;
        if (options?.pauseAtEnd && safeTarget === 0) {
          audio.pause();
        }
      };

      audioFadeRafRef.current = requestAnimationFrame(step);
    },
    [stopAudioFade],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = 0;

    const onLoadedMetadata = () => ensureAmbientAudioOffset(audio);
    const onTimeUpdate = () => {
      if (audio.currentTime < AMBIENT_AUDIO_START_SEC) {
        audio.currentTime = AMBIENT_AUDIO_START_SEC;
      }
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [ensureAmbientAudioOffset]);

  useEffect(() => {
    setActiveVideoSrc(videoSrc);
  }, [videoSrc]);

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
    if (!video) {
      return;
    }

    video.muted = true;
    video.volume = 0;

    if (isExpanded) {
      return;
    }

    if (isMediaPlaying) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isExpanded, isMediaPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isExpanded) {
      return;
    }

    let cancelled = false;

    async function tryPlayAudio() {
      const currentAudio = audioRef.current;
      if (!currentAudio) {
        return;
      }

      try {
        ensureAmbientAudioOffset(currentAudio);
        currentAudio.muted = false;
        await currentAudio.play();
        ensureAmbientAudioOffset(currentAudio);

        if (!cancelled) {
          fadeAudioTo(AUDIO_TARGET_VOLUME, AUDIO_FADE_DURATION_MS);
        }
      } catch {
        if (
          cancelled ||
          typeof window === "undefined" ||
          queuedAudioResumeRef.current !== null ||
          !isMediaPlaying ||
          !isAudioEnabled
        ) {
          return;
        }

        const resumeOnInteraction = async () => {
          clearQueuedAudioResume();

          if (!isMediaPlaying || !isAudioEnabled || isExpanded) {
            return;
          }

          const resumedAudio = audioRef.current;
          if (!resumedAudio) {
            return;
          }

          try {
            ensureAmbientAudioOffset(resumedAudio);
            resumedAudio.muted = false;
            await resumedAudio.play();
            ensureAmbientAudioOffset(resumedAudio);
            fadeAudioTo(AUDIO_TARGET_VOLUME, AUDIO_FADE_DURATION_MS);
          } catch {
            // Browser blocked playback; user can tap the audio toggle again.
          }
        };

        queuedAudioResumeRef.current = resumeOnInteraction;
        window.addEventListener("pointerdown", resumeOnInteraction, { once: true });
        window.addEventListener("keydown", resumeOnInteraction, { once: true });
      }
    }

    if (isMediaPlaying && isAudioEnabled) {
      void tryPlayAudio();
    } else {
      clearQueuedAudioResume();
      fadeAudioTo(0, AUDIO_FADE_DURATION_MS, { pauseAtEnd: true });
    }

    return () => {
      cancelled = true;
    };
  }, [clearQueuedAudioResume, ensureAmbientAudioOffset, fadeAudioTo, isAudioEnabled, isExpanded, isMediaPlaying]);

  useEffect(() => {
    return () => {
      stopAudioFade();
      clearQueuedAudioResume();
      clearStallFallbackTimeout();
    };
  }, [clearQueuedAudioResume, clearStallFallbackTimeout, stopAudioFade]);

  function handleExpandedChange(open: boolean) {
    setIsExpanded(open);
    const video = videoRef.current;
    const audio = audioRef.current;

    if (open) {
      video?.pause();
      if (audio) {
        clearQueuedAudioResume();
        fadeAudioTo(0, AUDIO_FADE_DURATION_MS, { pauseAtEnd: true });
      }
      return;
    }

    if (isMediaPlaying) {
      void video?.play().catch(() => {});
      if (isAudioEnabled && audio) {
        ensureAmbientAudioOffset(audio);
        void audio
          .play()
          .then(() => {
            ensureAmbientAudioOffset(audio);
            fadeAudioTo(AUDIO_TARGET_VOLUME, AUDIO_FADE_DURATION_MS);
          })
          .catch(() => {});
      }
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
      <audio ref={audioRef} src={audioSrc} autoPlay loop preload="auto" muted />

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
            preload="auto"
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
