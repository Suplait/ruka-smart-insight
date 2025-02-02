import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, BarChart2, Zap, Users, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Cero Digitación Manual",
    description: "Olvídate de ingresar datos manualmente. Nuestros agentes procesan automáticamente tus documentos 24/7.",
    icon: FileText,
    color: "bg-purple-100 text-purple-600"
  },
  {
    title: "Clasificación Automática",
    description: "Documentos agrupados y clasificados automáticamente, manteniendo tu información ordenada y accesible.",
    icon: BarChart2,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Integración Ultra Rápida",
    description: "La integración más rápida del mercado. En minutos estarás operando con Ruka.",
    icon: Zap,
    color: "bg-yellow-100 text-yellow-600"
  },
  {
    title: "Conexión con Proveedores",
    description: "Conectamos directamente con tus proveedores para obtener datos actualizados automáticamente.",
    icon: Users,
    color: "bg-green-100 text-green-600"
  },
  {
    title: "Datos Seguros",
    description: "Tu información protegida con los más altos estándares de seguridad y encriptación.",
    icon: Shield,
    color: "bg-red-100 text-red-600"
  },
  {
    title: "Reportes Instantáneos",
    description: "Genera reportes personalizados en segundos. Lo que antes tomaba días, ahora toma segundos.",
    icon: Clock,
    color: "bg-indigo-100 text-indigo-600"
  }
];

export default function ValueHighlights() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/30 to-white" />
      
      <div className="container relative">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">
            Automatización Inteligente que
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Entiende tu Negocio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Diseñado específicamente para resolver los desafíos diarios de empresas como la tuya
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white rounded-2xl shadow-lg transform transition-transform group-hover:scale-105 duration-300" />
              <div className="relative p-8 space-y-4">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                <Button variant="ghost" className="group/button">
                  Saber más
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/button:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}