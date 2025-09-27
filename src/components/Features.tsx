
import { Bot, Brain, Clock, LineChart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

export default function Features() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [0, -2, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.98]);
  const features = [
    {
      icon: Bot,
      title: "Agentes Autónomos 24/7",
      description: "Automatiza tareas repetitivas mientras reduces costos operativos y errores humanos",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "IA que Aprende de tu Negocio",
      description: "Nuestros agentes se adaptan a tus procesos para entregarte insights más precisos cada día",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Clock,
      title: "Información al Instante",
      description: "Accede a tus datos en tiempo real para tomar decisiones informadas cuando las necesites",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: LineChart,
      title: "Control Total",
      description: "Visualiza y optimiza tu margen operativo con datos actualizados y reportes detallados",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <motion.section 
      id="features" 
      ref={containerRef}
      className="py-32 bg-gray-50/50 relative overflow-hidden"
      style={{ y, rotateX, scale }}
    >
      {/* Dynamic gradient background that shifts on scroll */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/20 to-pink-50/40"
        style={{ 
          x: useTransform(scrollYProgress, [0, 1], [0, 100]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.7, 0.3])
        }}
      />

      {/* Floating geometric shapes */}
      <motion.div 
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
        animate={{ 
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-pink-400/15 to-orange-400/15 rounded-full blur-2xl"
        animate={{ 
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <motion.div 
          className="text-center mb-20 space-y-6"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h2 
            className="text-4xl lg:text-6xl font-thin text-gray-900 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Agentes Inteligentes que{" "}
            <motion.span 
              className="font-light bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 0.8, type: "spring", bounce: 0.4 }}
            >
              Trabajan por Ti
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 font-light max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Imagina tener un equipo que trabaja 24/7 registrando compras, agrupando insumos maestros, monitoreando precios, alertando anomalías y detectando oportunidades.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 hover:bg-white/80 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 50, rotateY: 15 }}
              animate={isInView ? { 
                opacity: 1, 
                y: 0, 
                rotateY: 0 
              } : { 
                opacity: 0, 
                y: 50, 
                rotateY: 15 
              }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15 + 1,
                type: "spring",
                bounce: 0.4
              }}
              whileHover={{ 
                scale: 1.05,
                rotateY: -5,
                boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated gradient border */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent rounded-3xl opacity-0"
                animate={{
                  opacity: [0, 0.5, 0],
                  x: ['-100%', '100%', '200%']
                }}
                transition={{
                  duration: 3,
                  delay: index * 0.5 + 2,
                  repeat: Infinity,
                  repeatDelay: 4
                }}
              />

              <div className="relative z-10">
                <motion.div 
                  className="mb-6"
                  whileHover={{ 
                    scale: 1.15,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.4 }
                  }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </motion.div>
                <motion.h3 
                  className="text-xl font-medium mb-4 text-gray-900 tracking-tight"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: index * 0.15 + 1.2 }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-600 leading-relaxed font-light"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: index * 0.15 + 1.4 }}
                >
                  {feature.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
