import { Bot, Brain, Clock, LineChart } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Features() {
  const features = [
    {
      icon: Bot,
      title: "Agentes Autónomos 24/7",
      description: "Automatiza tareas repetitivas mientras reduces costos operativos y errores humanos"
    },
    {
      icon: Brain,
      title: "IA que Aprende de tu Negocio",
      description: "Nuestros agentes se adaptan a tus procesos para entregarte insights más precisos cada día"
    },
    {
      icon: Clock,
      title: "Información al Instante",
      description: "Accede a tus datos en tiempo real para tomar decisiones informadas cuando las necesites"
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
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">
            Agentes Inteligentes que Trabajan por Ti
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Imagina tener un equipo que trabaja 24/7 procesando tus datos, detectando oportunidades y ahorrándote tiempo y dinero
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 bg-white/50 backdrop-blur hover:scale-105 transition-all duration-300 border-primary/10 group"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Digita y limpia", desc: "Reduce a 0 el tiempo de registrar tus compras", imgSrc: "/value1.png" },
            { title: "Agrupa y clasifica", desc: "Crea automáticamente un maestro de insumos", imgSrc: "/value2.png" },
            { title: "Monitorea 24/7", desc: "Alerta en inmediato ante anomalías que afecten tu margen", imgSrc: "/value3.png" }
          ].map((agent, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden bg-white/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="aspect-video">
                <img 
                  src={agent.imgSrc} 
                  alt={agent.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h4 className="text-lg font-semibold mb-2">{agent.title}</h4>
                  <p className="text-sm opacity-90">{agent.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}