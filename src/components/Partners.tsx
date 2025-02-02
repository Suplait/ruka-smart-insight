import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Partners() {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container">
        <h2 className="text-center text-2xl font-semibold mb-12">
          Respaldados por líderes globales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 flex items-center justify-center bg-white/50 backdrop-blur hover:scale-105 transition-transform duration-300 h-32">
              <img src="/microsoft-logo.svg" alt="Microsoft" className="h-12 object-contain" />
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 flex items-center justify-center bg-white/50 backdrop-blur hover:scale-105 transition-transform duration-300 h-32">
              <img src="/openai-logo.svg" alt="OpenAI" className="h-12 object-contain" />
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 flex items-center justify-center bg-white/50 backdrop-blur hover:scale-105 transition-transform duration-300 h-32">
              <img src="/500global-logo.svg" alt="500 Global" className="h-12 object-contain" />
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}