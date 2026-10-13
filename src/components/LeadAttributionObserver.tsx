import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureLeadAttribution } from "@/utils/leadAttribution";
import { leadTraceabilityEnabled } from "@/services/leadIntake";

/** Observe navigation separately from all existing tracking listeners. */
export function LeadAttributionObserver() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    if (leadTraceabilityEnabled()) captureLeadAttribution();
  }, [pathname, search]);
  return null;
}
