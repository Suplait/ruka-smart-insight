import { motion } from "framer-motion";
import { Clock, CheckCircle, X } from "lucide-react";

const beforePoints = [
  "Proceso manual que toma 1 mes",
  "Alto costo en personal de back office",
  "Errores humanos frecuentes",
  "Sin tiempo para reaccionar a problemas",
  "Datos desactualizados",
  "Sin visibilidad del negocio"
];

const afterPoints = [
  "Actualización en tiempo real",
  "Reducción de costos operativos",
  "Agentes con IA sin errores",
  "Alertas preventivas inmediatas",
  "Datos precisos y al día",
  "Control total del negocio"
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
    <section className="py-24 bg-white">
      <div className="container px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-center mb-16">
          La diferencia con <span className="text-primary">Ruka.ai</span>
        </h2>
        
        <div className="relative">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <ArrowAnimation />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Antes */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative group"
            >
              <motion.div 
                initial={{ rotate: -2 }}
                whileHover={{ rotate: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-red-50 rounded-2xl"
              />
              <div className="relative p-8 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <Clock className="w-8 h-8 text-red-500" />
                  <h3 className="text-2xl font-semibold">Antes</h3>
                </div>
                <motion.ul className="space-y-4" variants={containerVariants}>
                  {beforePoints.map((point, index) => (
                    <motion.li
                      key={index}
                      variants={itemVariants}
                      className="flex items-start gap-3 group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                      </motion.div>
                      <p className="group-hover:text-red-700 transition-colors">{point}</p>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.div>

            {/* Después */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative group"
            >
              <motion.div 
                initial={{ rotate: 2 }}
                whileHover={{ rotate: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-green-50 rounded-2xl"
              />
              <div className="relative p-8 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <h3 className="text-2xl font-semibold">Con Ruka</h3>
                </div>
                <motion.ul className="space-y-4" variants={containerVariants}>
                  {afterPoints.map((point, index) => (
                    <motion.li
                      key={index}
                      variants={itemVariants}
                      className="flex items-start gap-3 group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      </motion.div>
                      <p className="group-hover:text-green-700 transition-colors">{point}</p>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
