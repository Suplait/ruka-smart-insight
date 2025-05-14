
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

const OnboardingAnimation = () => {
  const [isComplete, setIsComplete] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Log the data we're receiving for debugging
  useEffect(() => {
    console.log("Animation component location state:", location.state);
  }, [location.state]);
  
  // Access formData and restaurantName from location state
  const formData = location.state?.formData || {};
  const restaurantName = location.state?.restaurantName || '';
  const firstName = location.state?.firstName || '';
  const lastName = location.state?.lastName || '';
  const email = location.state?.email || '';
  const ciudad = location.state?.ciudad || '';
  const whatsapp = location.state?.whatsapp || '';

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
                firstName: firstName,
                lastName: lastName,
                email: email,
                nombreRestaurante: restaurantName,
                ciudad: ciudad,
                whatsapp: whatsapp,
                ...formData,
                currentStep: 4 // Completed all steps
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
