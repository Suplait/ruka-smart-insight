import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { OneAreas } from "@/components/one/chapters/OneAreas";
import { OneBetween } from "@/components/one/chapters/OneBetween";
import { OneFaq, OneFinal, OneFooter } from "@/components/one/chapters/OneClosing";
import { OneDifference } from "@/components/one/chapters/OneDifference";
import { OneHeader } from "@/components/one/chapters/OneHeader";
import { OneBeaconLabel, OneHero } from "@/components/one/chapters/OneHero";
import { OneScope } from "@/components/one/chapters/OneScope";
import { OneHow } from "@/components/one/chapters/OneHow";
import { OneImpact } from "@/components/one/chapters/OneImpact";
import { useActiveScene, useOneMotion } from "@/components/one/chapters/useOneMotion";
import { OneField } from "@/components/one/field/OneField";
import { OneSeo } from "@/components/one/OneSeo";
import { captureOneAttribution } from "@/utils/oneAttribution";
import { isOneDebugEnabled } from "@/utils/oneDebug";
import { trackOneEvent } from "@/utils/oneTracking";
import "@/styles/one.css";

const scopeLink = { scene: "scope", selector: "[data-one-perimeter]" } as const;

export default function One() {
  const location = useLocation();
  const tracked = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [area, setArea] = useState(0);
  const scene = useActiveScene(rootRef, "hero");
  useOneMotion(rootRef);

  useEffect(() => {
    captureOneAttribution(location.search);
    if (!tracked.current && !isOneDebugEnabled(location.search)) {
      trackOneEvent("one_page_view", { page_path: location.pathname });
      tracked.current = true;
    }
  }, [location.pathname, location.search]);

  return (
    <div ref={rootRef} className="one-root relative min-h-screen overflow-x-clip font-sans">
      <OneSeo />
      <a href="#one-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black">
        Saltar al contenido
      </a>
      <OneField mode="page" scene={scene} areaIndex={area} beaconLabel={<OneBeaconLabel />} scopeLink={scopeLink} />
      <OneHeader />
      <main id="one-main" className="relative z-10">
        <OneHero />
        <OneBetween />
        <OneDifference />
        <OneHow />
        <OneScope />
        <OneAreas active={area} onActiveChange={setArea} />
        <OneImpact />
        <OneFaq />
        <OneFinal />
      </main>
      <OneFooter />
    </div>
  );
}
