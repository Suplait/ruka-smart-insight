
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  CheckCircle2, 
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsappButton from "@/components/WhatsappButton";

const OnboardingAnimation = () => {
  const [isComplete, setIsComplete] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Access formData and restaurantName from location state
  const formData = location.state?.formData || {};
  const restaurantName = location.state?.restaurantName || '';

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
          <p className="text-slate-600">Escríbenos por WhatsApp para activar tu plataforma con los datos que ingresaste.</p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }}
            className="mt-6 space-y-4"
          >
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
              className="px-6"
            >
              Ir al inicio
            </Button>
            
            <div className="mt-4">
              <WhatsappButton
                source="onboarding_animation_complete"
                text="Hola! Acabo de completar el registro en Ruka.ai y quiero activar mi plataforma. Estos son mis datos:"
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-50"
                formData={{
                  firstName: location.state?.firstName || "",
                  lastName: location.state?.lastName || "",
                  email: location.state?.email || "",
                  nombreRestaurante: restaurantName,
                  ciudad: location.state?.ciudad || "",
                  whatsapp: location.state?.whatsapp || "",
                  ...formData
                }}
              >
                Continuar en WhatsApp
              </WhatsappButton>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingAnimation;
