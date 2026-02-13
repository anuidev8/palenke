"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Propósito", href: "#proposito" },
    { name: "Actores", href: "#actores" },
    { name: "MVP", href: "#mvp" },
    { name: "Fase 2", href: "#fase2" },
    { name: "Técnico", href: "#tecnico" },
  ];

  return (
    <nav className="fixed w-full z-50 bg-[#FFF8EA]/90 backdrop-blur-sm border-b border-[#2D1B14]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold font-syne text-[#2D1B14]">
              Palenke
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[#1E1E1E] hover:text-[#1A5C38] transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="#codiseno"
              className="bg-[#1A5C38] text-[#FFF8EA] px-4 py-2 rounded-full font-medium hover:bg-[#0F3D5A] transition-colors"
            >
              Co-diseño
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-[#2D1B14] hover:text-[#1A5C38] focus:outline-none"
              aria-label="Abrir menú"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FFF8EA] border-b border-[#2D1B14]/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-[#1E1E1E] hover:text-[#1A5C38] hover:bg-[#1A5C38]/5 rounded-md"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="#codiseno"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center mt-4 bg-[#1A5C38] text-[#FFF8EA] px-4 py-3 rounded-md font-medium hover:bg-[#0F3D5A] transition-colors"
              >
                Coordinar reunión
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
