"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Droplets, FileText, Gavel, Leaf, Scale } from "lucide-react";
import type { ElementType } from "react";

interface Instrument {
  id: string;
  title: string;
  description: string;
  color: string;
  lightBg: string;
  href: string;
}

const ICONS: Record<string, ElementType> = {
  reglamentos: FileText,
  "planes-uso": BookOpen,
  litigio: Scale,
  conservacion: Leaf,
  etnodesarrollo: Gavel,
  "proteccion-hidrica": Droplets,
};

interface InstrumentCardGridProps {
  instruments: Instrument[];
  role: string;
}

function withRole(href: string, role: string) {
  void role;
  return href;
}

export function InstrumentCardGrid({ instruments, role }: InstrumentCardGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {instruments.map((item, i) => {
        const Icon = ICONS[item.id] ?? FileText;
        return (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
              scale: 1.025,
              boxShadow: `0 0 0 2px ${item.color}44, 0 12px 32px -6px ${item.color}22`,
              transition: { type: "spring", stiffness: 380, damping: 24 },
            }}
            className="surface-card group flex h-full cursor-pointer flex-col gap-5 overflow-hidden"
            style={{ borderTopColor: item.color, borderTopWidth: "3px" }}
          >
            {/* Icon square */}
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ background: item.lightBg }}
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
            >
              <Icon className="h-6 w-6" style={{ color: item.color }} aria-hidden="true" />
            </motion.div>

            <div className="flex flex-1 flex-col gap-3">
              <h3 className="font-display text-2xl text-[#1a1a1a]">{item.title}</h3>
              <p className="text-sm leading-6 text-[#4a4540]">{item.description}</p>
            </div>

            <Link
              href={withRole(item.href, role)}
              className="mt-auto inline-flex items-center gap-2 text-sm font-semibold transition"
              style={{ color: item.color }}
              onClick={(e) => e.stopPropagation()}
            >
              Ver instrumento
              <motion.span
                className="inline-flex"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </motion.span>
            </Link>
          </motion.article>
        );
      })}
    </div>
  );
}
