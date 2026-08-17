
import { Instagram, Linkedin, Twitter, Globe, Map, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-[#f2f4f8] border-t border-gray-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
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
            <p className="text-gray-600 font-light">
              Automatización inteligente para empresas medianas
            </p>
            
            {/* Países */}
            <div className="pt-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Países donde operamos
              </h4>
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <span className="text-2xl" role="img" aria-label="Chile">
                    🇨🇱
                  </span>
                  <span className="text-sm text-muted-foreground">Chile</span>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  Próximamente en más países...
                </p>
              </div>
            </div>
          </div>
          
          {/* Columna 2: Producto */}
          <div>
            <h4 className="font-medium mb-4 text-gray-900">Producto</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/#trabajo"
                  className="text-gray-600 hover:text-primary transition-colors font-light"
                >
                  Trabajo
                </Link>
              </li>
              <li>
                <Link 
                  to="/#integraciones"
                  className="text-gray-600 hover:text-primary transition-colors font-light"
                >
                  Integraciones
                </Link>
              </li>
              <li>
                <Link 
                  to="/#demo"
                  className="text-gray-600 hover:text-primary transition-colors font-light"
                >
                  Demo
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Columna 3: Industrias */}
          <div>
            <h4 className="font-medium mb-4 text-gray-900">Industrias</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/restaurantes" 
                  className="text-gray-600 hover:text-primary transition-colors font-light"
                >
                  Restaurantes
                </Link>
              </li>
              <li className="text-sm text-muted-foreground italic">
                Más industrias próximamente...
              </li>
            </ul>
          </div>
          
          {/* Columna 4: Contacto y Direcciones */}
          <div>
            <h4 className="font-medium mb-4 text-gray-900">Contacto</h4>
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
                <Link 
                  to="/register"
                  className="inline-flex items-center h-10 px-6 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-colors"
                >
                  Agendar 30 min
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Redes Sociales y Copyright */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-600 font-light order-2 md:order-1">
              &copy; {new Date().getFullYear()} Ruka.ai. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 order-1 md:order-2">
              <a 
                href="https://www.linkedin.com/company/rukaai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-primary" />
              </a>
              <a 
                href="https://x.com/ruka__ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-primary" />
              </a>
              <a 
                href="https://www.instagram.com/ruka__ai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-primary" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
