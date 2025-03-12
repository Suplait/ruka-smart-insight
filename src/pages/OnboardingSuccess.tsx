import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Store, Check, Globe, ShieldCheck, Info, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Partners from "@/components/Partners";
import AutomationFeatures from "@/components/restaurant/AutomationFeatures";
import SimpleConnection from "@/components/restaurant/SimpleConnection";
import CompactImpactStats from "@/components/restaurant/CompactImpactStats";
import MonthsSelector from "@/components/onboarding/MonthsSelector";
import BillingSystemSelector from "@/components/onboarding/BillingSystemSelector";
import SubdomainInput from "@/components/onboarding/SubdomainInput";
import StepIndicator from "@/components/onboarding/StepIndicator";

const OnboardingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const totalSteps = 4;

  const leadId = location.state?.leadId;
  const restaurantName = location.state?.restaurantName || '';
  
  const generateSubdomain = (name: string) => {
    if (!name) return '';
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '')
    .trim();
  };
  
  const suggestedSubdomain = generateSubdomain(restaurantName);

  const [formData, setFormData] = useState({
    rut: "",
    clave: "",
    meses: 3,
    sistema: "sii",
    sistemaCustom: "",
    subdominio: suggestedSubdomain
  });

  const updateFormData = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubdomainChange = (value: string) => {
    const sanitizedValue = generateSubdomain(value);
    updateFormData('subdominio', sanitizedValue);
  };

  useEffect(() => {
    if (!leadId) {
      console.error('No leadId found in location state, redirecting to registration');
      toast({
        title: "Error",
        description: "Error al cargar los datos. Por favor intenta registrarte nuevamente.",
        variant: "destructive"
      });
      navigate('/restaurantes');
    }
  }, [leadId, navigate]);

  const saveFormData = async (stepData: any) => {
    if (!leadId) {
      console.error('No leadId found, cannot save data');
      return false;
    }

    try {
      console.log(`Saving data for step ${currentStep} to lead ${leadId}:`, stepData);

      const { data, error } = await supabase
        .from('leads')
        .update(stepData)
        .eq('id', leadId)
        .select();

      if (error) {
        console.error('Error saving step data:', error);
        toast({
          title: "Error al guardar",
          description: `No se pudieron guardar los datos: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

      console.log('Successfully saved step data:', data);
      return true;
    } catch (error) {
      console.error('Error in saveFormData:', error);
      toast({
        title: "Error",
        description: "Error al guardar los datos. Por favor intenta nuevamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleNext = async () => {
    setIsLoading(true);
    let stepData = {};

    try {
      switch (currentStep) {
        case 0:
          stepData = { meses_datos: formData.meses };
          break;
        case 1:
          stepData = {
            sistema_facturacion: formData.sistema,
            sistema_custom: formData.sistemaCustom
          };
          break;
        case 2:
          stepData = { subdominio: formData.subdominio };
          break;
        case 3:
          if (!formData.rut || !formData.clave) {
            toast({
              title: "Campos requeridos",
              description: "Por favor completa el RUT y clave del SII",
              variant: "destructive"
            });
            setIsLoading(false);
            return;
          }

          const rutRegex = /^\d{1,8}-[\dkK]$/;
          if (!rutRegex.test(formData.rut)) {
            toast({
              title: "Formato incorrecto",
              description: "El RUT debe tener el formato 1234567-8",
              variant: "destructive"
            });
            setIsLoading(false);
            return;
          }

          stepData = {
            rut: formData.rut,
            clave_sii: formData.clave,
            sii_connected: true
          };
          break;
      }

      const saved = await saveFormData(stepData);
      
      if (!saved) {
        setIsLoading(false);
        return;
      }

      if (currentStep === 3) {
        setIsComplete(true);
      } else {
        setCurrentStep(prev => prev + 1);
      }

    } catch (error) {
      console.error('Error in handleNext:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error. Por favor intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const steps = [
    {
      title: "Periodo de datos",
      icon: <Calendar className="w-6 h-6 text-primary" />,
      description: "¿Cuántos meses de datos quieres importar?",
      content: <MonthsSelector selectedMonths={formData.meses} onChange={months => updateFormData('meses', months)} />
    },
    {
      title: "Sistema de facturación",
      icon: <Store className="w-6 h-6 text-primary" />,
      description: "Selecciona tu sistema de facturación",
      content: <BillingSystemSelector selectedSystem={formData.sistema} onChange={system => updateFormData('sistema', system)} customSystem={formData.sistemaCustom} onCustomChange={value => updateFormData('sistemaCustom', value)} />
    },
    {
      title: "Tu subdominio",
      icon: <Globe className="w-6 h-6 text-primary" />,
      description: "Elige el subdominio para tu acceso personalizado",
      content: <SubdomainInput value={formData.subdominio} onChange={handleSubdomainChange} suggestedSubdomain={suggestedSubdomain} />
    },
    {
      title: "Acceso al SII",
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      description: "Ingresa tus credenciales para conectar tus datos",
      content: (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-blue-700 mb-1">Conexión Segura con el SII</h4>
                <p className="text-sm text-blue-600">
                  Ingresa tus credenciales para importar automáticamente tus facturas de compra y venta.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">RUT Empresa</label>
              <Input 
                id="rut-input"
                value={formData.rut} 
                onChange={e => updateFormData('rut', e.target.value)} 
                placeholder="12345678-9" 
              />
              <p className="text-xs text-muted-foreground">Ingresa el RUT con guión y dígito verificador</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Clave del SII</label>
              <Input 
                id="sii-password-input"
                type="password" 
                value={formData.clave} 
                onChange={e => updateFormData('clave', e.target.value)} 
                placeholder="••••••••" 
              />
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <ShieldCheck className="w-4 h-4 mr-1 text-green-600" />
                Tus datos están almacenados de forma segura
              </div>
            </div>
            
            <Button 
              id="sii-connect-button"
              onClick={handleNext} 
              className="w-full mt-4 gap-2" 
              style={{
                backgroundColor: "#DA5C2B",
                borderColor: "#DA5C2B"
              }} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Conectando con el SII...
                </>
              ) : (
                <>
                  <div className="bg-white rounded-md p-1 flex items-center justify-center">
                    <img src="/logosii.png" alt="SII" className="h-4" />
                  </div>
                  Iniciar sesión con el SII
                </>
              )}
            </Button>
          </div>
        </div>
      )
    }
  ];

  const successContent = (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold">¡Configuración completada!</h2>
      
      <div className="space-y-4 text-gray-600">
        <p>
          Estamos preparando tu plataforma personalizada. Estos son los siguientes pasos:
        </p>
        
        <div className="space-y-3 text-left max-w-sm mx-auto">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </div>
            <p className="text-sm">Crearemos un grupo de WhatsApp para mantenerte informado</p>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </div>
            <p className="text-sm">Te enviaremos las credenciales de acceso cuando la plataforma esté lista</p>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </div>
            <p className="text-sm">Agendaremos una reunión de capacitación para que saques el máximo provecho</p>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <Button id="go-home-button" onClick={() => navigate('/')} className="px-6">
          Ir al inicio
        </Button>
      </div>
    </div>
  );

  const getLeftSideContent = () => {
    switch(currentStep) {
      case 0:
        return (
          <motion.div 
            key="automation-features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full items-center justify-center"
          >
            <AutomationFeatures />
          </motion.div>
        );
      case 1:
        return (
          <motion.div 
            key="simple-connection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full items-center justify-center"
          >
            <SimpleConnection />
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            key="impact-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full items-center justify-center"
          >
            <CompactImpactStats />
          </motion.div>
        );
      case 3:
      default:
        return (
          <motion.div 
            key="social-proof"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full justify-center"
          >
            <div className="max-w-md mx-auto flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-slate-900">
                    Controla tu margen al día sin esfuerzo
                  </h1>
                </div>
                <p className="text-lg text-slate-600 max-w-md mx-auto">
                  Agentes con IA que procesan, agrupan y monitorean tus transacciones para que tengas control absoluto de tu negocio.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden shadow-xl border border-white/80 mb-8"
              >
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/1wV-corpO74" 
                  title="CEO de Ruka.ai hablando sobre la plataforma" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </motion.div>
              
              <Partners />
            </div>
          </motion.div>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>Configura tu cuenta | Ruka.ai</title>
      </Helmet>
      
      <main className="min-h-screen flex flex-col md:flex-row">
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-50 to-blue-50 p-8 flex-col overflow-hidden">
          <div className="max-w-md mx-auto flex-1">
            <AnimatePresence mode="wait">
              {getLeftSideContent()}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
          <div className="w-full max-w-md">
            {!isComplete ? (
              <>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-center mb-8"
                >
                  <h1 className="text-2xl md:text-3xl font-bold">Configura tu cuenta</h1>
                  <p className="mt-2 text-muted-foreground">
                    {currentStep + 1} de {totalSteps} pasos para comenzar
                  </p>
                </motion.div>
                
                <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border shadow-md">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            {steps[currentStep].icon}
                          </div>
                          <div>
                            <CardTitle>{steps[currentStep].title}</CardTitle>
                            <CardDescription>{steps[currentStep].description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-8">
                        {steps[currentStep].content}
                        
                        {currentStep < 3 && (
                          <div className="flex justify-between mt-10">
                            <Button 
                              id={`back-button-step-${currentStep}`}
                              variant="outline" 
                              onClick={handleBack} 
                              disabled={currentStep === 0} 
                              className="gap-2"
                            >
                              <ArrowLeft className="w-4 h-4" /> Atrás
                            </Button>
                            
                            <Button 
                              id={`next-button-step-${currentStep}`}
                              onClick={handleNext} 
                              className="gap-2"
                            >
                              Siguiente <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        
                        {currentStep === 3 && (
                          <div className="flex justify-start mt-6">
                            <Button 
                              id="back-button-step-3"
                              variant="outline" 
                              onClick={handleBack} 
                              className="gap-2"
                            >
                              <ArrowLeft className="w-4 h-4" /> Atrás
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </>
            ) : (
              <Card className="border shadow-md p-8">
                {successContent}
              </Card>
            )}
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>¿Necesitas ayuda? <a href="#" className="text-primary hover:underline">Contáctanos</a></p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default OnboardingSuccess;
