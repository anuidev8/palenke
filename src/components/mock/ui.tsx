import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Ban,
  CheckCircle2,
  CloudUpload,
  Globe,
  Lock,
  Search,
  XCircle,
} from "lucide-react";
import type {
  CampaignRecord,
  DashboardRecord,
  DocumentRecord,
  StoryRecord,
  ViewerRole,
  Visibility,
} from "@/lib/mock-data";
import { formatDateRange, formatVisibility, getViewerName, isInternal, withRole } from "@/lib/viewer";

type Crumb = {
  label: string;
  href?: string;
};

import { SiteHeader } from "./SiteHeader";
import { ContactFooterLink } from "@/components/palenke/ContactFooterLink";

type SiteLayoutProps = {
  role: ViewerRole;
  children: ReactNode;
  breadcrumbs?: Crumb[];
  simplifiedHeader?: boolean;
  footerMinimal?: boolean;
  banner?: ReactNode;
  floatingPanel?: ReactNode;
  transparentHeaderAtTop?: boolean;
};

function SiteFooter({ role, minimal = false }: { role: ViewerRole; minimal?: boolean }) {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-16 pt-24 sm:px-6 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] lg:px-8">
        {/* Brand column */}
        <div className="space-y-4">
          <Link href={withRole("/", role)} className="flex items-center gap-4">
            <Image
              src="/brands/palenkelogo-light.svg"
              alt="Logo Palenke / PCN"
              width={120}
              height={240}
              className="h-24 w-auto shrink-0 object-contain"
            />
            <span>
              <span className="block font-display text-2xl leading-none text-white">Palenke</span>
              <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                Pensamiento
              </span>
            </span>
          </Link>
          <p className="max-w-sm text-sm leading-6 text-white/60">
            Plataforma de Gobierno propio del Proceso de Comunidades Negras - espacio político, organizativo y de producción de conocimiento articulado por la Corporación Agencia Afrocolombiana Hileros.
          </p>
        </div>

        {minimal ? null : (
          <>
            <div className="space-y-4 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                Navegación
              </p>
              <div className="grid gap-2.5">
                <Link href={withRole("/", role)} className="text-white/70 transition hover:text-white">
                  Inicio
                </Link>
                <Link href={withRole("/memoria-afroterritorial", role)} className="text-white/70 transition hover:text-white">
                  Memoria Afroterritorial
                </Link>
                <Link href={withRole("/gobierno-propio", role)} className="text-white/70 transition hover:text-white">
                  Gobierno Propio
                </Link>
                <Link href={withRole("/scita", role)} className="text-white/70 transition hover:text-white">
                  SCITA
                </Link>
                <Link href={withRole("/noticias", role)} className="text-white/70 transition hover:text-white">
                  Noticias y eventos
                </Link>
                {isInternal(role) ? (
                  <Link href={withRole("/geoportal", role)} className="text-white/70 transition hover:text-white">
                    Geoportal
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">Legal</p>
              <div className="grid gap-2.5">
                <Link href={withRole("/politica-de-datos", role)} className="text-white/70 transition hover:text-white">
                  Política de datos
                </Link>
                <Link href={withRole("/accesibilidad", role)} className="text-white/70 transition hover:text-white">
                  Accesibilidad
                </Link>
                <Link href={withRole("/docs", role)} className="text-white/70 transition hover:text-white">
                  Documentación técnica
                </Link>
                <ContactFooterLink />
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">Aliados</p>
              <div className="grid gap-2.5">
                <span className="text-white/70">CLARIFI</span>
                <span className="text-white/70">Turning Tides</span>
                <span className="text-white/70">Tenure Facility</span>
                <span className="text-white/70">International Land Coalition</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* PCN 4-stripe identity bar */}
      <div aria-hidden="true" className="flex h-1.5 w-full">
        <span className="flex-1 bg-white/30" />
        <span className="flex-1 bg-[#2e7d32]" />
        <span className="flex-1 bg-[#d32f2f]" />
        <span className="flex-1 bg-[#fbc02d]" />
      </div>

      <div className="px-4 py-4 text-center text-xs text-white/40 sm:px-6 lg:px-8">
        © 2026 Palenke de Pensamiento y Cuidadores del Territorio / PCN. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export function SiteLayout({
  role,
  breadcrumbs,
  children,
  simplifiedHeader,
  footerMinimal,
  banner,
  floatingPanel,
  transparentHeaderAtTop,
}: SiteLayoutProps) {
  return (
    <div className={`min-h-screen bg-[color:var(--page)] text-[color:var(--forest)] ${transparentHeaderAtTop ? '' : 'pt-[84px]'}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-[color:var(--forest)] focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-[color:var(--sand)]"
      >
        Saltar al contenido principal
      </a>
      <SiteHeader role={role} simplified={simplifiedHeader} transparentAtTop={transparentHeaderAtTop} />
      {/* PCN 4-colour brand stripe */}
      {!transparentHeaderAtTop && (
        <div aria-hidden="true" className="flex h-1.5 w-full">
          <span className="flex-1 bg-[#1a1a1a]" />
          <span className="flex-1 bg-[#2e7d32]" />
          <span className="flex-1 bg-[#d32f2f]" />
          <span className="flex-1 bg-[#fbc02d]" />
        </div>
      )}
      {banner ? <div className="border-b border-[color:var(--border-soft)] bg-[color:var(--sand-strong)]">{banner}</div> : null}
      {breadcrumbs?.length ? (
        <div className="border-b border-[color:var(--border-soft)] bg-[color:rgb(255_250_240_/_0.7)]">
          <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Breadcrumbs crumbs={breadcrumbs} role={role} />
          </div>
        </div>
      ) : null}
      <main id="main-content">{children}</main>
      {floatingPanel}
      <SiteFooter role={role} minimal={footerMinimal} />
    </div>
  );
}

export function Breadcrumbs({ crumbs, role }: { crumbs: Crumb[]; role: ViewerRole }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-[color:var(--muted-strong)]">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
            {crumb.href && !isLast ? (
              <Link href={withRole(crumb.href, role)} className="transition hover:text-[color:var(--forest)]">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current={isLast ? "page" : undefined} className="font-medium text-[color:var(--forest)]">
                {crumb.label}
              </span>
            )}
            {!isLast ? <span aria-hidden="true" className="text-[color:var(--muted)]">/</span> : null}
          </span>
        );
      })}
    </nav>
  );
}

export function VisibilityBadge({ visibility }: { visibility: Visibility }) {
  const meta = formatVisibility(visibility);

  const Icon = {
    public: Globe,
    internal: Lock,
    sensitive: Ban,
  }[meta.icon];

  return (
    <span className={`badge ${meta.className}`}>
      <span aria-hidden="true">
        {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      </span>
      <span>{meta.label}</span>
    </span>
  );
}

export function Callout({
  tone,
  title,
  children,
}: {
  tone: "info" | "warning" | "danger" | "success";
  title?: string;
  children: ReactNode;
}) {
  const ariaRole = tone === "danger" || tone === "warning" ? "alert" : "status";
  return (
    <div role={ariaRole} className={`callout callout-${tone}`}>
      {title ? <p className="mb-1 font-semibold">{title}</p> : null}
      <div className="space-y-2 text-sm leading-6">{children}</div>
    </div>
  );
}

export function PageBanner({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl px-4 py-3 text-sm sm:px-6 lg:px-8">{children}</div>;
}

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  mediaLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  mediaLabel: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-[color:var(--border-soft)] bg-[color:var(--forest)] text-[color:var(--sand)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(200,148,58,0.28),_transparent_42%),linear-gradient(135deg,_rgba(8,19,6,0.95),_rgba(13,31,10,0.84))]" />
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
        <div className="relative z-10 space-y-5">
          <span className="eyebrow text-[color:var(--gold-300)]">{eyebrow}</span>
          <h1 className="max-w-3xl font-display text-4xl leading-tight sm:text-5xl">{title}</h1>
          <p className="max-w-2xl text-base leading-7 text-[color:rgb(245_237_214_/_0.82)] sm:text-lg">
            {description}
          </p>
          {actions ? <div className="flex flex-wrap gap-3 pt-2">{actions}</div> : null}
        </div>
        <div className="relative z-10">
          <MediaPlaceholder label={mediaLabel} className="min-h-[260px] border-white/12 bg-white/8 text-[color:rgb(245_237_214_/_0.88)]" />
        </div>
      </div>
    </section>
  );
}

export function MediaPlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-full min-h-[220px] items-end rounded-[32px] border border-[color:var(--border-strong)] bg-[linear-gradient(135deg,rgba(200,148,58,0.14),rgba(255,255,255,0.04)),radial-gradient(circle_at_30%_20%,rgba(245,237,214,0.15),transparent_40%),linear-gradient(180deg,rgba(13,31,10,0.22),rgba(13,31,10,0.5))] p-6 ${className}`}
    >
      <div className="rounded-full border border-current/20 bg-black/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
        {label}
      </div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-3">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="font-display text-3xl leading-tight text-[color:var(--forest)] sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-3xl text-base leading-7 text-[color:var(--muted-strong)]">{description}</p> : null}
    </div>
  );
}

export function DocumentCard({
  document,
  role,
}: {
  document: DocumentRecord;
  role: ViewerRole;
}) {
  return (
    <article className="surface-card flex h-full flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <VisibilityBadge visibility={document.visibility} />
        <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">{document.type}</span>
      </div>
      <div className="space-y-3">
        <h3 className="font-display text-2xl leading-tight text-[color:var(--forest)]">{document.title}</h3>
        <p className="text-sm text-[color:var(--muted-strong)]">
          {document.section} · {document.territory} · {document.year}
        </p>
        <p className="line-clamp-3 text-sm leading-6 text-[color:var(--muted-strong)]">{document.description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {document.keywords.map((keyword) => (
          <span key={keyword} className="chip">
            {keyword}
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between gap-4">
        <Link href={withRole(`/biblioteca/${document.slug}`, role)} className="button-secondary">
          {document.action === "file" ? (
            "Descargar"
          ) : (
            <>
              <span>Ver</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Link>
        {document.fileSize ? <span className="text-sm text-[color:var(--muted)]">{document.fileSize}</span> : null}
      </div>
    </article>
  );
}

export function DashboardCard({
  dashboard,
  role,
}: {
  dashboard: DashboardRecord;
  role: ViewerRole;
}) {
  return (
    <article className="surface-card flex h-full flex-col gap-5">
      <VisibilityBadge visibility={dashboard.visibility} />
      <div className="space-y-3">
        <h3 className="font-display text-2xl leading-tight text-[color:var(--forest)]">{dashboard.title}</h3>
        <p className="line-clamp-3 text-sm leading-6 text-[color:var(--muted-strong)]">{dashboard.description}</p>
      </div>
      <div className="grid gap-2 text-sm text-[color:var(--muted-strong)]">
        <p>Tema: {dashboard.topic}</p>
        <p>Territorio: {dashboard.territory}</p>
        <p>Período: {dashboard.period}</p>
      </div>
      <div className="mt-auto">
        <Link href={withRole(`/estadisticas/${dashboard.slug}`, role)} className="button-secondary">
          <span>Ver tablero</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function CampaignCard({
  campaign,
  role,
}: {
  campaign: CampaignRecord;
  role: ViewerRole;
}) {
  return (
    <article className="surface-card grid gap-6 md:grid-cols-[0.86fr_1.14fr]">
      <MediaPlaceholder label="Portada de campaña" className="min-h-[220px]" />
      <div className="flex flex-col gap-4">
        <VisibilityBadge visibility={campaign.visibility} />
        <div className="space-y-3">
          <h3 className="font-display text-2xl leading-tight text-[color:var(--forest)]">{campaign.title}</h3>
          <p className="line-clamp-4 text-sm leading-6 text-[color:var(--muted-strong)]">{campaign.intro}</p>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-[color:var(--muted)]">{formatDateRange(campaign.startDate, campaign.endDate)}</span>
          <Link
            href={withRole(`/mujeres-juventudes-ninez/campanas/${campaign.slug}`, role)}
            className="button-secondary"
          >
            <span>Ver campaña</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function StoryCard({ story }: { story: StoryRecord }) {
  const labels = {
    testimony: "Testimonio",
    audio: "Audio",
    video: "Video",
    photo: "Foto",
  } as const;

  return (
    <article className="surface-card flex h-full flex-col gap-5">
      <MediaPlaceholder
        label={labels[story.kind]}
        className={story.kind === "audio" ? "min-h-[160px] bg-[color:var(--sand-strong)] text-[color:var(--forest)]" : "min-h-[180px]"}
      />
      <div className="space-y-3">
        <h3 className="font-display text-2xl leading-tight text-[color:var(--forest)]">{story.title}</h3>
        <p className="text-sm text-[color:var(--muted-strong)]">
          {story.territory} · {story.year}
        </p>
        <p className="text-sm leading-6 text-[color:var(--muted-strong)]">{story.description}</p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3">
        <span className="chip">{story.duration ?? labels[story.kind]}</span>
        <button
          type="button"
          className="button-secondary"
          aria-label={`${
            story.kind === "audio"
              ? "Escuchar"
              : story.kind === "video"
                ? "Ver video"
                : story.kind === "testimony"
                  ? "Leer testimonio"
                  : "Abrir"
          }: ${story.title}`}
        >
          {story.kind === "audio"
            ? "Escuchar"
            : story.kind === "video"
              ? "Ver video"
              : story.kind === "testimony"
                ? "Leer"
                : "Abrir"}
        </button>
      </div>
    </article>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="surface-card flex min-h-[220px] flex-col items-center justify-center gap-4 text-center">
      <span aria-hidden="true">
        <Search className="h-10 w-10 text-[color:var(--muted)]" />
      </span>
      <div className="space-y-2">
        <h3 className="font-display text-3xl text-[color:var(--forest)]">{title}</h3>
        <p className="max-w-md text-sm leading-6 text-[color:var(--muted-strong)]">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="Cargando resultados…" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} aria-hidden="true" className="surface-card animate-pulse">
          <div className="mb-5 h-7 w-28 rounded-full bg-[color:var(--sand-strong)]" />
          <div className="mb-3 h-9 w-4/5 rounded-2xl bg-[color:var(--sand-strong)]" />
          <div className="mb-2 h-4 w-1/2 rounded-full bg-[color:var(--sand-strong)]" />
          <div className="space-y-2">
            <div className="h-4 rounded-full bg-[color:var(--sand-strong)]" />
            <div className="h-4 w-11/12 rounded-full bg-[color:var(--sand-strong)]" />
            <div className="h-4 w-3/4 rounded-full bg-[color:var(--sand-strong)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card">
      <p className="text-sm text-[color:var(--muted)]">{label}</p>
      <p className="mt-3 font-display text-5xl text-[color:var(--forest)]">{value}</p>
    </div>
  );
}

export function DetailList({
  items,
}: {
  items: Array<{ label: string; value: ReactNode }>;
}) {
  return (
    <dl className="grid gap-4 rounded-[28px] border border-[color:var(--border-soft)] bg-white p-6 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="grid gap-1">
          <dt className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">{item.label}</dt>
          <dd className="text-sm leading-6 text-[color:var(--forest)]">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function FilterChip({ label, href }: { label: string; href?: string }) {
  const content = (
    <>
      <span>{label}</span>
      <span aria-hidden="true">×</span>
    </>
  );

  if (!href) {
    return <span className="chip">{content}</span>;
  }

  return (
    <Link href={href} className="chip transition hover:border-[color:var(--gold-500)]" aria-label={`Quitar filtro: ${label}`}>
      {content}
    </Link>
  );
}

export function InputLabel({
  label,
  required,
  hint,
  htmlFor,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  htmlFor?: string;
}) {
  return (
    <div className="mb-2">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-[color:var(--forest)]">
        {label}
        {required ? <span className="ml-1 text-[color:var(--danger)]">*</span> : null}
      </label>
      {hint ? <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">{hint}</p> : null}
    </div>
  );
}

export function Field({
  label,
  required,
  hint,
  children,
  error,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-[color:var(--forest)]">
          {label}
          {required ? <span className="ml-1 text-[color:var(--danger)]">*</span> : null}
        </span>
        {hint ? (
          <span className="mb-2 mt-1 block text-xs leading-5 text-[color:var(--muted)]">{hint}</span>
        ) : null}
        {children}
      </label>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-[color:var(--danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({
  defaultValue,
  placeholder,
  type = "text",
  error,
}: {
  defaultValue?: string | number;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "search" | "url";
  error?: boolean;
}) {
  return (
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className={`input-shell ${error ? "border-[color:var(--danger)] bg-[color:rgb(248_213_213_/_0.25)]" : ""}`}
    />
  );
}

export function TextArea({
  defaultValue,
  placeholder,
  rows = 4,
  error,
}: {
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  error?: boolean;
}) {
  return (
    <textarea
      defaultValue={defaultValue}
      placeholder={placeholder}
      rows={rows}
      className={`textarea-shell ${error ? "border-[color:var(--danger)] bg-[color:rgb(248_213_213_/_0.25)]" : ""}`}
    />
  );
}

export function SelectInput({
  options,
  defaultValue,
}: {
  options: string[];
  defaultValue?: string;
}) {
  return (
    <select defaultValue={defaultValue ?? ""} className="input-shell">
      <option value="">Seleccionar</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function DropZone({
  label = "PDF, DOCX. Máximo 20 MB",
  state = "idle",
}: {
  label?: string;
  state?: "idle" | "loading" | "success" | "error";
}) {
  if (state === "loading") {
    return (
      <div className="drop-zone">
        <div className="h-3 w-full overflow-hidden rounded-full bg-[color:var(--sand-strong)]">
          <div className="h-full w-[45%] rounded-full bg-[color:var(--gold-500)]" />
        </div>
        <p className="text-sm text-[color:var(--muted-strong)]">nombre_archivo.pdf · 45%</p>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="drop-zone">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--forest)]">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          <span>nombre_archivo.pdf - 2.3 MB</span>
        </p>
        <button type="button" className="button-ghost">
          Eliminar
        </button>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="drop-zone border-[color:var(--danger)] bg-[color:rgb(248_213_213_/_0.16)]">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--danger)]">
          <XCircle className="h-4 w-4" aria-hidden="true" />
          <span>nombre_archivo.exe - Formato no permitido.</span>
        </p>
        <p className="text-sm text-[color:var(--muted-strong)]">Solo se aceptan PDF y DOCX.</p>
      </div>
    );
  }

  return (
    <div className="drop-zone">
      <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">
        <CloudUpload className="h-4 w-4" aria-hidden="true" />
        <span>Seleccionar archivo</span>
      </p>
      <p className="text-sm text-[color:var(--muted-strong)]">Arrastra tu archivo aquí o haz clic para subirlo</p>
      <p className="text-xs text-[color:var(--muted)]">{label}</p>
    </div>
  );
}

export function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "neutral" | "success" | "warning" | "danger";
}) {
  return <span className={`status-pill status-${tone}`}>{label}</span>;
}

export function Toolbar({
  children,
  actions,
}: {
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="surface-card flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
      <div className="min-w-0 w-full flex-1">{children}</div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-3 lg:justify-end">{actions}</div>
      ) : null}
    </div>
  );
}

export function TableCard({
  headers,
  rows,
  footer,
  columnWidths,
  columnAlign,
  minTableWidth = "min-w-[720px]",
  emptyMessage,
}: {
  headers: string[];
  rows: ReactNode[][];
  footer?: ReactNode;
  /** Optional width classes per column (e.g. ["w-[18%]", "min-w-[200px]"]). Enables table-fixed layout. */
  columnWidths?: string[];
  /** Per-column alignment: left (default), center, or right. */
  columnAlign?: Array<"left" | "center" | "right">;
  /** Tailwind min-width on the table element (e.g. "min-w-[1080px]"). */
  minTableWidth?: string;
  emptyMessage?: string;
}) {
  const hasColWidths = columnWidths && columnWidths.length === headers.length;
  const alignClass = (index: number) => {
    const align = columnAlign?.[index] ?? "left";
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  return (
    <div className="surface-card overflow-hidden p-0">
      <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <table
          className={`w-full divide-y divide-[color:var(--border-soft)] text-left text-sm ${minTableWidth} ${
            hasColWidths ? "table-fixed" : ""
          }`}
        >
          {hasColWidths ? (
            <colgroup>
              {columnWidths!.map((w, i) => (
                <col key={i} className={w} />
              ))}
            </colgroup>
          ) : null}
          <thead className="bg-[color:var(--sand-strong)]">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={header}
                  className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--forest)] sm:px-5 lg:px-6 lg:py-4 ${alignClass(index)} ${
                    index === 0 ? "rounded-tl-[28px]" : ""
                  } ${index === headers.length - 1 ? "rounded-tr-[28px]" : ""}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--border-soft)] bg-white">
            {rows.length === 0 && emptyMessage ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-6 py-12 text-center text-sm text-[color:var(--muted-strong)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : null}
            {rows.map((row, index) => (
              <tr key={index} className="transition-colors hover:bg-[color:rgb(255_250_240_/_0.45)]">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-4 py-4 align-middle text-[color:var(--muted-strong)] sm:px-5 lg:px-6 ${alignClass(cellIndex)}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer ? <div className="border-t border-[color:var(--border-soft)] px-5 py-4 sm:px-6">{footer}</div> : null}
    </div>
  );
}
