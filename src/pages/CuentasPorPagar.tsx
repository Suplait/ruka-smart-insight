import { ArrowRight, Check, Download, AlertCircle, Shield, FileText, Clock, Zap, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductRegistrationForm from "@/components/product/ProductRegistrationForm";
import WhatsappButton from "@/components/WhatsappButton";
import { useState, useEffect } from "react";
import cuentasPorPagarInterface from "@/assets/cuentas-por-pagar-interface.png";
import planillaBancaria from "@/assets/planilla-bancaria.png";

export default function CuentasPorPagar() {
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
      icon: Download,
      title: "Planilla bancaria en 1 click",
      description: "Genera automáticamente la planilla de pagos para tu banco. Sin errores, sin trabajo manual."
    },
    {
      icon: AlertCircle,
      title: "Módulo de recepción inteligente",
      description: "Tu equipo puede reportar discrepancias al recibir productos. Sistema automático de alertas y bloqueos."
    },
    {
      icon: Shield,
      title: "Bloqueo automático de facturas",
      description: "Las facturas con problemas se bloquean automáticamente hasta resolver la incidencia."
    },
    {
      icon: FileText,
      title: "Registro completo de incidencias",
      description: "Cada problema queda documentado con fecha, responsable y resolución. Trazabilidad total."
    },
    {
      icon: Clock,
      title: "Ahorra +10 horas semanales",
      description: "Automatiza todo el proceso de cuentas por pagar y libera tiempo de tu equipo."
    }
  ];

  const benefits = [
    "Elimina errores de pago manual",
    "Mejora relación con proveedores",
    "Control total de discrepancias",
    "Auditoría completa",
    "Reduce fraude interno",
    "Visibilidad en tiempo real"
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
                🚀 Nuevo Producto
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Cuentas por Pagar
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Automatiza todo el proceso de pago a proveedores. Genera planillas bancarias en un click, 
              gestiona discrepancias en la recepción y mantén control total de tus cuentas por pagar.
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

          {/* Hero Screenshot */}
          <div className="mt-16 rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
            <img 
              src={cuentasPorPagarInterface} 
              alt="Interfaz de Cuentas por Pagar en Ruka" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Todo lo que necesitas para gestionar pagos
            </h2>
            <p className="text-xl text-gray-600">
              Desde la recepción hasta el pago final
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg w-full max-w-sm">
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

      {/* Reception Module Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <video 
                className="w-full rounded-2xl shadow-xl border border-gray-200"
                controls
                preload="metadata"
                poster={cuentasPorPagarInterface}
              >
                <source src="/recepcion-modulo.mp4" type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Módulo de recepción inteligente + bloqueo automático
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Tu equipo puede reportar problemas directamente al recibir los productos. 
                El sistema bloquea automáticamente las facturas con discrepancias hasta que se resuelvan.
              </p>
              <div className="space-y-4">
                {[
                  "Reporta productos en mal estado o faltantes",
                  "Bloqueo automático de facturas con problemas",
                  "Notificaciones instantáneas al proveedor",
                  "Registro completo de cada incidencia",
                  "Trazabilidad total de resoluciones",
                  "Evita pagos incorrectos"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-gray-700 text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bank Statement Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Genera la planilla bancaria en 1 click
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Deja de perder horas armando manualmente la nómina del banco. Con Ruka es súper fácil: 
                filtra las facturas que necesitas pagar, revisa los montos, y descarga la planilla lista para tu banco.
              </p>
              <div className="space-y-4">
                {[
                  "Filtra facturas por fecha, proveedor o monto",
                  "Selecciona las que quieres pagar",
                  "Genera la planilla en el formato de tu banco",
                  "Descarga y sube a tu banco en segundos",
                  "Elimina errores de digitación manual",
                  "Ahorra más de 10 horas semanales"
                ].map((benefit, index) => (
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
              <img 
                src={planillaBancaria} 
                alt="Generación de planilla bancaria en un click" 
                className="w-full h-auto"
              />
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
              <CardTitle className="text-3xl mb-2">Plan Cuentas por Pagar</CardTitle>
              <CardDescription className="text-lg">Automatiza todo tu proceso de pagos</CardDescription>
              <div className="mt-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl font-bold text-primary">$39.990</span>
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
                Comienza a automatizar hoy
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Completa el formulario y nuestro equipo te mostrará cómo Cuentas por Pagar puede 
                transformar tu proceso de pagos.
              </p>
              <div className="space-y-4">
                {[
                  "Demo personalizada gratuita",
                  "Implementación en 48 horas",
                  "Integración con Ruka incluida",
                  "Soporte prioritario"
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
                pagePath="/productos/cuentas-por-pagar"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsappButton source="cuentas-por-pagar" />
    </div>
  );
}
