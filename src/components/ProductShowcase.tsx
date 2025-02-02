import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function ProductShowcase() {
  const benefits = [
    "Visualización en tiempo real de tus operaciones",
    "Reportes personalizados y exportables",
    "Alertas inteligentes de anomalías",
    "Dashboard intuitivo y fácil de usar"
  ];

  return (
    <section id="product" className="py-24 bg-secondary/30">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-4xl font-bold leading-tight">
              Una plataforma diseñada para darte el control total
            </h2>
            <p className="text-xl text-muted-foreground">
              Toma mejores decisiones con datos actualizados y reportes en tiempo real. Simple, pero poderoso.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary w-5 h-5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" className="gap-2">
              Ver Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-2xl animate-scale-in group">
            <img 
              src="/placeholder.svg" 
              alt="Ruka.ai Dashboard" 
              className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}