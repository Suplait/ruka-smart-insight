import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { productResources } from "@/content/productResources";

export function ProductResources({ path }: { path: string }) {
  const resources = productResources[path];
  if (!resources?.length) return null;
  return <section aria-labelledby="product-resources-title" className="border-t border-[#dfe4ef] bg-white px-5 py-16 sm:px-8 sm:py-20">
    <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.68fr_1.32fr] lg:gap-20">
      <div><h2 id="product-resources-title" className="max-w-sm text-3xl font-semibold tracking-[-0.03em]">Para llevarlo a la práctica.</h2><p className="mt-4 max-w-sm text-base leading-7 text-[#505b70]">Ejemplos, herramientas y conexiones para revisar cómo funcionaría en tu operación.</p></div>
      <ul className="divide-y divide-[#dfe4ef]">{resources.map(resource => <li key={resource.href}><Link to={resource.href} className="group flex min-h-24 items-start gap-5 py-6 first:pt-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><div className="min-w-0 flex-1"><span className="text-xs font-semibold text-[#424ec0]">{resource.kind}</span><h3 className="mt-2 text-lg font-semibold leading-7 text-[#171827] group-hover:text-[#424ec0]">{resource.title}</h3><p className="mt-2 text-sm leading-6 text-[#505b70]">{resource.description}</p></div><ArrowUpRight aria-hidden="true" className="mt-6 h-5 w-5 shrink-0 text-[#424ec0]" /></Link></li>)}</ul>
    </div>
  </section>;
}
