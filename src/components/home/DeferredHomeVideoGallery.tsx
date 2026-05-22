"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const LazyHomeVideoGallery = dynamic(
  () => import("@/components/home/HomeVideoGallery").then((mod) => mod.HomeVideoGallery),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[300px] w-full animate-pulse rounded-[28px] bg-[#d9d2c7] sm:min-h-[380px]"
        aria-hidden="true"
      />
    ),
  },
);

export function DeferredHomeVideoGallery() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = anchorRef.current;
    if (!element || shouldLoad) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      const fallbackId = window.setTimeout(() => setShouldLoad(true), 0);
      return () => window.clearTimeout(fallbackId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: "280px 0px", threshold: 0.01 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={anchorRef}>
      {shouldLoad ? (
        <LazyHomeVideoGallery />
      ) : (
        <div
          className="min-h-[300px] w-full animate-pulse rounded-[28px] bg-[#d9d2c7] sm:min-h-[380px]"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
