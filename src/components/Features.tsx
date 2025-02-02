import { Bot, Brain, Clock, LineChart } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Features() {
  const features = [
    {
      icon: Bot,
      title: "Agentes Autónomos",
      description: "Nuestros agentes trabajan 24/7 automatizando tareas repetitivas para que tu equipo se enfoque en lo importante"
    },
    {
      icon: Brain,
      title: "IA Avanzada",
      description: "Tecnología de punta que aprende de tus datos para entregarte insights más precisos cada día"
    },
    {
      icon: Clock,
      title: "Tiempo Real",
      description: "Monitoreo constante de tus operaciones para detectar anomalías y oportunidades al instante"
    },
    {
      icon: LineChart,
      title: "Control Total",
      description: "Visualiza y optimiza tu margen operativo con datos actualizados y reportes detallados"
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-secondary/30 to-white" />
      <div className="container relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Agentes Inteligentes a tu Servicio
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Optimiza tus operaciones con agentes autónomos que trabajan sin descanso para mejorar tu eficiencia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-white/50 backdrop-blur hover:scale-105 transition-all duration-300 border-primary/10">
              <div className="mb-4">
                <feature.icon className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Agents Showcase */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden bg-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="aspect-video">
                <img 
                  src="/placeholder.svg" 
                  alt={`Agente Ruka ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h4 className="text-lg font-semibold mb-2">Agente {i + 1}</h4>
                  <p className="text-sm opacity-90">Descripción de la tarea que realiza este agente</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}