import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Target,
  Shield,
  Users,
  Zap,
  CheckCircle2,
  ArrowRight,
  LineChart,
  PieChart,
  Package
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductRegistrationForm from "@/components/product/ProductRegistrationForm";
import WhatsappButton from "@/components/WhatsappButton";
import { pushToDataLayer } from "@/utils/dataLayer";
import panelControlDashboard from "@/assets/panel-control-dashboard.png";
import panelControlTicket from "@/assets/panel-control-ticket-promedio.png";

const PanelControl = () => {
  const [highlightForm, setHighlightForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Zap,
      title: "Integración Automática",
      description: "Conectamos tus sistemas comerciales (Toteat, Fudo, Justo, y más) y tus datos de compra para mantener los paneles siempre actualizados sin intervención manual."
    },
    {
      icon: BarChart3,
      title: "Visión Unificada del Negocio",
      description: "Combina ventas, compras y márgenes en un solo panel para entender tu estado de resultados real en todo momento."
    },
    {
      icon: Target,
      title: "Indicadores Claros y Comparativos",
      description: "Metas vs. resultados, márgenes por canal, ticket promedio, rotación, impuestos, descuentos y desempeño histórico — todo visual, sin planillas."
    },
    {
      icon: TrendingUp,
      title: "Detecta Oportunidades de Mejora",
      description: "Identifica automáticamente áreas de ahorro, productos con bajo margen y oportunidades para optimizar tu rentabilidad."
    },
    {
      icon: Users,
      title: "Implementación Asistida",
      description: "Nuestro equipo te acompaña en la activación y configuración inicial, integrando tus fuentes y personalizando los indicadores relevantes."
    },
    {
      icon: Shield,
      title: "Datos Seguros y Confiables",
      description: "Sincronización encriptada, accesos por rol y monitoreo continuo a través de la infraestructura segura de Ruka."
    }
  ];

  const panels = [
    {
      icon: LineChart,
      title: "Panel de Ventas",
      description: "Visualiza ingresos, ticket promedio y productos destacados en tiempo real."
    },
    {
      icon: TrendingUp,
      title: "Panel de Estado de Resultados",
      description: "Controla márgenes, tendencias y desviaciones en tiempo real."
    },
    {
      icon: Package,
      title: "Panel de Compras e Inventario",
      description: "Analiza rotación, costos por insumo y variaciones de precios. (En desarrollo)"
    }
  ];

  const benefits = [
    "Elimina el trabajo manual con planillas",
    "Decisiones basadas en datos actualizados",
    "Implementación rápida con acompañamiento",
    "Integraciones con principales POS chilenos",
    "Visualización clara y accionable",
    "Control total de márgenes y rentabilidad"
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ruka Panel de Control",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "99990",
      "priceCurrency": "CLP",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "99990",
        "priceCurrency": "CLP",
        "billingIncrement": "1",
        "unitText": "mes"
      }
    },
    "description": "Panel de control que transforma datos de ventas, compras e inventario en decisiones inteligentes. Integración automática con POS y visualización en tiempo real.",
    "featureList": [
      "Integración automática con POS",
      "Dashboard de ventas en tiempo real",
      "Estado de resultados automatizado",
      "Análisis de márgenes y rentabilidad",
      "Comparativos automáticos",
      "Implementación asistida"
    ],
    "provider": {
      "@type": "Organization",
      "name": "Ruka",
      "url": "https://ruka.cl"
    }
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('registration-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightForm(true);
      setTimeout(() => setHighlightForm(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Helmet>
        <title>Panel de Control Empresarial - Decisiones en Tiempo Real | Ruka</title>
        <meta name="description" content="Transforma tus datos de ventas, compras e inventario en decisiones inteligentes. Panel de control con integración automática a Toteat, Justo, Fudo y más POS. Desde $99.990/mes IVA incluido." />
        <meta name="keywords" content="panel de control empresarial, dashboard ventas, estado de resultados automatizado, integración POS chile, toteat, justo, fudo, análisis ventas, indicadores financieros, business intelligence, KPI dashboard" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Panel de Control Empresarial | Ruka" />
        <meta property="og:description" content="Conecta automáticamente tus ventas, compras e inventario. Visualiza tu negocio en tiempo real sin planillas. Integración con Toteat, Justo, Fudo y más." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ruka.cl/productos/panel-control" />
        <meta property="og:image" content="https://ruka.cl/panel-control-og.png" />
        <meta property="og:image:secure_url" content="https://ruka.cl/panel-control-og.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Panel de Control de Ruka - Dashboard de ventas y estado de resultados en tiempo real" />
        <meta property="og:site_name" content="Ruka" />
        <meta property="og:locale" content="es_CL" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@ruka_ai" />
        <meta name="twitter:title" content="Panel de Control Empresarial | Ruka" />
        <meta name="twitter:description" content="Conecta tus ventas, compras e inventario. Decisiones en tiempo real sin planillas. Integración con principales POS chilenos." />
        <meta name="twitter:image" content="https://ruka.cl/panel-control-og.png" />
        <meta name="twitter:image:alt" content="Panel de Control de Ruka - Dashboard empresarial" />
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="Ruka" />
        <link rel="canonical" href="https://ruka.cl/productos/panel-control" />
        
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
                🚀 Powered by Ruka.ai
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Convierte Tus Datos en Decisiones
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Ruka Panel de Control conecta tus ventas, compras e inventario para mostrarte tu negocio como nunca antes: actualizado, visual y sin planillas.
            </p>
            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 rounded-full"
                onClick={() => {
                  scrollToForm();
                  pushToDataLayer('panel_control_cta_click', {
                    cta_location: 'hero',
                    cta_text: 'Comenzar Ahora',
                    page_path: '/productos/panel-control'
                  });
                }}
              >
                Comenzar Ahora <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>

          {/* Hero Screenshot */}
          <figure className="mt-16 rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
            <img 
              src={panelControlDashboard} 
              alt="Dashboard de ventas de Ruka mostrando métricas de ventas mensuales, impuestos, descuentos, propinas y análisis comparativo" 
              className="w-full h-auto"
              loading="eager"
              width="1200"
              height="675"
            />
          </figure>
        </div>
      </header>

      {/* Integrations Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Integraciones Disponibles</h2>
            <p className="text-xl text-gray-600">Conecta automáticamente con los principales sistemas de punto de venta</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="flex items-center justify-center">
              <img 
                src="/toteat-logo.png" 
                alt="Logo de Toteat - Sistema POS integrado con Ruka" 
                className="h-12 w-auto object-contain"
                loading="lazy"
              />
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/justo-logo.png" 
                alt="Logo de Justo - Sistema POS integrado con Ruka" 
                className="h-12 w-auto object-contain"
                loading="lazy"
              />
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/fudo-logo.png" 
                alt="Logo de Fudo - Sistema POS integrado con Ruka" 
                className="h-12 w-auto object-contain"
                loading="lazy"
              />
            </div>
            <div className="flex items-center justify-center">
              <Badge variant="secondary" className="text-base px-6 py-2">
                + Más POS próximamente
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-4xl md:text-5xl font-bold mb-4">
              ¿Por Qué Elegir Ruka Panel de Control?
            </h2>
            <p className="text-xl text-gray-600">
              Convierte datos dispersos en inteligencia visual, precisa y continua
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg w-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Panels Showcase */}
      <section className="py-20 px-6 bg-gray-50" aria-labelledby="panels-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="panels-heading" className="text-4xl md:text-5xl font-bold mb-4">
              Paneles Inteligentes
            </h2>
            <p className="text-xl text-gray-600">
              Visualiza tu negocio desde todos los ángulos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {panels.map((panel, index) => {
              const Icon = panel.icon;
              return (
                <Card key={index} className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <div className="h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center">
                    <Icon className="w-16 h-16 text-primary/40" />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Icon className="w-5 h-5 text-primary" />
                      {panel.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {panel.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 px-6 bg-white" aria-labelledby="benefits-heading">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="benefits-heading" className="text-4xl md:text-5xl font-bold mb-6">
                Decisiones Inteligentes, Sin Planillas
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Empodera a gerentes, contadores y dueños de negocio con una herramienta que automatiza la consolidación de información y entrega insights listos para actuar.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Image */}
            <figure className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                <img 
                  src={panelControlTicket} 
                  alt="Gráfico de ticket promedio por persona mostrando análisis de ventas en Ruka" 
                  className="w-full h-auto"
                  loading="lazy"
                  width="800"
                  height="450"
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-gray-50" aria-labelledby="pricing-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 id="pricing-heading" className="text-4xl md:text-5xl font-bold mb-4">
              Implementación Simple y Transparente
            </h2>
            <p className="text-xl text-gray-600">
              Comienza a tomar mejores decisiones hoy
            </p>
          </div>

          <Card className="border-2 border-primary shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="mb-4">
                <Badge className="text-base px-4 py-1">Plan Profesional</Badge>
              </div>
              <CardTitle className="text-4xl mb-2">Desde $99.990</CardTitle>
              <CardDescription className="text-lg">por mes IVA incluido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="mb-4 text-center">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  <span className="text-primary">✨ Clientes Ruka:</span> Descuento especial aplicado
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Integración con POS principal",
                  "Dashboard de ventas en tiempo real",
                  "Panel de estado de resultados",
                  "Análisis de márgenes",
                  "Implementación asistida",
                  "Soporte técnico incluido",
                  "Actualizaciones automáticas",
                  "Capacitación del equipo"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                size="lg" 
                className="w-full text-lg mt-6 rounded-full px-8 py-6"
                onClick={() => {
                  scrollToForm();
                  pushToDataLayer('panel_control_cta_click', {
                    cta_location: 'pricing',
                    cta_text: 'Comenzar Ahora',
                    page_path: '/productos/panel-control'
                  });
                }}
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <p className="text-center text-sm text-gray-600">
                ⏰ Oferta válida por {timeLeft}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="registration-form" className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Comienza a Transformar Tus Datos
            </h2>
            <p className="text-xl text-gray-600">
              Completa el formulario y nuestro equipo te contactará para una demo personalizada
            </p>
          </div>
          
          <ProductRegistrationForm 
            pagePath="/productos/panel-control"
            highlightForm={highlightForm}
            timeLeft={timeLeft}
          />
        </div>
      </section>

      <Footer />
      <WhatsappButton source="panel_control_page" />
    </div>
  );
};

export default PanelControl;
