"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { withRole } from "@/lib/viewer";

type ViewerRole = "public" | "internal" | "admin";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
};

export function HeroCards({
  role,
}: {
  role: ViewerRole;
}) {
  const cards = [
    {
      title: "Memoria Afroterritorial",
      desc: "Archivo histórico y cultural comunitario.",
      href: "/memoria-afroterritorial",
      image: "/assets/hero-cards/memoria-afroterritorial.jpg",
    },
    {
      title: "Gobierno Propio",
      desc: "Instrumentos de protección y autonomía.",
      href: "/gobierno-propio",
      image: "/assets/hero-cards/gobierno-propio.jpg",
    },
    {
      title: "SCITA",
      desc: "Sistema Comunitario de Información Territorial y Ambiental.",
      href: "/scita",
      image: "/assets/hero-cards/scita.jpg",
    },
    {
      title: "Incidencia",
      desc: "Pronunciamientos, agenda y memoria viva del territorio.",
      href: "/incidencia",
      image: "/assets/hero-cards/incidencia.jpg",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {cards.map((card) => (
        <motion.div key={card.title} variants={itemVariants} className="h-full">
          <Link
            href={withRole(card.href, role)}
            className="group relative flex h-40 flex-col justify-end overflow-hidden rounded-[24px] border border-white/10 bg-[#1a1a1a] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-xl hover:shadow-black/50 sm:h-56 sm:p-5 xl:h-60"
          >
            <Image
              src={card.image}
              alt={card.title}
              fill
              sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 23vw, 48vw"
              className="absolute inset-0 h-full w-full object-cover opacity-50 transition-all duration-500 group-hover:scale-105 group-hover:opacity-65"
            />
            <div className="absolute inset-0 bg-black/35 transition-opacity duration-300 group-hover:bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/75 to-black/25 opacity-95 transition-opacity duration-300 group-hover:opacity-70" />

            <div className="relative z-10 translate-y-2 transition-transform duration-300 group-hover:translate-y-0 sm:translate-y-4">
              <h3 className="font-display text-base text-white sm:text-2xl">{card.title}</h3>
              <p className="mt-1 hidden text-sm leading-relaxed text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:mt-2 sm:block">
                {card.desc}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
