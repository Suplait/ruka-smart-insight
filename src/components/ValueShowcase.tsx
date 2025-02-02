import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { FileText, Brain, Zap, Users, LineChart, Clock } from "lucide-react";

const values = [
  {
    id: 'automation',
    title: 'Automatización Total',
    description: 'Olvídate de la digitación manual. Nuestros agentes procesan automáticamente tus documentos 24/7, eliminando errores y ahorrando tiempo valioso.',
    icon: FileText,
    image: '/automation.svg'
  },
  {
    id: 'intelligence',
    title: 'Clasificación Inteligente',
    description: 'La IA agrupa y clasifica automáticamente tus documentos, manteniendo tu información ordenada y accesible en todo momento.',
    icon: Brain,
    image: '/intelligence.svg'
  },
  {
    id: 'integration',
    title: 'Integración Instantánea',
    description: 'Conectamos directamente con tus sistemas actuales. En minutos estarás operando con Ruka, sin cambiar tu forma de trabajar.',
    icon: Zap,
    image: '/integration.svg'
  },
  {
    id: 'providers',
    title: 'Conexión con Proveedores',
    description: 'Obtén datos actualizados automáticamente de tus proveedores, mejorando la precisión y velocidad de tu operación.',
    icon: Users,
    image: '/providers.svg'
  },
  {
    id: 'reports',
    title: 'Reportes en Tiempo Real',
    description: 'Genera reportes personalizados en segundos. Visualiza tendencias y toma decisiones informadas al instante.',
    icon: LineChart,
    image: '/reports.svg'
  }
];

export default function ValueShowcase() {
  const [activeValue, setActiveValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveValue((current) => (current + 1) % values.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="value-showcase" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/30 to-white" />
      
      <div className="container relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">
            Automatización Inteligente que
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Entiende tu Negocio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Soluciones diseñadas específicamente para los desafíos de tu empresa
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {values.map((value, index) => (
                <Button
                  key={value.id}
                  variant={activeValue === index ? "default" : "outline"}
                  onClick={() => setActiveValue(index)}
                  className="gap-2"
                >
                  <value.icon className="w-4 h-4" />
                  {value.title}
                </Button>
              ))}
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeValue}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-2xl font-semibold mb-4">{values[activeValue].title}</h3>
                <p className="text-lg text-muted-foreground">{values[activeValue].description}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeValue}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square rounded-xl overflow-hidden shadow-xl"
            >
              <img
                src={values[activeValue].image}
                alt={values[activeValue].title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}