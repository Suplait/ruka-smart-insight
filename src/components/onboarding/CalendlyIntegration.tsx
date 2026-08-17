
import React, { useEffect } from 'react';

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

  return (
    <div
      id="calendly-embed-element"
      style={{ minWidth: '320px', width: '100%', height: '700px' }}
    ></div>
  );
};

export default CalendlyIntegration;
