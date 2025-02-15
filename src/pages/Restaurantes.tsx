import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { ArrowRight, UtensilsCrossed, Clock, ChartBarIcon, Zap, TrendingUp, ShieldCheck, Clock4 } from "lucide-react";
import DataFlowSection from "@/components/DataFlowSection";

export default function Restaurantes() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    nombreRestaurante: "",
    ciudad: ""
  });

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
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

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
      description: "Te contactaremos pronto para comenzar tu proceso de onboarding.",
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

  return (
    <main className="min-h-screen pt-16">
      <Navbar />
      
      <div className="relative">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contenido que scrollea */}
            <div className="py-24 space-y-32">
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                  ¿Cansado de digitar
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> factura por factura?</span>
                </h1>
                <p className="text-2xl text-muted-foreground leading-relaxed">
                  Sabemos que tus empleados pasan horas registrando cada documento en Excel o en tu sistema.
                </p>
              </motion.div>

              {/* Problema con gráfica */}
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
                    Ya es muy tarde. El análisis llega con un mes de retraso, y recién ahí te enteras que un insumo subió de precio y has estado perdiendo margen todo este tiempo.
                  </p>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="space-y-4">
                      <div className="h-2 bg-red-200 rounded-full w-full" />
                      <div className="h-2 bg-red-200 rounded-full w-3/4" />
                      <div className="h-2 bg-red-200 rounded-full w-1/2" />
                    </div>
                    <div className="mt-6 text-center text-red-600 font-semibold">
                      -15% Margen Operacional
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Solución con robot */}
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
                      Registra tus documentos automáticamente
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</span>
                      Agrupa tus insumos maestros
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</span>
                      Monitorea precios en tiempo real
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</span>
                      Te alerta ante cualquier subida
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</span>
                      Se integra con tu POS o ERP
                    </p>
                  </div>
                  <div className="relative">
                    <img 
                      src="/robotshero2.png" 
                      alt="Robot procesando datos" 
                      className="w-full object-contain transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Sin contratar más personal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 space-y-8"
              >
                <div className="absolute -top-6 right-8 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <UtensilsCrossed className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-4xl font-bold text-green-900">
                  Sin contratar más personal
                </h2>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <p className="text-2xl text-green-800/80 leading-relaxed">
                    Olvídate de gastar en más personal para tener mejores datos. Ruka hace el trabajo por ti, 24/7, sin errores y en tiempo real.
                  </p>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="space-y-4">
                      <div className="h-2 bg-green-200 rounded-full w-full" />
                      <div className="h-2 bg-green-200 rounded-full w-4/5" />
                      <div className="h-2 bg-green-200 rounded-full w-full" />
                    </div>
                    <div className="mt-6 text-center text-green-600 font-semibold">
                      +25% Eficiencia Operacional
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Data Flow Section */}
              <DataFlowSection />

              {/* Métricas de Impacto */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-12 rounded-3xl"
              >
                <h2 className="text-4xl font-bold text-center">
                  El impacto en tu negocio
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: Zap,
                      stat: "90%",
                      text: "Reducción en tiempo de digitación",
                      color: "text-yellow-500"
                    },
                    {
                      icon: ChartBarIcon,
                      stat: "100%",
                      text: "Visibilidad de tus costos",
                      color: "text-blue-500"
                    },
                    {
                      icon: TrendingUp,
                      stat: "15%",
                      text: "Promedio de ahorro en costos",
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

              {/* CTA Final */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center space-y-8 bg-gradient-to-br from-primary/10 to-purple-100 p-12 rounded-3xl"
              >
                <h2 className="text-4xl font-bold">
                  Optimiza tus costos ahora
                </h2>
                <p className="text-2xl text-gray-700">
                  Únete a los restaurantes que ya están ahorrando tiempo y dinero con Ruka
                </p>
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 h-auto transition-all duration-300 hover:scale-105"
                  onClick={() => setHighlightForm(true)}
                >
                  Comienza Tu Prueba Gratuita <ArrowRight className="ml-2" />
                </Button>
              </motion.div>
            </div>

            {/* Form Sticky */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`bg-white rounded-xl shadow-xl border p-8 space-y-8 transition-all duration-300 ${
                    highlightForm ? 'ring-4 ring-primary shadow-2xl scale-105' : ''
                  }`}
                >
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Comienza tu Prueba Gratuita</h2>
                    <div className="flex flex-col gap-2">
                      <div className="text-sm font-medium text-primary">
                        Si te registras antes de las 12:00pm tendrás a Ruka trabajando el mismo día
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Faltan {timeLeft} para el siguiente medio día</span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                      name="nombreRestaurante"
                      placeholder="Nombre del Restaurante"
                      value={formData.nombreRestaurante}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="nombre"
                      placeholder="Tu Nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="ciudad"
                      placeholder="Ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      required
                    />
                    <Button type="submit" className="w-full gap-2 h-12 text-lg">
                      Comenzar Ahora <ArrowRight className="w-5 h-5" />
                    </Button>
                  </form>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Datos seguros</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock4 className="w-4 h-4" />
                      <span>Soporte 24/7</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <UtensilsCrossed className="w-4 h-4" />
                      <span>Sin tarjeta</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
