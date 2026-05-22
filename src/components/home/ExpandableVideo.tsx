"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ExpandableVideoProps {
  videoId: string;
  fullSrc: string;
  children: React.ReactNode;
  disabled?: boolean;
  /** When false, expanded player includes audio (default: muted). */
  expandedMuted?: boolean;
  expandedLoop?: boolean;
  expandedObjectFit?: "cover" | "contain";
  /** Controlled open state (optional). */
  open?: boolean;
  /** Open modal when the preview area is clicked (default: true). */
  clickToExpand?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ExpandableVideo({
  videoId,
  fullSrc,
  children,
  disabled = false,
  expandedMuted = true,
  expandedLoop = false,
  expandedObjectFit = "cover",
  open: openProp,
  clickToExpand = true,
  onOpenChange,
}: ExpandableVideoProps) {
  const expandedVideoClassName =
    expandedObjectFit === "contain"
      ? "absolute left-1/2 top-1/2 h-full w-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-contain object-center"
      : "absolute left-1/2 top-1/2 h-full w-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.32] object-cover object-center";
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = openProp ?? uncontrolledOpen;

  function setOpen(next: boolean) {
    if (openProp === undefined) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  }

  return (
    <>
      <motion.div
        layoutId={`video-modal-${videoId}`}
        onClick={() => {
          if (!disabled && clickToExpand) {
            setOpen(true);
          }
        }}
        className={`h-full w-full relative group ${
          disabled || !clickToExpand ? "cursor-default" : "cursor-pointer"
        }`}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 p-4 sm:p-8"
            onClick={() => setOpen(false)}
          >
            <motion.div
              layoutId={`video-modal-${videoId}`}
              className="relative w-full max-w-5xl aspect-video overflow-hidden rounded-[28px] bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 overflow-hidden">
                <video
                  autoPlay
                  controls
                  muted={expandedMuted}
                  loop={expandedLoop}
                  playsInline
                  className={expandedVideoClassName}
                  src={fullSrc}
                />
              </div>
              <button
                type="button"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 hover:scale-105"
                onClick={() => setOpen(false)}
                aria-label="Cerrar video"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
