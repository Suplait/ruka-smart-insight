
import { Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <img 
              src="/logo.png" 
              alt="Ruka.ai" 
              className="h-8"
            />
            <p className="text-muted-foreground">
              Automatización inteligente para empresas medianas
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Producto</h4>
            <ul className="space-y-2">
              <li><a href="#value-showcase" className="text-muted-foreground hover:text-primary">Valor</a></li>
              <li><a href="#features" className="text-muted-foreground hover:text-primary">Features</a></li>
              <li><a href="#product-showcase" className="text-muted-foreground hover:text-primary">Demo</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-muted-foreground hover:text-primary">Sobre Nosotros</a></li>
              <li>
                <a 
                  href="https://calendly.com/suplait_lorenzo/30min" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/company/rukaai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/ruka__ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/ruka__ai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Ruka.ai. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
