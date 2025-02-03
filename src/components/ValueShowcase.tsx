import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Brain, FileText, LineChart, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    id: 'automation',
    title: 'Agentes a tu servicio',
    description: 'Trabajan 24/7 y automatizan trabajos manuales que necesitaban HH para funcionar.',
    Icon: Bot,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'intelligence',
    title: 'IA que Aprende',
    description: 'Nuestros agentes se adaptan a tus procesos y mejoran con cada interacción, haciéndose más precisos.',
    Icon: Brain,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'documents',
    title: 'Procesamiento Inteligente',
    description: 'Extrae, clasifica y organiza la información de tus documentos automáticamente en tiempo real.',
    Icon: FileText,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 'monitoring',
    title: 'Monitoreo Continuo',
    description: 'Detecta anomalías y patrones que afecten tu margen operativo, alertándote inmediatamente.',
    Icon: AlertCircle,
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    id: 'insights',
    title: 'Insights Inmediatos',
    description: 'Visualiza tus KPIs y genera reportes personalizados en lenguaje natural. No más tablas dinámicas.',
    Icon: LineChart,
    color: 'bg-red-100 text-red-600'
  }
] as const;

export default function ValueShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);
  const ActiveIcon = features[activeFeature].Icon;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/30 to-white" />
      
      <div className="container relative">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">
            Automatización Inteligente que
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Entiende tu Negocio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Una plataforma que evoluciona contigo, aprendiendo y mejorando constantemente
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {features.map((feature, index) => {
              const FeatureIcon = feature.Icon;
              return (
                <motion.div
                  key={feature.id}
                  className={cn(
                    "p-6 rounded-xl transition-all duration-300 cursor-pointer",
                    activeFeature === index ? "bg-white shadow-lg scale-105" : "hover:bg-white/50"
                  )}
                  onClick={() => setActiveFeature(index)}
                  whileHover={{ x: activeFeature === index ? 0 : 5 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      feature.color
                    )}>
                      <FeatureIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="relative lg:h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center p-8"
              >
                <div className="max-w-md text-center space-y-6">
                  <div className={cn(
                    "w-20 h-20 rounded-2xl mx-auto flex items-center justify-center",
                    features[activeFeature].color
                  )}>
                    <ActiveIcon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold">{features[activeFeature].title}</h3>
                  <p className="text-lg text-muted-foreground">{features[activeFeature].description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}