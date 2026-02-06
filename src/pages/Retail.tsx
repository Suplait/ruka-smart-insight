import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  XCircle,
  Zap,
  Shield,
  CreditCard,
  BarChart3,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import RegistrationForm from "@/components/restaurant/RegistrationForm";
import { useIsMobile } from "@/hooks/use-mobile";

const benefits = [
  "Las facturas se cargan solas",
  "Sabes si un proveedor te cobra más caro",
  "Sabes exactamente qué pagar esta semana",
  "El stock se actualiza sin doble trabajo",
  "Puedes delegar sin perder control"
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
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                  Deja de digitar facturas y controla tus compras
                  <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> sin Excel</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Ruka centraliza compras, facturas y precios para que el stock, los pagos y los márgenes se controlen solos.
                </p>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <BarChart3 className="w-4 h-4" />
                  <span>Para negocios con volumen de compras</span>
                </div>
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
              <div className="py-12 lg:py-24 space-y-16 lg:space-y-32">
                
                {/* Section 1: Hero (Desktop) */}
                <motion.header 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  className="space-y-8 hidden lg:block"
                >
                  <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                    Deja de digitar facturas y controla tus compras
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> sin Excel</span>
                  </h1>
                  <p className="text-2xl text-muted-foreground leading-relaxed">
                    Ruka centraliza compras, facturas y precios para que el stock, los pagos y los márgenes se controlen solos, sin Excel ni digitación.
                  </p>
                </motion.header>

                {/* Section 2: Pain Points - Red Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  viewport={{ once: true }} 
                  className="relative p-8 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 space-y-8"
                >
                  <div className="absolute -top-6 right-8 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-4xl font-bold text-red-900">
                    ¿Te suena familiar?
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <p className="flex items-center gap-3 text-xl text-red-800/80">
                        <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                          <Clock className="w-4 h-4" />
                        </span>
                        2-4 horas al día digitando facturas
                      </p>
                      <p className="flex items-center gap-3 text-xl text-red-800/80">
                        <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                          <FileText className="w-4 h-4" />
                        </span>
                        Excel que no escala con el volumen
                      </p>
                      <p className="flex items-center gap-3 text-xl text-red-800/80">
                        <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </span>
                        Alto riesgo de error humano
                      </p>
                      <p className="flex items-center gap-3 text-xl text-red-800/80">
                        <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </span>
                        Todo depende de una sola persona
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <div className="space-y-4">
                        <div className="h-2 bg-red-200 rounded-full w-full" />
                        <div className="h-2 bg-red-200 rounded-full w-3/4" />
                        <div className="h-2 bg-red-200 rounded-full w-1/2" />
                      </div>
                      <div className="mt-6 text-center text-red-600 font-semibold">
                        Horas perdidas cada semana
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Section 3: Consequences - Amber Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  viewport={{ once: true }} 
                  className="relative p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 space-y-8"
                >
                  <div className="absolute -top-6 right-8 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <h2 className="text-4xl font-bold text-amber-900">
                    Y cuando el problema no se resuelve...
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <p className="text-2xl text-amber-800/80 leading-relaxed">
                        Detectas alzas de precios cuando ya perdiste margen. Reclamas sin evidencia clara. Pagas con ansiedad y doble revisión.
                      </p>
                      <p className="text-xl text-amber-700/70 italic">
                        Tu stock refleja la realidad "más o menos"...
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <div className="space-y-4">
                        <div className="h-2 bg-amber-200 rounded-full w-full" />
                        <div className="h-2 bg-amber-200 rounded-full w-2/3" />
                        <div className="h-2 bg-amber-200 rounded-full w-1/3" />
                      </div>
                      <div className="mt-6 text-center text-amber-600 font-semibold">
                        Margen perdido sin darte cuenta
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Section 4: Solution - Blue Card with Robot */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  viewport={{ once: true }} 
                  className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-primary/20 space-y-8"
                >
                  <div className="absolute -top-6 right-8 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <img src="/0webclip.jpg" alt="Ruka Logo" className="w-8 h-8 rounded-full" />
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Ruka lo hace todo automático
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6 text-xl text-primary/80 leading-relaxed">
                      <p className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</span>
                        Las facturas se cargan solas
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</span>
                        Sabes si un proveedor te cobra más caro
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</span>
                        Sabes exactamente qué pagar esta semana
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</span>
                        El stock se actualiza sin doble trabajo
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</span>
                        Puedes delegar sin perder control
                      </p>
                    </div>
                    <div className="relative">
                      <img src="/robotshero2.png" alt="Robot procesando datos" className="w-full object-contain transform hover:scale-105 transition-transform duration-300" />
                    </div>
                  </div>
                </motion.div>

                {/* Mobile Form Section */}
                <div id="mobile-form-section" className="lg:hidden w-full">
                  <RegistrationForm highlightForm={highlightForm} timeLeft={timeLeft} pagePath="/retail" />
                </div>

                {/* Section 5: Timeline (TTFV) - Green Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  viewport={{ once: true }} 
                  className="relative p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 space-y-8"
                >
                  <div className="absolute -top-6 right-8 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-4xl font-bold text-green-900">
                    Valor visible en menos de 5 días
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
                      <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        Día 1
                      </div>
                      <h3 className="text-xl font-semibold text-green-900">Conectas SII o correo</h3>
                      <p className="text-green-800/70">Las facturas empiezan a entrar solas</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
                      <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        Día 3
                      </div>
                      <h3 className="text-xl font-semibold text-green-900">XML desglosado automático</h3>
                      <p className="text-green-800/70">Cero digitación. Compras ordenadas por proveedor.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
                      <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        Día 5
                      </div>
                      <h3 className="text-xl font-semibold text-green-900">Alertas de alza de precios</h3>
                      <p className="text-green-800/70">Evidencia para reclamar. Primer ahorro detectado.</p>
                    </div>
                  </div>
                  <div className="text-center pt-4">
                    <p className="text-xl text-green-700 font-medium">
                      👉 Primer valor visible: <span className="font-bold">"dejé de digitar facturas"</span>
                    </p>
                  </div>
                </motion.div>

                {/* Section 6: For Who */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  viewport={{ once: true }} 
                  className="space-y-8"
                >
                  <h2 className="text-4xl font-bold text-center lg:text-left">
                    ¿Es para ti?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 space-y-4">
                      <h3 className="text-xl font-bold text-green-900 flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6" />
                        Es para negocios que:
                      </h3>
                      <ul className="space-y-3">
                        {forWho.isFor.map((item, index) => (
                          <li key={index} className="flex items-center gap-3 text-lg text-green-800">
                            <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 space-y-4">
                      <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                        <XCircle className="w-6 h-6" />
                        No es para quienes:
                      </h3>
                      <ul className="space-y-3">
                        {forWho.notFor.map((item, index) => (
                          <li key={index} className="flex items-center gap-3 text-lg text-gray-600">
                            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">✗</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Section 7: Final CTA */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  viewport={{ once: true }} 
                  className="text-center space-y-8 bg-gradient-to-br from-primary/10 to-purple-100 p-6 sm:p-12 rounded-3xl"
                >
                  <h2 className="text-4xl font-bold">
                    Evalúa si Ruka aplica para tu empresa
                  </h2>
                  <p className="text-2xl text-gray-700">
                    En 15 minutos te mostramos si te ahorra tiempo y errores
                  </p>
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-6 h-auto transition-all duration-300 hover:scale-105 max-w-full" 
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
                </motion.div>

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
