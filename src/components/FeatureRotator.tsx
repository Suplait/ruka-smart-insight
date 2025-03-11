
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Brain, Clock, LineChart } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: "Agentes Autónomos 24/7",
    description: "Automatiza tareas repetitivas mientras reduces costos operativos y errores humanos"
  },
  {
    icon: Brain,
    title: "IA que Aprende de tu Negocio",
    description: "Nuestros agentes se adaptan a tus procesos para entregarte insights más precisos cada día"
  },
  {
    icon: Clock,
    title: "Información al Instante",
    description: "Accede a tus datos en tiempo real para tomar decisiones informadas cuando las necesites"
  },
  {
    icon: LineChart,
    title: "Control Total",
    description: "Visualiza y optimiza tu margen operativo con datos actualizados y reportes detallados"
  }
];

export default function FeatureRotator() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[120px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center"
        >
          <div className="flex items-start gap-4">
            <features[currentIndex].icon className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">{features[currentIndex].title}</h3>
              <p className="text-sm text-slate-600">{features[currentIndex].description}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute bottom-0 left-0 flex gap-1">
        {features.map((_, index) => (
          <div 
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-primary w-3" : "bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
