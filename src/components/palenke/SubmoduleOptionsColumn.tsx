"use client";

import Link from "next/link";
import { ArrowUpRight, Users, Sparkles, ShieldCheck, MapPin, type LucideIcon } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import type { ViewerRole } from "@/lib/mock-data";
import { withRole } from "@/lib/viewer";
import Image from "next/image";
import { useState } from "react";

export type SubmoduleOption = {
  id: string;
  title: string;
  bullets: string[];
  color: string;
  lightBg: string;
  href: string;
  imageUrl?: string;
  fallbackImageUrl?: string;
};

type SubmoduleOptionsColumnProps = {
  items: SubmoduleOption[];
  role: ViewerRole;
  layout?: "vertical" | "horizontal" | "horizontal-2cols";
};

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
  },
};

const submoduleIcons: Record<string, LucideIcon> = {
  fortalecimiento: Users,
  genero: Sparkles,
  proteccion: ShieldCheck,
  titulacion: MapPin,
};

function CoverImage({
  imageUrl,
  fallbackImageUrl,
  title,
}: {
  imageUrl: string;
  fallbackImageUrl?: string;
  title: string;
}) {
  const [imageSrc, setImageSrc] = useState(imageUrl);
  const computedFallback =
    fallbackImageUrl ?? imageUrl.replace(/\.(png|jpe?g|webp)$/i, ".svg");

  const onImageError = () => {
    if (!computedFallback || computedFallback === imageSrc) {
      return;
    }
    setImageSrc(computedFallback);
  };

  return (
    <Image
      src={imageSrc}
      alt={`Ilustración representativa para ${title}`}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      sizes="(max-width: 400px) 100vw, 400px"
      unoptimized
      onError={onImageError}
    />
  );
}

export function SubmoduleOptionsColumn({ items, role, layout = "vertical" }: SubmoduleOptionsColumnProps) {
  const containerClass = layout === "horizontal"
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
    : layout === "horizontal-2cols"
    ? "grid grid-cols-1 sm:grid-cols-2 gap-6 w-full"
    : "space-y-5";

  return (
    <motion.nav
      className={containerClass}
      variants={listVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
    >
      {items.map((item) => {
        const IconComponent = submoduleIcons[item.id] || Sparkles;
        
        return (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ 
              y: -4,
              boxShadow: `0 14px 30px -10px ${item.color}25, 0 4px 12px -5px ${item.color}15`
            }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="rounded-[22px] overflow-hidden"
          >
            <Link
              href={withRole(item.href, role)}
              className="group relative flex flex-col overflow-hidden rounded-[22px] border bg-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/20"
              style={{ borderColor: `${item.color}40` }}
            >
              {/* Visual Cover Header */}
              {item.imageUrl && (
                <div className="relative h-28 w-full overflow-hidden bg-[#f0eae0]">
                  {/* Fallback pattern while loading/missing */}
                  <div 
                    className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-40" 
                    style={{ backgroundColor: item.color, backgroundImage: "radial-gradient(circle at center, #000 1px, transparent 1px)", backgroundSize: "8px 8px" }} 
                  />
                  {item.imageUrl ? (
                    <CoverImage
                      key={item.imageUrl}
                      imageUrl={item.imageUrl}
                      fallbackImageUrl={item.fallbackImageUrl}
                      title={item.title}
                    />
                  ) : null}
                  {/* Overlay gradient for readability transition */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 mix-blend-multiply" style={{ backgroundImage: `linear-gradient(to top, ${item.color}88, transparent)` }} />
                </div>
              )}

              <div 
                className="relative flex-1 px-6 py-5 transition-colors duration-300 group-hover:bg-white" 
                style={{ background: `linear-gradient(135deg, ${item.lightBg}aa, ${item.lightBg}55)` }}
              >
                {/* Highlight glow on left border */}
                <span className="absolute inset-y-0 left-0 w-1.5 transition-all duration-300 group-hover:w-2" style={{ background: item.color }} />
                
                <div className="flex items-start gap-4">
                  {/* Submodule Premium Icon Badge */}
                  <div 
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-black/5 shadow-inner transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <h4 className="text-lg font-display font-semibold text-[#1a1a1a] leading-tight group-hover:text-black">
                        {item.title}
                      </h4>
                      
                      <span
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white/90 shadow-sm transition-all duration-300 group-hover:bg-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        style={{ borderColor: `${item.color}40` }}
                        aria-hidden="true"
                      >
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300" style={{ color: item.color }} />
                      </span>
                    </div>

                    <ul className="space-y-2">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2 text-xs leading-5 text-[#4a4540] group-hover:text-[#332f2b]">
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-125"
                            style={{ background: item.color }}
                          />
                          <span className="transition-colors duration-200">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.nav>
  );
}

