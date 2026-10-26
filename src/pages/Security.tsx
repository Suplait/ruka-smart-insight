import { ArrowRight, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";
import { ResourceLayout, resourceLinkClass } from "@/components/resources/ResourceLayout";
import { GuideNavigation } from "@/components/resources/GuideNavigation";
import { securityPath, securityTitle, securityDescription, securitySections } from "@/content/securityContent";

export default function Security() {
  return <ResourceLayout catalog path={securityPath} title={securityTitle} description={securityDescription} eyebrow="Seguridad y privacidad" heading="Tus datos son parte de tu operación." lead="Conectar sistemas también exige entender qué información se usa, quién tiene acceso y qué acciones puede ejecutar cada proceso. Aquí puedes empezar esa revisión." showContact={false}>
    <div className="mb-8 flex items-start gap-3 rounded-xl border border-[#dce2ed] bg-[#f8f9fc] p-5 text-sm leading-6 text-[#505b70]"><LockKeyhole size={20} className="mt-0.5 shrink-0 text-[#424ec0]" aria-hidden="true" /><p>Información revisada el <time dateTime="2026-10-26">26 de octubre de 2026</time>. El alcance se confirma por producto y configuración; esta página no reemplaza el acuerdo de tu empresa.</p></div>
    <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,720px)] lg:gap-16"><GuideNavigation label="Temas de seguridad" items={securitySections.map(section => ({ id: section.id, title: section.title }))} /><div className="min-w-0">{securitySections.map(section => <section id={section.id} key={section.id} className="scroll-mt-28 border-t border-[#dce2ed] pb-12 pt-7"><h2 className="text-balance text-2xl font-semibold leading-tight tracking-tight">{section.title}</h2><p className="mt-4 border-l-2 border-primary pl-4 text-base font-medium leading-7 text-[#424ec0]">{section.summary}</p><div className="mt-5 space-y-5 text-base leading-8 text-[#444e61]">{section.paragraphs.map(p => <p key={p}>{p}</p>)}</div><div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">{section.links.map(link => link.href.startsWith("mailto:") ? <a className={resourceLinkClass} href={link.href} key={link.href}>{link.label}<ArrowRight size={16} aria-hidden="true" /></a> : <Link className={resourceLinkClass} to={link.href} key={link.href}>{link.label}<ArrowRight size={16} aria-hidden="true" /></Link>)}</div></section>)}</div></div>
  </ResourceLayout>;
}
