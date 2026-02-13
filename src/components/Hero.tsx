"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Pattern - Topography/River inspiration */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="topo" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="none" stroke="#2D1B14" strokeWidth="0.5"/>
             <path d="M0 50 C 50 100 80 0 100 50" fill="none" stroke="#1A5C38" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#topo)" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-[#D9A441]/20 text-[#D9A441] text-sm font-bold uppercase tracking-wider mb-6 border border-[#D9A441]/30">
            Propuesta de Co-Diseño
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-syne text-[#2D1B14] leading-tight mb-6">
            Plataforma Palenke: <br/>
            <span className="text-[#1A5C38]">infraestructura digital</span> para pensar y defender el territorio
          </h1>
          
          <p className="text-xl md:text-2xl text-[#1E1E1E]/80 mb-10 max-w-3xl mx-auto font-medium">
            Propuesta de MVP afroterritorial, construida con el PCN y sus comunidades.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
            {[
              "Infraestructura digital, no web institucional.",
              "Centro de pensamiento, memoria, SIG e incidencia.",
              "Trabajo por fases, empezando por un MVP ajustado."
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start bg-white/60 p-4 rounded-lg border-l-4 border-[#1A5C38] shadow-sm"
              >
                <span className="mr-2 text-[#1A5C38]">✦</span>
                <span className="text-sm font-medium text-[#2D1B14]">{item}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="#mvp" 
              className="inline-flex items-center justify-center px-8 py-4 bg-[#2D1B14] text-[#FFF8EA] rounded-full font-bold hover:bg-[#1A5C38] transition-all transform hover:scale-105 shadow-lg"
            >
              Ver alcance del MVP
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="#proposito" 
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-[#2D1B14] text-[#2D1B14] rounded-full font-bold hover:bg-[#2D1B14] hover:text-[#FFF8EA] transition-all"
            >
              Leer objetivo
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-[#2D1B14]/50"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
}
