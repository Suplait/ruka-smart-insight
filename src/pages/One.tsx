import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { OneAgreement } from "@/components/one/landing/OneAgreement";
import { OneBetween } from "@/components/one/landing/OneBetween";
import { OneClosing } from "@/components/one/landing/OneClosing";
import { OneDefinition } from "@/components/one/landing/OneDefinition";
import { OneExamples } from "@/components/one/landing/OneExamples";
import { OneFaq } from "@/components/one/landing/OneFaq";
import { OneFooter } from "@/components/one/landing/OneFooter";
import { OneHeader } from "@/components/one/landing/OneHeader";
import { OneHero } from "@/components/one/landing/OneHero";
import { OneOrigin } from "@/components/one/landing/OneOrigin";
import { OneIntelligence, OneOutcomes } from "@/components/one/landing/OneOutcomes";
import { OneTransfer } from "@/components/one/landing/OneTransfer";
import { OneSeo } from "@/components/one/OneSeo";
import { captureOneAttribution } from "@/utils/oneAttribution";
import { isOneDebugEnabled } from "@/utils/oneDebug";
import { trackOneEvent } from "@/utils/oneTracking";
import "@/styles/one.css";

export default function One() {
  const location = useLocation();
  const tracked = useRef(false);

  useEffect(() => {
    captureOneAttribution(location.search);
    if (!tracked.current && !isOneDebugEnabled(location.search)) {
      trackOneEvent("one_page_view", { page_path: location.pathname });
      tracked.current = true;
    }
  }, [location.pathname, location.search]);

  return (
    <div className="one-world min-h-screen overflow-x-clip">
      <OneSeo />
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-[var(--one-ink)] focus:px-4 focus:py-2 focus:text-[var(--one-paper)]">
        Saltar al contenido
      </a>
      <OneHeader />
      <main id="contenido">
        <OneHero />
        <OneDefinition />
        <OneBetween />
        <OneTransfer />
        <OneAgreement />
        <OneOutcomes />
        <OneIntelligence />
        <OneExamples />
        <OneOrigin />
        <OneFaq />
        <OneClosing />
      </main>
      <OneFooter />
    </div>
  );
}
