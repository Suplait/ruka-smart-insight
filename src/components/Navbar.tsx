import { Button } from "@/components/ui/button";
import { LogIn, ArrowRight } from "lucide-react";

export default function Navbar() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Ruka.ai" 
              className="h-5 sm:h-7"
            />
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('product')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Producto
            </button>
            <button 
              onClick={() => scrollToSection('guarantee')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Garantía
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Testimonios
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <a href="https://demo.ruka.ai/users/sign_in" target="_blank" rel="noopener noreferrer">
                Iniciar Sesión <LogIn className="w-4 h-4" />
              </a>
            </Button>
            <Button size="sm" className="gap-2" onClick={() => window.open('https://calendly.com/suplait_lorenzo/30min', '_blank')}>
              Solicitar Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}