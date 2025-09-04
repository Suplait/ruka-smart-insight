
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

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  nombreHotel: string;
  ciudad: string;
  whatsapp: string;
  codigoPromocional: string;
  acceptTerms: boolean;
}

interface HotelRegistrationFormProps {
  highlightForm: boolean;
  timeLeft: string;
}

export default function HotelRegistrationForm({
  highlightForm,
  timeLeft
}: HotelRegistrationFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    nombreHotel: "",
    ciudad: "",
    whatsapp: "",
    codigoPromocional: "",
    acceptTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
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

      console.log("Submitting hotel registration form...");

      // First, try to send Slack notification and get the timestamp
      let slackTimestamp: string | null = null;
      try {
        // Send Slack notification
        const slackPromise = supabase.functions.invoke('notify-slack', {
          body: {
            lead: {
              company_name: formData.nombreHotel,
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              ccity: formData.ciudad,
              whatsapp: whatsappNumber,
              industry: "hotel"
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

      // Create the lead data object
      const leadDataToInsert: any = {
        company_name: formData.nombreHotel,
        name: `${formData.firstName} ${formData.lastName}`,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        ccity: formData.ciudad,
        whatsapp: whatsappNumber,
        codigo_promocional: formData.codigoPromocional || null
      };

      // Add slack_message_ts if we got it in time
      if (slackTimestamp) {
        leadDataToInsert.slack_message_ts = slackTimestamp;
      }
      
      // Create the lead record with or without the timestamp
      const {
        data: leadData,
        error: leadError
      } = await supabase
        .from('leads')
        .insert([leadDataToInsert])
        .select()
        .single();
      
      if (leadError) {
        console.error("Lead creation error:", leadError);
        throw leadError;
      }

      console.log("Lead created successfully:", leadData);
      const leadId = leadData.id;

      // If we didn't get the timestamp in time, handle the update asynchronously
      if (!slackTimestamp) {
        // This runs in background without blocking the user flow
        supabase.functions.invoke('notify-slack', {
          body: {
            lead: {
              company_name: formData.nombreHotel,
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              ccity: formData.ciudad,
              whatsapp: whatsappNumber,
              industry: "hotel"
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

      // Navigate to onboarding with hotel name and leadId in state
      navigate('/onboarding-success', {
        state: {
          restaurantName: formData.nombreHotel, // Keep the same key for compatibility
          leadId: leadId
        }
      });
    } catch (error) {
      console.error("Form submission error:", error);
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
        <p className="text-lg text-muted-foreground font-medium">
          Si no te sirve o no te gusta, no pagarás ni $1
        </p>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-primary">
            Si te registras antes de las 12:00pm tendrás acceso el mismo día
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock4 className="w-4 h-4" />
            <span>Faltan {timeLeft} para las 12:00pm</span>
          </div>
        </div>
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
        <Input id="registration-hotel-name" name="nombreHotel" placeholder="Nombre de tu Hotel" value={formData.nombreHotel} onChange={handleChange} required className="h-12" disabled={isSubmitting} />
        
        <div className="relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Input 
                    id="registration-promo-code" 
                    name="codigoPromocional" 
                    placeholder="Código promocional (opcional)" 
                    value={formData.codigoPromocional} 
                    onChange={handleChange} 
                    className="h-12 pl-12 pr-4" 
                    disabled={isSubmitting} 
                  />
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
