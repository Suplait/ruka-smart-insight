import { Bot, FileText, LineChart, Clock, Users, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ValueProposition() {
  const values = [
    {
      icon: Bot,
      title: "Cero Digitación Manual",
      description: "Olvídate de ingresar datos manualmente. Nuestros agentes procesan automáticamente tus documentos 24/7."
    },
    {
      icon: FileText,
      title: "Clasificación Automática",
      description: "Cada documento se agrupa y clasifica automáticamente, manteniendo tu información ordenada y accesible."
    },
    {
      icon: LineChart,
      title: "Visión Completa del Negocio",
      description: "Accede a tu insumo maestro en tiempo real. Visualiza compras, ventas y márgenes al instante."
    },
    {
      icon: Clock,
      title: "Reportes en Segundos",
      description: "Genera reportes personalizados instantáneamente. Lo que antes tomaba días, ahora toma segundos."
    },
    {
      icon: Users,
      title: "Integración con Proveedores",
      description: "Conectamos directamente con tus proveedores para obtener datos actualizados automáticamente."
    },
    {
      icon: Zap,
      title: "Implementación Ultra Rápida",
      description: "En minutos estarás operando con Ruka. La integración más rápida del mercado."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-secondary/30 to-white" />
      <div className="container relative">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
            Automatización que Entiende tu Negocio
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Diseñado específicamente para resolver los dolores diarios de empresas medianas como la tuya
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card 
              key={index} 
              className="p-6 bg-white/50 backdrop-blur hover:scale-105 transition-all duration-300 border-primary/10 group"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <value.icon className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}