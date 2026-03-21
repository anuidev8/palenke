"use client";

import { motion, type Variants } from "framer-motion";
import { Target, Map, Compass, ShieldCheck } from "lucide-react";

const functions = [
  {
    text: "Fortalecer la capacidad de decisión de los Consejos Comunitarios",
    icon: Target,
    color: "#2e7d32",
    bg: "#d8f3dc",
  },
  {
    text: "Estructurar y difundir instrumentos de gobernanza territorial",
    icon: Map,
    color: "#1565c0",
    bg: "#e3f2fd",
  },
  {
    text: "Acompañar la planificación comunitaria del territorio",
    icon: Compass,
    color: "#f57f17",
    bg: "#fff3cd",
  },
  {
    text: "Consolidar la autoridad territorial afrodescendiente",
    icon: ShieldCheck,
    color: "#d32f2f",
    bg: "#fddede",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function GovernmentFunctionsList() {
  return (
    <motion.ul
      className="space-y-3"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
    >
      {functions.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.li
            key={idx}
            variants={itemVariants}
            whileHover={{ x: 2 }}
            className="group flex items-start gap-4 p-2 rounded-xl transition-colors hover:bg-[#f8f5f2] cursor-default"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm border border-black/5"
              style={{ backgroundColor: item.bg, color: item.color }}
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="text-base font-medium leading-relaxed text-[#4a4540] transition-colors group-hover:text-[#1a1a1a] mt-1.5">
              {item.text}
            </span>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
