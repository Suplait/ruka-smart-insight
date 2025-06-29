
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

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-blur opacity-30" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Ideal en empresas con alta rotación de inventario
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight transition-all duration-300">
              <span className="bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent after:content-['|'] after:ml-1 after:animate-blink after:text-primary">
                {displayText}
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl">
              Agentes con IA que procesan, agrupan y monitorean tus transacciones para que tengas control absoluto de tu negocio.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2 group hover:scale-105 transition-all duration-300" onClick={() => navigate('/register')}>
                Regístrate
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="hover:scale-105 transition-all duration-300" onClick={scrollToGuarantee}>
                Garantía de 30 días
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex -space-x-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-semibold">
                    {i < 3 ? "C" : "+100"}
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground">
                <span className="font-semibold text-primary">+150</span> empresas confían en nosotros
              </p>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-[600px] aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50 bg-white">
              {videoError ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100/90 to-gray-200/90 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 bg-white/50 rounded-full animate-spin border-2 border-transparent border-t-primary"></div>
                        <p className="text-gray-600 text-sm font-medium">Cargando demo...</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Elementos decorativos */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
