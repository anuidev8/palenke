"use client";

import { useCallback, useEffect, useRef } from "react";

function clampVolume(value: number) {
  return Math.max(0, Math.min(1, value));
}

type UseHeroAmbientAudioOptions = {
  audioSrc: string;
  enabled: boolean;
  paused: boolean;
  targetVolume?: number;
  fadeDurationMs?: number;
};

export function useHeroAmbientAudio({
  audioSrc,
  enabled,
  paused,
  targetVolume = 0.2,
  fadeDurationMs = 900,
}: UseHeroAmbientAudioOptions) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const volumeFadeRafRef = useRef<number | null>(null);
  const queuedAudioResumeRef = useRef<(() => void) | null>(null);

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

  const fadeAudioVolumeTo = useCallback(
    (target: number, durationMs: number) => {
      const audio = audioRef.current;
      if (!audio) {
        return;
      }

      const safeTarget = clampVolume(target);
      stopVolumeFade();

      const startVolume = clampVolume(audio.volume);
      if (durationMs <= 0 || Math.abs(startVolume - safeTarget) < 0.005) {
        audio.volume = safeTarget;
        return;
      }

      const startTime = performance.now();

      const step = (now: number) => {
        const progress = Math.min(1, (now - startTime) / durationMs);
        const eased = 1 - Math.pow(1 - progress, 3);
        audio.volume = clampVolume(startVolume + (safeTarget - startVolume) * eased);

        if (progress < 1) {
          volumeFadeRafRef.current = requestAnimationFrame(step);
          return;
        }

        volumeFadeRafRef.current = null;
        audio.volume = safeTarget;
      };

      volumeFadeRafRef.current = requestAnimationFrame(step);
    },
    [stopVolumeFade],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = 0;
    audio.loop = true;
    audio.preload = "metadata";
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.src !== audioSrc) {
      audio.src = audioSrc;
      audio.load();
    }
  }, [audioSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    let cancelled = false;

    async function tryPlayWithAudio() {
      const currentAudio = audioRef.current;
      if (!currentAudio || paused) {
        return;
      }

      try {
        currentAudio.volume = 0;
        await currentAudio.play();

        if (!cancelled) {
          fadeAudioVolumeTo(targetVolume, fadeDurationMs);
        }
      } catch {
        if (
          cancelled ||
          typeof window === "undefined" ||
          queuedAudioResumeRef.current !== null ||
          paused ||
          !enabled
        ) {
          return;
        }

        const resumeOnInteraction = async () => {
          clearQueuedAudioResume();

          if (paused || !enabled) {
            return;
          }

          const resumedAudio = audioRef.current;
          if (!resumedAudio) {
            return;
          }

          try {
            resumedAudio.volume = 0;
            await resumedAudio.play();
            fadeAudioVolumeTo(targetVolume, fadeDurationMs);
          } catch {
            // Browser blocked playback; user can tap the audio toggle again.
          }
        };

        queuedAudioResumeRef.current = resumeOnInteraction;
        window.addEventListener("pointerdown", resumeOnInteraction, { once: true });
        window.addEventListener("keydown", resumeOnInteraction, { once: true });
      }
    }

    if (enabled && !paused) {
      void tryPlayWithAudio();
    } else {
      clearQueuedAudioResume();
      fadeAudioVolumeTo(0, fadeDurationMs);
      audio.pause();
    }

    return () => {
      cancelled = true;
    };
  }, [
    clearQueuedAudioResume,
    enabled,
    fadeAudioVolumeTo,
    fadeDurationMs,
    paused,
    targetVolume,
  ]);

  useEffect(() => {
    return () => {
      stopVolumeFade();
      clearQueuedAudioResume();
    };
  }, [clearQueuedAudioResume, stopVolumeFade]);

  return audioRef;
}
