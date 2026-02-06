import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Clock, 
  FileText, 
  AlertTriangle, 
  TrendingDown, 
  CheckCircle2, 
  XCircle,
  Zap,
  Shield,
  Users,
  Package,
  CreditCard,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import RegistrationForm from "@/components/restaurant/RegistrationForm";
import { useIsMobile } from "@/hooks/use-mobile";

const painPoints = [
  {
    icon: Clock,
    title: "2-4 horas al día",
    description: "digitando facturas o ítems manualmente"
  },
  {
    icon: FileText,
    title: "Excel que no escala",
    description: "con el volumen de tu operación"
  },
  {
    icon: AlertTriangle,
    title: "Alto riesgo de error",
    description: "humano en cada digitación"
  },
  {
    icon: Users,
    title: "Todo depende",
    description: "de una sola persona"
  }
];

const consequences = [
  {
    icon: TrendingDown,
    text: "Detectas alzas de precios cuando ya perdiste margen"
  },
  {
    icon: AlertTriangle,
    text: "Reclamas sin evidencia clara"
  },
  {
    icon: CreditCard,
    text: "Pagas con ansiedad y doble revisión"
  },
  {
    icon: Package,
    text: "Tu stock refleja la realidad \"más o menos\""
  }
];

const timeline = [
  {
    day: "Día 1",
    title: "Conectas SII o correo",
    items: ["Las facturas empiezan a entrar solas"]
  },
  {
    day: "Día 3",
    title: "XML desglosado automático",
    items: ["Cero digitación", "Compras ordenadas por proveedor"]
  },
  {
    day: "Día 5",
    title: "Alertas de alza de precios",
    items: ["Evidencia para reclamar", "Primer ahorro detectado"]
  }
];

const benefits = [
  {
    icon: Zap,
    text: "Las facturas se cargan solas"
  },
  {
    icon: TrendingDown,
    text: "Sabes si un proveedor te cobra más caro"
  },
  {
    icon: CreditCard,
    text: "Sabes exactamente qué pagar esta semana"
  },
  {
    icon: Package,
    text: "El stock se actualiza sin doble trabajo"
  },
  {
    icon: Shield,
    text: "Puedes delegar sin perder control"
  }
];

const forWho = {
  isFor: [
    "Tienen volumen de compras",
    "Usan Excel + ERP / POS / contador",
    "Quieren orden sin contratar más gente"
  ],
  notFor: [
    "No usan facturación electrónica",
    "Prefieren seguir digitando todo a mano"
  ]
};

export default function Retail() {
  const [highlightForm, setHighlightForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [showScrollToForm, setShowScrollToForm] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isMobile) {
        const formSection = document.getElementById('mobile-form-section');
        if (formSection) {
          const rect = formSection.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          setShowScrollToForm(!isVisible);
        } else {
          setShowScrollToForm(window.scrollY > 300);
        }
      } else {
        setShowScrollToForm(window.scrollY > 300);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

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

  const scrollToForm = () => {
    const form = isMobile ? document.getElementById('mobile-form-section') : document.querySelector('form');
    if (form) {
      form.scrollIntoView({
        behavior: 'smooth'
      });
      setHighlightForm(true);
      setTimeout(() => setHighlightForm(false), 2000);
    }
  };

  return (
    <>
      <Helmet>
        <title>Ruka.ai | Automatización de Compras para Retail</title>
        <meta name="title" content="Ruka.ai | Automatización de Compras para Retail" />
        <meta name="description" content="Deja de digitar facturas y controla tus compras sin Excel. Ruka centraliza compras, facturas y precios para que el stock, los pagos y los márgenes se controlen solos." />
        <meta name="keywords" content="software retail, automatización compras, control de inventario, gestión de facturas, software empresas, automatización facturas, control de costos, gestión de proveedores" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ruka.ai/retail" />
        <meta property="og:title" content="Ruka.ai | Automatización de Compras para Retail" />
        <meta property="og:description" content="Deja de digitar facturas y controla tus compras sin Excel. Ruka centraliza compras, facturas y precios para que el stock, los pagos y los márgenes se controlen solos." />
        <meta property="og:image" content="/robotshero2.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://ruka.ai/retail" />
        <meta property="twitter:title" content="Ruka.ai | Automatización de Compras para Retail" />
        <meta property="twitter:description" content="Deja de digitar facturas y controla tus compras sin Excel. Ruka centraliza compras, facturas y precios para que el stock, los pagos y los márgenes se controlen solos." />
        <meta property="twitter:image" content="/robotshero2.png" />

        <link rel="canonical" href="https://ruka.ai/retail" />

        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Ruka.ai para Retail",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "description": "Automatización de compras y facturas para retail. Centraliza compras, facturas y precios sin Excel ni digitación manual.",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "100"
              },
              "category": "Retail Management Software",
              "applicationSubCategory": "Purchase Automation",
              "featureList": [
                "Procesamiento automático de facturas",
                "Control de compras centralizado",
                "Alertas de alza de precios",
                "Gestión de proveedores",
                "Automatización de stock"
              ]
            }
          `}
        </script>
      </Helmet>
      
      <main className="min-h-screen relative">
        <Navbar />
        
        <div className="w-full pb-8">
          <div className="container px-4 sm:px-6">
            {/* Mobile Header */}
            <div className="lg:hidden pt-24 pb-8 space-y-6 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <BarChart3 className="w-4 h-4" />
                  <span>Para negocios con volumen de compras</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                  Deja de digitar facturas y controla tus compras
                  <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> sin Excel</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Ruka centraliza compras, facturas y precios para que el stock, los pagos y los márgenes se controlen solos.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="pt-4"
              >
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 h-auto transition-all duration-300 hover:scale-105 w-full" 
                  onClick={scrollToForm}
                >
                  Ver si Ruka aplica para mi negocio <ArrowRight className="ml-2" />
                </Button>
              </motion.div>
            </div>

            <div className="lg:grid lg:grid-cols-[1fr,460px] lg:gap-16">
              <div className="py-12 lg:py-24 space-y-16 lg:space-y-24">
                
                {/* Section 1: Hero (Desktop) */}
                <motion.header 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  className="space-y-8 hidden lg:block"
                >
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                    <BarChart3 className="w-4 h-4" />
                    <span>Para negocios con volumen de compras</span>
                  </div>
                  <h1 className="text-5xl sm:text-6xl font-light leading-tight tracking-tight">
                    Deja de digitar facturas y controla tus compras
                    <span className="font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> sin Excel</span>
                  </h1>
                  <p className="text-2xl text-muted-foreground leading-relaxed font-light">
                    Ruka centraliza compras, facturas y precios para que el stock, los pagos y los márgenes se controlen solos, sin Excel ni digitación.
                  </p>
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-6 h-auto transition-all duration-300 hover:scale-105" 
                    onClick={scrollToForm}
                  >
                    Ver si Ruka aplica para mi negocio <ArrowRight className="ml-2" />
                  </Button>
                </motion.header>

                {/* Section 2: Pain Points */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  viewport={{ once: true }} 
                  className="space-y-8"
                >
                  <h2 className="text-3xl lg:text-4xl font-light text-center lg:text-left">
                    ¿Te suena familiar?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {painPoints.map((pain, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 space-y-3"
                      >
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                          <pain.icon className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-red-900">{pain.title}</h3>
                        <p className="text-red-800/70">{pain.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {/* Section 3: Consequences */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  viewport={{ once: true }} 
                  className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 space-y-6"
                >
                  <h2 className="text-3xl lg:text-4xl font-light">
                    Y cuando el problema no se resuelve...
                  </h2>
                  <div className="space-y-4">
                    {consequences.map((consequence, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 p-4 bg-white/60 rounded-xl"
                      >
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <consequence.icon className="w-5 h-5 text-amber-700" />
                        </div>
                        <p className="text-lg text-amber-900">{consequence.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {/* Section 4: Value Proposition */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  viewport={{ once: true }} 
                  className="relative"
                >
                  <div className="p-8 lg:p-12 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-50 border border-primary/20 text-center space-y-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                      <img src="/0webclip.jpg" alt="Ruka Logo" className="w-10 h-10 rounded-lg" />
                    </div>
                    <blockquote className="text-2xl lg:text-3xl font-light leading-relaxed text-foreground">
                      "Ruka centraliza compras, facturas y precios para que el stock, los pagos y los márgenes se controlen solos, 
                      <span className="font-semibold text-primary"> sin Excel ni digitación.</span>"
                    </blockquote>
                  </div>
                </motion.section>

                {/* Mobile Form Section */}
                <div id="mobile-form-section" className="lg:hidden w-full">
                  <RegistrationForm highlightForm={highlightForm} timeLeft={timeLeft} pagePath="/retail" />
                </div>

                {/* Section 5: Timeline (TTFV) */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  viewport={{ once: true }} 
                  className="space-y-8"
                >
                  <div className="text-center lg:text-left space-y-4">
                    <h2 className="text-3xl lg:text-4xl font-light">
                      Valor visible en menos de 5 días
                    </h2>
                    <p className="text-xl text-muted-foreground">
                      Primer resultado: <span className="font-medium text-primary">dejé de digitar facturas</span>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {timeline.map((step, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.15 }}
                        viewport={{ once: true }}
                        className="relative p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 space-y-4"
                      >
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          {step.day}
                        </div>
                        <h3 className="text-xl font-semibold text-green-900">{step.title}</h3>
                        <ul className="space-y-2">
                          {step.items.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-green-800/80">
                              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {/* Section 6: Benefits */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  viewport={{ once: true }} 
                  className="space-y-8"
                >
                  <h2 className="text-3xl lg:text-4xl font-light text-center lg:text-left">
                    Lo que ganas con Ruka
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.08 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 p-5 rounded-xl bg-card border hover:shadow-md transition-shadow"
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-lg font-medium">{benefit.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {/* Section 7: For Who */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  viewport={{ once: true }} 
                  className="space-y-8"
                >
                  <h2 className="text-3xl lg:text-4xl font-light text-center lg:text-left">
                    ¿Es para ti?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 space-y-4">
                      <h3 className="text-xl font-semibold text-green-900 flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6" />
                        Es para negocios que:
                      </h3>
                      <ul className="space-y-3">
                        {forWho.isFor.map((item, index) => (
                          <li key={index} className="flex items-center gap-3 text-green-800">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 space-y-4">
                      <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                        <XCircle className="w-6 h-6" />
                        No es para quienes:
                      </h3>
                      <ul className="space-y-3">
                        {forWho.notFor.map((item, index) => (
                          <li key={index} className="flex items-center gap-3 text-gray-600">
                            <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.section>

                {/* Section 8: Final CTA */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  viewport={{ once: true }} 
                  className="text-center space-y-8 bg-gradient-to-br from-primary/10 to-purple-100 p-8 sm:p-12 rounded-3xl"
                >
                  <h2 className="text-3xl lg:text-4xl font-light">
                    Evalúa si Ruka aplica para tu empresa
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-xl mx-auto">
                    En 15 minutos te mostramos si te ahorra tiempo y errores
                  </p>
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-6 h-auto transition-all duration-300 hover:scale-105" 
                    onClick={scrollToForm}
                  >
                    Ver si aplica para mi negocio <ArrowRight className="ml-2" />
                  </Button>
                  <div className="flex items-center justify-center gap-6 flex-wrap text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Sin compromiso
                    </span>
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Sin tarjeta
                    </span>
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Implementación rápida
                    </span>
                  </div>
                </motion.section>

                <div className="hidden lg:block">
                  <FAQ />
                </div>
              </div>

              {/* Desktop Sticky Form */}
              <div className="hidden lg:block">
                <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                  <RegistrationForm highlightForm={highlightForm} timeLeft={timeLeft} pagePath="/retail" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          <FAQ />
        </div>
        
        <Footer />

        {/* Floating CTA Button for Mobile */}
        {showScrollToForm && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 20 }} 
            className="lg:hidden fixed bottom-6 right-6 z-50"
          >
            <Button 
              onClick={scrollToForm} 
              size="lg" 
              className="shadow-lg bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-300 px-6 py-6 h-auto rounded-full"
            >
              Evaluar ahora <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </main>
    </>
  );
}
