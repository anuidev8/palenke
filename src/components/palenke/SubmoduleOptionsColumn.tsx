"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
};

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
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

export function SubmoduleOptionsColumn({ items, role }: SubmoduleOptionsColumnProps) {
  return (
    <motion.nav
      className="space-y-4"
      variants={listVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
        >
          <Link
            href={withRole(item.href, role)}
            className="group relative flex flex-col overflow-hidden rounded-[22px] border bg-white shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/20 hover:shadow-md"
            style={{ borderColor: item.color }}
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

            <div className="relative flex-1 px-5 py-4" style={{ background: item.lightBg }}>
              {/* Highlight strip line */}
              <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: item.color }} />
              
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1 pl-1">
                  <h4 className="text-lg font-display text-[#1a1a1a] leading-tight mb-2.5">{item.title}</h4>
                  <ul className="space-y-2">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2 text-xs leading-5 text-[#4a4540]">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: item.color }}
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                <span
                  className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-white/90 shadow-sm transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ borderColor: item.color }}
                  aria-hidden="true"
                >
                  <ArrowUpRight className="h-4 w-4" style={{ color: item.color }} />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.nav>
  );
}
