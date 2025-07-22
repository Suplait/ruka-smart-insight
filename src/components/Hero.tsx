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
  return <section className="relative min-h-screen bg-gradient-to-br from-purple-900/5 via-blue-50 to-indigo-100/30 flex items-center overflow-hidden pt-20 sm:pt-16">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-full blur-2xl" />
      </div>

      {/* Floating Geometric Elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-purple-500/20 rounded-full animate-float" style={{
      animationDelay: '0s'
    }} />
      <div className="absolute top-40 right-32 w-3 h-3 bg-blue-500/20 rounded-full animate-float" style={{
      animationDelay: '2s'
    }} />
      <div className="absolute bottom-40 left-32 w-5 h-5 bg-indigo-500/20 rounded-full animate-float" style={{
      animationDelay: '4s'
    }} />
      <div className="absolute bottom-20 right-20 w-2 h-2 bg-purple-500/30 rounded-full animate-float" style={{
      animationDelay: '1s'
    }} />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* Left content - Text */}
          <div className="space-y-6 sm:space-y-8 text-left max-w-2xl order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-700 animate-fade-in border border-purple-200/50 backdrop-blur-sm text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Ideal en empresas con alta rotación de inventario
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight transition-all duration-300">
              <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent after:content-['|'] after:ml-1 after:animate-blink after:text-purple-600">
                {displayText}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-xl leading-relaxed">Agentes con IA que reducen el esfuerzo que necesitas para llevar controlado tu margen operativo</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2 group hover:scale-105 transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg" onClick={() => navigate('/register')}>
                Regístrate
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="hover:scale-105 transition-all duration-300 border-purple-200 hover:border-purple-300 hover:bg-purple-50" onClick={scrollToGuarantee}>
                Garantía de 30 días
              </Button>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 text-sm">
              <div className="flex -space-x-3 sm:-space-x-4">
                {[...Array(4)].map((_, i) => <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-xs font-semibold text-purple-700 shadow-md">
                    {i < 3 ? "C" : "+200"}
                  </div>)}
              </div>
              <p className="text-gray-600">
                <span className="font-semibold text-purple-600">+200</span> empresas confían en nosotros
              </p>
            </div>
          </div>

          {/* Right content - Premium Video Container */}
          <div className="flex justify-center items-center relative order-1 lg:order-2">
            {/* Premium Container with Multiple Layers */}
            <div className="relative">
              {/* Outer Glow Ring */}
              <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 rounded-3xl blur-2xl opacity-60 animate-pulse" />
              
              {/* Main Video Container */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[504px] lg:h-[504px] rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white group hover:scale-105 transition-all duration-700 backdrop-blur-sm">
                {videoError ? <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-purple-600 text-sm font-medium">Error cargando demo</p>
                    </div>
                  </div> : <>
                    <video autoPlay loop muted playsInline preload="metadata" onLoadedData={handleVideoLoad} onError={handleVideoError} className="w-full h-full object-cover">
                      <source src="/robot_facturas.mp4" type="video/mp4" />
                      Tu navegador no soporta videos HTML5.
                    </video>
                    {!videoLoaded && !videoError && <div className="absolute inset-0 bg-gradient-to-br from-purple-100/95 to-blue-100/95 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 bg-white/70 rounded-full animate-spin border-2 border-transparent border-t-purple-500"></div>
                          <p className="text-purple-600 text-sm font-medium">Cargando demo...</p>
                        </div>
                      </div>}
                  </>}
                
                {/* Premium Inner Glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Floating Accent Elements */}
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-sm animate-float" style={{
              animationDelay: '0s'
            }} />
              <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 rounded-full blur-sm animate-float" style={{
              animationDelay: '2s'
            }} />
            </div>
          </div>
        </div>
      </div>
    </section>;
}