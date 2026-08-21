export const ONE_DEBUG_QUERY_PARAM = "oneDebug";
const LEGACY_ONE_DEBUG_QUERY_PARAM = "worksDebug";

export type OneDebugStage = "form" | "calendar" | "success";

export function isOneDebugEnabled(search = "") {
  const params = new URLSearchParams(search);
  return params.get(ONE_DEBUG_QUERY_PARAM) === "1"
    || params.get(LEGACY_ONE_DEBUG_QUERY_PARAM) === "1";
}

export function getOneDebugStage(search = ""): OneDebugStage {
  const stage = new URLSearchParams(search).get("stage");
  return stage === "calendar" || stage === "success" ? stage : "form";
}
