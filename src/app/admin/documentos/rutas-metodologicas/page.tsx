import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { AdminLayout, Callout, TableCard } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { createSupabaseService } from "@/lib/supabase/service";
import { RUTAS_METODOLOGICAS_INSTRUMENTS } from "@/lib/rutas-metodologicas";
import { uploadRutaMetodologica } from "./actions";

type CurrentDoc = {
  instrument: string;
  title: string;
  storage_path: string | null;
  created_at: string;
};

function formatDate(date?: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function listCurrentRoutes() {
  if (!hasSupabaseServiceConfig()) {
    return { mode: "missing-config" as const, rows: [] as CurrentDoc[] };
  }

  const supabase = createSupabaseService();
  const instruments = RUTAS_METODOLOGICAS_INSTRUMENTS.map((item) => item.instrument);

  const { data, error } = await supabase
    .from("documents")
    .select("instrument,title,storage_path,created_at")
    .eq("visibility", "public")
    .in("instrument", instruments)
    .order("created_at", { ascending: false });

  if (error) {
    return { mode: "query-error" as const, rows: [] as CurrentDoc[] };
  }

  return { mode: "supabase" as const, rows: (data ?? []) as CurrentDoc[] };
}

export default async function RutasMetodologicasAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  noStore();
  const { role, searchParams: params } = await requireAdmin(searchParams);
  const notice = getFirstParam(params.notice);
  const error = getFirstParam(params.error);
  const instrumentFilter = getFirstParam(params.instrument);
  const data = await listCurrentRoutes();

  const visibleRows = instrumentFilter
    ? data.rows.filter((item) => item.instrument === instrumentFilter)
    : data.rows;

  return (
    <AdminLayout
      role={role}
      active="documentos"
      title="Rutas metodológicas"
      intro="Sube y reemplaza los documentos base metodológicos por instrumento de gobierno propio."
    >
      <div className="flex flex-wrap gap-3">
        <Link href={withRole("/admin/documentos", role)} className="button-secondary">
          Volver a biblioteca
        </Link>
      </div>

      {notice === "uploaded" ? (
        <Callout tone="success" title="Documento cargado correctamente">
          <p>El archivo se guardó en `docs-public` y la metadata quedó sincronizada en `public.documents`.</p>
        </Callout>
      ) : null}

      {error ? (
        <Callout tone="danger" title="No se pudo completar la carga">
          <p>{decodeURIComponent(error)}</p>
        </Callout>
      ) : null}

      {data.mode === "missing-config" ? (
        <Callout tone="warning" title="Configuración incompleta">
          <p>
            Falta configuración de Supabase service en el servidor. Define variables de entorno para habilitar
            carga real.
          </p>
        </Callout>
      ) : null}

      {data.mode === "query-error" ? (
        <Callout tone="warning" title="No se pudieron leer documentos actuales">
          <p>Revisa conectividad/permisos de Supabase. La carga puede fallar hasta resolver este punto.</p>
        </Callout>
      ) : null}

      <section className="surface-card space-y-4">
        <h2 className="font-display text-2xl text-[color:var(--forest)]">Cargar nuevo documento base</h2>
        <form action={uploadRutaMetodologica} className="grid gap-4 lg:grid-cols-2">
          <input type="hidden" name="role" value={role} />

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Instrumento</span>
            <select name="instrument" required className="input-shell">
              <option value="">Seleccionar</option>
              {RUTAS_METODOLOGICAS_INSTRUMENTS.map((item) => (
                <option key={item.instrument} value={item.instrument}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Título (opcional)</span>
            <input
              name="title"
              placeholder="Si lo dejas vacío, se usa el título estándar"
              className="input-shell"
            />
          </label>

          <label className="grid gap-2 text-sm lg:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Archivo PDF (máximo 20 MB)</span>
            <input name="file" type="file" accept="application/pdf" required className="input-shell" />
          </label>

          <div className="lg:col-span-2">
            <button type="submit" className="button-primary">
              Subir y publicar ruta metodológica
            </button>
          </div>
        </form>
      </section>

      <TableCard
        headers={["Instrumento", "Título", "Ruta storage", "Última actualización"]}
        rows={visibleRows.map((row) => [
          <span key="instrument" className="chip">
            {row.instrument}
          </span>,
          <span key="title">{row.title}</span>,
          <span key="path" className="font-mono text-xs">
            {row.storage_path ?? "—"}
          </span>,
          <span key="updated">{formatDate(row.created_at)}</span>,
        ])}
      />
    </AdminLayout>
  );
}
