
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

export default function MoneyBackGuarantee() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const orbOneY = useTransform(scrollYProgress, [0, 1], [25, -15]);
  const orbTwoY = useTransform(scrollYProgress, [0, 1], [-20, 30]);
  const orbThreeY = useTransform(scrollYProgress, [0, 1], [15, -25]);
  
  return (
    <motion.section id="guarantee" ref={containerRef} className="py-32 bg-gradient-to-b from-white via-[#f7f9fc] to-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 right-[15%] h-36 w-36 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)] blur-2xl" />
        <div className="absolute bottom-0 left-1/2 h-40 w-full max-w-[90%] -translate-x-1/2 bg-gradient-to-t from-white via-white/70 to-transparent" />
        <motion.div
          className="absolute top-8 left-[18%] w-28 h-28 bg-gradient-to-br from-blue-400/15 via-indigo-400/10 to-purple-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, 18, -12, 0],
            y: [0, -22, -6, 0],
            scale: [1, 1.08, 1.01, 1]
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          style={{ y: orbOneY }}
        />
        <motion.div
          className="absolute bottom-16 right-[12%] w-32 h-32 bg-gradient-to-br from-emerald-400/15 via-teal-400/10 to-sky-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, -20, 14, 0],
            y: [0, 24, -18, 0],
            scale: [1, 0.95, 1.07, 1]
          }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ y: orbTwoY }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-20 h-20 bg-gradient-to-br from-pink-400/15 via-rose-400/15 to-orange-400/15 rounded-full blur-2xl"
          animate={{
            x: [0, 15, -10, 0],
            y: [0, -15, 18, 0],
            scale: [1, 1.1, 0.95, 1]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          style={{ y: orbThreeY }}
        />
      </div>
      <div className="max-w-3xl mx-auto px-6 sm:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-thin text-gray-900 tracking-tight">
            Garantía de devolución de{" "}
            <span className="font-light bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              30 días
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-light">
            Si no estás 100% satisfecho con Ruka.ai en los primeros 30 días, te devolvemos tu dinero sin hacer preguntas. Así de seguros estamos de que te encantará.
          </p>
          
          <Button 
            size="sm" 
            className="h-10 px-6 text-sm font-medium bg-primary hover:bg-primary/90 rounded-full gap-2 group"
            onClick={() => navigate('/register')}
          >
            Regístrate
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
