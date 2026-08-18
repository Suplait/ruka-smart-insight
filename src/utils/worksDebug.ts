export const WORKS_DEBUG_QUERY_PARAM = "worksDebug";

export type WorksDebugStage = "form" | "calendar" | "success";

export function isWorksDebugEnabled(search = "") {
  return new URLSearchParams(search).get(WORKS_DEBUG_QUERY_PARAM) === "1";
}

export function getWorksDebugStage(search = ""): WorksDebugStage {
  const stage = new URLSearchParams(search).get("stage");
  return stage === "calendar" || stage === "success" ? stage : "form";
}
