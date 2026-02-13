"use client";

import { motion } from "framer-motion";
import { Server, Shield, FileJson, Cloud, BookOpen } from "lucide-react";

export default function Technical() {
  return (
    <section id="tecnico" className="py-24 bg-[#1A5C38] text-[#FFF8EA] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#D9A441] font-bold text-sm tracking-widest uppercase mb-2 block">
            Infraestructura
          </span>
          <h2 className="text-3xl md:text-5xl font-syne font-bold mb-6">
            Enfoque técnico robusto y documentado
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-start bg-[#0F3D5A]/30 p-6 rounded-2xl backdrop-blur-sm border border-[#FFF8EA]/10">
            <Server className="w-8 h-8 text-[#D9A441] mb-4" />
            <h3 className="font-bold text-xl mb-2 font-syne">Backend Robusto</h3>
            <p className="text-sm opacity-80">Base de datos estructurada para soportar crecimiento futuro.</p>
          </div>

          <div className="flex flex-col items-start bg-[#0F3D5A]/30 p-6 rounded-2xl backdrop-blur-sm border border-[#FFF8EA]/10">
            <FileJson className="w-8 h-8 text-[#D9A441] mb-4" />
            <h3 className="font-bold text-xl mb-2 font-syne">Integración SIG</h3>
            <p className="text-sm opacity-80">Conexión fluida con APIs externas y visores de mapas.</p>
          </div>

          <div className="flex flex-col items-start bg-[#0F3D5A]/30 p-6 rounded-2xl backdrop-blur-sm border border-[#FFF8EA]/10">
            <Shield className="w-8 h-8 text-[#D9A441] mb-4" />
            <h3 className="font-bold text-xl mb-2 font-syne">Seguridad Avanzada</h3>
            <p className="text-sm opacity-80">SSL, backups automáticos y acceso estricto por roles.</p>
          </div>

          <div className="flex flex-col items-start bg-[#0F3D5A]/30 p-6 rounded-2xl backdrop-blur-sm border border-[#FFF8EA]/10">
            <Cloud className="w-8 h-8 text-[#D9A441] mb-4" />
            <h3 className="font-bold text-xl mb-2 font-syne">Hosting Profesional</h3>
            <p className="text-sm opacity-80">Alojamiento en VPS o nube para garantizar disponibilidad.</p>
          </div>

          <div className="flex flex-col items-start bg-[#0F3D5A]/30 p-6 rounded-2xl backdrop-blur-sm border border-[#FFF8EA]/10 md:col-span-2">
            <BookOpen className="w-8 h-8 text-[#D9A441] mb-4" />
            <h3 className="font-bold text-xl mb-2 font-syne">Entrega y Capacitación</h3>
            <p className="text-sm opacity-80">Código documentado, manual técnico y capacitación al equipo del Palenke para gestionar la plataforma con autonomía.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
