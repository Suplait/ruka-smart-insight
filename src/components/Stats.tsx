
import { Users, FileText, TrendingUp, Clock } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <motion.section 
      ref={containerRef}
      className="py-20 bg-gray-50/50 relative overflow-hidden"
    >
      {/* Subtle animated background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{
          x: useTransform(scrollYProgress, [0, 1], ["-100%", "100%"]),
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.metric}
              initial={{ opacity: 0, y: 40, rotateX: 15 }}
              whileInView={{ 
                opacity: 1, 
                y: 0, 
                rotateX: 0,
                transition: {
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }
              }}
              viewport={{ once: true, margin: "-10%" }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                rotateX: -2,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="relative group perspective-1000"
            >
              <motion.div 
                className="relative p-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-sm"
                whileHover={{
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                  borderColor: "rgba(59, 130, 246, 0.15)",
                  boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated icon background */}
                <motion.div 
                  className="absolute top-6 right-6 opacity-5"
                  whileHover={{ 
                    opacity: 0.1, 
                    rotate: 5,
                    scale: 1.1,
                    transition: { duration: 0.3 }
                  }}
                >
                  <stat.icon className="w-12 h-12 text-gray-900" />
                </motion.div>
                
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                <div className="relative z-10 space-y-3">
                  <motion.p 
                    className="text-3xl font-light text-gray-900 tracking-tight"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    {stat.value}
                  </motion.p>
                  <motion.div 
                    className="space-y-1"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <h3 className="text-base font-medium text-gray-900">
                      {stat.metric}
                    </h3>
                    <p className="text-sm text-gray-600 font-light">
                      {stat.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
