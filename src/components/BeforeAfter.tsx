import { motion } from "framer-motion";
import { Clock, CheckCircle, X } from "lucide-react";

const beforePoints = [
  "Registro manual de compras",
  "Datos desactualizados",
  "Errores humanos frecuentes",
  "Alto costo en personal de back office",
  "Poco tiempo de monitoreo",
  "Conoce margen desfazado. Sin tiempo de reacción",  
];

const afterPoints = [
  "Registro y clasificación automática",
  "Datos precisos y al día",
  "Sin error humano",
  "Reducción de costos operativos",
  "Monitoreo 24/7 en tiempo real",
  "Margen diario con alertas inmediante ante anomalías"
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const ArrowAnimation = () => (
  <motion.svg
    width="160"
    height="80"
    viewBox="0 0 160 80"
    initial="hidden"
    animate="visible"
    className="w-24 h-12"
  >
    <motion.path
      d="M10 40 C 50 40, 110 40, 150 40 M 130 20 C 140 30, 150 40, 130 60"
      stroke="#4D68EB"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { duration: 1, ease: "easeInOut" },
          opacity: { duration: 0.2 }
        }
      }}
    />
  </motion.svg>
);

export default function BeforeAfter() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-4xl lg:text-6xl font-thin text-gray-900 tracking-tight">
            Automatización que{" "}
            <span className="font-light bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              Transforma
            </span>
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            De procesos manuales a control total
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 relative">
          {/* Dramatic connecting line animation */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden lg:block"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.5 }}
            viewport={{ once: true }}
          >
            <div className="w-32 h-1 bg-gradient-to-r from-red-400 via-primary to-green-400 rounded-full"></div>
            <motion.div
              className="absolute -right-2 -top-1 w-3 h-3 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Antes - Apple style with dramatic 3D effect */}
          <motion.div
            initial={{ 
              opacity: 0, 
              x: -150, 
              rotateY: -25,
              scale: 0.8
            }}
            whileInView={{ 
              opacity: 1, 
              x: 0, 
              rotateY: 0,
              scale: 1
            }}
            transition={{ 
              duration: 1.4, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.3
            }}
            whileHover={{
              rotateY: -5,
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div 
              className="p-10 bg-gradient-to-br from-red-50/80 via-red-25/50 to-gray-50/80 rounded-3xl border border-red-200/50 backdrop-blur-xl relative overflow-hidden"
              whileHover={{
                boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.25)"
              }}
            >
              {/* Animated background pattern */}
              <motion.div
                className="absolute inset-0 opacity-5"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                  backgroundImage: "repeating-linear-gradient(45deg, #ef4444 0px, transparent 2px, transparent 10px, #ef4444 12px)",
                  backgroundSize: "20px 20px"
                }}
              />
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <motion.div 
                  className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center"
                  animate={{
                    rotate: [0, -10, 10, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Clock className="w-6 h-6 text-red-600" />
                </motion.div>
                <h3 className="text-2xl font-light text-gray-900">Antes</h3>
              </div>
              
              <motion.ul className="space-y-4 relative z-10" variants={containerVariants}>
                {beforePoints.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -30, rotateX: -15 }}
                    whileInView={{ opacity: 1, x: 0, rotateX: 0 }}
                    transition={{ 
                      duration: 0.8,
                      delay: 1.0 + (index * 0.15),
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{
                      x: 5,
                      transition: { duration: 0.2 }
                    }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 group"
                  >
                    <motion.div 
                      className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-3 h-3 text-red-600" />
                    </motion.div>
                    <p className="text-gray-700 font-light leading-relaxed">{point}</p>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>

          {/* Con Ruka - Apple style */}
          <motion.div
            initial={{ opacity: 0, x: 100, rotateY: 15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ 
              duration: 1.2, 
              ease: [0.25, 0.25, 0, 1],
              delay: 0.4
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="p-10 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-3xl border border-primary/20 backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-light text-gray-900">Con Ruka</h3>
              </div>
              
              <motion.ul className="space-y-4" variants={containerVariants}>
                {afterPoints.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.6,
                      delay: 1.0 + (index * 0.1),
                      ease: [0.25, 0.25, 0, 1]
                    }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-primary" />
                    </div>
                    <p className="text-gray-700 font-light leading-relaxed">{point}</p>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}