
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Partners() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const orbOneY = useTransform(scrollYProgress, [0, 1], [25, -15]);
  const orbTwoY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <motion.section ref={containerRef} className="py-16 bg-gray-50/30 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white via-primary/5 to-transparent"
        style={{ opacity: useTransform(scrollYProgress, [0, 1], [0.2, 0.45]) }}
      />
      <motion.div
        className="absolute top-4 left-8 w-24 h-24 bg-gradient-to-br from-blue-400/15 via-indigo-400/10 to-purple-400/15 rounded-full blur-2xl"
        animate={{
          x: [0, 20, -12, 0],
          y: [0, -18, -6, 0],
          scale: [1, 1.07, 1.01, 1]
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        style={{ y: orbOneY }}
      />
      <motion.div
        className="absolute bottom-4 right-10 w-28 h-28 bg-gradient-to-br from-emerald-400/15 via-teal-400/10 to-cyan-400/15 rounded-full blur-3xl"
        animate={{
          x: [0, -18, 12, 0],
          y: [0, 18, -14, 0],
          scale: [1, 0.95, 1.06, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ y: orbTwoY }}
      />
      <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10">
        <p className="text-center text-sm text-gray-600 font-light mb-8">
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
            <img src="/microsoft2.png" alt="Microsoft" className="h-full object-contain opacity-40 hover:opacity-70 transition-opacity duration-300" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="h-12"
          >
            <img src="/openai2.png" alt="OpenAI" className="h-full object-contain opacity-40 hover:opacity-70 transition-opacity duration-300" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="h-12"
          >
            <img src="/500logo.png" alt="500 Global" className="h-full object-contain opacity-40 hover:opacity-70 transition-opacity duration-300" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="h-12"
          >
            <img src="/logocorfo.png" alt="CORFO" className="h-full object-contain opacity-40 hover:opacity-70 transition-opacity duration-300" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
