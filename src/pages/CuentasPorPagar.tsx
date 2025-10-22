import { ArrowRight, Check, Download, AlertCircle, Shield, FileText, Clock, Zap, Sparkles, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductRegistrationForm from "@/components/product/ProductRegistrationForm";
import WhatsappButton from "@/components/WhatsappButton";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import cuentasPorPagarInterface from "@/assets/cuentas-por-pagar-interface.png";
import planillaBancaria from "@/assets/planilla-bancaria.png";
import { pushToDataLayer } from "@/utils/dataLayer";

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
      icon: Calendar,
      title: "Visualiza tus pagos futuros",
      description: "Ve todos tus compromisos de pago por venir. Anticípate y planifica tu flujo de caja sin sorpresas."
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ruka - Cuentas por Pagar",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "39990",
      "priceCurrency": "CLP"
    },
    "description": "Automatiza todo el proceso de pago a proveedores. Genera planillas bancarias en un click, gestiona discrepancias en la recepción y mantén control total de tus cuentas por pagar.",
    "featureList": [
      "Planilla bancaria en 1 click",
      "Módulo de recepción inteligente",
      "Bloqueo automático de facturas",
      "Registro completo de incidencias",
      "Visualización de pagos futuros",
      "Ahorro de más de 10 horas semanales"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Helmet>
        <title>Cuentas por Pagar - Automatiza Pagos a Proveedores | Ruka</title>
        <meta name="description" content="Automatiza tu proceso de cuentas por pagar. Genera planillas bancarias en 1 click, gestiona discrepancias y ahorra +10 horas semanales. Desde $39.990/mes." />
        <meta name="keywords" content="cuentas por pagar, automatización pagos, planilla bancaria, gestión proveedores, recepción inteligente, control facturas, software contabilidad" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Cuentas por Pagar - Automatiza Pagos a Proveedores | Ruka" />
        <meta property="og:description" content="Automatiza tu proceso de cuentas por pagar. Genera planillas bancarias en 1 click, gestiona discrepancias y ahorra +10 horas semanales." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ruka.cl/productos/cuentas-por-pagar" />
        <meta property="og:image" content={cuentasPorPagarInterface} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="675" />
        <meta property="og:image:alt" content="Interfaz de Cuentas por Pagar - Sistema de gestión automática de facturas y pagos" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cuentas por Pagar - Automatiza Pagos a Proveedores | Ruka" />
        <meta name="twitter:description" content="Automatiza tu proceso de cuentas por pagar. Genera planillas bancarias en 1 click y ahorra +10 horas semanales." />
        <meta name="twitter:image" content={cuentasPorPagarInterface} />
        <meta name="twitter:image:alt" content="Interfaz de Cuentas por Pagar - Sistema de gestión automática de facturas y pagos" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://ruka.cl/productos/cuentas-por-pagar" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <Navbar />
      
      {/* Hero Section */}
      <header className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-4">
              <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                🚀 Nuevo Producto
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Cuentas por Pagar - Automatiza Pagos a Proveedores
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Automatiza todo el proceso de pago a proveedores. Genera planillas bancarias en un click, 
              gestiona discrepancias en la recepción y mantén control total de tus cuentas por pagar.
            </p>
            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 rounded-full"
                onClick={() => {
                  pushToDataLayer('cuentas_por_pagar_cta_click', {
                    cta_location: 'hero',
                    cta_text: 'Comenzar Ahora',
                    page_path: '/productos/cuentas-por-pagar'
                  });
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Comenzar Ahora <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>

          {/* Hero Screenshot */}
          <figure className="mt-16 rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
            <img 
              src={cuentasPorPagarInterface} 
              alt="Interfaz del sistema de cuentas por pagar de Ruka mostrando gestión automática de facturas y planillas bancarias" 
              className="w-full h-auto"
              loading="eager"
              width="1200"
              height="675"
            />
          </figure>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-4xl md:text-5xl font-bold mb-4">
              Todo lo que necesitas para gestionar pagos
            </h2>
            <p className="text-xl text-gray-600">
              Desde la recepción hasta el pago final
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg w-full">
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
      <section className="py-20 px-6 bg-white" aria-labelledby="reception-heading">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <video 
                className="w-full rounded-2xl shadow-xl border border-gray-200"
                controls
                preload="metadata"
                poster={cuentasPorPagarInterface}
                aria-label="Video demostrativo del módulo de recepción inteligente"
              >
                <source src="/recepcion-modulo.mp4" type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            </div>
            <div className="order-1 md:order-2">
              <h2 id="reception-heading" className="text-4xl md:text-5xl font-bold mb-6">
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
      <section className="py-20 px-6" aria-labelledby="bank-statement-heading">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="bank-statement-heading" className="text-4xl md:text-5xl font-bold mb-6">
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
            <figure className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <img 
                src={planillaBancaria} 
                alt="Pantalla de generación automática de planilla bancaria con filtros de facturas y exportación directa" 
                className="w-full h-auto"
                loading="lazy"
                width="800"
                height="600"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-white" aria-labelledby="pricing-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 id="pricing-heading" className="text-4xl md:text-5xl font-bold mb-4">
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
              <Button 
                size="lg" 
                className="w-full text-lg py-6"
                onClick={() => {
                  pushToDataLayer('cuentas_por_pagar_cta_click', {
                    cta_location: 'pricing',
                    cta_text: 'Comenzar Ahora',
                    page_path: '/productos/cuentas-por-pagar'
                  });
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Comenzar Ahora <ArrowRight className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white" aria-labelledby="contact-heading">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left side - Value Proposition */}
            <aside>
              <div className="inline-block mb-4">
                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  ⚡ Respuesta en 24 horas
                </span>
              </div>
              <h2 id="contact-heading" className="text-4xl md:text-5xl font-bold mb-6">
                Comienza a automatizar hoy
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Completa el formulario y nuestro equipo te mostrará cómo Cuentas por Pagar puede 
                transformar tu proceso de pagos.
              </p>
              <div className="space-y-4">
                {[
                  "Demo personalizada",
                  "Implementación en 48 horas",
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
            </aside>

            {/* Right side - Registration Form */}
            <article>
              <ProductRegistrationForm 
                highlightForm={highlightForm} 
                timeLeft={timeLeft} 
                pagePath="/productos/cuentas-por-pagar"
              />
            </article>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsappButton source="cuentas-por-pagar" />
    </div>
  );
}
