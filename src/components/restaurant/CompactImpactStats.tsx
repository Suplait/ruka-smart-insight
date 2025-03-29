
import { motion } from "framer-motion";
import { Zap, TrendingUp, BarChart2 } from "lucide-react";

export default function CompactImpactStats() {
  const stats = [
    {
      icon: Zap,
      stat: "90%",
      text: "Menos tiempo en papeleo",
      color: "text-yellow-500"
    },
    {
      icon: BarChart2,
      stat: "100%",
      text: "Control de food cost",
      color: "text-blue-500"
    },
    {
      icon: TrendingUp,
      stat: "15%",
      text: "Ahorro en insumos",
      color: "text-green-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-center mb-6">
        El impacto en tu restaurante
      </h2>
      
      <div className="grid grid-cols-3 gap-4">
        {stats.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="bg-white p-4 rounded-lg shadow-sm text-center space-y-2"
          >
            <item.icon className={`w-7 h-7 ${item.color} mx-auto`} />
            <div className={`text-xl font-bold ${item.color}`}>{item.stat}</div>
            <p className="text-xs text-gray-600">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
