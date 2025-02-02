import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 hero-gradient">
      <div className="container text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to optimize your business operations?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join over 100 companies already using Ruka.ai to improve their operational efficiency
        </p>
        <Button size="lg" className="gap-2">
          Get Started <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  );
}