"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function Objective() {
  return (
    <section id="proposito" className="py-20 bg-[#FFF8EA] border-b border-[#2D1B14]/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#1A5C38] font-bold text-sm tracking-widest uppercase mb-2 block">
            Objetivo Político-Comunitario
          </span>
          <h2 className="text-3xl md:text-5xl font-syne font-bold text-[#2D1B14]">
            Para qué es esta plataforma
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow-lg border-l-8 border-[#D9A441]"
          >
            <p className="text-lg md:text-xl text-[#1E1E1E] leading-relaxed mb-6 font-medium">
              La plataforma nace para fortalecer la institucionalidad comunitaria y la defensa del territorio.
            </p>
            <p className="text-lg md:text-xl text-[#1E1E1E] leading-relaxed">
              No es una simple web informativa, sino una herramienta para gestionar y visibilizar el gobierno propio.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative p-8 bg-[#1A5C38] rounded-2xl text-[#FFF8EA]"
          >
            <Quote className="absolute top-4 left-4 w-12 h-12 text-[#D9A441] opacity-30" />
            <p className="relative z-10 text-xl font-syne font-semibold italic leading-relaxed">
              "Los actores comunitarios no son 'usuarios finales', sino sujetos políticos y productores de conocimiento."
            </p>
            <div className="mt-6 flex items-center">
              <div className="w-12 h-1 bg-[#D9A441] mr-4"></div>
              <span className="text-sm font-bold uppercase tracking-wider text-[#D9A441]">
                Principio Fundamental
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
