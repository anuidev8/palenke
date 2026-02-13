"use client";

import { motion } from "framer-motion";
import { MessageCircle, HeartHandshake, CheckCheck } from "lucide-react";
import Link from "next/link";

export default function CoDesign() {
  return (
    <section id="codiseno" className="py-24 bg-[#FFF8EA] relative border-t border-[#2D1B14]/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-10 md:p-16 shadow-xl border border-[#2D1B14]/5 relative overflow-hidden"
        >
           {/* Decorative elements */}
           <div className="absolute top-0 left-0 w-32 h-32 bg-[#D9A441]/10 rounded-br-full"></div>
           <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#1A5C38]/10 rounded-tl-full"></div>

          <span className="text-[#1A5C38] font-bold text-sm tracking-widest uppercase mb-4 block">
            Próximos Pasos
          </span>
          <h2 className="text-3xl md:text-5xl font-syne font-bold text-[#2D1B14] mb-8">
            Co-diseño con el Palenke y el PCN
          </h2>

          <div className="text-left space-y-6 mb-10 max-w-2xl mx-auto">
            <div className="flex items-start">
              <HeartHandshake className="w-6 h-6 text-[#D9A441] mr-4 flex-shrink-0 mt-1" />
              <p className="text-[#1E1E1E]/80 font-medium">
                El trabajo se hace en co-diseño con la institucionalidad comunitaria y el equipo político/técnico.
              </p>
            </div>
            <div className="flex items-start">
              <CheckCheck className="w-6 h-6 text-[#1A5C38] mr-4 flex-shrink-0 mt-1" />
              <p className="text-[#1E1E1E]/80 font-medium">
                La Fase 1 de descubrimiento ya tiene bases con las respuestas que compartieron, y ahora se puede aterrizar el MVP.
              </p>
            </div>
            <div className="flex items-start">
              <MessageCircle className="w-6 h-6 text-[#0F3D5A] mr-4 flex-shrink-0 mt-1" />
              <p className="text-[#1E1E1E]/80 font-medium">
                El presupuesto del MVP ($8.500.000 COP) está pensado para cumplir lo que priorizaron sin sobreprometer.
              </p>
            </div>
            <div className="flex items-start">
              <CheckCheck className="w-6 h-6 text-[#2D1B14] mr-4 flex-shrink-0 mt-1" />
              <p className="text-[#1E1E1E]/80 font-medium">
                La Fase 2 se construirá con calma, después de ver la plataforma en uso.
              </p>
            </div>
          </div>

          <Link
            href="https://wa.me/573206456179?text=Coordinar%20pr%C3%B3xima%20reuni%C3%B3n%20de%20co-dise%C3%B1o.%20Revisemos%20juntos%20el%20alcance%20del%20MVP."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-5 bg-[#2D1B14] text-[#FFF8EA] font-bold text-lg rounded-full hover:bg-[#1A5C38] transition-all transform hover:scale-105 shadow-lg"
          >
            Coordinar próxima reunión de co-diseño
          </Link>
          <p className="mt-4 text-sm text-[#1E1E1E]/50">
            Revisemos juntos el alcance del MVP.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
