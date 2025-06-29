
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
        <div className={`bg-white rounded-2xl shadow-lg ${isAddon ? 'p-8' : 'p-6'} h-full hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
          <div className={`${isAddon ? 'aspect-video mb-6' : 'aspect-video mb-4'} rounded-lg overflow-hidden bg-gray-50 relative`}>
            {videoState.error ? (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500 text-sm">Error cargando video</p>
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
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Cargando...</p>
                  </div>
                )}
              </>
            )}
          </div>
          <div className={`flex items-center gap-3 ${isAddon ? 'mb-4' : 'mb-3'}`}>
            <div className={`${isAddon ? 'w-12 h-12' : 'w-10 h-10'} rounded-lg ${isAddon ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'} flex items-center justify-center`}>
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
