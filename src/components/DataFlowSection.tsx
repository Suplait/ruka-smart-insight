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
          {/* Líneas de conexión animadas - Desktop */}
          <div className="hidden md:block">
            <svg className="absolute top-1/2 left-0 w-full h-24 -translate-y-1/2" preserveAspectRatio="none">
              <defs>
                <linearGradient id="flow-gradient" x1="0" y1="0" x2="100%" y2="0">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
                
                {/* Patrón de flujo de datos */}
                <pattern id="flow-pattern" x="0" y="0" width="20" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="4" cy="4" r="3" fill="url(#flow-gradient)">
                    <animate
                      attributeName="opacity"
                      dur="1.5s"
                      values="0;0.2;0.4;0.6;0.8;1;0.8;0.6;0.4;0.2;0"
                      repeatCount="indefinite"
                    />
                  </circle>
                </pattern>

                {/* Flecha grande para el final */}
                <marker
                  id="flow-arrow"
                  viewBox="0 0 20 20"
                  refX="10"
                  refY="10"
                  markerWidth="10"
                  markerHeight="10"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 20 10 L 0 20 z" fill="url(#flow-gradient)" />
                </marker>
              </defs>

              {/* Línea base izquierda */}
              <path
                d="M0,12 H45%"
                stroke="url(#flow-gradient)"
                strokeWidth="6"
                fill="none"
                opacity="0.3"
              />

              {/* Línea base derecha */}
              <path
                d="M100%,12 H55%"
                stroke="url(#flow-gradient)"
                strokeWidth="6"
                fill="none"
                opacity="0.3"
              />

              {/* Línea animada izquierda */}
              <path
                d="M0,12 H45%"
                stroke="url(#flow-pattern)"
                strokeWidth="6"
                fill="none"
                markerEnd="url(#flow-arrow)"
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0,100%;100%,0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Línea animada derecha */}
              <path
                d="M100%,12 H55%"
                stroke="url(#flow-pattern)"
                strokeWidth="6"
                fill="none"
                markerEnd="url(#flow-arrow)"
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0,100%;100%,0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>

          {/* Líneas de conexión animadas - Mobile */}
          <div className="md:hidden absolute left-1/2 transform -translate-x-1/2 w-6 h-full">
            <svg className="h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="flow-gradient-vertical" x1="0" y1="0" x2="0" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
                
                {/* Patrón de flujo vertical */}
                <pattern id="flow-pattern-vertical" x="0" y="0" width="8" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="4" cy="4" r="3" fill="url(#flow-gradient-vertical)">
                    <animate
                      attributeName="opacity"
                      dur="1.5s"
                      values="0;0.2;0.4;0.6;0.8;1;0.8;0.6;0.4;0.2;0"
                      repeatCount="indefinite"
                    />
                  </circle>
                </pattern>

                {/* Flecha vertical */}
                <marker
                  id="flow-arrow-vertical"
                  viewBox="0 0 20 20"
                  refX="10"
                  refY="10"
                  markerWidth="10"
                  markerHeight="10"
                  orient="auto"
                >
                  <path d="M 0 0 L 20 10 L 0 20 z" fill="url(#flow-gradient-vertical)" />
                </marker>
              </defs>

              {/* Líneas base verticales */}
              <path
                d="M3,0 V45%"
                stroke="url(#flow-gradient-vertical)"
                strokeWidth="6"
                fill="none"
                opacity="0.3"
              />
              <path
                d="M3,100% V55%"
                stroke="url(#flow-gradient-vertical)"
                strokeWidth="6"
                fill="none"
                opacity="0.3"
              />

              {/* Líneas animadas verticales */}
              <path
                d="M3,0 V45%"
                stroke="url(#flow-pattern-vertical)"
                strokeWidth="6"
                fill="none"
                markerEnd="url(#flow-arrow-vertical)"
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0,100%;100%,0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M3,100% V55%"
                stroke="url(#flow-pattern-vertical)"
                strokeWidth="6"
                fill="none"
                markerEnd="url(#flow-arrow-vertical)"
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0,100%;100%,0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>

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