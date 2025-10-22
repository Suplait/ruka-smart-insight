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
import { trackRegistration } from "@/utils/dataLayer";
import { getStoredUTMParams } from "@/utils/utmTracker";
import { Loader2, Sparkles } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  whatsapp: z.string().min(8, "El número de WhatsApp debe tener al menos 8 dígitos"),
  company_name: z.string().min(2, "El nombre de la empresa debe tener al menos 2 caracteres"),
  ccity: z.string().min(2, "La ciudad debe tener al menos 2 caracteres"),
  message: z.string().optional(),
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

    try {
      const utmParams = getStoredUTMParams();
      
      const leadData = {
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        company_name: data.company_name,
        ccity: data.ccity,
        page_path: pagePath || window.location.pathname,
        ...utmParams,
      };

      const { error } = await supabase
        .from("leads")
        .insert([leadData]);

      if (error) throw error;

      trackRegistration(leadData, true);
      
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

          <div>
            <Label htmlFor="message">Mensaje (opcional)</Label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder="Cuéntanos más sobre tus necesidades..."
              rows={3}
              className={errors.message ? "border-red-500" : ""}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
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
