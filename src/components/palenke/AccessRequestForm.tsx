"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";

type AccessLevel = "admin" | "coordination";

type AccessRequestFormProps = {
  instrumentSlug: string;
  instrumentTitle: string;
  documentId: string;
  documentTitle: string;
  accessLevel: AccessLevel;
};

type FormValues = {
  full_name: string;
  national_id: string;
  email: string;
  community: string;
  motivation: string;
  pcn_affiliation: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const INITIAL_VALUES: FormValues = {
  full_name: "",
  national_id: "",
  email: "",
  community: "",
  motivation: "",
  pcn_affiliation: "",
};

export function AccessRequestForm({
  instrumentSlug,
  instrumentTitle,
  documentId,
  documentTitle,
  accessLevel,
}: AccessRequestFormProps) {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsDetails, setShowTermsDetails] = useState(false);

  function getFieldErrorMessage(field: keyof FormValues, fallback?: string) {
    const map: Record<keyof FormValues, string> = {
      full_name: "Ingresa tu nombre completo (mínimo 2 caracteres).",
      national_id: "Ingresa un número de documento válido (mínimo 5 caracteres).",
      email: "Ingresa un correo electrónico válido.",
      community: "Ingresa el consejo comunitario o institución (mínimo 2 caracteres).",
      motivation: "Describe el motivo de la solicitud (mínimo 10 caracteres).",
      pcn_affiliation: "Selecciona una opción de afiliación válida.",
    };
    return map[field] || fallback || "Verifica este campo.";
  }

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

    if (!acceptedTerms) {
      setErrorMessage("Debes aceptar la autorización de tratamiento de datos personales para enviar la solicitud.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/access-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          instrument_slug: instrumentSlug,
          document_id: documentId,
          document_title: documentTitle,
          access_level: accessLevel,
        }),
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
            nextErrors[field] = getFieldErrorMessage(field, messages[0]);
          }
          setFieldErrors(nextErrors);
          setErrorMessage("Revisa los campos marcados para completar tu solicitud.");
          return;
        }

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
      <article className="w-full overflow-hidden rounded-[32px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.18)]">
        <div className="px-8 py-14 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#d8f3dc]">
            <CheckCircle2 className="h-10 w-10 text-[#2e7d32]" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a756e]">
            Solicitud enviada
          </p>
          <h3 className="mt-2 font-display text-3xl text-[#1a1a1a]">Hemos recibido tu solicitud</h3>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#4a4540]">
            Tu solicitud para <strong>{documentTitle}</strong> en <strong>{instrumentTitle}</strong>{" "}
            fue registrada correctamente. Ahora entra a revisión y nuestro equipo te responderá por correo
            cuando haya una decisión.
          </p>
          <div className="mx-auto mt-6 max-w-2xl rounded-[20px] border border-[#d8e7d5] bg-[#f5fbf3] p-5 text-left">
            <p className="text-sm font-semibold text-[#234b1f]">Mientras esperas</p>
            <ul className="mt-2 grid gap-2 text-sm leading-6 text-[#476243]">
              <li>Te avisaremos al correo registrado cuando la solicitud sea aprobada, rechazada o atendida.</li>
              <li>Si ya tienes cuenta, podrás revisar tus solicitudes iniciando sesión.</li>
              <li>Tiempo estimado de respuesta: 1 día hábil.</li>
            </ul>
          </div>
          <button
            type="button"
            className="mt-8 inline-flex items-center justify-center rounded-[14px] bg-[#2e7d32] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1b5e20]"
            onClick={() => {
              setIsSubmitted(false);
              setErrorMessage(null);
            }}
          >
            Enviar otra solicitud
          </button>
        </div>
      </article>
    );
  }

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="mb-4 overflow-hidden rounded-[28px] bg-[#2e7d32]">
        <div className="px-7 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            Solicitud de acceso
          </p>
          <h2 className="mt-1 font-display text-2xl text-white sm:text-3xl">{instrumentTitle}</h2>
          <p className="mt-1 text-sm text-white/75">
            Completa este formulario para pedir acceso a este archivo. La entrega no es inmediata:
            primero debe ser revisada por el equipo administrador.
          </p>
        </div>
      </div>

      <div className="mb-4 overflow-hidden rounded-[28px] border border-[#e8dfd3] bg-[#fffaf2] p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a756e]">
          Documento solicitado
        </p>
        <h3 className="mt-2 font-display text-2xl text-[#1a1a1a]">{documentTitle}</h3>
        <p className="mt-2 text-sm leading-6 text-[#6b5f53]">
          Tu solicitud quedará asociada a este documento exacto para que la revisión sea más clara y precisa.
        </p>
      </div>

      <div className="mb-4 overflow-hidden rounded-[28px] bg-white p-7 shadow-sm">
        <p className="eyebrow mb-1">Paso 1</p>
        <h3 className="font-display text-xl text-[#1a1a1a]">Datos de identificación</h3>
        <p className="mt-1 text-sm text-[#7a756e]">Verificaremos esta información para procesar tu solicitud.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#1a1a1a]">
              Nombre completo<span className="ml-1 text-[#b91c1c]">*</span>
            </span>
            <input
              name="full_name"
              type="text"
              required
              minLength={2}
              value={values.full_name}
              onChange={(event) => updateValue("full_name", event.target.value)}
              className="w-full rounded-[14px] border border-[#e8dfd3] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bab4ac] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20"
            />
            {fieldErrors.full_name ? (
              <p className="text-xs font-medium text-[#b91c1c]">{fieldErrors.full_name}</p>
            ) : null}
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#1a1a1a]">
              Cédula / documento<span className="ml-1 text-[#b91c1c]">*</span>
            </span>
            <input
              name="national_id"
              type="text"
              required
              minLength={5}
              value={values.national_id}
              onChange={(event) => updateValue("national_id", event.target.value)}
              className="w-full rounded-[14px] border border-[#e8dfd3] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bab4ac] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20"
            />
            {fieldErrors.national_id ? (
              <p className="text-xs font-medium text-[#b91c1c]">{fieldErrors.national_id}</p>
            ) : null}
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#1a1a1a]">
              Correo electrónico<span className="ml-1 text-[#b91c1c]">*</span>
            </span>
            <input
              name="email"
              type="email"
              required
              value={values.email}
              onChange={(event) => updateValue("email", event.target.value)}
              className="w-full rounded-[14px] border border-[#e8dfd3] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bab4ac] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20"
            />
            {fieldErrors.email ? (
              <p className="text-xs font-medium text-[#b91c1c]">{fieldErrors.email}</p>
            ) : null}
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#1a1a1a]">
              Consejo comunitario / institución <span className="text-xs font-normal text-[#7a756e]">(facultativo)</span>
            </span>
            <input
              name="community"
              type="text"
              minLength={2}
              value={values.community}
              onChange={(event) => updateValue("community", event.target.value)}
              className="w-full rounded-[14px] border border-[#e8dfd3] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bab4ac] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20"
            />
            <p className="text-[11px] text-[#7a756e] leading-relaxed">
              Tu territorio u organización de procedencia. Aunque el suministro es opcional, constituye el criterio técnico esencial para verificar tu identidad y vínculo colectivo.
            </p>
            {fieldErrors.community ? (
              <p className="text-xs font-medium text-[#b91c1c]">{fieldErrors.community}</p>
            ) : null}
          </label>
        </div>
      </div>

      <div className="mb-4 overflow-hidden rounded-[28px] bg-white p-7 shadow-sm">
        <p className="eyebrow mb-1">Paso 2</p>
        <h3 className="font-display text-xl text-[#1a1a1a]">Contexto de la solicitud</h3>
        <p className="mt-1 text-sm text-[#7a756e]">Describe por qué necesitas el acceso y el vínculo organizativo.</p>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#1a1a1a]">
              Motivo de la solicitud<span className="ml-1 text-[#b91c1c]">*</span>
            </span>
            <textarea
              name="motivation"
              rows={4}
              required
              minLength={10}
              value={values.motivation}
              onChange={(event) => updateValue("motivation", event.target.value)}
              className="w-full resize-vertical rounded-[14px] border border-[#e8dfd3] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bab4ac] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20"
            />
            {fieldErrors.motivation ? (
              <p className="text-xs font-medium text-[#b91c1c]">{fieldErrors.motivation}</p>
            ) : null}
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#1a1a1a]">
              Afiliación a PCN/Hileros <span className="text-xs font-normal text-[#7a756e]">(facultativo)</span>
            </span>
            <select
              name="pcn_affiliation"
              value={values.pcn_affiliation}
              onChange={(event) => updateValue("pcn_affiliation", event.target.value)}
              className="w-full rounded-[14px] border border-[#e8dfd3] bg-white px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20"
            >
              <option value="">Seleccionar</option>
              <option value="Yes">Sí, pertenezco al Proceso de Comunidades Negras o Hileros</option>
              <option value="No">No pertenezco formalmente</option>
              <option value="Allied organization">Pertenezco a una organización aliada</option>
            </select>
            <p className="text-[11px] text-[#7a756e] leading-relaxed">
              Si perteneces o tienes vínculo de trabajo organizativo. Esta información de carácter sensible es facultativa y nos asiste en agilizar los procesos de validación comunitaria.
            </p>
            {fieldErrors.pcn_affiliation ? (
              <p className="text-xs font-medium text-[#b91c1c]">{fieldErrors.pcn_affiliation}</p>
            ) : null}
          </label>
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-[28px] bg-[#fcfaf7] border border-[#e8dfd3] p-7 shadow-sm transition-all duration-300">
        <div className="flex items-start gap-3">
          <input
            id="terms-checkbox"
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[#e8dfd3] text-[#2e7d32] focus:ring-[#2e7d32]/20"
          />
          <label htmlFor="terms-checkbox" className="text-sm leading-relaxed text-[#5a554e] select-none">
            He leído y acepto la{" "}
            <button
              type="button"
              onClick={() => setShowTermsDetails(!showTermsDetails)}
              className="font-semibold text-[#2e7d32] underline hover:text-[#1b5e20] focus:outline-none transition-colors"
            >
              Autorización de Tratamiento de Datos Personales
            </button>
            , y comprendo que el suministro de mis datos sensibles es facultativo.
          </label>
        </div>

        {/* Sliding terms details accordion */}
        <div
          className={`grid transition-all duration-500 ease-in-out ${
            showTermsDetails ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0 mt-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="rounded-2xl bg-white p-5 border border-[#e8dfd3]/60 text-xs text-[#5a554e] leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar">
              <h4 className="font-bold text-sm text-[#1a1a1a] mb-3 uppercase tracking-wide">
                AUTORIZACIÓN PARA EL TRATAMIENTO DE DATOS PERSONALES SENSIBLES (LEY 1581 DE 2012)
              </h4>
              <p className="mb-3">
                En cumplimiento de la Ley 1581 de 2012 de Colombia y sus decretos reglamentarios, al diligenciar este formulario autorizas de manera previa, libre, expresa e informada a <strong>Palenke de Pensamiento y Cuidadores del Territorio / PCN</strong> y a su operador técnico <strong>Corporación Agencia Afrocolombiana Hileros</strong>, para recolectar, almacenar y tratar tus datos personales, incluyendo aquellos de carácter sensible.
              </p>
              <h5 className="font-semibold text-[#1a1a1a] mt-3 mb-1.5">Declaro que he sido informado de lo siguiente:</h5>
              <ol className="list-decimal pl-4 mb-3 gap-2 flex flex-col">
                <li>
                  <strong>Datos Sensibles:</strong> El suministro de la información relacionada con mi Cédula de ciudadanía, Consejo Comunitario de origen y Afiliación organizativa a PCN/Hileros es de carácter <strong>facultativo (opcional)</strong>. No estoy obligado a entregar esta información sensible; sin embargo, comprendo que estos datos constituyen los <strong>criterios técnicos esenciales</strong> utilizados por la Coordinación de Palenke para verificar mi identidad y mi vínculo territorial antes de conceder acceso a los instrumentos colectivos protegidos.
                </li>
                <li>
                  <strong>Finalidad del Tratamiento:</strong> Mis datos serán tratados exclusivamente para: (a) Validar y registrar la solicitud de acceso a documentos protegidos; (b) Comunicar decisiones de aprobación o rechazo de solicitudes; (c) Llevar una trazabilidad y auditoría de los accesos a la información territorial colectiva; y (d) Proteger la soberanía digital de los territorios frente a usos extractivos o comerciales de la información.
                </li>
                <li>
                  <strong>Derechos del Titular:</strong> Tengo derecho a conocer, actualizar, rectificar y solicitar la supresión de mis datos personales, así como a revocar esta autorización en cualquier momento mediante comunicación al correo electrónico <strong>datos@palenke.org</strong>.
                </li>
              </ol>
              <p className="mt-3 text-[11px] border-t border-[#e8dfd3]/60 pt-3 text-[#7a756e]">
                Al marcar la casilla de aceptación, manifiesto que conozco y acepto la Política de Tratamiento de Datos Personales completa, disponible para consulta en el portal web: https://palenke.org/politica-de-datos.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-[#2e7d32] p-7">
        <p className="text-sm leading-6 text-white/80">
          Al enviar, tus datos se usarán únicamente para registrar y revisar esta solicitud. El acceso
          depende de aprobación previa del equipo de Palenke.
        </p>

        {errorMessage ? (
          <p
            role="alert"
            className="mt-4 inline-flex w-full items-center gap-2 rounded-[14px] border border-[#f8d2d2] bg-white px-4 py-3 text-sm text-[#9b1c1c]"
          >
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-white py-3.5 text-sm font-bold text-[#2e7d32] transition hover:bg-[#f0eae0] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Enviando solicitud..." : "Enviar solicitud a revisión"}
        </button>
      </div>
    </form>
  );
}
