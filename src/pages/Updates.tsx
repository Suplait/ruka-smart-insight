import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ResourceLayout, resourceLinkClass } from "@/components/resources/ResourceLayout";
import { releaseNotes, updatesPath, updatesTitle, updatesDescription } from "@/content/releaseNotes";

export default function Updates() {
  return <ResourceLayout path={updatesPath} title={updatesTitle} description={updatesDescription} eyebrow="Novedades" heading="Lo nuevo. Y para qué te sirve." lead="Recursos y mejoras que ya puedes explorar. Cada novedad lleva al lugar donde usarla." showContact={false}>
    <div className="divide-y divide-[#dce2ed] border-y border-[#dce2ed]">
      {releaseNotes.map(note => <article key={note.id} id={note.id} className="grid scroll-mt-28 gap-6 py-10 md:grid-cols-[.5fr_1.5fr] md:gap-14 md:py-14">
        <header><time dateTime={note.date} className="text-sm text-[#505b70]">{new Intl.DateTimeFormat("es-CL", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${note.date}T12:00:00Z`))}</time><p className="mt-3 text-sm font-semibold text-[#424ec0]">{note.label}</p></header>
        <div><h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight">{note.title}</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-[#505b70]">{note.summary}</p><ul className="mt-8 space-y-9">{note.changes.map(change => <li key={change.href}><h3 className="text-xl font-semibold">{change.title}</h3><p className="mt-2 max-w-2xl leading-7 text-[#505b70]">{change.description}</p><Link to={change.href} className={`${resourceLinkClass} mt-2`}>{change.link}<ArrowUpRight size={18} aria-hidden="true" /></Link></li>)}</ul></div>
      </article>)}
    </div>
    <p className="mt-8 max-w-2xl text-sm leading-6 text-[#505b70]">La disponibilidad de una función de producto depende de las conexiones y permisos de tu operación. Estas notas no cambian tu plan ni anuncian habilitaciones para todas las cuentas.</p>
  </ResourceLayout>;
}
