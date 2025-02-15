
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { ArrowRight, Bot, UtensilsCrossed, Clock, LineChart, Scale, Receipt, AlertCircle } from "lucide-react";
import ValueProposition from "@/components/ValueProposition";
import ValueHighlights from "@/components/ValueHighlights";
import CTA from "@/components/CTA";

export default function Restaurantes() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    nombreRestaurante: "",
    mensaje: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de envío del formulario
    toast({
      title: "¡Gracias por tu interés!",
      description: "Te contactaremos pronto para comenzar tu proceso de onboarding.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <main className="min-h-screen pt-16">
      <Navbar />
      
      <div className="relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-purple-50/30 to-white">
          <div className="container py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                  Control Total de tus 
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Costos y Márgenes</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Automatiza el seguimiento de tus costos y obtén alertas en tiempo real sobre cambios en tus márgenes. Sin digitación manual, sin demoras, sin sorpresas.
                </p>
                <div className="flex items-center gap-4">
                  <UtensilsCrossed className="w-12 h-12 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Diseñado específicamente para restaurantes y servicios de alimentación
                  </p>
                </div>
              </motion.div>

              {/* Sticky Form */}
              <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl shadow-xl border p-6 space-y-6"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">Comienza tu Prueba Gratuita</h2>
                    <p className="text-muted-foreground">
                      Únete a los restaurantes que ya automatizaron su control de costos
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        name="nombreRestaurante"
                        placeholder="Nombre del Restaurante"
                        value={formData.nombreRestaurante}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        name="nombre"
                        placeholder="Tu Nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email Corporativo"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        name="telefono"
                        type="tel"
                        placeholder="Teléfono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Textarea
                        name="mensaje"
                        placeholder="¿Qué te gustaría lograr con Ruka.ai?"
                        value={formData.mensaje}
                        onChange={handleChange}
                      />
                    </div>
                    <Button type="submit" className="w-full gap-2">
                      Comenzar Ahora <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Setup en menos de 10 minutos</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Statement Section */}
        <section className="py-24 bg-white">
          <div className="container">
            <div className="max-w-2xl space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold">El Desafío de Cada Día</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Como dueño o administrador de restaurante, sabes que el control de costos es crucial. Pero la realidad es que tus empleados pasan horas digitando facturas en Excel o en tu sistema, y aun así:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">Los análisis llegan tarde, cuando ya perdiste margen por un mes entero debido a aumentos de precios que no detectaste a tiempo.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">El tiempo invertido en digitar y analizar datos manualmente podría usarse en mejorar la experiencia de tus clientes.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">Contratar más personal para el análisis de datos significa más gastos, justo cuando necesitas optimizar costos.</p>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        <ValueProposition />
        <ValueHighlights />
        <CTA />
      </div>

      <Footer />
    </main>
  );
}
