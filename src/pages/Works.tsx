import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { BeforeAfter } from "@/components/works/BeforeAfter";
import { FamiliarPatterns } from "@/components/works/FamiliarPatterns";
import { WorksFaq } from "@/components/works/WorksFaq";
import { WorksFinalCta } from "@/components/works/WorksFinalCta";
import { WorksHero } from "@/components/works/WorksHero";
import { WorksMethod } from "@/components/works/WorksMethod";
import { WorksSeo } from "@/components/works/WorksSeo";
import { WorksSocialProof } from "@/components/works/WorksSocialProof";
import { WorksTestimonial } from "@/components/works/WorksTestimonial";
import { captureWorksAttribution } from "@/utils/worksAttribution";
import { isWorksDebugEnabled } from "@/utils/worksDebug";
import { trackWorksEvent } from "@/utils/worksTracking";
import { WORKS_CONTACT_PATH } from "@/content/worksContent";

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
        primaryAction={{ label: "Revisar mi caso", path: WORKS_CONTACT_PATH }}
      />
      <main>
        <WorksHero />
        <WorksSocialProof />
        <FamiliarPatterns />
        <BeforeAfter />
        <WorksMethod />
        <WorksTestimonial />
        <WorksFaq />
        <WorksFinalCta />
      </main>
      <Footer />
    </div>
  );
}
