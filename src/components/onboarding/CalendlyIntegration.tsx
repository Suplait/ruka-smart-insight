
import React, { useEffect } from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold mb-3">¡Perfecto! Agendemos una llamada</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Con {leadData.invoiceCount} facturas mensuales, te ayudaremos a configurar tu plataforma de manera personalizada para obtener el máximo beneficio.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium">Configuración personalizada</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <Clock className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium">Solo 30 minutos</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
          <Calendar className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium">Sin compromiso</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div 
          className="calendly-inline-widget" 
          data-url="https://calendly.com/suplait_lorenzo/30min?hide_event_type_details=1&hide_gdpr_banner=1&text_color=000000&primary_color=4e66e9" 
          style={{ minWidth: '320px', height: '700px' }}
        ></div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>¿Prefieres continuar sin agendar? <a href="/" className="text-primary hover:underline">Volver al inicio</a></p>
      </div>
    </div>
  );
};

export default CalendlyIntegration;
