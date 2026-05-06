"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export interface ScitaLayer {
  id: string;
  label: string;
  abbr: string;
  color: string;
  lightBg: string;
  active: boolean;
}

interface ScitaLayerTogglesProps {
  initialLayers: ScitaLayer[];
  variant?: "light" | "dark";
}

export function ScitaLayerToggles({ initialLayers, variant = "light" }: ScitaLayerTogglesProps) {
  const [layers, setLayers] = useState(initialLayers);

  function toggle(id: string) {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l))
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {layers.map((capa) => (
        <motion.div
          key={capa.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{
            boxShadow: capa.active
              ? `0 0 0 2px ${capa.color}55, 0 8px 24px -4px ${capa.color}33`
              : "0 4px 16px -4px rgba(0,0,0,0.10)",
          }}
          onClick={() => toggle(capa.id)}
          className={`flex cursor-pointer items-center gap-4 rounded-[20px] border px-4 py-4 transition-colors ${
            variant === "dark" ? "bg-[#1a1a1a]/80 backdrop-blur-sm" : "bg-white"
          }`}
          style={{
            borderColor: capa.active ? capa.color : variant === "dark" ? "rgba(255,255,255,0.1)" : "#e8dfd3",
            borderLeftWidth: capa.active ? "3px" : "1px",
          }}
          role="switch"
          aria-checked={capa.active}
          tabIndex={0}
          onKeyDown={(e) => (e.key === " " || e.key === "Enter") && toggle(capa.id)}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
            style={{ background: capa.lightBg, color: capa.color }}
          >
            {capa.abbr.slice(0, 3)}
          </div>

          <div className="min-w-0 flex-1">
            <p className={`truncate text-sm font-semibold ${variant === "dark" ? "text-white" : "text-[#1a1a1a]"}`}>
              {capa.label}
            </p>
            <motion.p
              className="mt-0.5 text-xs"
              animate={{ color: capa.active ? capa.color : variant === "dark" ? "#a3a3a3" : "#7a756e" }}
              transition={{ duration: 0.2 }}
            >
              {capa.active ? "Activa" : "Disponible"}
            </motion.p>
          </div>

          <div
            className="relative h-5 w-9 rounded-full transition-colors duration-200"
            style={{ background: capa.active ? capa.color : variant === "dark" ? "rgba(255,255,255,0.1)" : "#e8dfd3" }}
            aria-hidden="true"
          >
            <motion.div
              className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
              animate={{ x: capa.active ? 18 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
