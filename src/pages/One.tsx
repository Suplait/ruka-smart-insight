import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { BeforeAfter } from "@/components/one/BeforeAfter";
import { FamiliarPatterns } from "@/components/one/FamiliarPatterns";
import { OneFaq } from "@/components/one/OneFaq";
import { OneFinalCta } from "@/components/one/OneFinalCta";
import { OneHero } from "@/components/one/OneHero";
import { OneMethod } from "@/components/one/OneMethod";
import { OneSeo } from "@/components/one/OneSeo";
import { OneSocialProof } from "@/components/one/OneSocialProof";
import { OneStartingPoint } from "@/components/one/OneStartingPoint";
import { OneTestimonial } from "@/components/one/OneTestimonial";
import { captureOneAttribution } from "@/utils/oneAttribution";
import { isOneDebugEnabled } from "@/utils/oneDebug";
import { trackOneEvent } from "@/utils/oneTracking";
import { ONE_CONTACT_PATH } from "@/content/oneContent";

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
    <div className="min-h-screen overflow-x-clip bg-[#fbfcff] text-[#171827]">
      <OneSeo />
      <Navbar
        primaryAction={{ label: "Conversemos", path: ONE_CONTACT_PATH }}
      />
      <main>
        <OneHero />
        <OneSocialProof />
        <OneStartingPoint />
        <FamiliarPatterns />
        <BeforeAfter />
        <OneMethod />
        <OneTestimonial />
        <OneFaq />
        <OneFinalCta />
      </main>
      <Footer />
    </div>
  );
}
