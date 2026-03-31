"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";

type AccessLevel = "admin" | "coordination";

type AccessRequestFormProps = {
  instrumentSlug: string;
  instrumentTitle: string;
  accessLevel: AccessLevel;
};

type FormValues = {
  full_name: string;
  national_id: string;
  email: string;
  community: string;
  motivation: string;
  pcn_affiliation: string;
  institution: string;
  use_purpose: string;
  data_protection: string;
};

const INITIAL_VALUES: FormValues = {
  full_name: "",
  national_id: "",
  email: "",
  community: "",
  motivation: "",
  pcn_affiliation: "",
  institution: "",
  use_purpose: "",
  data_protection: "",
};

export function AccessRequestForm({
  instrumentSlug,
  instrumentTitle,
  accessLevel,
}: AccessRequestFormProps) {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isCoordination = accessLevel === "coordination";

  function updateValue<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/access-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          instrument_slug: instrumentSlug,
          access_level: accessLevel,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error ?? "No se pudo enviar la solicitud.");
      }

      setIsSubmitted(true);
      setValues(INITIAL_VALUES);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error inesperado al enviar.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <article className="space-y-5 rounded-[24px] border border-[#c8e6c9] bg-[#edf7ed] p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1b5e20]">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Solicitud enviada
        </div>
        <h3 className="font-display text-3xl text-[#1a1a1a]">Hemos recibido tu solicitud</h3>
        <p className="text-base leading-relaxed text-[#3d4b40]">
          Tu solicitud para <strong>{instrumentTitle}</strong> fue registrada correctamente.
          Tiempo de respuesta esperado: <strong>1 día hábil</strong>.
        </p>
        <button
          type="button"
          className="button-secondary"
          onClick={() => {
            setIsSubmitted(false);
            setErrorMessage(null);
          }}
        >
          Enviar otra solicitud
        </button>
      </article>
    );
  }

  return (
    <form className="grid gap-6 rounded-[28px] border border-[#e8dfd3] bg-white p-7 sm:p-9" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#1a1a1a]">
            Nombre completo<span className="ml-1 text-[#b91c1c]">*</span>
          </span>
          <input
            name="full_name"
            type="text"
            className="input-shell"
            required
            minLength={2}
            value={values.full_name}
            onChange={(event) => updateValue("full_name", event.target.value)}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#1a1a1a]">
            Cédula / documento<span className="ml-1 text-[#b91c1c]">*</span>
          </span>
          <input
            name="national_id"
            type="text"
            className="input-shell"
            required
            minLength={5}
            value={values.national_id}
            onChange={(event) => updateValue("national_id", event.target.value)}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#1a1a1a]">
            Correo electrónico<span className="ml-1 text-[#b91c1c]">*</span>
          </span>
          <input
            name="email"
            type="email"
            className="input-shell"
            required
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#1a1a1a]">
            Consejo comunitario / institución<span className="ml-1 text-[#b91c1c]">*</span>
          </span>
          <input
            name="community"
            type="text"
            className="input-shell"
            required
            minLength={2}
            value={values.community}
            onChange={(event) => updateValue("community", event.target.value)}
          />
        </label>

        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-semibold text-[#1a1a1a]">
            Motivo de la solicitud<span className="ml-1 text-[#b91c1c]">*</span>
          </span>
          <textarea
            name="motivation"
            className="textarea-shell"
            rows={4}
            required
            minLength={10}
            value={values.motivation}
            onChange={(event) => updateValue("motivation", event.target.value)}
          />
        </label>

        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-semibold text-[#1a1a1a]">Afiliación a PCN/Hileros</span>
          <select
            name="pcn_affiliation"
            className="input-shell"
            value={values.pcn_affiliation}
            onChange={(event) => updateValue("pcn_affiliation", event.target.value)}
          >
            <option value="">Seleccionar</option>
            <option value="Yes">Sí</option>
            <option value="No">No</option>
            <option value="Allied organization">Organización aliada</option>
          </select>
        </label>
      </div>

      {isCoordination ? (
        <section className="grid gap-5 rounded-2xl border border-[#f0d8b2] bg-[#fff8ee] p-5 sm:p-6">
          <h3 className="font-display text-2xl text-[#1a1a1a]">Información adicional de coordinación</h3>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#1a1a1a]">
              Afiliación institucional<span className="ml-1 text-[#b91c1c]">*</span>
            </span>
            <input
              name="institution"
              type="text"
              className="input-shell"
              required
              value={values.institution}
              onChange={(event) => updateValue("institution", event.target.value)}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#1a1a1a]">
              Uso específico previsto<span className="ml-1 text-[#b91c1c]">*</span>
            </span>
            <textarea
              name="use_purpose"
              className="textarea-shell"
              rows={4}
              required
              value={values.use_purpose}
              onChange={(event) => updateValue("use_purpose", event.target.value)}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#1a1a1a]">
              ¿Cómo protegerás estos datos?<span className="ml-1 text-[#b91c1c]">*</span>
            </span>
            <textarea
              name="data_protection"
              className="textarea-shell"
              rows={4}
              required
              value={values.data_protection}
              onChange={(event) => updateValue("data_protection", event.target.value)}
            />
          </label>
        </section>
      ) : null}

      {errorMessage ? (
        <p
          role="alert"
          className="inline-flex items-center gap-2 rounded-xl border border-[#f8d2d2] bg-[#fff5f5] px-4 py-3 text-sm text-[#9b1c1c]"
        >
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {errorMessage}
        </p>
      ) : null}

      <button type="submit" disabled={isSubmitting} className="button-primary justify-center">
        <Send className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? "Enviando solicitud..." : "Enviar solicitud"}
      </button>
    </form>
  );
}
