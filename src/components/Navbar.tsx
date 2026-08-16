import { useState } from "react";
import { ArrowRight, LogIn, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import SubdomainModal from "./SubdomainModal";

export type NavbarSectionLink = {
  id: string;
  label: string;
};

const defaultSectionLinks: readonly NavbarSectionLink[] = [
  { label: "Trabajo", id: "trabajo" },
  { label: "Demo", id: "demo" },
  { label: "Integraciones", id: "integraciones" },
  { label: "Precios", id: "precios" },
];

type NavbarProps = {
  sectionLinks?: readonly NavbarSectionLink[];
  sectionPath?: string;
  logoPath?: string;
  primaryAction?: { label: string; path: string };
  showLogin?: boolean;
};

export default function Navbar({
  sectionLinks = defaultSectionLinks,
  sectionPath = "/",
  logoPath = "/",
  primaryAction = { label: "Agendar 20 min", path: "/register" },
  showLogin = false,
}: NavbarProps) {
  const [showSubdomainModal, setShowSubdomainModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    if (location.pathname.toLowerCase() !== sectionPath.toLowerCase()) {
      navigate(`${sectionPath}#${id}`);
    } else {
      navigate(`#${id}`, { replace: true });
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const runPrimaryAction = () => {
    navigate(primaryAction.path);
    setIsOpen(false);
  };

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200/30 bg-white/70 backdrop-blur-xl md:left-6 md:right-6 md:top-6 md:rounded-2xl md:border"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to={logoPath} aria-label="Ir al inicio de Ruka">
            <img src="/logo.png" alt="Ruka.ai" className="h-8 transition-opacity hover:opacity-80" />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {sectionLinks.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 md:flex">
              {showLogin && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 rounded-full px-4 text-sm font-medium text-gray-600 hover:bg-gray-100/50 hover:text-gray-900"
                  onClick={() => setShowSubdomainModal(true)}
                >
                  Iniciar sesión
                </Button>
              )}
              <Button
                size="sm"
                className="h-10 rounded-full bg-primary px-6 text-sm font-medium hover:bg-primary/90"
                onClick={runPrimaryAction}
              >
                {primaryAction.label}
              </Button>
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[340px] max-w-[92vw] sm:w-[350px]">
                <SheetTitle className="sr-only">Navegación principal</SheetTitle>
                <SheetDescription className="sr-only">
                  Accede a las secciones principales de Ruka y agenda una conversación.
                </SheetDescription>
                <div className="flex h-full flex-col pt-8">
                  <div className="space-y-1">
                    <p className="px-2 pb-2 text-xs text-muted-foreground">Secciones</p>
                    {sectionLinks.map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => scrollToSection(id)}
                        className="w-full rounded-lg px-2 py-3 text-left text-lg font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-col gap-2 pb-4">
                    {showLogin && (
                      <Button
                        variant="outline"
                        className="h-11 w-full justify-start gap-2 rounded-full"
                        onClick={() => {
                          setShowSubdomainModal(true);
                          setIsOpen(false);
                        }}
                      >
                        Iniciar sesión <LogIn className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      className="h-11 w-full justify-center gap-2 rounded-full bg-primary px-4 text-sm font-medium hover:bg-primary/90"
                      onClick={runPrimaryAction}
                    >
                      {primaryAction.label} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <SubdomainModal isOpen={showSubdomainModal} onClose={() => setShowSubdomainModal(false)} />
    </nav>
  );
}
