
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, FileText, TrendingUp, Clock } from "lucide-react";

const metrics = [
  {
    value: 120,
    suffix: "+",
    label: "Clientes activos",
    icon: Users,
    color: "text-blue-500"
  },
  {
    value: 15,
    suffix: " hrs",
    label: "Ahorro semanal",
    icon: Clock,
    color: "text-emerald-500"
  },
  {
    value: 800,
    suffix: "K+",
    label: "Facturas procesadas",
    icon: FileText,
    color: "text-purple-500"
  },
  {
    value: 250,
    suffix: "M+",
    prefix: "US$",
    label: "Transacciones",
    icon: TrendingUp,
    color: "text-amber-500"
  }
];

export default function ImpactMetrics() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map((metric, index) => (
        <div 
          key={index}
          className="flex flex-col items-center p-3 rounded-lg bg-white/40 backdrop-blur-sm shadow-sm"
        >
          <metric.icon className={`h-5 w-5 ${metric.color} mb-2`} />
          <div className="text-center">
            <div className="font-bold">
              {isVisible ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                >
                  {metric.prefix && metric.prefix}
                  <motion.span
                    initial={{ number: 0 }}
                    animate={{ number: metric.value }}
                    transition={{ duration: 1.5, delay: 0.2 * index }}
                  >
                    {({ number }) => Math.floor(number)}
                  </motion.span>
                  {metric.suffix}
                </motion.span>
              ) : (
                <span>
                  {metric.prefix && metric.prefix}0{metric.suffix}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500">{metric.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
