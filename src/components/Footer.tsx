
import { Instagram, Linkedin, Twitter, Globe, Map, Building2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Columna 1: Logo e info */}
          <div className="space-y-4 lg:col-span-2">
            <Link to="/">
              <img 
                src="/logo.png" 
                alt="Ruka.ai" 
                className="h-8 hover:opacity-80 transition-opacity"
              />
            </Link>
            <p className="text-muted-foreground">
              Automatización inteligente para empresas medianas
            </p>
            
            {/* Países */}
            <div className="pt-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Países donde operamos
              </h4>
              <div className="flex gap-2 items-center">
                <span className="text-2xl" role="img" aria-label="Chile">
                  🇨🇱
                </span>
                <span className="text-sm text-muted-foreground">Chile</span>
              </div>
            </div>
          </div>
          
          {/* Columna 2: Producto */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">Producto</h4>
            <ul className="space-y-3">
              <li>
                <a href="#value-showcase" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <ChevronRight className="w-4 h-4" /> Valor
                </a>
              </li>
              <li>
                <a href="#features" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <ChevronRight className="w-4 h-4" /> Features
                </a>
              </li>
              <li>
                <a href="#product-showcase" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <ChevronRight className="w-4 h-4" /> Demo
                </a>
              </li>
            </ul>
          </div>
          
          {/* Columna 3: Industrias */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">Industrias</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/restaurantes" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" /> Restaurantes
                </Link>
              </li>
              <li className="text-sm text-muted-foreground italic">
                Más industrias próximamente...
              </li>
            </ul>
          </div>
          
          {/* Columna 4: Contacto y Direcciones */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">Contacto</h4>
            <ul className="space-y-6">
              <li>
                <div className="flex items-start gap-2">
                  <Map className="w-4 h-4 mt-1 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium mb-1">Chile</p>
                    <p className="text-sm text-muted-foreground">
                      General del Canto 50, Providencia, Santiago, Chile
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 mt-1 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium mb-1">USA</p>
                    <p className="text-sm text-muted-foreground">
                      Trust Center, 1209 Orange St., Wilmington, New Castle, Delaware 19801
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <a 
                  href="https://calendly.com/suplait_lorenzo/30min" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" /> Agendar una demo
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Redes Sociales y Copyright */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground order-2 md:order-1">
              &copy; {new Date().getFullYear()} Ruka.ai. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 order-1 md:order-2">
              <a 
                href="https://www.linkedin.com/company/rukaai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/ruka__ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/ruka__ai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
