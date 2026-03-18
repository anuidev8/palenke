"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";

export type GobiernoSubmoduleCard = {
  id: string;
  title: string;
  bullets: string[];
  color: string;
  lightBg: string;
  href: string;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.02,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

export function GobiernoSubmodulesGrid({ items }: { items: GobiernoSubmoduleCard[] }) {
  return (
    <motion.div
      className="grid gap-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {items.map((item) => (
        <motion.article
          key={item.id}
          variants={cardVariants}
          whileHover={{ y: -3 }}
          className="relative overflow-hidden rounded-[24px] border p-5 sm:p-6"
          style={{ borderColor: item.color, background: item.lightBg }}
        >
          <Link
            href={item.href}
            aria-label={`Abrir ${item.title}`}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white/75 transition hover:bg-white"
            style={{ borderColor: item.color }}
          >
            <ArrowUpRight className="h-4 w-4" style={{ color: item.color }} aria-hidden="true" />
          </Link>

          <h4 className="pr-12 font-display text-2xl leading-tight text-[#1a1a1a] sm:text-3xl">
            {item.title}
          </h4>

          <ul className="mt-4 space-y-2.5">
            {item.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5 text-base leading-7 text-[#4a4540]">
                <span
                  className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: item.color }}
                />
                {bullet}
              </li>
            ))}
          </ul>
        </motion.article>
      ))}
    </motion.div>
  );
}
