
import { motion } from "framer-motion";
import { FileText, Layers, TrendingUp, AlertTriangle, CreditCard, Repeat } from "lucide-react";

const coreFeatures = [
  {
    icon: FileText,
    title: "Digita Facturas Automáticamente",
    description: "Procesa y extrae datos de facturas sin intervención manual",
    video: "public/robot_facturas.mp4"
  },
  {
    icon: Layers,
    title: "Categoriza y Clasifica",
    description: "Agrupa productos y crea maestros de insumos inteligentemente",
    video: "public/robot_cajas.mp4"
  },
  {
    icon: TrendingUp,
    title: "Monitorea en Tiempo Real",
    description: "Analiza gráficos y detecta tendencias de precios",
    video: "public/robot_grafico2.mp4"
  },
  {
    icon: AlertTriangle,
    title: "Alerta Instantánea",
    description: "Notifica anomalías y cambios críticos al momento",
    video: "public/robot_alerta.mp4"
  }
];

const addOns = [
  {
    icon: CreditCard,
    title: "Gestión de Cuentas por Cobrar",
    description: "Facilita pagos y genera nóminas bancarias",
    video: "public/robot_dinero.mp4"
  },
  {
    icon: Repeat,
    title: "Sincronización de Inventarios",
    description: "Actualiza precios en plataformas externas",
    video: "public/robot_inventario.mp4"
  }
];

export default function AgentShowcase() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white" />
      
      <div className="container relative">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">
            Así Funcionan Nuestros
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Agentes Inteligentes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cada agente trabaja 24/7 automatizando procesos específicos de tu negocio
          </p>
        </div>

        {/* Core Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-12">Funciones Principales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-white rounded-2xl shadow-lg p-6 h-full hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-gray-50">
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={feature.video} type="video/mp4" />
                    </video>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-lg">{feature.title}</h4>
                  </div>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Add-ons */}
        <div>
          <h3 className="text-2xl font-semibold text-center mb-12">Funciones Adicionales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {addOns.map((addon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-white rounded-2xl shadow-lg p-8 h-full hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="aspect-video mb-6 rounded-lg overflow-hidden bg-gray-50">
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={addon.video} type="video/mp4" />
                    </video>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                      <addon.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-xl">{addon.title}</h4>
                  </div>
                  <p className="text-muted-foreground">{addon.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
