
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Clock4, UtensilsCrossed, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function CTA() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const orbOneY = useTransform(scrollYProgress, [0, 1], [25, -15]);
  const orbTwoY = useTransform(scrollYProgress, [0, 1], [-20, 25]);
  const orbThreeY = useTransform(scrollYProgress, [0, 1], [15, -30]);
  
  const benefits = [
    "Elimina por completo la digitación manual de documentos",
    "Detecta variaciones de precios en tiempo real",
    "Monitorea tus precios en modo automático",
    "Mantén el control total de tu margen operativo"
  ];

  const trustBadges = [
    {
      icon: ShieldCheck,
      text: "Garantía 30 días"
    },
    {
      icon: Clock4,
      text: "Soporte 24/7"
    },
    {
      icon: UtensilsCrossed,
      text: "100% devolución"
    }
  ];

  return (
    <motion.section ref={containerRef} className="py-32 bg-gray-50/50 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white via-primary/5 to-transparent"
        style={{ opacity: useTransform(scrollYProgress, [0, 1], [0.2, 0.45]) }}
      />
      <motion.div
        className="absolute top-8 left-6 w-28 h-28 bg-gradient-to-br from-blue-400/15 via-indigo-400/10 to-purple-400/15 rounded-full blur-3xl"
        animate={{
          x: [0, 20, -12, 0],
          y: [0, -24, -6, 0],
          scale: [1, 1.08, 1.01, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ y: orbOneY }}
      />
      <motion.div
        className="absolute bottom-12 right-10 w-32 h-32 bg-gradient-to-br from-emerald-400/15 via-teal-400/10 to-sky-400/15 rounded-full blur-3xl"
        animate={{
          x: [0, -20, 12, 0],
          y: [0, 24, -18, 0],
          scale: [1, 0.95, 1.07, 1]
        }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ y: orbTwoY }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-20 h-20 bg-gradient-to-br from-pink-400/15 via-rose-400/15 to-orange-400/15 rounded-full blur-2xl"
        animate={{
          x: [0, 16, -10, 0],
          y: [0, -18, 15, 0],
          scale: [1, 1.09, 0.96, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        style={{ y: orbThreeY }}
      />
      <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center space-y-8">
          <h2 className="text-4xl lg:text-6xl font-thin text-gray-900 tracking-tight">
            ¿List@ para tomar el{" "}
            <span className="font-light bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              control
            </span>{" "}
            de tu margen operativo?
          </h2>
          <p className="text-xl text-gray-600 font-light">
            Únete a las empresas que ya eliminaron la digitación manual y tienen visibilidad total de sus operaciones con Ruka.ai
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="text-primary flex-shrink-0 w-5 h-5" />
                <span className="text-gray-700 font-light">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <Button 
              size="sm" 
              className="h-10 px-6 text-sm font-medium bg-primary hover:bg-primary/90 rounded-full gap-2 group"
              onClick={() => navigate('/register')}
            >
              Regístrate
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="flex items-center justify-center gap-8 pt-4">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-500">
                  <badge.icon className="w-4 h-4" />
                  <span className="text-sm font-light">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
