import { z } from "zod";

const phonePattern = /^[\d\s+().-]{7,24}$/;

export const ContactMessageSchema = z.object({
  full_name: z.string().trim().min(2, "Ingresa tu nombre (mínimo 2 caracteres)."),
  phone: z
    .string()
    .trim()
    .min(7, "Ingresa un número de contacto válido.")
    .max(24)
    .regex(phonePattern, "Ingresa un número de contacto válido."),
  email: z.string().trim().email("Ingresa un correo electrónico válido."),
  message: z.string().trim().min(10, "Escribe tu comentario (mínimo 10 caracteres)."),
});

export type ContactMessageInput = z.infer<typeof ContactMessageSchema>;
