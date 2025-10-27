import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, CheckCircle, X } from "lucide-react";
import { useRef } from "react";
const beforePoints = ["Registro manual de compras", "Datos desactualizados", "Errores humanos frecuentes", "Alto costo en personal de back office", "Poco tiempo de monitoreo", "Conoce margen desfazado. Sin tiempo de reacción"];
const afterPoints = ["Registro y clasificación automática", "Datos precisos y al día", "Sin error humano", "Reducción de costos operativos", "Monitoreo 24/7 en tiempo real", "Margen diario con alertas inmediante ante anomalías"];
const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};
const itemVariants = {
  hidden: {
    x: -20,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};
const ArrowAnimation = () => <motion.svg width="160" height="80" viewBox="0 0 160 80" initial="hidden" animate="visible" className="w-24 h-12">
    <motion.path d="M10 40 C 50 40, 110 40, 150 40 M 130 20 C 140 30, 150 40, 130 60" stroke="#4D68EB" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" initial={{
    pathLength: 0,
    opacity: 0
  }} animate={{
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: 1,
        ease: "easeInOut"
      },
      opacity: {
        duration: 0.2
      }
    }
  }} />
  </motion.svg>;
export default function BeforeAfter() {
  const containerRef = useRef<HTMLElement>(null);
  const {
    scrollYProgress
  } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const titleY = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const orbOneY = useTransform(scrollYProgress, [0, 1], [40, -30]);
  const orbTwoY = useTransform(scrollYProgress, [0, 1], [-10, 25]);
  const orbThreeY = useTransform(scrollYProgress, [0, 1], [20, -40]);
  return <motion.section ref={containerRef} className="py-32 bg-gradient-to-b from-white via-[#f6f7fb] to-white relative overflow-hidden">
      {/* Subtle animated background pattern */}
      <motion.div className="absolute inset-0 opacity-[0.02] text-gray-500" style={{
      backgroundImage: `radial-gradient(circle at 50% 50%, currentColor 1px, transparent 1px)`,
      backgroundSize: "40px 40px",
      y: useTransform(scrollYProgress, [0, 1], [0, -50])
    }} />
      <motion.div className="absolute top-24 -left-10 w-32 h-32 bg-gradient-to-br from-sky-400/15 via-indigo-400/10 to-purple-500/10 rounded-full blur-3xl" animate={{
      x: [0, 25, -15, 0],
      y: [0, -30, -5, 0],
      scale: [1, 1.08, 1.02, 1]
    }} transition={{
      duration: 11,
      repeat: Infinity,
      ease: "easeInOut"
    }} style={{
      y: orbOneY
    }} />
      <motion.div className="absolute bottom-20 right-0 w-36 h-36 bg-gradient-to-br from-purple-400/15 via-pink-400/15 to-orange-400/20 rounded-full blur-3xl" animate={{
      x: [0, -20, 15, 0],
      y: [0, 25, -10, 0],
      scale: [1, 0.95, 1.07, 1]
    }} transition={{
      duration: 13,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1.5
    }} style={{
      y: orbTwoY
    }} />
      <motion.div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-emerald-400/15 via-teal-400/15 to-blue-400/15 rounded-full blur-2xl" animate={{
      x: [0, 18, -12, 0],
      y: [0, -15, 20, 0],
      scale: [1, 1.1, 0.94, 1]
    }} transition={{
      duration: 9,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0.8
    }} style={{
      y: orbThreeY
    }} />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
        <motion.div className="text-center mb-20 space-y-6" style={{
        y: titleY,
        opacity: titleOpacity
      }}>
          <motion.h2 className="text-4xl lg:text-6xl font-thin text-gray-900 tracking-tight" initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94]
        }} viewport={{
          once: true
        }}>
            Automatización que{" "}
            <motion.span className="font-light bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent" initial={{
            opacity: 0
          }} whileInView={{
            opacity: 1
          }} transition={{
            delay: 0.3,
            duration: 0.8
          }}>
              Transforma
            </motion.span>
          </motion.h2>
          <motion.p className="text-xl text-gray-600 font-light max-w-2xl mx-auto" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4,
          duration: 0.6
        }} viewport={{
          once: true
        }}>
            De procesos manuales a control total
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 relative">
          {/* Connecting line animation */}
          <motion.div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-px bg-gradient-to-r from-red-200 via-gray-300 to-primary/30 hidden lg:block" initial={{
          scaleX: 0,
          opacity: 0
        }} whileInView={{
          scaleX: 1,
          opacity: 1
        }} transition={{
          delay: 1,
          duration: 1.2,
          ease: "easeInOut"
        }} viewport={{
          once: true
        }} />
          
          {/* Antes - Apple style */}
          <motion.div initial={{
          opacity: 0,
          x: -60,
          rotateY: 15
        }} whileInView={{
          opacity: 1,
          x: 0,
          rotateY: 0,
          transition: {
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        }} viewport={{
          once: true,
          margin: "-20%"
        }} whileHover={{
          y: -10,
          rotateY: -5,
          transition: {
            duration: 0.3
          }
        }} className="relative perspective-1000">
            <motion.div className="p-10 bg-gray-50/50 rounded-3xl border border-gray-200/50 backdrop-blur-xl relative overflow-hidden" whileHover={{
            backgroundColor: "rgba(249, 250, 251, 0.8)",
            borderColor: "rgba(220, 38, 38, 0.15)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
          }} transition={{
            duration: 0.3
          }}>
              {/* Subtle hover pattern */}
              <motion.div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-red-50/20 opacity-0" whileHover={{
              opacity: 1
            }} transition={{
              duration: 0.3
            }} />
              
              <motion.div className="flex items-center gap-4 mb-8 relative z-10" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.2,
              duration: 0.5
            }}>
                <motion.div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center" whileHover={{
                scale: 1.1,
                rotate: -5,
                backgroundColor: "rgba(254, 226, 226, 0.8)"
              }} transition={{
                duration: 0.2
              }}>
                  <Clock className="w-6 h-6 text-red-600" />
                </motion.div>
                <h3 className="text-2xl font-light text-gray-900">Sin Ruka</h3>
              </motion.div>
              
              <motion.ul className="space-y-4 relative z-10" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
              once: true
            }}>
                {beforePoints.map((point, index) => <motion.li key={index} variants={itemVariants} className="flex items-start gap-4 group" whileHover={{
                x: 8
              }} transition={{
                duration: 0.2
              }}>
                    <motion.div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" whileHover={{
                  scale: 1.2,
                  rotate: 180,
                  backgroundColor: "rgba(254, 226, 226, 0.9)"
                }} transition={{
                  duration: 0.3
                }}>
                      <X className="w-3 h-3 text-red-600" />
                    </motion.div>
                    <p className="text-gray-700 font-light leading-relaxed group-hover:text-gray-900 transition-colors duration-200">
                      {point}
                    </p>
                  </motion.li>)}
              </motion.ul>
            </motion.div>
          </motion.div>

          {/* Con Ruka - Apple style */}
          <motion.div initial={{
          opacity: 0,
          x: 60,
          rotateY: -15
        }} whileInView={{
          opacity: 1,
          x: 0,
          rotateY: 0,
          transition: {
            duration: 0.8,
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        }} viewport={{
          once: true,
          margin: "-20%"
        }} whileHover={{
          y: -10,
          rotateY: 5,
          transition: {
            duration: 0.3
          }
        }} className="relative perspective-1000">
            <motion.div className="p-10 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-3xl border border-primary/20 backdrop-blur-xl relative overflow-hidden" whileHover={{
            backgroundColor: "rgba(59, 130, 246, 0.08)",
            borderColor: "rgba(59, 130, 246, 0.3)",
            boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
          }} transition={{
            duration: 0.3
          }}>
              {/* Subtle hover glow */}
              <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-primary/10 opacity-0" whileHover={{
              opacity: 1
            }} transition={{
              duration: 0.3
            }} />
              
              <motion.div className="flex items-center gap-4 mb-8 relative z-10" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.4,
              duration: 0.5
            }}>
                <motion.div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center" whileHover={{
                scale: 1.1,
                rotate: 5,
                backgroundColor: "rgba(59, 130, 246, 0.15)"
              }} transition={{
                duration: 0.2
              }}>
                  <CheckCircle className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="text-2xl font-light text-gray-900">Con Ruka</h3>
              </motion.div>
              
              <motion.ul className="space-y-4 relative z-10" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
              once: true
            }}>
                {afterPoints.map((point, index) => <motion.li key={index} variants={itemVariants} className="flex items-start gap-4 group" whileHover={{
                x: 8
              }} transition={{
                duration: 0.2
              }}>
                    <motion.div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" whileHover={{
                  scale: 1.2,
                  rotate: 360,
                  backgroundColor: "rgba(59, 130, 246, 0.2)"
                }} transition={{
                  duration: 0.5
                }}>
                      <CheckCircle className="w-3 h-3 text-primary" />
                    </motion.div>
                    <p className="text-gray-700 font-light leading-relaxed group-hover:text-gray-900 transition-colors duration-200">
                      {point}
                    </p>
                  </motion.li>)}
              </motion.ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>;
}