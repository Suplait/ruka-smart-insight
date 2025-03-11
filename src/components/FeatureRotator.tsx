
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Clock, PieChart, TrendingUp, AlertTriangle, Shield } from "lucide-react";

const features = [
  {
    title: "Automatización de facturas",
    description: "Procesa automáticamente todas tus facturas de compra y venta sin intervención manual.",
    icon: FileText,
    color: "from-blue-500 to-blue-400"
  },
  {
    title: "Ahorro de tiempo",
    description: "Reduce hasta 15 horas semanales en tareas administrativas y contables.",
    icon: Clock,
    color: "from-emerald-500 to-emerald-400"
  },
  {
    title: "Reportes inteligentes",
    description: "Obtén insights valiosos sobre tu negocio con informes automatizados.",
    icon: PieChart,
    color: "from-purple-500 to-purple-400"
  },
  {
    title: "Predicción de flujo",
    description: "Anticipa tus ingresos y gastos con modelos predictivos avanzados.",
    icon: TrendingUp,
    color: "from-amber-500 to-amber-400"
  },
  {
    title: "Alertas preventivas",
    description: "Recibe notificaciones anticipadas sobre posibles problemas fiscales.",
    icon: AlertTriangle,
    color: "from-rose-500 to-rose-400"
  },
  {
    title: "Máxima seguridad",
    description: "Tus datos están protegidos con los más altos estándares de encriptación.",
    icon: Shield,
    color: "from-green-500 to-green-400"
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

  const currentFeature = features[currentIndex];

  return (
    <div className="relative h-[160px] w-full bg-white/40 backdrop-blur-sm rounded-xl p-6 shadow-sm overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${currentFeature.color}`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          key={currentIndex}
        />
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="h-full flex items-start gap-4"
        >
          <div className={`p-3 rounded-lg bg-gradient-to-br ${currentFeature.color} shadow-md`}>
            <currentFeature.icon className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{currentFeature.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{currentFeature.description}</p>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute bottom-3 right-4 flex gap-1">
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
