import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-blur opacity-50" />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Tecnología de punta para tu empresa
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Controla tu margen operativo en{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                tiempo real
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl">
              Ruka.ai ayuda a empresas medianas a monitorear y optimizar sus costos operativos sin necesidad de un back office.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2 group hover:scale-105 transition-all duration-300">
                Solicitar Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="hover:scale-105 transition-all duration-300">
                Conoce Más
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">+1</span>
                  </div>
                ))}
              </div>
              <p>+100 empresas ya confían en Ruka.ai</p>
            </div>
          </div>

          <div className="relative lg:h-[600px] animate-float">
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="/placeholder.svg" 
                  alt="Dashboard Ruka.ai" 
                  className="w-full h-auto rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}