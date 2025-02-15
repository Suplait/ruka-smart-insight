
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, ArrowRight, ChevronDown } from "lucide-react";
import SubdomainModal from "./SubdomainModal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [showSubdomainModal, setShowSubdomainModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
              <img 
                src="/logo.png" 
                alt="Ruka.ai" 
                className="h-5 sm:h-7 hover:opacity-80 transition-opacity"
              />
            </Link>
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
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm text-muted-foreground hover:text-primary bg-transparent">
                    Industrias
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-48 p-3 bg-white rounded-lg shadow-lg border">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/restaurantes"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              "text-sm font-medium"
                            )}
                          >
                            Restaurantes
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowSubdomainModal(true)}
            >
              Iniciar Sesión <LogIn className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              className="gap-2" 
              onClick={() => window.open('https://calendly.com/suplait_lorenzo/30min', '_blank')}
            >
              Solicitar Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <SubdomainModal 
        isOpen={showSubdomainModal} 
        onClose={() => setShowSubdomainModal(false)} 
      />
    </nav>
  );
}
