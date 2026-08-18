import { useEffect, type ReactNode } from "react";
import { Check, Clock3 } from "lucide-react";
import { PricingSummary } from "@/components/onboarding-v2/PricingSummary";
import { ReviewBanner } from "@/components/onboarding-v2/ReviewBanner";

type CalendlyStageViewProps = {
  volumeLabel: string;
  children: ReactNode;
  isReview?: boolean;
  reviewDetail?: string;
};

const meetingTopics = [
  "Tu proceso",
  "Los sistemas que usa tu equipo",
  "Qué puede hacer Ruka",
  "Qué plan tiene sentido",
];

export function CalendlyStageView({ volumeLabel, children, isReview = false, reviewDetail }: CalendlyStageViewProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-[100dvh] bg-[#f7f8fc] text-[#171827]">
      {isReview ? <ReviewBanner detail={reviewDetail} /> : null}

      <div className="mx-auto max-w-[1480px] px-4 py-4 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        <header className="mb-5 lg:mb-8">
          <img src="/logo.png" alt="Ruka.ai" className="h-8 w-auto sm:h-9" />
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)] lg:gap-8 xl:grid-cols-[minmax(340px,0.68fr)_minmax(0,1.32fr)] xl:gap-10">
          <aside className="lg:sticky lg:top-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Último paso</p>
            <h1 className="mt-4 max-w-xl text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-4xl lg:text-[2.7rem]">
              Elige una hora para revisar tu proceso.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-sm leading-6 text-[#555d72] sm:text-base sm:leading-7">
              Ya tenemos tu volumen. En 30 minutos revisamos qué trabajo manual quieres dejar de hacer, los sistemas que toca y qué plan tiene sentido para tu operación.
            </p>

            <div className="mt-5 border-y border-[#dce3f2] py-4 sm:mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#71798c]">Tu volumen</p>
              <p className="mt-1.5 text-lg font-semibold tracking-[-0.02em] text-[#171827]">{volumeLabel}</p>
            </div>

            <section aria-labelledby="meeting-topics-title" className="mt-5 sm:mt-6">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-primary" aria-hidden="true" />
                <h2 id="meeting-topics-title" className="text-sm font-semibold text-[#171827]">
                  Qué revisamos
                </h2>
              </div>
              <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5 lg:grid-cols-1">
                {meetingTopics.map((topic) => (
                  <li key={topic} className="flex items-start gap-2 text-xs leading-5 text-[#596177] sm:text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#edf0ff] text-primary" aria-hidden="true">
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                    {topic}
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-5 sm:mt-6">
              <PricingSummary compact />
            </div>
          </aside>

          <section aria-label="Calendario para agendar" className="min-w-0 overflow-hidden rounded-2xl border border-[#dce3f2] bg-white">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
