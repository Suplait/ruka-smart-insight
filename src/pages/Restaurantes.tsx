import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CreditCard, Clock, ChartBarIcon, Zap, TrendingUp, ShieldCheck, Clock4 } from "lucide-react";
import RestaurantDataFlowSection from "@/components/RestaurantDataFlowSection";

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
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    nombreRestaurante: "",
    ciudad: ""
  });
  const [highlightForm, setHighlightForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showScrollToForm, setShowScrollToForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToForm(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const current = valueMessages[currentMessage];
    
    if (isDeleting) {
      if (displayText === "") {
        setIsDeleting(false);
        setCurrentMessage((prev) => (prev + 1) % valueMessages.length);
      } else {
        timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        }, 30);
      }
    } else {
      if (displayText === current) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      } else {
        timeout = setTimeout(() => {
          setDisplayText(current.substring(0, displayText.length + 1));
        }, 30);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentMessage, displayText, isDeleting]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "¡Gracias por tu interés!",
      description: "Te contactaremos pronto para comenzar tu proceso de onboarding."
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const scrollToForm = () => {
    const form = document.querySelector('form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
      setHighlightForm(true);
      setTimeout(() => setHighlightForm(false), 2000);
    }
  };

  const renderForm = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-xl shadow-xl border p-6 sm:p-8 space-y-6 sm:space-y-8 transition-all duration-300 w-full ${
        highlightForm ? 'ring-4 ring-primary shadow-2xl scale-105' : ''
      }`}
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Comienza tu Prueba Gratuita</h2>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-primary">
            Si te registras antes de las 12:00pm tendrás acceso el mismo día
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Faltan {timeLeft} para las 12:00pm</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <Input
          name="nombreRestaurante"
          placeholder="Nombre de tu Restaurante"
          value={formData.nombreRestaurante}
          onChange={handleChange}
          required
          className="h-12"
        />
        <Input
          name="nombre"
          placeholder="Tu Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="h-12"
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="h-12"
        />
        <Input
          name="ciudad"
          placeholder="Ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          required
          className="h-12"
        />
        <div className="space-y-4">
          <Button type="submit" className="w-full gap-2 h-12 text-lg">
            Comenzar Ahora <ArrowRight className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ShieldCheck className="w-4 h-4" />
              <span>Datos seguros</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock4 className="w-4 h-4" />
              <span>Soporte 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CreditCard className="w-4 h-4" />
              <span>Sin tarjeta</span>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>Ruka.ai | Control de Food Cost y Gastos para Restaurantes</title>
        <meta name="description" content="Software de gestión de costos para restaurantes. Automatiza el procesamiento de facturas, monitorea precios de insumos y optimiza tu food cost en tiempo real. ¡Prueba gratis!" />
        <link rel="canonical" href="https://ruka.ai/restaurantes" />
      </Helmet>
      
      <main className="min-h-screen pt-16">
        <Navbar />
        
        <div className="relative overflow-hidden">
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

            <div className="lg:hidden w-full sm:px-4">
              {renderForm()}
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <article className="py-12 lg:py-24 space-y-16 lg:space-y-32 overflow-hidden">
                <motion.header
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                    ¿Te quita tiempo
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> digitar facturas?</span>
                  </h1>
                  <p className="text-2xl text-muted-foreground leading-relaxed">
                    Sabemos que tu equipo pasa horas registrando facturas de proveedores en Excel, POS o ERP.
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
                    Sin contratar más personal administrativo
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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="space-y-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-12 rounded-3xl"
                >
                  <h2 className="text-4xl font-bold text-center">
                    El impacto en tu restaurante
                  </h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      {
                        icon: Zap,
                        stat: "90%",
                        text: "Menos tiempo en papeleo",
                        color: "text-yellow-500"
                      },
                      {
                        icon: ChartBarIcon,
                        stat: "100%",
                        text: "Control de food cost",
                        color: "text-blue-500"
                      },
                      {
                        icon: TrendingUp,
                        stat: "15%",
                        text: "Ahorro en insumos",
                        color: "text-green-500"
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="bg-white p-8 rounded-xl shadow-lg text-center space-y-4 hover:shadow-xl transition-shadow"
                      >
                        <item.icon className={`w-12 h-12 ${item.color} mx-auto`} />
                        <div className={`text-4xl font-bold ${item.color}`}>{item.stat}</div>
                        <p className="text-gray-600">{item.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-center space-y-8 bg-gradient-to-br from-primary/10 to-purple-100 p-12 rounded-3xl"
                >
                  <h2 className="text-4xl font-bold">
                    Optimiza tu food cost ahora
                  </h2>
                  <p className="text-2xl text-gray-700">
                    Únete a los +100 restaurantes que ya están ahorrando tiempo y dinero con Ruka
                  </p>
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 h-auto transition-all duration-300 hover:scale-105"
                    onClick={() => setHighlightForm(true)}
                  >
                    Comienza Tu Prueba Gratuita <ArrowRight className="ml-2" />
                  </Button>
                </motion.div>
              </article>

              <aside className="hidden lg:block h-[calc(100vh-6rem)]">
                <div className="sticky top-24 w-full">
                  {renderForm()}
                </div>
              </aside>
            </div>
          </div>
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
