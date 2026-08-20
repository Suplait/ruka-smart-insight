export type WorksVisualLabState = "idle" | "focus" | "valid";

export type WorksVisualLabSceneProps = {
  state: WorksVisualLabState;
  paused: boolean;
};

export function getForcedVisualLabState(search: string): WorksVisualLabState | null {
  const value = new URLSearchParams(search).get("state");
  return value === "idle" || value === "focus" || value === "valid" ? value : null;
}
