
import React, { useEffect } from 'react';
import { Check, MessageSquare, AlertCircle } from 'lucide-react';
import WhatsappButton from "@/components/WhatsappButton";
import { useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

const SuccessContent = () => {
  const location = useLocation();
  const [userData, setUserData] = React.useState({
    firstName: location.state?.firstName || '',
    lastName: location.state?.lastName || '',
    email: location.state?.email || '',
    ciudad: location.state?.ciudad || '',
    whatsapp: location.state?.whatsapp || '',
    restaurantName: location.state?.restaurantName || '',
    formData: location.state?.formData || {}
  });
  
  // Debugging logs
  console.log("Success Content - Location state:", location.state);
  console.log("Success Content - User data initial state:", userData);
  
  // Attempt to retrieve missing user data from Supabase if we have a leadId
  useEffect(() => {
    const fetchLeadData = async () => {
      const leadId = location.state?.leadId;
      
      // Only fetch if we have a leadId
      if (leadId) {
        try {
          console.log("Fetching lead data for ID:", leadId);
          const { data: lead, error } = await supabase
            .from('leads')
            .select('*')
            .eq('id', leadId)
            .single();
            
          if (error) {
            console.error("Error fetching lead data in SuccessContent:", error);
            return;
          }
          
          if (lead) {
            console.log("Retrieved lead data from Supabase in SuccessContent:", lead);
            
            // Extract first and last name from name field if needed
            let extractedFirstName = userData.firstName || location.state?.firstName || '';
            let extractedLastName = userData.lastName || location.state?.lastName || '';
            
            if (!extractedFirstName && lead.first_name) {
              extractedFirstName = lead.first_name;
            }
            
            if (!extractedLastName && lead.last_name) {
              extractedLastName = lead.last_name;
            }
            
            // If we still don't have first/last name but we have full name, split it
            if ((!extractedFirstName || !extractedLastName) && lead.name) {
              const nameParts = lead.name.split(' ');
              if (nameParts.length > 0 && !extractedFirstName) {
                extractedFirstName = nameParts[0];
              }
              if (nameParts.length > 1 && !extractedLastName) {
                extractedLastName = nameParts.slice(1).join(' ');
              }
            }
            
            // Get formData from location state or create empty object
            const formData = location.state?.formData || {};
            
            // Update user data state with all available information
            const updatedUserData = {
              firstName: extractedFirstName,
              lastName: extractedLastName,
              email: lead.email || userData.email || location.state?.email || '',
              ciudad: lead.ccity || userData.ciudad || location.state?.ciudad || '',
              whatsapp: lead.whatsapp ? lead.whatsapp.replace(/^\+56/, '') : (userData.whatsapp || location.state?.whatsapp || ''),
              restaurantName: lead.company_name || userData.restaurantName || location.state?.restaurantName || '',
              formData: {
                ...formData,
                // Make sure these values are preserved from the formData
                subdominio: formData.subdominio || lead.subdominio || '',
                sistema: formData.sistema || lead.sistema_facturacion || '',
                sistemaCustom: formData.sistemaCustom || lead.sistema_custom || '',
                meses: formData.meses || lead.meses_datos || ''
              }
            };
            
            console.log("Updated user data in SuccessContent:", updatedUserData);
            setUserData(updatedUserData);
          }
        } catch (error) {
          console.error("Error in fetchLeadData for SuccessContent:", error);
        }
      }
    };
    
    fetchLeadData();
  }, [location.state]);

  // Log the final userData right before rendering for debugging
  console.log("Final userData for WhatsApp in SuccessContent:", userData);

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
          isSuccessPage={true}
          formData={{
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            nombreRestaurante: userData.restaurantName,
            ciudad: userData.ciudad,
            whatsapp: userData.whatsapp,
            subdominio: userData.formData?.subdominio || location.state?.formData?.subdominio || "",
            sistema: userData.formData?.sistema || location.state?.formData?.sistema || "",
            sistemaCustom: userData.formData?.sistemaCustom || location.state?.formData?.sistemaCustom || "",
            meses: userData.formData?.meses || location.state?.formData?.meses || "",
            siiConnected: true
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
