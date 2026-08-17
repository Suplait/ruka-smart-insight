import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

type CalendlyPreviewProps = {
  onSimulateBooking: () => void;
  onBack: () => void;
};

export function CalendlyPreview({ onSimulateBooking, onBack }: CalendlyPreviewProps) {
  return (
    <div className="flex min-h-[75dvh] items-center justify-center bg-white px-5 py-12 lg:min-h-[700px]">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef1ff] text-primary">
          <CalendarDays className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Calendly preview</p>
        <h2 className="mt-3 text-balance text-2xl font-semibold tracking-[-0.025em] text-[#171827]">
          El calendario real aparecerá aquí.
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#606980]">
          Este modo no carga Calendly ni registra una conversión.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3">
          <Button type="button" onClick={onSimulateBooking} className="h-11 rounded-full px-6 font-semibold">
            Simular agendamiento
          </Button>
          <button
            type="button"
            onClick={onBack}
            className="rounded-md px-3 py-2 text-sm font-medium text-[#596177] underline-offset-4 hover:text-[#171827] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Cambiar volumen
          </button>
        </div>
      </div>
    </div>
  );
}
