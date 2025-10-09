import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useVideoPreload } from "@/hooks/use-video-preload";
const valueMessages = [
  "Automatiza completamente el registro de compras",        // 46
  "Controla tu margen al día, no una vez al mes",                 // 37
  "Descubre alzas de precio en tus insumos en vivo",      // 48
  "Genera reportes en segundos usando lenguaje natural",  // 52
  "Gestiona simple el pago a tus proveedores",            // 42
  "Ten toda tu información a la mano, en un lugar",       // 47
  "Libera horas para enfocarte en lo importante"    // 51
];

export default function Hero() {
  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const longestMessage = useMemo(
    () => valueMessages.reduce((longest, current) => (
      current.length > longest.length ? current : longest
    ), ""),
    []
  ); // Keeps heading height steady so lower sections don't jump during typing
  const heroVideoSources = useMemo(() => ([
    { src: "/robot_facturas.mp4", type: "video/mp4" }
  ]), []);

  useVideoPreload(heroVideoSources);
  
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const videoY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const videoScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.98]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const heroOrbOneY = useTransform(scrollYProgress, [0, 1], [10, -30]);
  const heroOrbTwoY = useTransform(scrollYProgress, [0, 1], [-10, 25]);
  const heroOrbThreeY = useTransform(scrollYProgress, [0, 1], [15, -20]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const current = valueMessages[currentMessage];
    if (isDeleting) {
      // Borra todo de una vez para más dinamismo
      setDisplayText("");
      setIsDeleting(false);
      setCurrentMessage(prev => (prev + 1) % valueMessages.length);
    } else {
      if (displayText === current) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      } else {
        timeout = setTimeout(() => {
          setDisplayText(current.substring(0, displayText.length + 1));
        }, 30);
      }
    }
    return () => clearTimeout(timeout);
  }, [currentMessage, displayText, isDeleting]);

  const handleVideoLoad = () => {
    console.log('Hero video loaded successfully');
    setVideoLoaded(true);
    setVideoError(false);
  };

  const handleVideoError = (e: any) => {
    console.error('Hero video error:', e);
    setVideoError(true);
    setVideoLoaded(false);
  };

  const scrollToGuarantee = () => {
    const element = document.getElementById('guarantee');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.section 
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 flex items-center overflow-hidden pt-24 sm:pt-20"
    >
      {/* Apple-style subtle background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 50]) }}
      />
      {/* Blurred floating geometric shapes (mirroring Features section) */}
      <motion.div 
        className="absolute top-24 left-10 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl pointer-events-none z-0"
        animate={{ 
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ y: heroOrbOneY }}
      />
      <motion.div 
        className="absolute top-1/3 right-12 w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-cyan-400/25 via-sky-400/20 to-teal-400/25 rounded-full blur-2xl pointer-events-none z-0"
        animate={{
          x: [0, -20, 10, 0],
          y: [0, -15, 10, 0],
          scale: [1, 1.08, 0.96, 1]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ y: heroOrbThreeY }}
      />
      <motion.div 
        className="absolute bottom-10 right-5 w-36 h-36 md:w-48 md:h-48 bg-gradient-to-br from-pink-400/15 to-orange-400/15 rounded-full blur-3xl pointer-events-none z-0"
        animate={{ 
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ y: heroOrbTwoY }}
      />

      {/* Minimalist floating elements with parallax */}
      <motion.div 
        className="absolute top-1/3 left-1/4 w-2 h-2 bg-gray-300/40 rounded-full pointer-events-none z-0"
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -30]) }}
      />
      <motion.div 
        className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-gray-400/40 rounded-full pointer-events-none z-0"
        animate={{ 
          y: [0, 10, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -20]) }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* Left content - Apple-style Text */}
          <motion.div 
            className="space-y-8 text-left max-w-2xl order-2 lg:order-1"
          >
            {/* Apple-style announcement badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/5 backdrop-blur-xl border border-gray-200/50 text-gray-700 text-sm font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(0, 0, 0, 0.08)",
                transition: { duration: 0.2 }
              }}
            >
              <motion.span 
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              Ideal para empresas con alta rotación de inventario
            </motion.div>
            
            {/* Apple-style ultra clean headline */}
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-thin tracking-tight text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="relative block font-light">
                <span 
                  aria-hidden
                  className="block opacity-0 select-none pointer-events-none"
                >
                  {longestMessage}
                </span>
                <span 
                  className="absolute inset-0 block"
                  aria-live="polite"
                >
                  {displayText}
                  <motion.span 
                    className="inline-block w-1 h-[0.9em] bg-gray-900 ml-1"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </span>
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl sm:text-2xl text-gray-600 font-light max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Agentes con IA que reducen el esfuerzo que necesitas para llevar controlado tu margen operativo.
            </motion.p>
            
            {/* Apple-style buttons with primary colors */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  size="sm" 
                  className="h-10 px-6 text-sm font-medium bg-primary hover:bg-primary/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-300" 
                  onClick={() => navigate('/register')}
                >
                  Regístrate gratis
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-10 px-6 text-sm font-medium rounded-full border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30 transition-all duration-300" 
                  onClick={scrollToGuarantee}
                >
                  Garantía de 30 días →
                </Button>
              </motion.div>
            </motion.div>

            {/* Apple-style social proof - minimalist */}
            <motion.div 
              className="flex items-center gap-6 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
                    whileHover={{ 
                      scale: 1.1, 
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                  />
                ))}
              </div>
              <p className="text-gray-500 text-sm font-medium">
                Más de <span className="text-gray-900 font-semibold">200 empresas</span> confían en nosotros
              </p>
            </motion.div>
          </motion.div>

          {/* Right content - Robot video with original dimensions */}
          <motion.div 
            className="flex justify-center items-center relative order-1 lg:order-2 z-20"
            style={{ y: videoY, scale: videoScale }}
          >
            <motion.div 
              className="relative group z-20"
              initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ 
                scale: 1.05,
                rotateY: -5,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
            >
              {/* Enhanced Apple-style shadow with glow */}
              <motion.div 
                className="absolute -inset-8 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-blue-500/10 rounded-[2.5rem] blur-2xl opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Main video container with enhanced animations */}
              <motion.div 
                className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[480px] lg:h-[480px] xl:w-[504px] xl:h-[504px] rounded-[2rem] overflow-hidden bg-gray-900/90 backdrop-blur-xl shadow-sm z-20"
                whileHover={{
                  backgroundColor: "rgba(17, 24, 39, 0.95)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  rotateX: -2,
                }}
                transition={{ duration: 0.4 }}
              >
                {videoError ? (
                  <motion.div 
                    className="w-full h-full flex items-center justify-center bg-gray-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-center">
                      <motion.div 
                        className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </motion.div>
                      <p className="text-gray-500 text-sm">Error cargando demo</p>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <motion.video 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      preload="auto" 
                      onLoadedData={handleVideoLoad} 
                      onError={handleVideoError} 
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                      <source src="/robot_facturas.mp4" type="video/mp4" />
                      Tu navegador no soporta videos HTML5.
                    </motion.video>
                    {!videoLoaded && !videoError && (
                      <motion.div 
                        className="absolute inset-0 bg-gray-900 flex items-center justify-center"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="text-center">
                          <motion.div 
                            className="w-8 h-8 mx-auto mb-3 border-2 border-gray-300 border-t-gray-600 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <p className="text-gray-300 text-sm">Cargando demo...</p>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
