"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, FileText, BookOpen, Scale, Leaf, Gavel, Droplets, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { useState } from "react";
import type { ElementType } from "react";

interface Instrument {
  id: string;
  title: string;
  bullets: string[];
  color: string;
  lightBg: string;
  href: string;
  imageUrl: string;
  fallbackImageUrl?: string;
}

const ICONS: Record<string, ElementType> = {
  reglamentos: FileText,
  "planes-uso": BookOpen,
  litigio: Scale,
  conservacion: Leaf,
  etnodesarrollo: Gavel,
  "proteccion-hidrica": Droplets,
  "seguridad-juridica": Shield,
};

interface Props {
  instruments: Instrument[];
  role: string;
}

function withRole(href: string, role: string) {
  void role;
  return href;
}

function Card({ item, role, index }: { item: Instrument; role: string; index: number }) {
  const Icon = ICONS[item.id] ?? FileText;
  const [expanded, setExpanded] = useState(false);
  const [imageSrc, setImageSrc] = useState(item.imageUrl);
  const showCollapse = item.bullets.length > 2;
  const visibleBullets = expanded ? item.bullets : item.bullets.slice(0, 2);
  const fallbackImageUrl =
    item.fallbackImageUrl ?? item.imageUrl.replace(/\.(png|jpe?g|webp)$/i, ".svg");

  const onImageError = () => {
    if (!fallbackImageUrl || fallbackImageUrl === imageSrc) {
      return;
    }
    setImageSrc(fallbackImageUrl);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="flex flex-col bg-white rounded-3xl border border-[#e8dfd3] shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Top Image */}
      <div className="relative h-48 w-full bg-[#f8f5f2] border-b border-[#e8dfd3]">
        <Image 
          src={imageSrc}
          alt={item.title} 
          fill
          className="object-cover"
          unoptimized
          onError={onImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Label badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-[#1a1a1a] shadow-sm">
            Instrumento de gobierno
          </span>
        </div>

        {/* Icon Floating */}
        <div 
          className="absolute -bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-2xl shadow-md border-2 border-white"
          style={{ background: item.lightBg, color: item.color }}
        >
          <Icon className="h-6 w-6" strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6 sm:p-8 pt-8">
        <h3 className="font-display text-2xl text-[#1a1a1a] mb-5 leading-tight">{item.title}</h3>
        
        <ul className="space-y-3 mb-6 flex-1">
          {visibleBullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: item.color }} />
              <span className="text-sm sm:text-base text-[#4a4540] leading-snug">{bullet}</span>
            </li>
          ))}
        </ul>

        {showCollapse && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-sm font-medium text-[#7a756e] hover:text-[#1a1a1a] transition-colors mb-6 self-start"
          >
            {expanded ? (
              <>Ver menos <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>Ver más <ChevronDown className="w-4 h-4" /></>
            )}
          </button>
        )}

        <div className="pt-6 mt-auto border-t border-[#e8dfd3]">
          <Link
            href={withRole(item.href, role)}
            className="inline-flex items-center justify-between w-full group"
          >
            <span className="text-sm font-semibold text-[#1a1a1a] group-hover:text-black transition-colors">
              Explorar instrumento
            </span>
            <span 
              className="flex h-8 w-8 items-center justify-center rounded-full transition-transform group-hover:translate-x-1"
              style={{ background: item.lightBg, color: item.color }}
            >
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function InstrumentDashboardGrid({ instruments, role }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {instruments.map((item, i) => (
        <Card key={item.id} item={item} role={role} index={i} />
      ))}
    </div>
  );
}
