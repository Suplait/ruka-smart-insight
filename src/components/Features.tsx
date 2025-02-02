import { CheckCircle, Clock, DollarSign, TrendingUp } from "lucide-react";

const features = [
  {
    title: "Procesamiento Automático",
    description: "Sin ingreso manual de datos. Nuestros agentes de IA hacen todo el trabajo.",
    icon: CheckCircle,
  },
  {
    title: "Monitoreo en Tiempo Real",
    description: "Controla tus márgenes operativos al momento, no meses después.",
    icon: Clock,
  },
  {
    title: "Optimización de Costos",
    description: "Identifica oportunidades de ahorro y optimiza tus gastos.",
    icon: DollarSign,
  },
  {
    title: "Insights Inteligentes",
    description: "Obtén recomendaciones accionables para mejorar el rendimiento de tu negocio.",
    icon: TrendingUp,
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">¿Por qué elegir Ruka.ai?</h2>
          <p className="text-xl text-muted-foreground">
            Transforma tus operaciones con automatización inteligente
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="text-center hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="mb-4 flex justify-center">
                <feature.icon className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}