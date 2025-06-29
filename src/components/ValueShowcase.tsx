
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
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    stats: 'Ahorra 15+ horas semanales'
  },
  {
    id: 'intelligence',
    title: 'IA que Aprende',
    description: 'Nuestros agentes se adaptan a tus procesos y mejoran con cada interacción, haciéndose más precisos.',
    Icon: Brain,
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    stats: '99.5% precisión después de 30 días'
  },
  {
    id: 'documents',
    title: 'Procesamiento Inteligente',
    description: 'Extrae, clasifica y organiza la información de tus documentos automáticamente en tiempo real.',
    Icon: FileText,
    color: 'bg-gradient-to-br from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    stats: '1000+ documentos por día'
  },
  {
    id: 'monitoring',
    title: 'Monitoreo Continuo',
    description: 'Detecta anomalías y patrones que afecten tu margen operativo, alertándote inmediatamente.',
    Icon: AlertCircle,
    color: 'bg-gradient-to-br from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50',
    stats: 'Alertas en < 5 minutos'
  },
  {
    id: 'insights',
    title: 'Insights Inmediatos',
    description: 'Visualiza tus KPIs y genera reportes personalizados en lenguaje natural. No más tablas dinámicas.',
    Icon: LineChart,
    color: 'bg-gradient-to-br from-red-500 to-pink-500',
    bgColor: 'bg-red-50',
    stats: 'Reportes en segundos'
  }
] as const;

export default function ValueShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const ActiveIcon = features[activeFeature].Icon;

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-purple-50/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.05)_0%,transparent_50%)]" />
      
      <div className="container relative">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Automatización Inteligente que
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Entiende tu Negocio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Una plataforma que evoluciona contigo, aprendiendo y mejorando constantemente
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            {features.map((feature, index) => {
              const FeatureIcon = feature.Icon;
              return (
                <motion.div
                  key={feature.id}
                  className={cn(
                    "p-6 rounded-2xl transition-all duration-500 cursor-pointer border-2",
                    activeFeature === index 
                      ? "bg-white shadow-2xl scale-105 border-purple-200 shadow-purple-500/10" 
                      : "hover:bg-white/80 border-transparent hover:border-gray-200 hover:shadow-lg"
                  )}
                  onClick={() => setActiveFeature(index)}
                  whileHover={{ x: activeFeature === index ? 0 : 8 }}
                >
                  <div className="flex items-start gap-5">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg text-white",
                      feature.color
                    )}>
                      <FeatureIcon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 mb-3 leading-relaxed">{feature.description}</p>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                        {feature.stats}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="relative lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center p-12"
              >
                <div className="text-center space-y-8 max-w-md">
                  {/* Large illustration area */}
                  <div className={cn(
                    "w-48 h-48 mx-auto rounded-3xl flex items-center justify-center shadow-xl",
                    features[activeFeature].bgColor
                  )}>
                    <div className={cn(
                      "w-24 h-24 rounded-2xl flex items-center justify-center text-white shadow-lg",
                      features[activeFeature].color
                    )}>
                      <ActiveIcon className="w-12 h-12" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-gray-900">{features[activeFeature].title}</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">{features[activeFeature].description}</p>
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-lg font-semibold text-gray-800">
                      {features[activeFeature].stats}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
