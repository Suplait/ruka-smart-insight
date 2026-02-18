
import React, { useEffect } from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CalendlyIntegrationProps {
  leadData: {
    firstName: string;
    lastName: string;
    email: string;
    restaurantName: string;
    invoiceCount: number;
    whatsapp?: string;
  };
}

const CalendlyIntegration = ({ leadData }: CalendlyIntegrationProps) => {
  useEffect(() => {
    // Add event listener for Calendly scheduling events
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event === 'calendly.event_scheduled') {
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'calendly_event_scheduled',
            calendly_name: e.data.payload?.name,
            calendly_email: e.data.payload?.email
          });
          console.log('DataLayer: calendly_event_scheduled', {
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
        const calendlyElement = document.getElementById('calendly-embed-element');
        if (calendlyElement) {
          window.Calendly.initInlineWidget({
            url: 'https://calendly.com/ruka-ai/calendario-general-1?hide_event_type_details=1&hide_gdpr_banner=1&text_color=000000&primary_color=4e66e9',
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
  }, [leadData]);

  const getInvoiceRangeLabel = (count: number) => {
    if (count === 75 || count < 150) return "menos de 150";
    if (count === 225 || count < 300) return "150 a 300";
    if (count === 450 || count < 600) return "300 a 600";
    return "más de 600";
  };

  return (
    <div className="w-full max-w-2xl mx-auto lg:h-full lg:flex lg:flex-col">
      <div className="text-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold mb-1.5">¡Perfecto! Agendemos una llamada</h1>
        <p className="text-muted-foreground">
          Con un volumen de {getInvoiceRangeLabel(leadData.invoiceCount)} facturas mensuales, te ayudaremos a configurar tu plataforma de manera personalizada.
        </p>
      </div>

      <Card className="border shadow-md mb-4 lg:mb-0 lg:flex-1 lg:min-h-0">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>Agenda tu llamada personalizada</CardTitle>
              <CardDescription>Configuraremos tu plataforma para obtener el máximo beneficio</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="lg:flex-1 lg:min-h-0 lg:flex lg:flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
            <div className="flex items-center gap-2 p-2.5 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-xs font-medium">Configuración personalizada</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-blue-50 rounded-lg">
              <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-xs font-medium">Solo 30 minutos</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-purple-50 rounded-lg">
              <Calendar className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="text-xs font-medium">Sin compromiso</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm overflow-hidden lg:flex-1 lg:min-h-0">
            <div 
              id="calendly-embed-element"
              style={{ minWidth: '320px', width: '100%', height: 'clamp(360px, 56vh, 560px)' }}
            ></div>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-3">
            <p>¿Prefieres continuar sin agendar? <a href="/" className="text-primary hover:underline">Volver al inicio</a></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendlyIntegration;
