
import { Helmet } from "react-helmet";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight, 
  Database, 
  LockKeyhole, 
  Calendar, 
  Store, 
  Check, 
  Globe, 
  ShieldCheck,
  Clock4
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

type StepProps = {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepProps) => {
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
    <div className="grid grid-cols-3 gap-4 mt-2">
      {[1, 2, 3].map((month) => (
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
    <div className="space-y-4 mt-2">
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
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder="Ej: Defontana, Bsale, etc."
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
  isAvailable, 
  isChecking 
}: { 
  value: string; 
  onChange: (value: string) => void;
  isAvailable: boolean | null;
  isChecking: boolean;
}) => {
  return (
    <div className="mt-2">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="tu-restaurante"
            className="pr-[120px]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            .ruka.ai
          </div>
        </div>
      </div>
      
      {value && (
        <div className="mt-2 text-sm">
          {isChecking ? (
            <span className="text-muted-foreground">Verificando disponibilidad...</span>
          ) : isAvailable ? (
            <span className="text-green-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Subdominio disponible
            </span>
          ) : (
            <span className="text-red-500">Este subdominio no está disponible</span>
          )}
        </div>
      )}
    </div>
  );
};

export default function OnboardingSuccess() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
  
  // Form state
  const [formData, setFormData] = useState({
    rut: "",
    clave: "",
    meses: 1,
    sistema: "sii",
    sistemaCustom: "",
    subdominio: "",
  });
  
  const [isSubdomainChecking, setIsSubdomainChecking] = useState(false);
  const [isSubdomainAvailable, setIsSubdomainAvailable] = useState<boolean | null>(null);
  
  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  const checkSubdomainAvailability = async (subdomain: string) => {
    if (!subdomain) {
      setIsSubdomainAvailable(null);
      return;
    }
    
    setIsSubdomainChecking(true);
    
    // Simulated check - in a real implementation, this would call an API
    // You would need to implement an actual check against your database
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes: consider subdomains with 'test' as unavailable
      const available = !subdomain.includes('test');
      setIsSubdomainAvailable(available);
    } catch (error) {
      console.error('Error checking subdomain:', error);
      setIsSubdomainAvailable(null);
    } finally {
      setIsSubdomainChecking(false);
    }
  };
  
  // Check subdomain when it changes
  const handleSubdomainChange = (value: string) => {
    updateFormData('subdominio', value);
    checkSubdomainAvailability(value);
  };
  
  const handleNext = async () => {
    // Validate current step based on the new order
    if (currentStep === 0) {
      // Validating months
      // Nothing to validate here, any selection is valid
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
      
      if (!isSubdomainAvailable) {
        toast({
          title: "Subdominio no disponible",
          description: "Por favor elige otro subdominio",
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
      
      // Validate RUT format (simplified)
      const rutRegex = /^\d{1,8}-[\dkK]$/;
      if (!rutRegex.test(formData.rut)) {
        toast({
          title: "Formato incorrecto",
          description: "El RUT debe tener el formato 12345678-9",
          variant: "destructive"
        });
        return;
      }
      
      // Final step - submit form data
      try {
        // Here you would save all the data to your database
        // For demo purposes, we'll just show a success message
        
        toast({
          title: "¡Configuración completada!",
          description: "Estamos preparando tu cuenta. Te notificaremos cuando esté lista.",
        });
        
        // Navigate to dashboard or confirmation page
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
        
        return;
      } catch (error) {
        console.error('Error submitting form:', error);
        toast({
          title: "Error",
          description: "Ha ocurrido un error al guardar la información. Intenta nuevamente.",
          variant: "destructive"
        });
        return;
      }
    }
    
    // Move to next step
    setCurrentStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  // Reordered steps as requested
  const steps = [
    {
      title: "Periodo de datos",
      icon: <Calendar className="w-6 h-6 text-primary" />,
      description: "¿Cuántos meses de datos quieres cargar?",
      content: (
        <MonthsSelector 
          selectedMonths={formData.meses} 
          onChange={(months) => updateFormData('meses', months)} 
        />
      )
    },
    {
      title: "Sistema de facturación",
      icon: <Store className="w-6 h-6 text-primary" />,
      description: "Selecciona tu sistema de facturación",
      content: (
        <BillingSystemSelector 
          selectedSystem={formData.sistema}
          onChange={(system) => updateFormData('sistema', system)}
          customSystem={formData.sistemaCustom}
          onCustomChange={(value) => updateFormData('sistemaCustom', value)}
        />
      )
    },
    {
      title: "Tu subdominio",
      icon: <Globe className="w-6 h-6 text-primary" />,
      description: "Elige el subdominio para acceder a tu cuenta",
      content: (
        <SubdomainInput 
          value={formData.subdominio}
          onChange={handleSubdomainChange}
          isAvailable={isSubdomainAvailable}
          isChecking={isSubdomainChecking}
        />
      )
    },
    {
      title: "Acceso al SII",
      icon: <LockKeyhole className="w-6 h-6 text-primary" />,
      description: "Ingresa tus credenciales del SII para conectar tus datos",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">RUT</label>
            <Input 
              value={formData.rut}
              onChange={(e) => updateFormData('rut', e.target.value)}
              placeholder="12345678-9"
            />
            <p className="text-xs text-muted-foreground">Ingresa el RUT con guión y dígito verificador</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Clave del SII</label>
            <Input 
              type="password"
              value={formData.clave}
              onChange={(e) => updateFormData('clave', e.target.value)}
              placeholder="••••••••"
            />
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <ShieldCheck className="w-4 h-4 mr-1 text-green-600" />
              Tus datos están seguros y encriptados
            </div>
          </div>
        </div>
      )
    }
  ];
  
  const currentStepData = steps[currentStep];

  // Feature illustrations
  const illustrations = [
    {
      title: "Acceso inmediato a tus datos",
      description: "Conectamos con el SII para importar automáticamente tus facturas y boletas.",
      icon: <Clock4 className="w-8 h-8 text-primary" />
    },
    {
      title: "Analítica avanzada",
      description: "Visualiza indicadores clave para optimizar tu restaurante.",
      icon: <Database className="w-8 h-8 text-primary" />
    },
    {
      title: "100% seguro",
      description: "Tus datos están protegidos con la máxima seguridad.",
      icon: <ShieldCheck className="w-8 h-8 text-primary" />
    }
  ];

  return (
    <>
      <Helmet>
        <title>Configura tu cuenta | Ruka.ai</title>
      </Helmet>
      
      <main className="min-h-screen flex flex-col md:flex-row bg-white">
        {/* Left panel (illustrations and info) */}
        <div className="hidden md:flex md:w-1/2 bg-slate-50 p-12 flex-col justify-center">
          <div className="max-w-md mx-auto">
            <div className="mb-12">
              <img src="/logo.png" alt="Ruka.ai" className="h-12" />
            </div>
            
            <h1 className="text-3xl font-bold mb-6">Configura tu restaurante en Ruka.ai</h1>
            <p className="text-muted-foreground mb-12">
              En solo unos minutos estarás aprovechando todo el potencial de 
              Ruka.ai para optimizar tu negocio.
            </p>
            
            <div className="space-y-8">
              {illustrations.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                  className="flex gap-4 items-start"
                >
                  <div className="rounded-full bg-primary/10 p-3 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right panel (form steps) */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            {/* Logo for mobile */}
            <div className="md:hidden mb-8 flex justify-center">
              <img src="/logo.png" alt="Ruka.ai" className="h-10" />
            </div>
            
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
            
            <Card className="border shadow-sm">
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
                
                <div className="flex justify-between mt-10">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Atrás
                  </Button>
                  
                  <Button 
                    onClick={handleNext}
                    className="gap-2"
                  >
                    {currentStep === totalSteps - 1 ? (
                      <>Finalizar</>
                    ) : (
                      <>Siguiente <ArrowRight className="w-4 h-4" /></>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>¿Necesitas ayuda? <a href="#" className="text-primary hover:underline">Contáctanos</a></p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
