import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Zap, Users, BarChart3, Rocket, ArrowRight, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ImplementationTimeline() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: "Onboarding & Configuración",
      duration: "1-2 semanas",
      description: "Conectamos tus sistemas existentes y configuramos los agentes según tu negocio",
      icon: Rocket,
      color: "from-blue-500 to-cyan-500",
      tasks: [
        "Análisis de sistemas actuales",
        "Configuración de integraciones",
        "Personalización de agentes",
        "Testing inicial"
      ],
      outcome: "Agentes configurados y listos para funcionar"
    },
    {
      id: 2,
      title: "Piloto & Optimización",
      duration: "2-3 semanas",
      description: "Ejecutamos un piloto controlado mientras optimizamos el rendimiento de los agentes",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
      tasks: [
        "Implementación piloto",
        "Monitoreo en tiempo real",
        "Ajustes de precisión",
        "Entrenamiento del equipo"
      ],
      outcome: "Sistema funcionando con 95% de precisión"
    },
    {
      id: 3,
      title: "Despliegue Completo",
      duration: "1 semana",
      description: "Activamos todos los agentes a escala completa con monitoreo 24/7",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      tasks: [
        "Activación completa",
        "Monitoreo automático",
        "Alertas inteligentes",
        "Soporte dedicado"
      ],
      outcome: "100% automatizado, eliminando carga manual"
    },
    {
      id: 4,
      title: "Optimización Continua",
      duration: "Permanente",
      description: "Los agentes aprenden continuamente de tu negocio para mejorar resultados",
      icon: BarChart3,
      color: "from-orange-500 to-red-500",
      tasks: [
        "Aprendizaje automático",
        "Optimización de procesos",
        "Reportes avanzados",
        "Mejoras mensuales"
      ],
      outcome: "Ahorro creciente mes a mes"
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-full border border-blue-500/20 mb-8">
            <Clock className="w-6 h-6 text-blue-600" />
            <span className="text-slate-700 font-medium">Timeline de Implementación</span>
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            De{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              0 a 100%
            </span>
            {" "}Automatizado
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Un proceso probado que te lleva de la carga manual total a la automatización completa en menos de 6 semanas
          </p>
        </motion.div>

        {/* Timeline Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-16"
        >
          <div className="inline-flex bg-white rounded-2xl p-2 shadow-xl border border-slate-200">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeStep === index
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Semana {index + 1}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Active Step Display */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <Card className="p-12 bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-3xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Step Info */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center shadow-lg`}>
                    {React.createElement(steps[activeStep].icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{steps[activeStep].duration}</p>
                    <h3 className="text-3xl font-bold text-slate-900">{steps[activeStep].title}</h3>
                  </div>
                </div>

                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  {steps[activeStep].description}
                </p>

                <div className="space-y-3 mb-8">
                  {steps[activeStep].tasks.map((task, index) => (
                    <motion.div
                      key={task}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-slate-700">{task}</span>
                    </motion.div>
                  ))}
                </div>

                <Card className={`p-6 bg-gradient-to-br ${steps[activeStep].color} text-white`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Resultado</p>
                      <p className="text-white/90">{steps[activeStep].outcome}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Visual Progress */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="relative w-48 h-48 mx-auto mb-6">
                    <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-200"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={`${((activeStep + 1) / steps.length) * 283} 283`}
                        initial={{ strokeDasharray: "0 283" }}
                        animate={{ strokeDasharray: `${((activeStep + 1) / steps.length) * 283} 283` }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-slate-900">{Math.round(((activeStep + 1) / steps.length) * 100)}%</p>
                        <p className="text-sm text-slate-600">Completado</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Preview */}
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                        index <= activeStep
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
                          : index === activeStep + 1
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                          : 'bg-slate-50 border border-slate-200'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        index <= activeStep
                          ? 'bg-green-500 text-white'
                          : index === activeStep + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-300 text-slate-600'
                      }`}>
                        {index <= activeStep ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{step.title}</p>
                        <p className="text-sm text-slate-600">{step.duration}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Button className="h-16 px-12 text-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group rounded-2xl">
            <Play className="w-6 h-6 mr-3" />
            Comenzar Implementación
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          <p className="text-slate-600 mt-4">Primeras 2 semanas gratis • Sin compromiso de permanencia</p>
        </motion.div>
      </div>
    </section>
  );
}