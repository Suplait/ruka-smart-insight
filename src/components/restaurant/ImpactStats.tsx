
import { motion } from "framer-motion";
import { Zap, TrendingUp } from "lucide-react";
import { ChartBarIcon } from "lucide-react";

export default function ImpactStats() {
  const stats = [
    {
      icon: Zap,
      stat: "90%",
      text: "Less time on paperwork",
      color: "text-yellow-500"
    },
    {
      icon: ChartBarIcon,
      stat: "100%",
      text: "Food cost control",
      color: "text-blue-500"
    },
    {
      icon: TrendingUp,
      stat: "15%",
      text: "Savings on supplies",
      color: "text-green-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="space-y-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-12 rounded-3xl"
    >
      <h2 className="text-4xl font-bold text-center">
        The impact on your restaurant
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {stats.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white p-8 rounded-xl shadow-lg text-center space-y-4 hover:shadow-xl transition-shadow"
          >
            <item.icon className={`w-12 h-12 ${item.color} mx-auto`} />
            <div className={`text-4xl font-bold ${item.color}`}>{item.stat}</div>
            <p className="text-gray-600">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
