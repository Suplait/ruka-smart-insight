
import { Bot, Brain, Clock, LineChart } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Features() {
  const features = [
    {
      icon: Bot,
      title: "Agentes Autónomos 24/7",
      description: "Automatiza tareas repetitivas mientras reduces costos operativos y errores humanos",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "IA que Aprende de tu Negocio",
      description: "Nuestros agentes se adaptan a tus procesos para entregarte insights más precisos cada día",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Clock,
      title: "Información al Instante",
      description: "Accede a tus datos en tiempo real para tomar decisiones informadas cuando las necesites",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: LineChart,
      title: "Control Total",
      description: "Visualiza y optimiza tu margen operativo con datos actualizados y reportes detallados",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-gradient-to-b from-white via-gray-50/30 to-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
      
      <div className="container relative">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Agentes Inteligentes que Trabajan por Ti
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Imagina tener un equipo que trabaja 24/7 registrando compras, agrupando insumos maestros, monitoreando precios, alertando anomalías y detectando oportunidades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group p-8 bg-white/90 backdrop-blur hover:scale-105 hover:shadow-2xl transition-all duration-500 border border-gray-200/50 relative overflow-hidden"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
