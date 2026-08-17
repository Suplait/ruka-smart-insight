import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import CalendlySuccessContent from "@/components/calendly/CalendlySuccessContent";
import { isOnboardingDebugEnabledFromSearch } from "@/utils/onboardingDebug";

const CalendlySuccess = () => {
  const location = useLocation();
  const isReview = isOnboardingDebugEnabledFromSearch(location.search);

  return (
    <>
      <Helmet>
        <title>Llamada agendada | Ruka.ai</title>
      </Helmet>
      <CalendlySuccessContent isReview={isReview} />
    </>
  );
};

export default CalendlySuccess;
