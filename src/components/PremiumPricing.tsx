import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Shield, Crown, ArrowRight, Sparkles, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PremiumPricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const features = [
    { text: "Eliminación total de carga manual", highlight: true },
    { text: "Ahorro hasta 3% en materia prima mensual", highlight: true },
    { text: "Agentes IA trabajando 24/7", highlight: false },
    { text: "Detección automática de anomalías", highlight: false },
    { text: "Reportes en tiempo real", highlight: false },
    { text: "Integración con sistemas existentes", highlight: false },
    { text: "Soporte técnico dedicado", highlight: false },
    { text: "Actualizaciones automáticas", highlight: false },
    { text: "Garantía de satisfacción 30 días", highlight: false }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "ROI Inmediato",
      description: "Recupera tu inversión en menos de 2 meses",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Clock,
      title: "Tiempo Liberado",
      description: "160+ horas mensuales para actividades estratégicas",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Precisión Garantizada",
      description: "99.7% de precisión en procesamiento de datos",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const basePrice = 1.5 * 35000; // 1.5 UF approximately
  const monthlyPrice = basePrice;
  const annualPrice = basePrice * 12 * 0.85; // 15% discount

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-500/5 to-transparent rounded-full" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-8">
            <Crown className="w-6 h-6 text-purple-400" />
            <span className="text-white font-medium">Pricing Premium</span>
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Inversión que se{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Paga Sola
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Desde 1.5 UF mensual. Elimina la carga manual, ahorra en materia prima y recupera tu inversión en menos de 60 días
          </p>
        </motion.div>

        {/* Pricing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-16"
        >
          <div className="inline-flex bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                !isAnnual
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'text-white hover:text-slate-200'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 relative ${
                isAnnual
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'text-white hover:text-slate-200'
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-400 text-xs font-bold px-2 py-1 rounded-full text-white">
                -15%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Main Pricing Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="p-10 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Plan Completo</h3>
                    <p className="text-purple-300">Todo incluido</p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">
                      {isAnnual ? formatCurrency(annualPrice / 12) : formatCurrency(monthlyPrice)}
                    </span>
                    <span className="text-white/70">/mes</span>
                  </div>
                  {isAnnual && (
                    <p className="text-green-400 font-medium mt-2">
                      Ahorras {formatCurrency(monthlyPrice * 12 - annualPrice)} al año
                    </p>
                  )}
                  <p className="text-white/60 text-sm mt-2">+ IVA • Sin permanencia</p>
                </div>

                <div className="space-y-4 mb-10">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                      className={`flex items-center gap-3 ${
                        feature.highlight ? 'p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30' : ''
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        feature.highlight
                          ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                          : 'bg-green-500'
                      }`}>
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className={`${feature.highlight ? 'text-white font-medium' : 'text-white/90'}`}>
                        {feature.text}
                      </span>
                      {feature.highlight && (
                        <Zap className="w-4 h-4 text-purple-400 ml-auto" />
                      )}
                    </motion.div>
                  ))}
                </div>

                <Button className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group rounded-2xl">
                  Comenzar Ahora
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>

                <p className="text-center text-white/60 text-sm mt-4">
                  30 días de garantía • Cancelación sin penalización
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="text-center lg:text-left mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">¿Por qué Elegir Nuestro Plan?</h3>
              <p className="text-white/70 text-lg">
                Más que un software, es tu socio estratégico para la optimización total
              </p>
            </div>

            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Card className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 group rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{benefit.title}</h4>
                      <p className="text-white/70 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* ROI Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <Card className="p-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-500/30 rounded-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Retorno Garantizado</h4>
                  <p className="text-white/90 text-lg mb-4">
                    En promedio, nuestros clientes ahorran <span className="font-bold text-green-400">$2.5M mensuales</span> en costos operativos
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-white/90 font-medium">Garantía de satisfacción 30 días</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-20"
        >
          <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-3xl">
            <h3 className="text-3xl font-bold text-white mb-4">¿Listo para Transformar tu Negocio?</h3>
            <p className="text-white/70 text-lg mb-8">
              Únete a más de 500+ empresas que ya eliminaron la carga manual y optimizaron sus costos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="h-14 px-8 text-lg font-semibold bg-white text-slate-900 hover:bg-slate-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl">
                Agendar Demo Gratis
              </Button>
              <Button variant="outline" className="h-14 px-8 text-lg font-semibold bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300 rounded-xl">
                Hablar con Experto
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}