
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
    <section id="features" className="py-32 bg-gray-50/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-4xl lg:text-6xl font-thin text-gray-900 tracking-tight">
            Agentes Inteligentes que{" "}
            <span className="font-light bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              Trabajan por Ti
            </span>
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Imagina tener un equipo que trabaja 24/7 registrando compras, agrupando insumos maestros, monitoreando precios, alertando anomalías y detectando oportunidades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 hover:bg-white/80 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
            >
              <div className="relative z-10">
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-4 text-gray-900 tracking-tight">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-light">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
