
import { Users, FileText, TrendingUp, Clock } from "lucide-react";

const stats = [
  {
    value: "120+",
    metric: "Happy Clients",
    icon: Users,
    description: "companies trust us",
  },
  {
    value: "800K+",
    metric: "Invoices",
    icon: FileText,
    description: "documents processed automatically",
  },
  {
    value: "US$250M+",
    metric: "Transactions",
    icon: TrendingUp,
    description: "in digitized data",
  },
  {
    value: "15 hrs",
    metric: "Weekly Savings",
    icon: Clock,
    description: "average per company",
  },
];

export default function Stats() {
  return (
    <section className="py-24 bg-white">
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
