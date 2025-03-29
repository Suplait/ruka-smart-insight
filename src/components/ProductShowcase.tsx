import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Zap, LineChart } from "lucide-react";

export default function ProductShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              Te brindamos una plataforma moderna y simple para que encuentres rápido lo que necesitas y puedas tomar mejores decisiones.
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
            <Button 
              size="lg" 
              className="gap-2"
              onClick={() => window.open('https://www.youtube.com/watch?v=5Mgdczprvlc', '_blank')}
            >
              Ver Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-2xl group w-full">
            <div 
              className="cursor-pointer w-full"
              onClick={() => setIsModalOpen(true)}
            >
              <iframe 
                width="100%" 
                height="315" 
                src="https://www.youtube.com/embed/5Mgdczprvlc" 
                title="Ruka.ai Dashboard"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="transform group-hover:scale-105 transition-transform duration-500 pointer-events-none"
              ></iframe>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl w-full h-full max-w-6xl max-h-[90vh]">
            <div className="relative w-full h-full">
              <button 
                className="absolute top-2 right-2 text-white bg-black rounded-full p-1"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/5Mgdczprvlc?autoplay=1" 
                title="Ruka.ai Dashboard"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}