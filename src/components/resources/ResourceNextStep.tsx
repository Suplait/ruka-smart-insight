import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { journeys, resourceJourney } from "@/utils/resourceJourney";

/** A normal, crawlable next step. Never gates a tool or submits its data. */
export function ResourceNextStep({ path }: { path: string }) {
  const journey = journeys[resourceJourney(path)];
  return <aside data-resource-next-step className="mt-10 rounded-2xl bg-[#f4f5ff] p-6 sm:p-8">
    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#424ec0]">{path.startsWith("/ayuda") ? "¿Aún no usas Ruka?" : "De esta tarea a tu operación"}</p>
    <h2 className="mt-3 max-w-3xl text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{journey.title}</h2>
    <p className="mt-4 max-w-3xl text-base leading-7 text-[#505b70]">{journey.text}</p>
    <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
      <Link data-resource-product to={journey.href} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#424ec0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 motion-reduce:transition-none">{journey.label}<ArrowRight size={17} className="shrink-0" aria-hidden="true" /></Link>
      <Link to="/register" className="inline-flex min-h-12 items-center gap-2 rounded px-1 text-sm font-semibold text-[#424ec0] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">Agendar 30 min <ArrowRight size={16} aria-hidden="true" /></Link>
    </div>
    <p className="mt-3 text-xs leading-5 text-[#60687a]">La conversación es sin compromiso. Este recurso sigue disponible sin registrarte.</p>
  </aside>;
}
