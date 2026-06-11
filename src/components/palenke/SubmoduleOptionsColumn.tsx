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
  /** link = navigate away; filter = select line of work on same page; static = view only */
  mode?: "link" | "filter" | "static";
  activeId?: string | null;
  filterBasePath?: string;
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

export function SubmoduleOptionsColumn({
  items,
  role,
  layout = "vertical",
  mode = "link",
  activeId = null,
  filterBasePath,
}: SubmoduleOptionsColumnProps) {
  const interactive = mode !== "static";
  const containerClass = layout === "horizontal"
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full items-stretch"
    : layout === "horizontal-2cols"
    ? "grid grid-cols-1 sm:grid-cols-2 gap-5 w-full items-stretch"
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
        const isSelected = mode === "filter" && activeId === item.id;
        const href =
          mode === "filter" && filterBasePath
            ? withRole(`${filterBasePath}?submodulo=${item.id}`, role)
            : withRole(item.href, role);

        const cardClassName = [
          "group relative flex h-full min-h-[172px] flex-col overflow-hidden rounded-[22px] border bg-white transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/20",
          isSelected
            ? "border-2 shadow-md"
            : "border hover:shadow-md",
        ].join(" ");
        const cardStyle = {
          borderColor: isSelected ? item.color : `${item.color}35`,
          background: isSelected
            ? `linear-gradient(160deg, ${item.lightBg}f2 0%, #ffffff 72%)`
            : "#ffffff",
          boxShadow: isSelected
            ? `0 10px 28px -14px ${item.color}55, inset 0 1px 0 rgba(255,255,255,0.8)`
            : undefined,
        };

        const cardBody = (
            <>
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
                className="relative flex flex-1 flex-col px-5 py-5 transition-colors duration-300 sm:px-6"
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${item.lightBg}cc, ${item.lightBg}40)`
                    : `linear-gradient(135deg, ${item.lightBg}aa, ${item.lightBg}55)`,
                }}
              >
                {/* Left accent */}
                <span
                  className={`absolute inset-y-0 left-0 transition-all duration-300 ${isSelected ? "w-[5px]" : "w-1.5 group-hover:w-2"}`}
                  style={{ background: item.color }}
                />

                <div className="flex h-full flex-col gap-4 pl-1">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border shadow-inner transition-transform duration-300 ${isSelected ? "scale-105" : "group-hover:scale-105"}`}
                      style={{
                        backgroundColor: isSelected ? `${item.color}22` : `${item.color}15`,
                        borderColor: isSelected ? `${item.color}40` : "rgba(0,0,0,0.05)",
                        color: item.color,
                      }}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-h-[4.25rem] flex-1">
                          <h4
                            className={`text-base font-display font-semibold leading-snug sm:text-lg ${
                              isSelected ? "text-[#1a1a1a]" : "text-[#1a1a1a] group-hover:text-black"
                            }`}
                          >
                            {item.title}
                          </h4>

                          {mode === "filter" ? (
                            <span
                              className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                isSelected ? "" : "invisible"
                              }`}
                              style={{ backgroundColor: `${item.color}18`, color: item.color }}
                              aria-hidden={!isSelected}
                            >
                              Activo
                            </span>
                          ) : null}
                        </div>

                        {mode === "link" ? (
                          <span
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white/90 shadow-sm transition-all duration-300 group-hover:bg-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            style={{ borderColor: `${item.color}40` }}
                            aria-hidden="true"
                          >
                            <ArrowUpRight className="h-4 w-4" style={{ color: item.color }} />
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <ul className="mt-auto space-y-2">
                    {item.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2 text-xs leading-5 text-[#4a4540] group-hover:text-[#332f2b]"
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: item.color }}
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
        );

        return (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={
              interactive && !isSelected
                ? {
                    y: -2,
                    boxShadow: `0 12px 24px -12px ${item.color}30`,
                  }
                : undefined
            }
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="h-full"
          >
            {interactive ? (
              <Link
                href={href}
                className={cardClassName}
                style={cardStyle}
                aria-current={isSelected ? "page" : undefined}
              >
                {cardBody}
              </Link>
            ) : (
              <div className={cardClassName} style={cardStyle}>
                {cardBody}
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.nav>
  );
}

