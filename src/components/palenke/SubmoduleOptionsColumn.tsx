"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import type { ViewerRole } from "@/lib/mock-data";
import { withRole } from "@/lib/viewer";

export type SubmoduleOption = {
  id: string;
  title: string;
  bullets: string[];
  color: string;
  lightBg: string;
  href: string;
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

export function SubmoduleOptionsColumn({ items, role }: SubmoduleOptionsColumnProps) {
  return (
    <motion.nav
      className="space-y-3"
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
            className="group relative block overflow-hidden rounded-[22px] border bg-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/20"
            style={{ borderColor: item.color }}
          >
            <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: item.color }} />
            <span
              className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-35"
              style={{ background: item.color }}
            />

            <div className="pl-5 pr-4 py-4" style={{ background: item.lightBg }}>
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-semibold leading-6 text-[#1a1a1a]">{item.title}</h4>
                  <ul className="mt-2 space-y-1.5">
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
                  className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-white/90 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
