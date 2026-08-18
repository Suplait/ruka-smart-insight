import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { pushToDataLayer } from "@/utils/dataLayer";
import { notifySlackOnboardingStep } from "@/utils/slackNotifier";
import CalendlyIntegration from "@/components/onboarding/CalendlyIntegration";
import CalendlyIntegrationLow from "@/components/onboarding/CalendlyIntegrationLow";
import { CalendlyStageView } from "@/components/onboarding-v2/CalendlyStageView";
import { OnboardingReviewFlow } from "@/components/onboarding-v2/OnboardingReviewFlow";
import { VolumeStepView } from "@/components/onboarding-v2/VolumeStepView";
import { isOnboardingDebugEnabledFromSearch } from "@/utils/onboardingDebug";

const HIGH_VOLUME_THRESHOLD = 150;

type OnboardingLocationState = {
  leadId?: number;
  restaurantName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  ciudad?: string;
  whatsapp?: string;
};

type LeadData = {
  firstName: string;
  lastName: string;
  email: string;
  ciudad: string;
  whatsapp: string;
  nombreRestaurante: string;
};

type FormData = {
  facturas: number;
};

const OnboardingProductionFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as OnboardingLocationState | null) ?? {};
  const leadId = locationState.leadId;
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [showCalendlyLow, setShowCalendlyLow] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({
    firstName: locationState.firstName ?? "",
    lastName: locationState.lastName ?? "",
    email: locationState.email ?? "",
    ciudad: locationState.ciudad ?? "",
    whatsapp: locationState.whatsapp ?? "",
    nombreRestaurante: locationState.restaurantName ?? ""
  });
  const [formData, setFormData] = useState<FormData>({
    facturas: 75
  });

  useEffect(() => {
    if (!leadId) {
      toast({
        title: "Error",
        description: "No pudimos cargar tu registro. Intenta nuevamente.",
        variant: "destructive"
      });
      navigate("/restaurantes", {
        replace: true
      });
    }
  }, [leadId, navigate]);

  useEffect(() => {
    if (!leadId) return;

    pushToDataLayer("onboarding_page_view", {
      leadId,
      restaurantName: locationState.restaurantName ?? ""
    });
  }, [leadId, locationState.restaurantName]);

  useEffect(() => {
    if (!leadId) return;

    const fetchLeadData = async () => {
      const {
        data: lead,
        error
      } = await supabase.from("leads").select("first_name, last_name, email, ccity, whatsapp, company_name, name").eq("id", leadId).single();

      if (error || !lead) {
        return;
      }

      const fallbackNameParts = typeof lead.name === "string" ? lead.name.split(" ") : [];
      const firstName = lead.first_name || leadData.firstName || fallbackNameParts[0] || "";
      const lastName = lead.last_name || leadData.lastName || fallbackNameParts.slice(1).join(" ") || "";

      setLeadData({
        firstName,
        lastName,
        email: lead.email || leadData.email,
        ciudad: lead.ccity || leadData.ciudad,
        whatsapp: typeof lead.whatsapp === "string" ? lead.whatsapp.replace(/^\+56/, "") : leadData.whatsapp,
        nombreRestaurante: lead.company_name || leadData.nombreRestaurante
      });
    };

    void fetchLeadData();
  }, [leadId, leadData.ciudad, leadData.email, leadData.firstName, leadData.lastName, leadData.nombreRestaurante, leadData.whatsapp]);

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getRangeLabel = (count: number) => {
    if (count === 75) return "Start · Hasta 200 facturas";
    if (count === 225) return "Core · Hasta 500 facturas";
    if (count === 450) return "Scale · Hasta 1.200 facturas";
    if (count === 750) return "A medida · Más de 1.200 facturas";
    return `${count} facturas`;
  };

  const updateLead = async (updateData: Record<string, string | number | boolean | null>) => {
    if (!leadId) return false;

    const response = await supabase.functions.invoke("update-lead", {
      body: {
        leadId: Number(leadId),
        updateData
      }
    });

    if (response.error || !response.data?.success) {
      toast({
        title: "Error",
        description: "No pudimos guardar tu información. Intenta nuevamente.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const saveInvoiceData = async () => {
    const requiresCalendly = formData.facturas >= HIGH_VOLUME_THRESHOLD;
    const saved = await updateLead({
      facturas_compra_mes: formData.facturas,
      requires_calendly: requiresCalendly
    });

    if (!saved || !leadId) return false;

    pushToDataLayer("onboarding_step_1_invoices", {
      leadId: Number(leadId),
      step: 1,
      stepName: "invoice-count-selected",
      facturas_compra_mes: formData.facturas,
      requires_calendly: requiresCalendly,
      range_label: getRangeLabel(formData.facturas)
    });

    notifySlackOnboardingStep(Number(leadId), "invoice-count-selected", {
      facturas_compra_mes: formData.facturas,
      requires_calendly: requiresCalendly
    });

    return true;
  };

  const handleNext = async () => {
    setIsLoading(true);
    const saved = await saveInvoiceData();
    setIsLoading(false);

    if (!saved) return;

    if (formData.facturas >= HIGH_VOLUME_THRESHOLD) {
      setShowCalendly(true);
      return;
    }

    setShowCalendlyLow(true);
  };

  const renderCalendlyLeadData = () => ({
    firstName: leadData.firstName,
    lastName: leadData.lastName,
    email: leadData.email,
    restaurantName: leadData.nombreRestaurante,
    invoiceCount: formData.facturas,
    whatsapp: leadData.whatsapp
  });

  if (showCalendly) {
    return <>
        <Helmet>
          <title>Agenda tu llamada | Ruka.ai</title>
        </Helmet>

        <CalendlyStageView volumeLabel={getRangeLabel(formData.facturas)}>
          <CalendlyIntegration leadData={renderCalendlyLeadData()} />
        </CalendlyStageView>
      </>;
  }

  if (showCalendlyLow) {
    return <>
        <Helmet>
          <title>Agenda tu llamada | Ruka.ai</title>
        </Helmet>

        <CalendlyStageView volumeLabel={getRangeLabel(formData.facturas)}>
          <CalendlyIntegrationLow leadData={renderCalendlyLeadData()} />
        </CalendlyStageView>
      </>;
  }

  return <>
      <Helmet>
        <title>Antes de agendar | Ruka.ai</title>
      </Helmet>

      <VolumeStepView
        selectedCount={formData.facturas}
        onChange={count => updateFormData("facturas", count)}
        onContinue={handleNext}
        isLoading={isLoading}
      />
    </>;
};

const OnboardingSuccess = () => {
  const location = useLocation();

  if (isOnboardingDebugEnabledFromSearch(location.search)) {
    return <OnboardingReviewFlow />;
  }

  return <OnboardingProductionFlow />;
};

export default OnboardingSuccess;
