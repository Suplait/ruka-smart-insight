import type { LucideIcon } from "lucide-react";
import {
  ArrowDownRight,
  ArrowRight,
  Braces,
  Check,
  Database,
  FileSpreadsheet,
  Landmark,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

export type Outcome = {
  label: string;
  detail?: string;
};

export type WorkItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type Integration = {
  name: string;
  logo?: string;
  icon?: "erp" | "bank" | "excel" | "system";
};

type HeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  outcomes: Outcome[];
  onCtaClick: () => void;
};

export function AcquisitionHero({ eyebrow, title, description, outcomes, onCtaClick }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = typeof window !== "undefined" && !reduceMotion;

  return (
    <motion.header
      initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="space-y-8"
    >
      <div className="space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.055] px-3.5 py-2 text-xs font-semibold tracking-[0.08em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          {eyebrow}
        </div>
        <h1 className="max-w-[13ch] text-[2.65rem] font-semibold leading-[0.98] tracking-[-0.055em] text-[#171827] sm:text-6xl lg:text-[4.25rem]">
          {title}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[#62697a] sm:text-xl sm:leading-9">
          {description}
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Button
          size="lg"
          onClick={onCtaClick}
          className="h-12 w-full rounded-full px-6 text-base font-semibold shadow-[0_10px_28px_rgba(82,99,235,0.22)] transition-transform hover:-translate-y-0.5 sm:w-auto"
        >
          Agendar 30 min <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <span className="text-sm text-[#7a8190]">Cuéntanos tu proceso · Sin preparación</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#dde2ed] bg-white shadow-[0_18px_55px_rgba(24,30,52,0.055)]">
        <div className="flex items-center justify-between border-b border-[#e7eaf1] bg-[#fafbfe] px-4 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7b8291]">Trabajo terminado</span>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d7dbe5]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#d7dbe5]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
          </div>
        </div>
        <div className="divide-y divide-[#e7eaf1]">
          {outcomes.map((outcome, index) => (
            <motion.div
              key={outcome.label}
              initial={shouldAnimate ? { opacity: 0, x: -10 } : false}
              animate={shouldAnimate ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.38, delay: 0.18 + index * 0.07 }}
              className="group flex items-center gap-3 px-4 py-4 sm:px-5"
            >
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-primary/[0.08] text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-[#242634]">{outcome.label}</p>
                {outcome.detail && <p className="mt-0.5 text-sm text-[#777e8e]">{outcome.detail}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.header>
  );
}

type WorkSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  items: WorkItem[];
};

export function AcquisitionWorkSection({
  eyebrow = "Trabajo operativo",
  title,
  description,
  items,
}: WorkSectionProps) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = typeof window !== "undefined" && !reduceMotion;

  return (
    <section className="space-y-8" aria-labelledby="acquisition-work-title">
      <header className="max-w-2xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h2 id="acquisition-work-title" className="text-3xl font-semibold tracking-[-0.04em] text-[#171827] sm:text-4xl">
          {title}
        </h2>
        {description && <p className="text-base leading-7 text-[#687080]">{description}</p>}
      </header>

      <div className="overflow-hidden rounded-2xl border border-[#dce1eb] bg-[#dce1eb] shadow-[0_18px_60px_rgba(24,30,52,0.05)]">
        <div className="grid gap-px sm:grid-cols-2">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
                whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                className={`group min-h-52 bg-white p-6 transition-colors hover:bg-[#fbfcff] sm:p-7 ${
                  items.length % 2 === 1 && index === items.length - 1 ? "sm:col-span-2" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef1ff] text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <span className="font-mono text-xs text-[#a0a6b3]">0{index + 1}</span>
                </div>
                <h3 className="mt-8 text-xl font-semibold tracking-[-0.025em] text-[#202231]">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-[#687080]">{item.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type ProcessSectionProps = {
  title: string;
  steps: Array<{ title: string; description: string }>;
};

export function AcquisitionProcessSection({ title, steps }: ProcessSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl bg-[#171a29] text-white shadow-[0_24px_65px_rgba(18,21,36,0.14)]">
      <div className="border-b border-white/10 px-6 py-7 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#aeb8ff]">La conversación</p>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.04em]">{title}</h2>
      </div>
      <div className="divide-y divide-white/10">
        {steps.map((step, index) => (
          <div key={step.title} className="grid gap-3 px-6 py-6 sm:grid-cols-[2rem_1fr] sm:px-8">
            <span className="font-mono text-xs text-[#8996f5]">0{index + 1}</span>
            <div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm leading-6 text-white/62">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function GenericIntegrationIcon({ type }: { type: NonNullable<Integration["icon"]> }) {
  const icons = {
    erp: Database,
    bank: Landmark,
    excel: FileSpreadsheet,
    system: Braces,
  };
  const Icon = icons[type];
  return <Icon className="h-5 w-5" strokeWidth={1.7} />;
}

export function AcquisitionIntegrations({ integrations }: { integrations: Integration[] }) {
  return (
    <section className="space-y-7" aria-labelledby="acquisition-integrations-title">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Sin cambiar tus sistemas</p>
        <h2 id="acquisition-integrations-title" className="max-w-xl text-3xl font-semibold tracking-[-0.04em] text-[#171827] sm:text-4xl">
          Trabaja sobre los sistemas que ya usa tu operación.
        </h2>
      </header>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="flex min-h-24 items-center justify-center rounded-2xl border border-[#dde2ed] bg-white px-4 py-5 shadow-[0_10px_30px_rgba(24,30,52,0.035)]"
          >
            {integration.logo ? (
              <img
                src={integration.logo}
                alt={integration.name}
                className="max-h-9 max-w-[100px] object-contain"
                loading="lazy"
              />
            ) : (
              <div className="flex items-center gap-2 text-sm font-semibold text-[#414656]">
                <span className="text-primary">
                  <GenericIntegrationIcon type={integration.icon ?? "system"} />
                </span>
                {integration.name}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function AcquisitionSystemNote({ title, description }: { title: string; description: string }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-primary/15 bg-[#eef1ff] px-6 py-8 sm:px-8">
      <ArrowDownRight className="absolute right-6 top-6 h-6 w-6 text-primary/45" aria-hidden="true" />
      <p className="max-w-xl text-2xl font-semibold tracking-[-0.035em] text-[#202231]">{title}</p>
      <p className="mt-3 max-w-xl text-base leading-7 text-[#62697a]">{description}</p>
    </section>
  );
}
