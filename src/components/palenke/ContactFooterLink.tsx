"use client";

import { useState } from "react";
import { ContactModal } from "./ContactModal";

export function ContactFooterLink() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-left text-white/70 transition hover:text-white"
      >
        Contacto
      </button>
      <ContactModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
