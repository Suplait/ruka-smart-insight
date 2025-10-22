import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, Clock4, ShieldCheck, Info, HelpCircle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { pushToDataLayer, trackFormSubmission, trackRegistration } from "@/utils/dataLayer";
import { getStoredUTMParams } from "@/utils/utmTracker";
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  nombreRestaurante: string;
  ciudad: string;
  whatsapp: string;
  codigoPromocional: string;
  acceptTerms: boolean;
}
interface RegistrationFormProps {
  highlightForm: boolean;
  timeLeft: string;
  pagePath?: string;
}
export default function RegistrationForm({
  highlightForm,
  timeLeft,
  pagePath
}: RegistrationFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    nombreRestaurante: "",
    ciudad: "",
    whatsapp: "",
    codigoPromocional: "",
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
        company_name: formData.nombreRestaurante,
        has_promo_code: !!formData.codigoPromocional
      }, true);

      // First, try to send Slack notification and get the timestamp
      let slackTimestamp: string | null = null;
      try {
        // Send Slack notification
        const slackPromise = supabase.functions.invoke('notify-slack', {
          body: {
            lead: {
              company_name: formData.nombreRestaurante,
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              ccity: formData.ciudad,
              whatsapp: whatsappNumber
            },
            isOnboarding: false
          }
        });

        // Create a timeout promise (10 seconds)
        const timeoutPromise = new Promise<null>(resolve => {
          setTimeout(() => resolve(null), 10000);
        });

        // Race between Slack response and timeout
        const slackResult = await Promise.race([slackPromise, timeoutPromise]);

        // If Slack responded in time and has a timestamp, store it
        if (slackResult && !slackResult.error && slackResult.data?.ts) {
          slackTimestamp = slackResult.data.ts;
          console.log('Slack timestamp received in time:', slackTimestamp);
        } else {
          console.log('Slack notification timed out or failed, proceeding without timestamp');
        }
      } catch (slackError) {
        console.log('Slack notification error, proceeding without timestamp:', slackError);
      }

      // Get stored UTM parameters
      const utmParams = getStoredUTMParams();

      // Create the lead data object
      const leadDataToInsert: any = {
        company_name: formData.nombreRestaurante,
        name: `${formData.firstName} ${formData.lastName}`,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        ccity: formData.ciudad,
        whatsapp: whatsappNumber,
        codigo_promocional: formData.codigoPromocional || null,
        page_path: pagePath || window.location.pathname,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        utm_content: utmParams.utm_content
      };

      // Add slack_message_ts if we got it in time
      if (slackTimestamp) {
        leadDataToInsert.slack_message_ts = slackTimestamp;
      }

      // Insert the lead record with or without the timestamp
      const {
        data: leadData,
        error: leadError
      } = await supabase.from('leads').insert([leadDataToInsert]).select().single();
      if (leadError) {
        throw leadError;
      }
      const leadId = leadData.id;
      pushToDataLayer('lead_created', {
        lead_id: leadId,
        company_name: formData.nombreRestaurante
      });

      // If we didn't get the timestamp in time, handle the update asynchronously
      if (!slackTimestamp) {
        // This runs in background without blocking the user flow
        supabase.functions.invoke('notify-slack', {
          body: {
            lead: {
              company_name: formData.nombreRestaurante,
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              ccity: formData.ciudad,
              whatsapp: whatsappNumber
            },
            isOnboarding: false
          }
        }).then(slackResponse => {
          if (!slackResponse.error && slackResponse.data?.ts) {
            // Update the lead with the timestamp when it arrives
            supabase.functions.invoke('update-lead', {
              body: {
                leadId: leadId,
                updateData: {
                  slack_message_ts: slackResponse.data.ts
                }
              }
            }).catch(updateError => {
              console.log('Error updating lead with late timestamp:', updateError);
            });
          }
        }).catch(slackError => {
          console.log('Background Slack notification failed:', slackError);
        });
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
  return <motion.div initial={{
    opacity: 0,
    scale: 0.95
  }} animate={{
    opacity: 1,
    scale: 1
  }} className={`bg-white rounded-xl shadow-xl border p-6 sm:p-8 space-y-6 sm:space-y-8 transition-all duration-300 w-full ${highlightForm ? 'ring-4 ring-primary shadow-2xl scale-105' : ''}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">Agenda una llamada  con nuestro equipo 📞</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[200px] p-3">
                <p>Implementación completa en menos de 48 horas</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-lg text-muted-foreground font-medium">Te ayudaremos a tener IA trabajando en tu negocio en menos de 48hrs.</p>
      </div>

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
        <Input id="registration-restaurant-name" name="nombreRestaurante" placeholder="Nombre de tu Empresa" value={formData.nombreRestaurante} onChange={handleChange} required className="h-12" disabled={isSubmitting} />
        
        <div className="relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Input id="registration-promo-code" name="codigoPromocional" placeholder="Código promocional (opcional)" value={formData.codigoPromocional} onChange={handleChange} className="h-12 pl-12 pr-4" disabled={isSubmitting} />
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>¿Tienes un código promocional? Ingrésalo aquí</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
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
            {isSubmitting ? <>Procesando...</> : <>
                Agendar Llamada <ArrowRight className="w-5 h-5" />
              </>}
          </Button>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ShieldCheck className="w-4 h-4" />
              <span>Datos seguros</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock4 className="w-4 h-4" />
              <span>Implementación 48hrs</span>
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