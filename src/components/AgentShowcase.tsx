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

  // Individual section refs for precise scroll detection
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Handle video events
  const handleVideoLoad = (videoId: string) => {
    setVideoStates(prev => ({ ...prev, [videoId]: { loaded: true, error: false } }));
  };

  const handleVideoError = (videoId: string) => {
    setVideoStates(prev => ({ ...prev, [videoId]: { loaded: false, error: true } }));
  };

  // Improved scroll detection with more precise thresholds
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setActiveFeature(index);
            }
          }
        });
      },
      { 
        threshold: 0.7, // Higher threshold for more precise detection
        rootMargin: "-10% 0px -10% 0px" // Smaller margin for center detection
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Parallax effects
  const orbOneY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const orbTwoY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  const currentFeature = allFeatures[activeFeature];
  const currentVideoState = videoStates[currentFeature?.id] || { loaded: false, error: false };

  return (
    <motion.section 
      ref={containerRef} 
      className="py-16 lg:py-24 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30 relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-[5%] w-80 h-80 bg-gradient-to-br from-primary/6 via-primary/3 to-transparent rounded-full blur-3xl"
          style={{ y: orbOneY }}
        />
        <motion.div
          className="absolute bottom-1/4 right-[5%] w-72 h-72 bg-gradient-to-br from-blue-500/5 via-indigo-500/3 to-transparent rounded-full blur-3xl"
          style={{ y: orbTwoY }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 lg:mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-5xl font-extralight text-gray-900 tracking-tight leading-tight">
            Así Funcionan Nuestros{" "}
            <span className="font-light bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              Agentes Inteligentes
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Cada agente trabaja 24/7 automatizando procesos específicos
          </p>
        </motion.div>

        {/* Main Layout - Fixed Video + Scrolling Content */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          
          {/* Left: Scrolling Feature Sections */}
          <div className="lg:col-span-7 space-y-12 lg:space-y-16">
            {allFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === activeFeature;
              
              return (
                <motion.div
                  key={feature.id}
                  ref={(el) => (sectionRefs.current[index] = el)}
                  className="min-h-[60vh] lg:min-h-[50vh] flex items-center"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-20%" }}
                >
                  <div className={`w-full transition-all duration-700 ${
                    isActive ? "opacity-100 scale-100" : "opacity-60 scale-95"
                  }`}>
                    <div className={`p-6 lg:p-8 rounded-2xl lg:rounded-3xl transition-all duration-500 ${
                      isActive 
                        ? "bg-white/90 backdrop-blur-xl border border-primary/20 shadow-xl shadow-primary/5" 
                        : "bg-white/50 backdrop-blur-sm border border-gray-200/30"
                    }`}>
                      <div className="flex items-start gap-4 lg:gap-6">
                        <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          isActive
                            ? "bg-primary text-white shadow-lg shadow-primary/25"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          <Icon className="w-6 h-6 lg:w-7 lg:h-7" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-xl lg:text-2xl xl:text-3xl font-light mb-2 lg:mb-3 transition-colors duration-500 leading-tight ${
                            isActive ? "text-gray-900" : "text-gray-700"
                          }`}>
                            {feature.title}
                          </h3>
                          <p className={`text-sm lg:text-base xl:text-lg leading-relaxed transition-colors duration-500 ${
                            isActive ? "text-gray-600" : "text-gray-500"
                          }`}>
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Sticky Video Container */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-24">
              <motion.div
                className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl shadow-gray-900/10"
                key={activeFeature} // Force re-render on change
                initial={{ opacity: 0.8, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {currentVideoState.error ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">Error al cargar</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      key={`${currentFeature.id}-${activeFeature}`} // Force video reload
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
                          <div className="w-10 h-10 mx-auto mb-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                          <p className="text-gray-600 font-medium">Cargando...</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                {/* Feature indicator overlay */}
                <motion.div
                  className="absolute bottom-4 left-4 right-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="bg-white/95 backdrop-blur-xl rounded-xl p-3 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/15 text-primary rounded-lg flex items-center justify-center">
                        <currentFeature.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight truncate">
                          {currentFeature.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Progress indicators */}
              <div className="flex justify-center mt-6 gap-1.5">
                {allFeatures.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === activeFeature 
                        ? "w-6 bg-primary" 
                        : "w-1.5 bg-gray-300"
                    }`}
                    layoutId={`indicator-${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}