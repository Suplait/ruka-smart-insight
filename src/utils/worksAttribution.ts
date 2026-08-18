import { getStoredUTMParams } from "@/utils/utmTracker";

const WORKS_UTM_STORAGE_KEY = "ruka_works_utm_params";

export type WorksAttribution = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
};

const emptyAttribution: WorksAttribution = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  utm_term: null,
};

export function captureWorksAttribution(search: string): WorksAttribution {
  if (typeof window === "undefined") return emptyAttribution;

  const params = new URLSearchParams(search);
  const current: WorksAttribution = {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
    utm_term: params.get("utm_term"),
  };
  const hasCurrentAttribution = Object.values(current).some(Boolean);

  if (hasCurrentAttribution) {
    window.localStorage.setItem(WORKS_UTM_STORAGE_KEY, JSON.stringify(current));
    return current;
  }

  try {
    const stored = window.localStorage.getItem(WORKS_UTM_STORAGE_KEY);
    if (stored) return { ...emptyAttribution, ...JSON.parse(stored) };
  } catch {
    // A blocked storage API should never stop the conversion path.
  }

  const globalAttribution = getStoredUTMParams();
  return { ...emptyAttribution, ...globalAttribution };
}
