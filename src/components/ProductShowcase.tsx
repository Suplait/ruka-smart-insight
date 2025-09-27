import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Zap, LineChart } from "lucide-react";

export default function ProductShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

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
          <div className="relative rounded-xl overflow-hidden shadow-2xl group w-full bg-gray-900">
            <div 
              className="cursor-pointer w-full relative"
              onClick={() => setIsModalOpen(true)}
            >
              <img 
                src="https://img.youtube.com/vi/5Mgdczprvlc/maxresdefault.jpg"
                alt="Ruka.ai Dashboard Demo"
                className="w-full h-[315px] object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
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