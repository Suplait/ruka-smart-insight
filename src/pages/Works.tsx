import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { BeforeAfter } from "@/components/works/BeforeAfter";
import { PainPatterns } from "@/components/works/PainPatterns";
import { UseCases } from "@/components/works/UseCases";
import { WorksDifference } from "@/components/works/WorksDifference";
import { WorksFinalCta } from "@/components/works/WorksFinalCta";
import { WorksFooter } from "@/components/works/WorksFooter";
import { WorksHero } from "@/components/works/WorksHero";
import { WorksMethod } from "@/components/works/WorksMethod";
import { WorksSeo } from "@/components/works/WorksSeo";
import { WorksSocialProof } from "@/components/works/WorksSocialProof";
import { captureWorksAttribution } from "@/utils/worksAttribution";
import { isWorksDebugEnabled } from "@/utils/worksDebug";
import { trackWorksEvent } from "@/utils/worksTracking";
import { worksContent, WORKS_CONTACT_PATH, WORKS_PATH } from "@/content/worksContent";

export default function Works() {
  const location = useLocation();
  const tracked = useRef(false);

  useEffect(() => {
    captureWorksAttribution(location.search);
    if (!tracked.current && !isWorksDebugEnabled(location.search)) {
      trackWorksEvent("works_page_view", { page_path: location.pathname });
      tracked.current = true;
    }
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#fbfcff] text-[#171827]">
      <WorksSeo />
      <Navbar
        sectionLinks={worksContent.navigation}
        sectionPath={WORKS_PATH}
        logoPath={WORKS_PATH}
        primaryAction={{ label: "Cuéntanos el proceso", path: WORKS_CONTACT_PATH }}
      />
      <main>
        <WorksHero />
        <PainPatterns />
        <UseCases />
        <BeforeAfter />
        <WorksMethod />
        <WorksDifference />
        <WorksSocialProof />
        <WorksFinalCta />
      </main>
      <WorksFooter />
    </div>
  );
}
