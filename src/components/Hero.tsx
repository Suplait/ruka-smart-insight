import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const valueMessages = ["Automatiza el registro de compras.", "Controla tu margen al día, no al mes.", "Descubre alzas de precio de tus insumos en tiempo real.", "Genera reportes en segundos usando lenguaje natural.", "Gestiona simple el pago a tus proveedores.", "Ten toda tu información a la mano.", "Libera HH a la semana para que te enfoques en lo que importa."];
export default function Hero() {
  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const current = valueMessages[currentMessage];
    if (isDeleting) {
      if (displayText === "") {
        setIsDeleting(false);
        setCurrentMessage(prev => (prev + 1) % valueMessages.length);
      } else {
        timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        }, 30);
      }
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

  return <section className="relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 flex items-center overflow-hidden pt-24 sm:pt-20">
      {/* Apple-style subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20" />
      
      {/* Minimalist floating elements */}
      <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-gray-300/40 rounded-full animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-gray-400/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* Left content - Apple-style Text */}
          <div className="space-y-8 text-left max-w-2xl order-2 lg:order-1">
            {/* Apple-style announcement badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/5 backdrop-blur-xl border border-gray-200/50 text-gray-700 text-sm font-medium">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Ideal para empresas con alta rotación de inventario
            </div>
            
            {/* Apple-style ultra clean headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-thin tracking-tight text-gray-900 leading-tight">
              <span className="block font-light">
                {displayText}
                <span className="inline-block w-1 h-[0.9em] bg-gray-900 ml-1 animate-pulse"></span>
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 font-light max-w-xl leading-relaxed">
              Agentes con IA que reducen el esfuerzo que necesitas para llevar controlado tu margen operativo.
            </p>
            
            {/* Apple-style buttons with primary colors */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                size="sm" 
                className="h-10 px-6 text-sm font-medium bg-primary hover:bg-primary/90 rounded-full" 
                onClick={() => navigate('/register')}
              >
                Regístrate gratis
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-base font-medium rounded-full border-primary/20 text-primary hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02]" 
                onClick={scrollToGuarantee}
              >
                Garantía de 30 días →
              </Button>
            </div>

            {/* Apple-style social proof - minimalist */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm"></div>
                ))}
              </div>
              <p className="text-gray-500 text-sm font-medium">
                Más de <span className="text-gray-900 font-semibold">200 empresas</span> confían en nosotros
              </p>
            </div>
          </div>

          {/* Right content - Robot video with original dimensions */}
          <div className="flex justify-center items-center relative order-1 lg:order-2">
            <div className="relative group">
              {/* Subtle Apple-style shadow */}
              <div className="absolute -inset-8 bg-black/5 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              
              {/* Main video container - keeping original dimensions */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[504px] lg:h-[504px] rounded-[2rem] overflow-hidden bg-white/60 backdrop-blur-xl shadow-sm border border-gray-200/50 group-hover:scale-[1.02] transition-all duration-500">
                {videoError ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">Error cargando demo</p>
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
                      onLoadedData={handleVideoLoad} 
                      onError={handleVideoError} 
                      className="w-full h-full object-cover"
                    >
                      <source src="/robot_facturas.mp4" type="video/mp4" />
                      Tu navegador no soporta videos HTML5.
                    </video>
                    {!videoLoaded && !videoError && (
                      <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-8 h-8 mx-auto mb-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                          <p className="text-gray-500 text-sm">Cargando demo...</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}