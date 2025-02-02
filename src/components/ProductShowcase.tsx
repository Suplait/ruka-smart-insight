import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ProductShowcase() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-4xl font-bold leading-tight">
              Una plataforma diseñada para la eficiencia operativa
            </h2>
            <p className="text-xl text-muted-foreground">
              Visualiza todos tus datos en un solo lugar, con reportes en tiempo real y alertas inteligentes que te ayudan a tomar mejores decisiones.
            </p>
            <Button size="lg" className="gap-2">
              Ver Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-2xl animate-scale-in">
            <img 
              src="/placeholder.svg" 
              alt="Ruka.ai Dashboard" 
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}