import { Bot, FileText, LineChart, Clock, Users, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

export default function ValueProposition() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const cardsScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.99, 1, 0.99]);
  const values = [
    {
      icon: Bot,
      title: "Cero Digitación Manual",
      description: "Olvídate de ingresar datos manualmente. Nuestros agentes procesan automáticamente tus documentos 24/7."
    },
    {
      icon: FileText,
      title: "Clasificación Automática",
      description: "Cada documento se agrupa y clasifica automáticamente, manteniendo tu información ordenada y accesible."
    },
    {
      icon: LineChart,
      title: "Visión Completa del Negocio",
      description: "Accede a tu insumo maestro en tiempo real. Visualiza compras, ventas y márgenes al instante."
    },
    {
      icon: Clock,
      title: "Reportes en Segundos",
      description: "Genera reportes personalizados instantáneamente. Lo que antes tomaba días, ahora toma segundos."
    },
    {
      icon: Users,
      title: "Integración con Proveedores",
      description: "Conectamos directamente con tus proveedores para obtener datos actualizados automáticamente."
    },
    {
      icon: Zap,
      title: "Implementación Ultra Rápida",
      description: "En minutos estarás operando con Ruka. La integración más rápida del mercado."
    }
  ];

  return (
    <motion.section 
      ref={containerRef}
      className="py-24 relative overflow-hidden bg-white"
      style={{ scale: cardsScale }}
    >
      {/* Dynamic parallax background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-white via-secondary/30 to-white" 
        style={{ y: backgroundY }}
      />
      
      {/* Animated mesh gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-transparent to-purple-50/60"
        animate={{
          background: [
            "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 50%, rgba(168, 85, 247, 0.1) 100%)",
            "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, transparent 50%, rgba(59, 130, 246, 0.1) 100%)",
            "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 50%, rgba(168, 85, 247, 0.1) 100%)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/20 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        />
      ))}

      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h2 
            className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", bounce: 0.3 }}
          >
            Automatización que Entiende tu Negocio
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Diseñado específicamente para resolver los dolores diarios de empresas medianas como la tuya
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ 
                opacity: 0, 
                y: 80,
                rotateX: 30,
                scale: 0.8
              }}
              animate={isInView ? { 
                opacity: 1, 
                y: 0,
                rotateX: 0,
                scale: 1
              } : { 
                opacity: 0, 
                y: 80,
                rotateX: 30,
                scale: 0.8
              }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15 + 0.8,
                type: "spring",
                bounce: 0.4
              }}
              whileHover={{ 
                scale: 1.08,
                rotateY: 5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="p-6 bg-white/50 backdrop-blur border-primary/10 group relative overflow-hidden">
                {/* Animated background glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Scanning line effect */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 2,
                    delay: index * 0.3 + 2,
                    repeat: Infinity,
                    repeatDelay: 5
                  }}
                />

                <div className="relative z-10">
                  <motion.div 
                    className="mb-4"
                    whileHover={{ 
                      scale: 1.2,
                      rotate: [0, -10, 10, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    <value.icon className="w-12 h-12 text-primary group-hover:text-primary/80 transition-colors duration-300" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground group-hover:text-gray-700 transition-colors duration-300">
                    {value.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
