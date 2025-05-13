
import React, { useEffect, useState } from 'react';
import { Check, MessageSquare, AlertCircle } from 'lucide-react';
import WhatsappButton from "@/components/WhatsappButton";
import { useLocation } from 'react-router-dom';

const CalendlySuccessContent = () => {
  const location = useLocation();
  const [calendlyData, setCalendlyData] = useState({
    fullName: '',
    email: '',
    restaurantName: ''
  });

  // Extraer parámetros de la URL al cargar el componente
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const fullName = searchParams.get('invitee_full_name') || '';
    const email = searchParams.get('invitee_email') || '';
    const restaurantName = searchParams.get('answer_1') || '';
    
    setCalendlyData({
      fullName,
      email,
      restaurantName
    });
    
    console.log("Calendly data extracted:", { fullName, email, restaurantName });
  }, [location.search]);

  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold">¡Cita agendada! 🎉</h2>
      
      <div className="space-y-3 text-gray-600">
        <p>
          Has agendado correctamente tu cita con nosotros. <span className="font-medium">El siguiente paso es obligatorio:</span>
        </p>
        
        <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-md bg-amber-50 border border-amber-200 text-amber-700 mb-1 mt-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm font-medium">Contáctanos por WhatsApp para poder realizar la reunión</p>
        </div>
        
        <div className="space-y-2 text-left max-w-sm mx-auto">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </div>
            <p className="text-sm">Tu cita ha sido registrada en nuestro sistema</p>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </div>
            <p className="text-sm">Recibirás un correo electrónico con los detalles de la cita</p>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <MessageSquare className="w-3 h-3" />
            </div>
            <p className="text-sm">Es obligatorio que nos hables por WhatsApp para poder realizar la reunión</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <WhatsappButton
          source="calendly_success_page"
          text="Hola! He agendado una cita en Calendly y necesito confirmar mi asistencia para la reunión."
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          isSuccessPage={true}
          formData={{
            firstName: calendlyData.fullName,
            email: calendlyData.email,
            nombreRestaurante: calendlyData.restaurantName,
          }}
        >
          Contactar por WhatsApp
        </WhatsappButton>
        
        <p className="mt-2 text-xs text-gray-500">
          Es obligatorio contactarnos por WhatsApp para poder realizar la reunión
        </p>
      </div>
    </div>
  );
};

export default CalendlySuccessContent;
