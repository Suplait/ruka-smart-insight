import { CalendarCheck2, Check, FileText, Waypoints } from "lucide-react";
import { worksContent, type WorksLeadData } from "@/content/worksContent";

export function WorksSuccess({ lead }: { lead: WorksLeadData }) {
  const summary = [
    { label: "Proceso", value: lead.processDescription, icon: FileText },
    { label: "Sistemas", value: lead.systems || "No especificados", icon: Waypoints },
    { label: "Frecuencia", value: lead.frequency, icon: CalendarCheck2 },
  ];

  return (
    <section id="works-success" className="rounded-[22px] border border-[#d9def7] bg-white p-6 shadow-[0_24px_70px_rgba(30,34,56,0.09)] sm:p-10">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5369eb] text-white"><Check className="h-5 w-5" /></span>
      <h1 className="mt-7 max-w-2xl text-balance text-[clamp(2.4rem,5vw,4.8rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[#171827]">{worksContent.contact.successTitle}</h1>
      <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-[#676e80] sm:text-lg sm:leading-8">{worksContent.contact.successCopy}</p>

      <div className="mt-9 divide-y divide-[#e3e6ed] border-y border-[#e3e6ed]">
        {summary.map(({ label, value, icon: Icon }) => (
          <div key={label} className="grid gap-3 py-5 sm:grid-cols-[160px_1fr]">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-[#777e90]"><Icon className="h-4 w-4 text-[#5369eb]" /> {label.toUpperCase()}</p>
            <p className="text-sm leading-6 text-[#363948]">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
