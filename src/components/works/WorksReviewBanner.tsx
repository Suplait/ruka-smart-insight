import { Eye } from "lucide-react";
import type { WorksDebugStage } from "@/utils/worksDebug";
import { cn } from "@/lib/utils";

const stages: { value: WorksDebugStage; label: string }[] = [
  { value: "form", label: "Form" },
  { value: "calendar", label: "Calendar" },
  { value: "success", label: "Success" },
];

export function WorksReviewBanner({ stage, onStageChange }: { stage: WorksDebugStage; onStageChange: (stage: WorksDebugStage) => void }) {
  return (
    <aside className="sticky top-0 z-[70] border-b border-[#cbd3ff] bg-[#eef0ff] px-4 py-2.5 text-[#232b52]" aria-label="Modo de revisión">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold sm:justify-between sm:text-sm">
        <span className="inline-flex items-center gap-2"><Eye className="h-4 w-4 text-[#5369eb]" /> MODO REVISIÓN <span className="font-medium text-[#626b86]">· Sin side effects</span></span>
        <div className="flex rounded-full border border-[#ccd3f5] bg-white p-1" role="group" aria-label="Etapa de revisión">
          {stages.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onStageChange(item.value)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5369eb]",
                stage === item.value ? "bg-[#5369eb] text-white" : "text-[#5d6682] hover:bg-[#f1f3fb]",
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
