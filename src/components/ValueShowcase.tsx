import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, Brain, FileText, LineChart, AlertCircle, Zap } from "lucide-react";

const values = [
  {
    id: 'automation',
    title: 'Automatización Total',
    description: 'Digitaliza y procesa automáticamente todos tus documentos, eliminando la digitación manual para siempre.',
    icon: Bot,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'intelligence',
    title: 'IA que Aprende',
    description: 'Nuestros agentes se adaptan a tus procesos y mejoran con cada interacción.',
    icon: Brain,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'documents',
    title: 'Procesamiento Inteligente',
    description: 'Extrae, clasifica y organiza la información de tus documentos automáticamente.',
    icon: FileText,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 'monitoring',
    title: 'Monitoreo 24/7',
    description: 'Detecta anomalías y patrones que afecten tu margen operativo en tiempo real.',
    icon: AlertCircle,
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    id: 'insights',
    title: 'Insights Inmediatos',
    description: 'Visualiza tus KPIs y genera reportes personalizados al instante.',
    icon: LineChart,
    color: 'bg-red-100 text-red-600'
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
    <section className="py-24 bg-white relative overflow-hidden">
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
              className="grid grid-cols-2 gap-6"
            >
              {values.map((value, index) => (
                <Card
                  key={value.id}
                  className={cn(
                    "p-6 transition-all duration-300",
                    activeValue === index ? "scale-110 shadow-lg" : "opacity-50"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                    value.color
                  )}>
                    <value.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold mb-2">{value.title}</h4>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}