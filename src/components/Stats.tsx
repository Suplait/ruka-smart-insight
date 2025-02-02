import { Users, FileText, TrendingUp, Clock } from "lucide-react";

const stats = [
  {
    label: "Clientes Activos",
    value: "100+",
    icon: Users,
    description: "empresas confían en nosotros",
  },
  {
    label: "Facturas Procesadas",
    value: "700K+",
    icon: FileText,
    description: "documentos automatizados",
  },
  {
    label: "Datos Procesados",
    value: "US$220M+",
    icon: TrendingUp,
    description: "en transacciones analizadas",
  },
  {
    label: "Tiempo Ahorrado",
    value: "15",
    icon: Clock,
    description: "horas semanales por cliente",
  },
];

export default function Stats() {
  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-xl bg-secondary/30 hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex justify-center mb-4">
                <stat.icon className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-primary">{stat.value}</p>
                <h3 className="text-xl font-semibold">{stat.label}</h3>
                <p className="text-muted-foreground">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}