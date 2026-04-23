import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, Loader, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { pushToDataLayer } from "@/utils/dataLayer";
import { notifySlackOnboardingStep } from "@/utils/slackNotifier";
import StepIndicator from "@/components/onboarding/StepIndicator";
import InvoiceCountSelector from "@/components/onboarding/InvoiceCountSelector";
import CalendlyIntegration from "@/components/onboarding/CalendlyIntegration";
import CalendlyIntegrationLow from "@/components/onboarding/CalendlyIntegrationLow";
import InvoiceVolumeInfo from "@/components/onboarding/InvoiceVolumeInfo";

const HIGH_VOLUME_THRESHOLD = 150;
const TOTAL_STEPS = 1;

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

const OnboardingSuccess = () => {
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
    if (count === 75) return "Menos de 150 facturas";
    if (count === 225) return "150 a 300 facturas";
    if (count === 450) return "300 a 600 facturas";
    if (count === 750) return "Más de 600 facturas";
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

        <main className="relative flex min-h-screen flex-col lg:flex-row">
          <div className="hidden overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 p-6 lg:flex lg:w-1/2 lg:flex-col xl:p-8">
            <div className="mx-auto flex max-w-md flex-1 flex-col justify-center">
              <div className="relative mb-6 h-10 w-auto">
                <img src="/logo.png" alt="Ruka.ai" className="h-10 w-auto object-contain object-left" />
              </div>
              <h2 className="mb-4 text-2xl font-bold xl:text-3xl">¡Perfecto! Tu volumen requiere atención personalizada</h2>
              <p className="mb-6 text-sm text-slate-600 xl:text-base">
                Con más de 150 facturas mensuales, te derivamos directo a una llamada personalizada.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Configuración personalizada</h3>
                    <p className="text-sm text-slate-600">Ajustamos la implementación a tu operación y volumen.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Coordinación directa</h3>
                    <p className="text-sm text-slate-600">Te mostramos la mejor manera de partir sin pasos intermedios extra.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center overflow-auto bg-white p-4 md:p-6 lg:p-8 xl:p-12">
            <div className="w-full max-w-4xl">
              <CalendlyIntegration leadData={renderCalendlyLeadData()} />
            </div>
          </div>
        </main>
      </>;
  }

  if (showCalendlyLow) {
    return <>
        <Helmet>
          <title>Agenda tu configuración | Ruka.ai</title>
        </Helmet>

        <main className="relative flex min-h-screen flex-col lg:flex-row">
          <div className="hidden overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 p-6 lg:flex lg:w-1/2 lg:flex-col xl:p-8">
            <div className="mx-auto flex max-w-md flex-1 flex-col justify-center">
              <div className="relative mb-6 h-10 w-auto">
                <img src="/logo.png" alt="Ruka.ai" className="h-10 w-auto object-contain object-left" />
              </div>
              <h2 className="mb-4 text-2xl font-bold xl:text-3xl">¡Excelente! Configuremos tu plataforma</h2>
              <p className="mb-6 text-sm text-slate-600 xl:text-base">
                Te mostraremos una sesión corta para dejar tu implementación bien encaminada.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Configuración guiada</h3>
                    <p className="text-sm text-slate-600">Te acompañamos paso a paso sin pedir datos sensibles en el sitio.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Proceso eficiente</h3>
                    <p className="text-sm text-slate-600">Solo necesitamos la información básica para llevarte al calendario correcto.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center overflow-auto bg-white p-4 md:p-6 lg:p-8 xl:p-12">
            <div className="w-full max-w-4xl">
              <CalendlyIntegrationLow leadData={renderCalendlyLeadData()} />
            </div>
          </div>
        </main>
      </>;
  }

  const stepIcon = <Receipt className="h-6 w-6 text-primary" />;
  const stepTitle = "Volumen de facturas";
  const stepDescription = "¿Cuántas facturas de compra recibes cada mes?";

  return <>
      <Helmet>
        <title>Coordinemos tu implementación | Ruka.ai</title>
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
          <div className="hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center lg:p-10">
            <InvoiceVolumeInfo />
          </div>

          <div className="flex flex-1 items-center justify-center p-4 md:p-6 lg:p-10">
            <div className="w-full max-w-xl">
              <Card className="border shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <div className="mb-8 flex justify-center lg:hidden">
                    <img src="/logo.png" alt="Ruka.ai" className="h-9 w-auto object-contain" />
                  </div>

                  <StepIndicator currentStep={0} totalSteps={TOTAL_STEPS} />

                  <div className="space-y-3 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      {stepIcon}
                    </div>
                    <h1 className="text-2xl font-semibold">{stepTitle}</h1>
                    <p className="text-sm text-muted-foreground sm:text-base">{stepDescription}</p>
                    {leadData.nombreRestaurante && <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        {leadData.nombreRestaurante}
                      </p>}
                  </div>

                  <div className="mt-8">
                    <InvoiceCountSelector selectedCount={formData.facturas} onChange={count => updateFormData("facturas", count)} />
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button type="button" onClick={handleNext} disabled={isLoading} className="gap-2">
                      {isLoading ? <>
                          <Loader className="h-4 w-4 animate-spin" />
                          Guardando...
                        </> : <>
                          Continuar
                          <ArrowRight className="h-4 w-4" />
                        </>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>;
};

export default OnboardingSuccess;
