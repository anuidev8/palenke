"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ArrowRight } from "lucide-react";

interface InstagramItem {
  id: string;
  title: string;
  externalUrl?: string | null;
}

interface InstagramSliderProps {
  items: InstagramItem[];
}

export function InstagramSlider({ items }: InstagramSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = items.length;

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000); // Auto pass every 5 seconds
  };

  useEffect(() => {
    if (total > 1) {
      resetTimer();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIndex, total]);

  if (total === 0) return null;

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const currentItem = items[currentIndex];
  const embedUrl = currentItem.externalUrl
    ? `${currentItem.externalUrl.split("?")[0]}embed/`
    : "";

  return (
    <div className="relative flex flex-col gap-4">
      {/* Slider Container */}
      <div className="relative h-[380px] w-full overflow-hidden rounded-2xl border border-[#e8dfd3] bg-white shadow-sm">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 flex flex-col h-full w-full"
          >
            {embedUrl ? (
              <iframe
                title={currentItem.title}
                src={embedUrl}
                className="w-full h-full block"
                style={{ border: "0" }}
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-[#7a756e]">
                No se pudo cargar la publicación
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {total > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#e8dfd3] bg-white/90 text-[#4a4540] shadow-sm backdrop-blur-sm transition duration-200 hover:bg-white hover:text-[#2e7d32] active:scale-95"
              aria-label="Publicación anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#e8dfd3] bg-white/90 text-[#4a4540] shadow-sm backdrop-blur-sm transition duration-200 hover:bg-white hover:text-[#2e7d32] active:scale-95"
              aria-label="Siguiente publicación"
            >
              {/* Using a Chevron-like icon from lucide: rotate arrow left is ChevronLeft, for right we can use standard Lucide icons, wait ChevronLeft rotated is ok, or we can import ChevronRight from Lucide as well! Let's import ChevronRight or rotate ChevronLeft */}
              <ChevronLeft className="h-5 w-5 rotate-180" />
            </button>
          </>
        )}
      </div>

      {/* Bullet / Dot Indicators */}
      {total > 1 && (
        <div className="flex justify-center items-center gap-2 mt-1">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-6 bg-[#2e7d32]"
                  : "w-2.5 bg-[#e8dfd3] hover:bg-[#c8bfae]"
              }`}
              aria-label={`Ir a publicación ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
