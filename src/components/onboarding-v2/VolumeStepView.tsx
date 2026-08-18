import { useEffect } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewBanner } from "@/components/onboarding-v2/ReviewBanner";
import { VolumeSelector } from "@/components/onboarding-v2/VolumeSelector";

type VolumeStepViewProps = {
  selectedCount: number;
  onChange: (count: number) => void;
  onContinue: () => void;
  isLoading: boolean;
  isReview?: boolean;
};

export function VolumeStepView({ selectedCount, onChange, onContinue, isLoading, isReview = false }: VolumeStepViewProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-[100dvh] bg-[#fbfcff] text-[#171827]">
      {isReview ? <ReviewBanner detail="Paso de volumen" /> : null}

      <div className="mx-auto flex min-h-[calc(100dvh-42px)] max-w-6xl flex-col px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
        <header>
          <img src="/logo.png" alt="Ruka.ai" className="h-8 w-auto sm:h-9" />
        </header>

        <div className="my-auto py-9 sm:py-12 lg:py-14">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Antes de agendar</p>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-[#171827] sm:text-5xl lg:text-[3.35rem]">
              Cuéntanos tu volumen.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-[#555d72] sm:text-lg sm:leading-8">
              Una aproximación está bien. Elige el tramo que mejor representa tu operación antes de ver los horarios disponibles.
            </p>

            <div className="mt-9 max-w-5xl">
              <VolumeSelector selectedCount={selectedCount} onChange={onChange} />
            </div>
          </section>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Button
              type="button"
              onClick={onContinue}
              disabled={isLoading}
              className="h-12 w-full rounded-full px-6 text-base font-semibold shadow-none transition-transform duration-150 active:scale-[0.98] sm:w-auto"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Guardando...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>
            <p className="text-sm text-[#687086]">El siguiente paso es elegir una hora.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
