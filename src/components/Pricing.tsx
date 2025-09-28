import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, Users, Zap } from "lucide-react";

const sellingPoints = [
  "Digitación, clasificación y alertas en tiempo real",
  "Control de margen diario con insights accionables",
  "Onboarding asistido y soporte 24/7 por whatsapp",
];

const comparison = [
  {
    label: "Un humano haciendo todo esto",
    value: "+ $550.000 CLP / mes",
    icon: Users,
  },
  {
    label: "Ruka.ai haciendo todo esto",
    value: "Desde $40.990 CLP / mes",
    icon: Zap,
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const glowY = useTransform(scrollYProgress, [0, 1], [20, -40]);
  const gradientOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 0.55]);

  return (
    <motion.section
      id="pricing"
      ref={containerRef}
      className="relative py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10"
        style={{ opacity: gradientOpacity }}
      />
      <motion.div
        className="absolute -top-10 right-16 w-64 h-64 bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl"
        style={{ y: glowY }}
        animate={{
          scale: [1, 1.05, 0.95, 1],
          opacity: [0.8, 1, 0.7, 0.8],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-10 w-48 h-48 bg-gradient-to-tr from-purple-400/15 via-pink-400/15 to-orange-400/10 rounded-full blur-3xl"
        style={{ y: useTransform(scrollYProgress, [0, 1], [-30, 30]) }}
        animate={{
          scale: [1, 0.96, 1.04, 1],
          opacity: [0.7, 0.9, 0.6, 0.7],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.4 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/5 backdrop-blur-xl border border-gray-200/60 text-gray-700 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-primary" />
              Pricing transparente, sin letras chicas
            </div>
            <div className="space-y-5">
              <h2 className="text-4xl lg:text-6xl font-thin text-gray-900 leading-tight tracking-tight">
                Suma más manos a tu equipo a una fracción del costo 
              </h2>
              <p className="text-xl text-gray-600 font-light leading-relaxed">
                Ruka.ai digita, clasifica y vigila tus costos 24/7 para que tu equipo se enfoque en lo importante. Más control, menos carga.
              </p>
            </div>
            <div className="space-y-4">
              {sellingPoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-base lg:text-lg text-gray-700 font-light leading-relaxed">
                    {point}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {comparison.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    className="p-5 rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-lg shadow-sm"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.6 }}
                  >
                    <div className="flex items-center gap-3 text-gray-600">
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium tracking-wide uppercase">
                        {item.label}
                      </span>
                    </div>
                    <p className="mt-3 text-lg text-gray-900 font-light">
                      {item.value}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true, amount: 0.4 }}
            className="relative"
          >
            <motion.div
              className="absolute -inset-6 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent rounded-[38px] blur-2xl"
              animate={{ opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative p-10 rounded-[32px] border border-gray-200/60 bg-white/80 backdrop-blur-2xl shadow-xl shadow-primary/10 space-y-8">
              <div className="space-y-2">
                <p className="text-sm font-medium tracking-[0.3em] text-gray-500 uppercase">
                  Planes desde
                </p>
                <h3 className="text-5xl lg:text-6xl font-light text-gray-900 tracking-tight">
                  $40.990
                  <span className="text-lg text-gray-500 font-normal"> CLP / mes</span>
                </h3>
                <p className="text-sm text-primary font-medium">
                  Precio de lanzamiento. Cupos limitados.
                </p>
              </div>

              <div className="space-y-3">
                {["Implementación guiada y sin fricciones", "Alertas y reportes ilimitados", "Garantía total de 30 días"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-gray-700 font-light">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 space-y-4">
                <Button
                  size="sm"
                  className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-base font-medium flex items-center justify-center gap-2"
                  onClick={() => navigate("/register")}
                >
                  Regístrate ahora
                </Button>
                <p className="text-xs text-center text-gray-500 font-light">
                  Te acompañamos paso a paso hasta que tu agente esté produciendo ahorros tangibles.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
