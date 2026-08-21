import { useEffect, useRef } from "react";
import { ArrowLeft, CalendarDays, Check, Clock3 } from "lucide-react";
import { ONE_NAME, type OneLeadData } from "@/content/oneContent";

type OneCalendlyProps = {
  lead: OneLeadData;
  isDebug: boolean;
  onScheduled: (eventUri?: string) => void;
  onBack?: () => void;
};

const rawCalendarUrl = import.meta.env.VITE_RUKA_ONE_CALENDLY_URL?.trim();

function getCalendarUrl() {
  if (!rawCalendarUrl) return null;
  try {
    const url = new URL(rawCalendarUrl);
    url.searchParams.set("hide_event_type_details", "1");
    url.searchParams.set("hide_gdpr_banner", "1");
    url.searchParams.set("background_color", "ffffff");
    url.searchParams.set("text_color", "171827");
    url.searchParams.set("primary_color", "5369eb");
    return url.toString();
  } catch {
    return rawCalendarUrl;
  }
}

const calendarUrl = getCalendarUrl();

function DebugCalendar({ lead, onScheduled, onBack }: OneCalendlyProps) {
  return (
    <div id="one-debug-calendar" className="overflow-hidden rounded-2xl border border-[#dfe3eb] bg-white">
      <div className="grid min-h-[610px] lg:grid-cols-[0.72fr_1.28fr]">
        <div className="border-b border-[#e3e6ed] bg-[#f8f9fc] p-6 lg:border-b-0 lg:border-r lg:p-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef1ff] text-[#5369eb]"><CalendarDays className="h-5 w-5" /></div>
          <p className="mt-6 text-xs font-semibold tracking-[0.15em] text-[#5369eb]">RUKA ONE</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#202231]">Revisión de caso</h3>
          <div className="mt-4 flex items-center gap-2 text-sm text-[#6e7485]"><Clock3 className="h-4 w-4" /> 30 min</div>
          <div className="mt-8 border-t border-[#dfe3eb] pt-6">
            <p className="text-xs font-semibold text-[#343746]">Datos precargados</p>
            <p className="mt-3 text-sm font-medium text-[#555b6d]">{lead.name}</p>
            <p className="mt-1 text-sm text-[#7c8292]">{lead.email}</p>
          </div>
        </div>
        <div className="p-6 lg:p-8">
          <p className="text-lg font-semibold text-[#252736]">Selecciona una fecha y hora</p>
          <div className="mt-6 grid grid-cols-7 gap-1.5 text-center text-[11px] text-[#8b91a1]">
            {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => <span key={`${day}-${index}`} className="py-2">{day}</span>)}
            {Array.from({ length: 35 }, (_, index) => (
              <span key={index} className={`flex aspect-square items-center justify-center rounded-full text-xs ${index === 17 ? "bg-[#5369eb] font-semibold text-white" : index > 2 && index < 31 ? "text-[#3f4352]" : "text-[#c2c6d0]"}`}>{index < 3 ? 29 + index : index - 2}</span>
            ))}
          </div>
          <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {["09:30", "11:00", "12:30", "15:00", "16:30", "17:30"].map((time, index) => <button key={time} type="button" className={`rounded-lg border px-3 py-2.5 text-xs font-semibold ${index === 1 ? "border-[#5369eb] bg-[#f1f3ff] text-[#5369eb]" : "border-[#dfe3eb] text-[#555b6d]"}`}>{time}</button>)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => onScheduled("debug://one-booking")} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#5369eb] px-5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5369eb] focus-visible:ring-offset-4"><Check className="h-4 w-4" /> Simular agendamiento</button>
            {onBack ? <button type="button" onClick={onBack} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#d9dde7] bg-white px-5 text-sm font-semibold text-[#474b5b]"><ArrowLeft className="h-4 w-4" /> Volver al formulario</button> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OneCalendly(props: OneCalendlyProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isDebug, lead, onScheduled } = props;
  const scheduledRef = useRef(onScheduled);

  useEffect(() => {
    scheduledRef.current = onScheduled;
  }, [onScheduled]);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (isDebug || !calendarUrl || !mountNode) return;

    const handleMessage = (event: MessageEvent) => {
      if (!String(event.origin).includes("calendly.com") || event.data?.event !== "calendly.event_scheduled") return;
      scheduledRef.current(event.data?.payload?.event?.uri);
    };
    window.addEventListener("message", handleMessage);

    const initialize = () => {
      if (!window.Calendly) return;
      mountNode.replaceChildren();
      window.Calendly.initInlineWidget({
        url: calendarUrl,
        parentElement: mountNode,
        prefill: {
          name: lead.name,
          email: lead.email,
        },
      });
    };

    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    let script = existingScript;
    if (window.Calendly) initialize();
    else if (existingScript) existingScript.addEventListener("load", initialize, { once: true });
    else {
      script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.addEventListener("load", initialize, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      window.removeEventListener("message", handleMessage);
      script?.removeEventListener("load", initialize);
      mountNode.replaceChildren();
    };
  }, [isDebug, lead.email, lead.name]);

  if (props.isDebug) return <DebugCalendar {...props} />;

  if (!calendarUrl) {
    return (
      <div className="rounded-2xl border border-[#dfe3eb] bg-white p-8 text-center sm:p-14">
        <CalendarDays className="mx-auto h-9 w-9 text-[#5369eb]" />
        <h3 className="mt-5 text-xl font-semibold text-[#252736]">Calendario pendiente de configuración</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6c7283]">Tus datos ya fueron enviados al equipo. Falta configurar el calendario independiente de {ONE_NAME}.</p>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      id="one-calendly-embed"
      className="h-[720px] w-full min-w-0 overflow-hidden rounded-2xl border border-[#dfe3eb] bg-white sm:h-[760px] [&_iframe]:!h-full [&_iframe]:!min-h-full [&_iframe]:!w-full"
    />
  );
}
