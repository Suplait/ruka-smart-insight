
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
  const { toast } = useToast();

  // Fecha del webinar: jueves 06 de noviembre de 2025 a las 5:30 PM
  const webinarDate = new Date('2025-11-06T17:30:00');
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
        webinar_name: 'dashboard-control-junio-2025',
        nombre: formData.nombre,
        correo: formData.correo,
        timestamp: new Date().toISOString()
      });

      // Clean the phone number: remove "+", spaces, and any other characters except numbers
      const cleanedWhatsapp = formData.whatsapp.replace(/\D/g, '');
      const { error } = await supabase
        .from('webinar_leads')
        .insert({
          nombre: formData.nombre,
          correo: formData.correo,
          whatsapp: cleanedWhatsapp,
          webinar_name: 'dashboard-control-junio-2025'
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
        webinar_name: 'dashboard-control-junio-2025',
        nombre: formData.nombre,
        correo: formData.correo,
        error_message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-sm font-medium mb-8">
              <BarChart3 className="w-5 h-5 mr-2 text-primary" />
              <span className="text-foreground">Webinar Exclusivo para Empresas</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
              <span className="text-foreground">
                Automatiza tu semana
              </span>
              {" "}
              <span className="bg-gradient-to-br from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                sin Programar
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light">
              Aprende a automatizar tareas repetitivas en menos de 15 minutos, sin conocimientos técnicos. De un correo con factura a datos organizados, en vivo.
            </p>

            <div className="bg-primary/5 backdrop-blur-xl border border-primary/10 rounded-3xl p-8 mb-16 max-w-3xl mx-auto shadow-lg">
              <p className="text-foreground text-lg sm:text-xl font-medium">
                💡 <strong>Descubre cómo</strong> liberar tiempo, reducir errores y enfocarte en lo que realmente aporta valor
              </p>
            </div>

            {/* Webinar Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
              <Card className="border border-border/50 backdrop-blur-sm bg-card/50 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 pb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-3 font-semibold">Fecha</CardTitle>
                  <CardDescription className="text-muted-foreground text-base">
                    Jueves 06 de noviembre 2025
                    <br />
                    5:30 PM (hora Chile)
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border border-border/50 backdrop-blur-sm bg-card/50 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 pb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl mb-3 font-semibold">Faltan</CardTitle>
                  <CardDescription className="text-muted-foreground text-base">
                    {daysUntil > 0 ? `${daysUntil} días` : 'Próximamente'}
                    <br />
                    Duración: 45 minutos
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border border-border/50 backdrop-blur-sm bg-card/50 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 pb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-3 font-semibold">Modalidad</CardTitle>
                  <CardDescription className="text-muted-foreground text-base">
                    100% Online
                    <br />
                    Inscripción gratuita
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
            {/* Left Column - What you'll learn */}
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-10 tracking-tight">
                En este webinar descubrirás
              </h2>
              
              <div className="space-y-6">
                {[
                  "Los principios básicos de la automatización de procesos sin necesidad de programar",
                  "Cómo crear un flujo completo en vivo: desde recibir un correo con factura hasta registrar datos en Google Sheets",
                  "Cómo ahorrar horas de trabajo repetitivo cada semana y reducir errores humanos",
                  "Herramientas accesibles que puedes usar desde mañana en tu empresa"
                ].map((item, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-muted-foreground text-lg leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-8 bg-primary/5 backdrop-blur-xl border border-primary/10 rounded-3xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-3">
                  "Automatizar no es programar"
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Es liberar tiempo, reducir errores y enfocarte en lo que realmente aporta valor. En este webinar te demostramos que la automatización está al alcance de todos
                </p>
              </div>

              <div className="mt-6 p-8 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-xl border border-primary/20 rounded-3xl shadow-lg">
                <h3 className="text-2xl font-semibold text-primary mb-4">
                  ¿Para quién es este webinar?
                </h3>
                <div className="space-y-3 text-foreground/80 text-lg leading-relaxed">
                  <p>
                    <strong className="text-foreground">Profesionales que realizan tareas operativas repetitivas:</strong> compras, administración, contabilidad, operaciones, soporte.
                  </p>
                  <p>
                    <strong className="text-foreground">Personas sin perfil técnico</strong> que quieren mejorar su productividad con herramientas digitales accesibles.
                  </p>
                  <p>
                    <strong className="text-foreground">Líderes de equipos o áreas</strong> que buscan introducir la automatización en su organización de forma práctica y sin complicaciones.
                  </p>
                  <p className="mt-4 font-semibold text-primary">
                    Si trabajas con tareas repetitivas y quieres recuperar tu tiempo, este webinar es para ti.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Registration Form */}
            <div className="lg:sticky lg:top-24">
              <Card className="border border-border/50 backdrop-blur-sm bg-card/80 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground pt-10 pb-10">
                  <CardTitle className="text-3xl text-center font-bold">
                    {isRegistered ? "¡Registro Confirmado!" : "Inscríbete Gratis"}
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/90 text-center text-base mt-2">
                    {isRegistered 
                      ? "Te hemos enviado todos los detalles a tu correo" 
                      : "Asegura tu cupo - Jueves 06 de noviembre 2025, 5:30 PM"
                    }
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-8 pb-8 px-8">
                  {isRegistered ? <div className="text-center space-y-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center mx-auto">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold mb-3">
                          ¡Todo listo!
                        </h3>
                        <p className="text-muted-foreground mb-4 text-lg">
                          Recibirás un recordatorio el día del webinar con el enlace de acceso.
                        </p>
                        <p className="text-sm text-muted-foreground/80">
                          Prepárate para pasar del caos al control total de tu empresa.
                        </p>
                      </div>
                    </div> : <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="nombre" className="text-base font-medium">Nombre completo *</Label>
                        <Input 
                          id="nombre" 
                          name="nombre" 
                          type="text" 
                          value={formData.nombre} 
                          onChange={handleInputChange} 
                          placeholder="Ingresa tu nombre completo" 
                          required 
                          disabled={isSubmitting}
                          className="mt-2 h-12 rounded-xl border-border/50 bg-background/50"
                        />
                      </div>

                      <div>
                        <Label htmlFor="correo" className="text-base font-medium">Correo electrónico *</Label>
                        <Input 
                          id="correo" 
                          name="correo" 
                          type="email" 
                          value={formData.correo} 
                          onChange={handleInputChange} 
                          placeholder="tu@empresa.com" 
                          required 
                          disabled={isSubmitting}
                          className="mt-2 h-12 rounded-xl border-border/50 bg-background/50"
                        />
                      </div>

                      <div>
                        <Label htmlFor="whatsapp" className="text-base font-medium">WhatsApp *</Label>
                        <Input 
                          id="whatsapp" 
                          name="whatsapp" 
                          type="tel" 
                          value={formData.whatsapp} 
                          onChange={handleInputChange} 
                          placeholder="+56 9 XXXX XXXX" 
                          required 
                          disabled={isSubmitting}
                          className="mt-2 h-12 rounded-xl border-border/50 bg-background/50"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-14 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Procesando..." : "Inscribirme al Webinar"}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center leading-relaxed">
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
    </main>
  );
}
