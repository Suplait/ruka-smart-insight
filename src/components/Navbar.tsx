import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function Navbar() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-primary">Ruka.ai</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Características
            </button>
            <button 
              onClick={() => scrollToSection('product')}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Producto
            </button>
            <button 
              onClick={() => scrollToSection('comparison')}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Beneficios
            </button>
            <button 
              onClick={() => scrollToSection('stats')}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Resultados
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Testimonios
            </button>
          </div>

          <div className="flex items-center">
            <Button asChild variant="outline" className="gap-2">
              <a href="https://demo.ruka.ai/users/sign_in" target="_blank" rel="noopener noreferrer">
                Iniciar Sesión <LogIn className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}