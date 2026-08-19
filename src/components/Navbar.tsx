import { useState } from "react";
import { ArrowRight, LogIn, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import SubdomainModal from "./SubdomainModal";

export type NavbarLink = {
  label: string;
  href: string;
};

const globalLinks: readonly NavbarLink[] = [
  { label: "Trabajo", href: "/#trabajo" },
  { label: "Ruka Works", href: "/works" },
  { label: "Demo", href: "/#demo" },
  { label: "Integraciones", href: "/#integraciones" },
  { label: "Precios", href: "/#precios" },
];

type NavbarProps = {
  links?: readonly NavbarLink[];
  primaryAction?: { label: string; path: string; onClick?: () => void };
  showLogin?: boolean;
};

export default function Navbar({
  links = globalLinks,
  primaryAction = { label: "Agendar 30 min", path: "/register" },
  showLogin = false,
}: NavbarProps) {
  const [showSubdomainModal, setShowSubdomainModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const runPrimaryAction = () => {
    if (primaryAction.onClick) primaryAction.onClick();
    else navigate(primaryAction.path);
    setIsOpen(false);
  };

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("/#") || location.pathname !== "/") {
      setIsOpen(false);
      return;
    }

    event.preventDefault();
    const id = href.slice(2);
    navigate(href, { replace: location.hash === `#${id}` });
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    });
    setIsOpen(false);
  };

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200/30 bg-white/75 backdrop-blur-xl md:left-6 md:right-6 md:top-6 md:rounded-2xl md:border"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-5">
          <Link to="/" aria-label="Ir al inicio de Ruka" className="shrink-0">
            <img src="/logo.png" alt="Ruka.ai" className="h-8 transition-opacity hover:opacity-80" />
          </Link>

          <div className="hidden items-center gap-5 lg:flex xl:gap-7">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                to={href}
                onClick={(event) => handleLinkClick(event, href)}
                className="whitespace-nowrap text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 lg:flex">
              {showLogin ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 rounded-full px-4 text-sm font-medium text-gray-600 hover:bg-gray-100/50 hover:text-gray-900"
                  onClick={() => setShowSubdomainModal(true)}
                >
                  Iniciar sesión
                </Button>
              ) : null}
              <Button
                size="sm"
                className="h-10 rounded-full bg-primary px-5 text-sm font-medium hover:bg-primary/90 xl:px-6"
                onClick={runPrimaryAction}
              >
                {primaryAction.label}
              </Button>
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
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
                    {links.map(({ href, label }) => (
                      <Link
                        key={href}
                        to={href}
                        onClick={(event) => handleLinkClick(event, href)}
                        className="block w-full rounded-lg px-2 py-3 text-left text-lg font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-col gap-2 pb-4">
                    {showLogin ? (
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
                    ) : null}
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
