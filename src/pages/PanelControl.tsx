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

  const integrations = [
    { name: "Toteat", available: true },
    { name: "Justo", available: true },
    { name: "Fudo", available: true },
    { name: "Más POS", available: false }
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
        <meta name="description" content="Transforma tus datos de ventas, compras e inventario en decisiones inteligentes. Panel de control con integración automática a Toteat, Justo, Fudo y más POS. Desde $99.990/mes + IVA." />
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
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="mb-4">
                <Zap className="w-3 h-3 mr-1" />
                Powered by Ruka.ai
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Convierte Tus Datos en{" "}
                <span className="text-primary">Decisiones</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Ruka Panel de Control conecta tus ventas, compras e inventario para mostrarte tu negocio como nunca antes: actualizado, visual y sin planillas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  onClick={() => {
                    scrollToForm();
                    pushToDataLayer('panel_control_cta_click', {
                      cta_location: 'hero',
                      cta_text: 'Comenzar Ahora',
                      page_path: '/productos/panel-control'
                    });
                  }}
                  className="text-lg"
                >
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg">
                  Ver Demo
                </Button>
              </div>
            </div>
            
            {/* Placeholder Image */}
            <div className="relative">
              <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <BarChart3 className="w-16 h-16 mx-auto text-primary/40" />
                  <p className="text-sm text-muted-foreground">Dashboard Principal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Integraciones Disponibles</h2>
            <p className="text-muted-foreground">Conecta automáticamente con los principales sistemas de punto de venta</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {integrations.map((integration, index) => (
              <Card key={index} className="w-48">
                <CardContent className="pt-6 text-center">
                  <div className="h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">{integration.name}</span>
                  </div>
                  {integration.available ? (
                    <Badge variant="default" className="w-full">Disponible</Badge>
                  ) : (
                    <Badge variant="secondary" className="w-full">Próximamente</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Por Qué Elegir Ruka Panel de Control?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Convierte datos dispersos en inteligencia visual, precisa y continua
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
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
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Paneles Inteligentes
            </h2>
            <p className="text-xl text-muted-foreground">
              Visualiza tu negocio desde todos los ángulos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {panels.map((panel, index) => {
              const Icon = panel.icon;
              return (
                <Card key={index} className="overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center">
                    <Icon className="w-16 h-16 text-primary/40" />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Decisiones Inteligentes, Sin Planillas
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
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
            
            {/* Placeholder Image */}
            <div className="relative">
              <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border-2 border-primary/20 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <PieChart className="w-20 h-20 mx-auto text-primary/40" />
                  <p className="text-sm text-muted-foreground">Panel de Estado de Resultados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Implementación Simple y Transparente
            </h2>
            <p className="text-xl text-muted-foreground">
              Comienza a tomar mejores decisiones hoy
            </p>
          </div>

          <Card className="border-2 border-primary">
            <CardHeader className="text-center pb-8">
              <div className="mb-4">
                <Badge className="text-base px-4 py-1">Plan Profesional</Badge>
              </div>
              <CardTitle className="text-4xl mb-2">Desde $99.990</CardTitle>
              <CardDescription className="text-lg">por mes + IVA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                className="w-full text-lg mt-6"
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
              
              <p className="text-center text-sm text-muted-foreground">
                ⏰ Oferta válida por {timeLeft}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="registration-form" className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comienza a Transformar Tus Datos
            </h2>
            <p className="text-xl text-muted-foreground">
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
