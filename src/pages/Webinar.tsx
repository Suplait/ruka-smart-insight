
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, CheckCircle, ChefHat, Bot } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

export default function Webinar() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    whatsapp: ""
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();

  // Fecha del webinar: martes 2 de junio a las 5 PM
  const webinarDate = new Date('2025-06-02T17:00:00');
  const now = new Date();
  const timeUntilWebinar = webinarDate.getTime() - now.getTime();
  const daysUntil = Math.ceil(timeUntilWebinar / (1000 * 60 * 60 * 24));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.correo || !formData.whatsapp) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    // Aquí se podría integrar con el backend para guardar el registro
    console.log("Registro webinar:", formData);
    
    setIsRegistered(true);
    toast({
      title: "¡Registro exitoso!",
      description: "Te hemos enviado los detalles del webinar a tu correo",
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
              <ChefHat className="w-4 h-4 mr-2" />
              Webinar Exclusivo para Restaurantes
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Cómo otros{" "}
              <span className="text-blue-600">Restaurantes</span>{" "}
              están usando la IA
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Descubre cómo marcas top en Chile y el mundo están revolucionando sus operaciones 
              con inteligencia artificial
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <p className="text-orange-800 text-lg font-medium">
                <Bot className="w-5 h-5 inline mr-2" />
                Desde La Piojera hasta Chicken Love You: 
                <span className="font-bold"> todos ya tienen IA trabajando en su restaurante</span>
              </p>
            </div>

            {/* Webinar Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="border-2 border-blue-100">
                <CardContent className="pt-6">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <CardTitle className="text-lg mb-2">Fecha</CardTitle>
                  <CardDescription className="text-gray-600">
                    Martes 2 de Junio
                    <br />
                    5:00 PM (Hora de Chile)
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

              <Card className="border-2 border-purple-100">
                <CardContent className="pt-6">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
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
                {[
                  "Cómo cocinas robóticas están transformando la preparación de alimentos",
                  "Casos reales: restaurantes chilenos que ya usan IA en su operación",
                  "Garzones autónomos y sistemas de atención inteligente",
                  "IA para toma de decisiones operativas y financieras",
                  "Demo en vivo: tecnologías que puedes implementar HOY",
                  "Roadmap: cómo empezar con IA en tu restaurante"
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  Casos de Éxito Reales
                </h3>
                <p className="text-blue-800">
                  Te mostraremos ejemplos específicos de restaurantes en Chile que han implementado 
                  IA exitosamente, desde pequeños locales hasta cadenas reconocidas.
                </p>
              </div>

              <div className="mt-6 p-6 bg-orange-50 rounded-lg">
                <h3 className="text-xl font-semibold text-orange-900 mb-2">
                  ¿Para quién es este webinar?
                </h3>
                <p className="text-orange-800">
                  <strong>Dueños y administradores de restaurantes</strong> que quieren mantenerse 
                  competitivos y optimizar sus operaciones con las últimas tecnologías.
                </p>
              </div>
            </div>

            {/* Right Column - Registration Form */}
            <div>
              <Card className="border-2 border-blue-200 shadow-lg">
                <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl text-center">
                    {isRegistered ? "¡Registro Confirmado!" : "Inscríbete Gratis"}
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-center">
                    {isRegistered 
                      ? "Te hemos enviado todos los detalles a tu correo"
                      : "Asegura tu cupo - Martes 2 de Junio, 5:00 PM"
                    }
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  {isRegistered ? (
                    <div className="text-center space-y-4">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          ¡Todo listo!
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Recibirás un recordatorio el día del webinar con el enlace de acceso.
                        </p>
                        <p className="text-sm text-gray-500">
                          Prepárate para descubrir cómo la IA puede transformar tu restaurante.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="nombre">Nombre completo *</Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          type="text"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          placeholder="Ingresa tu nombre completo"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="correo">Correo electrónico *</Label>
                        <Input
                          id="correo"
                          name="correo"
                          type="email"
                          value={formData.correo}
                          onChange={handleInputChange}
                          placeholder="tu@restaurante.com"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="whatsapp">WhatsApp *</Label>
                        <Input
                          id="whatsapp"
                          name="whatsapp"
                          type="tel"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          placeholder="+56 9 XXXX XXXX"
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Inscribirme al Webinar
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        Al registrarte, aceptas recibir información sobre el webinar. 
                        Puedes darte de baja en cualquier momento.
                      </p>
                    </form>
                  )}
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
