import { Helmet } from "react-helmet";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Database, LockKeyhole, Calendar, Store, Check, Globe, ShieldCheck, Clock4, Info, Loader, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

const valueMessages = [
  "Automatiza el registro de compras.",
  "Controla tu margen al día, no al mes.",
  "Descubre alzas de precio de tus insumos en tiempo real.",
  "Genera reportes en segundos usando lenguaje natural.",
  "Gestiona simple el pago a tus proveedores.",
  "Ten toda tu información a la mano.",
  "Libera HH a la semana para que te enfoques en lo que importa.",
];

type StepProps = {
  currentStep: number;
  totalSteps: number;
};

const StepIndicator = ({
  currentStep,
  totalSteps
}: StepProps) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div 
          key={index} 
          className={`h-2.5 rounded-full transition-all duration-300 ${
            index < currentStep 
              ? "w-8 bg-primary" 
              : index === currentStep 
                ? "w-8 bg-primary" 
                : "w-2.5 bg-gray-200"
          }`} 
        />
      ))}
    </div>
  );
};

const MonthsSelector = ({
  selectedMonths,
  onChange
}: {
  selectedMonths: number;
  onChange: (months: number) => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-medium text-blue-700 mb-1">¿Por qué necesitamos esto?</h4>
            <p className="text-sm text-blue-600">
              Selecciona el período de datos históricos que importaremos para análisis.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(month => (
          <button 
            key={month} 
            type="button" 
            onClick={() => onChange(month)} 
            className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center ${
              selectedMonths === month 
                ? "border-primary bg-primary/5" 
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className="text-2xl font-semibold">{month}</span>
            <span className="text-sm text-muted-foreground">
              {month === 1 ? "mes" : "meses"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const BillingSystemSelector = ({
  selectedSystem,
  onChange,
  customSystem,
  onCustomChange
}: {
  selectedSystem: string;
  onChange: (system: string) => void;
  customSystem: string;
  onCustomChange: (value: string) => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-medium text-blue-700 mb-1">¿Por qué es importante?</h4>
            <p className="text-sm text-blue-600">
              Conectaremos tu sistema de facturación para automatizar tu contabilidad.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          type="button" 
          onClick={() => onChange("sii")} 
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            selectedSystem === "sii" 
              ? "border-primary bg-primary/5" 
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="font-medium">SII Gratuito</div>
          <div className="text-sm text-muted-foreground">Sistema oficial del SII</div>
        </button>
        
        <button 
          type="button" 
          onClick={() => onChange("mercado")} 
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            selectedSystem === "mercado" 
              ? "border-primary bg-primary/5" 
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="font-medium">Facturador de Mercado</div>
          <div className="text-sm text-muted-foreground">Sistema de terceros</div>
        </button>
      </div>
      
      {selectedSystem === "mercado" && (
        <div className="mt-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
          <label className="text-sm font-medium mb-2 block">¿Cuál sistema utilizas?</label>
          <Input 
            value={customSystem} 
            onChange={e => onCustomChange(e.target.value)} 
            placeholder="Nubox, Bsale, Toteat, etc." 
            className="bg-white" 
          />
        </div>
      )}
    </div>
  );
};

const SubdomainInput = ({
  value,
  onChange,
  suggestedSubdomain
}: {
  value: string;
  onChange: (value: string) => void;
  suggestedSubdomain: string;
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  
  useEffect(() => {
    if (!value) return;
    
    setIsChecking(true);
    setIsAvailable(false);
    
    const timer = setTimeout(() => {
      setIsChecking(false);
      setIsAvailable(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-medium text-blue-700 mb-1">Tu portal personalizado</h4>
            <p className="text-sm text-blue-600">
              Este será el enlace de acceso exclusivo a tu plataforma.
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="relative">
          <Input 
            value={value} 
            onChange={e => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} 
            placeholder="tu-empresa" 
            className="pr-[120px]" 
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            .ruka.ai
          </div>
        </div>
        
        <div className="mt-2 text-sm text-muted-foreground">
          Sugerencia basada en el nombre de tu empresa.
        </div>
        
        <div className="mt-2 text-sm">
          {isChecking ? (
            <span className="text-amber-600 flex items-center gap-1">
              <Loader className="w-4 h-4 animate-spin" /> Comprobando disponibilidad...
            </span>
          ) : isAvailable ? (
            <span className="text-green-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Subdominio disponible
            </span>
          ) : (
            <span className="text-red-600 flex items-center gap-1">
              <span className="w-4 h-4">✖</span> Subdominio no disponible
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const SLIDE_INTERVAL = 2500; // 2.5 seconds in milliseconds

const OnboardingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const totalSteps = 4;
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(100);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % valueMessages.length);
    }, SLIDE_INTERVAL);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / SLIDE_INTERVAL) * 100);
      setProgress(remaining);

      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      }
    };

    setProgress(100);
    requestAnimationFrame(updateProgress);
  }, [activeSlide]);

  useEffect(() => {
    const carousel = document.querySelector('[data-carousel="value-messages"]');
    if (carousel) {
      const api = (carousel as any).__embla;
      if (api) {
        api.scrollTo(activeSlide);
      }
    }
  }, [activeSlide]);

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubdomainChange = (value: string) => {
    updateFormData('subdominio', value);
  };

  const saveFormData = async () => {
    try {
      const leadId = location.state?.leadId;
      if (leadId) {
        console.log('Saving form data for step', currentStep, formData);
      }
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const handleNext = async () => {
    if (currentStep === 0) {
    } else if (currentStep === 1) {
      if (formData.sistema === "mercado" && !formData.sistemaCustom) {
        toast({
          title: "Campo requerido",
          description: "Por favor indica cuál sistema de facturación utilizas",
          variant: "destructive"
        });
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.subdominio) {
        toast({
          title: "Campo requerido",
          description: "Por favor elige un subdominio",
          variant: "destructive"
        });
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.rut || !formData.clave) {
        toast({
          title: "Campos requeridos",
          description: "Por favor completa el RUT y clave del SII",
          variant: "destructive"
        });
        return;
      }

      const rutRegex = /^\d{1,8}-[\dkK]$/;
      if (!rutRegex.test(formData.rut)) {
        toast({
          title: "Formato incorrecto",
          description: "El RUT debe tener el formato 1234567-8 o 12345678-9",
          variant: "destructive"
        });
        return;
      }

      try {
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 6000));
        await saveFormData();

        setIsComplete(true);
        setIsLoading(false);
        return;
      } catch (error) {
        console.error('Error submitting form:', error);
        toast({
          title: "Error",
          description: "Ha ocurrido un error al conectar con el SII. Intenta nuevamente.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
    }

    await saveFormData();
    setCurrentStep(prev => prev + 1);
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
      icon: <LockKeyhole className="w-6 h-6 text-primary" />,
      description: "Ingresa tus credenciales para conectar tus datos",
      content: (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-blue-700 mb-1">Conexión con el SII</h4>
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
                value={formData.rut} 
                onChange={e => updateFormData('rut', e.target.value)} 
                placeholder="12345678-9" 
              />
              <p className="text-xs text-muted-foreground">Ingresa el RUT con guión y dígito verificador</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Clave del SII</label>
              <Input 
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
      
      <p className="text-gray-600">
        Tu plataforma de automatización contable está lista. En breve 
        recibirás tus credenciales para comenzar a utilizar Ruka.ai.
      </p>
      
      <div className="pt-4">
        <Button onClick={() => navigate('/')} className="px-6">
          Ir al inicio
        </Button>
      </div>
    </div>
  );

  const currentStepData = steps[currentStep];

  const openYoutubeInNewTab = () => {
    window.open("https://www.youtube.com/embed/1wV-corpO74", "_blank");
  };

  return (
    <>
      <Helmet>
        <title>Configura tu cuenta | Ruka.ai</title>
      </Helmet>
      
      <main className="min-h-screen flex flex-col md:flex-row">
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-50 to-blue-50 p-8 flex-col">
          <div className="max-w-md mx-auto flex flex-col h-full items-center justify-center text-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <img src="/logo.png" alt="Ruka.ai" className="h-12 mx-auto" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-10"
            >
              <div className="mb-6 relative">
                <div className="absolute -bottom-4 left-0 w-full h-1 bg-gray-100 rounded overflow-hidden">
                  <div 
                    className="h-full bg-primary/50 transition-all duration-200 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <Carousel className="w-full max-w-md" data-carousel="value-messages">
                  <CarouselContent>
                    {valueMessages.map((message, index) => (
                      <CarouselItem key={index}>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                          {message}
                        </h1>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
              <p className="text-slate-600 text-xl max-w-md mx-auto">
                Agentes con IA que procesan, agrupan y monitorean tus transacciones para que tengas control absoluto de tu negocio.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden shadow-xl border border-white/80 mb-4"
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
            
            <button 
              onClick={openYoutubeInNewTab} 
              className="mb-12 text-sm text-slate-500 flex items-center gap-1 hover:text-primary transition-colors"
            >
              Seguir viendo en segundo plano <ExternalLink className="w-3 h-3 ml-1" />
            </button>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-4">
                  Respaldado por líderes en tecnología
                </p>
                <div className="flex justify-center items-center gap-8">
                  <img src="/microsoft2.png" alt="Microsoft" className="h-8 opacity-75 hover:opacity-100 transition-opacity duration-300" />
                  <img src="/openai2.png" alt="OpenAI" className="h-8 opacity-75 hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
          <div className="w-full max-w-md">
            <div className="md:hidden mb-8 flex flex-col items-center text-center">
              <img src="/logo.png" alt="Ruka.ai" className="h-10 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Automatización contable inteligente</h1>
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
                
                <Card className="border shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        {currentStepData.icon}
                      </div>
                      <div>
                        <CardTitle>{currentStepData.title}</CardTitle>
                        <CardDescription>{currentStepData.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-8">
                    {currentStepData.content}
                    
                    {currentStep < 3 && (
                      <div className="flex justify-between mt-10">
                        <Button 
                          variant="outline" 
                          onClick={handleBack} 
                          disabled={currentStep === 0} 
                          className="gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" /> Atrás
                        </Button>
                        
                        <Button onClick={handleNext} className="gap-2">
                          Siguiente <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    {currentStep === 3 && (
                      <div className="flex justify-start mt-6">
                        <Button variant="outline" onClick={handleBack} className="gap-2">
                          <ArrowLeft className="w-4 h-4" /> Atrás
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
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
