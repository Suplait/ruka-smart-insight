import { Pause, Play } from "lucide-react";
import type { WorksVisualLabState } from "@/components/works/visual-lab/visualLabTypes";

export function WorksVisualLabControls({
  forcedState,
  currentState,
  paused,
  submitSimulated,
  onStateChange,
  onPauseChange,
}: {
  forcedState: WorksVisualLabState | null;
  currentState: WorksVisualLabState;
  paused: boolean;
  submitSimulated: boolean;
  onStateChange: (state: WorksVisualLabState | null) => void;
  onPauseChange: (paused: boolean) => void;
}) {
  return (
    <aside
      aria-label="Visual Lab controls"
      className="fixed bottom-3 left-1/2 z-50 w-[min(calc(100vw-1.5rem),68rem)] -translate-x-1/2 overflow-x-auto rounded-xl bg-[#171827]/95 px-3 py-2 text-white shadow-[0_6px_14px_rgba(23,24,39,0.22)] backdrop-blur-md"
    >
      <div className="flex min-w-max items-center gap-2">
        <span className="mr-1 text-[10px] font-bold tracking-[0.16em] text-[#aeb6cb]">VISUAL LAB</span>
        <ControlDivider />
        <span className="rounded-md bg-white/8 px-2.5 py-1 text-[11px] font-semibold text-white">Birds · Reynolds Boids</span>
        <ControlDivider />
        <LabButton active={forcedState === null} onClick={() => onStateChange(null)}>
          {forcedState === null ? `Auto · ${currentState[0].toUpperCase()}${currentState.slice(1)}` : "Auto"}
        </LabButton>
        {(["idle", "focus", "valid"] as const).map((state) => (
          <LabButton key={state} active={forcedState === state} onClick={() => onStateChange(state)}>
            {state[0].toUpperCase() + state.slice(1)}
          </LabButton>
        ))}
        <ControlDivider />
        <LabButton active={paused} onClick={() => onPauseChange(!paused)}>
          {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          {paused ? "Play" : "Pause"}
        </LabButton>
        {submitSimulated ? <span role="status" className="ml-1 text-[11px] font-semibold text-[#aebcff]">Submit simulado</span> : null}
      </div>
    </aside>
  );
}

function LabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-[11px] font-semibold transition-[background-color,color,transform] duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8da0ff] ${active ? "bg-[#6579ef] text-white" : "text-[#c7ccda] hover:bg-white/10 hover:text-white"}`}
    >
      {children}
    </button>
  );
}

function ControlDivider() {
  return <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-white/14" />;
}
