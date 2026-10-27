import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Search, X } from "lucide-react";
import { SupplierShell } from "./SupplierShell";
import NotFound from "@/pages/NotFound";
import { matchesSupplier } from "@/utils/supplierDirectory";
import { supplierPagination, supplierRegionLabel } from "@/utils/supplierPresentation";
import type { SupplierIndexEntry } from "@/types/supplier";
import manifest from "@/content/supplierManifest.json";

export const suppliersPath = "/proveedores";
export const suppliersTitle = "Proveedores en Chile: busca por nombre o RUT | Ruka";
export const suppliersDescription = "Encuentra proveedores por nombre, RUT, rubro o ubicación. Consulta razón social, actividades económicas y antecedentes empresariales con fuentes públicas.";
const control = "min-h-12 w-full rounded-lg border border-[#cbd2df] bg-white px-3 text-base text-[#171827] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function embeddedPage(page: number): SupplierIndexEntry[] | undefined {
  if (typeof document === "undefined") return;
  try { const data = JSON.parse(document.getElementById("supplier-index-data")?.textContent ?? "null"); return data?.page === page ? data.entries : undefined; } catch { return; }
}

export function SuppliersIndex({ page: suppliedPage, entries }: { page?: number; entries?: SupplierIndexEntry[] }) {
  const params = useParams();
  const [search, setSearch] = useSearchParams();
  const page = suppliedPage ?? (params.page ? Number(params.page) : 1);
  const pageSize = manifest.pageSize;
  const totalPages = Math.ceil(manifest.total / pageSize);
  const validPage = Number.isSafeInteger(page) && page >= 1 && page <= totalPages && (!params.page || String(page) === params.page);
  const [pageData, setPageData] = useState<{ page: number; rows?: SupplierIndexEntry[] }>(() => ({ page, rows: entries ?? embeddedPage(page) ?? (page === 1 ? manifest.initial : undefined) }));
  const [all, setAll] = useState<SupplierIndexEntry[]>();
  const [searchReady, setSearchReady] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const query = search.get("q") ?? "";
  const category = search.get("rubro") ?? "Todas";
  const region = search.get("region") ?? "Todas";
  const filtered = !!query || category !== "Todas" || region !== "Todas";
  const currentRows = entries ?? (pageData.page === page ? pageData.rows : undefined);
  useEffect(() => {
    if (!validPage || currentRows) return;
    const controller = new AbortController();
    setError(false);
    fetch(`/supplier-data/page-${page}.json`, { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error("Directory unavailable");
      const rows = await response.json();
      if (!controller.signal.aborted) setPageData({ page, rows });
    }).catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, [page, validPage, currentRows, attempt]);
  useEffect(() => {
    if (all || (!filtered && !searchReady)) return;
    const controller = new AbortController();
    setError(false);
    (async () => {
      const rows: SupplierIndexEntry[] = [];
      // Bounded requests and compact public records; no profile/operational dataset in JS.
      for (const url of manifest.shards) {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Search unavailable");
        rows.push(...await response.json());
      }
      if (!controller.signal.aborted) setAll(rows);
    })().catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, [all, filtered, searchReady, attempt]);
  if (!validPage) return <NotFound />;
  const loading = filtered ? !all : !currentRows;
  const results = filtered ? (all ?? []).filter(row => matchesSupplier(row, query, category) && (region === "Todas" || row.region === region)) : currentRows ?? [];
  const resultPages = filtered ? Math.ceil(results.length / pageSize) : totalPages;
  const requestedResultPage = Number(search.get("p") ?? 1);
  const selectedPage = filtered ? Math.max(1, Math.min(Number.isSafeInteger(requestedResultPage) ? requestedResultPage : 1, resultPages || 1)) : page;
  const visible = filtered ? results.slice((selectedPage - 1) * pageSize, selectedPage * pageSize) : results;
  const count = filtered ? results.length : manifest.total;
  const path = page === 1 ? suppliersPath : `${suppliersPath}/pagina/${page}`;
  const title = page === 1 ? suppliersTitle : `Proveedores en Chile — página ${page} de ${totalPages} | Ruka`;
  const changeFilter = (key: string, value: string) => { const next = new URLSearchParams(search); if (value && value !== "Todas") next.set(key, value); else next.delete(key); next.delete("p"); setSearch(next, { replace: true }); };
  const pageHref = (target: number) => {
    if (!filtered) return target === 1 ? suppliersPath : `${suppliersPath}/pagina/${target}`;
    const next = new URLSearchParams(search); next.set("p", String(target)); return `${path}?${next}`;
  };
  return <SupplierShell directory path={path} title={title} description={page === 1 ? suppliersDescription : `Página ${page} del directorio de proveedores de Ruka. Consulta empresas, RUT, rubros y antecedentes públicos.`} name={page === 1 ? "Directorio de proveedores" : `Proveedores · página ${page}`}>
    <Helmet><script id="supplier-index-data" type="application/json">{JSON.stringify({ page, entries: currentRows ?? [] }).replace(/</g, "\\u003c")}</script>{filtered && <meta name="robots" content="noindex, follow" />}{filtered && <meta name="googlebot" content="noindex, follow" />}</Helmet>
    <header className="mb-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-end lg:gap-16">
      <div><p className="mb-3 text-sm font-semibold text-[#424ec0]">Directorio de proveedores · Chile</p><h1 className="max-w-3xl text-balance text-[clamp(2rem,3.5vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.035em]">Encuentra la empresa.<br />Ten claro con quién compras.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[#505b70]">Razón social, RUT y actividades, en un solo lugar. Revisa los antecedentes de tu proveedor antes de registrar una compra.</p></div>
      <p className="max-w-sm text-sm leading-7 text-[#60687a]">Información empresarial de fuentes públicas, con fecha y origen en cada ficha. Sin registro para consultar.</p>
    </header>
    <form role="search" aria-label="Buscar proveedores" onSubmit={event => event.preventDefault()} className="rounded-xl bg-[#eff1ff] p-5 sm:p-7">
      <label htmlFor="supplier-search" className="mb-2 block font-medium">¿Qué proveedor buscas?</label>
      <div className="relative"><Search size={21} aria-hidden="true" className="pointer-events-none absolute left-4 top-5 text-[#505b70]" /><input id="supplier-search" type="search" value={query} onFocus={() => setSearchReady(true)} onChange={event => changeFilter("q", event.target.value)} placeholder="Nombre, razón social o RUT" className={`${control} min-h-16 pl-12 pr-14 placeholder:text-[#60687a] [&::-webkit-search-cancel-button]:hidden`} />{query && <button type="button" onClick={() => changeFilter("q", "")} aria-label="Limpiar búsqueda" className="absolute right-2 top-2 grid h-12 w-12 place-items-center rounded-md hover:bg-[#f2f3f8] focus-visible:outline-primary"><X size={19} aria-hidden="true" /></button>}</div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2"><div><label htmlFor="supplier-category" className="mb-2 block text-sm font-medium">Rubro</label><select id="supplier-category" value={category} onChange={event => changeFilter("rubro", event.target.value)} className={control}><option>Todas</option>{manifest.categories.map(item => <option key={item}>{item}</option>)}</select></div><div><label htmlFor="supplier-region" className="mb-2 block text-sm font-medium">Región del registro empresarial</label><select id="supplier-region" value={region} onChange={event => changeFilter("region", event.target.value)} className={control}><option>Todas</option>{manifest.regions.map(item => <option key={item} value={item}>{supplierRegionLabel(item)}</option>)}</select></div></div>
    </form>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><p role="status" className="text-sm text-[#505b70]">{loading ? "Buscando en el directorio…" : `${count.toLocaleString("es-CL")} ${count === 1 ? "empresa" : "empresas"}${filtered ? " en esta búsqueda" : " en el directorio"}`}</p>{filtered && <button onClick={() => setSearch({})} className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-[#424ec0] hover:underline focus-visible:outline-primary"><X size={15} aria-hidden="true" />Limpiar filtros</button>}</div>
    {error && <div role="alert" className="mt-4 rounded-lg border border-[#dce2ed] p-5"><p>No pudimos cargar el directorio completo. Las fichas ya visibles siguen disponibles.</p><button onClick={() => setAttempt(value => value + 1)} className="mt-2 min-h-11 rounded-md font-semibold text-[#424ec0] focus-visible:outline-primary">Reintentar</button></div>}
    <div aria-busy={loading} className="mt-5">
      {loading && !error && <div aria-hidden="true" className="divide-y divide-[#e6e9f0] border-y border-[#dce2ed]">{[1,2,3,4].map(item => <div key={item} className="grid gap-3 py-7"><div className="h-5 w-2/3 rounded bg-[#f0f2f7]" /><div className="h-4 w-1/3 rounded bg-[#f0f2f7]" /></div>)}</div>}
      {!loading && visible.length > 0 && <div className="border-y border-[#dce2ed]"><div aria-hidden="true" className="hidden grid-cols-[minmax(0,1fr)_155px_200px_90px] gap-5 border-b border-[#dce2ed] bg-[#f8f9fc] px-4 py-3 text-sm text-[#60687a] lg:grid"><span>Empresa</span><span>RUT</span><span>Rubro / ubicación</span><span>Información</span></div>{visible.map(row => <Link key={row.slug} to={`${suppliersPath}/${row.slug}`} className="group grid min-w-0 gap-x-5 gap-y-3 border-b border-[#e6e9f0] px-3 py-6 transition-colors last:border-b-0 hover:bg-[#f8f9ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:px-4 lg:grid-cols-[minmax(0,1fr)_155px_200px_90px] lg:items-center"><div className="min-w-0"><h2 className="break-words text-lg font-semibold leading-7 group-hover:text-[#424ec0]">{row.name}</h2>{row.name.toLocaleLowerCase("es") !== row.legalName.toLocaleLowerCase("es") && <p className="mt-1 text-sm leading-6 text-[#60687a]">{row.legalName}</p>}</div><p className="text-sm font-medium tabular-nums"><span className="text-[#60687a] lg:sr-only">RUT </span>{row.rut}</p><div className="text-sm leading-6 text-[#60687a]"><p>{row.category}</p>{row.commune && <p className="mt-1">{row.commune}</p>}</div><span className="flex items-center gap-2 text-sm font-semibold text-[#424ec0]">Ver ficha<ArrowUpRight size={16} aria-hidden="true" /></span></Link>)}</div>}
      {!loading && visible.length === 0 && <section className="py-14"><h2 className="text-2xl font-semibold">No encontramos esa empresa.</h2><p className="mt-4 max-w-xl leading-7 text-[#505b70]">Prueba con el RUT de la factura o con parte de la razón social. También puedes quitar los filtros de rubro y región.</p></section>}
    </div>
    {!loading && resultPages > 1 && <nav aria-label="Páginas de proveedores" className="mt-7 flex flex-wrap items-center justify-between gap-4"><p className="text-sm text-[#60687a]">{((selectedPage - 1) * pageSize + 1).toLocaleString("es-CL")}–{Math.min(selectedPage * pageSize, count).toLocaleString("es-CL")} de {count.toLocaleString("es-CL")}</p><div className="flex items-center gap-1">{selectedPage > 1 && <Link to={pageHref(selectedPage - 1)} aria-label="Página anterior" className="grid h-11 w-11 shrink-0 place-items-center rounded-md hover:bg-[#eff1ff] focus-visible:outline-primary"><ArrowLeft size={18} aria-hidden="true" /></Link>}{supplierPagination(selectedPage, resultPages).map((item, index) => item === "gap" ? <span key={`gap-${index}`} className="px-1 text-[#60687a]">…</span> : <Link key={item} to={pageHref(item)} aria-label={`Página ${item}`} aria-current={item === selectedPage ? "page" : undefined} className={`${item === 1 || item === selectedPage || item === resultPages ? "grid" : "hidden sm:grid"} h-11 min-w-11 place-items-center rounded-md px-2 text-sm font-medium focus-visible:outline-primary ${item === selectedPage ? "bg-[#171827] text-white" : "hover:bg-[#eff1ff]"}`}>{item}</Link>)}{selectedPage < resultPages && <Link to={pageHref(selectedPage + 1)} aria-label="Página siguiente" className="grid h-11 w-11 shrink-0 place-items-center rounded-md hover:bg-[#eff1ff] focus-visible:outline-primary"><ArrowRight size={18} aria-hidden="true" /></Link>}</div></nav>}
    <aside className="mt-12 max-w-3xl border-t border-[#dce2ed] pt-7"><h2 className="text-lg font-semibold">El RUT importa más que el nombre.</h2><p className="mt-3 text-sm leading-7 text-[#505b70]">Una marca puede operar con distintas razones sociales. Compara el RUT de la ficha con el de tu documento. La ubicación corresponde al registro empresarial, no a la cobertura de despacho. Las empresas listadas no se presentan como clientes ni partners de Ruka.</p></aside>
  </SupplierShell>;
}
