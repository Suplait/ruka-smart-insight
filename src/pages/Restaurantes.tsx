import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { ArrowRight, UtensilsCrossed, Clock } from "lucide-react";
import DataFlowSection from "@/components/DataFlowSection";

export default function Restaurantes() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    nombreRestaurante: "",
    ciudad: ""
  });

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
                  <div className="relative aspect-square">
                    <img 
                      src="/robotshero2.png" 
                      alt="Robot procesando datos" 
                      className="w-full h-full object-cover rounded-xl shadow-2xl"
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

              {/* Beneficios Inmediatos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-12"
              >
                <h2 className="text-4xl font-bold text-center">
                  Beneficios desde el primer día
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Ahorra Tiempo",
                      description: "Elimina la digitación manual y libera a tu equipo",
                      color: "purple"
                    },
                    {
                      title: "Control Total",
                      description: "Monitorea tus costos en tiempo real",
                      color: "blue"
                    },
                    {
                      title: "Más Rentabilidad",
                      description: "Optimiza tus márgenes con datos precisos",
                      color: "green"
                    }
                  ].map((benefit) => (
                    <div 
                      key={benefit.title}
                      className={`p-6 rounded-xl bg-${benefit.color}-50 border border-${benefit.color}-100 space-y-4`}
                    >
                      <h3 className={`text-2xl font-semibold text-${benefit.color}-900`}>
                        {benefit.title}
                      </h3>
                      <p className={`text-${benefit.color}-700`}>
                        {benefit.description}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Testimonios Destacados */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-12"
              >
                <h2 className="text-4xl font-bold text-center">
                  Lo que dicen nuestros clientes
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    {
                      quote: "Ruka nos ayudó a detectar aumentos de precios que no habíamos notado. Recuperamos el margen que estábamos perdiendo.",
                      author: "Juan Pérez",
                      role: "Dueño de Restaurant"
                    },
                    {
                      quote: "La automatización nos ahorró más de 20 horas semanales en digitación. Ahora nos enfocamos en atender mejor a nuestros clientes.",
                      author: "María González",
                      role: "Administradora"
                    }
                  ].map((testimonial, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
                      <p className="text-lg italic text-gray-700">{testimonial.quote}</p>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
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
                  Únete a los restaurantes que ya están optimizando sus costos
                </h2>
                <p className="text-2xl text-gray-700">
                  Más de 100 restaurantes ya confían en Ruka para automatizar su control de costos
                </p>
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 h-auto"
                  onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Comienza Tu Prueba Gratuita
                </Button>
              </motion.div>
            </div>

            {/* Form Sticky */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl shadow-xl border p-8 space-y-8"
                >
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Comienza tu Prueba Gratuita</h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Setup en menos de 10 minutos</span>
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

                  <div className="flex items-center gap-3">
                    <UtensilsCrossed className="w-8 h-8 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Únete a los restaurantes que ya automatizaron su control de costos
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Form para móvil */}
            <div className="lg:hidden">
              {/* ... mismo contenido del form pero sin sticky ... */}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
