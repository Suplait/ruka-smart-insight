
import { Users, FileText, TrendingUp, Clock } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
  {
    value: 200,
    suffix: "+",
    metric: "Clientes Felices",
    icon: Users,
    description: "confían en nosotros",
  },
  {
    value: 3,
    suffix: "MM+",
    metric: "Transacciones",
    icon: TrendingUp,
    description: "digitalizadas",
  },
  {
    value: 350,
    suffix: "M+",
    prefix: "US$",
    metric: "Procesados",
    icon: FileText,
    description: "automáticamente",
  },
  {
    value: 15,
    suffix: " hrs+",
    metric: "Ahorro Semanal",
    icon: Clock,
    description: "promedio por empresa",
  },
];

function AnimatedCounter({ value, suffix = "", prefix = "", inView }: { value: number; suffix?: string; prefix?: string; inView: boolean }) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000 });
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    } else {
      motionValue.set(0);
    }
  }, [motionValue, value, inView]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.floor(latest)}${suffix}`;
      }
    });
    return () => unsubscribe();
  }, [springValue, suffix, prefix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 bg-gray-50/50 relative overflow-hidden">
      {/* Floating particles background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.metric}
              initial={{ 
                opacity: 0, 
                y: 100, 
                rotateX: -15,
                scale: 0.8
              }}
              animate={isInView ? { 
                opacity: 1, 
                y: 0, 
                rotateX: 0,
                scale: 1
              } : { 
                opacity: 0, 
                y: 100, 
                rotateX: -15,
                scale: 0.8
              }}
              transition={{ 
                duration: 1.2, 
                delay: index * 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 100
              }}
              whileHover={{
                scale: 1.05,
                y: -10,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              className="relative group p-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-gray-200/50 hover:bg-white/80 transition-all duration-500"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Dramatic icon background with animation */}
              <motion.div 
                className="absolute top-6 right-6 opacity-5 group-hover:opacity-20 transition-opacity"
                animate={isInView ? {
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                } : {}}
                transition={{
                  duration: 2,
                  delay: index * 0.3 + 0.5,
                  ease: "easeInOut"
                }}
              >
                <stat.icon className="w-12 h-12 text-primary" />
              </motion.div>
              
              {/* Glowing border effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-0 group-hover:opacity-100"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              
              <div className="relative z-10 space-y-4">
                <motion.p 
                  className="text-4xl font-light text-gray-900 tracking-tight"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.2 + 0.3,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <AnimatedCounter 
                    value={stat.value} 
                    suffix={stat.suffix} 
                    prefix={stat.prefix} 
                    inView={isInView} 
                  />
                </motion.p>
                <motion.div 
                  className="space-y-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2 + 0.6 
                  }}
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
          ))}
        </div>
      </div>
    </section>
  );
}
