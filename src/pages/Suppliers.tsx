import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { SupplierShell } from "@/components/suppliers/SupplierShell";
import { supplierButton } from "@/components/suppliers/SupplierActions";
import NotFound from "@/pages/NotFound";
import type { SupplierProfile } from "@/types/supplier";
import { SupplierProfileView } from "@/components/suppliers/SupplierProfileView";
import { suppliersPath } from "@/components/suppliers/SuppliersIndex";
export { SuppliersIndex } from "@/components/suppliers/SuppliersIndex";
export { SupplierProfileView };

function cachedProfile(slug: string | undefined): SupplierProfile | undefined {
  if (typeof document === "undefined") return;
  try {
    const value = JSON.parse(
      document.getElementById("supplier-profile-data")?.textContent ?? "null",
    );
    return value?.slug === slug ? value : undefined;
  } catch {
    return;
  }
}

export default function SupplierProfilePage({
  profile: supplied,
}: {
  profile?: SupplierProfile;
}) {
  const { slug } = useParams();
  const [state, setState] = useState<{
    slug?: string;
    profile?: SupplierProfile;
    error?: string;
  }>(() => ({ slug, profile: supplied ?? cachedProfile(slug) }));
  const [attempt, setAttempt] = useState(0);
  const current = supplied ?? (state.slug === slug ? state.profile : undefined);
  useEffect(() => {
    if (
      supplied ||
      current ||
      !slug ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    )
      return;
    const controller = new AbortController();
    setState({ slug });
    fetch(`/supplier-data/${slug}.json`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          if (!controller.signal.aborted)
            setState({
              slug,
              error: response.status === 404 ? "not-found" : "network",
            });
          return;
        }
        const profile = await response.json();
        if (profile.slug !== slug) throw new Error("Profile mismatch");
        if (!controller.signal.aborted) setState({ slug, profile });
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ slug, error: "network" });
      });
    return () => controller.abort();
  }, [slug, supplied, current, attempt]);
  if (current)
    return <SupplierProfileView key={current.slug} profile={current} />;
  if (
    !slug ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    (state.slug === slug && state.error === "not-found")
  )
    return <NotFound />;
  return (
    <SupplierShell
      path={`${suppliersPath}/${slug}`}
      title="Ficha de proveedor | Ruka"
      description="Consulta información pública del proveedor."
      name="Ficha de proveedor"
    >
      <Helmet>
        <meta name="robots" content="noindex, follow" />
        <meta name="googlebot" content="noindex, follow" />
      </Helmet>
      <section aria-busy={!state.error} className="max-w-4xl py-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          {state.error ? "No pudimos cargar la ficha." : "Cargando la ficha…"}
        </h1>
        {state.error ? (
          <>
            <p role="alert" className="mt-4 max-w-xl leading-7 text-[#505b70]">
              No podemos mostrar sus antecedentes en este momento. Puedes
              reintentar; no hemos reemplazado la información por datos de otra
              empresa.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setAttempt((value) => value + 1)}
                className={supplierButton}
              >
                Reintentar
              </button>
              <Link to="/proveedores" className={supplierButton}>
                Buscar otra empresa
              </Link>
            </div>
          </>
        ) : (
          <>
            <p role="status" className="mt-4 leading-7 text-[#505b70]">
              Estamos recuperando los datos de esta empresa.
            </p>
            <div
              aria-hidden="true"
              className="mt-8 space-y-5 rounded-xl bg-[#f4f5fa] p-7"
            >
              <div className="h-5 w-2/3 rounded bg-[#e2e6ef]" />
              <div className="h-4 w-1/3 rounded bg-[#e2e6ef]" />
              <div className="h-24 rounded border-t border-[#dce2ed]" />
            </div>
          </>
        )}
      </section>
    </SupplierShell>
  );
}
