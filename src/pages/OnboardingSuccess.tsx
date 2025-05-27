import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Store, Check, Globe, ShieldCheck, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import OnboardingAnimation from "@/components/restaurant/OnboardingAnimation";
import { Lead } from "@/types/supabase";
import { notifySlackOnboardingStep } from "@/utils/slackNotifier";
import { pushToDataLayer } from "@/utils/dataLayer";
import StepIndicator from "@/components/onboarding/StepIndicator";
import MonthsSelector from "@/components/onboarding/MonthsSelector";
import BillingSystemSelector from "@/components/onboarding/BillingSystemSelector";
import SubdomainInput from "@/components/onboarding/SubdomainInput";
import SiiCredentialsInput from "@/components/onboarding/SiiCredentialsInput";
import SuccessContent from "@/components/onboarding/SuccessContent";
import LeftSideContent from "@/components/onboarding/LeftSideContent";
import WhatsappButton from "@/components/WhatsappButton";
import { saveFormData, validateSiiCredentials, generateSubdomain } from "@/services/onboardingService";
import { supabase } from "@/integrations/supabase/client";

const SLIDE_INTERVAL = 2500;

const OnboardingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showWhatsAppButtons, setShowWhatsAppButtons] = useState(true);
  const totalSteps = 4;
  const restaurantName = location.state?.restaurantName || '';
  const leadId = location.state?.leadId;
  
  // Extract user information from location state
  const firstName = location.state?.firstName || '';
  const lastName = location.state?.lastName || '';
  const email = location.state?.email || '';
  const ciudad = location.state?.ciudad || '';
  const whatsapp = location.state?.whatsapp || '';
  
  // Create state to store the full lead data
  const [leadData, setLeadData] = useState({
    firstName,
    lastName,
    email,
    ciudad,
    whatsapp,
    nombreRestaurante: restaurantName
  });

  // Fetch the lead data from Supabase if we have a leadId but missing user info
  useEffect(() => {
    const fetchLeadData = async () => {
      if (leadId) {
        try {
          console.log("Fetching lead data from Supabase in OnboardingSuccess for leadId:", leadId);
          const { data: lead, error } = await supabase
            .from('leads')
            .select('*')
            .eq('id', leadId)
            .single();
            
          if (error) {
            console.error("Error fetching lead data:", error);
            return;
          }
          
          if (lead) {
            console.log("Retrieved lead data from Supabase:", lead);
            
            // Extract first and last name from name field if needed
            let extractedFirstName = firstName;
            let extractedLastName = lastName;
            
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
            
            // Update lead data state
            setLeadData({
              firstName: extractedFirstName,
              lastName: extractedLastName,
              email: lead.email || email,
              ciudad: lead.ccity || ciudad,
              whatsapp: lead.whatsapp ? lead.whatsapp.replace(/^\+56/, '') : whatsapp,
              nombreRestaurante: lead.company_name || restaurantName
            });
            
            // Log the updated lead data
            console.log("Updated lead data for WhatsApp:", {
              firstName: extractedFirstName,
              lastName: extractedLastName,
              email: lead.email || email,
              ciudad: lead.ccity || ciudad,
              whatsapp: lead.whatsapp ? lead.whatsapp.replace(/^\+56/, '') : whatsapp,
              nombreRestaurante: lead.company_name || restaurantName
            });
          }
        } catch (error) {
          console.error("Error in fetchLeadData:", error);
        }
      } else {
        console.log("Using lead data from location state:", {
          firstName, lastName, email, ciudad, whatsapp, restaurantName
        });
      }
    };
    
    fetchLeadData();
  }, [leadId, firstName, lastName, email, ciudad, whatsapp, restaurantName]);
  
  useEffect(() => {
    pushToDataLayer('onboarding_page_view', { 
      leadId: leadId,
      restaurantName: restaurantName 
    });
  }, [leadId, restaurantName]);

  useEffect(() => {
    if (!leadId) {
      toast({
        title: "Error",
        description: "Error al cargar los datos. Por favor intenta registrarte nuevamente.",
        variant: "destructive"
      });
      navigate('/restaurantes');
      return;
    }

    // Debug console log para verificar los datos recibidos del location state
    console.log("Location state in onboarding:", location.state);
  }, [leadId, navigate, location.state]);

  const suggestedSubdomain = generateSubdomain(restaurantName);

  const [formData, setFormData] = useState({
    rut: "",
    clave: "",
    meses: 3,
    sistema: "sii",
    sistemaCustom: "",
    subdominio: suggestedSubdomain || ""
  });

  useEffect(() => {
    if (suggestedSubdomain && !formData.subdominio) {
      setFormData(prev => ({
        ...prev,
        subdominio: suggestedSubdomain
      }));
    }
  }, [suggestedSubdomain]);

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubdomainChange = (value: string) => {
    updateFormData('subdominio', value);
  };

  const handleNext = async () => {
    setIsLoading(true);
    
    if (currentStep === 0) {
      const saved = await saveFormData(leadId, currentStep, formData, restaurantName);
      setIsLoading(false);
      if (saved) {
        setCurrentStep(prev => prev + 1);
      }
      return;
    }
    
    if (currentStep === 1) {
      const saved = await saveFormData(leadId, currentStep, formData, restaurantName);
      setIsLoading(false);
      if (saved) {
        setCurrentStep(prev => prev + 1);
      }
      return;
    }
    
    if (currentStep === 2) {
      if (!formData.subdominio) {
        setIsLoading(false);
        toast({
          title: "Campo requerido",
          description: "Por favor elige un subdominio",
          variant: "destructive"
        });
        return;
      }
      
      const saved = await saveFormData(leadId, currentStep, formData, restaurantName);
      setIsLoading(false);
      if (saved) {
        setCurrentStep(prev => prev + 1);
      }
      return;
    }
    
    if (currentStep === 3) {
      if (!formData.rut || !formData.clave) {
        setIsLoading(false);
        toast({
          title: "Campos requeridos",
          description: "Por favor completa el RUT y clave del SII",
          variant: "destructive"
        });
        return;
      }
      
      const rutRegex = /^\d{1,8}-[\dkK]$/;
      if (!rutRegex.test(formData.rut)) {
        setIsLoading(false);
        toast({
          title: "Formato incorrecto",
          description: "El RUT debe tener el formato 1234567-8 o 12345678-9",
          variant: "destructive"
        });
        return;
      }
      
      try {
        const validationResult = await validateSiiCredentials(formData.rut, formData.clave);
        if (!validationResult.success) {
          setIsLoading(false);
          toast({
            title: "Credenciales inválidas",
            description: "Las credenciales del SII no son válidas. Por favor verifica e intenta nuevamente.",
            variant: "destructive"
          });
          return;
        }
        
        const saved = await saveFormData(leadId, currentStep, formData, restaurantName);
        if (!saved) {
          setIsLoading(false);
          return;
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (leadId) {
          const numericLeadId = Number(leadId);
          const leadDataForSlack: Partial<Lead> = {
            sistema_facturacion: formData.sistema,
            sistema_custom: formData.sistemaCustom,
            subdominio: formData.subdominio,
            rut: formData.rut,
            meses_datos: formData.meses,
            sii_connected: true
          };
          notifySlackOnboardingStep(numericLeadId, 'onboarding-completed', leadDataForSlack);
          
          pushToDataLayer('onboarding_completed', {
            leadId: numericLeadId,
            restaurantName: restaurantName,
            subdomain: formData.subdominio,
            ...leadDataForSlack
          });
        }
        
        // Create a complete state object with all user data to pass to the success page
        setIsComplete(true);
        setIsLoading(false);
        
        // Ensure we're passing ALL the user data to the success page
        const completeUserData = {
          ...location.state,
          firstName: leadData.firstName,
          lastName: leadData.lastName,
          email: leadData.email,
          ciudad: leadData.ciudad,
          whatsapp: leadData.whatsapp,
          restaurantName: leadData.nombreRestaurante,
          formData: {
            ...formData,
            siiConnected: true
          }
        };
        
        console.log("Navigating to success with complete user data:", completeUserData);
        
        // Navigate with the complete data
        navigate('/onboarding-success', { 
          state: completeUserData,
          replace: true
        });
        
        return;
      } catch (error) {
        toast({
          title: "Error",
          description: "Ha ocurrido un error al conectar con el SII. Intenta nuevamente.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
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
      content: <MonthsSelector 
                selectedMonths={formData.meses} 
                onChange={months => updateFormData('meses', months)} 
              />
    }, 
    {
      title: "Sistema de facturación",
      icon: <Store className="w-6 h-6 text-primary" />,
      description: "Selecciona tu sistema de facturación",
      content: <BillingSystemSelector 
                selectedSystem={formData.sistema} 
                onChange={system => updateFormData('sistema', system)} 
                customSystem={formData.sistemaCustom} 
                onCustomChange={value => updateFormData('sistemaCustom', value)} 
              />
    }, 
    {
      title: "Tu subdominio",
      icon: <Globe className="w-6 h-6 text-primary" />,
      description: "Elige el subdominio para tu acceso personalizado",
      content: <SubdomainInput 
                value={formData.subdominio} 
                onChange={handleSubdomainChange} 
                suggestedSubdomain={suggestedSubdomain} 
              />
    }, 
    {
      title: "Acceso al SII",
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      description: "Ingresa tus credenciales para conectar tus datos",
      content: <SiiCredentialsInput 
                rut={formData.rut}
                clave={formData.clave}
                onRutChange={value => updateFormData('rut', value)}
                onClaveChange={value => updateFormData('clave', value)}
              />
    }
  ];

  return (
    <>
      <Helmet>
        <title>Configura tu cuenta | Ruka.ai</title>
      </Helmet>
      
      <main className="min-h-screen flex flex-col md:flex-row relative">
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-50 to-blue-50 p-8 flex-col overflow-hidden">
          <div className="max-w-md mx-auto flex-1">
            <AnimatePresence mode="wait">
              <LeftSideContent 
                currentStep={currentStep}
                isComplete={isComplete}
              />
            </AnimatePresence>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
          <div className="w-full max-w-md">
            <div className="md:hidden mb-8 flex flex-col items-center text-center">
              <img src="/logo.png" alt="Ruka.ai" className="h-10 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Automatización inteligente</h1>
              <p className="text-slate-600 text-sm mb-6">
                Agentes con IA que procesan, agrupan y monitorean tus transacciones para que tengas control absoluto de tu negocio.
              </p>
            </div>
            
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
                              disabled={currentStep === 0 || isLoading} 
                              className="flex items-center gap-2"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              Atrás
                            </Button>
                            
                            <Button 
                              id={`next-button-step-${currentStep}`} 
                              onClick={handleNext} 
                              disabled={isLoading} 
                              className="flex items-center gap-2"
                            >
                              {!isLoading ? (
                                <>
                                  Siguiente
                                  <ArrowRight className="w-4 h-4" />
                                </>
                              ) : (
                                <>
                                  <Loader className="h-4 w-4 animate-spin mr-2" />
                                  Guardando...
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                        
                        {currentStep === 3 && (
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
                            {!isLoading ? (
                              <>
                                <div className="bg-white rounded-md p-1 flex items-center justify-center">
                                  <img src="/logosii.png" alt="SII" className="h-4" />
                                </div>
                                Iniciar sesión con el SII
                              </>
                            ) : (
                              <span className="flex items-center gap-2">
                                <Loader className="h-4 w-4 animate-spin" />
                                Conectando...
                              </span>
                            )}
                          </Button>
                        )}
                        
                        <div className="mt-8 text-center">
                          <a 
                            href="https://wa.me/56981213314" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            ¿Necesitas ayuda? Contáctanos
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
              >
                <Card className="border shadow-md">
                  <CardContent className="pt-10 pb-10">
                    <SuccessContent />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* WhatsApp Floating Button - Only show when not complete */}
        {/* WhatsApp Floating Button - Only show when not complete */}
      </main>
    </>
  );
};

export default OnboardingSuccess;
