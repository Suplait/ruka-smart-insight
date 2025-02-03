import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Partners() {
  return (
    <section className="py-12 bg-white">
      <div className="container max-w-4xl">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Respaldados por líderes globales en tecnología
        </p>
        <div className="flex justify-center items-center gap-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="h-12"
          >
            <img src="/microsoft2.png" alt="Microsoft" className="h-full object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="h-12"
          >
            <img src="/openai2.png" alt="OpenAI" className="h-full object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="h-12"
          >
            <img src="/500logo.png" alt="500 Global" className="h-full object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="h-12"
          >
            <img src="/logocorfo.png" alt="CORFO" className="h-full object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}