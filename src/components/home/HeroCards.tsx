"use client";

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
      title: "Memoria Afrodescendiente",
      desc: "Archivo histórico y cultural comunitario.",
      href: "/memoria-afroterritorial",
      video: "https://cdn.pixabay.com/video/2019/11/10/28906-372990424_tiny.mp4",
      poster: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "Gobierno Propio",
      desc: "Instrumentos de protección y autonomía.",
      href: "/gobierno-propio",
      video: "https://cdn.pixabay.com/video/2021/08/17/85376-589953466_tiny.mp4",
      poster: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "SCITA",
      desc: "Sistema Comunitario de Información Territorial y Ambiental.",
      href: "/scita",
      video: "https://cdn.pixabay.com/video/2020/04/18/36551-413154868_tiny.mp4",
      poster: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "Noticias y eventos",
      desc: "Pronunciamientos, agenda y memoria viva del territorio.",
      href: "/noticias",
      video: "https://cdn.pixabay.com/video/2023/10/22/185986-876934526_tiny.mp4",
      poster: "https://images.unsplash.com/photo-1505235687559-28b5f54645b7?auto=format&fit=crop&q=80&w=600",
    },
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {cards.map((card) => (
        <motion.div key={card.title} variants={itemVariants} className="h-full">
          <Link
            href={withRole(card.href, role)}
            className="group relative flex h-48 flex-col justify-end overflow-hidden rounded-[24px] border border-white/10 bg-[#1a1a1a] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-xl hover:shadow-black/50 sm:h-56 xl:h-60"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              poster={card.poster}
              className="absolute inset-0 h-full w-full object-cover opacity-40 transition-all duration-500 group-hover:scale-105 group-hover:opacity-70"
            >
              <source src={card.video} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-60" />
            
            <div className="relative z-10 translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
              <h3 className="font-display text-xl text-white sm:text-2xl">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {card.desc}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
