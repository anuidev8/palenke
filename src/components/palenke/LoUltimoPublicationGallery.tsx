"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LoUltimoImage } from "@/components/palenke/LoUltimoImage";

const layoutSpring = { type: "spring", stiffness: 280, damping: 32 } as const;
const softEase = [0.22, 1, 0.36, 1] as const;

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 48 : -48,
    scale: 0.98,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -48 : 48,
    scale: 0.98,
  }),
};

const fadeVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

type LoUltimoPublicationGalleryProps = {
  images: string[];
  title: string;
};

export function LoUltimoPublicationGallery({ images, title }: LoUltimoPublicationGalleryProps) {
  const uniqueImages = Array.from(new Set(images.filter(Boolean)));
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const reduceMotion = useReducedMotion();

  const goToIndex = useCallback(
    (nextIndex: number) => {
      if (nextIndex === activeIndex || nextIndex < 0 || nextIndex >= uniqueImages.length) {
        return;
      }
      setDirection(nextIndex > activeIndex ? 1 : -1);
      setActiveIndex(nextIndex);
    },
    [activeIndex, uniqueImages.length],
  );

  if (!uniqueImages.length) return null;

  const activeSrc = uniqueImages[activeIndex] ?? uniqueImages[0];
  const variants = reduceMotion ? fadeVariants : slideVariants;
  const transition = reduceMotion
    ? { duration: 0.2 }
    : { duration: 0.38, ease: softEase };

  return (
    <div className="mb-8 space-y-4">
      <div className="relative min-h-[240px] overflow-hidden rounded-[28px] border border-[#e8dfd3] bg-[#f0eae0] sm:min-h-[320px]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={activeSrc}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="flex min-h-[240px] items-center justify-center px-4 py-6 sm:min-h-[320px]"
          >
            <LoUltimoImage
              src={activeSrc}
              alt={`Imagen ${activeIndex + 1} de ${title}`}
              width={1200}
              height={800}
              priority={activeIndex === 0}
              className="h-auto max-h-[min(70vh,640px)] w-full max-w-full object-contain"
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/20 via-transparent to-transparent" />

        {uniqueImages.length > 1 ? (
          <motion.p
            key={activeIndex}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: softEase }}
            className="absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white"
          >
            {activeIndex + 1} / {uniqueImages.length}
          </motion.p>
        ) : null}
      </div>

      {uniqueImages.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {uniqueImages.map((src, index) => {
            const isActive = index === activeIndex;
            return (
              <motion.button
                key={src}
                type="button"
                layout={!reduceMotion}
                onClick={() => goToIndex(index)}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                animate={{
                  scale: isActive ? 1 : 0.96,
                  opacity: isActive ? 1 : 0.78,
                }}
                transition={{
                  layout: reduceMotion ? { duration: 0 } : layoutSpring,
                  scale: { type: "spring", stiffness: 420, damping: 28 },
                  opacity: { duration: 0.22 },
                }}
                className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border-2 ${
                  isActive
                    ? "border-[#d32f2f] ring-2 ring-[#d32f2f]/25"
                    : "border-[#e8dfd3] hover:border-[#c9bfb0]"
                }`}
                aria-label={`Ver imagen ${index + 1}`}
                aria-pressed={isActive}
              >
                <LoUltimoImage
                  src={src}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </motion.button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
