import { ArrowRight, Check, Zap, Shield, TrendingUp, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductRegistrationForm from "@/components/product/ProductRegistrationForm";
import { useState, useEffect } from "react";

export default function ProductoEjemplo() {
  const [highlightForm, setHighlightForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      let target = new Date();
      target.setHours(12, 0, 0, 0);
      if (now.getHours() >= 12) {
        target.setDate(target.getDate() + 1);
      }
      const diff = target.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Zap,
      title: "Velocidad Excepcional",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt."
    },
    {
      icon: Shield,
      title: "Seguridad Garantizada",
      description: "Ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida."
    },
    {
      icon: TrendingUp,
      title: "Resultados Comprobados",
      description: "Risus commodo viverra maecenas accumsan lacus vel facilisis volutpat est."
    }
  ];

  const benefits = [
    "Implementación en menos de 24 horas",
    "Ahorro de hasta 40% en costos operativos",
    "Integración con sistemas existentes",
    "Soporte 24/7 en español",
    "ROI positivo en el primer mes",
    "Actualizaciones automáticas incluidas"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-4">
              <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                🚀 Producto de Ejemplo
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Lorem Ipsum Dolor Sit Amet
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 rounded-full"
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Comenzar Ahora <ArrowRight className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full gap-2">
                <MessageCircle className="w-5 h-5" />
                Conversemos
              </Button>
            </div>
          </div>

          {/* Hero Image/Video Placeholder */}
          <div className="mt-16 rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center">
                  <Zap className="w-12 h-12 text-primary" />
                </div>
                <p className="text-gray-600 font-medium">Demo o Video del Producto</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Beneficios Comprobados
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-gray-700 text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="text-center p-8">
                  <TrendingUp className="w-24 h-24 mx-auto mb-4 text-primary" />
                  <p className="text-gray-600 font-medium">Gráfico o Imagen Demostrativa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Inversión Simple y Transparente
            </h2>
            <p className="text-xl text-gray-600">
              Un solo plan, todo incluido
            </p>
          </div>

          <Card className="border-2 border-primary shadow-2xl">
            <CardHeader className="text-center pb-8 pt-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl mb-2">Plan Profesional</CardTitle>
              <CardDescription className="text-lg">Todo lo que necesitas para transformar tu negocio</CardDescription>
              <div className="mt-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl font-bold text-primary">$599</span>
                  <div className="text-left">
                    <div className="text-gray-600 text-lg">/mes</div>
                    <div className="text-sm text-muted-foreground">+ IVA</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-12">
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="flex-1 text-lg py-6"
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Comenzar Ahora <ArrowRight className="ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="flex-1 text-lg py-6 gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Conversemos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left side - Value Proposition */}
            <div>
              <div className="inline-block mb-4">
                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  ⚡ Respuesta en 24 horas
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Comienza Hoy Mismo
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Completa el formulario y nuestro equipo se pondrá en contacto contigo para comenzar tu transformación digital.
              </p>
              <div className="space-y-4">
                {[
                  "Setup inicial gratuito",
                  "Onboarding personalizado",
                  "Sin compromisos a largo plazo",
                  "Soporte en español"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-gray-700 text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Registration Form */}
            <div>
              <ProductRegistrationForm 
                highlightForm={highlightForm} 
                timeLeft={timeLeft} 
                pagePath="/productos/ejemplo"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
