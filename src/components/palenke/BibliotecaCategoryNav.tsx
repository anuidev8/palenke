"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export type SectionTab = {
  label: string;
  href: string;
  isActive: boolean;
};

export type TypeChip = {
  type: string;
  label: string;
  href: string;
  isActive: boolean;
};

export default function BibliotecaCategoryNav({
  sections,
  types,
}: {
  sections: SectionTab[];
  types: TypeChip[];
}) {
  return (
    <div className="mb-8 space-y-6">
      {/* ── Main Sections (Tabs) ── */}
      <div className="relative border-b border-[#e8dfd3]">
        <nav
          className="flex gap-8 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x"
          aria-label="Categorías principales"
        >
          {sections.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className={`relative whitespace-nowrap px-1 text-[15px] transition-colors snap-start ${
                s.isActive
                  ? "font-bold text-[#1a1a1a]"
                  : "font-medium text-[#7a756e] hover:text-[#1a1a1a]"
              }`}
            >
              {s.label}
              {s.isActive && (
                <motion.div
                  layoutId="activeCategoryTab"
                  className="absolute -bottom-4 left-0 right-0 h-[3px] rounded-t-full bg-[#2e7d32]"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* ── Sub-categories (Pills) ── */}
      {types.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2.5 pb-2"
        >
          {types.map((t, i) => {
            const parts = t.label.split(" · ");
            const hasSub = parts.length > 1;
            const main = hasSub ? parts[1] : t.label;

            return (
              <Link
                key={t.type || "todos"}
                href={t.href}
                className={`relative flex items-center justify-center rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all duration-300 ${
                  t.isActive
                    ? "bg-[#1a1a1a] text-white shadow-md shadow-black/10 scale-105"
                    : "bg-white text-[#4a4540] border border-[#e8dfd3] hover:border-[#c5d6c6] hover:bg-[#f8fbf8] hover:text-[#2e7d32]"
                }`}
              >
                {main}
              </Link>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
