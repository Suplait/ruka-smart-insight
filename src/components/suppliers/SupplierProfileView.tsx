import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { SupplierShell } from "./SupplierShell";
import { SupplierPurchaseReview } from "./SupplierPurchaseReview";
import {
  SupplierCopy,
  SupplierDownload,
  supplierButton,
} from "./SupplierActions";
import { SupplierRutCheck } from "./SupplierRutCheck";
import {
  SupplierActivities,
  SupplierQuestions,
  SupplierSources,
  SupplierSectionNav,
  supplierHeading,
  supplierLink,
  supplierSection,
} from "./SupplierDetails";
import {
  supplierDate,
  supplierFaqs,
  supplierPageTitle,
  supplierRegionLabel,
  supplierSourceMonth,
  supplierIdentityText,
} from "@/utils/supplierPresentation";
import {
  sourceCaption,
  supplierInquiry,
  supplierRecordRows,
  supplierUrl,
} from "@/utils/supplierWorkspace";
import type { SupplierProfile } from "@/types/supplier";

const rowClass =
  "grid gap-2 border-b border-[#e4e8f0] py-4 last:border-b-0 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6";

export function SupplierProfileView({ profile }: { profile: SupplierProfile }) {
  const registry = profile.registry;
  const annual = registry?.annual;
  const path = `/proveedores/${profile.slug}`;
  const channel = profile.channel?.url ?? profile.website;
  const categoryUrl = `/proveedores?rubro=${encodeURIComponent(profile.category)}`;
  const regionUrl = annual
    ? `/proveedores?region=${encodeURIComponent(annual.region)}`
    : "";
  return (
    <SupplierShell
      path={path}
      title={supplierPageTitle(profile)}
      description={profile.summary}
      name={profile.name}
      faqs={supplierFaqs(profile)}
      entity={{
        "@type": "Organization",
        "@id": `${supplierUrl(profile)}#supplier`,
        name: profile.name,
        legalName: profile.legalName,
        taxID: profile.rut,
        ...(profile.website ? { url: profile.website } : {}),
      }}
    >
      <Helmet>
        <script id="supplier-profile-data" type="application/json">
          {JSON.stringify(profile).replace(/</g, "\\u003c")}
        </script>
      </Helmet>
      <header className="pb-8 pt-2 sm:pb-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <Link to={categoryUrl} className={supplierLink}>
            {profile.category}
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
          <span className="hidden text-[#60687a] sm:inline">
            Directorio de empresas · Chile
          </span>
        </div>
        <div className="mt-4 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
          <div className="min-w-0">
            <h1
              className={`break-words font-semibold leading-[1.1] tracking-[-0.045em] ${profile.name.length > 45 ? "text-[2rem] sm:text-[2.75rem]" : "text-4xl sm:text-5xl lg:text-[3.5rem]"}`}
            >
              {profile.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#505b70]">
              {profile.channel
                ? profile.summary
                : "Razón social, RUT y antecedentes públicos para identificar a esta empresa antes de registrar una compra."}
            </p>
          </div>
          <div className="border-l-[3px] border-[#4f5ee9] pl-5">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#60687a]">
              RUT de la empresa
            </p>
            <p className="mt-2 select-all whitespace-nowrap text-[1.75rem] font-semibold tabular-nums tracking-tight">
              {profile.rut}
            </p>
            <SupplierCopy
              text={profile.rut}
              label="Copiar RUT"
              success="RUT copiado"
              className="mt-3 w-fit"
            />
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#e4e8f0] pt-4 text-sm text-[#505b70]">
          {annual ? (
            <a
              href="#ubicacion"
              className="inline-flex min-h-11 items-center gap-2 rounded underline-offset-4 hover:underline focus-visible:outline-primary"
            >
              <MapPin size={16} className="shrink-0" aria-hidden="true" />
              <span>
                {annual.commune}{" "}
                <span className="text-[#60687a]">· registro {annual.year}</span>
              </span>
            </a>
          ) : (
            <span>Sin antecedente publicado en esta ficha</span>
          )}
          <a
            href="#fuentes"
            className="inline-flex min-h-11 items-center gap-2 rounded underline-offset-4 hover:underline focus-visible:outline-primary"
          >
            <span>
              {profile.sources.length} fuentes · consultadas el{" "}
              <time dateTime={profile.reviewedAt}>
                {supplierDate(profile.reviewedAt)}
              </time>
            </span>
          </a>
          <a
            href="#contacto-proveedor"
            className={`${supplierLink} lg:ml-auto`}
          >
            {channel ? "Ver contacto oficial" : "Antes de contactar"}
            <ArrowDown size={14} aria-hidden="true" />
          </a>
        </div>
      </header>
      <div className="grid items-start gap-8 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-12">
        <aside className="lg:sticky lg:top-28">
          <SupplierSectionNav profile={profile} />
          <p className="mt-4 hidden px-3 text-xs leading-6 text-[#60687a] lg:block">
            Consulta antecedentes.
            <br />
            Contrasta tu documento.
            <br />
            Llévate los datos.
          </p>
        </aside>
        <div className="min-w-0">
          <section
            id="identidad"
            data-supplier-section
            className="scroll-mt-32 pb-10 sm:pb-12"
          >
            <div className="rounded-xl bg-[#f4f5fa] p-5 sm:p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className={supplierHeading}>
                  Identificación para tu compra
                </h2>
                <span className="text-xs text-[#60687a]">
                  {registry
                    ? `Nómina SII · ${supplierSourceMonth(registry.sourceDate)}`
                    : "Según las fuentes de la ficha"}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#505b70]">
                Compara estos dos datos con el documento. Un nombre parecido no
                significa que sea la misma empresa.
              </p>
              <dl className="mt-5 text-sm">
                <div className={rowClass}>
                  <dt className="text-[#60687a]">Razón social</dt>
                  <dd className="select-all break-words font-semibold leading-7">
                    {profile.legalName}
                  </dd>
                </div>
                <div className={rowClass}>
                  <dt className="text-[#60687a]">RUT</dt>
                  <dd className="select-all text-lg font-semibold tabular-nums">
                    {profile.rut}
                  </dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap items-start gap-2">
                <SupplierCopy
                  text={supplierIdentityText(profile)}
                  label="Copiar identificación"
                  success="Razón social y RUT copiados."
                />
                <SupplierCopy
                  text={supplierUrl(profile)}
                  label="Copiar enlace de la ficha"
                  success="Enlace copiado"
                />
                <SupplierDownload
                  rows={supplierRecordRows(profile)}
                  filename={`ruka-${profile.rut}-ficha.csv`}
                />
              </div>
              <p className="mt-3 text-xs leading-6 text-[#60687a]">
                El CSV incluye los antecedentes publicados, sus períodos y
                enlaces a las fuentes.
              </p>
            </div>
            <SupplierRutCheck profile={profile} />
            <details className="group mt-6 border-t border-[#e4e8f0] pt-2">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 rounded font-medium focus-visible:outline-primary">
                Más sobre esta razón social
                <ArrowDown
                  size={16}
                  className="shrink-0 transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </summary>
              <dl className="text-sm">
                {registry && (
                  <>
                    <div className={rowClass}>
                      <dt className="text-[#60687a]">Tipo de organización</dt>
                      <dd className="leading-6">{registry.legalSubtype}</dd>
                    </div>
                    {registry.startedAt && (
                      <div className={rowClass}>
                        <dt className="text-[#60687a]">
                          Inicio de vigencia en nómina
                        </dt>
                        <dd>
                          <time dateTime={registry.startedAt}>
                            {supplierDate(registry.startedAt)}
                          </time>
                          <p className="mt-2 leading-6 text-[#60687a]">
                            Fecha del registro de razón social. No acredita la
                            fundación ni el inicio de actividades.
                          </p>
                        </dd>
                      </div>
                    )}
                  </>
                )}
                {!!profile.aliases.length && (
                  <div className={rowClass}>
                    <dt className="text-[#60687a]">
                      Otros nombres de búsqueda
                    </dt>
                    <dd className="leading-7">{profile.aliases.join(" · ")}</dd>
                  </div>
                )}
              </dl>
              <p className="py-4 text-sm leading-7 text-[#505b70]">
                {profile.identityNote}
              </p>
            </details>
          </section>
          <section
            id="contacto-proveedor"
            data-supplier-section
            className={supplierSection}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#424ec0]">
              Contacto del proveedor
            </p>
            <h2 className={supplierHeading}>
              {channel
                ? "Continúa en su canal oficial"
                : "¿Buscas cotizar o comprar?"}
            </h2>
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm leading-7 text-[#505b70]">
                  {profile.channel?.note ??
                    (profile.website
                      ? "Consulta el sitio oficial para conocer sus canales de atención y confirmar las condiciones de tu compra."
                      : "Esta ficha no tiene un canal comercial verificado. Confirma el contacto directamente con la empresa antes de enviar un pedido o pagar.")}
                </p>
                {channel && (
                  <>
                    <a
                      href={channel}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${supplierButton} mt-4`}
                    >
                      {profile.channel?.label ?? "Visitar sitio oficial"}
                      <ArrowUpRight
                        size={16}
                        className="shrink-0"
                        aria-hidden="true"
                      />
                      <span className="sr-only"> (abre otra pestaña)</span>
                    </a>
                    <p className="mt-2 break-words text-xs leading-6 text-[#60687a]">
                      {sourceCaption(channel).host} · abre otra pestaña
                    </p>
                  </>
                )}
                <p className="mt-4 text-xs leading-6 text-[#60687a]">
                  Ruka es el directorio, no este proveedor. No recibimos pedidos
                  ni pagos en su nombre.
                </p>
              </div>
              <div className="border-l-2 border-[#d8ddf6] pl-5">
                <h3 className="font-semibold">
                  Llega con las preguntas claras
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#505b70]">
                  Pide catálogo y precios, unidad de venta, pedido mínimo,
                  despacho y cómo resuelven diferencias en la entrega.
                </p>
                <SupplierCopy
                  text={supplierInquiry(profile)}
                  label="Copiar consulta para el proveedor"
                  success="Consulta copiada"
                  className="mt-4"
                />
                <p className="mt-2 text-xs leading-6 text-[#60687a]">
                  Borrador para que tú lo envíes. No enviamos mensajes.
                </p>
              </div>
            </div>
          </section>
          <SupplierPurchaseReview profile={profile} />
          <SupplierActivities profile={profile} />
          {annual && (
            <section
              id="ubicacion"
              data-supplier-section
              className={supplierSection}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className={supplierHeading}>
                  Ubicación y registro empresarial
                </h2>
                <span className="rounded-md bg-[#f1f3f9] px-3 py-1 text-xs font-medium text-[#505b70]">
                  Antecedente histórico · {annual.year}
                </span>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-[#60687a]">
                    Domicilio tributario informado
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {annual.commune}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#505b70]">
                    {annual.province} · {supplierRegionLabel(annual.region)}
                  </p>
                </div>
                <p className="self-center text-sm leading-7 text-[#505b70]">
                  Corresponde al año comercial {annual.year}. No indica dónde
                  despacha, si atiende público ni dónde está hoy.
                </p>
              </div>
              <dl className="mt-5 text-sm">
                {[
                  [
                    `Actividad principal en ${annual.year}`,
                    annual.mainActivity,
                  ],
                  ["Rubro", annual.sector],
                  ["Subrubro", annual.subsector],
                ].map(([label, value]) => (
                  <div key={label} className={rowClass}>
                    <dt className="text-[#60687a]">{label}</dt>
                    <dd className="leading-7">{value}</dd>
                  </div>
                ))}
                {annual.employees !== null && (
                  <div className={rowClass}>
                    <dt className="text-[#60687a]">
                      Trabajadores informados en {annual.year}
                    </dt>
                    <dd>
                      <span className="text-xl font-semibold tabular-nums">
                        {annual.employees.toLocaleString("es-CL")}
                      </span>
                      <p className="mt-1 leading-6 text-[#60687a]">
                        Dato anual del SII; no representa la dotación actual.
                      </p>
                    </dd>
                  </div>
                )}
              </dl>
            </section>
          )}
          <SupplierQuestions profile={profile} />
          <SupplierSources profile={profile} />
          <nav
            aria-label="Explorar empresas relacionadas"
            className="border-t border-[#dce2ed] py-8"
          >
            <h2 className="text-lg font-semibold">
              Sigue explorando el directorio
            </h2>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              <Link to={categoryUrl} className={supplierLink}>
                Ver empresas de {profile.category.toLocaleLowerCase("es-CL")}
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
              {annual && (
                <Link to={regionUrl} className={supplierLink}>
                  Ver empresas en {supplierRegionLabel(annual.region)}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              )}
            </div>
            <p className="mt-2 text-xs leading-6 text-[#60687a]">
              Agrupadas por antecedentes publicados, no por recomendación
              comercial.
            </p>
          </nav>
        </div>
      </div>
    </SupplierShell>
  );
}
