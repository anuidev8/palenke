"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Layers, Shield, FileText, Users, Map, Database } from "lucide-react";

export default function MVP() {
  const features = [
    {
      title: "Estructura y Roles",
      icon: <Users className="w-6 h-6 text-[#1A5C38]" />,
      items: [
        "Accesos básicos por rol (público, interno Palenke, admin).",
        "Tres niveles de visibilidad: público, interno, restringido.",
        "Aplicación inicial del protocolo de seguridad territorial digital."
      ]
    },
    {
      title: "Contenidos Prioritarios",
      icon: <FileText className="w-6 h-6 text-[#D9A441]" />,
      items: [
        "Carga de reglamentos internos y planes de etnodesarrollo.",
        "Rutas de litigio estratégico (incluidas enfoque de género).",
        "Fichas básicas de 2–3 Áreas de Conservación Comunitaria."
      ]
    },
    {
      title: "Biblioteca Base",
      icon: <Database className="w-6 h-6 text-[#2D1B14]" />,
      items: [
        "Secciones: Gobierno Propio, Producción técnica/política, Material pedagógico.",
        "Buscador sencillo por título y palabra clave.",
        "Página especial de Mujeres, Juventudes y Niñez."
      ]
    },
    {
      title: "SIG (Visor Mínimo Viable)",
      icon: <Map className="w-6 h-6 text-[#0F3D5A]" />,
      items: [
        "Integración (iframe/embebido) con desarrollador propio.",
        "3 capas: ACCs, Maritorios, Ecosistemas estratégicos.",
        "Sin coordenadas sensibles (respeto estricto por la seguridad)."
      ]
    },
    {
      title: "Área Interna Mínima",
      icon: <Shield className="w-6 h-6 text-[#1A5C38]" />,
      items: [
        "Login seguro para equipo del Palenke.",
        "Gestión sencilla para subir, editar y publicar contenidos.",
        "Control de visibilidad (público/privado)."
      ]
    }
  ];

  return (
    <section id="mvp" className="py-24 bg-[#FFF8EA] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-[#2D1B14] text-[#FFF8EA] text-xs font-bold uppercase tracking-wider mb-4">
            Horizonte: 1 mes - 2 semanas ejecución del proyecto + 2 semanas de pruebas
          </span>
          <h2 className="text-3xl md:text-5xl font-syne font-bold text-[#2D1B14] mb-4">
            Alcance del MVP
          </h2>
          <p className="text-xl font-bold text-[#1A5C38] bg-[#1A5C38]/10 inline-block px-4 py-2 rounded-lg">
            Presupuesto estimado: $8.500.000 COP
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-[#2D1B14]/5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-[#FFF8EA] rounded-lg mr-3 border border-[#2D1B14]/5">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[#2D1B14] font-syne">{feature.title}</h3>
              </div>
              <ul className="space-y-3">
                {feature.items.map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-[#1E1E1E]/80">
                    <CheckCircle2 className="w-4 h-4 text-[#1A5C38] mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
            
            {/* Narrative Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-[#2D1B14] p-6 rounded-2xl shadow-lg text-[#FFF8EA] flex flex-col justify-center"
            >
                <div className="flex items-center mb-4">
                    <div className="p-2 bg-[#D9A441]/20 rounded-lg mr-3">
                        <Layers className="w-6 h-6 text-[#D9A441]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#D9A441] font-syne">Narrativa y Estética</h3>
                </div>
                <p className="text-sm opacity-90 mb-4">
                    Estética afro contemporánea con raíz territorial. Espacios pensados para fotografía comunitaria real, evitando la folclorización y lo &quot;afro decorativo&quot;.
                </p>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
