
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Clock4, UtensilsCrossed, CheckCircle2 } from "lucide-react";

export default function CTA() {
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

          <div className="space-y-6">
            <Button 
              size="lg" 
              className="gap-2 group hover:scale-105 transition-all duration-300"
              onClick={() => window.open('https://calendly.com/suplait_lorenzo/30min', '_blank')}
            >
              Agendar Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="flex items-center justify-center gap-8 pt-4">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-500">
                  <badge.icon className="w-4 h-4" />
                  <span className="text-sm">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
