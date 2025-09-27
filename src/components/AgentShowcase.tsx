import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { FileText, Layers, TrendingUp, AlertTriangle, CreditCard, Repeat } from "lucide-react";
import { useRef, useState, useEffect } from "react";
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

  // Combine all features
  const allFeatures = [...coreFeatures, ...addOns];
  
  // State for active feature and video loading
  const [activeFeature, setActiveFeature] = useState(0);
  const [videoStates, setVideoStates] = useState<{
    [key: string]: { loaded: boolean; error: boolean; };
  }>({});

  // Refs for each feature section
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Handle video events
  const handleVideoLoad = (videoId: string) => {
    setVideoStates(prev => ({ ...prev, [videoId]: { loaded: true, error: false } }));
  };

  const handleVideoError = (videoId: string) => {
    setVideoStates(prev => ({ ...prev, [videoId]: { loaded: false, error: true } }));
  };

  // Scroll-based feature detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = featureRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setActiveFeature(index);
            }
          }
        });
      },
      { threshold: 0.6, rootMargin: "-20% 0px -20% 0px" }
    );

    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Parallax effects
  const orbOneY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const orbTwoY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const orbThreeY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  const currentFeature = allFeatures[activeFeature];
  const currentVideoState = videoStates[currentFeature?.id] || { loaded: false, error: false };

  return (
    <motion.section 
      ref={containerRef} 
      className="py-24 lg:py-32 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30 relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-[8%] w-96 h-96 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent rounded-full blur-3xl"
          style={{ y: orbOneY }}
        />
        <motion.div
          className="absolute bottom-1/4 right-[8%] w-80 h-80 bg-gradient-to-br from-blue-500/6 via-indigo-500/4 to-transparent rounded-full blur-3xl"
          style={{ y: orbTwoY }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-purple-500/5 via-pink-500/3 to-transparent rounded-full blur-3xl"
          style={{ y: orbThreeY }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 lg:mb-24 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-6xl font-extralight text-gray-900 tracking-tight leading-[1.1]">
            Así Funcionan Nuestros{" "}
            <span className="font-light bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              Agentes Inteligentes
            </span>
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
            Cada agente trabaja 24/7 automatizando procesos específicos de tu negocio
          </p>
        </motion.div>

        {/* Main Content - Hero Style Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
          {/* Left Content - Feature List */}
          <div className="space-y-8 lg:space-y-12">
            {allFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === activeFeature;
              
              return (
                <motion.div
                  key={feature.id}
                  ref={(el) => (featureRefs.current[index] = el)}
                  className={`transition-all duration-700 ${
                    isActive ? "opacity-100" : "opacity-60"
                  }`}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: isActive ? 1 : 0.6, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ opacity: 1 }}
                >
                  <div className={`p-6 lg:p-8 rounded-3xl transition-all duration-500 ${
                    isActive 
                      ? "bg-white/80 backdrop-blur-xl border border-primary/20 shadow-lg shadow-primary/5" 
                      : "bg-white/40 backdrop-blur-sm border border-gray-200/30 hover:bg-white/60"
                  }`}>
                    <div className="flex items-start gap-6">
                      <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isActive
                          ? "bg-primary text-white shadow-lg shadow-primary/25"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        <Icon className="w-7 h-7 lg:w-8 lg:h-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-xl lg:text-2xl font-light mb-3 transition-colors duration-500 ${
                          isActive ? "text-gray-900" : "text-gray-700"
                        }`}>
                          {feature.title}
                        </h3>
                        <p className={`text-base lg:text-lg leading-relaxed transition-colors duration-500 ${
                          isActive ? "text-gray-600" : "text-gray-500"
                        }`}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Content - Dynamic Video */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="sticky top-24">
              {/* Main Video Container */}
              <motion.div
                className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl lg:rounded-[2rem] overflow-hidden shadow-2xl shadow-gray-900/10"
                layoutId="agent-video"
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {currentVideoState.error ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg font-medium">Error al cargar video</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      key={currentFeature.id}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      onLoadedData={() => handleVideoLoad(currentFeature.id)}
                      onError={() => handleVideoError(currentFeature.id)}
                      className="w-full h-full object-cover"
                    >
                      <source src={currentFeature.video} type="video/mp4" />
                    </video>
                    
                    {!currentVideoState.loaded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-4 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                          <p className="text-gray-600 text-lg font-medium">Cargando video...</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                {/* Floating feature indicator */}
                <motion.div
                  className="absolute bottom-6 left-6 right-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <currentFeature.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {currentFeature.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Progress indicators */}
              <div className="flex justify-center mt-8 gap-2">
                {allFeatures.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === activeFeature 
                        ? "w-8 bg-primary" 
                        : "w-2 bg-gray-300"
                    }`}
                    layoutId={`indicator-${index}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
