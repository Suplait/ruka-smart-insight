import { motion } from "framer-motion";
import { Database, Server, FileText, ArrowRight } from "lucide-react";

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
          <br />
          <span className="text-xl md:text-2xl text-gray-600 mt-4 block">
            Tus datos sincronizados en minutos, no en semanas
          </span>
        </h2>

        <div className="relative mt-20">
          {/* Línea de conexión SVG */}
          <svg className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2" preserveAspectRatio="none">
            <motion.path
              d="M0,0 C200,0 800,0 1000,0"
              stroke="url(#gradient-line)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="gradient-line" x1="0" y1="0" x2="100%" y2="0">
                <stop offset="0%" stopColor="#4D68EB" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* SII */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto">
                <Database className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">Impuestos Internos</h3>
              <p className="text-gray-600 text-center">Conexión directa con el SII para obtener los en tiempo real</p>
            </motion.div>

            {/* Ruka.ai */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-primary/90 to-purple-600/90 p-8 rounded-xl shadow-xl hover:shadow-2xl transition-shadow transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur rounded-full mb-6 mx-auto">
                <Server className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-center text-white mb-4">Ruka.ai</h3>
              <p className="text-white/90 text-center">Procesamiento inteligente y automatizado de todos tus compras y ventas</p>
              
              {/* Animación de pulso */}
              <div className="absolute inset-0 rounded-xl">
                <div className="absolute inset-0 rounded-xl bg-primary animate-ping opacity-20" />
              </div>
            </motion.div>

            {/* Facturador */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">Tu Facturador</h3>
              <p className="text-gray-600 text-center">Integración perfecta con tu sistema de facturación actual</p>
            </motion.div>
          </div>

          {/* Flechas de flujo de datos */}
          <div className="hidden md:block">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute top-1/2 left-[28%] transform -translate-y-1/2"
            >
              <ArrowRight className="w-8 h-8 text-primary" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute top-1/2 right-[28%] transform -translate-y-1/2"
            >
              <ArrowRight className="w-8 h-8 text-primary" />
            </motion.div>
          </div>
        </div>

        {/* Indicadores de beneficios */}
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
            <div className="text-4xl font-bold text-primary mb-2">-80%</div>
            <p className="text-gray-600">Reducción de Errores</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DataFlowSection;