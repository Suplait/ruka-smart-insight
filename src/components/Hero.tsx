import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] gradient-blur" />
      </div>
      <div className="relative z-10 px-6 lg:px-8 py-24 lg:py-32 mx-auto max-w-7xl">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Controla tu margen operativo en tiempo real
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Ruka.ai ayuda a empresas medianas a monitorear y optimizar sus costos operativos sin necesidad de un back office.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="gap-2 hover:scale-105 transition-transform">
              Solicitar Demo <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="hover:scale-105 transition-transform">
              Conoce Más
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}