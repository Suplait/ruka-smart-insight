import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowDown, ArrowUpRight, Building2, Check, ChevronDown, Copy, MapPin } from "lucide-react";
import { resourceLinkClass } from "@/components/resources/ResourceLayout";
import { SupplierShell } from "./SupplierShell";
import { SupplierPurchaseReview } from "./SupplierPurchaseReview";
import { supplierDate, supplierFaqs, supplierPageTitle, supplierRegionLabel, supplierSourceMonth, supplierIdentityText } from "@/utils/supplierPresentation";
import type { SupplierProfile } from "@/types/supplier";

const sectionClass = "scroll-mt-32 border-t border-[#dce2ed] py-10 sm:py-14";

export function SupplierProfileView({ profile }: { profile: SupplierProfile }) {
  const [copyState, setCopyState] = useState("");
  const registry = profile.registry;
  const annual = registry?.annual;
  const path = `/proveedores/${profile.slug}`;
  const faqs = supplierFaqs(profile);
  const sourceMonth = registry ? supplierSourceMonth(registry.sourceDate) : "";
  const copyRut = async (identity = false) => {
    try { await navigator.clipboard.writeText(identity ? supplierIdentityText(profile) : profile.rut); setCopyState(identity ? "Razón social y RUT copiados." : "RUT copiado"); }
    catch { setCopyState("No pudimos copiar. Selecciona los datos en Identificación para copiarlos manualmente."); }
  };
  return <SupplierShell path={path} title={supplierPageTitle(profile)} description={profile.summary} name={profile.name} faqs={faqs} entity={{
    "@type": "Organization", "@id": `https://www.ruka.ai${path}#supplier`,
    name: profile.name, legalName: profile.legalName, taxID: profile.rut,
    ...(profile.website ? { url: profile.website } : {}),
  }}>
    <Helmet><script id="supplier-profile-data" type="application/json">{JSON.stringify(profile).replace(/</g, "\\u003c")}</script></Helmet>
    <header className="pb-8 pt-2 sm:pb-10">
      <p className="mb-5 flex items-center gap-2 text-sm font-medium text-[#505b70]"><Building2 size={17} aria-hidden="true" />{profile.category}</p>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
        <div className="min-w-0">
          <h1 className={`max-w-3xl text-balance break-words font-semibold leading-[1.12] tracking-[-0.04em] ${profile.name.length > 30 ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl lg:text-[3.5rem]"}`}>{profile.name}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#505b70] sm:text-lg">{!profile.channel && registry ? <>{annual?.mainActivity ?? registry.activities[0]?.description}<span className="mt-2 block text-sm text-[#60687a]">{annual ? `Actividad principal informada para ${annual.year}.` : `Actividad registrada en la nómina SII de ${sourceMonth}.`}</span></> : profile.summary}</p>
          <a href="#fuentes" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded text-sm text-[#505b70] underline decoration-[#b9c0d2] underline-offset-4 hover:text-[#424ec0] focus-visible:outline-primary">Fuentes consultadas el {supplierDate(profile.reviewedAt)}<ArrowDown size={14} aria-hidden="true" /></a>
        </div>
        <div className="rounded-xl bg-[#171827] p-6 text-white sm:p-7">
          <p className="text-sm font-medium text-[#d7dbed]">RUT de la empresa</p><p className="mt-2 select-all whitespace-nowrap text-3xl font-semibold tabular-nums tracking-tight">{profile.rut}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={() => copyRut()} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-3 text-sm font-semibold text-[#171827] transition-colors hover:bg-[#e8eafb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none">{copyState === "RUT copiado" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}Copiar RUT</button>
            <button type="button" onClick={() => copyRut(true)} className="min-h-11 rounded-md border border-[#8a91a7] px-3 text-sm font-medium hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Copiar identificación</button>
          </div><p role="status" className="mt-4 min-h-10 text-xs leading-5 text-[#d7dbed]">{copyState || "La identificación incluye razón social y RUT. Compárala con tu factura."}</p>
        </div>
      </div>
      <div className="mt-8 grid divide-y divide-[#dce2ed] rounded-xl bg-[#f6f7fb] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-0">
        <div className="py-5 sm:px-6"><p className="text-xs text-[#60687a]">Tipo de organización</p><p className="mt-2 text-sm font-medium">{registry?.legalSubtype ?? "Ver razón social"}</p></div>
        <div className="py-5 sm:px-6"><p className="text-xs text-[#60687a]">{annual ? `Domicilio tributario · ${annual.year}` : "Ubicación"}</p><p className="mt-2 text-sm font-medium">{annual ? `${annual.commune} · ${supplierRegionLabel(annual.region)}` : "Sin antecedente publicado en esta ficha"}</p></div>
        <div className="py-5 sm:px-6"><p className="text-xs text-[#60687a]">Canal comercial</p><a href="#contacto-proveedor" className="mt-1 inline-flex min-h-8 items-center gap-2 rounded text-sm font-medium text-[#424ec0] underline-offset-4 hover:underline focus-visible:outline-primary">{profile.channel ? "Ver contacto oficial" : profile.website ? "Ver sitio oficial" : "Qué falta confirmar"}<ArrowDown size={14} aria-hidden="true" /></a></div>
      </div>
    </header>
    <nav aria-label="En esta ficha" className="mb-8 flex gap-6 overflow-x-auto border-y border-[#dce2ed] text-sm sm:gap-8">
      {[["identidad", "Identificación"], ["compra", "Revisar una compra"], ...(registry ? [["actividades", "Actividades"]] : []), ...(annual ? [["ubicacion", "Ubicación"]] : []), ["preguntas", "Preguntas"], ["fuentes", "Fuentes"]].map(([id, label]) => <a key={id} href={`#${id}`} className="inline-flex min-h-14 shrink-0 items-center rounded-sm font-medium text-[#505b70] underline-offset-4 hover:text-[#424ec0] hover:underline focus-visible:outline-primary">{label}</a>)}
    </nav>
    <div className="grid gap-x-16 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0">
        <section id="identidad" className="scroll-mt-32 pb-9 pt-3 sm:pb-12">
          <h2 className="text-2xl font-semibold tracking-tight">La empresa detrás del nombre</h2><p className="mt-3 max-w-2xl leading-7 text-[#505b70]">Para una factura, usa la razón social y el RUT. La marca o un nombre parecido no bastan para identificar al emisor.</p>
          <dl className="mt-6 divide-y divide-[#e6e9f0] text-sm">
            <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr]"><dt className="text-[#60687a]">Razón social</dt><dd className="select-all break-words font-medium leading-6">{profile.legalName}</dd></div>
            <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr]"><dt className="text-[#60687a]">RUT</dt><dd className="select-all font-medium tabular-nums">{profile.rut}</dd></div>
            {registry && <><div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr]"><dt className="text-[#60687a]">Tipo de organización</dt><dd className="font-medium leading-6">{registry.legalSubtype}</dd></div>{registry.startedAt && <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr]"><dt className="text-[#60687a]">Inicio de vigencia en nómina</dt><dd className="font-medium"><time dateTime={registry.startedAt}>{supplierDate(registry.startedAt)}</time><span className="mt-2 block font-normal leading-6 text-[#60687a]">Fecha del registro de razón social; no acredita la fundación ni el inicio de actividades.</span></dd></div>}</>}
            {profile.aliases.length > 0 && <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr]"><dt className="text-[#60687a]">Otros nombres de búsqueda</dt><dd className="leading-6">{profile.aliases.join(" · ")}</dd></div>}
          </dl>
          <p className="mt-5 rounded-lg bg-[#f6f7fb] p-5 text-sm leading-7 text-[#505b70]">{profile.identityNote}</p>
        </section>
        <SupplierPurchaseReview profile={profile} />
        {registry && <section id="actividades" className={sectionClass}>
          <div className="flex items-baseline justify-between gap-4"><h2 className="text-2xl font-semibold tracking-tight">Actividades registradas</h2><span className="text-sm tabular-nums text-[#60687a]">{registry.activities.length}</span></div>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#60687a]">Actividades declaradas ante el SII, según la nómina de {sourceMonth}. No equivalen a un catálogo de productos.</p>
          <ul className="mt-6 divide-y divide-[#e6e9f0]">{registry.activities.slice(0, 3).map(activity => <li key={activity.code} className="grid gap-2 py-4 sm:grid-cols-[80px_1fr]"><span className="text-sm tabular-nums text-[#60687a]">{activity.code}</span><div><p className="text-base leading-7">{activity.description}</p>{activity.registeredAt && <p className="mt-1 text-xs leading-6 text-[#60687a]">Fecha informada en la nómina: <time dateTime={activity.registeredAt}>{supplierDate(activity.registeredAt)}</time></p>}</div></li>)}</ul>
          {registry.activities.length > 3 && <details className="group mt-3"><summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 rounded-md font-semibold text-[#424ec0] focus-visible:outline-primary">Ver las {registry.activities.length} actividades <ChevronDown size={16} className="transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" /></summary><ul className="divide-y divide-[#e6e9f0]">{registry.activities.slice(3).map(activity => <li key={activity.code} className="grid gap-2 py-4 sm:grid-cols-[80px_1fr]"><span className="text-sm tabular-nums text-[#60687a]">{activity.code}</span><div><p className="leading-7">{activity.description}</p>{activity.registeredAt && <p className="mt-1 text-xs leading-6 text-[#60687a]">Fecha informada en la nómina: <time dateTime={activity.registeredAt}>{supplierDate(activity.registeredAt)}</time></p>}</div></li>)}</ul></details>}
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
      </div>
      <aside className="order-first self-start pb-10 lg:order-none lg:sticky lg:top-28 lg:pb-0">
        <section id="contacto-proveedor" className="scroll-mt-32 rounded-xl bg-[#eff1ff] p-6">
          <p className="text-sm font-medium text-[#424ec0]">Contacto del proveedor</p><h2 className="mt-3 text-xl font-semibold">{profile.channel || profile.website ? "Continúa en su canal oficial" : "¿Buscas cotizar o comprar?"}</h2>
          <p className="mt-3 text-sm leading-7 text-[#505b70]">{profile.channel?.note ?? (profile.website ? "Consulta el sitio oficial para conocer sus canales de atención y confirmar las condiciones de tu compra." : "Esta ficha no tiene un canal comercial verificado. Confirma el contacto directamente con la empresa antes de enviar un pedido o pagar.")}</p>
          {(profile.channel || profile.website) && <a href={profile.channel?.url ?? profile.website!} target="_blank" rel="noopener noreferrer" className={`${resourceLinkClass} mt-4 text-sm`}>{profile.channel?.label ?? "Visitar sitio oficial"}<ArrowUpRight size={16} className="shrink-0" aria-hidden="true" /><span className="sr-only"> (abre otra pestaña)</span></a>}
          <p className="mt-4 border-t border-[#d1d6f2] pt-4 text-xs leading-6 text-[#505b70]">Ruka es el directorio, no este proveedor. No recibimos pedidos ni pagos en su nombre.</p>
        </section>
        <div className="mt-6 hidden lg:block"><h2 className="text-sm font-semibold">¿Qué puedes comprobar aquí?</h2><ul className="mt-3 space-y-3 text-sm leading-6 text-[#505b70]"><li>La razón social asociada al RUT.</li><li>Las actividades y fechas disponibles en las fuentes.</li><li>El origen de cada antecedente.</li></ul><a href="#fuentes" className={`${resourceLinkClass} mt-4 text-sm`}>Ver fuentes y alcance<ArrowDown size={14} aria-hidden="true" /></a><div className="mt-7 border-t border-[#dce2ed] pt-6"><p className="text-sm font-semibold">Sigue explorando</p><Link to={`/proveedores?rubro=${encodeURIComponent(profile.category)}`} className={`${resourceLinkClass} mt-2 text-sm`}>Ver empresas de {profile.category.toLocaleLowerCase("es-CL")}<ArrowUpRight size={14} className="shrink-0" aria-hidden="true" /></Link><p className="mt-2 text-xs leading-6 text-[#60687a]">Agrupadas por rubro, no por recomendación comercial.</p></div></div>
      </aside>
    </div>
    <section id="fuentes" className={`${sectionClass} grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16`}>
      <div><h2 className="text-2xl font-semibold tracking-tight">De dónde salen estos datos</h2><p className="mt-3 max-w-2xl leading-7 text-[#505b70]">Fuentes consultadas el <time dateTime={profile.reviewedAt}>{supplierDate(profile.reviewedAt)}</time>. Cada registro conserva su período: una revisión de la ficha no convierte un dato histórico en uno actual.</p><ul className="mt-6 divide-y divide-[#dce2ed]">{profile.sources.map(source => <li key={`${source.url}-${source.supports}`} className="py-4"><a href={source.url} target="_blank" rel="noopener noreferrer" className={`${resourceLinkClass} text-sm leading-6`}>{source.label}<ArrowUpRight size={15} className="shrink-0" aria-hidden="true" /><span className="sr-only"> (abre otra pestaña)</span></a><p className="mt-1 text-xs leading-6 text-[#60687a]">{source.supports === "identity" ? "Respalda la identificación de la empresa." : source.supports === "channel" ? "Respalda el canal de contacto." : "Respalda antecedentes de actividad empresarial."}{/\.zip$/i.test(source.url) ? " Archivo ZIP de la fuente oficial." : ""}</p></li>)}</ul></div>
      <div className="space-y-7"><section><h3 className="font-semibold">Alcance de la ficha</h3><p className="mt-3 text-sm leading-7 text-[#60687a]">Información de consulta. No acredita vigencia tributaria, solvencia, cuentas bancarias ni una relación comercial con Ruka.</p></section><section className="border-t border-[#dce2ed] pt-6"><h3 className="font-semibold">¿Hay un dato incorrecto?</h3><p className="mt-2 text-sm leading-7 text-[#60687a]">Indícanos la corrección y su fuente pública. No envíes facturas ni datos bancarios.</p><a href={`mailto:privacidad@ruka.ai?subject=${encodeURIComponent(`Corrección de ficha: ${profile.name}`)}`} className={`${resourceLinkClass} mt-2 text-sm`}>Solicitar una corrección<ArrowUpRight size={14} aria-hidden="true" /></a></section></div>
    </section>
  </SupplierShell>;
}
