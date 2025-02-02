import { motion } from "framer-motion";
import { Clock, CheckCircle, X, ArrowRight } from "lucide-react";

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
  "Automatización inteligente sin errores",
  "Alertas preventivas inmediatas",
  "Datos precisos y al día",
  "Control total del negocio"
];

export default function BeforeAfter() {
  return (
    <section className="py-24 bg-white">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-16">
          La diferencia con <span className="text-primary">Ruka.ai</span>
        </h2>
        
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <ArrowRight className="w-12 h-12 text-primary" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Antes */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-red-50 rounded-2xl transform -rotate-2" />
              <div className="relative p-8 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <Clock className="w-8 h-8 text-red-500" />
                  <h3 className="text-2xl font-semibold">Antes</h3>
                </div>
                <ul className="space-y-4">
                  {beforePoints.map((point, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                    >
                      <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                      <p>{point}</p>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Después */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-green-50 rounded-2xl transform rotate-2" />
              <div className="relative p-8 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <h3 className="text-2xl font-semibold">Con Ruka</h3>
                </div>
                <ul className="space-y-4">
                  {afterPoints.map((point, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <p>{point}</p>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}