
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Server, 
  Globe, 
  Zap, 
  CloudCog, 
  Database, 
  BarChart3, 
  MessageSquare, 
  Mail, 
  CheckCircle2, 
  Rocket,
  BrainCircuit,
  HomeIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AnimationStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const OnboardingAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const steps: AnimationStep[] = [
    {
      icon: <Server className="w-12 h-12 text-primary" />,
      title: "Preparando tu servidor",
      description: "Estamos configurando un entorno seguro para tus datos."
    },
    {
      icon: <Globe className="w-12 h-12 text-primary" />,
      title: "Asignando tu subdominio",
      description: "Creando tu portal personalizado en Ruka.ai."
    },
    {
      icon: <BrainCircuit className="w-12 h-12 text-primary" />,
      title: "Despertando a Ruka",
      description: "Activando la inteligencia artificial que gestionará tus datos."
    },
    {
      icon: <CloudCog className="w-12 h-12 text-primary" />,
      title: "Configurando servicios",
      description: "Preparando los componentes necesarios para tu análisis."
    },
    {
      icon: <Database className="w-12 h-12 text-primary" />,
      title: "Importando tus datos",
      description: "Accediendo a tus registros del SII de forma segura."
    },
    {
      icon: <Zap className="w-12 h-12 text-primary" />,
      title: "Procesando transacciones",
      description: "Clasificando automáticamente tus facturas y boletas."
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-primary" />,
      title: "Generando insights",
      description: "Descubriendo patrones y oportunidades en tus datos."
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-primary" />,
      title: "Creando grupo de soporte",
      description: "Preparando un canal directo de comunicación con nuestro equipo."
    },
    {
      icon: <Mail className="w-12 h-12 text-primary" />,
      title: "Preparando accesos",
      description: "Generando tus credenciales de usuario administrador."
    },
    {
      icon: <Rocket className="w-12 h-12 text-primary" />,
      title: "Todo listo para despegar",
      description: "En breve te contactaremos para comenzar."
    }
  ];

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [currentStep, steps.length]);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="max-w-sm text-center">
        <AnimatePresence mode="wait">
          {currentStep < steps.length ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                {steps[currentStep].icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{steps[currentStep].title}</h3>
              <p className="text-slate-600">{steps[currentStep].description}</p>
            </motion.div>
          ) : (
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
              <p className="text-slate-600">Nos pondremos en contacto contigo muy pronto para ayudarte a comenzar.</p>
              
              <Button 
                onClick={() => navigate('/')} 
                className="mt-8 gap-2"
              >
                <HomeIcon className="w-4 h-4" /> Ir al inicio
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Progress bar */}
        <div className="mt-12">
          <div className="h-1.5 bg-gray-200 rounded-full w-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="mt-2 text-sm text-slate-500">
            {isComplete ? 
              "Proceso completado" : 
              `Paso ${currentStep + 1} de ${steps.length}`
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingAnimation;
