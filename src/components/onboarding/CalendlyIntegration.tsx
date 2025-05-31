
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
  };
}

const CalendlyIntegration = ({ leadData }: CalendlyIntegrationProps) => {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const formatInvoiceCount = (count: number) => {
    if (count >= 1000) return "+1.000";
    if (count >= 500) return "+500";
    return count.toString();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">¡Perfecto! Agendemos una llamada</h1>
        <p className="text-muted-foreground">
          Con {formatInvoiceCount(leadData.invoiceCount)} facturas mensuales, te ayudaremos a configurar tu plataforma de manera personalizada.
        </p>
      </div>

      <Card className="border shadow-md mb-6">
        <CardHeader>
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
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-sm font-medium">Configuración personalizada</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-sm font-medium">Solo 30 minutos</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <span className="text-sm font-medium">Sin compromiso</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div 
              className="calendly-inline-widget w-full" 
              data-url="https://calendly.com/suplait_lorenzo/30min?hide_event_type_details=1&hide_gdpr_banner=1&text_color=000000&primary_color=4e66e9" 
              style={{ minWidth: '300px', width: '100%', height: '600px' }}
            ></div>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>¿Prefieres continuar sin agendar? <a href="/" className="text-primary hover:underline">Volver al inicio</a></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendlyIntegration;
