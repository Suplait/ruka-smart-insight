import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingSeo } from "@/components/seo/MarketingSeo";

export const resourceLinkClass = "inline-flex min-h-11 items-center gap-2 rounded-md font-semibold text-[#424ec0] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 active:scale-[0.98] motion-reduce:transform-none";

export function ResourceLayout({ path, title, description, eyebrow, heading, children, lead, compact = false, showContact = true, primaryEntity, backLink = { path: "/recursos", label: "Todos los recursos" } }: { path: string; title: string; description: string; eyebrow: string; heading: string; children: ReactNode; lead?: string; compact?: boolean; showContact?: boolean; primaryEntity?: Record<string, unknown> & { "@id": string }; backLink?: { path: string; label: string } }) {
  const tools = [
    { path: "/herramientas/costo-unitario", label: "Costo unitario" },
    { path: "/herramientas/variacion-costos", label: "Variación" },
    { path: "/herramientas/margen-markup", label: "Margen / markup" },
  ];
  return <div className="min-h-screen bg-white text-[#171827]">
    <MarketingSeo path={path} title={title} description={description} name={heading} primaryEntity={primaryEntity ?? (compact ? { "@type": "WebApplication", "@id": `https://www.ruka.ai${path}#tool`, name: eyebrow, url: `https://www.ruka.ai${path}`, description, applicationCategory: "BusinessApplication", operatingSystem: "Web", browserRequirements: "Requires JavaScript", isAccessibleForFree: true } : undefined)} />
    <a href="#contenido" className="sr-only z-50 rounded bg-white p-4 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Saltar al contenido</a>
    <Navbar />
    <main id="contenido" className={`mx-auto max-w-7xl px-5 pb-24 sm:px-8 ${compact ? "pt-24 sm:pt-28" : "pt-28 sm:pt-40"}`}>
      {path !== "/recursos" && <Link to={backLink.path} className={`${resourceLinkClass} ${compact ? "mb-3" : "mb-8"} text-sm`}><ArrowLeft size={16} aria-hidden="true" /> {backLink.label}</Link>}
      <header className={`${compact ? "mb-5" : "mb-12"} max-w-4xl`}>
        <p className={`${compact ? "mb-2" : "mb-4"} text-sm font-semibold text-[#424ec0]`}>{eyebrow}</p>
        <h1 className={`text-balance ${compact ? "max-w-4xl text-[clamp(1.75rem,3vw,2.5rem)]" : "max-w-3xl text-[clamp(2.4rem,5vw,4.5rem)]"} font-semibold leading-[1.1] tracking-[-0.04em]`}>{heading}</h1>
        <p className={`${compact ? "mt-3 max-w-3xl text-base" : "mt-6 max-w-2xl text-lg"} leading-relaxed text-[#505b70]`}>{lead ?? description}</p>
      </header>
      {compact && tools.some(tool => tool.path === path) && <nav aria-label="Calculadoras" className="mb-5 flex flex-wrap gap-x-5 border-b border-[#dce2ed]">{tools.map(tool => <Link key={tool.path} to={tool.path} aria-current={path === tool.path ? "page" : undefined} className={`inline-flex min-h-11 items-center border-b-2 px-1 text-sm font-medium transition-colors focus-visible:outline-primary ${path === tool.path ? "border-primary text-[#424ec0]" : "border-transparent text-[#60687a] hover:border-[#cbd2df] hover:text-[#171827]"}`}>{tool.label}</Link>)}</nav>}
      {children}
      {showContact && <aside className="mt-20 grid gap-5 border-t border-[#dce2ed] pt-8 sm:grid-cols-[1fr_auto] sm:items-center">
        <div><h2 className="text-xl font-semibold">¿Haces esto con cada compra?</h2><p className="mt-2 max-w-2xl leading-7 text-[#505b70]">Ruka conecta tus compras con los sistemas de tu operación. Podemos revisar juntos qué trabajo vale la pena automatizar.</p></div>
        <Link to="/register" className={resourceLinkClass}>Agendar 30 min <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </aside>}
    </main>
    <Footer />
  </div>;
}
