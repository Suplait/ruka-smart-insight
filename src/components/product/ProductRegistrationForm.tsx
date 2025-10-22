import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackRegistration, pushToDataLayer } from "@/utils/dataLayer";
import { getStoredUTMParams } from "@/utils/utmTracker";
import { Loader2, Sparkles } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  whatsapp: z.string().min(8, "El número de WhatsApp debe tener al menos 8 dígitos"),
  company_name: z.string().min(2, "El nombre de la empresa debe tener al menos 2 caracteres"),
  ccity: z.string().min(2, "La ciudad debe tener al menos 2 caracteres"),
});

type FormData = z.infer<typeof formSchema>;

interface ProductRegistrationFormProps {
  pagePath?: string;
  highlightForm?: boolean;
  timeLeft?: string;
}

export default function ProductRegistrationForm({ 
  pagePath,
  highlightForm = false,
  timeLeft = ""
}: ProductRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    // Track form submission for specific product pages
    if (pagePath === '/productos/cuentas-por-pagar') {
      pushToDataLayer('cuentas_por_pagar_form_submit', {
        form_name: 'product_registration',
        page_path: pagePath,
        company_name: data.company_name,
        city: data.ccity
      });
    } else if (pagePath === '/productos/stock') {
      pushToDataLayer('stock_form_submit', {
        form_name: 'product_registration',
        page_path: pagePath,
        company_name: data.company_name,
        city: data.ccity
      });
    } else if (pagePath === '/productos/panel-control') {
      pushToDataLayer('panel_control_form_submit', {
        form_name: 'product_registration',
        page_path: pagePath,
        company_name: data.company_name,
        city: data.ccity
      });
    }

    try {
      const utmParams = getStoredUTMParams();
      
      // First, try to send Slack notification and get the timestamp
      let slackTimestamp: string | null = null;
      try {
        // Send Slack notification
        const slackPromise = supabase.functions.invoke('notify-slack', {
          body: {
            lead: {
              company_name: data.company_name,
              name: data.name,
              email: data.email,
              ccity: data.ccity,
              whatsapp: data.whatsapp,
              page_path: pagePath || window.location.pathname
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
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        company_name: data.company_name,
        ccity: data.ccity,
        page_path: pagePath || window.location.pathname,
        ...utmParams,
      };

      // Add slack_message_ts if we got it in time
      if (slackTimestamp) {
        leadDataToInsert.slack_message_ts = slackTimestamp;
      }

      // Insert the lead record with or without the timestamp
      const { data: leadData, error } = await supabase
        .from("leads")
        .insert([leadDataToInsert])
        .select()
        .single();

      if (error) throw error;

      const leadId = leadData.id;

      // If we didn't get the timestamp in time, handle the update asynchronously
      if (!slackTimestamp) {
        // This runs in background without blocking the user flow
        supabase.functions.invoke('notify-slack', {
          body: {
            lead: {
              company_name: data.company_name,
              name: data.name,
              email: data.email,
              ccity: data.ccity,
              whatsapp: data.whatsapp,
              page_path: pagePath || window.location.pathname
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

      trackRegistration({ lead_id: leadId, company_name: data.company_name }, true);
      
      setShowSuccess(true);
      toast.success("¡Registro exitoso! Nos pondremos en contacto contigo pronto.");
      reset();
      
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error("Error al registrar:", error);
      trackRegistration({}, false);
      toast.error("Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <Card className="border-2 border-primary shadow-lg">
        <CardContent className="pt-8 pb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">¡Gracias por tu interés!</h3>
            <p className="text-gray-600 mb-4">
              Hemos recibido tu información. Nuestro equipo se pondrá en contacto contigo en las próximas 24 horas.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 shadow-lg transition-all duration-300 ${
      highlightForm ? 'border-primary animate-pulse' : 'border-gray-200'
    }`}>
      <CardContent className="pt-8 pb-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">Comienza tu transformación digital</h3>
          <p className="text-gray-600">
            Completa el formulario y te contactaremos en 24 horas
          </p>
          {timeLeft && (
            <div className="mt-2 text-sm text-primary font-medium">
              ⏰ Respuesta garantizada en {timeLeft}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre completo *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Juan Pérez"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Correo electrónico *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="juan@empresa.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="whatsapp">WhatsApp *</Label>
            <Input
              id="whatsapp"
              {...register("whatsapp")}
              placeholder="+56912345678"
              className={errors.whatsapp ? "border-red-500" : ""}
            />
            {errors.whatsapp && (
              <p className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="company_name">Empresa *</Label>
            <Input
              id="company_name"
              {...register("company_name")}
              placeholder="Mi Empresa S.A."
              className={errors.company_name ? "border-red-500" : ""}
            />
            {errors.company_name && (
              <p className="text-red-500 text-sm mt-1">{errors.company_name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="ccity">Ciudad *</Label>
            <Input
              id="ccity"
              {...register("ccity")}
              placeholder="Santiago"
              className={errors.ccity ? "border-red-500" : ""}
            />
            {errors.ccity && (
              <p className="text-red-500 text-sm mt-1">{errors.ccity.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full text-lg py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                Comenzar ahora
                <Sparkles className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Al enviar este formulario, aceptas nuestros términos y condiciones.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
