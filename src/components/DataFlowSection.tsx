
import { motion, useScroll, useTransform } from "framer-motion";
import { FileText } from "lucide-react";
import { useRef } from "react";

const DataFlowSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const orbOneY = useTransform(scrollYProgress, [0, 1], [35, -25]);
  const orbTwoY = useTransform(scrollYProgress, [0, 1], [-20, 30]);
  const orbThreeY = useTransform(scrollYProgress, [0, 1], [10, -40]);

  return (
    <motion.section ref={containerRef} className="py-32 bg-[#f6f7fb] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 h-56 w-full -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.08),transparent_65%)] blur-2xl" />
        <div className="absolute bottom-0 left-[12%] h-40 w-40 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_70%)] blur-2xl" />
        <motion.div
          className="absolute top-16 right-[15%] w-28 h-28 bg-gradient-to-br from-blue-400/15 via-sky-400/10 to-purple-400/15 rounded-full blur-2xl"
          animate={{
            x: [0, -20, 15, 0],
            y: [0, -25, 10, 0],
            scale: [1, 1.06, 0.98, 1]
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          style={{ y: orbOneY }}
        />
        <motion.div
          className="absolute bottom-16 left-[18%] w-32 h-32 bg-gradient-to-br from-emerald-400/15 via-teal-400/10 to-sky-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, 18, -12, 0],
            y: [0, 22, -18, 0],
            scale: [1, 1.1, 0.94, 1]
          }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          style={{ y: orbTwoY }}
        />
        <motion.div
          className="absolute top-1/2 right-[30%] w-24 h-24 bg-gradient-to-br from-pink-400/15 via-rose-400/15 to-orange-400/15 rounded-full blur-2xl"
          animate={{
            x: [0, 12, -18, 0],
            y: [0, -18, 12, 0],
            scale: [1, 1.08, 0.96, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          style={{ y: orbThreeY }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-4xl lg:text-6xl font-thin text-gray-900 tracking-tight">
            Conexión{" "}
            <span className="font-light bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              Simple y Rápida
            </span>
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Traemos tus datos de compras y ventas en minutos
          </p>
        </div>

        <div className="relative mt-20">
          {/* Desktop Flow Lines */}
          <div className="hidden md:block">
            {/* Left Flow Line */}
            <div className="absolute top-1/2 left-[calc(33%+2rem)] w-[calc(33%-4rem)] h-2 -translate-y-1/2">
              <div className="relative w-full h-full">
                {/* Base dashed line */}
                <div className="absolute inset-0 border-t-4 border-dashed border-primary/30" />
                
                {/* Animated dots */}
                <div className="absolute inset-0 flex gap-8 animate-flow-right overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className="h-4 w-4 rounded-full bg-gradient-to-r from-primary to-purple-600 -translate-y-1 shadow-lg shadow-primary/20"
                    />
                  ))}
                </div>
                
                {/* Arrow head */}
                <div className="absolute right-0 -translate-y-1/2 top-1/2">
                  <div className="w-4 h-4 rotate-45 border-t-4 border-r-4 border-primary transform translate-x-1/2" />
                </div>
              </div>
            </div>

            {/* Right Flow Line */}
            <div className="absolute top-1/2 right-[calc(33%+2rem)] w-[calc(33%-4rem)] h-2 -translate-y-1/2">
              <div className="relative w-full h-full">
                {/* Base dashed line */}
                <div className="absolute inset-0 border-t-4 border-dashed border-primary/30" />
                
                {/* Animated dots */}
                <div className="absolute inset-0 flex gap-8 animate-flow-left overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className="h-4 w-4 rounded-full bg-gradient-to-r from-primary to-purple-600 -translate-y-1 shadow-lg shadow-primary/20"
                    />
                  ))}
                </div>
                
                {/* Arrow head */}
                <div className="absolute left-0 -translate-y-1/2 top-1/2">
                  <div className="w-4 h-4 rotate-45 border-b-4 border-l-4 border-primary transform -translate-x-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Flow Lines */}
          <div className="md:hidden absolute left-1/2 h-full -translate-x-[2px]">
            {/* Top Flow Line */}
            <div className="absolute top-[calc(33%+2rem)] h-[calc(33%-4rem)] w-2">
              <div className="relative w-full h-full">
                {/* Base dashed line */}
                <div className="absolute inset-0 border-l-4 border-dashed border-primary/30" />
                
                {/* Animated dots */}
                <div className="absolute inset-0 flex flex-col gap-8 animate-flow-down overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-4 h-4 rounded-full bg-gradient-to-b from-primary to-purple-600 -translate-x-1 shadow-lg shadow-primary/20"
                    />
                  ))}
                </div>
                
                {/* Arrow head */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  <div className="w-4 h-4 rotate-45 border-r-4 border-b-4 border-primary transform translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Bottom Flow Line */}
            <div className="absolute bottom-[calc(33%+2rem)] h-[calc(33%-4rem)] w-2">
              <div className="relative w-full h-full">
                {/* Base dashed line */}
                <div className="absolute inset-0 border-l-4 border-dashed border-primary/30" />
                
                {/* Animated dots */}
                <div className="absolute inset-0 flex flex-col gap-8 animate-flow-up overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-4 h-4 rounded-full bg-gradient-to-b from-primary to-purple-600 -translate-x-1 shadow-lg shadow-primary/20"
                    />
                  ))}
                </div>
                
                {/* Arrow head */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2">
                  <div className="w-4 h-4 rotate-45 border-l-4 border-t-4 border-primary transform -translate-y-1/2" />
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
              className="relative group p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-gray-200/50 hover:bg-white/80 transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-6 mx-auto">
                <img 
                  src="/logosii.png" 
                  alt="SII Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-medium text-center text-gray-900 mb-4">Impuestos Internos</h3>
              <p className="text-gray-600 text-center font-light leading-relaxed">Desde el SII nos traemos la carátula de todas tus facturas</p>
            </motion.div>

            {/* Ruka.ai */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative group p-10 rounded-3xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 backdrop-blur-xl hover:scale-[1.02] transition-all duration-500"
            >
              <div className="flex items-center justify-center w-20 h-20 mb-6 mx-auto bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
                <img 
                  src="/0webclip.jpg" 
                  alt="Ruka.ai Logo" 
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <h3 className="text-2xl font-light text-center text-gray-900 mb-4">Ruka.ai</h3>
              <p className="text-gray-700 text-center font-light leading-relaxed">Le brindamos inteligencia a tu operación</p>
            </motion.div>

            {/* Facturador */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative group p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-gray-200/50 hover:bg-white/80 transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6 mx-auto">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium text-center text-gray-900 mb-4">Tu Facturador</h3>
              <p className="text-gray-600 text-center font-light leading-relaxed">Desde tu facturador (cualquiera), traemos el detalle de los items transaccionados</p>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center space-y-3"
          >
            <div className="text-4xl font-light text-primary tracking-tight">100%</div>
            <p className="text-gray-600 font-light">Automatizado</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center space-y-3"
          >
            <div className="text-4xl font-light text-primary tracking-tight">24/7</div>
            <p className="text-gray-600 font-light">Monitoreo Continuo</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="text-center space-y-3"
          >
            <div className="text-4xl font-light text-primary tracking-tight">98%</div>
            <p className="text-gray-600 font-light">Reducción de Errores</p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default DataFlowSection;
