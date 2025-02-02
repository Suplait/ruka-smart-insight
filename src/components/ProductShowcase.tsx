import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Zap, LineChart } from "lucide-react";

export default function ProductShowcase() {
  const benefits = [
    {
      icon: Zap,
      title: "Integración Ultra Rápida",
      description: "Conecta tus sistemas en minutos, sin cambiar tu forma de trabajar"
    },
    {
      icon: Shield,
      title: "Datos 100% Seguros",
      description: "Tu información protegida con los más altos estándares de seguridad"
    },
    {
      icon: LineChart,
      title: "Visibilidad Total",
      description: "Monitorea tus operaciones en tiempo real desde cualquier lugar"
    }
  ];

  return (
    <section id="product" className="py-24 bg-secondary/30">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold leading-tight">
              Una plataforma diseñada para darte el control total
            </h2>
            <p className="text-xl text-muted-foreground">
              Toma mejores decisiones con datos actualizados y reportes en tiempo real. Simple, pero poderoso.
            </p>
            <div className="grid gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
                  <benefit.icon className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button size="lg" className="gap-2">
              Ver Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-2xl group">
            <img 
              src="/placeholder.svg" 
              alt="Ruka.ai Dashboard"
              className="w-full h-[720px] object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}