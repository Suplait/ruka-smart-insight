import { getStoredUTMParams } from "@/utils/utmTracker";

const ONE_UTM_STORAGE_KEY = "ruka_one_utm_params";
const LEGACY_ONE_UTM_STORAGE_KEY = "ruka_works_utm_params";

export type OneAttribution = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
};

const emptyAttribution: OneAttribution = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  utm_term: null,
};

export function captureOneAttribution(search: string): OneAttribution {
  if (typeof window === "undefined") return emptyAttribution;

  const params = new URLSearchParams(search);
  const current: OneAttribution = {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
    utm_term: params.get("utm_term"),
  };
  const hasCurrentAttribution = Object.values(current).some(Boolean);

  if (hasCurrentAttribution) {
    window.localStorage.setItem(ONE_UTM_STORAGE_KEY, JSON.stringify(current));
    return current;
  }

  try {
    let stored = window.localStorage.getItem(ONE_UTM_STORAGE_KEY);
    if (!stored) {
      const legacy = window.localStorage.getItem(LEGACY_ONE_UTM_STORAGE_KEY);
      if (legacy) {
        window.localStorage.setItem(ONE_UTM_STORAGE_KEY, legacy);
        window.localStorage.removeItem(LEGACY_ONE_UTM_STORAGE_KEY);
        stored = legacy;
      }
    }
    if (stored) return { ...emptyAttribution, ...JSON.parse(stored) };
  } catch {
    // A blocked storage API should never stop the conversion path.
  }

  const globalAttribution = getStoredUTMParams();
  return { ...emptyAttribution, ...globalAttribution };
}
