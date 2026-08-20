import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowLeft, Clock3, Handshake, UsersRound } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { WorksCalendly } from "@/components/works/WorksCalendly";
import { WorksContactForm } from "@/components/works/WorksContactForm";
import { WorksReviewBanner } from "@/components/works/WorksReviewBanner";
import { WorksContactSeo } from "@/components/works/WorksSeo";
import { WorksSuccess } from "@/components/works/WorksSuccess";
import type { WorksVisualState } from "@/components/works/WorksVolumetricEnvironment";
import type { WorksVisualLabState } from "@/components/works/visual-lab/visualLabTypes";
import { createWorksLead } from "@/services/worksLeads";
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

const WorksMathematicalFlock = lazy(async () => {
  const module = await import("@/components/works/visual-lab/WorksMathematicalFlock");
  return { default: module.WorksMathematicalFlock };
});

const emptyAttribution: WorksAttribution = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  utm_term: null,
};

function createSubmissionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) crypto.getRandomValues(bytes);
  else bytes.forEach((_, index) => { bytes[index] = Math.floor(Math.random() * 256); });
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const value = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
}

export default function WorksContact() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDebug = isWorksDebugEnabled(location.search);
  const queryStage = getWorksDebugStage(location.search);
  const [stage, setStage] = useState<WorksDebugStage>(() => (isDebug ? queryStage : "form"));
  const [lead, setLead] = useState<WorksLeadData>(() => (isDebug ? worksDebugLead : emptyWorksLead));
  const [visualState, setVisualState] = useState<WorksVisualState>(() => isDebug ? "valid" : "idle");
  const [leadId, setLeadId] = useState<string | null>(isDebug ? "debug-works-lead" : null);
  const attributionRef = useRef<WorksAttribution>(emptyAttribution);
  const submissionIdRef = useRef<string | null>(null);
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

    trackWorksEvent("works_form_submit_attempt", { page_path: location.pathname });
    submissionIdRef.current ??= createSubmissionId();
    const createdLeadId = await createWorksLead(
      nextLead,
      attributionRef.current,
      "/works",
      submissionIdRef.current,
    );
    setLeadId(createdLeadId);
    trackWorksEvent("works_lead_created", { page_path: location.pathname, lead_id: createdLeadId });
    trackWorksEvent("works_calendly_view", { page_path: location.pathname, lead_id: createdLeadId });
    setStage("calendar");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScheduled = (eventUri?: string) => {
    if (!isDebug) {
      const payload = {
        page_path: location.pathname,
        ...(leadId ? { lead_id: leadId } : {}),
      };
      trackWorksEvent("works_calendly_scheduled", {
        ...payload,
        ...(eventUri ? { calendly_event_uri: eventUri } : {}),
      });
      trackWorksEvent("works_success_view", payload);
    }
    goToStage("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const flockState: WorksVisualLabState = visualState === "idle" || visualState === "valid"
    ? visualState
    : "focus";

  return (
    <div className="min-h-[100dvh] bg-[#fbfcff] text-[#171827]">
      <WorksContactSeo />
      {isDebug ? <WorksReviewBanner stage={stage} onStageChange={goToStage} /> : null}
      <header className="border-b border-[#e3e6ed] bg-white/90 px-5 py-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <Link to="/" aria-label="Ir al inicio de Ruka"><img src="/logo.png" alt="Ruka.ai" className="h-8" /></Link>
          <Link to={WORKS_PATH} className="inline-flex items-center gap-2 text-sm font-semibold text-[#62697b] transition hover:text-[#5369eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5369eb] focus-visible:ring-offset-4"><ArrowLeft className="h-4 w-4" /> Volver a {WORKS_NAME}</Link>
        </div>
      </header>

      <main className="px-5 py-8 sm:px-8 sm:py-10 lg:py-0">
        <div className="mx-auto max-w-7xl">
          {stage === "form" ? (
            <div className="grid gap-7 lg:min-h-[calc(100dvh-65px)] lg:grid-cols-[minmax(0,1.23fr)_minmax(410px,0.77fr)] lg:items-center lg:gap-8 xl:gap-12">
              <section className="relative min-h-[390px] overflow-hidden sm:min-h-[430px] lg:min-h-[calc(100dvh-65px)]">
                <div className="absolute inset-0">
                  <Suspense fallback={<EnvironmentLoadFallback />}>
                    <WorksMathematicalFlock state={flockState} paused={false} />
                  </Suspense>
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(251,252,255,0.95)_0%,rgba(251,252,255,0.76)_35%,rgba(251,252,255,0.12)_72%,transparent_100%),linear-gradient(180deg,transparent_0%,rgba(251,252,255,0.12)_45%,#fbfcff_91%)] lg:bg-[linear-gradient(90deg,rgba(251,252,255,0.92)_0%,rgba(251,252,255,0.66)_36%,rgba(251,252,255,0.06)_68%,transparent_100%),linear-gradient(180deg,transparent_0%,rgba(251,252,255,0.08)_64%,#fbfcff_100%)]"
                />

                <div className="relative z-[1] flex min-h-[390px] flex-col justify-center py-12 sm:min-h-[430px] lg:min-h-[calc(100dvh-65px)] lg:max-w-[39rem] lg:py-16">
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-[#5369eb]">{worksContent.contact.eyebrow}</p>
                  <h1 className="mt-4 max-w-xl text-balance text-[clamp(2.5rem,4.8vw,4.45rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-[#171827]">{worksContent.contact.title}</h1>
                  <p className="mt-5 max-w-lg text-pretty text-base leading-7 text-[#5e6678] sm:text-lg sm:leading-8">{worksContent.contact.lead}</p>
                  <ContactBenefits className="mt-7 hidden lg:grid" />
                </div>
              </section>

              <div className="lg:py-10">
                <WorksContactForm
                  value={lead}
                  onChange={setLead}
                  onContinue={handleContinue}
                  onVisualStateChange={setVisualState}
                />
                <ContactBenefits className="mt-6 grid lg:hidden" />
              </div>
            </div>
          ) : stage === "calendar" ? (
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-[#5369eb]">RUKA WORKS</p>
              <h1 className="mt-4 max-w-4xl text-balance text-[clamp(2.5rem,4.8vw,4.7rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#171827]">{worksContent.contact.calendarTitle}</h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-[#676e80] sm:text-lg sm:leading-8">{worksContent.contact.calendarLead}</p>
              <div className="mt-7">
                <WorksCalendly lead={lead} isDebug={isDebug} onScheduled={handleScheduled} onBack={isDebug ? () => goToStage("form") : undefined} />
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl"><WorksSuccess /></div>
          )}
        </div>
      </main>
    </div>
  );
}

function ContactBenefits({ className }: { className: string }) {
  return (
    <div className={`${className} gap-3 border-t border-[#dfe3eb] pt-6 text-sm text-[#596072] sm:grid-cols-3 lg:grid-cols-1`}>
      <p className="flex items-center gap-3"><Clock3 className="h-4 w-4 text-[#5369eb]" /> 30 minutos</p>
      <p className="flex items-center gap-3"><Handshake className="h-4 w-4 text-[#5369eb]" /> Sin compromiso</p>
      <p className="flex items-center gap-3"><UsersRound className="h-4 w-4 text-[#5369eb]" /> Conversación con el equipo de Ruka</p>
    </div>
  );
}

function EnvironmentLoadFallback() {
  return (
    <div
      aria-hidden="true"
      className="h-full w-full bg-[#fbfcff]"
      style={{
        background: "radial-gradient(ellipse at 62% 32%, rgba(83,105,235,0.12), rgba(251,252,255,0) 58%)",
      }}
    />
  );
}
