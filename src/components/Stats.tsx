
import { Users, FileText, TrendingUp, Clock } from "lucide-react";

const stats = [
  {
    value: "+200",
    metric: "Clientes Felices",
    icon: Users,
    description: "confían en nosotros",
  },
  {
    value: "+3MM",
    metric: "Transacciones",
    icon: TrendingUp,
    description: "digitalizadas",
  },
  {
    value: "+US$350M",
    metric: "Procesados",
    icon: FileText,
    description: "automáticamente",
  },
  {
    value: "+15 hrs",
    metric: "Ahorro Semanal",
    icon: Clock,
    description: "promedio por empresa",
  },
];

export default function Stats() {
  return (
    <section className="py-12 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.metric}
              className="relative overflow-hidden group p-8 rounded-2xl bg-gradient-to-br from-secondary/40 to-secondary/20 hover:from-secondary/60 hover:to-secondary/40 transition-all duration-300 ease-in-out"
              style={{ 
                animationDelay: `${index * 150}ms`,
                transform: 'translateY(0)',
                transition: 'transform 0.3s ease-in-out'
              }}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon className="w-16 h-16 text-primary" />
              </div>
              <div className="relative z-10 space-y-4">
                <p className="text-4xl font-bold text-primary tracking-tight">
                  {stat.value}
                </p>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {stat.metric}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
