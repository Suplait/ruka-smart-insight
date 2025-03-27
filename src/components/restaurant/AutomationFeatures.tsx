
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function AutomationFeatures() {
  const features = [
    "Digitaliza tus facturas automáticamente",
    "Agrupa y crea un maestro de insumos",
    "Monitorea precios en tiempo real",
    "Alerta ante alzas de precios",
    "Se integra con tu facturador"
  ];
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center"
      >
        <img 
          src="/robotshero2.png" 
          alt="Ruka Robot" 
          className="h-32 object-contain"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-primary/20"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-6">
          Ruka lo hace todo automático
        </h2>
        
        <div className="space-y-3">
          {features.map((feature, index) => (
            <motion.p 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex items-center gap-2 text-primary/80"
            >
              <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                <Check className="w-3 h-3" />
              </span>
              <span className="text-sm">{feature}</span>
            </motion.p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
