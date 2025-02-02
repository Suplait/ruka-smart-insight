import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ValueShowcase() {
  const features = [
    {
      title: "Cero Digitación Manual",
      description: "Olvídate de ingresar datos manualmente. Nuestros agentes procesan automáticamente tus documentos 24/7.",
      link: "https://calendly.com/suplait_lorenzo/30min"
    },
    {
      title: "Clasificación Automática",
      description: "Documentos agrupados y clasificados automáticamente, manteniendo tu información ordenada y accesible.",
      link: "https://calendly.com/suplait_lorenzo/30min"
    },
    {
      title: "Integración Ultra Rápida",
      description: "La integración más rápida del mercado. En minutos estarás operando con Ruka.",
      link: "https://calendly.com/suplait_lorenzo/30min"
    },
    {
      title: "Conexión con Proveedores",
      description: "Si faltan datos o hay dudas, nuestros agentes se comunican directamente con tus proveedores por correo, entablando conversaciones para obtener la información necesaria.",
      link: "https://calendly.com/suplait_lorenzo/30min"
    },
    {
      title: "Datos Seguros",
      description: "Tu información protegida con los más altos estándares de seguridad y encriptación.",
      link: "https://calendly.com/suplait_lorenzo/30min"
    },
    {
      title: "Reportes Instantáneos",
      description: "Genera reportes personalizados en segundos. Lo que antes tomaba días, ahora toma segundos.",
      link: "https://calendly.com/suplait_lorenzo/30min"
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <motion.a
              key={index}
              href={feature.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-white/50 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
                <div className="flex items-center text-primary font-medium">
                  Agendar Demo
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}