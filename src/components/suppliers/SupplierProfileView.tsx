import { useState } from "react";
import { Helmet } from "react-helmet";
import { ArrowDown, ArrowUpRight, Building2, Check, ChevronDown, Copy, MapPin } from "lucide-react";
import { resourceLinkClass } from "@/components/resources/ResourceLayout";
import { SupplierShell } from "./SupplierShell";
import { supplierDate, supplierFaqs, supplierPageTitle, supplierRegionLabel } from "@/utils/supplierPresentation";
import type { SupplierProfile } from "@/types/supplier";

const sectionClass = "scroll-mt-32 border-t border-[#dce2ed] py-9 sm:py-12";

export function SupplierProfileView({ profile }: { profile: SupplierProfile }) {
  const [copyState, setCopyState] = useState("");
  const registry = profile.registry;
  const annual = registry?.annual;
  const path = `/proveedores/${profile.slug}`;
  const faqs = supplierFaqs(profile);
  const copyRut = async () => {
    try { await navigator.clipboard.writeText(profile.rut); setCopyState("RUT copiado"); }
    catch { setCopyState("Selecciona el RUT para copiarlo."); }
  };
  return <SupplierShell path={path} title={supplierPageTitle(profile)} description={profile.summary} name={profile.name} faqs={faqs} entity={{
    "@type": "Organization", "@id": `https://www.ruka.ai${path}#supplier`,
    name: profile.name, legalName: profile.legalName, taxID: profile.rut,
    ...(profile.website ? { url: profile.website } : {}),
  }}>
    <Helmet><script id="supplier-profile-data" type="application/json">{JSON.stringify(profile).replace(/</g, "\\u003c")}</script></Helmet>
    <header className="grid gap-7 pb-8 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-end lg:gap-12 lg:pb-12">
      <div className="min-w-0">
        <p className="mb-4 flex items-center gap-2 text-sm font-medium text-[#505b70]"><Building2 size={17} aria-hidden="true" />{profile.category}</p>
        <h1 className="max-w-4xl text-balance break-words text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.035em]">{profile.name}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#505b70] sm:text-lg">{!profile.channel && registry ? <><span className="mb-1 block text-sm text-[#60687a]">{annual ? `Actividad principal en el registro SII ${annual.year}` : "Actividad registrada en la nómina SII de agosto de 2026"}</span>{annual?.mainActivity ?? registry.activities[0].description}</> : profile.summary}</p>
      </div>
      <div className="rounded-xl bg-[#171827] p-6 text-white">
        <p className="text-sm font-medium text-[#d7dbed]">RUT de la empresa</p>
        <p className="mt-2 select-all whitespace-nowrap text-[1.65rem] font-semibold tabular-nums tracking-tight">{profile.rut}</p>
        <button onClick={copyRut} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md border border-[#63697e] px-3 text-sm font-medium transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">{copyState === "RUT copiado" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />} Copiar RUT</button>
        <p role="status" className="mt-2 min-h-5 text-xs text-[#d7dbed]">{copyState || "Compáralo con el de tu factura."}</p>
      </div>
    </header>
    <nav aria-label="En esta ficha" className="mb-8 flex flex-wrap gap-x-5 border-y border-[#dce2ed] py-1 text-sm sm:gap-x-8">
      {[["identidad", "Datos de la empresa"], ...(registry ? [["actividades", "Actividades"]] : []), ...(annual ? [["ubicacion", "Ubicación y registro"]] : []), ["preguntas", "Preguntas frecuentes"]].map(([id, label]) => <a key={id} href={`#${id}`} className="inline-flex min-h-12 items-center gap-2 rounded-sm font-medium text-[#505b70] hover:text-primary focus-visible:outline-primary">{label}<ArrowDown size={13} aria-hidden="true" /></a>)}
    </nav>
    <div className="grid gap-x-14 lg:grid-cols-[minmax(0,1fr)_290px]">
      <div className="min-w-0">
        <section id="identidad" className="scroll-mt-32 pb-9 pt-3 sm:pb-12">
          <h2 className="text-2xl font-semibold tracking-tight">Datos de la empresa</h2>
          <dl className="mt-6 divide-y divide-[#e6e9f0] text-sm">
            <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr]"><dt className="text-[#60687a]">Razón social</dt><dd className="font-medium leading-6">{profile.legalName}</dd></div>
            <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr]"><dt className="text-[#60687a]">RUT</dt><dd className="font-medium tabular-nums">{profile.rut}</dd></div>
            {registry && <><div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr]"><dt className="text-[#60687a]">Tipo de organización</dt><dd className="font-medium leading-6">{registry.legalSubtype}</dd></div>{registry.startedAt && <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr]"><dt className="text-[#60687a]">Inicio de vigencia en nómina</dt><dd className="font-medium"><time dateTime={registry.startedAt}>{supplierDate(registry.startedAt)}</time><span className="mt-2 block font-normal leading-6 text-[#60687a]">Fecha del registro de razón social; no acredita la fundación ni el inicio de actividades.</span></dd></div>}</>}
            {profile.aliases.length > 0 && <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr]"><dt className="text-[#60687a]">Otros nombres de búsqueda</dt><dd className="leading-6">{profile.aliases.join(" · ")}</dd></div>}
          </dl>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#60687a]">{profile.identityNote}</p>
        </section>
        {registry && <section id="actividades" className={sectionClass}>
          <div className="flex items-baseline justify-between gap-4"><h2 className="text-2xl font-semibold tracking-tight">Actividades registradas</h2><span className="text-sm tabular-nums text-[#60687a]">{registry.activities.length}</span></div>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#60687a]">Actividades declaradas ante el SII, según la nómina de agosto de 2026. No equivalen a un catálogo de productos.</p>
          <ul className="mt-6 divide-y divide-[#e6e9f0]">{registry.activities.slice(0, 5).map(activity => <li key={activity.code} className="grid gap-2 py-4 sm:grid-cols-[80px_1fr]"><span className="text-sm tabular-nums text-[#60687a]">{activity.code}</span><p className="text-base leading-7">{activity.description}</p></li>)}</ul>
          {registry.activities.length > 5 && <details className="group mt-3"><summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 rounded-md font-semibold text-[#424ec0] focus-visible:outline-primary">Ver las {registry.activities.length} actividades <ChevronDown size={16} className="transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" /></summary><ul className="divide-y divide-[#e6e9f0]">{registry.activities.slice(5).map(activity => <li key={activity.code} className="grid gap-2 py-4 sm:grid-cols-[80px_1fr]"><span className="text-sm tabular-nums text-[#60687a]">{activity.code}</span><p className="leading-7">{activity.description}</p></li>)}</ul></details>}
        </section>}
        {annual && <section id="ubicacion" className={sectionClass}>
          <h2 className="text-2xl font-semibold tracking-tight">Ubicación y registro empresarial</h2>
          <div className="mt-6 flex gap-4"><MapPin size={23} className="mt-1 shrink-0 text-[#424ec0]" aria-hidden="true" /><div><p className="text-xl font-medium">{annual.commune}</p><p className="mt-2 leading-7 text-[#505b70]">{annual.province} · {supplierRegionLabel(annual.region)}</p></div></div>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#60687a]">Domicilio tributario informado para el año comercial {annual.year}. No describe cobertura de despacho, tiendas abiertas al público ni una dirección verificada hoy.</p>
          <dl className="mt-6 divide-y divide-[#e6e9f0] text-sm"><div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr]"><dt className="text-[#60687a]">Actividad principal en {annual.year}</dt><dd className="leading-6">{annual.mainActivity}</dd></div><div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr]"><dt className="text-[#60687a]">Subrubro</dt><dd className="leading-6">{annual.subsector}</dd></div>{annual.employees !== null && <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr]"><dt className="text-[#60687a]">Trabajadores informados en {annual.year}</dt><dd className="leading-6"><span className="font-medium tabular-nums">{annual.employees.toLocaleString("es-CL")}</span><span className="mt-1 block text-[#60687a]">Dato anual del SII; no representa la dotación actual.</span></dd></div>}</dl>
        </section>}
        <section id="preguntas" className={sectionClass}>
          <h2 className="text-2xl font-semibold tracking-tight">Preguntas sobre {profile.name}</h2>
          <div className="mt-6 divide-y divide-[#dce2ed]">{faqs.map(faq => <details key={faq.question} className="group py-1"><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 rounded-sm py-4 font-medium leading-6 focus-visible:outline-primary">{faq.question}<ChevronDown size={19} className="shrink-0 text-[#60687a] transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" /></summary><p className="max-w-2xl pb-5 leading-7 text-[#505b70]">{faq.answer}</p></details>)}</div>
        </section>
        <section className={sectionClass}><h2 className="text-2xl font-semibold tracking-tight">Antes de registrar una compra</h2><p className="mt-3 text-sm leading-7 text-[#60687a]">Consejos de Ruka, no condiciones comerciales del proveedor.</p><div className="mt-6 space-y-6">{profile.checks.map(check => <div key={check.title}><h3 className="font-semibold">{check.title}</h3><p className="mt-2 max-w-2xl leading-7 text-[#505b70]">{check.text}</p></div>)}</div></section>
      </div>
      <aside className="self-start space-y-8 border-t border-[#dce2ed] pt-8 lg:sticky lg:top-28 lg:border-0 lg:pt-3">
        {profile.channel && <section className="rounded-xl bg-[#eff1ff] p-6"><h2 className="text-lg font-semibold">Habla con el proveedor</h2><p className="mt-3 text-sm leading-7 text-[#505b70]">{profile.channel.note}</p><a href={profile.channel.url} target="_blank" rel="noopener noreferrer" className={`${resourceLinkClass} mt-4 text-sm`}>{profile.channel.label}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (abre otra pestaña)</span></a><p className="mt-4 text-xs leading-6 text-[#60687a]">Este enlace es del proveedor. Ruka no recibe pedidos por su cuenta.</p></section>}
        <section><h2 className="text-lg font-semibold">Fuentes de esta ficha</h2><p className="mt-3 text-sm leading-7 text-[#60687a]">Consultadas el <time dateTime={profile.reviewedAt}>{supplierDate(profile.reviewedAt)}</time>.</p><ul className="mt-3 space-y-2">{profile.sources.map(source => <li key={`${source.url}-${source.supports}`}><a href={source.url} target="_blank" rel="noopener noreferrer" className={`${resourceLinkClass} text-sm leading-6`}>{source.label}<ArrowUpRight size={14} className="shrink-0" aria-hidden="true" /><span className="sr-only"> (abre otra pestaña)</span></a></li>)}</ul><p className="mt-4 text-xs leading-6 text-[#60687a]">Información de consulta. No acredita vigencia tributaria, solvencia, cuentas bancarias ni una relación comercial con Ruka.</p></section>
        <section className="border-t border-[#dce2ed] pt-6"><h2 className="font-semibold">¿Hay un dato incorrecto?</h2><p className="mt-2 text-sm leading-6 text-[#60687a]">Indícanos la corrección y su fuente pública. No envíes facturas ni datos bancarios.</p><a href={`mailto:privacidad@ruka.ai?subject=${encodeURIComponent(`Corrección de ficha: ${profile.name}`)}`} className={`${resourceLinkClass} mt-2 text-sm`}>Solicitar una corrección<ArrowUpRight size={14} aria-hidden="true" /></a></section>
      </aside>
    </div>
  </SupplierShell>;
}
