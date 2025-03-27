
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AutomationFeatures from "./AutomationFeatures";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  restaurantName: z.string().min(2, { message: "Por favor ingresa el nombre del restaurante" }),
  ownerName: z.string().min(2, { message: "Por favor ingresa tu nombre" }),
  email: z.string().email({ message: "Por favor ingresa un email válido" }),
  phone: z.string().min(8, { message: "Por favor ingresa un número de teléfono válido" }),
});

interface RegistrationFormProps {
  highlightForm: boolean;
  timeLeft: string;
}

export default function RegistrationForm({ highlightForm, timeLeft }: RegistrationFormProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantName: "",
      ownerName: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setError("");
    
    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 1500));
      console.log(values);
      setSubmitted(true);
    } catch (err) {
      setError(t('restaurants.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        y: [0, highlightForm ? -10 : 0, 0],
        scale: [1, highlightForm ? 1.02 : 1, 1],
      }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl shadow-xl overflow-hidden border ${highlightForm ? 'border-primary' : 'border-gray-100'}`}
    >
      {submitted ? (
        <div className="p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold">{t('restaurants.form.success')}</h3>
          <p className="text-gray-600">
            Te hemos enviado un correo con los siguientes pasos para comenzar a utilizar Ruka.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-gray-50 p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">{t('restaurants.form.title')}</h3>
              <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
                <Clock className="w-3 h-3" />
                <span>Respuesta en {timeLeft}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              {t('restaurants.form.subtitle')}
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="restaurantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder={t('restaurants.form.restaurant_name_placeholder')} 
                          {...field} 
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder={t('restaurants.form.owner_name_placeholder')} 
                          {...field} 
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder={t('restaurants.form.email_placeholder')} 
                          type="email" 
                          {...field} 
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder={t('restaurants.form.phone_placeholder')} 
                          {...field} 
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base mt-2" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('common.loading') : t('restaurants.form.submit')}
                  {!isSubmitting && <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>
              </form>
            </Form>
            
            <AutomationFeatures />
          </div>
        </>
      )}
    </motion.div>
  );
}
