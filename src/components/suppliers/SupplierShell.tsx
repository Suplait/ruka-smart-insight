import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingSeo } from "@/components/seo/MarketingSeo";
import { ResourceNextStep } from "@/components/resources/ResourceNextStep";

export function SupplierShell({ path, title, description, name, children, faqs = [], entity, directory = false }: {
  path: string; title: string; description: string; name: string; children: ReactNode;
  faqs?: { question: string; answer: string }[];
  entity?: Record<string, unknown> & { "@id": string };
  directory?: boolean;
}) {
  return <div className="min-h-screen bg-white text-[#171827]">
    <MarketingSeo path={path} title={title} description={description} name={name} primaryEntity={entity} faqs={faqs} />
    <a href="#contenido" className="sr-only z-50 rounded bg-white p-4 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Saltar al contenido</a>
    <Navbar />
    <main id="contenido" className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 sm:pt-28">
      <Link to={directory ? "/recursos" : "/proveedores"} className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-[#505b70] underline-offset-4 hover:text-primary hover:underline focus-visible:outline-primary"><ArrowLeft size={16} aria-hidden="true" />{directory ? "Todos los recursos" : "Directorio de proveedores"}</Link>
      {children}
      <ResourceNextStep path={path} />
    </main>
    <Footer />
  </div>;
}
