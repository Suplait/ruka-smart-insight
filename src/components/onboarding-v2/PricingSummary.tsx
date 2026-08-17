import { PRICING_PLANS } from "@/components/onboarding-v2/onboardingV2Data";
import { cn } from "@/lib/utils";

type PricingSummaryProps = {
  compact?: boolean;
};

export function PricingSummary({ compact = false }: PricingSummaryProps) {
  if (compact) {
    return (
      <section aria-labelledby="compact-pricing-title" className="border-t border-[#dce3f2] pt-5">
        <h2 id="compact-pricing-title" className="text-sm font-semibold text-[#171827]">
          Precios
        </h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {PRICING_PLANS.map((plan) => (
            <div key={plan.name} className="min-w-0 rounded-lg bg-[#f5f7fb] px-2.5 py-3">
              <p className="text-[11px] font-semibold text-[#606980]">{plan.name}</p>
              <p className="mt-1 truncate text-xs font-semibold tracking-[-0.01em] text-[#171827] sm:text-sm">{plan.price}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="pricing-title" className="rounded-2xl border border-[#dce3f2] bg-white p-5 sm:p-6 lg:p-7">
      <h2 id="pricing-title" className="text-balance text-2xl font-semibold tracking-[-0.025em] text-[#171827]">
        Precios claros antes de hablar
      </h2>

      <div className="mt-5 overflow-hidden rounded-xl border border-[#e1e6f0]">
        {PRICING_PLANS.map((plan, index) => (
          <div
            key={plan.name}
            className={cn(
              "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-5",
              index > 0 && "border-t border-[#e1e6f0]",
              "bg-white",
            )}
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#171827]">{plan.name}</p>
              <p className="mt-0.5 text-xs leading-5 text-[#626a7e]">{plan.capacity}</p>
            </div>
            <div className="text-right">
              <p className="whitespace-nowrap text-lg font-semibold tracking-[-0.025em] text-[#171827]">{plan.price}</p>
              <p className="text-[11px] text-[#6a7184]">/ mes</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-[#e1e6f0] pt-5">
        <p className="text-sm font-semibold text-[#171827]">¿Más volumen o un proceso distinto?</p>
        <p className="mt-1 text-sm text-[#606980]">Lo vemos contigo.</p>
      </div>

      <p className="mt-5 text-xs leading-5 text-[#687086]">
        El plan depende del volumen total que procesa Ruka. Si estás cerca de un límite, usa un aproximado y lo confirmamos contigo.
      </p>
    </section>
  );
}
