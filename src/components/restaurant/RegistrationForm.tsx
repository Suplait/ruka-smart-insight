
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, Clock4, ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/supabase";

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

export default function RegistrationForm({ highlightForm, timeLeft }: RegistrationFormProps) {
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
      
      const whatsappNumber = formData.whatsapp 
        ? `+56${formData.whatsapp.replace(/^\+56/, '')}`
        : '';

      console.log('Creating lead with data:', { 
        company_name: formData.nombreRestaurante,
        name: `${formData.firstName} ${formData.lastName}`,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        ccity: formData.ciudad,
        whatsapp: whatsappNumber
      });

      // First create the lead record
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert([
          { 
            company_name: formData.nombreRestaurante,
            name: `${formData.firstName} ${formData.lastName}`,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            ccity: formData.ciudad,
            whatsapp: whatsappNumber
          }
        ])
        .select()
        .single();

      if (leadError) {
        console.error('Error creating lead:', leadError);
        throw leadError;
      }

      // Get the ID of the inserted lead
      const leadId = leadData.id;
      
      console.log('Created lead with ID:', leadId);

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
        
        console.log('Slack notification response:', slackResponse);
        
        if (slackResponse.error) {
          console.warn('Warning: Slack notification failed, but registration can proceed:', slackResponse.error);
          // Don't throw error here, just log warning
        } else if (slackResponse.data?.ts) {
          // Store the Slack message timestamp for future thread replies
          const slackTs = slackResponse.data.ts;
          console.log('Received Slack message ts:', slackTs);
          
          // Use the more reliable Edge Function to update the lead record
          const updateResponse = await supabase.functions.invoke('update-lead', {
            body: {
              leadId: leadId,
              updateData: { slack_message_ts: slackTs }
            }
          });
          
          console.log('Update lead response:', updateResponse);
          
          if (updateResponse.error) {
            console.error('Error updating lead with slack_message_ts:', updateResponse.error);
          } else {
            console.log('Successfully stored Slack message ts with edge function');
            
            // Verification step - Check if the timestamp was actually stored
            const { data: verifyData, error: verifyError } = await supabase
              .from('leads')
              .select('slack_message_ts')
              .eq('id', leadId)
              .single();
              
            if (verifyError) {
              console.error('Error verifying Slack message ts storage:', verifyError);
            } else {
              console.log('Verification result - Slack message ts in database:', verifyData?.slack_message_ts);
              
              if (verifyData.slack_message_ts !== slackTs) {
                console.error('Verification failed: Slack message ts was not stored correctly', {
                  expected: slackTs,
                  actual: verifyData?.slack_message_ts
                });
                
                // Try one more direct update as fallback
                console.log('Attempting direct update as fallback...');
                const { error: directUpdateError } = await supabase
                  .from('leads')
                  .update({ slack_message_ts: slackTs })
                  .eq('id', leadId);
                  
                if (directUpdateError) {
                  console.error('Direct update failed:', directUpdateError);
                } else {
                  // Final verification
                  const { data: finalVerifyData } = await supabase
                    .from('leads')
                    .select('slack_message_ts')
                    .eq('id', leadId)
                    .single();
                    
                  console.log('After direct update, Slack message ts is:', finalVerifyData?.slack_message_ts);
                }
              } else {
                console.log('Verification successful: Slack message ts was stored correctly');
              }
            }
          }
        } else {
          console.warn('Warning: No ts value in Slack response:', slackResponse);
        }
      } catch (slackError) {
        console.warn('Warning: Slack notification error, but registration can proceed:', slackError);
        // Don't throw error here, just log warning
      }

      // Navigate to onboarding with restaurant name and leadId in state
      navigate('/onboarding-success', {
        state: {
          restaurantName: formData.nombreRestaurante,
          leadId: leadId
        }
      });

    } catch (error) {
      console.error('Error during registration:', error);
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
    const { name, value } = e.target;
    
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-xl shadow-xl border p-6 sm:p-8 space-y-6 sm:space-y-8 transition-all duration-300 w-full ${
        highlightForm ? 'ring-4 ring-primary shadow-2xl scale-105' : ''
      }`}
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Comienza tu Prueba Gratuita</h2>
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
          <Input
            id="registration-first-name"
            name="firstName"
            placeholder="Nombre"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="h-12"
            disabled={isSubmitting}
          />
          <Input
            id="registration-last-name"
            name="lastName"
            placeholder="Apellido"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="h-12"
            disabled={isSubmitting}
          />
        </div>
        <Input
          id="registration-email"
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="h-12"
          disabled={isSubmitting}
        />
        <div className="relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Input
                    id="registration-whatsapp"
                    name="whatsapp"
                    placeholder="WhatsApp (opcional)"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="h-12 pl-16 pr-10"
                    disabled={isSubmitting}
                  />
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
        <Input
          id="registration-city"
          name="ciudad"
          placeholder="Ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          required
          className="h-12"
          disabled={isSubmitting}
        />
        <Input
          id="registration-restaurant-name"
          name="nombreRestaurante"
          placeholder="Nombre de tu Restaurante"
          value={formData.nombreRestaurante}
          onChange={handleChange}
          required
          className="h-12"
          disabled={isSubmitting}
        />
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="registration-terms" 
            checked={formData.acceptTerms}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
            }
            disabled={isSubmitting}
          />
          <label
            htmlFor="registration-terms"
            className="text-sm text-muted-foreground leading-relaxed"
          >
            Acepto los{" "}
            <Link 
              to="/terms" 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              términos y condiciones
            </Link>{" "}
            y las{" "}
            <Link 
              to="/privacy" 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              políticas de privacidad
            </Link>
          </label>
        </div>
        
        <div className="space-y-4">
          <Button 
            id="registration-submit"
            type="submit" 
            className="w-full gap-2 h-12 text-lg"
            disabled={!formData.acceptTerms || isSubmitting}
          >
            {isSubmitting ? (
              <>Procesando...</>
            ) : (
              <>Comenzar Ahora <ArrowRight className="w-5 h-5" /></>
            )}
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
    </motion.div>
  );
}
