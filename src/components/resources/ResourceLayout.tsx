import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingSeo } from "@/components/seo/MarketingSeo";

export const resourceLinkClass = "inline-flex min-h-11 items-center gap-2 rounded-md font-semibold text-[#424ec0] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 active:scale-[0.98] motion-reduce:transform-none";

export function ResourceLayout({ path, title, description, eyebrow, heading, children, lead, compact = false, showContact = true, primaryEntity, backLink = { path: "/recursos", label: "Todos los recursos" } }: { path: string; title: string; description: string; eyebrow: string; heading: string; children: ReactNode; lead?: string; compact?: boolean; showContact?: boolean; primaryEntity?: Record<string, unknown> & { "@id": string }; backLink?: { path: string; label: string } }) {
  return <div className="min-h-screen bg-white text-[#171827]">
    <MarketingSeo path={path} title={title} description={description} name={heading} primaryEntity={primaryEntity ?? (compact ? { "@type": "WebApplication", "@id": `https://www.ruka.ai${path}#tool`, name: eyebrow, url: `https://www.ruka.ai${path}`, description, applicationCategory: "BusinessApplication", operatingSystem: "Web", browserRequirements: "Requires JavaScript", isAccessibleForFree: true } : undefined)} />
    <a href="#contenido" className="sr-only z-50 rounded bg-white p-4 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Saltar al contenido</a>
    <Navbar />
    <main id="contenido" className={`mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 ${compact ? "sm:pt-28" : "sm:pt-40"}`}>
      {path !== "/recursos" && <Link to={backLink.path} className={`${resourceLinkClass} ${compact ? "mb-3" : "mb-8"} text-sm`}><ArrowLeft size={16} aria-hidden="true" /> {backLink.label}</Link>}
      <header className={`${compact ? "mb-7" : "mb-12"} max-w-4xl`}>
        <p className="mb-4 text-sm font-semibold text-[#424ec0]">{eyebrow}</p>
        <h1 className={`max-w-3xl text-balance ${compact ? "text-[clamp(2rem,3.5vw,3rem)]" : "text-[clamp(2.4rem,5vw,4.5rem)]"} font-semibold leading-[1.06] tracking-[-0.04em]`}>{heading}</h1>
        <p className={`${compact ? "mt-4" : "mt-6"} max-w-2xl text-lg leading-relaxed text-[#505b70]`}>{lead ?? description}</p>
      </header>
      {children}
      {showContact && <aside className="mt-20 grid gap-5 border-t border-[#dce2ed] pt-8 sm:grid-cols-[1fr_auto] sm:items-center">
        <div><h2 className="text-xl font-semibold">¿Haces esto con cada compra?</h2><p className="mt-2 max-w-2xl leading-7 text-[#505b70]">Ruka conecta tus compras con los sistemas de tu operación. Podemos revisar juntos qué trabajo vale la pena automatizar.</p></div>
        <Link to="/register" className={resourceLinkClass}>Agendar 30 min <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </aside>}
    </main>
    <Footer />
  </div>;
}
