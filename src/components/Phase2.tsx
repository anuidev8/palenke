"use client";

import { motion } from "framer-motion";
import { Search, GitMerge, MapPin, Archive, Globe } from "lucide-react";

export default function Phase2() {
  const improvements = [
    {
      icon: <Search className="w-8 h-8 text-[#D9A441]" />,
      title: "Buscadores avanzados",
      desc: "Filtros múltiples por territorio, enfoque, actores, etc."
    },
    {
      icon: <GitMerge className="w-8 h-8 text-[#0F3D5A]" />,
      title: "Workflows complejos",
      desc: "Varios niveles de aprobación, historiales, comités editoriales."
    },
    {
      icon: <MapPin className="w-8 h-8 text-[#1A5C38]" />,
      title: "Integraciones SIG",
      desc: "Más capas, dashboards, análisis y visualizaciones específicas."
    },
    {
      icon: <Archive className="w-8 h-8 text-[#2D1B14]" />,
      title: "Ampliación del archivo",
      desc: "Más documentos, multimedia, estadísticas propias."
    },
    {
      icon: <Globe className="w-8 h-8 text-[#1A5C38]" />,
      title: "Accesibilidad",
      desc: "Idiomas y experiencias específicas para distintos tipos de usuarios."
    }
  ];

  return (
    <section id="fase2" className="py-24 bg-[#E8F0F2] border-t border-[#2D1B14]/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#0F3D5A] font-bold text-sm tracking-widest uppercase mb-2 block">
            Futuro del Proyecto
          </span>
          <h2 className="text-3xl md:text-5xl font-syne font-bold text-[#0F3D5A] mb-6">
            Qué vendría después del MVP
          </h2>
          <p className="text-lg text-[#1E1E1E]/70 max-w-2xl mx-auto">
            Esta fase se define después de validar el uso real del MVP con comunidades y equipo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {improvements.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm text-center hover:bg-[#FFF8EA] transition-colors border border-transparent hover:border-[#D9A441]"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-[#2D1B14] mb-2 leading-tight">{item.title}</h3>
              <p className="text-sm text-[#1E1E1E]/70">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
