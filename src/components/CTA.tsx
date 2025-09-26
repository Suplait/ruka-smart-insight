
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Clock4, UtensilsCrossed, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();
  
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
    <section className="py-32 bg-gray-50/50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 relative">
        <div className="text-center space-y-8">
          <h2 className="text-4xl lg:text-6xl font-thin text-gray-900 tracking-tight">
            ¿List@ para tomar el{" "}
            <span className="font-light bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              control
            </span>{" "}
            de tu margen operativo?
          </h2>
          <p className="text-xl text-gray-600 font-light">
            Únete a las empresas que ya eliminaron la digitación manual y tienen visibilidad total de sus operaciones con Ruka.ai
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="text-primary flex-shrink-0 w-5 h-5" />
                <span className="text-gray-700 font-light">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <Button 
              size="sm" 
              className="h-10 px-6 text-sm font-medium bg-primary hover:bg-primary/90 rounded-full gap-2 group"
              onClick={() => navigate('/register')}
            >
              Regístrate
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="flex items-center justify-center gap-8 pt-4">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-500">
                  <badge.icon className="w-4 h-4" />
                  <span className="text-sm font-light">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
