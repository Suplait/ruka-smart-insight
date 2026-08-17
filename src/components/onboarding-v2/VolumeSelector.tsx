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
        ¿Cuántas facturas de compra recibes cada mes?
      </legend>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Volumen mensual de facturas">
        {VOLUME_OPTIONS.map((option) => {
          const isSelected = selectedCount === option.value;

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
                  "flex min-h-[72px] items-center justify-between rounded-xl border px-4 py-3 text-left transition-[border-color,background-color,transform] duration-150 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 active:scale-[0.99]",
                  isSelected
                    ? "border-primary bg-[#f3f5ff] text-[#171827]"
                    : "border-[#dce3f2] bg-white text-[#4f586f] hover:border-[#aeb9ee] hover:bg-[#fbfcff]",
                )}
              >
                <span className="pr-4 text-sm font-semibold leading-snug sm:text-[15px]">{option.label}</span>
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
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
