"use client";

import { motion } from "framer-motion";
import { Users, Lock, Unlock, EyeOff, Scale, ShieldCheck } from "lucide-react";

export default function Governance() {
  const levels = [
    {
      title: "Público",
      icon: <Unlock className="w-6 h-6" />,
      desc: "Documentos políticos, estudios, ACC, materiales pedagógicos.",
      color: "bg-[#1A5C38]",
      text: "text-[#FFF8EA]"
    },
    {
      title: "Interno",
      icon: <Lock className="w-6 h-6" />,
      desc: "Instrumentos estratégicos, documentos en construcción.",
      color: "bg-[#D9A441]",
      text: "text-[#2D1B14]"
    },
    {
      title: "Sensible / Restringido",
      icon: <EyeOff className="w-6 h-6" />,
      desc: "Información territorial estratégica, coordenadas, bases de datos comunitarias.",
      color: "bg-[#2D1B14]",
      text: "text-[#FFF8EA]"
    }
  ];

  return (
    <section id="actores" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFF8EA] rounded-bl-full opacity-50 pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#D9A441] font-bold text-sm uppercase tracking-widest block mb-2">
            Estructura y Gobernanza
          </span>
          <h2 className="text-3xl md:text-5xl font-syne font-bold text-[#2D1B14] mb-6">
            Actores clave y decisiones sobre el conocimiento
          </h2>
          <p className="text-lg text-[#1E1E1E]/80 max-w-2xl mx-auto">
            La plataforma refleja la estructura política del PCN, donde la comunidad es el eje central.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-2xl bg-[#FFF8EA] border border-[#2D1B14]/5 shadow-sm"
          >
            <div className="w-12 h-12 bg-[#2D1B14] rounded-full flex items-center justify-center text-[#FFF8EA] mb-6">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#2D1B14] mb-3">Comunidad como Eje</h3>
            <p className="text-[#1E1E1E]/80">
              Los actores comunitarios, Consejos Comunitarios y liderazgos territoriales son el eje estructural de la plataforma.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-2xl bg-[#FFF8EA] border border-[#2D1B14]/5 shadow-sm"
          >
            <div className="w-12 h-12 bg-[#1A5C38] rounded-full flex items-center justify-center text-[#FFF8EA] mb-6">
              <Scale size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#2D1B14] mb-3">Curaduría Política</h3>
            <p className="text-[#1E1E1E]/80">
              La coordinación del Palenke y el equipo técnico curan contenidos bajo el marco político del PCN.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-2xl bg-[#FFF8EA] border border-[#2D1B14]/5 shadow-sm"
          >
            <div className="w-12 h-12 bg-[#D9A441] rounded-full flex items-center justify-center text-[#2D1B14] mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#2D1B14] mb-3">Decisiones Protegidas</h3>
            <p className="text-[#1E1E1E]/80">
              Qué es público, interno o sensible lo decide la coordinación junto con autoridades comunitarias y el comité de género.
            </p>
          </motion.div>
        </div>

        {/* Access Levels */}
        <div className="bg-[#FFF8EA] rounded-3xl p-8 md:p-12 border border-[#2D1B14]/10">
          <h3 className="text-2xl font-syne font-bold text-[#2D1B14] mb-8 text-center">
            Niveles de Acceso y Visibilidad
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {levels.map((level, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`${level.color} ${level.text} p-6 rounded-xl flex flex-col items-center text-center shadow-lg`}
              >
                <div className="mb-4 bg-white/20 p-3 rounded-full">
                  {level.icon}
                </div>
                <h4 className="font-bold text-lg mb-2">{level.title}</h4>
                <p className="text-sm opacity-90">{level.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
