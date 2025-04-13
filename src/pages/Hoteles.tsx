import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, TrendingUp, Bed, Calendar, CreditCard, Hotel, Users, Receipt, AlertTriangle, Zap, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RestaurantDataFlowSection from "@/components/RestaurantDataFlowSection";
import FAQ from "@/components/FAQ";
import HotelRegistrationForm from "@/components/hotel/HotelRegistrationForm";
import ValueMessageTypewriter from "@/components/restaurant/ValueMessageTypewriter";
import ImpactStats from "@/components/restaurant/ImpactStats";

const valueMessages = [
  "Deja que tu staff se concentre en atender huéspedes, no en Excel.",
  "Controla tus costos operativos diariamente, no al mes.",
  "Detecta alzas de precio de tus proveedores en tiempo real.",
  "Genera reportes de gastos en segundos.",
  "Gestiona el pago a tus proveedores sin complicaciones.",
  "Ten todas tus órdenes de compra y facturas a la mano.",
  "Ahorra horas a la semana en procesos administrativos.",
];

export default function Hoteles() {
  const [highlightForm, setHighlightForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [showScrollToForm, setShowScrollToForm] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToForm(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const scrollToForm = () => {
    const form = document.querySelector('form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
      setHighlightForm(true);
      setTimeout(() => setHighlightForm(false), 2000);
    }
  };

  return (
    <>
      <Helmet>
        <title>Ruka.ai | Control de Costos y Gestión para Hoteles</title>
        <meta name="title" content="Ruka.ai | Control de Costos y Gestión para Hoteles" />
        <meta name="description" content="Software de gestión de costos para hoteles. Automatiza el procesamiento de facturas, monitorea precios de insumos y optimiza tus costos operativos en tiempo real. ¡Prueba gratis!" />
        <meta name="keywords" content="software hoteles, control de costos hotel, gestión hotelera, sistema para hoteles, facturas hotel, automatización hotelera, software hotelería, control de insumos hotel, costos hoteleros" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ruka.ai/hoteles" />
        <meta property="og:title" content="Ruka.ai | Control de Costos y Gestión para Hoteles" />
        <meta property="og:description" content="Software de gestión de costos para hoteles. Automatiza el procesamiento de facturas, monitorea precios de insumos y optimiza tus costos operativos en tiempo real. ¡Prueba gratis!" />
        <meta property="og:image" content="/robotshero2.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://ruka.ai/hoteles" />
        <meta property="twitter:title" content="Ruka.ai | Control de Costos y Gestión para Hoteles" />
        <meta property="twitter:description" content="Software de gestión de costos para hoteles. Automatiza el procesamiento de facturas, monitorea precios de insumos y optimiza tus costos operativos en tiempo real. ¡Prueba gratis!" />
        <meta property="twitter:image" content="/robotshero2.png" />

        <link rel="canonical" href="https://ruka.ai/hoteles" />

        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Ruka.ai para Hoteles",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "description": "Software de gestión de costos para hoteles. Automatiza el procesamiento de facturas, monitorea precios de insumos y optimiza tus costos operativos en tiempo real.",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "100"
              },
              "category": "Hotel Management Software",
              "applicationSubCategory": "Cost Management",
              "featureList": [
                "Procesamiento automático de facturas",
                "Control de costos en tiempo real",
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
                  Gestión Inteligente para tu Hotel
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Únete a +50 hoteles que ya optimizan sus costos operativos con inteligencia artificial
                </p>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  <span>Comienza hoy mismo</span>
                </div>
              </motion.div>
            </div>

            <div className="lg:hidden w-full sm:px-4 mb-8">
              <HotelRegistrationForm 
                highlightForm={highlightForm} 
                timeLeft={timeLeft}
              />
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
                    ¿Tu hotel pierde tiempo
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> procesando facturas</span>
                    manualmente?
                  </h1>
                  <p className="text-2xl text-muted-foreground leading-relaxed">
                    <ValueMessageTypewriter 
                      messages={valueMessages} 
                      staticMode={true}
                      staticText="Sabemos que el personal administrativo de tu hotel pasa horas registrando facturas de proveedores en Excel o en tu PMS hotelero."
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
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-4xl font-bold text-red-900">
                    Los desafíos comunes en la gestión de hoteles:
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Bed className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                        <p className="text-lg text-red-800/80">
                          Múltiples departamentos generando gran volumen de facturas
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                        <p className="text-lg text-red-800/80">
                          Temporalidad que complica el seguimiento de gastos
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                        <p className="text-lg text-red-800/80">
                          Alta rotación de personal que afecta la continuidad de procesos
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Receipt className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                        <p className="text-lg text-red-800/80">
                          Volumen masivo de facturas que llegan a fin de mes
                        </p>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <div className="space-y-4">
                        <div className="h-2 bg-red-200 rounded-full w-full" />
                        <div className="h-2 bg-red-200 rounded-full w-3/4" />
                        <div className="h-2 bg-red-200 rounded-full w-1/2" />
                      </div>
                      <div className="mt-6 text-center text-red-600 font-semibold">
                        Pérdida de control sobre el 35% de tus gastos operativos
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
                    Ruka: La solución para la gestión de costos en hoteles
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-1">✓</div>
                        <p className="text-lg text-primary/80">
                          <span className="font-semibold">Procesamiento centralizado:</span> Todas las facturas en un solo lugar, fácil de gestionar
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-1">✓</div>
                        <p className="text-lg text-primary/80">
                          <span className="font-semibold">Monitoreo de costos:</span> Seguimiento de precios de proveedores en tiempo real
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-1">✓</div>
                        <p className="text-lg text-primary/80">
                          <span className="font-semibold">Automatización:</span> Reduce el tiempo dedicado a tareas administrativas
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-1">✓</div>
                        <p className="text-lg text-primary/80">
                          <span className="font-semibold">Reportes detallados:</span> Visualiza y analiza tus costos fácilmente
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -top-10 -right-10 bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full transform rotate-12">
                        Para la industria hotelera
                      </div>
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
                    <Hotel className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-4xl font-bold text-green-900">
                    Beneficios para la operación hotelera
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-5">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                        <h3 className="text-lg font-medium text-green-800 mb-2 flex items-center gap-2">
                          <Bed className="w-5 h-5" /> Gestión hotelera
                        </h3>
                        <p className="text-green-700">Seguimiento de gastos por departamento y automatización de procesos</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                        <h3 className="text-lg font-medium text-green-800 mb-2 flex items-center gap-2">
                          <CreditCard className="w-5 h-5" /> Finanzas
                        </h3>
                        <p className="text-green-700">Mejor control de costos y optimización de recursos</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                        <h3 className="text-lg font-medium text-green-800 mb-2 flex items-center gap-2">
                          <Users className="w-5 h-5" /> Gerencia
                        </h3>
                        <p className="text-green-700">Datos centralizados para toma de decisiones más informadas</p>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <div className="text-center mb-6">
                        <span className="text-3xl font-bold text-green-600">+32%</span>
                        <p className="text-green-700 font-medium">Reducción en tiempo administrativo</p>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Eficiencia operativa</span>
                            <span className="text-green-600 font-medium">+25%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full w-[85%]"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Control de costos</span>
                            <span className="text-green-600 font-medium">+40%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full w-[90%]"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">ROI primer trimestre</span>
                            <span className="text-green-600 font-medium">320%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full w-[95%]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <RestaurantDataFlowSection />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="space-y-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-12 rounded-3xl"
                >
                  <h2 className="text-4xl font-bold text-center">
                    El impacto en tu hotel
                  </h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0 * 0.2 }}
                      className="bg-white p-8 rounded-xl shadow-lg text-center space-y-4 hover:shadow-xl transition-shadow"
                    >
                      <Zap className="w-12 h-12 text-yellow-500 mx-auto" />
                      <div className="text-4xl font-bold text-yellow-500">90%</div>
                      <p className="text-gray-600">Menos tiempo en papeleo</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 * 0.2 }}
                      className="bg-white p-8 rounded-xl shadow-lg text-center space-y-4 hover:shadow-xl transition-shadow"
                    >
                      <BarChart className="w-12 h-12 text-blue-500 mx-auto" />
                      <div className="text-4xl font-bold text-blue-500">100%</div>
                      <p className="text-gray-600">Control de costos</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2 * 0.2 }}
                      className="bg-white p-8 rounded-xl shadow-lg text-center space-y-4 hover:shadow-xl transition-shadow"
                    >
                      <TrendingUp className="w-12 h-12 text-green-500 mx-auto" />
                      <div className="text-4xl font-bold text-green-500">15%</div>
                      <p className="text-gray-600">Ahorro en insumos</p>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-center space-y-8 bg-gradient-to-br from-primary/10 to-purple-100 p-6 sm:p-12 rounded-3xl mx-auto"
                >
                  <h2 className="text-4xl font-bold">
                    Optimiza la gestión financiera de tu hotel ahora
                  </h2>
                  <p className="text-2xl text-gray-700">
                    Únete a los +50 hoteles que ya están ahorrando tiempo y elevando su rentabilidad con Ruka
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
                  <HotelRegistrationForm 
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
                Comenzar Ahora
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
