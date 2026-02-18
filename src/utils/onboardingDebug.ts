export const ONBOARDING_DEBUG_QUERY_PARAM = "onboardingDebug";

export const isOnboardingDebugEnabledFromSearch = (search: string = ""): boolean => {
  const params = new URLSearchParams(search);
  return params.get(ONBOARDING_DEBUG_QUERY_PARAM) === "1";
};

