import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { VOLUME_OPTIONS } from "@/components/onboarding-v2/onboardingV2Data";

type VolumeSelectorProps = {
  selectedCount: number;
  onChange: (count: number) => void;
};

export function VolumeSelector({ selectedCount, onChange }: VolumeSelectorProps) {
  return (
    <fieldset>
      <legend className="text-balance text-xl font-semibold tracking-[-0.02em] text-[#171827] sm:text-2xl">
        ¿En qué tramo está tu volumen mensual de facturas de compra?
      </legend>
      <p className="mt-2 text-sm leading-6 text-[#687086]">Elige una aproximación. Confirmaremos el volumen contigo en la llamada.</p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4" role="radiogroup" aria-label="Volumen mensual de facturas de compra">
        {VOLUME_OPTIONS.map((option) => {
          const isSelected = selectedCount === option.value;
          const isFeatured = "featured" in option && option.featured;

          return (
            <label key={option.value} className="block cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="invoice-volume"
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
              />
              <span
                className={cn(
                  "relative flex min-h-40 flex-col rounded-[14px] border bg-white p-5 text-left transition-[border-color,background-color,box-shadow,transform] duration-150 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 active:scale-[0.995] sm:min-h-44 sm:p-6",
                  isSelected
                    ? "border-primary bg-[#f5f6ff] text-[#171827] shadow-[0_14px_36px_rgba(78,102,233,0.11)]"
                    : isFeatured
                      ? "border-primary/35 text-[#4f586f] hover:border-primary/60 hover:bg-[#fbfcff]"
                      : "border-[#dce3f2] text-[#4f586f] hover:border-[#aeb9ee] hover:bg-[#fbfcff]",
                )}
              >
                <span className="flex w-full items-start justify-between gap-4">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="text-lg font-semibold tracking-[-0.02em] text-[#171827]">{option.plan}</span>
                    {isFeatured ? (
                      <span className="rounded-full bg-primary/[0.09] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary">
                        Más elegido
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                      isSelected ? "border-primary bg-primary text-white" : "border-[#cfd6e5] bg-white text-transparent",
                    )}
                    aria-hidden="true"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                </span>

                <span className="mt-5 block max-w-[17rem] text-sm leading-6 text-[#626a7e]">{option.volume}</span>

                <span className="mt-auto flex items-baseline gap-1.5 pt-5">
                  <span className="text-2xl font-semibold tracking-[-0.035em] text-[#171827]">{option.price}</span>
                  {"priceDetail" in option ? <span className="text-xs font-medium text-[#737b8f]">{option.priceDetail}</span> : null}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
