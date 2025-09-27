import { motion, useScroll, useTransform } from "framer-motion";
import { FileText, Layers, TrendingUp, AlertTriangle, CreditCard, Repeat } from "lucide-react";
import { useRef, useState } from "react";
const coreFeatures = [{
  icon: FileText,
  title: "Digita Facturas Automáticamente",
  description: "Procesa y extrae datos de facturas sin intervención manual",
  video: "/robot_facturas.mp4",
  id: "facturas"
}, {
  icon: Layers,
  title: "Categoriza y Clasifica",
  description: "Agrupa productos y crea maestros de insumos inteligentemente",
  video: "/robot_cajas.mp4",
  id: "cajas"
}, {
  icon: TrendingUp,
  title: "Monitorea en Tiempo Real",
  description: "Aprende de tus patrones de compras y monitorea 24/7",
  video: "/robot_grafico2.mp4",
  id: "grafico"
}, {
  icon: AlertTriangle,
  title: "Alerta Instantánea",
  description: "Notifica anomalías y cambios críticos, al momento",
  video: "/robot_alerta.mp4",
  id: "alerta"
}];
const addOns = [{
  icon: CreditCard,
  title: "Gestión de Cuentas por Pagar",
  description: "Facilita pagos de proveedores y genera nóminas bancarias",
  video: "/robot_dinero.mp4",
  id: "dinero"
}, {
  icon: Repeat,
  title: "Sincronización con otras platformas",
  description: "Actualiza stock y precios en plataformas externas",
  video: "/robot_inventario.mp4",
  id: "inventario"
}];
export default function AgentShowcase() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const orbOneY = useTransform(scrollYProgress, [0, 1], [40, -30]);
  const orbTwoY = useTransform(scrollYProgress, [0, 1], [-15, 25]);
  const orbThreeY = useTransform(scrollYProgress, [0, 1], [20, -35]);
  const [videoStates, setVideoStates] = useState<{
    [key: string]: {
      loaded: boolean;
      error: boolean;
    };
  }>({});
  const handleVideoLoad = (videoId: string) => {
    console.log(`AgentShowcase video ${videoId} loaded successfully`);
    setVideoStates(prev => ({
      ...prev,
      [videoId]: {
        loaded: true,
        error: false
      }
    }));
  };
  const handleVideoError = (videoId: string, e: any) => {
    console.error(`AgentShowcase video ${videoId} error:`, e);
    setVideoStates(prev => ({
      ...prev,
      [videoId]: {
        loaded: false,
        error: true
      }
    }));
  };
  const renderVideoCard = (feature: any, index: number, isAddon: boolean = false) => {
    const videoState = videoStates[feature.id] || {
      loaded: false,
      error: false
    };
    return <motion.div key={index} initial={{
      opacity: 0,
      y: 20
    }} whileInView={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5,
      delay: index * 0.1
    }} viewport={{
      once: true
    }} className="group relative">
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 hover:bg-white/80 transition-all duration-500 group-hover:scale-[1.02] overflow-hidden shadow-sm hover:shadow-lg">
          {/* Video Container */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-50/50 to-gray-100/50 overflow-hidden">
            {videoState.error ? <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">Error al cargar</p>
                </div>
              </div> : <>
                <video autoPlay loop muted playsInline preload="metadata" onLoadedData={() => handleVideoLoad(feature.id)} onError={e => handleVideoError(feature.id, e)} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700">
                  <source src={feature.video} type="video/mp4" />
                </video>
                {!videoState.loaded && <div className="absolute inset-0 bg-gradient-to-br from-gray-100/95 to-gray-200/95 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto mb-3 bg-white/70 rounded-full animate-spin border-2 border-transparent border-t-blue-500"></div>
                      <p className="text-gray-600 text-sm font-medium">Cargando...</p>
                    </div>
                  </div>}
              </>}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
               <div className={`w-12 h-12 rounded-2xl ${isAddon ? 'bg-primary/10 text-primary' : 'bg-primary/10 text-primary'} flex items-center justify-center`}>
                 <feature.icon className="w-6 h-6" />
               </div>
               <div className="flex-1">
                 <h4 className="font-medium text-lg text-gray-900 mb-1 tracking-tight">{feature.title}</h4>
               </div>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm font-light">{feature.description}</p>
          </div>
        </div>
      </motion.div>;
  };
  return <motion.section ref={containerRef} className="py-32 bg-gradient-to-b from-[#f4f5f9] via-white to-[#eef1f6] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-12 left-[10%] h-40 w-40 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.12),transparent_70%)] blur-2xl" />
        <div className="absolute bottom-0 right-[12%] h-48 w-48 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_75%)] blur-[120px]" />
        <motion.div
          className="absolute top-1/3 right-[18%] w-28 h-28 bg-gradient-to-br from-blue-400/15 via-sky-400/10 to-indigo-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, -25, 15, 0],
            y: [0, -30, -5, 0],
            scale: [1, 1.08, 1.02, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ y: orbOneY }}
        />
        <motion.div
          className="absolute bottom-12 left-[14%] w-32 h-32 bg-gradient-to-br from-teal-400/15 via-emerald-400/10 to-cyan-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, 20, -15, 0],
            y: [0, 22, -18, 0],
            scale: [1, 1.1, 0.94, 1]
          }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.3 }}
          style={{ y: orbTwoY }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-pink-400/15 via-rose-400/15 to-orange-400/15 rounded-full blur-2xl"
          animate={{
            x: [0, 18, -12, 0],
            y: [0, -18, 15, 0],
            scale: [1, 1.09, 0.96, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          style={{ y: orbThreeY }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-4xl lg:text-6xl font-thin text-gray-900 tracking-tight">
            Así Funcionan Nuestros{" "}
            <span className="font-light bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              Agentes Inteligentes
            </span>
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Cada agente trabaja 24/7 automatizando procesos específicos de tu negocio
          </p>
        </div>

        {/* All Features in 2x3 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...coreFeatures, ...addOns].map((feature, index) => renderVideoCard(feature, index, index >= 4))}
        </div>
      </div>
    </motion.section>;
}
