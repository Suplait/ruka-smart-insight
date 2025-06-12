import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, CheckCircle, BarChart3, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { pushToDataLayer } from "@/utils/dataLayer";
export default function Webinar() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    whatsapp: "+56 "
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    toast
  } = useToast();

  // Fecha del webinar: jueves 19 de enero a las 5:30 PM
  const webinarDate = new Date('2025-01-19T17:30:00');
  const now = new Date();
  const timeUntilWebinar = webinarDate.getTime() - now.getTime();
  const daysUntil = Math.ceil(timeUntilWebinar / (1000 * 60 * 60 * 24));
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    if (name === 'whatsapp') {
      // Ensure the field always starts with "+56 "
      if (!value.startsWith('+56 ')) {
        setFormData(prev => ({
          ...prev,
          [name]: '+56 '
        }));
        return;
      }
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.correo || !formData.whatsapp || formData.whatsapp === '+56 ') {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Track successful registration BEFORE database insert (like in RegistrationForm)
      pushToDataLayer('webinar_registration_success', {
        webinar_name: 'dashboard-control-enero-2025',
        nombre: formData.nombre,
        correo: formData.correo,
        timestamp: new Date().toISOString()
      });

      // Clean the phone number: remove "+", spaces, and any other characters except numbers
      const cleanedWhatsapp = formData.whatsapp.replace(/\D/g, '');
      const {
        error
      } = await supabase.from('webinar_leads').insert({
        nombre: formData.nombre,
        correo: formData.correo,
        whatsapp: cleanedWhatsapp,
        webinar_name: 'dashboard-control-enero-2025'
      });
      if (error) {
        console.error('Error guardando registro:', error);
        toast({
          title: "Error",
          description: "Hubo un problema al procesar tu registro. Inténtalo nuevamente.",
          variant: "destructive"
        });
        return;
      }
      console.log("Registro webinar guardado exitosamente:", {
        ...formData,
        whatsapp: cleanedWhatsapp
      });
      setIsRegistered(true);
      toast({
        title: "¡Registro exitoso!",
        description: "Te hemos enviado los detalles del webinar a tu correo"
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu registro. Inténtalo nuevamente.",
        variant: "destructive"
      });

      // Track failed registration only in catch block
      pushToDataLayer('webinar_registration_failure', {
        webinar_name: 'dashboard-control-enero-2025',
        nombre: formData.nombre,
        correo: formData.correo,
        error_message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
              <BarChart3 className="w-4 h-4 mr-2" />
              Webinar Exclusivo para Restaurantes
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Del{" "}
              <span className="text-slate-600">Caos</span>{" "}
              al{" "}
              <span className="text-primary">Control</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Aprende cómo ver ventas, compras y gastos en un solo dashboard para tu restaurante
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <p className="text-blue-800 text-lg font-medium">
                <TrendingUp className="w-5 h-5 inline mr-2" />
                ¿Sabías que la mayoría de los restaurantes toma decisiones con información incompleta… 
                <span className="font-bold"> o sin datos en absoluto?</span>
              </p>
            </div>

            {/* Webinar Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="border-2 border-blue-100">
                <CardContent className="pt-6">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <CardTitle className="text-lg mb-2">Fecha</CardTitle>
                  <CardDescription className="text-gray-600">
                    Jueves 19 de Enero
                    <br />
                    5:30 PM (Hora de Chile)
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-100">
                <CardContent className="pt-6">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <CardTitle className="text-lg mb-2">Faltan</CardTitle>
                  <CardDescription className="text-gray-600">
                    {daysUntil > 0 ? `${daysUntil} días` : 'Próximamente'}
                    <br />
                    Duración: 45 minutos
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                  <CardTitle className="text-lg mb-2">Modalidad</CardTitle>
                  <CardDescription className="text-gray-600">
                    100% Online
                    <br />
                    Inscripción gratuita
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - What you'll learn */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                En este webinar descubrirás
              </h2>
              
              <div className="space-y-4">
                {["Por qué tener ventas por un lado, compras por otro y las boletas quién sabe dónde está matando tu rentabilidad", "Cómo unificar toda tu información financiera en un solo lugar para tomar decisiones basadas en datos reales", "Qué métricas clave debes monitorear diariamente en tu dashboard para mantener el control total", "Casos reales de restaurantes que pasaron del caos financiero al control absoluto de sus números", "Cómo identificar patrones ocultos en tus datos que pueden revelarte oportunidades de ahorro inmediatas", "La metodología paso a paso para implementar un sistema de control que funcione en tu restaurante desde el día 1"].map((item, index) => <div key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>)}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  De la Confusión a la Claridad
                </h3>
                <p className="text-blue-800">
                  Te mostraremos ejemplos reales de dashboards que están transformando la gestión 
                  de restaurantes, desde pequeños locales hasta cadenas establecidas.
                </p>
              </div>

              <div className="mt-6 p-6 bg-primary/10 rounded-lg">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  ¿Para quién es este webinar?
                </h3>
                <p className="text-primary/80">
                  <strong>Dueños y administradores de restaurantes</strong> que están cansados de 
                  trabajar a ciegas y quieren tener control total sobre sus números y operaciones.
                </p>
              </div>
            </div>

            {/* Right Column - Registration Form */}
            <div>
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader className="bg-primary text-white rounded-t-lg">
                  <CardTitle className="text-2xl text-center">
                    {isRegistered ? "¡Registro Confirmado!" : "Inscríbete Gratis"}
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/80 text-center">
                    {isRegistered ? "Te hemos enviado todos los detalles a tu correo" : "Asegura tu cupo - Jueves 19 de Enero, 5:30 PM"}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  {isRegistered ? <div className="text-center space-y-4">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          ¡Todo listo!
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Recibirás un recordatorio el día del webinar con el enlace de acceso.
                        </p>
                        <p className="text-sm text-gray-500">
                          Prepárate para pasar del caos al control total de tu restaurante.
                        </p>
                      </div>
                    </div> : <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="nombre">Nombre completo *</Label>
                        <Input id="nombre" name="nombre" type="text" value={formData.nombre} onChange={handleInputChange} placeholder="Ingresa tu nombre completo" required disabled={isSubmitting} />
                      </div>

                      <div>
                        <Label htmlFor="correo">Correo electrónico *</Label>
                        <Input id="correo" name="correo" type="email" value={formData.correo} onChange={handleInputChange} placeholder="tu@restaurante.com" required disabled={isSubmitting} />
                      </div>

                      <div>
                        <Label htmlFor="whatsapp">WhatsApp *</Label>
                        <Input id="whatsapp" name="whatsapp" type="tel" value={formData.whatsapp} onChange={handleInputChange} placeholder="+56 9 XXXX XXXX" required disabled={isSubmitting} />
                      </div>

                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                        {isSubmitting ? "Procesando..." : "Inscribirme al Webinar"}
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        Al registrarte, aceptas recibir información sobre el webinar. 
                        Puedes darte de baja en cualquier momento.
                      </p>
                    </form>}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>;
}