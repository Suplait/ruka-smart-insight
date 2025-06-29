
import { motion } from "framer-motion";
import { FileText, Layers, TrendingUp, AlertTriangle, CreditCard, Repeat } from "lucide-react";
import { useState } from "react";

const coreFeatures = [
  {
    icon: FileText,
    title: "Digita Facturas Automáticamente",
    description: "Procesa y extrae datos de facturas sin intervención manual",
    video: "/robot_facturas.mp4",
    id: "facturas"
  },
  {
    icon: Layers,
    title: "Categoriza y Clasifica",
    description: "Agrupa productos y crea maestros de insumos inteligentemente",
    video: "/robot_cajas.mp4",
    id: "cajas"
  },
  {
    icon: TrendingUp,
    title: "Monitorea en Tiempo Real",
    description: "Analiza gráficos y detecta tendencias de precios",
    video: "/robot_grafico2.mp4",
    id: "grafico"
  },
  {
    icon: AlertTriangle,
    title: "Alerta Instantánea",
    description: "Notifica anomalías y cambios críticos al momento",
    video: "/robot_alerta.mp4",
    id: "alerta"
  }
];

const addOns = [
  {
    icon: CreditCard,
    title: "Gestión de Cuentas por Cobrar",
    description: "Facilita pagos y genera nóminas bancarias",
    video: "/robot_dinero.mp4",
    id: "dinero"
  },
  {
    icon: Repeat,
    title: "Sincronización de Inventarios",
    description: "Actualiza precios en plataformas externas",
    video: "/robot_inventario.mp4",
    id: "inventario"
  }
];

export default function AgentShowcase() {
  const [videoStates, setVideoStates] = useState<{[key: string]: {loaded: boolean, error: boolean}}>({});

  const handleVideoLoad = (videoId: string) => {
    console.log(`AgentShowcase video ${videoId} loaded successfully`);
    setVideoStates(prev => ({
      ...prev,
      [videoId]: { loaded: true, error: false }
    }));
  };

  const handleVideoError = (videoId: string, e: any) => {
    console.error(`AgentShowcase video ${videoId} error:`, e);
    setVideoStates(prev => ({
      ...prev,
      [videoId]: { loaded: false, error: true }
    }));
  };

  const renderVideoCard = (feature: any, index: number, isAddon: boolean = false) => {
    const videoState = videoStates[feature.id] || { loaded: false, error: false };
    
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="group relative"
      >
        <div className={`bg-white rounded-2xl shadow-xl ${isAddon ? 'p-8' : 'p-6'} h-full hover:shadow-2xl transition-all duration-300 group-hover:scale-105 border border-gray-100`}>
          <div className={`${isAddon ? 'aspect-[4/3] mb-6' : 'aspect-[4/3] mb-4'} rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative`}>
            {videoState.error ? (
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
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  preload="metadata"
                  onLoadedData={() => handleVideoLoad(feature.id)}
                  onError={(e) => handleVideoError(feature.id, e)}
                  className="w-full h-full object-cover"
                >
                  <source src={feature.video} type="video/mp4" />
                </video>
                {!videoState.loaded && (
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
          <div className={`flex items-center gap-3 ${isAddon ? 'mb-4' : 'mb-3'}`}>
            <div className={`${isAddon ? 'w-12 h-12' : 'w-10 h-10'} rounded-xl ${isAddon ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'} flex items-center justify-center shadow-sm`}>
              <feature.icon className={`${isAddon ? 'w-6 h-6' : 'w-5 h-5'}`} />
            </div>
            <h4 className={`font-semibold ${isAddon ? 'text-xl' : 'text-lg'}`}>{feature.title}</h4>
          </div>
          <p className={`text-muted-foreground ${isAddon ? '' : 'text-sm'}`}>{feature.description}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white" />
      
      <div className="container relative">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">
            Así Funcionan Nuestros
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Agentes Inteligentes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cada agente trabaja 24/7 automatizando procesos específicos de tu negocio
          </p>
        </div>

        {/* Core Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-12">Funciones Principales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreFeatures.map((feature, index) => renderVideoCard(feature, index))}
          </div>
        </div>

        {/* Add-ons */}
        <div>
          <h3 className="text-2xl font-semibold text-center mb-12">Funciones Adicionales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {addOns.map((addon, index) => renderVideoCard(addon, index, true))}
          </div>
        </div>
      </div>
    </section>
  );
}
