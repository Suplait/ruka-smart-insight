import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, Clock4, ShieldCheck, Info, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { pushToDataLayer, trackFormSubmission, trackRegistration, trackWhatsAppClick } from "@/utils/dataLayer";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  nombreRestaurante: string;
  ciudad: string;
  whatsapp: string;
  acceptTerms: boolean;
}

interface RegistrationFormProps {
  highlightForm: boolean;
  timeLeft: string;
}

export default function RegistrationForm({
  highlightForm,
  timeLeft
}: RegistrationFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    nombreRestaurante: "",
    ciudad: "",
    whatsapp: "",
    acceptTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    pushToDataLayer('registration_form_submit_attempt', {
      has_terms_accepted: formData.acceptTerms
    });
    
    if (!formData.acceptTerms) {
      pushToDataLayer('registration_validation_error', {
        error_type: 'terms_not_accepted'
      });
      
      toast({
        title: "Error",
        description: "Debes aceptar los términos y condiciones para continuar.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const whatsappNumber = formData.whatsapp ? `+56${formData.whatsapp.replace(/^\+56/, '')}` : '';
      
      trackFormSubmission('restaurant_registration', {
        email_domain: formData.email.split('@')[1],
        has_whatsapp: !!formData.whatsapp,
        city: formData.ciudad,
        company_name: formData.nombreRestaurante
      }, true);

      // First create the lead record
      const {
        data: leadData,
        error: leadError
      } = await supabase.from('leads').insert([{
        company_name: formData.nombreRestaurante,
        name: `${formData.firstName} ${formData.lastName}`,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        ccity: formData.ciudad,
        whatsapp: whatsappNumber
      }]).select().single();
      
      if (leadError) {
        throw leadError;
      }

      // Get the ID of the inserted lead
      const leadId = leadData.id;
      
      pushToDataLayer('lead_created', {
        lead_id: leadId,
        company_name: formData.nombreRestaurante
      });

      // Send notification to Slack about the new lead (only for initial registration)
      try {
        const slackResponse = await supabase.functions.invoke('notify-slack', {
          body: {
            lead: {
              company_name: formData.nombreRestaurante,
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              ccity: formData.ciudad,
              whatsapp: whatsappNumber
            },
            isOnboarding: false // Esta es una notificación inicial, no una actualización de onboarding
          }
        });
        
        if (slackResponse.error) {
          // Don't throw error here, just log warning
        } else if (slackResponse.data?.ts) {
          // Store the Slack message timestamp for future thread replies
          const slackTs = slackResponse.data.ts;
          
          pushToDataLayer('slack_notification_sent', {
            lead_id: leadId
          });

          // Use the more reliable Edge Function to update the lead record
          const updateResponse = await supabase.functions.invoke('update-lead', {
            body: {
              leadId: leadId,
              updateData: {
                slack_message_ts: slackTs
              }
            }
          });
          if (updateResponse.error) {
            // Error handling
          } else {
            // Verification step - Check if the timestamp was actually stored
            const {
              data: verifyData,
              error: verifyError
            } = await supabase.from('leads').select('slack_message_ts').eq('id', leadId).single();
            if (verifyError) {
              // Error handling
            } else {
              if (verifyData.slack_message_ts !== slackTs) {
                // Try one more direct update as fallback
                const {
                  error: directUpdateError
                } = await supabase.from('leads').update({
                  slack_message_ts: slackTs
                }).eq('id', leadId);
                if (directUpdateError) {
                  // Error handling
                } else {
                  // Final verification
                  const {
                    data: finalVerifyData
                  } = await supabase.from('leads').select('slack_message_ts').eq('id', leadId).single();
                }
              }
            }
          }
        }
      } catch (slackError) {
        // Don't throw error here, just log warning
      }

      trackRegistration({
        lead_id: leadId,
        restaurant_name: formData.nombreRestaurante
      }, true);

      // Navigate to onboarding with restaurant name and leadId in state
      navigate('/onboarding-success', {
        state: {
          restaurantName: formData.nombreRestaurante,
          leadId: leadId
        }
      });
    } catch (error) {
      trackRegistration({
        error_message: error instanceof Error ? error.message : 'Unknown error'
      }, false);
      
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu información. Por favor intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    if (name === 'whatsapp') {
      const cleanedValue = value.replace(/^\+56/, '').replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: cleanedValue
      }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick('restaurant_registration_form', 'whatsapp_onboarding');
  };

  return <motion.div initial={{
    opacity: 0,
    scale: 0.95
  }} animate={{
    opacity: 1,
    scale: 1
  }} className={`bg-white rounded-xl shadow-xl border p-6 sm:p-8 space-y-6 sm:space-y-8 transition-all duration-300 w-full ${highlightForm ? 'ring-4 ring-primary shadow-2xl scale-105' : ''}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">Prueba Ruka por 30 días</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[200px] p-3">
                <p>Si no te gusta, no pagarás ni un peso. </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-primary">
            Si te registras antes de las 12:00pm tendrás acceso el mismo día
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock4 className="w-4 h-4" />
            <span>Faltan {timeLeft} para las 12:00pm</span>
          </div>
          <div className="relative mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 text-muted-foreground hover:text-green-500 hover:border-green-500 w-full"
              onClick={handleWhatsAppClick}
              asChild
            >
              <Link to="/whatsapp">
                <div className="flex items-center gap-2">
                  <img src="/lovable-uploads/950f4b99-40ab-40a3-a017-7375458df29d.png" alt="WhatsApp" className="w-4 h-4" />
                  Prefiero hacerlo por WhatsApp
                </div>
              </Link>
            </Button>
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              Nuevo
            </span>
          </div>
        </div>
      </div>
      
      <Separator className="h-px bg-gray-200 my-2" />

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input id="registration-first-name" name="firstName" placeholder="Nombre" value={formData.firstName} onChange={handleChange} required className="h-12" disabled={isSubmitting} />
          <Input id="registration-last-name" name="lastName" placeholder="Apellido" value={formData.lastName} onChange={handleChange} required className="h-12" disabled={isSubmitting} />
        </div>
        <Input id="registration-email" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="h-12" disabled={isSubmitting} />
        <div className="relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Input id="registration-whatsapp" name="whatsapp" placeholder="WhatsApp (opcional)" value={formData.whatsapp} onChange={handleChange} className="h-12 pl-16 pr-10" disabled={isSubmitting} />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    +56
                  </div>
                  <Info className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Déjanos tu WhatsApp para contactarte más rápido</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input id="registration-city" name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} required className="h-12" disabled={isSubmitting} />
        <Input id="registration-restaurant-name" name="nombreRestaurante" placeholder="Nombre de tu Restaurante" value={formData.nombreRestaurante} onChange={handleChange} required className="h-12" disabled={isSubmitting} />
        
        <div className="flex items-start space-x-2">
          <Checkbox id="registration-terms" checked={formData.acceptTerms} onCheckedChange={checked => setFormData(prev => ({
          ...prev,
          acceptTerms: checked as boolean
        }))} disabled={isSubmitting} />
          <label htmlFor="registration-terms" className="text-sm text-muted-foreground leading-relaxed">
            Acepto los{" "}
            <Link to="/terms" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              términos y condiciones
            </Link>{" "}
            y las{" "}
            <Link to="/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              políticas de privacidad
            </Link>
          </label>
        </div>
        
        <div className="space-y-4">
          <Button id="registration-submit" type="submit" className="w-full gap-2 h-12 text-lg" disabled={!formData.acceptTerms || isSubmitting}>
            {isSubmitting ? <>Procesando...</> : <>Comenzar Ahora <ArrowRight className="w-5 h-5" /></>}
          </Button>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ShieldCheck className="w-4 h-4" />
              <span>Datos seguros</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock4 className="w-4 h-4" />
              <span>Soporte 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CreditCard className="w-4 h-4" />
              <span>Sin tarjeta</span>
            </div>
          </div>
        </div>
      </form>
    </motion.div>;
}
