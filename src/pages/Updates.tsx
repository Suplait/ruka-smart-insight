import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ResourceLayout, resourceLinkClass } from "@/components/resources/ResourceLayout";
import { releaseNotes, updatesPath, updatesTitle, updatesDescription } from "@/content/releaseNotes";

export default function Updates() {
  return <ResourceLayout catalog path={updatesPath} title={updatesTitle} description={updatesDescription} eyebrow="Novedades" heading="Lo nuevo. Y para qué te sirve." lead="Recursos y mejoras que ya puedes explorar. Cada novedad lleva al lugar donde usarla." showContact={false}>
    <nav aria-label="Ediciones" className="mb-10 flex flex-wrap gap-x-6 border-b border-[#dce2ed] pb-4">{releaseNotes.map(note => <a key={note.id} href={`#${note.id}`} className={`${resourceLinkClass} text-sm`}>{note.label}</a>)}</nav>
    <div className="space-y-14">
      {releaseNotes.map(note => <article key={note.id} id={note.id} className="relative grid scroll-mt-28 gap-6 border-l border-[#dce2ed] pl-6 md:grid-cols-[210px_minmax(0,1fr)] md:gap-10 md:pl-8">
        <header><span aria-hidden="true" className="absolute -left-[5px] top-1 h-[9px] w-[9px] rounded-full bg-primary ring-4 ring-white" /><time dateTime={note.date} className="text-sm text-[#505b70]">{new Intl.DateTimeFormat("es-CL", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${note.date}T12:00:00Z`))}</time><p className="mt-3 text-sm font-semibold text-[#424ec0]">{note.label}</p></header>
        <div><h2 className="max-w-2xl text-2xl font-semibold sm:text-3xl leading-tight tracking-tight">{note.title}</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-[#505b70]">{note.summary}</p><ul className="mt-7 divide-y divide-[#dce2ed] rounded-xl border border-[#dce2ed]">{note.changes.map(change => <li key={change.href} className="p-5 sm:p-6"><h3 className="text-lg font-semibold">{change.title}</h3><p className="mt-2 max-w-2xl leading-7 text-[#505b70]">{change.description}</p><Link to={change.href} className={`${resourceLinkClass} mt-2`}>{change.link}<ArrowUpRight size={18} aria-hidden="true" /></Link></li>)}</ul></div>
      </article>)}
    </div>
    <p className="mt-8 max-w-2xl text-sm leading-6 text-[#505b70]">La disponibilidad de una función de producto depende de las conexiones y permisos de tu operación. Estas notas no cambian tu plan ni anuncian habilitaciones para todas las cuentas.</p>
  </ResourceLayout>;
}
