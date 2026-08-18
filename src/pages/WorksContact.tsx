import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Clock3, FileText, Waypoints } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { WorksCalendly } from "@/components/works/WorksCalendly";
import { WorksContactForm } from "@/components/works/WorksContactForm";
import { WorksReviewBanner } from "@/components/works/WorksReviewBanner";
import { WorksContactSeo } from "@/components/works/WorksSeo";
import { WorksSuccess } from "@/components/works/WorksSuccess";
import { createWorksLead, notifyWorksLead } from "@/services/worksLeads";
import {
  emptyWorksLead,
  worksContent,
  worksDebugLead,
  WORKS_PATH,
  WORKS_NAME,
  type WorksLeadData,
} from "@/content/worksContent";
import { captureWorksAttribution, type WorksAttribution } from "@/utils/worksAttribution";
import { getWorksDebugStage, isWorksDebugEnabled, type WorksDebugStage } from "@/utils/worksDebug";
import { trackWorksEvent } from "@/utils/worksTracking";

const emptyAttribution: WorksAttribution = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  utm_term: null,
};

export default function WorksContact() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDebug = isWorksDebugEnabled(location.search);
  const queryStage = getWorksDebugStage(location.search);
  const [stage, setStage] = useState<WorksDebugStage>(() => (isDebug ? queryStage : "form"));
  const [lead, setLead] = useState<WorksLeadData>(() => (isDebug ? worksDebugLead : emptyWorksLead));
  const [leadId, setLeadId] = useState<string | null>(isDebug ? "debug-works-lead" : null);
  const attributionRef = useRef<WorksAttribution>(emptyAttribution);
  const contactTracked = useRef(false);

  useEffect(() => {
    if (isDebug) {
      setStage(queryStage);
      return;
    }
    attributionRef.current = captureWorksAttribution(location.search);
    if (!contactTracked.current) {
      trackWorksEvent("works_contact_view", { page_path: location.pathname });
      contactTracked.current = true;
    }
  }, [isDebug, location.pathname, location.search, queryStage]);

  const trackingPayload = useMemo(() => ({
    page_path: location.pathname,
    ...(leadId ? { lead_id: leadId } : {}),
    company: lead.company,
    frequency: lead.frequency,
    manual_hours: lead.manualHours,
  }), [lead, leadId, location.pathname]);

  const goToStage = (next: WorksDebugStage) => {
    setStage(next);
    if (isDebug) navigate(`/works/contacto?worksDebug=1&stage=${next}`, { replace: true });
  };

  const handleContinue = async (nextLead: WorksLeadData) => {
    setLead(nextLead);
    if (isDebug) {
      setLeadId("debug-works-lead");
      goToStage("calendar");
      return;
    }

    trackWorksEvent("works_form_submit_attempt", {
      page_path: location.pathname,
      company: nextLead.company,
      frequency: nextLead.frequency,
      manual_hours: nextLead.manualHours,
    });

    const createdLeadId = await createWorksLead(nextLead, attributionRef.current, "/works");
    setLeadId(createdLeadId);
    trackWorksEvent("works_lead_created", {
      page_path: location.pathname,
      lead_id: createdLeadId,
      company: nextLead.company,
      frequency: nextLead.frequency,
      manual_hours: nextLead.manualHours,
    });

    await Promise.race([
      notifyWorksLead(createdLeadId).catch(() => undefined),
      new Promise((resolve) => window.setTimeout(resolve, 3500)),
    ]);

    trackWorksEvent("works_calendly_view", {
      page_path: location.pathname,
      lead_id: createdLeadId,
      company: nextLead.company,
      frequency: nextLead.frequency,
      manual_hours: nextLead.manualHours,
    });
    setStage("calendar");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScheduled = (eventUri?: string) => {
    if (!isDebug) {
      trackWorksEvent("works_calendly_scheduled", { ...trackingPayload, calendly_event_uri: eventUri });
      trackWorksEvent("works_success_view", trackingPayload);
    }
    goToStage("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#fbfcff] text-[#171827]">
      <WorksContactSeo />
      {isDebug ? <WorksReviewBanner stage={stage} onStageChange={goToStage} /> : null}
      <header className="border-b border-[#e3e6ed] bg-white/85 px-5 py-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <Link to={WORKS_PATH} aria-label={`Volver a ${WORKS_NAME}`}><img src="/logo.png" alt="Ruka.ai" className="h-8" /></Link>
          <Link to={WORKS_PATH} className="inline-flex items-center gap-2 text-sm font-semibold text-[#62697b] transition hover:text-[#5369eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5369eb] focus-visible:ring-offset-4"><ArrowLeft className="h-4 w-4" /> Volver a {WORKS_NAME}</Link>
        </div>
      </header>

      <main className="px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl">
          {stage === "form" ? (
            <div className="grid items-start gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
              <div className="lg:sticky lg:top-10">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-[#5369eb]">{worksContent.contact.eyebrow}</p>
                <h1 className="mt-5 text-balance text-[clamp(2.65rem,5.5vw,5.3rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-[#171827]">{worksContent.contact.title}</h1>
                <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-[#676e80]">{worksContent.contact.lead}</p>
                <div className="mt-9 space-y-4 border-t border-[#dfe3eb] pt-7 text-sm text-[#596072]">
                  <p className="flex items-center gap-3"><Clock3 className="h-4 w-4 text-[#5369eb]" /> Revisión de 30 minutos</p>
                  <p className="flex items-center gap-3"><FileText className="h-4 w-4 text-[#5369eb]" /> Partimos desde tu proceso real</p>
                  <p className="flex items-center gap-3"><Waypoints className="h-4 w-4 text-[#5369eb]" /> Sin compromiso</p>
                </div>
              </div>
              <WorksContactForm value={lead} onChange={setLead} onContinue={handleContinue} />
            </div>
          ) : stage === "calendar" ? (
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-[#5369eb]">REVISIÓN DE PROCESO</p>
              <h1 className="mt-5 max-w-4xl text-balance text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-[0.96] tracking-[-0.058em] text-[#171827]">{worksContent.contact.calendarTitle}</h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-[#676e80] sm:text-lg sm:leading-8">{worksContent.contact.calendarLead}</p>

              <div className="mt-8 grid gap-3 rounded-xl border border-[#dfe3eb] bg-white p-4 sm:grid-cols-3 sm:p-5">
                <div><p className="text-[9px] font-bold tracking-[0.13em] text-[#8a90a0]">PROCESO</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-[#454958]">{lead.processDescription}</p></div>
                <div><p className="text-[9px] font-bold tracking-[0.13em] text-[#8a90a0]">SISTEMAS</p><p className="mt-1 text-xs leading-5 text-[#454958]">{lead.systems || "No especificados"}</p></div>
                <div><p className="text-[9px] font-bold tracking-[0.13em] text-[#8a90a0]">FRECUENCIA · TRABAJO</p><p className="mt-1 text-xs leading-5 text-[#454958]">{lead.frequency} · {lead.manualHours}</p></div>
              </div>
              <div className="mt-7">
                <WorksCalendly lead={lead} isDebug={isDebug} onScheduled={handleScheduled} onBack={isDebug ? () => goToStage("form") : undefined} />
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl"><WorksSuccess lead={lead} /></div>
          )}
        </div>
      </main>
    </div>
  );
}
