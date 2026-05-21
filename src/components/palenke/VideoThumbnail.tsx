"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoThumbnailProps {
  /** Label shown under the play icon */
  label?: string;
  /** Duration badge text */
  duration?: string;
  /** Tag shown top-left */
  tag?: string;
  /** MP4 path served from /public */
  videoSrc?: string;
  /** Start muted playback on load (requires muted + playsInline) */
  autoPlay?: boolean;
  /** Extra className for the outer container */
  className?: string;
  /** inline style for the outer container (e.g. minHeight) */
  style?: React.CSSProperties;
  /** Aspect ratio wrapper — if true wraps in 16/9 aspect box */
  aspectVideo?: boolean;
  /** Color overlay on top of the video */
  overlayVariant?: "territory-green" | "pcn-soft";
}

const OVERLAY_BACKGROUNDS: Record<
  NonNullable<VideoThumbnailProps["overlayVariant"]>,
  string
> = {
  "territory-green":
    "radial-gradient(ellipse at 35% 65%, rgba(46,125,50,0.6), transparent 55%), linear-gradient(160deg, #0d1f0d 0%, #1a2a1a 100%)",
  "pcn-soft":
    "radial-gradient(ellipse at 18% 82%, rgba(46,125,50,0.38), transparent 58%), radial-gradient(ellipse at 82% 18%, rgba(251,192,45,0.3), transparent 55%), radial-gradient(ellipse at 72% 72%, rgba(211,47,47,0.26), transparent 52%), linear-gradient(165deg, rgba(26,26,26,0.75) 0%, rgba(31,29,27,0.5) 50%, rgba(23,21,19,0.7) 100%)",
};

/**
 * Reusable video thumbnail mockup.
 * Uses hero-bg.mp4 as background. Clicking the play button toggles play/pause.
 * Animated play/pause button with spring scale.
 */
export function VideoThumbnail({
  label = "Video de presentación",
  duration,
  tag,
  videoSrc = "/hero-bg.mp4",
  autoPlay = false,
  className = "",
  style,
  aspectVideo = false,
  overlayVariant = "territory-green",
}: VideoThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(autoPlay);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;
    const v = videoRef.current;
    if (!v) return;
    void v.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [autoPlay, videoSrc]);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  const outer = aspectVideo
    ? "relative overflow-hidden rounded-[28px]"
    : "relative overflow-hidden";

  return (
    <div
      className={`${outer} ${className}`}
      style={aspectVideo ? { aspectRatio: "16/9", ...style } : style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background video */}
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        autoPlay={autoPlay}
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: playing ? 0.85 : 0.45 }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Dark gradient overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: hovered ? 0.5 : 0.7 }}
        transition={{ duration: 0.3 }}
        style={{ background: OVERLAY_BACKGROUNDS[overlayVariant] }}
      />

      {/* SVG territory lines */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.18]"
        viewBox="0 0 600 420"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path d="M30,420 Q130,280 190,220 Q270,140 340,160 Q430,180 520,100" stroke="white" strokeWidth="2.5" fill="none" />
        <path d="M0,310 Q100,280 190,270 Q290,255 360,290 Q440,330 600,290" stroke="white" strokeWidth="1.5" fill="none" />
        {overlayVariant === "pcn-soft" ? (
          <>
            <ellipse cx="180" cy="250" rx="70" ry="48" fill="#2e7d32" opacity="0.22" />
            <ellipse cx="420" cy="130" rx="90" ry="55" fill="#fbc02d" opacity="0.18" />
            <ellipse cx="460" cy="300" rx="60" ry="40" fill="#d32f2f" opacity="0.2" />
          </>
        ) : (
          <>
            <ellipse cx="200" cy="220" rx="70" ry="48" fill="#2e7d32" opacity="0.35" />
            <ellipse cx="430" cy="150" rx="90" ry="55" fill="#1b5e20" opacity="0.28" />
          </>
        )}
      </svg>

      {/* Play / Pause button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <motion.button
          type="button"
          aria-label={playing ? "Pausar video" : "Reproducir video"}
          onClick={togglePlay}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
          className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-sm"
        >
          <AnimatePresence mode="wait" initial={false}>
            {playing ? (
              <motion.svg
                key="pause"
                viewBox="0 0 24 24"
                className="h-8 w-8 fill-white"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
                aria-hidden="true"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </motion.svg>
            ) : (
              <motion.svg
                key="play"
                viewBox="0 0 24 24"
                className="h-8 w-8 translate-x-0.5 fill-white"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.span
          className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60"
          animate={{ opacity: playing ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.span>
      </div>

      {/* Duration badge */}
      {duration ? (
        <div className="absolute bottom-4 right-4 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">
          {duration}
        </div>
      ) : null}

      {/* Module tag */}
      {tag ? (
        <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/70 backdrop-blur-sm">
          {tag}
        </div>
      ) : null}
    </div>
  );
}
