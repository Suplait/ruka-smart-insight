
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CalendlyIntegrationLowProps {
  leadData: {
    firstName: string;
    lastName: string;
    email: string;
    restaurantName: string;
    invoiceCount: number;
    whatsapp?: string;
  };
}

const CalendlyIntegrationLow = ({ leadData }: CalendlyIntegrationLowProps) => {
  const [showCalendly, setShowCalendly] = useState(false);

  useEffect(() => {
    if (!showCalendly) return;

    // Add event listener for Calendly scheduling events
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event === 'calendly.event_scheduled') {
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'calendly_group_scheduled',
            calendly_name: e.data.payload?.name,
            calendly_email: e.data.payload?.email
          });
          console.log('DataLayer: calendly_group_scheduled', {
            calendly_name: e.data.payload?.name,
            calendly_email: e.data.payload?.email
          });
        }
      }
    };

    window.addEventListener('message', handleCalendlyEvent);

    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => {
      // Initialize Calendly with prefilled data once script loads
      if (window.Calendly) {
        const calendlyElement = document.getElementById('calendly-embed-element-low');
        if (calendlyElement) {
          window.Calendly.initInlineWidget({
            url: 'https://calendly.com/ruka-ai/calendario-general-150?hide_event_type_details=1&hide_gdpr_banner=1&text_color=000000&primary_color=4e66e9',
            parentElement: calendlyElement,
            prefill: {
              name: `${leadData.firstName} ${leadData.lastName}`.trim(),
              email: leadData.email,
              customAnswers: {
                a1: leadData.restaurantName
              }
            }
          });
        }
      }
    };
    document.head.appendChild(script);

    return () => {
      // Clean up event listener and script when component unmounts
      window.removeEventListener('message', handleCalendlyEvent);
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [leadData, showCalendly]);

  const getInvoiceRangeLabel = (count: number) => {
    if (count === 75 || count < 150) return "menos de 150";
    if (count === 225 || count < 300) return "150 a 300";
    if (count === 450 || count < 600) return "300 a 600";
    return "más de 600";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">¡Excelente! Puedes activar tu plataforma de inmediato</h1>
        <p className="text-muted-foreground">
          Tu volumen de {getInvoiceRangeLabel(leadData.invoiceCount)} facturas mensuales califica para activación inmediata.
        </p>
      </div>

      <Card className="border shadow-md mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>Activa tu cuenta ahora</CardTitle>
              <CardDescription>Puedes levantar tu plataforma sin esperar una llamada</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!showCalendly ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">Activación inmediata</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">Empiezas hoy</span>
                </div>
              </div>

              <Button asChild className="w-full h-11 text-base">
                <a href="https://onboarding.ruka.ai" target="_blank" rel="noopener noreferrer">
                  Levantar mi plataforma de inmediato
                </a>
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowCalendly(true)}
                  className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors"
                >
                  o agendar una llamada
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">Configuración guiada</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">Solo 20 minutos</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">Sin compromiso</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div
                  id="calendly-embed-element-low"
                  style={{ minWidth: '320px', width: '100%', height: '700px' }}
                ></div>
              </div>

              <div className="text-center text-sm text-muted-foreground mt-4">
                <p>
                  ¿Prefieres activar de inmediato?{" "}
                  <a href="https://onboarding.ruka.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Ir a onboarding.ruka.ai
                  </a>
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendlyIntegrationLow;
