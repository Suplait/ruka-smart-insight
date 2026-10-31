import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { OneCalendly } from "@/components/one/OneCalendly";
import { OneContactForm } from "@/components/one/OneContactForm";
import { OneReviewBanner } from "@/components/one/OneReviewBanner";
import { OneContactSeo } from "@/components/one/OneSeo";
import { OneSuccess } from "@/components/one/OneSuccess";
import { OneWordmark } from "@/components/one/landing/OneHeader";
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

  return (
    <div className="one-world min-h-[100dvh]">
      <OneContactSeo />
      {isDebug ? <OneReviewBanner stage={stage} onStageChange={goToStage} /> : null}
      <header className="border-b border-[var(--one-rule)] px-4 sm:px-8 lg:px-10">
        <div className="mx-auto flex h-16 max-w-[84rem] items-center justify-between gap-6 sm:h-[4.5rem]">
          <OneWordmark />
          <Link to={ONE_PATH} className="inline-flex items-center gap-2 text-[0.9375rem] text-[var(--one-ink-2)] transition-colors hover:text-[var(--one-ink)]"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">Volver a {ONE_NAME}</span><span className="sm:hidden">Volver</span></Link>
        </div>
      </header>

      <main className="px-4 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[84rem]">
          {stage === "form" ? (
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
              <section aria-labelledby="one-contact-title" className="lg:col-span-6">
                <p className="one-eyebrow flex items-center gap-3 text-[var(--one-ink-2)]">
                  <span aria-hidden="true" className="inline-block h-[2px] w-8 bg-[var(--one-primary)]" />
                  {oneContent.contact.eyebrow}
                </p>
                <h1 id="one-contact-title" className="one-display mt-6 text-[clamp(2.75rem,5.6vw,5.25rem)]">{oneContent.contact.title}</h1>
                <p className="one-pretty mt-8 max-w-xl text-[1.1875rem] leading-[1.6] text-[var(--one-ink-2)] sm:text-[1.3125rem]">{oneContent.contact.lead}</p>
                <ul className="mt-10 grid gap-3 border-t border-[var(--one-rule)] pt-6 text-[1.0625rem] text-[var(--one-ink-2)] sm:grid-cols-3 lg:grid-cols-1">
                  {oneContent.contact.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3"><span aria-hidden="true" className="h-[2px] w-4 bg-[var(--one-primary)]" />{benefit}</li>
                  ))}
                </ul>
              </section>

              <div className="lg:col-span-5 lg:col-start-8">
                <OneContactForm
                  value={lead}
                  onChange={setLead}
                  onContinue={handleContinue}
                />
              </div>
            </div>
          ) : stage === "calendar" ? (
            <div>
              <p className="one-eyebrow flex items-center gap-3 text-[var(--one-ink-2)]">
                <span aria-hidden="true" className="inline-block h-[2px] w-8 bg-[var(--one-primary)]" />
                {oneContent.contact.eyebrow}
              </p>
              <h1 className="one-display mt-6 text-[clamp(2.75rem,5.6vw,5.25rem)]">{oneContent.contact.calendarTitle}</h1>
              <p className="one-pretty mt-6 max-w-2xl text-[1.1875rem] leading-[1.6] text-[var(--one-ink-2)]">{oneContent.contact.calendarLead}</p>
              <div className="mt-10">
                <OneCalendly submissionId={submissionIdRef.current ?? undefined} lead={lead} isDebug={isDebug} onScheduled={handleScheduled} onBack={isDebug ? () => goToStage("form") : undefined} />
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl"><OneSuccess /></div>
          )}
        </div>
      </main>
    </div>
  );
}
