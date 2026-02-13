"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Layers, ShieldAlert, EyeOff, Info, CheckCircle2 } from "lucide-react";

export default function SIG() {
  const [activeLayer, setActiveLayer] = useState<string>("conservation");

  const layersData = [
    {
      id: "conservation",
      title: "Áreas de conservación",
      color: "#1A5C38",
      description: "Zonas protegidas bajo gobierno propio.",
      details: "Polígonos definidos por la comunidad."
    },
    {
      id: "maritorios",
      title: "Maritorios delimitados",
      color: "#0F3D5A",
      description: "Extensión territorial hacia el mar y ríos.",
      details: "Zonas de uso ancestral y pesca artesanal."
    },
    {
      id: "ecosystems",
      title: "Ecosistemas estratégicos",
      color: "#D9A441",
      description: "Manglares, humedales y bosques.",
      details: "Inventario de biodiversidad clave."
    },
    {
      id: "settlements",
      title: "Asentamientos generales",
      color: "#2D1B14",
      description: "Ubicación aproximada de comunidades.",
      details: "Sin coordenadas exactas por seguridad."
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute left-0 bottom-0 w-full h-1/2 bg-[#F5F5F5] -skew-y-3 z-0 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Content & Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-[#0F3D5A]/10 rounded-lg">
                  <Map className="w-6 h-6 text-[#0F3D5A]" />
                </div>
                <span className="text-[#0F3D5A] font-bold text-xs tracking-widest uppercase">
                  Tecnología Territorial
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-syne font-bold text-[#2D1B14] mb-4">
                SIG: Visor Mínimo Viable
              </h2>
              <p className="text-lg text-[#1E1E1E]/80 leading-relaxed">
                Una herramienta para visualizar el territorio, integrada directamente (vía iframe/embebido) con la soberanía de datos del Palenke.
              </p>
            </div>

            {/* Interactive Layer Selector */}
            <div className="bg-[#FFF8EA] rounded-2xl p-6 border border-[#D9A441]/20 shadow-sm">
              <h3 className="flex items-center font-bold text-[#2D1B14] mb-4 font-syne text-lg">
                <Layers className="w-5 h-5 mr-2 text-[#D9A441]" />
                Explorar Capas (Interactivo)
              </h3>
              <div className="space-y-2">
                {layersData.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center justify-between group ${
                      activeLayer === layer.id
                        ? "bg-white shadow-md border-l-4 border-[#1A5C38]"
                        : "hover:bg-white/50 hover:pl-5 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-center">
                      <div 
                        className={`w-3 h-3 rounded-full mr-3 transition-colors ${activeLayer === layer.id ? 'bg-[#1A5C38]' : 'bg-gray-300'}`}
                      />
                      <div>
                        <span className={`block font-bold ${activeLayer === layer.id ? 'text-[#1A5C38]' : 'text-[#2D1B14]'}`}>
                          {layer.title}
                        </span>
                        <span className="text-xs text-[#1E1E1E]/60 hidden sm:block">
                          {layer.description}
                        </span>
                      </div>
                    </div>
                    {activeLayer === layer.id && (
                      <motion.div layoutId="check">
                        <CheckCircle2 className="w-5 h-5 text-[#1A5C38]" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-start p-6 bg-[#2D1B14] rounded-xl text-[#FFF8EA]">
              <ShieldAlert className="w-8 h-8 text-[#D9A441] mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-[#D9A441] mb-1 text-lg">
                  Seguridad por diseño
                </h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  No se muestran coordenadas precisas de zonas sensibles. La información estratégica permanece resguardada.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Map Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-full min-h-[400px] flex flex-col"
          >
            <div className="flex-grow bg-[#E8F0F2] rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative group cursor-crosshair">
              
              {/* Map UI Overlay */}
              <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm text-xs font-mono text-[#0F3D5A] border border-[#0F3D5A]/10">
                LAT: 3.45** LON: -76.53** (Oculto)
              </div>

              {/* SVG Map Container */}
              <svg 
                className="w-full h-full absolute inset-0" 
                viewBox="0 0 400 400" 
                preserveAspectRatio="xMidYMid slice"
              >
                {/* Base Topography (Static) */}
                <pattern id="pattern-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2D1B14" strokeOpacity="0.05" strokeWidth="1"/>
                </pattern>
                <rect width="400" height="400" fill="url(#pattern-grid)" />
                
                {/* Abstract River */}
                <path 
                  d="M -10 300 C 100 280 150 350 250 320 S 350 380 410 350" 
                  fill="none" 
                  stroke="#0F3D5A" 
                  strokeOpacity="0.1" 
                  strokeWidth="20" 
                />

                <AnimatePresence mode="wait">
                  {/* Layer: Conservation Areas */}
                  {activeLayer === 'conservation' && (
                    <motion.g
                      key="conservation"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        d="M 50 100 Q 120 50 200 100 T 350 80 V 200 H 50 Z"
                        fill="#1A5C38"
                        fillOpacity="0.2"
                        stroke="#1A5C38"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />
                      <motion.text x="60" y="130" fill="#1A5C38" fontSize="10" fontWeight="bold">ACC 01</motion.text>
                      <motion.text x="250" y="150" fill="#1A5C38" fontSize="10" fontWeight="bold">ACC 02</motion.text>
                    </motion.g>
                  )}

                  {/* Layer: Maritorios */}
                  {activeLayer === 'maritorios' && (
                    <motion.g
                      key="maritorios"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                       <motion.rect
                        initial={{ width: 0 }}
                        animate={{ width: 400 }}
                        transition={{ duration: 0.8 }}
                        x="0" y="280" width="400" height="120"
                        fill="#0F3D5A"
                        fillOpacity="0.2"
                       />
                       {[1,2,3].map(i => (
                         <motion.path
                           key={i}
                           d={`M 0 ${290 + i*20} Q 200 ${310 + i*20} 400 ${290 + i*20}`}
                           fill="none"
                           stroke="#0F3D5A"
                           strokeWidth="1"
                           initial={{ pathLength: 0 }}
                           animate={{ pathLength: 1 }}
                           transition={{ delay: i * 0.2, duration: 1 }}
                         />
                       ))}
                    </motion.g>
                  )}

                   {/* Layer: Ecosystems */}
                   {activeLayer === 'ecosystems' && (
                    <motion.g
                      key="ecosystems"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <circle cx="300" cy="100" r="40" fill="#D9A441" fillOpacity="0.3" />
                      <circle cx="100" cy="250" r="60" fill="#D9A441" fillOpacity="0.3" />
                      <motion.circle 
                        cx="300" cy="100" r="40" 
                        stroke="#D9A441" strokeWidth="2" fill="none" strokeDasharray="4 4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.g>
                  )}

                  {/* Layer: Settlements */}
                  {activeLayer === 'settlements' && (
                    <motion.g
                      key="settlements"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                       {[
                         {x: 80, y: 150}, {x: 220, y: 120}, {x: 320, y: 280}, {x: 150, y: 320}
                       ].map((p, i) => (
                         <motion.g key={i}>
                            <motion.circle
                              initial={{ r: 0 }}
                              animate={{ r: 6 }}
                              transition={{ type: "spring", delay: i * 0.1 }}
                              cx={p.x} cy={p.y} fill="#2D1B14"
                            />
                            <motion.circle
                              initial={{ r: 0, opacity: 1 }}
                              animate={{ r: 15, opacity: 0 }}
                              transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                              cx={p.x} cy={p.y} fill="#2D1B14"
                            />
                         </motion.g>
                       ))}
                    </motion.g>
                  )}
                </AnimatePresence>

                {/* Sensitive Area (Always Hidden/Blurred) */}
                <g transform="translate(320, 40)">
                   <circle cx="0" cy="0" r="25" fill="#2D1B14" fillOpacity="0.1" />
                   <EyeOff x="-12" y="-12" width="24" height="24" className="text-[#2D1B14] opacity-50" />
                   <rect x="-30" y="30" width="60" height="16" rx="4" fill="white" fillOpacity="0.8" />
                   <text x="0" y="42" textAnchor="middle" fontSize="8" fill="#2D1B14" fontWeight="bold">SENSIBLE</text>
                </g>

              </svg>

              {/* Interactive Hover Feedback */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-[#2D1B14]/80 backdrop-blur-sm text-[#FFF8EA] px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Vista Previa: {layersData.find(l => l.id === activeLayer)?.title}
                  </div>
              </div>
            </div>

            {/* Map Legend / Footer */}
            <div className="mt-4 bg-[#FFF8EA] p-4 rounded-xl flex items-start space-x-3 border border-[#D9A441]/20">
              <Info className="w-5 h-5 text-[#D9A441] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#1E1E1E]/80">
                <span className="font-bold text-[#2D1B14]">Nota Técnica:</span> El mapa interactivo real permitirá zoom, consulta de atributos por polígono y descarga de reportes públicos (PDF).
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
