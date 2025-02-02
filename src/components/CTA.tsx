import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 hero-gradient">
      <div className="container text-center">
        <h2 className="text-3xl font-bold mb-6">
          ¿Listo para optimizar tus operaciones?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Únete a más de 100 empresas que ya están usando Ruka.ai para mejorar su eficiencia operativa
        </p>
        <Button size="lg" className="gap-2 hover:scale-105 transition-transform">
          Comienza Ahora <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  );
}