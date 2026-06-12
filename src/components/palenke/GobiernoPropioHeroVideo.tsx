"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Video, VideoOff, Volume2, VolumeX } from "lucide-react";
import { ExpandableVideo } from "@/components/home/ExpandableVideo";
import { useHeroAmbientAudio } from "@/lib/useHeroAmbientAudio";

const PCN_SOFT_OVERLAY =
  "radial-gradient(ellipse at 18% 82%, rgba(46,125,50,0.38), transparent 58%), radial-gradient(ellipse at 82% 18%, rgba(251,192,45,0.3), transparent 55%), radial-gradient(ellipse at 72% 72%, rgba(211,47,47,0.26), transparent 52%), linear-gradient(165deg, rgba(26,26,26,0.75) 0%, rgba(31,29,27,0.5) 50%, rgba(23,21,19,0.7) 100%)";

interface GobiernoPropioHeroVideoProps {
  videoSrc: string;
  audioSrc: string;
  duration?: string;
  tag?: string;
  label?: string;
  style?: React.CSSProperties;
}

export function GobiernoPropioHeroVideo({
  videoSrc,
  audioSrc,
  duration,
  tag = "Gobierno Propio",
  label = "Video de presentación",
  style,
}: GobiernoPropioHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isMediaPlaying, setIsMediaPlaying] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioRef = useHeroAmbientAudio({
    audioSrc,
    enabled: isAudioEnabled && !isExpanded,
    paused: !isMediaPlaying,
    targetVolume: 1,
    fadeDurationMs: 700,
  });

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
    if (!video || isExpanded) {
      return;
    }

    if (isMediaPlaying) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isExpanded, isMediaPlaying]);

  function handleExpandedChange(open: boolean) {
    setIsExpanded(open);
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (open) {
      video.pause();
      return;
    }

    if (isMediaPlaying) {
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
        videoId="gobierno-propio-hero"
        fullSrc={videoSrc}
        expandedMuted={false}
        expandedObjectFit="contain"
        open={isExpanded}
        clickToExpand={false}
        onOpenChange={handleExpandedChange}
      >
        <div className="group relative min-h-[480px] w-full overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
            style={{ opacity: isMediaPlaying ? 0.85 : 0.45 }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: 0.7 }}
            whileHover={{ opacity: 0.5 }}
            transition={{ duration: 0.3 }}
            style={{ background: PCN_SOFT_OVERLAY }}
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
            <ellipse cx="180" cy="250" rx="70" ry="48" fill="#2e7d32" opacity="0.22" />
            <ellipse cx="420" cy="130" rx="90" ry="55" fill="#fbc02d" opacity="0.18" />
            <ellipse cx="460" cy="300" rx="60" ry="40" fill="#d32f2f" opacity="0.2" />
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
