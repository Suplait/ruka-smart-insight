import { useState, type ReactNode } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";

export type ProductGuidedTourStep = {
  label: string;
  title: string;
  description: string;
  outcome: string;
  focus: {
    label: string;
    copy: string;
    left: string;
    top: string;
    width: string;
    height: string;
    labelPosition?: "top" | "bottom";
  };
  Icon: LucideIcon;
  visual: ReactNode;
  aspect?: "standard" | "wide" | "cinema";
};

type ProductGuidedTourProps = {
  heading: string;
  intro: string;
  steps: readonly ProductGuidedTourStep[];
};

const aspectClasses = {
  standard: "aspect-[4/3]",
  wide: "aspect-[16/10]",
  cinema: "aspect-video",
};

export function ProductGuidedTour({ heading, intro, steps }: ProductGuidedTourProps) {
  const [activeStep, setActiveStep] = useState(0);
  const active = steps[activeStep];
  const focusStyle = {
    left: active.focus.left,
    top: active.focus.top,
    width: active.focus.width,
    height: active.focus.height,
    boxShadow: "0 0 0 999px rgba(23, 26, 41, 0.32)",
  };

  return (
    <section className="border-y border-[#dce1eb] py-16 sm:py-20" aria-labelledby="product-tour-title">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-primary">Producto en acción</p>
        <h2 id="product-tour-title" className="mt-3 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.035em] text-[#171827] sm:text-4xl">
          {heading}
        </h2>
        <p className="mt-5 text-lg leading-8 text-[#555b6e]">{intro}</p>
      </div>

      <div className="mt-10 overflow-hidden rounded-[22px] border border-[#dce1eb] bg-[#f7f8fc] shadow-[0_18px_55px_rgba(24,30,52,0.055)] sm:mt-12">
        <div className="grid lg:grid-cols-[20rem_minmax(0,1fr)]">
          <div className="border-b border-[#dce1eb] bg-white p-4 sm:p-5 lg:border-b-0 lg:border-r lg:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-[#e4e8f0] pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#687080]">Recorrido guiado</p>
              <span className="rounded-full bg-[#eef1ff] px-2.5 py-1 text-xs font-semibold text-primary">
                {activeStep + 1} / {steps.length}
              </span>
            </div>

            <div className="mt-3 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
              {steps.map((step, index) => {
                const Icon = step.Icon;
                const isActive = index === activeStep;

                return (
                  <button
                    key={step.label}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveStep(index)}
                    className={`group flex min-h-16 w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      isActive
                        ? "bg-[#171a29] text-white shadow-[0_8px_20px_rgba(23,26,41,0.16)]"
                        : "text-[#4d5568] hover:bg-[#f4f6fb]"
                    }`}
                  >
                    <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg ${isActive ? "bg-white/[0.12] text-[#aeb8ff]" : "bg-[#eef1ff] text-primary"}`}>
                      <Icon className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold tracking-[0.02em] opacity-70">0{index + 1}</span>
                      <span className="mt-0.5 block text-sm font-semibold leading-5">{step.label}</span>
                    </span>
                    <ChevronRight className={`h-4 w-4 flex-none transition-transform ${isActive ? "translate-x-0 text-white" : "-translate-x-1 text-[#a2a9b8] group-hover:translate-x-0"}`} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-w-0 p-3 sm:p-5 lg:p-6">
            <figure aria-live="polite">
              <div className="overflow-hidden rounded-[18px] border border-[#d7ddea] bg-[#eef1f5] shadow-[0_20px_48px_rgba(24,30,52,0.12)]">
                <div className={`relative overflow-hidden bg-[#eef1f5] ${aspectClasses[active.aspect ?? "standard"]}`}>
                  {active.visual}
                  <div
                    className="pointer-events-none absolute z-10 rounded-lg border-2 border-[#6475ff] bg-white/[0.03] shadow-[0_0_0_5px_rgba(255,255,255,0.72),0_0_20px_rgba(81,101,255,0.5)]"
                    style={focusStyle}
                    aria-hidden="true"
                  >
                    <span className="absolute -left-2.5 -top-2.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-bold text-white shadow-sm">
                      {activeStep + 1}
                    </span>
                    <span
                      className={`absolute left-0 whitespace-nowrap rounded-full bg-[#171a29] px-3 py-1.5 text-[11px] font-semibold tracking-[0.01em] text-white shadow-[0_8px_18px_rgba(23,26,41,0.2)] ${
                        active.focus.labelPosition === "bottom" ? "-bottom-10" : "-top-10"
                      }`}
                    >
                      {active.focus.label}
                    </span>
                  </div>
                </div>
              </div>

              <figcaption className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(13rem,0.8fr)] sm:items-end">
                <div>
                  <p className="text-sm font-semibold text-primary">Paso {activeStep + 1} · {active.label}</p>
                  <h3 className="mt-2 text-balance text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#202231]">{active.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-[#62697a]">{active.description}</p>
                </div>
                <div className="rounded-xl border border-[#d8def0] bg-white px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Mira en pantalla</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#41495c]">{active.focus.copy}</p>
                  <p className="mt-3 border-t border-[#e5e8f1] pt-3 text-sm leading-6 text-[#62697a]">
                    <span className="font-semibold text-[#41495c]">Resultado: </span>
                    {active.outcome}
                  </p>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
