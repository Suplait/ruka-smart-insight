
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function SimpleConnection() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-6"
    >
      <h2 className="text-2xl font-bold text-center text-primary mb-8">
        Conexión Simple y Rápida
      </h2>
      
      <div className="relative mb-12">
        <div className="grid grid-cols-3 gap-4 relative z-10">
          {/* SII */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-4 rounded-lg shadow-md text-center"
          >
            <div className="flex items-center justify-center w-10 h-10 mb-2 mx-auto">
              <img 
                src="/logosii.png" 
                alt="SII Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-sm font-medium">SII</h3>
            <p className="text-xs text-gray-600">Compra y venta</p>
          </motion.div>

          {/* Ruka.ai */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-primary p-4 rounded-lg shadow-md text-center text-white transform hover:-translate-y-1 transition-transform"
          >
            <div className="flex items-center justify-center w-10 h-10 mb-2 mx-auto bg-white rounded-full p-1">
              <img 
                src="/0webclip.jpg" 
                alt="Ruka.ai Logo" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <h3 className="text-sm font-medium">Ruka</h3>
            <p className="text-xs">Inteligencia</p>
          </motion.div>

          {/* Facturador */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-4 rounded-lg shadow-md text-center"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-2 mx-auto">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-medium">Facturador</h3>
            <p className="text-xs text-gray-600">XMLs</p>
          </motion.div>
        </div>
        
        {/* Flow lines */}
        <div className="absolute top-1/2 left-[27%] w-[18%] h-0.5 -translate-y-1/2 bg-primary/30 z-0"></div>
        <div className="absolute top-1/2 right-[27%] w-[18%] h-0.5 -translate-y-1/2 bg-primary/30 z-0"></div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="text-xl font-bold text-primary">100%</div>
          <p className="text-xs text-gray-600">Automatizado</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="text-xl font-bold text-primary">24/7</div>
          <p className="text-xs text-gray-600">Monitoreo</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="text-xl font-bold text-primary">98%</div>
          <p className="text-xs text-gray-600">Precisión</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
