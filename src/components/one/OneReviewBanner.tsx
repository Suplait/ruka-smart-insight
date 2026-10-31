import { Eye } from "lucide-react";
import type { OneDebugStage } from "@/utils/oneDebug";
import { cn } from "@/lib/utils";

const stages: { value: OneDebugStage; label: string }[] = [
  { value: "form", label: "Form" },
  { value: "calendar", label: "Calendar" },
  { value: "success", label: "Success" },
];

export function OneReviewBanner({ stage, onStageChange }: { stage: OneDebugStage; onStageChange: (stage: OneDebugStage) => void }) {
  return (
    <aside className="sticky top-0 z-[70] border-b border-[var(--one-hair-strong)] bg-[#0d1124] px-4 py-2.5 text-white" aria-label="Modo de revisión">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold sm:justify-between sm:text-sm">
        <span className="inline-flex items-center gap-2"><Eye className="h-4 w-4 text-[var(--one-accent)]" /> MODO REVISIÓN <span className="font-medium text-[var(--one-muted)]">· Sin side effects</span></span>
        <div className="flex rounded-full border border-[var(--one-hair-strong)] bg-[#070a16] p-1" role="group" aria-label="Etapa de revisión">
          {stages.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onStageChange(item.value)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]",
                stage === item.value ? "bg-[hsl(var(--primary))] text-white" : "text-[var(--one-soft)] hover:bg-white/10",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
