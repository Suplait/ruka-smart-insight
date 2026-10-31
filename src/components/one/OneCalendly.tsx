import { useEffect, useRef } from "react";
import { ArrowLeft, CalendarDays, Check, Clock3 } from "lucide-react";
import { ONE_NAME, type OneLeadData } from "@/content/oneContent";

import { useCalendlyObservation } from "@/hooks/useCalendlyObservation";

type OneCalendlyProps = {
  submissionId?: string;
  lead: OneLeadData;
  isDebug: boolean;
  onScheduled: (eventUri?: string) => void;
  onBack?: () => void;
};

const defaultCalendarUrl = "https://calendly.com/suplait_lorenzo/ruka-works";
const rawCalendarUrl = import.meta.env.VITE_RUKA_ONE_CALENDLY_URL?.trim() || defaultCalendarUrl;

/** Calendly needs a hex; derive it from the live --primary token instead of hardcoding one. */
function primaryTokenHex(token: string) {
  const match = token.trim().match(/^(-?[\d.]+)(?:deg)?\s+([\d.]+)%\s+([\d.]+)%$/);
  if (!match) return null;
  const h = Number(match[1]) / 360;
  const sat = Number(match[2]) / 100;
  const l = Number(match[3]) / 100;
  const q = l < 0.5 ? l * (1 + sat) : l + sat - l * sat;
  const p = 2 * l - q;
  const channel = (t: number) => {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return [channel(h + 1 / 3), channel(h), channel(h - 1 / 3)]
    .map((value) => Math.round(value * 255).toString(16).padStart(2, "0"))
    .join("");
}

function getCalendarUrl() {
  if (!rawCalendarUrl) return null;
  try {
    const url = new URL(rawCalendarUrl);
    url.searchParams.set("hide_event_type_details", "1");
    url.searchParams.set("hide_gdpr_banner", "1");
    url.searchParams.set("background_color", "070a16");
    url.searchParams.set("text_color", "f1f3fa");
    const primary = typeof document === "undefined"
      ? null
      : primaryTokenHex(getComputedStyle(document.documentElement).getPropertyValue("--primary"));
    if (primary) url.searchParams.set("primary_color", primary);
    return url.toString();
  } catch {
    return rawCalendarUrl;
  }
}

const calendarUrl = rawCalendarUrl || null;

function DebugCalendar({ lead, onScheduled, onBack }: OneCalendlyProps) {
  return (
    <div id="one-debug-calendar" className="overflow-hidden rounded-[22px] border border-[var(--one-hair-strong)] bg-[rgba(6,8,18,0.94)]">
      <div className="grid min-h-[610px] lg:grid-cols-[0.72fr_1.28fr]">
        <div className="border-b border-[var(--one-hair)] p-6 lg:border-b-0 lg:border-r lg:p-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.18)] text-[var(--one-accent)]"><CalendarDays className="h-5 w-5" /></div>
          <p className="mt-6 text-xs font-semibold tracking-[0.15em] text-[var(--one-accent)]">RUKA ONE</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-white">Revisión de caso</h3>
          <div className="mt-4 flex items-center gap-2 text-sm text-[var(--one-muted)]"><Clock3 className="h-4 w-4" /> 30 min</div>
          <div className="mt-8 border-t border-[var(--one-hair)] pt-6">
            <p className="text-xs font-semibold text-[var(--one-soft)]">Datos precargados</p>
            <p className="mt-3 text-sm font-medium text-white">{lead.name}</p>
            <p className="mt-1 text-sm text-[var(--one-muted)]">{lead.email}</p>
          </div>
        </div>
        <div className="p-6 lg:p-8">
          <p className="text-lg font-semibold text-white">Selecciona una fecha y hora</p>
          <div className="mt-6 grid max-w-md grid-cols-7 gap-1.5 text-center text-[11px] text-[var(--one-muted)]">
            {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => <span key={`${day}-${index}`} className="py-2">{day}</span>)}
            {Array.from({ length: 35 }, (_, index) => (
              <span key={index} className={`flex aspect-square items-center justify-center rounded-full text-xs ${index === 17 ? "bg-[hsl(var(--primary))] font-semibold text-white" : index > 2 && index < 31 ? "text-[var(--one-soft)]" : "text-[#4b5168]"}`}>{index < 3 ? 29 + index : index - 2}</span>
            ))}
          </div>
          <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {["09:30", "11:00", "12:30", "15:00", "16:30", "17:30"].map((time, index) => <button key={time} type="button" className={`min-h-[44px] rounded-lg border px-3 py-2.5 text-xs font-semibold ${index === 1 ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.16)] text-white" : "border-[var(--one-hair-strong)] text-[var(--one-soft)]"}`}>{time}</button>)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => onScheduled("debug://one-booking")} className="one-cta"><Check className="h-4 w-4" /> Simular agendamiento</button>
            {onBack ? <button type="button" onClick={onBack} className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[14px] border border-[var(--one-hair-strong)] px-5 text-sm font-semibold text-[var(--one-soft)] hover:text-white"><ArrowLeft className="h-4 w-4" /> Volver al formulario</button> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OneCalendly(props: OneCalendlyProps) {
  useCalendlyObservation(props.isDebug ? undefined : props.submissionId);
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
        url: getCalendarUrl() ?? calendarUrl,
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
      <div className="rounded-[22px] border border-[var(--one-hair-strong)] bg-[rgba(6,8,18,0.94)] p-8 text-center sm:p-14">
        <CalendarDays className="mx-auto h-9 w-9 text-[var(--one-accent)]" />
        <h3 className="mt-5 text-xl font-semibold text-white">Calendario pendiente de configuración</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--one-soft)]">Tus datos ya fueron enviados al equipo. Falta configurar el calendario independiente de {ONE_NAME}.</p>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      id="one-calendly-embed"
      className="h-[720px] w-full min-w-0 overflow-hidden rounded-[22px] border border-[var(--one-hair-strong)] bg-[#070a16] sm:h-[760px] [&_iframe]:!h-full [&_iframe]:!min-h-full [&_iframe]:!w-full"
    />
  );
}
