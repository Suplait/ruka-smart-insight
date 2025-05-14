
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  CheckCircle2, 
  Rocket,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsappButton from "@/components/WhatsappButton";
import { supabase } from "@/integrations/supabase/client";

const OnboardingAnimation = () => {
  const [isComplete, setIsComplete] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState({
    firstName: location.state?.firstName || '',
    lastName: location.state?.lastName || '',
    email: location.state?.email || '',
    ciudad: location.state?.ciudad || '',
    whatsapp: location.state?.whatsapp || '',
    restaurantName: location.state?.restaurantName || '',
    formData: location.state?.formData || {}
  });
  
  // Log the data we're receiving for debugging
  useEffect(() => {
    console.log("Animation component location state:", location.state);
    console.log("Animation component user data state:", userData);
    
    // Attempt to retrieve missing user data from Supabase if we have a leadId
    const fetchLeadData = async () => {
      const leadId = location.state?.leadId;
      
      // Only fetch if we have a leadId and missing user information
      if (leadId && (!userData.firstName || !userData.lastName || !userData.email || !userData.ciudad)) {
        try {
          const { data: lead, error } = await supabase
            .from('leads')
            .select('*')
            .eq('id', leadId)
            .single();
            
          if (error) {
            console.error("Error fetching lead data in OnboardingAnimation:", error);
            return;
          }
          
          if (lead) {
            console.log("Retrieved lead data from Supabase in OnboardingAnimation:", lead);
            
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
            
            // Update user data state with all available information
            setUserData({
              firstName: extractedFirstName,
              lastName: extractedLastName,
              email: lead.email || userData.email || location.state?.email || '',
              ciudad: lead.ccity || userData.ciudad || location.state?.ciudad || '',
              whatsapp: lead.whatsapp ? lead.whatsapp.replace(/^\+56/, '') : (userData.whatsapp || location.state?.whatsapp || ''),
              restaurantName: lead.company_name || userData.restaurantName || location.state?.restaurantName || '',
              formData: location.state?.formData || {}
            });
            
            console.log("Updated user data in OnboardingAnimation:", {
              firstName: extractedFirstName,
              lastName: extractedLastName,
              email: lead.email || userData.email || '',
              ciudad: lead.ccity || userData.ciudad || '',
              whatsapp: lead.whatsapp ? lead.whatsapp.replace(/^\+56/, '') : userData.whatsapp,
              restaurantName: lead.company_name || userData.restaurantName
            });
          }
        } catch (error) {
          console.error("Error in fetchLeadData for OnboardingAnimation:", error);
        }
      }
    };
    
    fetchLeadData();
  }, [location.state]);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="max-w-sm text-center">
        <motion.div
          key="complete"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold mb-3">¡Todo listo!</h3>
          
          <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-md bg-amber-50 border border-amber-200 text-amber-700 mb-3 mt-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm font-medium">Es necesario contactarnos para activar tu plataforma</p>
          </div>
          
          <p className="text-slate-600 mb-4">Escríbenos por WhatsApp para activar tu plataforma con los datos que ingresaste.</p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }}
            className="mt-2 space-y-4"
          >
            <WhatsappButton
              source="onboarding_animation_complete"
              text="Hola! Acabo de completar el registro en Ruka.ai y quiero activar mi plataforma. Estos son mis datos:"
              variant="default"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              formData={{
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                nombreRestaurante: userData.restaurantName,
                ciudad: userData.ciudad,
                whatsapp: userData.whatsapp,
                ...userData.formData,
                currentStep: 4, // Completed all steps
                siiConnected: true
              }}
              isSuccessPage={true}
            >
              Activar mi plataforma
            </WhatsappButton>
            
            <Button 
              id="go-home-button" 
              onClick={() => {
                // Push event to dataLayer when user clicks "Go home"
                if (window.dataLayer) {
                  window.dataLayer.push({
                    event: 'onboarding_go_home_click',
                    timestamp: new Date().toISOString()
                  });
                }
                navigate('/');
              }} 
              variant="outline"
              className="w-full"
            >
              Ir al inicio
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingAnimation;
