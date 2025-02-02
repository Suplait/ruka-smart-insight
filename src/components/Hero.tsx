import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const valueMessages = [
  "Automatiza tu back office sin contratar más personas",
  "Elimina la digitación manual para siempre",
  "Detecta errores antes que te cuesten dinero",
  "Toma decisiones con datos actualizados al instante",
  "Recupera el control de tus operaciones",
];

export default function Hero() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const current = valueMessages[currentMessage];
    
    if (isDeleting) {
      if (displayText === "") {
        setIsDeleting(false);
        setCurrentMessage((prev) => (prev + 1) % valueMessages.length);
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

  const scrollToGuarantee = () => {
    const element = document.getElementById('guarantee');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-blur opacity-50" />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Agentes con IA que trabajan por ti
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight transition-all duration-300">
              <span className={cn(
                "bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent",
                "after:content-['|'] after:ml-1 after:animate-blink after:text-primary"
              )}>
                {displayText}
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl">
              Agentes con IA que procesan tus facturas y documentos automáticamente, eliminando la digitación manual y los errores humanos en tu back office
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="gap-2 group hover:scale-105 transition-all duration-300"
                onClick={() => window.open('https://calendly.com/suplait_lorenzo/30min', '_blank')}
              >
                Solicitar Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="hover:scale-105 transition-all duration-300"
                onClick={scrollToGuarantee}
              >
                Ver Garantía de 30 Días
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex -space-x-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-semibold"
                  >
                    {i < 3 ? "C" : "+100"}
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground">
                <span className="font-semibold text-primary">+100</span> empresas confían en nosotros
              </p>
            </div>
          </div>

          <div className="relative lg:h-[640px] animate-float">
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="/robotshero2.png" 
                  alt="Dashboard Ruka.ai" 
                  className="w-full h-[640px] object-contain rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}