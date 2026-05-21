"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";

type FormValues = {
  full_name: string;
  phone: string;
  email: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const INITIAL_VALUES: FormValues = {
  full_name: "",
  phone: "",
  email: "",
  message: "",
};

const FIELD_LABELS: Record<keyof FormValues, string> = {
  full_name: "Nombre",
  phone: "Nº de contacto",
  email: "Correo",
  message: "Comentario",
};

const FIELD_ACCENT: Record<keyof FormValues, string> = {
  full_name: "border-l-[#2e7d32]",
  phone: "border-l-[#fbc02d]",
  email: "border-l-[#d32f2f]",
  message: "border-l-[#2e7d32]",
};

type ContactFormProps = {
  onSubmitted?: () => void;
};

export function ContactForm({ onSubmitted }: ContactFormProps) {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function updateValue<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | {
              error?: string;
              issues?: {
                fieldErrors?: Partial<Record<keyof FormValues, string[]>>;
              };
            }
          | null;

        if (payload?.issues?.fieldErrors) {
          const nextErrors: FieldErrors = {};
          for (const [field, messages] of Object.entries(payload.issues.fieldErrors) as Array<
            [keyof FormValues, string[] | undefined]
          >) {
            if (!messages?.length) continue;
            nextErrors[field] = messages[0];
          }
          setFieldErrors(nextErrors);
          setErrorMessage("Revisa los campos marcados para enviar tu mensaje.");
          return;
        }

        throw new Error(payload?.error ?? "No se pudo enviar el mensaje.");
      }

      setIsSubmitted(true);
      setValues(INITIAL_VALUES);
      onSubmitted?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error inesperado al enviar.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="overflow-hidden rounded-[24px] border-2 border-[#2e7d32]/30 bg-gradient-to-br from-[#e8f5e9] via-white to-[#fff8e1] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#2e7d32] text-white shadow-lg">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <h3 className="mt-5 font-display text-2xl text-[#1a1a1a]">Mensaje recibido</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#4a4540]">
          Gracias por escribirnos. El equipo de Palenke revisará tu mensaje y te responderá al correo
          que indicaste.
        </p>
        <button
          type="button"
          onClick={() => setIsSubmitted(false)}
          className="mt-6 rounded-full border-2 border-[#fbc02d] bg-[#fbc02d] px-5 py-2 text-sm font-semibold text-[#1a1a1a] transition hover:bg-[#f9a825]"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-[12px] border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#9e9e9e] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/25";

  function fieldWrap(key: keyof FormValues, children: ReactNode) {
    return (
      <label
        className={`grid gap-2 rounded-[16px] border border-[#eeeeee] border-l-4 bg-[#fafafa] p-4 ${FIELD_ACCENT[key]}`}
      >
        {children}
      </label>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {errorMessage ? (
        <p className="flex items-start gap-2 rounded-[16px] border-l-4 border-[#d32f2f] bg-[#ffebee] px-4 py-3 text-sm text-[#b71c1c]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        {fieldWrap(
          "full_name",
          <>
            <span className="text-sm font-semibold text-[#1a1a1a]">
              {FIELD_LABELS.full_name}
              <span className="ml-1 text-[#d32f2f]">*</span>
            </span>
            <input
              name="full_name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              value={values.full_name}
              onChange={(event) => updateValue("full_name", event.target.value)}
              className={inputClass}
              placeholder="Tu nombre"
            />
            {fieldErrors.full_name ? (
              <p className="text-xs font-medium text-[#d32f2f]">{fieldErrors.full_name}</p>
            ) : null}
          </>,
        )}

        {fieldWrap(
          "phone",
          <>
            <span className="text-sm font-semibold text-[#1a1a1a]">
              {FIELD_LABELS.phone}
              <span className="ml-1 text-[#d32f2f]">*</span>
            </span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              minLength={7}
              value={values.phone}
              onChange={(event) => updateValue("phone", event.target.value)}
              className={inputClass}
              placeholder="+57 300 000 0000"
            />
            {fieldErrors.phone ? (
              <p className="text-xs font-medium text-[#d32f2f]">{fieldErrors.phone}</p>
            ) : null}
          </>,
        )}
      </div>

      {fieldWrap(
        "email",
        <>
          <span className="text-sm font-semibold text-[#1a1a1a]">
            {FIELD_LABELS.email}
            <span className="ml-1 text-[#d32f2f]">*</span>
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            className={inputClass}
            placeholder="correo@ejemplo.org"
          />
          {fieldErrors.email ? (
            <p className="text-xs font-medium text-[#d32f2f]">{fieldErrors.email}</p>
          ) : null}
        </>,
      )}

      {fieldWrap(
        "message",
        <>
          <span className="text-sm font-semibold text-[#1a1a1a]">
            {FIELD_LABELS.message}
            <span className="ml-1 text-[#d32f2f]">*</span>
          </span>
          <textarea
            name="message"
            required
            minLength={10}
            rows={4}
            value={values.message}
            onChange={(event) => updateValue("message", event.target.value)}
            className={`${inputClass} min-h-[128px] resize-y`}
            placeholder="¿En qué podemos ayudarte?"
          />
          {fieldErrors.message ? (
            <p className="text-xs font-medium text-[#d32f2f]">{fieldErrors.message}</p>
          ) : null}
        </>,
      )}

      <p className="rounded-[14px] bg-[#fff8e1] px-4 py-3 text-xs leading-5 text-[#5d4037]">
        Tus datos se usarán únicamente para responder tu mensaje, conforme a la política de
        tratamiento de datos de Palenke.
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-[#2e7d32] via-[#388e3c] to-[#1b5e20] px-5 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-[0_8px_24px_rgba(46,125,50,0.35)] transition hover:from-[#256628] hover:to-[#2e7d32] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[220px]"
      >
        <Send className="h-4 w-4 text-[#fbc02d]" aria-hidden="true" />
        {isSubmitting ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
