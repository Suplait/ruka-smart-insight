import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { ResourceLayout, resourceLinkClass } from "@/components/resources/ResourceLayout";
import NotFound from "@/pages/NotFound";
import type { SupplierProfile } from "@/types/supplier";
import { SupplierProfileView } from "@/components/suppliers/SupplierProfileView";
import { suppliersPath } from "@/components/suppliers/SuppliersIndex";
export { SuppliersIndex } from "@/components/suppliers/SuppliersIndex";
export { SupplierProfileView };

function cachedProfile(slug: string | undefined): SupplierProfile | undefined {
  if (typeof document === "undefined") return;
  try { const value = JSON.parse(document.getElementById("supplier-profile-data")?.textContent ?? "null"); return value?.slug === slug ? value : undefined; } catch { return; }
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
