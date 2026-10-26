import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, Copy, Search, X } from "lucide-react";
import { ResourceLayout, resourceLinkClass } from "@/components/resources/ResourceLayout";
import NotFound from "@/pages/NotFound";
import { matchesSupplier } from "@/utils/supplierDirectory";
import type { SupplierIndexEntry, SupplierProfile } from "@/types/supplier";
import manifest from "@/content/supplierManifest.json";

export const suppliersPath = "/proveedores";
export const suppliersTitle = "Directorio de proveedores: RUT y canales oficiales | Ruka";
export const suppliersDescription = "Busca empresas por nombre, marca o RUT. Consulta su razón social, fuentes públicas y canal oficial antes de registrar una compra.";
const inputClass = "min-h-12 w-full rounded-lg border border-[#cbd2df] bg-white px-4 text-base text-[#171827] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function SuppliersIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [rows, setRows] = useState<SupplierIndexEntry[]>(manifest.initial);
  const [loaded, setLoaded] = useState(manifest.total <= manifest.initial.length);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [limit, setLimit] = useState(20);
  useEffect(() => {
    if (loaded) return;
    const controller = new AbortController();
    setError(false);
    // Small public search shards, never full profiles or operational database rows.
    (async () => {
      const entries: SupplierIndexEntry[] = [];
      for (const url of manifest.shards) {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Search unavailable");
        entries.push(...await response.json());
      }
      if (!controller.signal.aborted) { setRows(entries); setLoaded(true); }
    })().catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, [loaded, attempt]);
  const results = rows.filter(row => matchesSupplier(row, query, category));
  const reset = () => { setQuery(""); setCategory("Todas"); setLimit(20); };
  return <ResourceLayout catalog path={suppliersPath} title={suppliersTitle} description={suppliersDescription} eyebrow="Directorio de proveedores" heading="La empresa correcta. Los datos a mano." lead="Busca por nombre, marca o RUT. Revisa la razón social y llega al canal oficial, sin recorrer facturas antiguas." showContact>
    <form role="search" aria-label="Buscar proveedores" onSubmit={event => event.preventDefault()} className="grid gap-4 rounded-xl border border-[#dce2ed] bg-[#f8f9fc] p-5 sm:grid-cols-[1fr_300px] sm:p-6">
      <div><label htmlFor="supplier-search" className="text-sm font-semibold">Nombre, marca o RUT</label><div className="relative mt-2"><Search size={19} aria-hidden="true" className="pointer-events-none absolute left-4 top-4 text-[#505b70]" /><input id="supplier-search" type="search" value={query} onChange={event => { setQuery(event.target.value); setLimit(20); }} placeholder="Ej. Colun o 81.094.100-6" className={`${inputClass} min-h-14 pl-12 pr-14 placeholder:text-[#60687a] [&::-webkit-search-cancel-button]:hidden`} />{query && <button type="button" aria-label="Limpiar búsqueda" onClick={() => { setQuery(""); setLimit(20); }} className="absolute right-1 top-1 grid h-12 w-12 place-items-center rounded-md focus-visible:ring-2 focus-visible:ring-primary"><X size={18} aria-hidden="true" /></button>}</div></div>
      <div><label htmlFor="supplier-category" className="text-sm font-semibold">Rubro</label><select id="supplier-category" value={category} onChange={event => { setCategory(event.target.value); setLimit(20); }} className={`${inputClass} mt-2 min-h-14`}><option>Todas</option>{manifest.categories.map(value => <option key={value}>{value}</option>)}</select></div>
    </form>
    <p role="status" className="mt-4 text-sm text-[#505b70]">{loaded ? `${results.length} ${results.length === 1 ? "empresa" : "empresas"}${query || category !== "Todas" ? " en esta búsqueda" : " en el directorio"}` : "Cargando el directorio completo…"}</p>
    {error && <div role="alert" className="mt-5 rounded-lg border border-[#cbd2df] p-5"><p>No pudimos cargar todas las empresas. Las fichas visibles siguen disponibles.</p><button onClick={() => setAttempt(value => value + 1)} className={`${resourceLinkClass} mt-2`}>Reintentar búsqueda</button></div>}
    {results.length > 0 && <div className="mt-6 overflow-hidden rounded-xl border border-[#dce2ed]">
      <div aria-hidden="true" className="hidden grid-cols-[minmax(0,1fr)_180px_220px_90px] gap-5 border-b border-[#dce2ed] bg-[#f8f9fc] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#60687a] lg:grid"><span>Empresa / razón social</span><span>RUT</span><span>Rubro</span><span>Ficha</span></div>
      {results.slice(0, limit).map(row => <Link key={row.slug} to={`${suppliersPath}/${row.slug}`} className="group grid min-w-0 gap-x-5 gap-y-3 border-b border-[#e6e9f0] p-5 transition-colors last:border-b-0 hover:bg-[#f8f9ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:px-6 lg:grid-cols-[minmax(0,1fr)_180px_220px_90px] lg:items-center">
        <div className="min-w-0"><h2 className="text-lg font-semibold group-hover:text-[#424ec0]">{row.name}</h2><p className="mt-1 text-sm leading-6 text-[#60687a]">{row.legalName}</p></div>
        <p className="text-sm font-medium tabular-nums"><span className="text-[#60687a] lg:sr-only">RUT </span>{row.rut}</p>
        <p className="text-sm leading-6 text-[#60687a]">{row.category}</p>
        <span className="flex items-center gap-2 text-sm font-semibold text-[#424ec0]">Ver ficha <ArrowUpRight size={16} aria-hidden="true" /></span>
      </Link>)}
    </div>}
    {!results.length && loaded && <section className="my-12 max-w-xl"><h2 className="text-2xl font-semibold">No encontramos esa empresa.</h2><p className="mt-4 leading-7 text-[#505b70]">Prueba con la razón social de la factura o revisa el RUT. El directorio todavía no incluye a todos los proveedores de Chile.</p><button onClick={reset} className={`${resourceLinkClass} mt-4`}>Ver todas las empresas <ArrowRight size={17} aria-hidden="true" /></button></section>}
    {results.length > limit && <button onClick={() => setLimit(value => value + 20)} className={`${resourceLinkClass} mt-6`}>Ver 20 más <ArrowRight size={17} aria-hidden="true" /></button>}
    <aside className="mt-10 max-w-3xl border-l-2 border-[#cbd2df] pl-5"><h2 className="text-lg font-semibold">Una marca puede tener más de una razón social.</h2><p className="mt-3 leading-7 text-[#505b70]">Compara siempre el RUT del documento con la empresa a la que estás comprando. Estas fichas reúnen información pública; no certifican vigencia, solvencia ni una relación comercial con Ruka.</p><Link to="/ayuda/revisar-factura-compra" className={`${resourceLinkClass} mt-4`}>Cómo revisar una factura de compra <ArrowRight size={17} aria-hidden="true" /></Link></aside>
  </ResourceLayout>;
}

function cachedProfile(slug: string | undefined): SupplierProfile | undefined {
  if (typeof document === "undefined") return;
  try { const value = JSON.parse(document.getElementById("supplier-profile-data")?.textContent ?? "null"); return value?.slug === slug ? value : undefined; } catch { return; }
}

export function SupplierProfileView({ profile }: { profile: SupplierProfile }) {
  const [copyState, setCopyState] = useState("");
  const path = `${suppliersPath}/${profile.slug}`;
  const copyRut = async () => {
    try { await navigator.clipboard.writeText(profile.rut); setCopyState("RUT copiado"); } catch { setCopyState("No se pudo copiar. Puedes seleccionar el RUT de arriba."); }
  };
  return <ResourceLayout path={path} title={`${profile.name}: RUT, razón social y contacto oficial | Ruka`} description={profile.summary} eyebrow={profile.category} heading={profile.name} lead={profile.summary} compact showContact backLink={{ path: suppliersPath, label: "Volver al directorio" }} primaryEntity={{ "@type": "Organization", "@id": `https://www.ruka.ai${path}#supplier`, name: profile.name, legalName: profile.legalName, taxID: profile.rut, url: profile.website }}>
    <Helmet><script id="supplier-profile-data" type="application/json">{JSON.stringify(profile).replace(/</g, "\\u003c")}</script></Helmet>
    <div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr] lg:gap-8">
      <section className="rounded-xl border border-[#dce2ed] p-6 sm:p-8"><h2 className="text-xs font-semibold uppercase tracking-wider text-[#60687a]">Identifica a la empresa</h2><dl className="mt-6"><dt className="text-sm font-medium text-[#505b70]">Razón social</dt><dd className="mt-2 text-xl font-semibold leading-8">{profile.legalName}</dd><dt className="mt-6 text-sm font-medium text-[#505b70]">RUT</dt><dd className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2"><span className="select-all text-2xl font-semibold tabular-nums">{profile.rut}</span><button onClick={copyRut} className={`${resourceLinkClass} text-sm`}>{copyState === "RUT copiado" ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />} Copiar RUT</button></dd><dd role="status" className="mt-1 min-h-5 text-sm text-[#424ec0]">{copyState}</dd></dl><p className="mt-5 max-w-2xl text-sm leading-7 text-[#505b70]">{profile.identityNote}</p></section>
      <aside className="self-start rounded-xl bg-[#f4f5ff] p-6 sm:p-8"><h2 className="text-xl font-semibold">Contacta por el canal oficial</h2><p className="mt-5 leading-7 text-[#505b70]">{profile.channel.note}</p><a href={profile.channel.url} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-[#424ec0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4" target="_blank" rel="noopener noreferrer">{profile.channel.label} <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (abre otra pestaña)</span></a><p className="mt-5 text-sm leading-6 text-[#60687a]">Ruka no recibe pedidos ni solicitudes de crédito por cuenta de esta empresa.</p></aside>
    </div>
    <section className="mt-16 border-t border-[#dce2ed] pt-8"><h2 className="text-2xl font-semibold">Antes de registrar una compra</h2><p className="mt-3 max-w-2xl leading-7 text-[#505b70]">Recomendaciones de revisión de Ruka. No son requisitos comerciales impuestos por el proveedor.</p><div className="mt-7 grid gap-6 md:grid-cols-3">{profile.checks.map(check => <div key={check.title} className="border-t-2 border-[#dce2ed] pt-5"><h3 className="text-lg font-semibold">{check.title}</h3><p className="mt-2 leading-7 text-[#505b70]">{check.text}</p></div>)}</div></section>
    <section className="mt-12 border-t border-[#dce2ed] pt-7"><h2 className="text-xl font-semibold">De dónde viene esta información</h2><p className="mt-3 text-sm text-[#505b70]">Fuentes consultadas el <time dateTime={profile.reviewedAt}>{new Date(`${profile.reviewedAt}T12:00:00Z`).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time>.</p><ul className="mt-3 space-y-2">{profile.sources.map(source => <li key={source.url}><a href={source.url} className={resourceLinkClass} target="_blank" rel="noopener noreferrer">{source.label} <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (abre otra pestaña)</span></a></li>)}</ul><p className="mt-4 max-w-3xl text-sm leading-7 text-[#505b70]">La ficha no acredita vigencia tributaria, solvencia ni titularidad de una cuenta bancaria. Si ves un dato incorrecto, <a href={`mailto:privacidad@ruka.ai?subject=${encodeURIComponent(`Corrección de ficha: ${profile.name}`)}`} className="font-semibold text-[#424ec0] underline underline-offset-4">solicita una corrección</a> indicando la fuente pública. No envíes facturas, datos personales ni información bancaria.</p></section>
    <section className="mt-12 grid gap-6 rounded-xl bg-[#f4f5ff] p-6 sm:grid-cols-[1fr_auto] sm:items-center"><div><h2 className="text-xl font-semibold">Del proveedor al costo de tu compra.</h2><p className="mt-3 max-w-2xl leading-7 text-[#505b70]">Una factura también necesita productos y unidades bien identificados. Revisa cómo llevar esa información a tu operación.</p></div><Link to="/productos/registro-de-compras" className={resourceLinkClass}>Ver registro de compras <ArrowRight size={17} aria-hidden="true" /></Link></section>
  </ResourceLayout>;
}

export default function SupplierProfilePage({ profile: supplied }: { profile?: SupplierProfile }) {
  const { slug } = useParams();
  const [state, setState] = useState<{ slug?: string; profile?: SupplierProfile; error?: string }>(() => ({ slug, profile: supplied ?? cachedProfile(slug) }));
  const [attempt, setAttempt] = useState(0);
  const current = supplied ?? (state.slug === slug ? state.profile : undefined);
  useEffect(() => {
    if (supplied || current || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return;
    const controller = new AbortController();
    setState({ slug });
    fetch(`/supplier-data/${slug}.json`, { signal: controller.signal }).then(async response => {
      if (!response.ok) { if (!controller.signal.aborted) setState({ slug, error: response.status === 404 ? "not-found" : "network" }); return; }
      const profile = await response.json();
      if (profile.slug !== slug) throw new Error("Profile mismatch");
      if (!controller.signal.aborted) setState({ slug, profile });
    }).catch(() => { if (!controller.signal.aborted) setState({ slug, error: "network" }); });
    return () => controller.abort();
  }, [slug, supplied, current, attempt]);
  if (current) return <SupplierProfileView key={current.slug} profile={current} />;
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || (state.slug === slug && state.error === "not-found")) return <NotFound />;
  return <ResourceLayout path={`${suppliersPath}/${slug}`} title="Ficha de proveedor | Ruka" description="Consulta información pública del proveedor." eyebrow="Directorio" heading={state.error ? "No pudimos cargar la ficha." : "Cargando la ficha…"} showContact={false}><Helmet><meta name="robots" content="noindex, follow" /><meta name="googlebot" content="noindex, follow" /></Helmet>{state.error ? <button onClick={() => setAttempt(value => value + 1)} className={resourceLinkClass}>Reintentar</button> : <p role="status">Estamos recuperando los datos de esta empresa.</p>}</ResourceLayout>;
}
