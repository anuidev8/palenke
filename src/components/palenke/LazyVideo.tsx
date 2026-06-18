'use client';

import { useEffect, useRef, useState } from 'react';

interface LazyVideoProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
}

export function LazyVideo({
  src,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Cache busting: add timestamp to force fresh download
  const cacheBustedSrc = `${src}?v=${Math.floor(Date.now() / 60000)}`;

  return (
    <video
      ref={videoRef}
      autoPlay={isVisible && autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      preload={isVisible ? 'auto' : 'none'}
      className={className}
      onCanPlay={() => setIsLoading(false)}
      onLoadStart={() => setIsLoading(true)}
    >
      {isVisible && (
        <source src={cacheBustedSrc} type="video/mp4" />
      )}
    </video>
  );
}
