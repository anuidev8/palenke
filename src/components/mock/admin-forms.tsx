import {
  dashboards,
  documents,
  formatLastLogin,
  instrumentTypes,
  librarySections,
  organizations,
  territories,
  type AccRecord,
  type CampaignRecord,
  type DashboardRecord,
  type DocumentRecord,
  type UserRecord,
} from "@/lib/mock-data";
import { Ban, Check, Globe, Lock, Mail, type LucideIcon } from "lucide-react";
import { Callout, DropZone, Field, SelectInput, TextArea, TextInput } from "@/components/mock/ui";

export function DocumentForm({
  mode,
  document,
}: {
  mode: "new" | "edit";
  document?: DocumentRecord;
}) {
  const visibility = document?.visibility ?? "public";
  const hasRiskWarning = document?.riskFlag ?? false;

  return (
    <div className="grid gap-6">
      <section className="surface-card grid gap-6">
        <div>
          <p className="eyebrow">Información básica</p>
          <h2 className="mt-3 font-display text-3xl text-[color:var(--forest)]">
            {mode === "new" ? "Nuevo documento" : "Editar documento"}
          </h2>
        </div>

        <Field label="Título oficial" required error={mode === "new" ? "Este campo es obligatorio." : undefined}>
          <TextInput defaultValue={document?.title} error={mode === "new"} />
        </Field>

        <Field label="Sección" required>
          <SelectInput options={[...librarySections]} defaultValue={document?.section} />
        </Field>

        <Field
          label="Descripción"
          required
          hint="Máx. 300 caracteres. Aparece en el listado público."
        >
          <TextArea defaultValue={document?.description} rows={4} />
          <p className="mt-2 text-xs text-[color:var(--muted)]">
            {document?.description.length ?? 0}/300 caracteres
          </p>
        </Field>
      </section>

      <section className="surface-card grid gap-6">
        <div>
          <p className="eyebrow">Clasificación</p>
          <h2 className="mt-3 font-display text-3xl text-[color:var(--forest)]">Metadatos</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Tipo de instrumento" required>
            <SelectInput options={[...instrumentTypes]} defaultValue={document?.type} />
          </Field>
          <Field label="Territorio / Región">
            <SelectInput options={[...territories]} defaultValue={document?.territory} />
          </Field>
          <Field label="Consejo comunitario">
            <TextInput defaultValue={document?.council} />
          </Field>
          <Field label="Departamento">
            <TextInput defaultValue={document?.department} />
          </Field>
          <Field label="Municipio">
            <TextInput defaultValue={document?.municipality} />
          </Field>
          <Field label="Año" required>
            <TextInput type="number" defaultValue={document?.year} />
          </Field>
        </div>

        <Field label="Vigencia">
          <div className="grid gap-3 sm:grid-cols-3">
            {["Vigente", "En actualización", "Histórico"].map((option) => (
              <label key={option} className="flex items-center gap-3 rounded-[20px] border border-[color:var(--border-soft)] bg-white px-4 py-3 text-sm">
                <input type="radio" name="vigencia" defaultChecked={(document?.validity ?? "Vigente") === option} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Palabras clave">
          <TextInput defaultValue={document?.keywords.join(", ")} placeholder="gobierno, Naya, 2021" />
        </Field>
      </section>

      <section className="surface-card grid gap-6">
        <div>
          <p className="eyebrow">Enfoque</p>
          <h2 className="mt-3 font-display text-3xl text-[color:var(--forest)]">Género y vinculación MJN</h2>
        </div>

        <label className="flex items-center gap-3 rounded-[20px] bg-[color:var(--sand-strong)] px-4 py-4 text-sm text-[color:var(--forest)]">
          <input type="checkbox" defaultChecked={document?.genderFocus} />
          <span>Tiene enfoque de género explícito</span>
        </label>

        <label className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-4 text-sm text-[color:var(--forest)]">
          <input type="checkbox" defaultChecked={document ? document.mjnTags.length > 0 : true} />
          <span>Aparece en la página MJN</span>
        </label>

        <Field label="Relación MJN">
          <div className="flex flex-wrap gap-2">
            {["Mujeres", "Juventudes", "Niñez", "MJN general"].map((tag) => (
              <span key={tag} className={`chip ${document?.mjnTags.includes(tag) ? "border-[color:var(--gold-500)]" : ""}`}>
                {tag}
              </span>
            ))}
          </div>
        </Field>
      </section>

      <section className="surface-card grid gap-6">
        <div>
          <p className="eyebrow">Archivo / enlace</p>
          <h2 className="mt-3 font-display text-3xl text-[color:var(--forest)]">Carga</h2>
        </div>

        <Field label="Adjuntar archivo">
          <DropZone state={mode === "edit" ? "success" : "idle"} />
        </Field>

        <p className="text-center text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">o</p>

        <Field
          label="Enlace externo"
          error={mode === "new" ? "La URL debe comenzar con https://" : undefined}
        >
          <TextInput type="url" defaultValue={document?.action !== "file" ? document?.url : "https://"} error={mode === "new"} />
        </Field>
      </section>

      <section className="surface-card grid gap-6">
        <div>
          <p className="eyebrow">Visibilidad</p>
          <h2 className="mt-3 font-display text-3xl text-[color:var(--forest)]">Control de acceso</h2>
        </div>

        <div className="grid gap-3">
          {[
            {
              id: "public",
              label: "Público",
              Icon: Globe,
              description: "Cualquier visitante puede ver y descargar este documento.",
            },
            {
              id: "internal",
              label: "Interno",
              Icon: Lock,
              description: "Solo miembros autenticados del Palenke/Hileros.",
            },
            {
              id: "sensitive",
              label: "Sensible/Restringido",
              Icon: Ban,
              description: "No aparece en la web. Se gestiona fuera de la plataforma.",
            },
          ].map((option: { id: string; label: string; Icon: LucideIcon; description: string }) => (
            <label key={option.id} className="flex gap-4 rounded-[24px] border border-[color:var(--border-soft)] bg-white px-5 py-4">
              <input type="radio" name="visibility" defaultChecked={visibility === option.id} />
              <div className="space-y-1 text-sm">
                <p className="inline-flex items-center gap-2 font-semibold text-[color:var(--forest)]">
                  <option.Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{option.label}</span>
                </p>
                <p className="text-[color:var(--muted-strong)]">{option.description}</p>
              </div>
            </label>
          ))}
        </div>

        {visibility === "public" ? (
          <Callout tone="warning" title="Atención: Contenido público">
            <ul className="list-disc space-y-1 pl-5">
              <li>Verifica que no incluya nombres de personas en situación de riesgo.</li>
              <li>Confirma que la coordinación del Palenke validó el contenido.</li>
              <li>Remueve datos sensibles de territorio o comunidades antes de publicarlo.</li>
            </ul>
          </Callout>
        ) : null}

        {hasRiskWarning ? (
          <Callout tone="danger" title="Documento con información sensible">
            <p>
              Se recomienda marcarlo como Interno o Sensible/Restringido para proteger a personas y comunidades
              involucradas.
            </p>
          </Callout>
        ) : null}
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        <button type="button" className="button-ghost">
          Cancelar
        </button>
        <button type="button" className="button-secondary">
          Guardar como borrador
        </button>
        <button type="button" className="button-primary">
          <span>Publicar</span>
          <Check className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function DashboardForm({
  mode,
  dashboard,
}: {
  mode: "new" | "edit";
  dashboard?: DashboardRecord;
}) {
  return (
    <div className="grid gap-6">
      <section className="surface-card grid gap-6">
        <div>
          <p className="eyebrow">Información</p>
          <h2 className="mt-3 font-display text-3xl text-[color:var(--forest)]">
            {mode === "new" ? "Nuevo tablero" : "Editar tablero"}
          </h2>
        </div>

        <Field label="Título del tablero" required>
          <TextInput defaultValue={dashboard?.title} />
        </Field>

        <Field
          label="Descripción / ¿Qué pregunta responde?"
          required
          hint="Esta descripción aparece en el listado."
        >
          <TextArea defaultValue={dashboard?.description} rows={3} />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Tema" required>
            <SelectInput
              options={[
                "Biodiversidad",
                "ACCs",
                "Demografía",
                "Justicia climática",
                "Monitoreo ambiental",
                "Otro",
              ]}
              defaultValue={dashboard?.topic}
            />
          </Field>
          <Field label="Territorio(s) relacionado(s)" required>
            <TextInput defaultValue={dashboard?.territory} />
          </Field>
          <Field label="Período de datos">
            <TextInput defaultValue={dashboard?.period} />
          </Field>
          <Field label="Público objetivo">
            <SelectInput
              options={["Público general", "Equipo Palenke/Hileros", "Técnicos y donantes"]}
              defaultValue={dashboard?.audience}
            />
          </Field>
          <Field label="Frecuencia de actualización">
            <SelectInput
              options={["Tiempo real", "Semanal", "Mensual", "Anual", "Puntual"]}
              defaultValue={dashboard?.frequency}
            />
          </Field>
          <Field label="Estado">
            <SelectInput
              options={["Activo", "En actualización", "Desactivado temporalmente"]}
              defaultValue={dashboard?.status}
            />
          </Field>
        </div>
      </section>

      <section className="surface-card grid gap-6">
        <div>
          <p className="eyebrow">Integración</p>
          <h2 className="mt-3 font-display text-3xl text-[color:var(--forest)]">Embed Power BI</h2>
        </div>

        <Field
          label="URL de embed Power BI"
          required
          hint="Debe comenzar con https://app.powerbi.com/"
        >
          <TextInput type="url" defaultValue={dashboard?.embedUrl ?? "https://app.powerbi.com/reportEmbed?reportId="} />
        </Field>

        <details className="surface-card bg-white p-0">
          <summary className="rounded-[28px] px-6 py-5 text-sm font-semibold text-[color:var(--forest)]">
            Previsualizar tablero
          </summary>
          <div className="border-t border-[color:var(--border-soft)] p-6">
            <div className="overflow-hidden rounded-[24px] border border-[color:var(--border-soft)] bg-[color:var(--forest)]">
              <iframe
                title="Previsualización"
                src={dashboard?.embedUrl ?? "https://app.powerbi.com/reportEmbed?reportId=preview"}
                className="min-h-[350px] w-full bg-white"
              />
            </div>
          </div>
        </details>
      </section>

      <section className="surface-card grid gap-6">
        <div>
          <p className="eyebrow">Visibilidad</p>
          <h2 className="mt-3 font-display text-3xl text-[color:var(--forest)]">Acceso del tablero</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { id: "public", label: "Público", Icon: Globe },
            { id: "internal", label: "Interno", Icon: Lock },
          ].map((option: { id: string; label: string; Icon: LucideIcon }) => (
            <label key={option.id} className="flex items-center gap-3 rounded-[20px] border border-[color:var(--border-soft)] bg-white px-4 py-4 text-sm">
              <input type="radio" name="dashboard-visibility" defaultChecked={(dashboard?.visibility ?? "public") === option.id} />
              <span className="inline-flex items-center gap-2">
                <option.Icon className="h-4 w-4" aria-hidden="true" />
                <span>{option.label}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <button type="button" className="button-ghost">
          Cancelar
        </button>
        <button type="button" className="button-primary">
          <span>Guardar</span>
          <Check className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function AccForm({
  mode,
  acc,
}: {
  mode: "new" | "edit";
  acc?: AccRecord;
}) {
  return (
    <div className="grid gap-6">
      <section className="surface-card grid gap-6">
        <div>
          <p className="eyebrow">Identificación</p>
          <h2 className="mt-3 font-display text-3xl text-[color:var(--forest)]">
            {mode === "new" ? "Nueva ACC" : "Editar ACC"}
          </h2>
        </div>

        <Field label="Nombre oficial" required>
          <TextInput defaultValue={acc?.name} />
        </Field>
        <Field label="Nombre coloquial">
          <TextInput defaultValue={acc?.nickname} />
        </Field>
        <Field label="Consejo comunitario responsable" required>
          <TextInput defaultValue={acc?.council} />
        </Field>
      </section>

      <section className="surface-card grid gap-6">
        <div>
          <p className="eyebrow">Ubicación</p>
          <h2 className="mt-3 font-display text-3xl text-[color:var(--forest)]">Metadatos territoriales</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Cuenca hidrográfica principal">
            <TextInput defaultValue={acc?.basin} />
          </Field>
          <Field label="Municipio(s)">
            <TextInput defaultValue={acc?.municipalities} />
          </Field>
          <Field label="Departamento(s)">
            <TextInput defaultValue={acc?.departments} />
          </Field>
          <Field label="Extensión aproximada (hectáreas)">
            <TextInput type="number" defaultValue={acc?.hectares} />
          </Field>
        </div>
      </section>

      <section className="surface-card grid gap-6">
        <Field label="Descripción" required>
          <TextArea defaultValue={acc?.description} rows={5} />
        </Field>

        <Field label="¿Está en el geoportal del equipo SIG?">
          <div className="grid gap-3">
            <label className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-3 text-sm">
              <input type="radio" name="geoportal" defaultChecked={acc?.inGeoportal ?? true} />
              <span>Sí</span>
            </label>
            <TextInput defaultValue={acc?.geoportalLayer} placeholder="Nombre de capa" />
            <label className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-3 text-sm">
              <input type="radio" name="geoportal" defaultChecked={acc ? !acc.inGeoportal : false} />
              <span>No</span>
            </label>
          </div>
        </Field>

        <Field label="¿Tiene tablero Power BI vinculado?">
          <SelectInput options={dashboards.map((dashboard) => dashboard.title)} defaultValue={dashboards.find((dashboard) => dashboard.id === acc?.linkedDashboardId)?.title} />
        </Field>

        <Field label="Documentos relacionados">
          <div className="flex flex-wrap gap-2">
            {documents.slice(0, 4).map((document) => (
              <span key={document.id} className={`chip ${acc?.linkedDocumentIds.includes(document.id) ? "border-[color:var(--gold-500)]" : ""}`}>
                {document.title}
              </span>
            ))}
          </div>
        </Field>
      </section>

      <section className="surface-card grid gap-4">
        <label className="flex items-center gap-3 rounded-[20px] bg-[color:var(--sand-strong)] px-4 py-4 text-sm text-[color:var(--forest)]">
          <input type="checkbox" defaultChecked={acc?.linkedToMeta3030} />
          <span>Vinculada a la agenda Meta 30x30 / justicia climática</span>
        </label>

        <Field label="Visibilidad de la ficha" required>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { id: "public", label: "Pública", Icon: Globe },
              { id: "internal", label: "Solo interna", Icon: Lock },
            ].map((option: { id: string; label: string; Icon: LucideIcon }) => (
              <label key={option.id} className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-4 text-sm">
                <input type="radio" name="acc-visibility" defaultChecked={(acc?.visibility ?? "public") === option.id} />
                <span className="inline-flex items-center gap-2">
                  <option.Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{option.label}</span>
                </span>
              </label>
            ))}
          </div>
        </Field>
      </section>

      <div className="flex justify-end gap-3">
        <button type="button" className="button-ghost">
          Cancelar
        </button>
        <button type="button" className="button-primary">
          <span>Guardar</span>
          <Check className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function UserForm({
  mode,
  user,
}: {
  mode: "new" | "edit";
  user?: UserRecord;
}) {
  return (
    <div className="grid gap-6">
      <section className="surface-card grid gap-6">
        <div>
          <p className="eyebrow">Cuenta</p>
          <h2 className="mt-3 font-display text-3xl text-[color:var(--forest)]">
            {mode === "new" ? "Nuevo usuario" : "Editar usuario"}
          </h2>
        </div>

        {mode === "edit" && user ? (
          <div className="flex flex-wrap items-center gap-3 rounded-[20px] bg-[color:var(--sand-strong)] px-5 py-3 text-sm text-[color:var(--muted-strong)]">
            <span>Último acceso:</span>
            <span className="font-semibold text-[color:var(--forest)]">{formatLastLogin(user.lastLoginAt)}</span>
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Nombre completo" required>
            <TextInput defaultValue={user?.name} />
          </Field>
          <Field label="Correo electrónico" required>
            <TextInput type="email" defaultValue={user?.email} />
          </Field>
          <Field label="Rol" required>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Admin", "Interno"].map((option) => (
                <label key={option} className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-4 text-sm">
                  <input type="radio" name="user-role" defaultChecked={(user?.role ?? "Interno") === option} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </Field>
          <Field label="Organización / consejo">
            <select className="input-shell" defaultValue={user?.organization ?? ""}>
              <option value="">Seleccionar organización</option>
              {organizations.map((org) => (
                <option key={org} value={org}>{org}</option>
              ))}
            </select>
          </Field>
        </div>

        <label className="flex items-center gap-3 rounded-[20px] bg-[color:var(--sand-strong)] px-4 py-4 text-sm text-[color:var(--forest)]">
          <input type="checkbox" defaultChecked={user?.isPrimaryAdmin} />
          <span>Administrador principal</span>
        </label>

        {mode === "new" ? (
          <>
            <Field label="Contraseña temporal" required hint="El usuario deberá cambiar esta contraseña en su primer ingreso.">
              <TextInput type="password" defaultValue="Palenke-2026" />
            </Field>
            <Callout tone="info" title="Cambio obligatorio en primer ingreso">
              <p>
                La cuenta se creará con la opción <strong>«forzar cambio de contraseña»</strong> activada.
                El usuario verá una pantalla de cambio de contraseña obligatoria antes de acceder al panel.
              </p>
            </Callout>
          </>
        ) : (
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" className="button-secondary w-fit">
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>Enviar enlace de restablecimiento</span>
            </button>
            <span className="text-xs text-[color:var(--muted)]">
              Se enviará un correo a <strong>{user?.email}</strong> con enlace de un solo uso (válido 24 h).
            </span>
          </div>
        )}

        <Field label="Control de acceso">
          <div className="grid gap-3">
            <label className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-4 text-sm text-[color:var(--forest)]">
              <input type="checkbox" defaultChecked={user?.active ?? true} />
              <span>Cuenta activa</span>
            </label>
            <label className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-4 text-sm text-[color:var(--forest)]">
              <input type="checkbox" defaultChecked={user?.mustChangePassword ?? (mode === "new")} />
              <span>Forzar cambio de contraseña en próximo ingreso</span>
            </label>
          </div>
        </Field>

        {!user?.active && mode === "edit" && user ? (
          <Callout tone="warning" title="Confirmación requerida">
            <p>¿Desactivar la cuenta de {user.name}? Esta persona ya no podrá iniciar sesión hasta que un administrador reactive la cuenta.</p>
          </Callout>
        ) : null}

        {user?.mustChangePassword && mode === "edit" ? (
          <Callout tone="warning" title="Cambio de contraseña pendiente">
            <p>Este usuario aún no ha completado el cambio de contraseña obligatorio. No ha podido acceder al panel.</p>
          </Callout>
        ) : null}
      </section>

      <div className="flex justify-end gap-3">
        <button type="button" className="button-ghost">
          Cancelar
        </button>
        <button type="button" className="button-primary">
          <span>Guardar</span>
          <Check className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function CampaignForm({
  mode,
  campaign,
}: {
  mode: "new" | "edit";
  campaign?: CampaignRecord;
}) {
  return (
    <div className="grid gap-6">
      <section className="surface-card grid gap-6">
        <div>
          <p className="eyebrow">Campaña</p>
          <h2 className="mt-3 font-display text-3xl text-[color:var(--forest)]">
            {mode === "new" ? "Nueva campaña" : "Editar campaña"}
          </h2>
        </div>

        <Field label="Título de la campaña" required>
          <TextInput defaultValue={campaign?.title} />
        </Field>
        <Field label="Texto de presentación" required hint="Máx. 100 palabras">
          <TextArea defaultValue={campaign?.intro} rows={4} />
          <p className="mt-2 text-xs text-[color:var(--muted)]">0/100 palabras</p>
        </Field>
        <Field label="Imagen de portada" required>
          <DropZone state={mode === "edit" ? "success" : "idle"} label="JPG/PNG, mínimo 1200px, máximo 2 MB" />
        </Field>
      </section>

      <section className="surface-card grid gap-6">
        <div>
          <p className="eyebrow">Materiales</p>
          <h2 className="mt-3 font-display text-3xl text-[color:var(--forest)]">Descargables</h2>
        </div>

        <div className="grid gap-4">
          {(campaign?.materials ?? [
            { id: "material-1", type: "Afiche", title: "Afiche de campaña", action: "download", url: "#" },
            { id: "material-2", type: "Video", title: "Video de campaña", action: "watch", url: "https://example.com" },
          ]).map((material) => (
            <div key={material.id} className="rounded-[24px] border border-[color:var(--border-soft)] bg-white p-5">
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Tipo">
                  <SelectInput options={["Afiche", "Cartilla", "Video", "Otro"]} defaultValue={material.type} />
                </Field>
                <Field label="Título">
                  <TextInput defaultValue={material.title} />
                </Field>
                <Field label="Archivo o URL">
                  <TextInput type="url" defaultValue={material.url} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-card grid gap-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Fecha de inicio" required>
            <TextInput type="text" defaultValue={campaign?.startDate ?? "2026-03-11"} />
          </Field>
          <Field label="Fecha de fin">
            <TextInput type="text" defaultValue={campaign?.endDate} placeholder="Indefinido" />
          </Field>
        </div>

        <Field label="¿Dónde aparece esta campaña?" required>
          <div className="grid gap-3 md:grid-cols-2">
            {["Portada (Home)", "Página Mujeres, Juventudes y Niñez", "Sección Biblioteca", "Todas las secciones"].map(
              (option) => (
                <label key={option} className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-4 text-sm">
                  <input type="checkbox" defaultChecked />
                  <span>{option}</span>
                </label>
              ),
            )}
          </div>
        </Field>

        <Field label="Visibilidad">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { id: "public", label: "Pública", Icon: Globe },
              { id: "internal", label: "Solo para miembros", Icon: Lock },
            ].map((option: { id: string; label: string; Icon: LucideIcon }) => (
              <label key={option.id} className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-4 text-sm">
                <input type="radio" name="campaign-visibility" defaultChecked={(campaign?.visibility ?? "public") === option.id} />
                <span className="inline-flex items-center gap-2">
                  <option.Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{option.label}</span>
                </span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Estado">
          <label className="flex items-center gap-3 rounded-[20px] bg-[color:var(--sand-strong)] px-4 py-4 text-sm text-[color:var(--forest)]">
            <input type="checkbox" defaultChecked={campaign?.active ?? true} />
            <span>Activa</span>
          </label>
        </Field>
      </section>

      <div className="flex justify-end gap-3">
        <button type="button" className="button-ghost">
          Cancelar
        </button>
        <button type="button" className="button-primary">
          <span>Guardar</span>
          <Check className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
