
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

  // Fecha del webinar: jueves 27 de noviembre de 2025 a las 5:00 PM
  const webinarDate = new Date('2025-11-27T17:00:00');
  const now = new Date();
  const timeUntilWebinar = webinarDate.getTime() - now.getTime();
  const daysUntil = Math.floor(timeUntilWebinar / (1000 * 60 * 60 * 24));

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
        webinar_name: 'alto-rendimiento-noviembre-2025',
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
          webinar_name: 'alto-rendimiento-noviembre-2025'
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
        webinar_name: 'alto-rendimiento-noviembre-2025',
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
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-sm font-medium mb-12">
              <TrendingUp className="w-4 h-4 mr-2 text-primary" />
              <span className="text-foreground">Webinar Online Gratuito</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light mb-10 tracking-tight leading-[1.1]">
              <span className="text-foreground">
                Claves para una operación de
              </span>
              {" "}
              <span className="bg-gradient-to-br from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent font-normal">
                alto rendimiento
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground/80 mb-20 max-w-3xl mx-auto font-light leading-relaxed">
              Conoce las últimas funcionalidades de Ruka.ai y descubre cómo automatizar tu operación contable y financiera
            </p>

            {/* Webinar Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-5xl mx-auto">
              <Card className="border border-border/30 backdrop-blur-sm bg-card/30 rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-border/50">
                <CardContent className="pt-10 pb-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-5">
                    <Calendar className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg mb-2 font-semibold">Fecha</CardTitle>
                  <CardDescription className="text-muted-foreground/70 text-sm leading-relaxed">
                    Jueves 27 de noviembre 2025
                    <br />
                    5:00 PM (hora Chile)
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border border-border/30 backdrop-blur-sm bg-card/30 rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-border/50">
                <CardContent className="pt-10 pb-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 flex items-center justify-center mx-auto mb-5">
                    <Clock className="w-7 h-7 text-green-600" />
                  </div>
                  <CardTitle className="text-lg mb-2 font-semibold">Duración</CardTitle>
                  <CardDescription className="text-muted-foreground/70 text-sm leading-relaxed">
                    45 minutos
                    <br />
                    {daysUntil > 0 ? `Faltan ${daysUntil} días` : 'Próximamente'}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border border-border/30 backdrop-blur-sm bg-card/30 rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-border/50">
                <CardContent className="pt-10 pb-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-5">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg mb-2 font-semibold">Modalidad</CardTitle>
                  <CardDescription className="text-muted-foreground/70 text-sm leading-relaxed">
                    100% Online
                    <br />
                    Inscripción gratuita
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start max-w-6xl mx-auto">
            {/* Left Column - What you'll learn */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-light mb-12 tracking-tight">
                Qué verás en el webinar
              </h2>
              
              <div className="space-y-12 mb-12">
                <div>
                  <h3 className="text-lg font-medium mb-6 text-foreground">
                    Nuevas funcionalidades
                  </h3>
                  <div className="space-y-4">
                    {[
                      "Módulo de recepción completo",
                      "Acuse masivo del SII",
                      "Carga de XMLs",
                      "Módulo de insumos maestros",
                      "Panel de control con ventas integradas"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start group">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-muted-foreground/80 text-base leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-6 text-foreground">
                    Sesión de feedback
                  </h3>
                  <div className="space-y-4">
                    {[
                      "Comentarios sobre la plataforma",
                      "Dolores del día a día que podemos resolver",
                      "Procesos que necesitas automatizar"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start group">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-muted-foreground/80 text-base leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-background/50 backdrop-blur-sm border border-border/20 rounded-xl">
                  <p className="text-muted-foreground/80 text-sm leading-relaxed">
                    <strong className="text-foreground font-medium">Para clientes actuales:</strong> Conoce las últimas funcionalidades y comparte feedback sobre tus necesidades.
                  </p>
                </div>

                <div className="p-6 bg-background/50 backdrop-blur-sm border border-border/20 rounded-xl">
                  <p className="text-muted-foreground/80 text-sm leading-relaxed">
                    <strong className="text-foreground font-medium">Para nuevos interesados:</strong> Descubre cómo Ruka automatiza tu operación contable y financiera.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Registration Form */}
            <div className="lg:sticky lg:top-24">
              <Card className="border border-border/20 backdrop-blur-sm bg-card shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-primary/95 to-primary text-primary-foreground pt-12 pb-12">
                  <CardTitle className="text-2xl text-center font-semibold">
                    {isRegistered ? "¡Registro Confirmado!" : "Regístrate"}
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/80 text-center text-sm mt-3 font-light">
                    {isRegistered 
                      ? "Recibirás los detalles en tu correo" 
                      : "Jueves 27 de noviembre, 5:00 PM"
                    }
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-10 pb-10 px-10">
                  {isRegistered ? <div className="text-center space-y-8">
                      <div className="w-16 h-16 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          ¡Todo listo!
                        </h3>
                        <p className="text-muted-foreground/70 mb-4 text-sm leading-relaxed">
                          Recibirás un recordatorio con el enlace de acceso.
                        </p>
                      </div>
                    </div> : <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <Label htmlFor="nombre" className="text-sm font-medium text-foreground/80">Nombre completo</Label>
                        <Input 
                          id="nombre" 
                          name="nombre" 
                          type="text" 
                          value={formData.nombre} 
                          onChange={handleInputChange} 
                          placeholder="Juan Pérez" 
                          required 
                          disabled={isSubmitting}
                          className="mt-2 h-11 rounded-lg border-border/30 bg-background/50 focus:border-primary/50"
                        />
                      </div>

                      <div>
                        <Label htmlFor="correo" className="text-sm font-medium text-foreground/80">Correo electrónico</Label>
                        <Input 
                          id="correo" 
                          name="correo" 
                          type="email" 
                          value={formData.correo} 
                          onChange={handleInputChange} 
                          placeholder="juan@empresa.com" 
                          required 
                          disabled={isSubmitting}
                          className="mt-2 h-11 rounded-lg border-border/30 bg-background/50 focus:border-primary/50"
                        />
                      </div>

                      <div>
                        <Label htmlFor="whatsapp" className="text-sm font-medium text-foreground/80">WhatsApp</Label>
                        <Input 
                          id="whatsapp" 
                          name="whatsapp" 
                          type="tel" 
                          value={formData.whatsapp} 
                          onChange={handleInputChange} 
                          placeholder="+56 9 XXXX XXXX" 
                          required 
                          disabled={isSubmitting}
                          className="mt-2 h-11 rounded-lg border-border/30 bg-background/50 focus:border-primary/50"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-12 text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all mt-8" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Procesando..." : "Confirmar registro"}
                      </Button>

                      <p className="text-xs text-muted-foreground/60 text-center leading-relaxed pt-2">
                        Al registrarte, recibirás información del webinar
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
