import { useEffect } from "react";
import { ArrowRight, CalendarCheck2, Check, Clock3, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ReviewBanner } from "@/components/onboarding-v2/ReviewBanner";

type BookingSuccessViewProps = {
  isReview?: boolean;
};

const successDetails = [
  { label: "30 minutos", icon: Clock3 },
  { label: "Revisamos tu proceso", icon: Workflow },
  { label: "Te ayudamos a definir cómo partir", icon: Check },
];

export function BookingSuccessView({ isReview = false }: BookingSuccessViewProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-[100dvh] bg-[#fbfcff] text-[#171827]">
      {isReview ? <ReviewBanner detail="Post-agendamiento" /> : null}

      <div className="mx-auto flex min-h-[calc(100dvh-42px)] max-w-6xl flex-col px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
        <header>
          <Link to="/" aria-label="Ir al inicio de Ruka" className="inline-flex">
            <img src="/logo.png" alt="Ruka.ai" className="h-8 w-auto sm:h-9" />
          </Link>
        </header>

        <div className="my-auto grid items-center gap-10 py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(330px,0.85fr)] lg:gap-16">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Listo</p>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-[3.5rem]">
              Tu llamada quedó agendada.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-[#555d72] sm:text-lg sm:leading-8">
              En la reunión revisaremos tu proceso, los sistemas que usa tu equipo y cómo podría operarlo Ruka.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button asChild className="h-12 rounded-full px-6 text-base font-semibold">
                <Link to="/">
                  Volver a Ruka
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              {isReview ? (
                <Link
                  to="/register?onboardingDebug=1"
                  className="rounded-md px-3 py-2 text-sm font-medium text-[#596177] underline-offset-4 hover:text-[#171827] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Reiniciar review
                </Link>
              ) : null}
            </div>
          </section>

          <aside className="rounded-2xl border border-[#dce3f2] bg-white p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef1ff] text-primary">
              <CalendarCheck2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="mt-6 divide-y divide-[#e1e6f0]">
              {successDetails.map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
                  <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-sm font-semibold text-[#30364c] sm:text-base">{label}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
