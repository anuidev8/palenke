import { Callout, SiteLayout } from "@/components/mock/ui";
import { getViewerRole, type SearchParams, withRole } from "@/lib/viewer";
import Link from "next/link";

export const metadata = {
  title: "Declaración de accesibilidad | Plataforma Palenke",
  description:
    "Compromiso de accesibilidad del Portal Palenke / PCN y estado de conformidad con WCAG 2.1 Nivel AA.",
};

export default async function AccesibilidadPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = getViewerRole(params);

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Declaración de accesibilidad" },
      ]}
    >
      <section className="mx-auto w-full max-w-3xl space-y-10 px-4 py-14 sm:px-6 lg:px-8">
        <header className="space-y-4">
          <span className="eyebrow">Accesibilidad web</span>
          <h1 className="font-display text-4xl leading-tight text-[color:var(--forest)] sm:text-5xl">
            Declaración de accesibilidad
          </h1>
          <p className="text-base leading-7 text-[color:var(--muted-strong)]">
            El Palenke de Pensamiento y Cuidadores del Territorio / PCN se compromete a garantizar
            la accesibilidad digital de este portal para todas las personas, incluidas aquellas con
            discapacidad, en cumplimiento de las pautas internacionales WCAG 2.1.
          </p>
        </header>

        <div className="space-y-8 text-sm leading-7 text-[color:var(--muted-strong)]">
          <section aria-labelledby="estado-conformidad">
            <h2 id="estado-conformidad" className="mb-3 font-display text-2xl text-[color:var(--forest)]">
              Estado de conformidad
            </h2>
            <p>
              Esta plataforma es <strong>parcialmente conforme</strong> con las{" "}
              <a
                href="https://www.w3.org/TR/WCAG21/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[color:var(--forest)]"
              >
                Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1, Nivel AA
              </a>
              . Parcialmente conforme significa que algunas partes del contenido no cumplen
              completamente con la norma debido a que se encuentra en fase de desarrollo (MVP).
            </p>
          </section>

          <section aria-labelledby="medidas">
            <h2 id="medidas" className="mb-3 font-display text-2xl text-[color:var(--forest)]">
              Medidas implementadas
            </h2>
            <ul className="ml-5 list-disc space-y-2">
              <li>Enlace de salto al contenido principal en todas las páginas.</li>
              <li>Jerarquía de encabezados coherente (H1 → H2 → H3).</li>
              <li>Etiquetas asociadas programáticamente a todos los campos de formulario.</li>
              <li>Indicadores de foco visibles para navegación con teclado.</li>
              <li>Roles ARIA y atributos <code>aria-current</code>, <code>aria-label</code>,{" "}
                <code>aria-expanded</code> y <code>aria-live</code> en los elementos interactivos.</li>
              <li>Textos alternativos en imágenes con contenido informativo.</li>
              <li>Atributo <code>lang=&quot;es&quot;</code> en el documento raíz.</li>
              <li>Región de migas de pan (<em>breadcrumb</em>) con navegación semántica.</li>
              <li>Contraste de color mínimo 4.5:1 en texto de cuerpo.</li>
            </ul>
          </section>

          <section aria-labelledby="limitaciones">
            <h2 id="limitaciones" className="mb-3 font-display text-2xl text-[color:var(--forest)]">
              Limitaciones conocidas
            </h2>
            <Callout tone="warning" title="Este portal es un MVP en desarrollo">
              <p>
                Algunas funcionalidades aún no alcanzan plena conformidad WCAG 2.1 AA. Las
                limitaciones conocidas se detallan a continuación:
              </p>
            </Callout>
            <ul className="ml-5 mt-4 list-disc space-y-2">
              <li>
                Los <em>iframes</em> de tableros Power BI (Estadísticas) dependen de la
                accesibilidad del proveedor externo y pueden no ser completamente navegables con
                lector de pantalla.
              </li>
              <li>
                El área de carga de archivos (<em>drop zone</em>) no está implementada como un
                elemento nativo <code>{"<input type='file'>"}</code>; se habilitará en la versión
                de producción con backend real.
              </li>
              <li>
                Las historias de la sección MJN (audio/video) son marcadores de posición y no
                incluyen transcripciones ni subtítulos todavía.
              </li>
              <li>
                El geoportal externo enlazado puede tener sus propias limitaciones de accesibilidad
                fuera del control de este portal.
              </li>
            </ul>
          </section>

          <section aria-labelledby="contacto">
            <h2 id="contacto" className="mb-3 font-display text-2xl text-[color:var(--forest)]">
              Contacto y retroalimentación
            </h2>
            <p>
              Si encuentras barreras de accesibilidad en este portal o necesitas el contenido en
              otro formato, contáctanos:
            </p>
            <ul className="ml-5 mt-3 list-disc space-y-2">
              <li>
                <strong>Correo:</strong>{" "}
                <a href="mailto:datos@palenke.org" className="underline hover:text-[color:var(--forest)]">
                  datos@palenke.org
                </a>
              </li>
              <li>
                Nos comprometemos a responder en un plazo máximo de <strong>15 días hábiles</strong>.
              </li>
            </ul>
          </section>

          <section aria-labelledby="vigencia">
            <h2 id="vigencia" className="mb-3 font-display text-2xl text-[color:var(--forest)]">
              Vigencia y revisión
            </h2>
            <p>
              Esta declaración fue elaborada el <time dateTime="2026-03-13">13 de marzo de 2026</time> y
              se revisa cada vez que se realiza una actualización significativa del portal.
            </p>
            <p className="mt-3">
              Para conocer nuestra política de tratamiento de datos, consulta la{" "}
              <Link
                href={withRole("/politica-de-datos", role)}
                className="underline hover:text-[color:var(--forest)]"
              >
                Política de tratamiento de datos
              </Link>
              .
            </p>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}
