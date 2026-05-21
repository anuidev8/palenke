import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { AdminLayout } from "@/components/mock/AdminLayout";
import { Callout, Toolbar, VisibilityBadge } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";
import { createSupabaseService } from "@/lib/supabase/service";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { FileText, Folder, Lock, CheckCircle2, AlertCircle } from "lucide-react";

type AdminTab = "instrumentos" | "normativa";

export default async function AdminDocumentosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  noStore();
  const { role, searchParams: params } = await requireAdmin(searchParams);
  const query = (getFirstParam(params.q) ?? "").toLowerCase();
  const visibility = getFirstParam(params.visibility) ?? "";
  const requestedTab = getFirstParam(params.tab);
  const tab: AdminTab = requestedTab === "normativa" ? "normativa" : "instrumentos";
  const instrument = tab === "normativa" ? "normativa-vigente" : getFirstParam(params.instrument) ?? "";

  let documents = [];
  let dbError = false;

  if (hasSupabaseServiceConfig()) {
    try {
      const supabase = createSupabaseService();
      
      let dbQuery = supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (query) {
        dbQuery = dbQuery.ilike("title", `%${query}%`);
      }
      if (visibility) {
        dbQuery = dbQuery.eq("visibility", visibility);
      }
      if (instrument) {
        dbQuery = dbQuery.eq("instrument", instrument);
      } else if (tab === "instrumentos") {
        dbQuery = dbQuery.neq("instrument", "normativa-vigente");
      }

      const { data, error } = await dbQuery;
      
      if (error) {
        console.error("Error fetching documents:", error);
        dbError = true;
      } else {
        documents = data || [];
      }
    } catch (e) {
      console.error(e);
      dbError = true;
    }
  }

  if (tab === "normativa") {
    documents = [...documents].sort((a, b) => {
      const orderDiff = Number(a.priority_order ?? 0) - Number(b.priority_order ?? 0);
      if (orderDiff !== 0) return orderDiff;
      const aTime = new Date(a.published_on ?? a.created_at).getTime();
      const bTime = new Date(b.published_on ?? b.created_at).getTime();
      return bTime - aTime;
    });
  }

  // Deduplicate instruments for filter
  const uniqueInstruments = [...new Set(documents.map((d) => d.instrument))]
    .filter((value): value is string => Boolean(value) && value !== "normativa-vigente")
    .sort();
  const requiredNorms = [
    "Ley 70 de 1993",
    "Decreto 1745 de 1995",
    "Decreto 1384 de 2023",
    "Decreto 1396 de 2023",
    "Decreto 0129 de 2024",
  ];
  const availableNorms = documents
    .filter((doc) => doc.instrument === "normativa-vigente")
    .map((doc) => String(doc.title));
  const missingNorms = requiredNorms.filter(
    (title) => !availableNorms.some((available) => available.toLowerCase().includes(title.toLowerCase())),
  );

  return (
    <AdminLayout
      role={role}
      active="documentos"
      title="Gestión de Biblioteca"
      intro="Administra la Biblioteca en dos frentes: instrumentos/documentos internos y normativa vigente pública. Se mantiene el CRUD actual, pero cada grupo se gestiona por separado."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          href={withRole("/admin/documentos", role, { tab: "instrumentos" })}
          className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
            tab === "instrumentos"
              ? "bg-[#1a1a1a] text-white"
              : "border border-[#e8dfd3] bg-white text-[#1a1a1a] hover:bg-[#f8f5f2]"
          }`}
        >
          Instrumentos
        </Link>
        <Link
          href={withRole("/admin/documentos", role, { tab: "normativa" })}
          className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
            tab === "normativa"
              ? "bg-[#1a1a1a] text-white"
              : "border border-[#e8dfd3] bg-white text-[#1a1a1a] hover:bg-[#f8f5f2]"
          }`}
        >
          Normativa vigente
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-[#e8dfd3] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#e3f2fd] flex items-center justify-center text-[#1565c0]">
            <Folder className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#7a756e] uppercase tracking-wider">Total Archivos</p>
            <p className="text-3xl font-black text-[#1a1a1a]">{documents.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#e8dfd3] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#fce4ec] flex items-center justify-center text-[#c2185b]">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#7a756e] uppercase tracking-wider">Restringidos</p>
            <p className="text-3xl font-black text-[#1a1a1a]">
              {documents.filter(d => d.visibility === 'internal' || d.visibility === 'sensitive').length}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#e8dfd3] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#2e7d32]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#7a756e] uppercase tracking-wider">Públicos</p>
            <p className="text-3xl font-black text-[#1a1a1a]">
              {documents.filter(d => d.visibility === 'public').length}
            </p>
          </div>
        </div>
      </div>

      <Toolbar
        actions={
          <div className="flex gap-3">
            <Link href={withRole("/admin/documentos/nuevo", role, { tab })} className="inline-flex items-center gap-2 rounded-xl bg-[#1a1a1a] px-4 py-2 text-sm font-bold text-white transition hover:bg-black">
              {tab === "normativa" ? "+ Nueva norma vigente" : "+ Nuevo documento"}
            </Link>
            {tab === "instrumentos" ? (
              <Link href={withRole("/admin/documentos/rutas-metodologicas", role)} className="inline-flex items-center gap-2 rounded-xl border border-[#e8dfd3] bg-white px-4 py-2 text-sm font-bold text-[#1a1a1a] transition hover:bg-[#f8f5f2]">
                <FileText className="w-4 h-4" />
                Rutas metodológicas
              </Link>
            ) : null}
          </div>
        }
      >
        <form id="filter-form" action="/admin/documentos" className="flex flex-wrap gap-3 w-full">
          <input type="hidden" name="tab" value={tab} />
          <input
            name="q"
            defaultValue={query}
            placeholder="Buscar por título..."
            className="flex-1 min-w-[200px] px-4 py-2 bg-white border border-[#e8dfd3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
          />
          {tab === "instrumentos" ? (
            <select 
              name="instrument" 
              defaultValue={instrument} 
              className="px-4 py-2 bg-white border border-[#e8dfd3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
            >
              <option value="">Todos los instrumentos</option>
              {uniqueInstruments.map((inst) => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
          ) : null}
          <select 
            name="visibility" 
            defaultValue={visibility} 
            className="px-4 py-2 bg-white border border-[#e8dfd3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
          >
            <option value="">Todas las visibilidades</option>
            <option value="public">Público</option>
            <option value="internal">Interno</option>
            <option value="sensitive">Sensible</option>
          </select>
          <button type="submit" className="px-6 py-2 bg-[#1a1a1a] text-white font-bold rounded-xl text-sm hover:bg-black transition-colors shrink-0">
            Filtrar
          </button>
        </form>
  
      </Toolbar>

      {!dbError && tab === "normativa" && missingNorms.length > 0 ? (
        <Callout tone="warning" title="Normativa priorizada incompleta">
          <p>
            Faltan documentos clave frente al listado priorizado de normativa vigente: {missingNorms.join(", ")}.
          </p>
        </Callout>
      ) : null}

      {dbError ? (
        <div className="p-6 bg-[#fff3e0] border border-[#ffb74d] rounded-2xl flex items-start gap-4 mb-8">
          <AlertCircle className="w-6 h-6 text-[#e65100] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[#e65100] font-bold mb-1">Error de conexión</h3>
            <p className="text-[#e65100]/80 text-sm">No se pudieron cargar los documentos desde la base de datos. Verifica la conexión a Supabase.</p>
          </div>
        </div>
      ) : documents.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center bg-white border border-[#e8dfd3] border-dashed rounded-3xl">
          <Folder className="w-16 h-16 text-[#d1ccc5] mb-4" />
          <p className="text-[#4a4540] font-medium text-lg">No se encontraron documentos</p>
          <p className="text-[#7a756e] text-sm mt-1">Intenta con otros filtros o verifica la base de datos.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#e8dfd3] rounded-[24px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#fcfaf7] border-b border-[#e8dfd3]">
                  <th className="px-6 py-4 font-bold text-[#7a756e] uppercase tracking-wider text-xs">Título y Ubicación</th>
                  <th className="px-6 py-4 font-bold text-[#7a756e] uppercase tracking-wider text-xs">Instrumento</th>
                  <th className="px-6 py-4 font-bold text-[#7a756e] uppercase tracking-wider text-xs">Visibilidad</th>
                  <th className="px-6 py-4 font-bold text-[#7a756e] uppercase tracking-wider text-xs">Fecha de registro</th>
                  <th className="px-6 py-4 font-bold text-[#7a756e] uppercase tracking-wider text-xs">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8dfd3]">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#fcfaf7] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-[#d1ccc5] mt-0.5 group-hover:text-[#4a4540] transition-colors" />
                        <div>
                            <Link
                            href={withRole(`/admin/documentos/${doc.id}/editar`, role, { tab })}
                            className="font-bold text-[#1a1a1a] text-base line-clamp-2 underline decoration-transparent hover:decoration-current"
                          >
                            {doc.title}
                          </Link>
                          <p className="text-xs text-[#7a756e] mt-1 line-clamp-1 font-mono">{doc.storage_path || doc.council || 'Sin ruta'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#f4f1ec] text-[#4a4540] uppercase tracking-wider">
                        {doc.instrument}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <VisibilityBadge visibility={doc.visibility} />
                    </td>
                    <td className="px-6 py-4 text-[#7a756e]">
                      {new Date(doc.created_at).toLocaleDateString("es-CO", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={withRole(`/admin/documentos/${doc.id}/editar`, role, { tab })}
                        className="inline-flex items-center rounded-lg border border-[#e8dfd3] px-3 py-1.5 text-xs font-bold text-[#1a1a1a] hover:bg-[#f8f5f2]"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
