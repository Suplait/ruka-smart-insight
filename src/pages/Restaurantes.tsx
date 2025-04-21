import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RestaurantDataFlowSection from "@/components/RestaurantDataFlowSection";
import FAQ from "@/components/FAQ";
import RegistrationForm from "@/components/restaurant/RegistrationForm";
import ValueMessageTypewriter from "@/components/restaurant/ValueMessageTypewriter";
import ImpactStats from "@/components/restaurant/ImpactStats";

const valueMessages = [
  "Deja que tus chefs se concentren en cocinar, no en Excel.",
  "Controla tus costos de insumos al día, no al mes.",
  "Detecta alzas de precio de tus proveedores en tiempo real.",
  "Genera reportes de food cost en segundos.",
  "Gestiona el pago a tus proveedores sin complicaciones.",
  "Ten todos tus pedidos y facturas a la mano.",
  "Ahorra horas a la semana en procesos administrativos.",
];

export default function Restaurantes() {
  const [highlightForm, setHighlightForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [showScrollToFormTop, setShowScrollToFormTop] = useState(false);
  const [showScrollToFormBottom, setShowScrollToFormBottom] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      document.body.style.paddingTop = "64px";
    } else {
      document.body.style.paddingTop = "";
    }
    return () => {
      document.body.style.paddingTop = "";
    };
  }, []);

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

  useEffect(() => {
    if (window.innerWidth >= 1024) return;
    const handleScroll = () => {
      if (!formRef.current) return;
      const rect = formRef.current.getBoundingClientRect();
      setShowScrollToFormTop(rect.top - 80 > 0);
      setShowScrollToFormBottom(rect.bottom + 80 < window.innerHeight);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
      setHighlightForm(true);
      setTimeout(() => setHighlightForm(false), 2000);
    }
  };

  return (
    <>
      <Helmet>
        <title>Ruka.ai | Control de Food Cost y Gastos para Restaurantes</title>
        <meta name="title" content="Ruka.ai | Control de Food Cost y Gastos para Restaurantes" />
        <meta name="description" content="Software de gestión de costos para restaurantes. Automatiza el procesamiento de facturas, monitorea precios de insumos y optimiza tu food cost en tiempo real. ¡Prueba gratis!" />
        <meta name="keywords" content="software restaurantes, control de costos restaurante, food cost, gestión de restaurantes, sistema para restaurantes, facturas restaurante, automatización restaurantes, software cocina, control de insumos restaurante, costos restaurante" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ruka.ai/restaurantes" />
        <meta property="og:title" content="Ruka.ai | Control de Food Cost y Gastos para Restaurantes" />
        <meta property="og:description" content="Software de gestión de costos para restaurantes. Automatiza el procesamiento de facturas, monitorea precios de insumos y optimiza tu food cost en tiempo real. ¡Prueba gratis!" />
        <meta property="og:image" content="/robotshero2.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://ruka.ai/restaurantes" />
        <meta property="twitter:title" content="Ruka.ai | Control de Food Cost y Gastos para Restaurantes" />
        <meta property="twitter:description" content="Software de gestión de costos para restaurantes. Automatiza el procesamiento de facturas, monitorea precios de insumos y optimiza tu food cost en tiempo real. ¡Prueba gratis!" />
        <meta property="twitter:image" content="/robotshero2.png" />

        <link rel="canonical" href="https://ruka.ai/restaurantes" />

        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Ruka.ai para Restaurantes",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "description": "Software de gestión de costos para restaurantes. Automatiza el procesamiento de facturas, monitorea precios de insumos y optimiza tu food cost en tiempo real.",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "100"
              },
              "category": "Restaurant Management Software",
              "applicationSubCategory": "Food Cost Management",
              "featureList": [
                "Procesamiento automático de facturas",
                "Control de food cost en tiempo real",
                "Monitoreo de precios de insumos",
                "Generación de reportes automáticos",
                "Gestión de proveedores"
              ]
            }
          `}
        </script>
      </Helmet>
      
      <main className="min-h-screen relative">
        <Navbar />
        
        <div className="w-full pb-8">
          <div className="container px-4 sm:px-6">
            <div className="lg:hidden py-8 space-y-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Automatiza tus Costos
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Únete a +100 restaurantes que ya optimizan su food cost con inteligencia artificial
                </p>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  <span>Comienza hoy mismo</span>
                </div>
              </motion.div>
            </div>

            <div className="lg:grid lg:grid-cols-[1fr,460px] lg:gap-16">
              <div className="py-12 lg:py-24 space-y-16 lg:space-y-32">
                <motion.header
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                    ¿Te quita tiempo
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> digitar las facturas </span>
                    de tu Restaurante?
                  </h1>
                  <p className="text-2xl text-muted-foreground leading-relaxed">
                    <ValueMessageTypewriter 
                      messages={valueMessages} 
                      staticMode={true}
                      staticText="Sabemos que tu equipo pasa horas registrando facturas de proveedores en Excel, POS o ERP."
                    />
                  </p>
                </motion.header>

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
                    Y cuando por fin tienes los datos...
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <p className="text-2xl text-red-800/80 leading-relaxed">
                      Ya es demasiado tarde. Te enteras que el precio del aceite subió hace un mes y has estado perdiendo margen en todos tus platos principales.
                    </p>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <div className="space-y-4">
                        <div className="h-2 bg-red-200 rounded-full w-full" />
                        <div className="h-2 bg-red-200 rounded-full w-3/4" />
                        <div className="h-2 bg-red-200 rounded-full w-1/2" />
                      </div>
                      <div className="mt-6 text-center text-red-600 font-semibold">
                        -15% Food Cost
                      </div>
                    </div>
                  </div>
                </motion.div>

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
                        Digitaliza tus facturas automáticamente
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</span>
                        Agrupa y crea un maestro de insumos
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</span>
                        Monitorea precios en tiempo real
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</span>
                        Alerta ante alzas de precios
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</span>
                        Se integra con tu facturador
                      </p>
                    </div>
                    <div className="relative">
                      <img src="/robotshero2.png" alt="Robot procesando datos" className="w-full object-contain transform hover:scale-105 transition-transform duration-300" />
                    </div>
                  </div>
                </motion.div>

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
                    Optimiza la gestión de compras sin sobrecargar a tu equipo
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <p className="text-2xl text-green-800/80 leading-relaxed">
                      Olvídate de gastar en más personal para controlar costos. Ruka hace el trabajo por ti, 24/7, sin errores y en tiempo real.
                    </p>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <div className="space-y-4">
                        <div className="h-2 bg-green-200 rounded-full w-full" />
                        <div className="h-2 bg-green-200 rounded-full w-4/5" />
                        <div className="h-2 bg-green-200 rounded-full w-full" />
                      </div>
                      <div className="mt-6 text-center text-green-600 font-semibold">
                        +25% Eficiencia en Cocina
                      </div>
                    </div>
                  </div>
                </motion.div>

                <RestaurantDataFlowSection />

                <ImpactStats />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-center space-y-8 bg-gradient-to-br from-primary/10 to-purple-100 p-6 sm:p-12 rounded-3xl mx-auto"
                >
                  <h2 className="text-4xl font-bold">
                    Optimiza tu food cost ahora
                  </h2>
                  <p className="text-2xl text-gray-700">
                    Únete a los +100 restaurantes que ya están ahorrando tiempo y dinero con Ruka
                  </p>
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 h-auto transition-all duration-300 hover:scale-105 max-w-full"
                    onClick={() => setHighlightForm(true)}
                  >
                    Comienza Tu Prueba Gratuita <ArrowRight className="ml-2" />
                  </Button>
                </motion.div>

                <div className="hidden lg:block">
                  <FAQ />
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="sticky top-24" style={{ height: 'calc(100vh - 96px)' }}>
                  <RegistrationForm 
                    highlightForm={highlightForm} 
                    timeLeft={timeLeft}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          <FAQ />
        </div>
        
        <Footer />

        <AnimatePresence>
          {showScrollToFormTop && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="lg:hidden fixed top-24 left-1/2 -translate-x-1/2 z-50"
            >
              <Button
                onClick={scrollToForm}
                size="lg"
                className="shadow-lg bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-300 px-6 py-6 h-auto rounded-full"
              >
                Comenzar Ahora
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {showScrollToFormBottom && (
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
              Comenzar Ahora
            </Button>
          </motion.div>
        )}
      </main>
    </>
  );
}
