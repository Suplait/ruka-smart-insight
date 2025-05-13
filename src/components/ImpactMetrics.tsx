
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, FileText, TrendingUp, Clock } from "lucide-react";

const metrics = [
  {
    value: 150,
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
    value: 1000,
    suffix: "K+",
    label: "Facturas procesadas",
    icon: FileText,
    color: "text-purple-500"
  },
  {
    value: 300,
    suffix: "M+",
    prefix: "US$",
    label: "Transacciones",
    icon: TrendingUp,
    color: "text-amber-500"
  }
];

export default function ImpactMetrics() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentValues, setCurrentValues] = useState(metrics.map(() => 0));

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timeouts = metrics.map((metric, index) => {
        return setTimeout(() => {
          setCurrentValues(prev => {
            const newValues = [...prev];
            newValues[index] = metric.value;
            return newValues;
          });
        }, index * 200);
      });

      return () => timeouts.forEach(clearTimeout);
    }
  }, [isVisible]);

  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map((metric, index) => (
        <div 
          key={index}
          className="flex flex-col items-center p-3 rounded-lg bg-white/40 backdrop-blur-sm shadow-sm"
        >
          <metric.icon className={`h-5 w-5 ${metric.color} mb-2`} />
          <div className="text-center">
            <motion.div 
              className="font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * index }}
            >
              {metric.prefix && metric.prefix}
              {currentValues[index]}
              {metric.suffix}
            </motion.div>
            <div className="text-xs text-slate-500">{metric.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
