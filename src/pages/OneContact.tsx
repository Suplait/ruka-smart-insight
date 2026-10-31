import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { OneCalendly } from "@/components/one/OneCalendly";
import { OneContactForm } from "@/components/one/OneContactForm";
import { OneReviewBanner } from "@/components/one/OneReviewBanner";
import { OneContactSeo } from "@/components/one/OneSeo";
import { OneSuccess } from "@/components/one/OneSuccess";
import { OneLogo } from "@/components/one/chapters/OneHeader";
import { OneField } from "@/components/one/field/OneField";
import type { FieldSceneName } from "@/components/one/field/fieldScenes";
import type { OneContactVisualState } from "@/components/one/field/fieldTypes";
import { notifyOneCalendlyScheduled, notifyOneLead } from "@/services/oneSlack";
import {
  emptyOneLead,
  oneContent,
  oneDebugLead,
  ONE_PATH,
  ONE_NAME,
  type OneLeadData,
} from "@/content/oneContent";
import { captureOneAttribution, type OneAttribution } from "@/utils/oneAttribution";
import { getOneDebugStage, isOneDebugEnabled, type OneDebugStage } from "@/utils/oneDebug";
import { trackOneEvent } from "@/utils/oneTracking";
import "@/styles/one.css";

const emptyAttribution: OneAttribution = {
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

export default function OneContact() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDebug = isOneDebugEnabled(location.search);
  const queryStage = getOneDebugStage(location.search);
  const [stage, setStage] = useState<OneDebugStage>(() => (isDebug ? queryStage : "form"));
  const [lead, setLead] = useState<OneLeadData>(() => (isDebug ? oneDebugLead : emptyOneLead));
  const [visualState, setVisualState] = useState<OneContactVisualState>(() => isDebug ? "valid" : "idle");
  const attributionRef = useRef<OneAttribution>(emptyAttribution);
  const submissionIdRef = useRef<string | null>(null);
  const slackThreadTsRef = useRef<string | null>(null);
  const scheduledHandledRef = useRef(false);
  const contactTracked = useRef(false);

  useEffect(() => {
    if (isDebug) {
      setStage(queryStage);
      return;
    }
    attributionRef.current = captureOneAttribution(location.search);
    if (!contactTracked.current) {
      trackOneEvent("one_contact_view", { page_path: location.pathname });
      contactTracked.current = true;
    }
  }, [isDebug, location.pathname, location.search, queryStage]);

  const goToStage = (next: OneDebugStage) => {
    setStage(next);
    if (isDebug) navigate(`/one/contacto?oneDebug=1&stage=${next}`, { replace: true });
  };

  const handleContinue = async (nextLead: OneLeadData) => {
    setLead(nextLead);
    if (isDebug) {
      goToStage("calendar");
      return;
    }

    trackOneEvent("one_form_submit_attempt", { page_path: location.pathname });
    submissionIdRef.current ??= createSubmissionId();
    const submissionId = submissionIdRef.current;
    void notifyOneLead(
      nextLead,
      attributionRef.current,
      location.pathname,
      submissionId,
    ).then((threadTs) => {
      slackThreadTsRef.current = threadTs;
    }).catch((error) => {
      console.error("Ruka One lead Slack notification failed", error);
    });
    trackOneEvent("one_lead_created", { page_path: location.pathname, lead_id: submissionId });
    trackOneEvent("one_calendly_view", { page_path: location.pathname, lead_id: submissionId });
    setStage("calendar");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScheduled = (eventUri?: string) => {
    if (scheduledHandledRef.current) return;
    scheduledHandledRef.current = true;

    if (!isDebug) {
      const submissionId = submissionIdRef.current;
      const payload = {
        page_path: location.pathname,
        ...(submissionId ? { lead_id: submissionId } : {}),
      };
      trackOneEvent("one_calendly_scheduled", {
        ...payload,
        ...(eventUri ? { calendly_event_uri: eventUri } : {}),
      });
      trackOneEvent("one_success_view", payload);

      if (submissionId) {
        void notifyOneCalendlyScheduled(
          lead,
          attributionRef.current,
          location.pathname,
          submissionId,
          slackThreadTsRef.current,
          eventUri,
        ).catch((error) => {
          console.error("Ruka One Calendly Slack notification failed", error);
        });
      }
    }
    goToStage("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fieldScene: FieldSceneName = visualState === "idle"
    ? "contact"
    : visualState === "valid" ? "contact-valid" : "contact-focus";

  return (
    <div className="one-root min-h-[100dvh] font-sans">
      <OneContactSeo />
      {isDebug ? <OneReviewBanner stage={stage} onStageChange={goToStage} /> : null}
      <header className="relative z-20 border-b border-[var(--one-hair)] bg-[rgba(3,4,10,0.9)]">
        <div className="mx-auto flex h-[68px] max-w-[1360px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <OneLogo />
          <Link to={ONE_PATH} className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[var(--one-soft)] transition hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">Volver a</span> {ONE_NAME}
          </Link>
        </div>
      </header>

      <main>
        {stage === "form" ? (
          <div className="relative lg:min-h-[calc(100dvh-68px)]">
            <div className="mx-auto grid max-w-[1360px] lg:min-h-[calc(100dvh-68px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)]">
              <section aria-labelledby="one-contact-title" className="relative isolate overflow-hidden px-5 pb-10 pt-12 sm:px-8 lg:flex lg:flex-col lg:justify-center lg:px-12 lg:py-16">
                <OneField mode="panel" scene={fieldScene} interactive={false} className="-z-10 opacity-90" />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(3,4,10,0.92)_0%,rgba(3,4,10,0.55)_55%,rgba(3,4,10,0.85)_100%)] lg:bg-[linear-gradient(90deg,rgba(3,4,10,0.9)_0%,rgba(3,4,10,0.55)_48%,rgba(3,4,10,0)_100%)]" />
                <p className="one-eyebrow one-fade"><span>{ONE_NAME}<span className="hidden sm:inline">{oneContent.contact.eyebrowRest}</span><span className="sm:hidden"> · 30 min</span></span></p>
                <h1 id="one-contact-title" className="one-display mt-6 max-w-[13ch] text-balance text-[clamp(2.5rem,6.4vw,5.6rem)]">
                  <span className="one-line"><span>{oneContent.contact.title}</span></span>
                </h1>
                <p className="one-fade mt-6 max-w-[34rem] text-pretty text-[17px] leading-[1.6] text-[var(--one-soft)] sm:text-lg" style={{ ["--i" as string]: 1 }}>{oneContent.contact.lead}</p>
                <ol className="one-fade mt-9 hidden max-w-[34rem] lg:block" style={{ ["--i" as string]: 2 }}>
                  {oneContent.contact.expectations.map((item, index) => (
                    <li key={item} className="flex items-baseline gap-4 border-t border-[var(--one-hair)] py-3.5 text-[15px] text-[var(--one-soft)]">
                      <span className="w-5 flex-none text-xs font-semibold tabular-nums text-[var(--one-accent)]">0{index + 1}</span>
                      {item}
                    </li>
                  ))}
                </ol>
                <p className="one-fade mt-6 text-sm text-[var(--one-muted)]" style={{ ["--i" as string]: 3 }}>30 minutos · Sin compromiso</p>
              </section>

              <div className="relative z-10 px-5 pb-14 sm:px-8 lg:flex lg:flex-col lg:justify-center lg:py-12 lg:pl-4 lg:pr-12">
                <OneContactForm
                  value={lead}
                  onChange={setLead}
                  onContinue={handleContinue}
                  onVisualStateChange={setVisualState}
                />
              </div>
            </div>
          </div>
        ) : stage === "calendar" ? (
          <div className="mx-auto max-w-[1360px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
            <p className="one-eyebrow">{ONE_NAME}</p>
            <h1 className="one-display mt-5 max-w-4xl text-balance text-[clamp(2.5rem,5.4vw,4.8rem)]">{oneContent.contact.calendarTitle}</h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-[var(--one-soft)] sm:text-lg sm:leading-8">{oneContent.contact.calendarLead}</p>
            <div className="mt-8">
              <OneCalendly submissionId={submissionIdRef.current ?? undefined} lead={lead} isDebug={isDebug} onScheduled={handleScheduled} onBack={isDebug ? () => goToStage("form") : undefined} />
            </div>
          </div>
        ) : (
          <div className="relative isolate min-h-[calc(100dvh-68px)] overflow-hidden px-5 sm:px-8">
            <OneField mode="panel" scene="contact-valid" interactive={false} className="-z-10" />
            <div aria-hidden="true" className="one-shade-center pointer-events-none absolute inset-0 -z-10" />
            <div className="mx-auto flex min-h-[calc(100dvh-68px)] max-w-4xl items-center justify-center"><OneSuccess /></div>
          </div>
        )}
      </main>
    </div>
  );
}
