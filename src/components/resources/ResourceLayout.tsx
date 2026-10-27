import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ResourceNextStep } from "@/components/resources/ResourceNextStep";
import { MarketingSeo } from "@/components/seo/MarketingSeo";
import type { ToolFaq } from "@/content/toolGuides";
import { ToolNavigation } from "./ToolNavigation";

export const resourceLinkClass = "inline-flex min-h-11 items-center gap-2 rounded-md font-semibold text-[#424ec0] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 active:scale-[0.98] motion-reduce:transform-none";

export function ResourceLayout({ path, title, description, eyebrow, heading, children, lead, faqs, compact = false, catalog = false, showContact = true, primaryEntity, backLink = { path: "/recursos", label: "Todos los recursos" } }: { path: string; title: string; description: string; eyebrow: string; heading: string; children: ReactNode; lead?: string; faqs?: readonly ToolFaq[]; compact?: boolean; catalog?: boolean; showContact?: boolean; primaryEntity?: Record<string, unknown> & { "@id": string }; backLink?: { path: string; label: string } }) {
  return <div className="min-h-screen bg-white text-[#171827]">
    <MarketingSeo path={path} title={title} description={description} name={heading} faqs={faqs} primaryEntity={primaryEntity ?? (compact ? { "@type": "WebApplication", "@id": `https://www.ruka.ai${path}#tool`, name: eyebrow, url: `https://www.ruka.ai${path}`, description, applicationCategory: "BusinessApplication", operatingSystem: "Web", browserRequirements: "Requiere JavaScript y un navegador moderno.", inLanguage: "es-CL", isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "CLP" }, publisher: { "@id": "https://www.ruka.ai/#organization" } } : undefined)} />
    <a href="#contenido" className="sr-only z-50 rounded bg-white p-4 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Saltar al contenido</a>
    <Navbar />
    <main id="contenido" className={`mx-auto max-w-7xl px-5 pb-24 sm:px-8 ${compact ? "pt-24 sm:pt-28" : catalog ? "pt-28 sm:pt-36" : "pt-28 sm:pt-40"}`}>
      {path !== "/recursos" && <Link to={backLink.path} className={`${resourceLinkClass} ${compact ? "mb-3" : "mb-8"} text-sm`}><ArrowLeft size={16} aria-hidden="true" /> {backLink.label}</Link>}
      <header className={`${compact ? "mb-5" : "mb-12"} max-w-4xl`}>
        <p className={`${compact ? "mb-2" : "mb-4"} text-sm font-semibold text-[#424ec0]`}>{eyebrow}</p>
        <h1 className={`text-balance ${compact ? "max-w-4xl text-[clamp(1.75rem,3vw,2.5rem)]" : catalog ? "max-w-4xl text-[clamp(2rem,4vw,3rem)]" : "max-w-3xl text-[clamp(2.4rem,5vw,4.5rem)]"} font-semibold leading-[1.1] tracking-[-0.04em]`}>{heading}</h1>
        <p className={`${compact ? "mt-3 max-w-3xl text-base" : "mt-6 max-w-2xl text-lg"} leading-relaxed text-[#505b70]`}>{lead ?? description}</p>
      </header>
      {compact && <ToolNavigation path={path} />}
      {children}
      {showContact && <ResourceNextStep path={path} />}
    </main>
    <Footer />
  </div>;
}
