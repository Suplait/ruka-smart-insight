import { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { CalendlyPreview } from "@/components/onboarding-v2/CalendlyPreview";
import { CalendlyStageView } from "@/components/onboarding-v2/CalendlyStageView";
import { getVolumeLabel } from "@/components/onboarding-v2/onboardingV2Data";
import { VolumeStepView } from "@/components/onboarding-v2/VolumeStepView";

const HIGH_VOLUME_THRESHOLD = 150;

export function OnboardingReviewFlow() {
  const navigate = useNavigate();
  const [selectedCount, setSelectedCount] = useState(75);
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);

  const handleContinue = async () => {
    setIsLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    setIsLoading(false);
    setShowCalendly(true);
  };

  if (showCalendly) {
    const isHighVolume = selectedCount >= HIGH_VOLUME_THRESHOLD;

    return (
      <>
        <Helmet>
          <title>Agenda tu llamada | Ruka.ai</title>
        </Helmet>
        <CalendlyStageView
          volumeLabel={getVolumeLabel(selectedCount)}
          isReview
          reviewDetail={isHighVolume ? "Calendly high" : "Calendly low"}
        >
          <CalendlyPreview
            onBack={() => setShowCalendly(false)}
            onSimulateBooking={() => navigate("/calendly-success?onboardingDebug=1")}
          />
        </CalendlyStageView>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Antes de agendar | Ruka.ai</title>
      </Helmet>
      <VolumeStepView
        selectedCount={selectedCount}
        onChange={setSelectedCount}
        onContinue={handleContinue}
        isLoading={isLoading}
        isReview
      />
    </>
  );
}
