
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Clock4, UtensilsCrossed, CheckCircle2 } from "lucide-react";

export default function CTA() {
  const benefits = [
    "Completely eliminate manual document entry",
    "Detect price variations in real time",
    "Monitor your prices automatically",
    "Maintain complete control of your operating margin"
  ];

  const trustBadges = [
    {
      icon: ShieldCheck,
      text: "30-day guarantee"
    },
    {
      icon: Clock4,
      text: "24/7 Support"
    },
    {
      icon: UtensilsCrossed,
      text: "100% refund"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/30 to-primary/5" />
      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
            Ready to take control of your operating margin?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join the companies that have already eliminated manual data entry and have total visibility of their operations with Ruka.ai
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
              Schedule Demo
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
