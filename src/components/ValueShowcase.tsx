
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
    color: 'bg-purple-100 text-purple-600',
    video: '/robot_facturas.mp4'
  },
  {
    id: 'intelligence',
    title: 'IA que Aprende',
    description: 'Nuestros agentes se adaptan a tus procesos y mejoran con cada interacción, haciéndose más precisos.',
    Icon: Brain,
    color: 'bg-blue-100 text-blue-600',
    video: '/robot_cajas.mp4'
  },
  {
    id: 'documents',
    title: 'Procesamiento Inteligente',
    description: 'Extrae, clasifica y organiza la información de tus documentos automáticamente en tiempo real.',
    Icon: FileText,
    color: 'bg-green-100 text-green-600',
    video: '/robot_facturas.mp4'
  },
  {
    id: 'monitoring',
    title: 'Monitoreo Continuo',
    description: 'Detecta anomalías y patrones que afecten tu margen operativo, alertándote inmediatamente.',
    Icon: AlertCircle,
    color: 'bg-yellow-100 text-yellow-600',
    video: '/robot_alerta.mp4'
  },
  {
    id: 'insights',
    title: 'Insights Inmediatos',
    description: 'Visualiza tus KPIs y genera reportes personalizados en lenguaje natural. No más tablas dinámicas.',
    Icon: LineChart,
    color: 'bg-red-100 text-red-600',
    video: '/robot_grafico2.mp4'
  }
] as const;

export default function ValueShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [videoStates, setVideoStates] = useState<{[key: string]: {loaded: boolean, error: boolean}}>({});
  
  const ActiveIcon = features[activeFeature].Icon;

  const handleVideoLoad = (videoId: string) => {
    console.log(`ValueShowcase video ${videoId} loaded successfully`);
    setVideoStates(prev => ({
      ...prev,
      [videoId]: { loaded: true, error: false }
    }));
  };

  const handleVideoError = (videoId: string, e: any) => {
    console.error(`ValueShowcase video ${videoId} error:`, e);
    setVideoStates(prev => ({
      ...prev,
      [videoId]: { loaded: false, error: true }
    }));
  };

  const currentVideoState = videoStates[features[activeFeature].id] || { loaded: false, error: false };

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
                    "p-6 rounded-xl transition-all duration-300 cursor-pointer border",
                    activeFeature === index ? "bg-white shadow-xl scale-105 border-purple-200" : "hover:bg-white/50 border-transparent hover:border-gray-200"
                  )}
                  onClick={() => setActiveFeature(index)}
                  whileHover={{ x: activeFeature === index ? 0 : 5 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
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

          <div className="relative lg:h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 shadow-2xl border border-gray-200">
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
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white shadow-xl relative border border-gray-100">
                    {currentVideoState.error ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 bg-gray-300 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-gray-500 text-sm">Error al cargar</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <video 
                          key={features[activeFeature].video}
                          autoPlay 
                          loop 
                          muted 
                          playsInline
                          preload="metadata"
                          onLoadedData={() => handleVideoLoad(features[activeFeature].id)}
                          onError={(e) => handleVideoError(features[activeFeature].id, e)}
                          className="w-full h-full object-cover"
                        >
                          <source src={features[activeFeature].video} type="video/mp4" />
                        </video>
                        {!currentVideoState.loaded && (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-8 h-8 mx-auto mb-2 bg-gray-300 rounded-full animate-spin border-2 border-transparent border-t-gray-400"></div>
                              <p className="text-gray-500 text-xs">Cargando...</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className={cn(
                    "w-20 h-20 rounded-2xl mx-auto flex items-center justify-center shadow-lg",
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
