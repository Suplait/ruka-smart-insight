import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function CTA() {
  const benefits = [
    "Elimina por completo la digitación manual de documentos",
    "Detecta variaciones de precios en tiempo real",
    "Monitorea tus precios en modo automático",
    "Mantén el control total de tu margen operativo"
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/30 to-primary/5" />
      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
            ¿List@ para tomar el control de tu margen operativo?
          </h2>
          <p className="text-xl text-muted-foreground">
            Únete a las empresas que ya eliminaron la digitación manual y tienen visibilidad total de sus operaciones con Ruka.ai
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2 className="text-primary flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="gap-2 group hover:scale-105 transition-all duration-300"
              onClick={() => window.open('https://calendly.com/suplait_lorenzo/30min', '_blank')}
            >
              Solicitar Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
