import { lazy, Suspense, useCallback, useState } from "react";
import { Clock3, Handshake, UsersRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { worksContent } from "@/content/worksContent";
import { WorksVisualLabControls } from "@/components/works/visual-lab/WorksVisualLabControls";
import { WorksVisualLabForm } from "@/components/works/visual-lab/WorksVisualLabForm";
import {
  getForcedVisualLabState,
  type WorksVisualLabState,
} from "@/components/works/visual-lab/visualLabTypes";

const WorksMathematicalFlock = lazy(async () => {
  const module = await import("@/components/works/visual-lab/WorksMathematicalFlock");
  return { default: module.WorksMathematicalFlock };
});

export function WorksVisualLab() {
  const location = useLocation();
  const navigate = useNavigate();
  const forcedState = getForcedVisualLabState(location.search);
  const [autoState, setAutoState] = useState<WorksVisualLabState>("idle");
  const [paused, setPaused] = useState(false);
  const [submitSimulated, setSubmitSimulated] = useState(false);
  const visualState = forcedState ?? autoState;

  const updateQuery = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(location.search);
    params.set("visualLab", "1");
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, value);
    });
    navigate({ pathname: location.pathname, search: `?${params.toString()}` }, { replace: true });
  }, [location.pathname, location.search, navigate]);

  const handleStateChange = (nextState: WorksVisualLabState | null) => {
    setSubmitSimulated(false);
    updateQuery({ state: nextState });
  };

  const handleFormStateChange = useCallback((nextState: WorksVisualLabState) => {
    setAutoState(nextState);
  }, []);

  const handleFormInteraction = useCallback(() => {
    if (getForcedVisualLabState(location.search) !== null) updateQuery({ state: null });
  }, [location.search, updateQuery]);

  const handleSimulatedSubmit = () => {
    setAutoState("valid");
    setSubmitSimulated(true);
    updateQuery({ state: "valid" });
  };

  return (
    <>
      <div className="grid gap-7 lg:min-h-[calc(100dvh-65px)] lg:grid-cols-[minmax(0,1.23fr)_minmax(410px,0.77fr)] lg:items-center lg:gap-8 xl:gap-12">
        <section
          data-visual-lab-left
          className="relative min-h-[390px] overflow-hidden sm:min-h-[430px] lg:min-h-[calc(100dvh-65px)]"
        >
          <div className="absolute inset-0">
            <Suspense fallback={<LabSceneFallback />}>
              <WorksMathematicalFlock state={visualState} paused={paused} />
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
            <LabBenefits className="mt-7 hidden lg:grid" />
          </div>
        </section>

        <div className="pb-24 lg:py-10">
          <WorksVisualLabForm
            onVisualStateChange={handleFormStateChange}
            onUserInteraction={handleFormInteraction}
            onSimulatedSubmit={handleSimulatedSubmit}
          />
          <LabBenefits className="mt-6 grid lg:hidden" />
        </div>
      </div>

      <WorksVisualLabControls
        forcedState={forcedState}
        currentState={visualState}
        paused={paused}
        submitSimulated={submitSimulated}
        onStateChange={handleStateChange}
        onPauseChange={setPaused}
      />
    </>
  );
}

function LabBenefits({ className }: { className: string }) {
  return (
    <div className={`${className} gap-3 border-t border-[#dfe3eb] pt-6 text-sm text-[#596072] sm:grid-cols-3 lg:grid-cols-1`}>
      <p className="flex items-center gap-3"><Clock3 className="h-4 w-4 text-[#5369eb]" /> 30 minutos</p>
      <p className="flex items-center gap-3"><Handshake className="h-4 w-4 text-[#5369eb]" /> Sin compromiso</p>
      <p className="flex items-center gap-3"><UsersRound className="h-4 w-4 text-[#5369eb]" /> Conversación con el equipo de Ruka</p>
    </div>
  );
}

function LabSceneFallback() {
  return <div className="h-full w-full bg-[radial-gradient(ellipse_at_72%_24%,rgba(98,117,225,0.16),transparent_44%),#fbfcff]" />;
}
