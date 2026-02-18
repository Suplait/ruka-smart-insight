import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader, Receipt, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Lead } from "@/types/supabase";
import { notifySlackOnboardingStep } from "@/utils/slackNotifier";
import { pushToDataLayer } from "@/utils/dataLayer";
import InvoiceCountSelector from "@/components/onboarding/InvoiceCountSelector";
import CalendlyIntegration from "@/components/onboarding/CalendlyIntegration";
import CalendlyIntegrationLow from "@/components/onboarding/CalendlyIntegrationLow";
import InvoiceVolumeInfo from "@/components/onboarding/InvoiceVolumeInfo";
import { supabase } from "@/integrations/supabase/client";
import { isOnboardingDebugEnabledFromSearch } from "@/utils/onboardingDebug";

type LeadData = {
  firstName: string;
  lastName: string;
  email: string;
  ciudad: string;
  whatsapp: string;
  nombreRestaurante: string;
};

const OnboardingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDebugMode = Boolean(location.state?.debugMode || isOnboardingDebugEnabledFromSearch(location.search));
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendlyHigh, setShowCalendlyHigh] = useState(false);
  const [showCalendlyLow, setShowCalendlyLow] = useState(false);
  const [invoiceCount, setInvoiceCount] = useState(75);

  const restaurantName = location.state?.restaurantName || (isDebugMode ? "demo-empresa" : "");
  const leadId = location.state?.leadId || (isDebugMode ? "debug-ux" : undefined);
  const firstName = location.state?.firstName || "";
  const lastName = location.state?.lastName || "";
  const email = location.state?.email || "";
  const ciudad = location.state?.ciudad || "";
  const whatsapp = location.state?.whatsapp || "";

  const [leadData, setLeadData] = useState<LeadData>({
    firstName,
    lastName,
    email,
    ciudad,
    whatsapp,
    nombreRestaurante: restaurantName,
  });

  useEffect(() => {
    if (!leadId && !isDebugMode) {
      toast({
        title: "Error",
        description: "Error al cargar los datos. Por favor intenta registrarte nuevamente.",
        variant: "destructive",
      });
      navigate("/restaurantes");
    }
  }, [leadId, isDebugMode, navigate]);

  useEffect(() => {
    pushToDataLayer("onboarding_page_view", {
      leadId,
      restaurantName,
      debug_mode: isDebugMode,
      flow_mode: "invoice_only",
    });
  }, [leadId, restaurantName, isDebugMode]);

  useEffect(() => {
    const fetchLeadData = async () => {
      if (isDebugMode) {
        setLeadData({
          firstName,
          lastName,
          email,
          ciudad,
          whatsapp,
          nombreRestaurante: restaurantName,
        });
        return;
      }

      if (!leadId) return;

      try {
        const { data: lead, error } = await supabase
          .from("leads")
          .select("*")
          .eq("id", leadId)
          .single();

        if (error || !lead) return;

        let extractedFirstName = firstName;
        let extractedLastName = lastName;

        if (!extractedFirstName && lead.first_name) extractedFirstName = lead.first_name;
        if (!extractedLastName && lead.last_name) extractedLastName = lead.last_name;

        if ((!extractedFirstName || !extractedLastName) && lead.name) {
          const nameParts = lead.name.split(" ");
          if (!extractedFirstName && nameParts.length > 0) extractedFirstName = nameParts[0];
          if (!extractedLastName && nameParts.length > 1) extractedLastName = nameParts.slice(1).join(" ");
        }

        setLeadData({
          firstName: extractedFirstName,
          lastName: extractedLastName,
          email: lead.email || email,
          ciudad: lead.ccity || ciudad,
          whatsapp: lead.whatsapp ? lead.whatsapp.replace(/^\+56/, "") : whatsapp,
          nombreRestaurante: lead.company_name || restaurantName,
        });
      } catch {
        // Ignore and keep location state values
      }
    };

    fetchLeadData();
  }, [isDebugMode, leadId, firstName, lastName, email, ciudad, whatsapp, restaurantName]);

  const saveInvoiceSelection = async (count: number) => {
    try {
      if (isDebugMode) {
        await new Promise(resolve => setTimeout(resolve, 250));
        pushToDataLayer("onboarding_step_1_invoices_debug", {
          leadId: "debug-ux",
          step: 1,
          stepName: "invoice-count-selected",
          facturas_compra_mes: count,
          requires_calendly: count >= 150,
        });
        return true;
      }

      if (!leadId) return false;

      const updateData = {
        facturas_compra_mes: count,
        requires_calendly: count >= 150,
      };

      const numericLeadId = Number(leadId);
      const response = await supabase.functions.invoke("update-lead", {
        body: {
          leadId: numericLeadId,
          updateData,
        },
      });

      if (response.error || !response.data?.success) {
        toast({
          title: "Error",
          description: "Error al guardar los datos. Intenta nuevamente.",
          variant: "destructive",
        });
        return false;
      }

      const leadDataForSlack: Partial<Lead> = {
        facturas_compra_mes: count,
        requires_calendly: count >= 150,
      };

      notifySlackOnboardingStep(numericLeadId, "invoice-count-selected", leadDataForSlack);

      pushToDataLayer("onboarding_step_1_invoices", {
        leadId: numericLeadId,
        step: 1,
        stepName: "invoice-count-selected",
        facturas_compra_mes: count,
        requires_calendly: count >= 150,
      });

      return true;
    } catch {
      toast({
        title: "Error",
        description: "Error al guardar los datos. Intenta nuevamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    const saved = await saveInvoiceSelection(invoiceCount);
    setIsLoading(false);
    if (!saved) return;

    if (invoiceCount >= 150) {
      setShowCalendlyHigh(true);
      return;
    }

    setShowCalendlyLow(true);
  };

  const debugBanner = isDebugMode ? (
    <div className="fixed top-4 left-4 z-50 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
      Modo Debug UX: sin guardar en base de datos
    </div>
  ) : null;

  if (showCalendlyHigh) {
    return (
      <>
        <Helmet>
          <title>Agenda tu llamada | Ruka.ai</title>
        </Helmet>
        <main className="min-h-screen flex flex-col lg:flex-row relative">
          {debugBanner}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-50 to-blue-50 p-6 xl:p-8 flex-col overflow-hidden">
            <div className="max-w-md mx-auto flex-1">
              <div className="h-full flex flex-col justify-center">
                <div className="w-auto h-10 relative mb-6">
                  <img src="/logo.png" alt="Ruka.ai" className="h-10 w-auto object-contain object-left" />
                </div>
                <h2 className="text-2xl xl:text-3xl font-bold mb-4">¡Perfecto! Tu volumen requiere atención personalizada</h2>
                <p className="text-slate-600 mb-6 text-sm xl:text-base">
                  Con más de 150 facturas mensuales, necesitas una configuración especializada para obtener el máximo beneficio de nuestra plataforma.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Configuración personalizada</h3>
                      <p className="text-slate-600 text-sm">Adaptamos cada funcionalidad a tu volumen específico de transacciones.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Optimización avanzada</h3>
                      <p className="text-slate-600 text-sm">Implementamos algoritmos especializados para manejar tu volumen eficientemente.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8 xl:p-12 bg-white overflow-auto">
            <div className="w-full max-w-4xl">
              <CalendlyIntegration
                leadData={{
                  firstName: leadData.firstName,
                  lastName: leadData.lastName,
                  email: leadData.email,
                  restaurantName: leadData.nombreRestaurante,
                  invoiceCount,
                  whatsapp: leadData.whatsapp,
                }}
              />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (showCalendlyLow) {
    return (
      <>
        <Helmet>
          <title>Agenda tu configuración | Ruka.ai</title>
        </Helmet>
        <main className="min-h-screen flex flex-col lg:flex-row relative">
          {debugBanner}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-50 to-blue-50 p-6 xl:p-8 flex-col overflow-hidden">
            <div className="max-w-md mx-auto flex-1">
              <div className="h-full flex flex-col justify-center">
                <div className="w-auto h-10 relative mb-6">
                  <img src="/logo.png" alt="Ruka.ai" className="h-10 w-auto object-contain object-left" />
                </div>
                <h2 className="text-2xl xl:text-3xl font-bold mb-4">¡Excelente! Ya puedes activar tu plataforma</h2>
                <p className="text-slate-600 mb-6 text-sm xl:text-base">
                  Con este volumen puedes levantar tu cuenta de inmediato en onboarding.ruka.ai.
                  Si prefieres, también puedes agendar una llamada como alternativa.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Activación inmediata</h3>
                      <p className="text-slate-600 text-sm">Puedes empezar hoy mismo sin esperar una reunión.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Llamada opcional</h3>
                      <p className="text-slate-600 text-sm">Si necesitas apoyo, puedes agendar una llamada en segundo plano.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8 xl:p-12 bg-white overflow-auto">
            <div className="w-full max-w-4xl">
              <CalendlyIntegrationLow
                leadData={{
                  firstName: leadData.firstName,
                  lastName: leadData.lastName,
                  email: leadData.email,
                  restaurantName: leadData.nombreRestaurante,
                  invoiceCount,
                  whatsapp: leadData.whatsapp,
                }}
              />
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Configura tu cuenta | Ruka.ai</title>
      </Helmet>
      <main className="min-h-screen flex flex-col md:flex-row relative">
        {debugBanner}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-50 to-blue-50 p-8 flex-col overflow-hidden">
          <div className="max-w-md mx-auto flex-1">
            <InvoiceVolumeInfo />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
          <div className="w-full max-w-md">
            <div className="md:hidden mb-8 flex flex-col items-center text-center">
              <img src="/logo.png" alt="Ruka.ai" className="h-10 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Configura tu cuenta</h1>
              <p className="text-slate-600 text-sm mb-6">Indícanos tu volumen mensual de facturas para enviarte al calendario correcto.</p>
            </div>
            <Card className="border shadow-md">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Volumen de facturas</CardTitle>
                    <CardDescription>Selecciona cuántas facturas de compra recibes cada mes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-8">
                <InvoiceCountSelector selectedCount={invoiceCount} onChange={setInvoiceCount} />
                <Button id="next-button-step-0" onClick={handleContinue} disabled={isLoading} className="w-full mt-8 gap-2">
                  {!isLoading ? (
                    "Continuar"
                  ) : (
                    <span className="flex items-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      Guardando...
                    </span>
                  )}
                </Button>
                <div className="mt-8 text-center">
                  <a
                    href="https://wa.me/56981213314"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    ¿Necesitas ayuda? Contáctanos
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

export default OnboardingSuccess;
