
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
    <section className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.metric}
              className="relative group p-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-gray-200/50 hover:bg-white/80 transition-all duration-500 hover:scale-[1.02]"
              style={{ 
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Subtle icon background */}
              <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon className="w-12 h-12 text-gray-900" />
              </div>
              
              <div className="relative z-10 space-y-3">
                <p className="text-3xl font-light text-gray-900 tracking-tight">
                  {stat.value}
                </p>
                <div className="space-y-1">
                  <h3 className="text-base font-medium text-gray-900">
                    {stat.metric}
                  </h3>
                  <p className="text-sm text-gray-600 font-light">
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
