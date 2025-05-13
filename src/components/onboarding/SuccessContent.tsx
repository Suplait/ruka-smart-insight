
import React from 'react';
import { Check, MessageSquare, AlertCircle } from 'lucide-react';
import WhatsappButton from "@/components/WhatsappButton";
import { useLocation } from 'react-router-dom';

const SuccessContent = () => {
  const location = useLocation();
  const formData = location.state || {};
  
  // Para debugging
  console.log("Success Content - Location state:", location.state);

  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold">¡Todo listo! 🎉</h2>
      
      <div className="space-y-3 text-gray-600">
        <p>
          Has completado el registro con éxito. <span className="font-medium">El siguiente paso es obligatorio:</span>
        </p>
        
        <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-md bg-amber-50 border border-amber-200 text-amber-700 mb-1 mt-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm font-medium">Contactarnos por WhatsApp para activar tu plataforma</p>
        </div>
        
        <div className="space-y-2 text-left max-w-sm mx-auto">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </div>
            <p className="text-sm">Tus datos han sido guardados correctamente</p>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </div>
            <p className="text-sm">La información del SII ha sido registrada de forma segura</p>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <MessageSquare className="w-3 h-3" />
            </div>
            <p className="text-sm">Contáctanos ahora para iniciar la activación de tu plataforma</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <WhatsappButton
          source="onboarding_success_completion"
          text="Hola! He completado mi registro en Ruka.ai y quiero activar mi plataforma. Estos son mis datos:"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          formData={{
            firstName: formData.firstName || "",
            lastName: formData.lastName || "",
            email: formData.email || "",
            nombreRestaurante: formData.restaurantName || "",
            ciudad: formData.ciudad || "",
            whatsapp: formData.whatsapp || "",
            subdominio: formData.formData?.subdominio || "",
            sistema: formData.formData?.sistema || "",
            sistemaCustom: formData.formData?.sistemaCustom || "",
            meses: formData.formData?.meses || "",
            siiConnected: "Sí" // Siempre debe ser Sí si llegó a la página de éxito
          }}
        >
          Activar mi plataforma
        </WhatsappButton>
        
        <p className="mt-2 text-xs text-gray-500">
          Toca el botón para contactarnos por WhatsApp y activar tu cuenta
        </p>
      </div>
    </div>
  );
};

export default SuccessContent;
