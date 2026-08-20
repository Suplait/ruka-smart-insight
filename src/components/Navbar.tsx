import { useState } from "react";
import { ArrowRight, LogIn, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import SubdomainModal from "./SubdomainModal";

const productLinks = [
  { label: "Qué hace Ruka", href: "/#trabajo" },
  { label: "Demo", href: "/#demo" },
  { label: "Integraciones", href: "/#integraciones" },
  { label: "Precios", href: "/#precios" },
] as const;

const industryLinks = [
  { label: "Restaurantes", href: "/restaurantes" },
  { label: "Hoteles", href: "/hoteles" },
  { label: "Retail", href: "/retail" },
] as const;

type NavbarProps = {
  primaryAction?: { label: string; path: string; onClick?: () => void };
  showLogin?: boolean;
};

export default function Navbar({
  primaryAction = { label: "Agendar 30 min", path: "/register" },
  showLogin = false,
}: NavbarProps) {
  const [showSubdomainModal, setShowSubdomainModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState("");
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
      className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200/30 bg-white/80 backdrop-blur-xl md:left-6 md:right-6 md:top-6 md:rounded-2xl md:border"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-5">
          <Link to="/" aria-label="Ir al inicio de Ruka" className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
            <img src="/logo.png" alt="Ruka.ai" className="h-8 transition-opacity hover:opacity-80" />
          </Link>

          <NavigationMenu value={desktopMenu} onValueChange={setDesktopMenu} className="hidden lg:flex" delayDuration={80} skipDelayDuration={220}>
            <NavigationMenuList className="gap-1">
              <NavDropdown value="product" label="Producto" links={productLinks} onLinkClick={handleLinkClick} onToggle={setDesktopMenu} />
              <NavDropdown value="industries" label="Industrias" links={industryLinks} onLinkClick={handleLinkClick} onToggle={setDesktopMenu} />
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/one" className={desktopLinkClass}>Ruka One</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/about" className={desktopLinkClass}>Nosotros</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 lg:flex">
              {showLogin ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 rounded-full px-4 text-sm font-medium text-gray-600 hover:bg-gray-100/60 hover:text-gray-900"
                  onClick={() => setShowSubdomainModal(true)}
                >
                  Iniciar sesión
                </Button>
              ) : null}
              <Button
                size="sm"
                className="h-10 rounded-full bg-primary px-5 text-sm font-medium hover:bg-primary/90 active:scale-[0.98] xl:px-6"
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
              <SheetContent side="right" className="w-[340px] max-w-[92vw] border-l-[#dfe3ec] bg-white px-5 sm:w-[350px]">
                <SheetTitle className="sr-only">Navegación principal</SheetTitle>
                <SheetDescription className="sr-only">
                  Accede al producto, industrias, Ruka One y la información de Ruka.
                </SheetDescription>
                <div className="flex h-full flex-col pt-7">
                  <Accordion type="single" collapsible className="w-full">
                    <MobileNavGroup value="product" label="Producto" links={productLinks} onLinkClick={handleLinkClick} />
                    <MobileNavGroup value="industries" label="Industrias" links={industryLinks} onLinkClick={handleLinkClick} />
                  </Accordion>

                  <div className="border-b border-[#e1e5ed] py-2">
                    <Link to="/one" onClick={() => setIsOpen(false)} className={mobileDirectLinkClass}>Ruka One</Link>
                    <Link to="/about" onClick={() => setIsOpen(false)} className={mobileDirectLinkClass}>Nosotros</Link>
                  </div>

                  <div className="mt-auto flex flex-col gap-2 pb-4 pt-6">
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
                      className="h-11 w-full justify-center gap-2 rounded-full bg-primary px-4 text-sm font-medium hover:bg-primary/90 active:scale-[0.98]"
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

const desktopLinkClass = "inline-flex h-10 items-center rounded-lg px-3.5 text-sm font-medium text-gray-600 transition-colors hover:bg-[#f4f6fb] hover:text-[#171827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";
const mobileDirectLinkClass = "flex min-h-11 items-center rounded-lg px-2 text-base font-semibold text-[#303241] transition-colors hover:bg-[#f4f6fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

function NavDropdown({
  value,
  label,
  links,
  onLinkClick,
  onToggle,
}: {
  value: string;
  label: string;
  links: readonly { label: string; href: string }[];
  onLinkClick: (event: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  onToggle: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <NavigationMenuItem value={value}>
      <NavigationMenuTrigger
        aria-haspopup="menu"
        className="rounded-lg bg-transparent px-3.5 text-sm font-medium text-gray-600 hover:bg-[#f4f6fb] hover:text-[#171827] focus:bg-[#f4f6fb] focus:text-[#171827] data-[state=open]:bg-[#f4f6fb] data-[state=open]:text-[#171827]"
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onToggle((current) => current === value ? "" : value);
          }
          if (event.key === "Escape") onToggle("");
        }}
      >
        {label}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="w-[232px] space-y-1 p-2.5">
          {links.map((link) => (
            <li key={link.href}>
              <NavigationMenuLink asChild>
                <Link
                  to={link.href}
                  onClick={(event) => onLinkClick(event, link.href)}
                  className="block rounded-lg px-3.5 py-3 text-sm font-medium text-[#414654] transition-colors hover:bg-[#f3f5fa] hover:text-[#171827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {link.label}
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

function MobileNavGroup({
  value,
  label,
  links,
  onLinkClick,
}: {
  value: string;
  label: string;
  links: readonly { label: string; href: string }[];
  onLinkClick: (event: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  return (
    <AccordionItem value={value} className="border-[#e1e5ed]">
      <AccordionTrigger className="min-h-12 rounded-lg px-2 py-3 text-base font-semibold text-[#303241] hover:bg-[#f4f6fb] hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {label}
      </AccordionTrigger>
      <AccordionContent className="pb-2 pl-2 pr-1">
        <div className="border-l border-[#d9deea] pl-3">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={(event) => onLinkClick(event, link.href)}
              className="flex min-h-10 items-center rounded-lg px-3 text-sm font-medium text-[#62697a] transition-colors hover:bg-[#f4f6fb] hover:text-[#171827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
