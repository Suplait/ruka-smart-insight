import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const DataFlowSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
      </div>
      
      <div className="container relative">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Conexión Simple y Rápida
          </span>
        </h2>

        <div className="relative mt-20">
          {/* Flow Lines */}
          <div className="hidden md:block">
            {/* Left Flow Line */}
            <div className="absolute top-1/2 left-[calc(33%+2rem)] w-[calc(33%-4rem)] h-1 -translate-y-1/2">
              <div className="relative w-full h-full">
                {/* Base line */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-primary/30 rounded-full" />
                
                {/* Animated dots */}
                <div className="absolute inset-0 flex justify-start animate-flow-right">
                  <div className="flex gap-16">
                    {[...Array(6)].map((_, i) => (
                      <div 
                        key={i} 
                        className="h-3 w-3 rounded-full bg-primary shadow-lg shadow-primary/20"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Flow Line */}
            <div className="absolute top-1/2 right-[calc(33%+2rem)] w-[calc(33%-4rem)] h-1 -translate-y-1/2">
              <div className="relative w-full h-full">
                {/* Base line */}
                <div className="absolute inset-0 bg-gradient-to-l from-blue-200 to-primary/30 rounded-full" />
                
                {/* Animated dots */}
                <div className="absolute inset-0 flex justify-start animate-flow-left">
                  <div className="flex gap-16">
                    {[...Array(6)].map((_, i) => (
                      <div 
                        key={i} 
                        className="h-3 w-3 rounded-full bg-primary shadow-lg shadow-primary/20"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* SII */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-6 mx-auto">
                <img 
                  src="/logosii.png" 
                  alt="SII Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">SII</h3>
              <p className="text-gray-600 text-center">Facturas automáticas</p>
            </motion.div>

            {/* Ruka.ai */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-primary to-purple-600 p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 relative z-20"
            >
              <div className="flex items-center justify-center w-20 h-20 mb-6 mx-auto bg-white rounded-full p-2">
                <img 
                  src="/0webclip.jpg" 
                  alt="Ruka.ai Logo" 
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <h3 className="text-2xl font-bold text-center text-white mb-2">Ruka.ai</h3>
              <p className="text-white text-center">Análisis automático</p>
            </motion.div>

            {/* Facturador */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Tu Sistema</h3>
              <p className="text-gray-600 text-center">Integración directa</p>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <p className="text-gray-600">Automatizado</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <p className="text-gray-600">Monitoreo Continuo</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <p className="text-gray-600">Reducción de Errores</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DataFlowSection;
