"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// Types for visibility to ensure type safety
export type VisibilityType = "publico" | "interno" | "sensible";

interface DocumentCardProps {
  title: string;
  category: string;
  date: string;
  visibility: VisibilityType;
  thumbnailUrl?: string; // Gemini generated abstract thumbnail
  href?: string;
}

const visibilityConfig = {
  publico: { label: "Público", color: "bg-palenke-public text-white" },
  interno: { label: "Uso Interno", color: "bg-palenke-internal text-white" },
  sensible: { label: "Sensible", color: "bg-palenke-sensitive text-white" },
};

export default function DocumentCard({
  title,
  category,
  date,
  visibility,
  thumbnailUrl,
  href,
}: DocumentCardProps) {
  const badge = visibilityConfig[visibility] || visibilityConfig.publico;
  const card = (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(26, 54, 41, 0.1)" }}
      className="bg-palenke-cream border border-palenke-forest/10 p-5 rounded flex h-full flex-col justify-between transition-shadow duration-300"
    >
      <div>
        {/* Top Header: Category & Badge */}
        <div className="mb-4 flex items-start justify-between">
          <span className="text-xs font-sans font-semibold tracking-wider text-palenke-forest/60 uppercase">
            {category}
          </span>
          <span
            className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${badge.color}`}
          >
            {badge.label}
          </span>
        </div>

        {/* Optional Gemini Thumbnail */}
        {thumbnailUrl ? (
          <div className="mb-4 h-32 w-full overflow-hidden rounded-sm">
            <img src={thumbnailUrl} alt="" className="h-full w-full object-cover opacity-80" />
          </div>
        ) : null}

        {/* Title */}
        <h3 className="font-display text-xl text-palenke-forest leading-snug mb-3">
          {title}
        </h3>
      </div>

      {/* Footer metadata */}
      <div className="mt-4 flex items-center justify-between border-t border-palenke-forest/10 pt-4 text-sm font-sans text-palenke-forest/70">
        <span>{date}</span>
        <span className="flex items-center gap-1 text-palenke-gold font-medium">
          Leer <span aria-hidden="true">&rarr;</span>
        </span>
      </div>
    </motion.article>
  );

  if (!href) {
    return card;
  }

  return (
    <Link
      href={href}
      aria-label={`Abrir detalle: ${title}`}
      className="block h-full rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-palenke-gold focus-visible:ring-offset-2"
    >
      {card}
    </Link>
  );
}
