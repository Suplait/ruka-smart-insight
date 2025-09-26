
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
    <section ref={ref} className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.metric}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                ease: [0.25, 0.25, 0, 1]
              }}
              className="relative group p-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-gray-200/50 hover:bg-white/80 transition-all duration-500 hover:scale-[1.02]"
            >
              {/* Subtle icon background */}
              <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon className="w-12 h-12 text-gray-900" />
              </div>
              
              <div className="relative z-10 space-y-3">
                <p className="text-3xl font-light text-gray-900 tracking-tight">
                  <AnimatedCounter 
                    value={stat.value} 
                    suffix={stat.suffix} 
                    prefix={stat.prefix} 
                    inView={isInView} 
                  />
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
