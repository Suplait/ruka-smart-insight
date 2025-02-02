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
          <br />
          <span className="text-xl md:text-2xl text-gray-600 mt-4 block">
            Tus datos sincronizados en minutos, no en semanas
          </span>
        </h2>

        <div className="relative mt-20">
          {/* Líneas de conexión SVG con gradiente */}
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
              className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow relative"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-6 mx-auto">
                <img 
                  src="/sii-logo.png" 
                  alt="SII Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">Impuestos Internos</h3>
              <p className="text-gray-600 text-center">Conexión directa con el SII para obtener los datos en tiempo real</p>

              {/* Flecha animada hacia Ruka */}
              <motion.div
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: 20, opacity: 1 }}
                transition={{
                  x: {
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  },
                  opacity: { duration: 0.5 }
                }}
                className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="#4D68EB"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.div>

            {/* Ruka.ai */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-primary/90 to-purple-600/90 p-8 rounded-xl shadow-xl hover:shadow-2xl transition-shadow transform hover:-translate-y-1 relative"
            >
              <div className="flex items-center justify-center w-20 h-20 mb-6 mx-auto">
                <img 
                  src="/ruka-logo.png" 
                  alt="Ruka.ai Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-center text-white mb-4">Ruka.ai</h3>
              <p className="text-white/90 text-center">Procesamiento inteligente y automatizado de todos tus compras y ventas</p>
              
              {/* Efecto de pulso */}
              <div className="absolute inset-0 rounded-xl">
                <div className="absolute inset-0 rounded-xl bg-primary animate-ping opacity-20" />
              </div>
            </motion.div>

            {/* Facturador */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow relative"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">Tu Facturador</h3>
              <p className="text-gray-600 text-center">Integración perfecta con tu sistema de facturación actual</p>

              {/* Flecha animada hacia Ruka */}
              <motion.div
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: -20, opacity: 1 }}
                transition={{
                  x: {
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  },
                  opacity: { duration: 0.5 }
                }}
                className="absolute -left-4 top-1/2 transform -translate-y-1/2 hidden md:block"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 12H5M5 12L12 5M5 12L12 19"
                    stroke="#4D68EB"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
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