
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, CheckCircle } from "lucide-react";
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

  // Fecha del webinar (ejemplo: próximo viernes a las 3 PM)
  const webinarDate = new Date('2024-12-06T15:00:00');
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
              <Users className="w-4 h-4 mr-2" />
              Webinar Exclusivo
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Cómo los Agentes de IA Pueden{" "}
              <span className="text-blue-600">Reducir tus Costos</span>{" "}
              hasta un 30%
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Descubre estrategias probadas para optimizar tus operaciones y maximizar tu rentabilidad con inteligencia artificial
            </p>

            {/* Webinar Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="border-2 border-blue-100">
                <CardContent className="pt-6">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <CardTitle className="text-lg mb-2">Fecha</CardTitle>
                  <CardDescription className="text-gray-600">
                    Viernes 6 de Diciembre
                    <br />
                    3:00 PM (Hora de Chile)
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
                    Cupos limitados
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
                Lo que aprenderás
              </h2>
              
              <div className="space-y-4">
                {[
                  "Cómo identificar oportunidades de ahorro en tiempo real",
                  "Estrategias para automatizar la detección de anomalías",
                  "Casos de éxito: empresas que redujeron costos 30%",
                  "Demo en vivo de agentes de IA en acción",
                  "Hoja de ruta para implementar IA en tu empresa"
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  Bonus Exclusivo
                </h3>
                <p className="text-blue-800">
                  Los primeros 50 registrados recibirán una consultoría gratuita de 30 minutos 
                  para evaluar el potencial de ahorro en su empresa.
                </p>
              </div>
            </div>

            {/* Right Column - Registration Form */}
            <div>
              <Card className="border-2 border-blue-200 shadow-lg">
                <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl text-center">
                    {isRegistered ? "¡Registro Confirmado!" : "Regístrate Gratis"}
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-center">
                    {isRegistered 
                      ? "Te hemos enviado todos los detalles a tu correo"
                      : "Asegura tu cupo en este webinar exclusivo"
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
                          Recibirás un recordatorio 24 horas antes del webinar con el enlace de acceso.
                        </p>
                        <p className="text-sm text-gray-500">
                          Mientras tanto, puedes explorar más sobre nuestras soluciones de IA.
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
                          placeholder="tu@empresa.com"
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
                        Registrarme al Webinar
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        Al registrarte, aceptas recibir comunicaciones sobre el webinar. 
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
