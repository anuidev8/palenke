"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import { ExpandableVideo } from "./ExpandableVideo";

const ORIENTACION_VIDEO = "/videos/events-slideshow.mp4";

const videos = [
  {
    id: "orientacion-politica",
    title: "Nuestra orientación política",
    src: ORIENTACION_VIDEO,
    thumbnail: "/assets/hero-cards/gobierno-propio.png",
    tag: "PCN",
  },
  {
    id: "historia",
    title: "Nuestra historia de resistencia",
    src: "/hero-bg.mp4",
    thumbnail: "/assets/hero-cards/memoria-afroterritorial.png",
    tag: "Memoria",
  },
  {
    id: "territorio",
    title: "Defensa del territorio",
    src: "/hero-bg.mp4",
    thumbnail: "/assets/hero-cards/scita.png",
    tag: "Lucha",
  },
];

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    };
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export function HomeVideoGallery() {
  const [[page, direction], setPage] = useState([0, 0]);

  const videoIndex = Math.abs(page % videos.length);
  const currentVideo = videos[videoIndex];

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Video Carousel */}
      <div className="relative flex min-h-[300px] sm:min-h-[380px] w-full items-center justify-center overflow-hidden rounded-[28px] bg-[#1a2a1a] shadow-2xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 h-full w-full"
          >
            <ExpandableVideo videoId={currentVideo.id} fullSrc={currentVideo.src}>
              <div className="group relative h-full w-full overflow-hidden transition-transform duration-300">
                {currentVideo.src.endsWith(".mp4") ? (
                  <div className="absolute inset-0 overflow-hidden">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute left-1/2 top-1/2 h-full w-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.32] object-cover object-center opacity-80 transition-opacity duration-300 group-hover:opacity-95"
                    >
                      <source src={currentVideo.src} type="video/mp4" />
                    </video>
                  </div>
                ) : (
                  <Image
                    src={currentVideo.thumbnail}
                    alt={currentVideo.title}
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
                    {currentVideo.tag}
                  </span>
                  <h3 className="font-display text-2xl text-white sm:text-3xl">
                    {currentVideo.title}
                  </h3>
                </div>
              </div>
            </ExpandableVideo>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {videos.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-[#2e7d32] hover:scale-110 disabled:opacity-50 sm:h-12 sm:w-12"
              onClick={() => paginate(-1)}
              aria-label="Video anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-[#2e7d32] hover:scale-110 disabled:opacity-50 sm:h-12 sm:w-12"
              onClick={() => paginate(1)}
              aria-label="Siguiente video"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
      
      {/* Dots indicator */}
      {videos.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {videos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                const diff = idx - videoIndex;
                if (diff !== 0) paginate(diff);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === videoIndex ? "w-8 bg-[#2e7d32]" : "w-2 bg-[#d8f3dc] hover:bg-[#2e7d32]/50"
              }`}
              aria-label={`Ir al video ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
