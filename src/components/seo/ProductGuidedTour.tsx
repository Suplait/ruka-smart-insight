import { useId, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Eye, type LucideIcon } from "lucide-react";

export type ProductGuidedTourStep = {
  label: string;
  title: string;
  description: string;
  outcome: string;
  focus: { label: string; copy: string };
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
  cinema: "aspect-[4/3] sm:aspect-video",
};

export function ProductGuidedTour({ heading, intro, steps }: ProductGuidedTourProps) {
  const [activeStep, setActiveStep] = useState(0);
  const active = steps[activeStep];
  const tabsId = useId();

  const selectStep = (index: number) => setActiveStep((index + steps.length) % steps.length);

  return (
    <section className="border-y border-[#dce1eb] bg-white px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="product-tour-title">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-sm font-semibold text-primary">Producto en acción</p>
            <h2 id="product-tour-title" className="mt-3 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#171827] sm:text-4xl">{heading}</h2>
          </div>
          <p className="max-w-2xl text-pretty text-lg leading-8 text-[#596176] lg:justify-self-end">{intro}</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[#d8deea] bg-[#f6f7fb] sm:mt-12">
          <div className="flex items-center justify-between border-b border-[#dfe4ed] bg-white px-4 py-3.5 sm:px-6">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#30a875] opacity-30 motion-reduce:hidden" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#30a875]" />
              </span>
              <span className="text-sm font-semibold text-[#40485b]">Recorrido de producto</span>
            </div>
            <span className="font-mono text-xs font-semibold tabular-nums text-[#747d90]">{String(activeStep + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>
          </div>

          <div className="border-b border-[#dfe4ed] bg-white">
            <div className="scrollbar-hide flex overflow-x-auto px-2 sm:px-4" role="tablist" aria-label="Pasos del recorrido">
              {steps.map((step, index) => {
                const Icon = step.Icon;
                const isActive = index === activeStep;
                const tabId = `${tabsId}-tab-${index}`;
                const panelId = `${tabsId}-panel-${index}`;
                return (
                  <button
                    key={step.label}
                    id={tabId}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={panelId}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => selectStep(index)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowRight") selectStep(activeStep + 1);
                      if (event.key === "ArrowLeft") selectStep(activeStep - 1);
                    }}
                    className={`group relative flex min-w-[10rem] flex-1 items-center gap-3 px-3 py-4 text-left focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:min-w-[11rem] sm:px-4 ${isActive ? "text-[#171827]" : "text-[#7a8293] hover:text-[#3e4658]"}`}
                  >
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors duration-200 ${isActive ? "bg-[#171a29] text-white" : "bg-[#f1f3f8] text-[#737c90] group-hover:bg-[#e9ecf3]"}`}>
                      <Icon className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[10px] font-semibold tracking-[0.08em] text-primary">0{index + 1}</span>
                      <span className="mt-0.5 block text-sm font-semibold leading-5">{step.label}</span>
                    </span>
                    <span className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary transition-transform duration-200 ${isActive ? "scale-x-100" : "scale-x-0"}`} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>

          <div key={activeStep} id={`${tabsId}-panel-${activeStep}`} role="tabpanel" aria-labelledby={`${tabsId}-tab-${activeStep}`} className="grid animate-in fade-in-0 duration-300 lg:grid-cols-[minmax(0,1fr)_21rem]">
            <div className="min-w-0 border-b border-[#dfe4ed] p-3 sm:p-5 lg:border-b-0 lg:border-r lg:p-6">
              <div className="overflow-hidden rounded-xl bg-white shadow-[0_10px_28px_rgba(29,38,72,0.12)]">
                <div className="flex h-10 items-center gap-1.5 border-b border-[#e2e6ee] bg-[#fbfcfe] px-4" aria-hidden="true">
                  <span className="h-2 w-2 rounded-full bg-[#d2d7e1]" />
                  <span className="h-2 w-2 rounded-full bg-[#d2d7e1]" />
                  <span className="h-2 w-2 rounded-full bg-[#d2d7e1]" />
                  <span className="mx-auto h-5 w-36 rounded-md border border-[#e3e6ed] bg-white sm:w-52" />
                  <span className="w-5" />
                </div>
                <div className={`relative overflow-hidden bg-[#eef1f5] ${aspectClasses[active.aspect ?? "standard"]}`}>{active.visual}</div>
              </div>
            </div>

            <aside className="flex flex-col bg-white p-6 sm:p-8 lg:min-h-full" aria-live="polite">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-primary">Paso {String(activeStep + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-balance text-2xl font-semibold leading-[1.12] tracking-[-0.03em] text-[#202231]">{active.title}</h3>
                <p className="mt-4 text-[15px] leading-7 text-[#626a7c]">{active.description}</p>
              </div>

              <div className="mt-6 rounded-2xl bg-[#eef1ff] p-4">
                <div className="flex items-center gap-2 text-primary">
                  <Eye className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  <p className="text-xs font-semibold uppercase tracking-[0.08em]">{active.focus.label}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#46516d]">{active.focus.copy}</p>
              </div>

              <div className="mt-5 flex items-start gap-3 border-t border-[#e5e8ef] pt-5">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#e7f7ef] text-[#17805e]"><Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" /></span>
                <p className="text-sm leading-6 text-[#4f586b]"><span className="font-semibold text-[#252838]">Resultado. </span>{active.outcome}</p>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 pt-8">
                <button type="button" onClick={() => selectStep(activeStep - 1)} className="grid h-10 w-10 place-items-center rounded-full border border-[#d9dee8] bg-white text-[#5e6678] transition-[border-color,color,transform] duration-200 hover:border-[#aeb8ff] hover:text-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Paso anterior"><ArrowLeft className="h-4 w-4" aria-hidden="true" /></button>
                <button type="button" onClick={() => selectStep(activeStep + 1)} className="group inline-flex h-10 items-center justify-center rounded-full bg-[#171a29] px-4 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-primary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Siguiente <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" /></button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
