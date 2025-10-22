import { ArrowRight, Check, Package, Warehouse, ArrowLeftRight, ClipboardCheck, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductRegistrationForm from "@/components/product/ProductRegistrationForm";
import WhatsappButton from "@/components/WhatsappButton";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import stockInventario from "@/assets/stock-inventario.png";
import stockIngresoAutomatico from "@/assets/stock-ingreso-automatico.png";
import stockTraspasoBodegas from "@/assets/stock-traspaso-bodegas.png";
import { pushToDataLayer } from "@/utils/dataLayer";

export default function Stock() {
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
      icon: Package,
      title: "Ingreso automático de stock",
      description: "Ruka registra automáticamente cada compra confirmada. Sin digitación manual, sin errores."
    },
    {
      icon: Warehouse,
      title: "Gestión de múltiples bodegas",
      description: "Administra el inventario de todas tus bodegas desde un solo lugar. Visibilidad total en tiempo real."
    },
    {
      icon: ArrowLeftRight,
      title: "Traspasos entre bodegas",
      description: "Sistema de solicitudes y aprobaciones para traspasos. Todo queda registrado y trazable."
    },
    {
      icon: ClipboardCheck,
      title: "Inventarios periódicos",
      description: "Realiza inventarios para capturar la foto exacta del momento. Detecta diferencias automáticamente."
    },
    {
      icon: TrendingUp,
      title: "Múltiples roles de usuario",
      description: "Define roles específicos: solicitante, aprobador, administrador. Control de permisos granular."
    },
    {
      icon: Sparkles,
      title: "Trazabilidad completa",
      description: "Cada movimiento queda registrado: quién, cuándo, por qué. Auditoría total de tu inventario."
    }
  ];

  const benefits = [
    "Elimina errores de digitación",
    "Control entre bodegas",
    "Inventarios simplificados",
    "Detecta faltantes automáticamente"
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ruka - Gestión de Stock e Inventario",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "99990",
      "priceCurrency": "CLP"
    },
    "description": "Automatiza la gestión de tu inventario. Ruka registra automáticamente cada compra, gestiona múltiples bodegas, traspasos y te permite realizar inventarios periódicos sin complicaciones.",
    "featureList": [
      "Ingreso automático de stock desde compras",
      "Gestión de múltiples bodegas",
      "Sistema de traspasos con aprobaciones",
      "Inventarios periódicos simplificados",
      "Control de consumos en tiempo real",
      "Trazabilidad completa de movimientos"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Helmet>
        <title>Gestión de Stock e Inventario Automatizada - Ahorra 15+ horas/semana | Ruka</title>
        <meta name="description" content="Automatiza tu gestión de inventario con Ruka. Ingreso automático desde compras, múltiples bodegas, traspasos con aprobaciones y control de roles. Desde $99.990/mes + IVA." />
        <meta name="keywords" content="gestión de stock, inventario automatizado, control de bodegas, traspasos entre bodegas, inventarios periódicos, software inventario chile, control stock restaurante, gestión inventario retail, sistema de bodegas" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Gestión de Stock e Inventario Automatizada | Ruka" />
        <meta property="og:description" content="Ingreso automático de stock, múltiples bodegas, traspasos con aprobaciones y roles configurables. Ahorra 15+ horas semanales automatizando tu inventario." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ruka.cl/productos/stock" />
        <meta property="og:image" content="https://ruka.cl/stock-inventario.png" />
        <meta property="og:image:secure_url" content="https://ruka.cl/stock-inventario.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Interfaz del sistema de gestión de stock e inventario de Ruka - Vista de inventario en bodega central" />
        <meta property="og:site_name" content="Ruka" />
        <meta property="og:locale" content="es_CL" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@ruka_ai" />
        <meta name="twitter:title" content="Gestión de Stock e Inventario Automatizada | Ruka" />
        <meta name="twitter:description" content="Ingreso automático de stock, múltiples bodegas, traspasos con aprobaciones. Ahorra 15+ horas/semana automatizando tu inventario." />
        <meta name="twitter:image" content="https://ruka.cl/stock-inventario.png" />
        <meta name="twitter:image:alt" content="Interfaz del sistema de gestión de stock e inventario de Ruka" />
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="Ruka" />
        <link rel="canonical" href="https://ruka.cl/productos/stock" />
        
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
              Gestión de Stock e Inventario Automatizada
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Olvídate de planillas manuales. Ruka registra automáticamente cada compra confirmada, 
              gestiona múltiples bodegas, traspasos y te permite realizar inventarios sin complicaciones.
            </p>
            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 rounded-full"
                onClick={() => {
                  pushToDataLayer('stock_cta_click', {
                    cta_location: 'hero',
                    cta_text: 'Comenzar Ahora',
                    page_path: '/productos/stock'
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
              src={stockInventario} 
              alt="Interfaz del sistema de gestión de stock e inventario de Ruka mostrando inventario de bodega central" 
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
              Todo lo que necesitas para controlar tu inventario
            </h2>
            <p className="text-xl text-gray-600">
              Desde el ingreso automático hasta inventarios periódicos
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

      {/* Automatic Entry Section */}
      <section className="py-20 px-6 bg-white" aria-labelledby="automatic-entry-heading">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <figure className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                <img 
                  src={stockIngresoAutomatico} 
                  alt="Modal mostrando ingreso automático de productos por Ruka desde factura de compra" 
                  className="w-full h-auto"
                  loading="lazy"
                  width="800"
                  height="600"
                />
              </figure>
            </div>
            <div className="order-1 md:order-2">
              <h2 id="automatic-entry-heading" className="text-4xl md:text-5xl font-bold mb-6">
                Ruka ingresa todo automáticamente
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Cada vez que confirmas una compra, Ruka registra automáticamente los productos en tu inventario. 
                Sin digitación, sin errores, sin trabajo manual.
              </p>
              <div className="space-y-4">
                {[
                  "Ingreso automático desde facturas",
                  "Vinculación con órdenes de compra",
                  "Registro de bodega de destino",
                  "Trazabilidad completa del ingreso",
                  "Actualización en tiempo real"
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

      {/* Multi-Warehouse Section */}
      <section className="py-20 px-6" aria-labelledby="warehouse-heading">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="warehouse-heading" className="text-4xl md:text-5xl font-bold mb-6">
                Gestiona múltiples bodegas y traspasos
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Administra el inventario de todas tus ubicaciones desde un solo lugar. 
                Sistema de solicitudes y aprobaciones para traspasos entre bodegas con trazabilidad completa.
              </p>
              <div className="space-y-4">
                {[
                  "Vista consolidada de todas las bodegas",
                  "Solicitudes de traspaso entre ubicaciones",
                  "Sistema de aprobaciones configurable",
                  "Registro automático de movimientos",
                  "Control de quién solicitó y quién aprobó",
                  "Historial completo de traspasos"
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
                src={stockTraspasoBodegas} 
                alt="Modal de nueva solicitud de traspaso entre bodegas mostrando selección de origen, destino y productos" 
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
              <CardTitle className="text-3xl mb-2">Plan Gestión de Stock</CardTitle>
              <CardDescription className="text-lg">Automatiza todo tu inventario</CardDescription>
              <div className="mt-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl font-bold text-primary">$99.990</span>
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
                  pushToDataLayer('stock_cta_click', {
                    cta_location: 'pricing',
                    cta_text: 'Comenzar Ahora',
                    page_path: '/productos/stock'
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
                Completa el formulario y nuestro equipo te mostrará cómo la Gestión de Stock de Ruka 
                puede transformar tu control de inventario.
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
                pagePath="/productos/stock"
              />
            </article>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsappButton source="stock" />
    </div>
  );
}
