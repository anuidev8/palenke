"use client";

import Image from "next/image";
import { motion } from 'framer-motion';

const easePalenke: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function HeroSection({ 
  generatedImageUrl,
  eyebrow,
  title, 
  description, 
  actions 
}: { 
  generatedImageUrl?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description: React.ReactNode;
  actions: React.ReactNode;
}) {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-[color:var(--forest)]">
      
      {/* Background Image full cover */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        {generatedImageUrl ? (
          <Image
            src={generatedImageUrl}
            alt="Ilustración simbólica del territorio"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[color:var(--forest)] animate-pulse" />
        )}
        
        {/* Gradient overlays to ensure text is always readable and add depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--forest)] via-[color:var(--forest)]/50 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-[color:var(--forest)]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--forest)]/80 via-[color:var(--forest)]/40 to-transparent" />
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 lg:px-12 flex flex-col justify-center">
        
        {/* Text Content */}
        <div className="flex flex-col space-y-8 max-w-3xl">
          {eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easePalenke }}
              className="inline-flex items-center gap-3 w-fit"
            >
              <span className="h-px w-8 bg-[color:var(--sand)]/60" />
              <span className="uppercase tracking-widest text-sm font-semibold text-[color:var(--sand)]/90">{eyebrow}</span>
            </motion.div>
          )}

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easePalenke }}
            className="text-5xl lg:text-7xl font-display font-medium text-[color:var(--sand)] leading-[1.1] drop-shadow-md"
          >
            {title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easePalenke, delay: 0.15 }}
            className="text-lg lg:text-xl font-sans text-[color:var(--sand)]/90 leading-relaxed max-w-2xl drop-shadow-md"
          >
            {description}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easePalenke, delay: 0.3 }}
            className="pt-6 flex flex-wrap gap-4"
          >
            {actions}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
