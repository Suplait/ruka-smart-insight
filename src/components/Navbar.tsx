import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, ArrowRight, ChevronDown, UtensilsCrossed, Menu, X, Hotel, Zap, Bot, Receipt, Package } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [showSubdomainModal, setShowSubdomainModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
    } else {
      navigate(`#${id}`, { replace: true });
      const element = document.getElementById(id);
      element?.scrollIntoView({
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  };

  const MobileMenu = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[350px]">
        <nav className="flex flex-col gap-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground px-2">Productos</p>
            {location.pathname === "/" ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="/"
                      className="flex items-center space-x-2 text-left text-base font-medium pl-4 pr-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Bot className="h-4 w-4" />
                      <span>Gestión y Analítica</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-gray-900 text-white font-semibold">
                    Estás aquí
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Link
                to="/"
                className="flex items-center space-x-2 text-left text-base font-medium pl-4 pr-2"
                onClick={() => setIsOpen(false)}
              >
                <Bot className="h-4 w-4" />
                <span>Gestión y Analítica</span>
              </Link>
            )}
            {location.pathname === "/productos/cuentas-por-pagar" ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="/productos/cuentas-por-pagar"
                      className="flex items-center space-x-2 text-left text-base font-medium pl-4 pr-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Receipt className="h-4 w-4" />
                      <span>Cuentas por Pagar</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-gray-900 text-white font-semibold">
                    Estás aquí
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Link
                to="/productos/cuentas-por-pagar"
                className="flex items-center space-x-2 text-left text-base font-medium pl-4 pr-2"
                onClick={() => setIsOpen(false)}
              >
                <Receipt className="h-4 w-4" />
                <span>Cuentas por Pagar</span>
              </Link>
            )}
            {location.pathname === "/productos/panel-control" ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="/productos/panel-control"
                      className="flex items-center space-x-2 text-left text-base font-medium pl-4 pr-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Zap className="h-4 w-4" />
                      <span>Panel de Control</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-gray-900 text-white font-semibold">
                    Estás aquí
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Link
                to="/productos/panel-control"
                className="flex items-center space-x-2 text-left text-base font-medium pl-4 pr-2"
                onClick={() => setIsOpen(false)}
              >
                <Zap className="h-4 w-4" />
                <span>Panel de Control</span>
              </Link>
            )}
            {location.pathname === "/productos/stock" ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="/productos/stock"
                      className="flex items-center space-x-2 text-left text-base font-medium pl-4 pr-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Package className="h-4 w-4" />
                      <span>Gestión de Inventario</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-gray-900 text-white font-semibold">
                    Estás aquí
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Link
                to="/productos/stock"
                className="flex items-center space-x-2 text-left text-base font-medium pl-4 pr-2"
                onClick={() => setIsOpen(false)}
              >
                <Package className="h-4 w-4" />
                <span>Gestión de Inventario</span>
              </Link>
            )}
          </div>
          <button
            onClick={() => scrollToSection("pricing")}
            className="flex items-center space-x-2 text-left text-lg font-medium"
          >
            Precio
          </button>
          <button
            onClick={() => scrollToSection("guarantee")}
            className="flex items-center space-x-2 text-left text-lg font-medium"
          >
            Garantía
          </button>
          <button
            onClick={() => scrollToSection("testimonials")}
            className="flex items-center space-x-2 text-left text-lg font-medium"
          >
            Testimonios
          </button>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground px-2">Industrias</p>
            <Link
              to="/restaurantes"
              className="flex items-center space-x-2 text-left text-base font-medium pl-4"
              onClick={() => setIsOpen(false)}
            >
              <UtensilsCrossed className="h-4 w-4" />
              <span>Restaurantes</span>
            </Link>
            <Link
              to="/hoteles"
              className="flex items-center space-x-2 text-left text-base font-medium pl-4"
              onClick={() => setIsOpen(false)}
            >
              <Hotel className="h-4 w-4" />
              <span>Hoteles</span>
            </Link>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => {
                setShowSubdomainModal(true);
                setIsOpen(false);
              }}
            >
              Iniciar Sesión <LogIn className="w-4 h-4" />
            </Button>
            <Button
              className="w-full justify-start gap-2 h-10 px-6 text-sm font-medium bg-primary hover:bg-primary/90 rounded-full"
              onClick={() => {
                navigate("/register");
                setIsOpen(false);
              }}
            >
              Regístrate <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <nav className="fixed top-6 left-6 right-6 z-50 bg-white/70 backdrop-blur-xl border border-gray-200/30 rounded-2xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
              <img src="/logo.png" alt="Ruka.ai" className="h-8 hover:opacity-80 transition-opacity" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-transparent border-0">
                    Productos
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[280px] p-4 bg-white rounded-lg shadow-lg border">
                      <p className="text-sm font-medium text-muted-foreground mb-3 px-2">Nuestros Productos</p>
                      <ul className="grid gap-2">
                        {location.pathname === "/" ? (
                          <TooltipProvider>
                            <Tooltip open={true} delayDuration={0}>
                              <TooltipTrigger asChild>
                                <li>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      to="/"
                                      className={cn(
                                        "flex items-center gap-3 rounded-lg p-3 leading-none no-underline outline-none transition-colors",
                                        "bg-card hover:bg-accent hover:text-accent-foreground",
                                        "border border-transparent hover:border-border",
                                      )}
                                    >
                                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                                        <Bot className="h-5 w-5 text-primary" />
                                      </div>
                                      <div className="grid gap-1 flex-1">
                                        <div className="text-sm font-medium">
                                          Gestión y Analítica
                                        </div>
                                        <div className="line-clamp-2 text-xs text-muted-foreground">
                                          Agentes con IA para automatizar tu gestión de compras
                                        </div>
                                      </div>
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="bg-gray-900 text-white font-semibold">
                                Estás aquí
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/"
                                className={cn(
                                  "flex items-center gap-3 rounded-lg p-3 leading-none no-underline outline-none transition-colors",
                                  "bg-card hover:bg-accent hover:text-accent-foreground",
                                  "border border-transparent hover:border-border",
                                )}
                              >
                                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                                  <Bot className="h-5 w-5 text-primary" />
                                </div>
                                <div className="grid gap-1 flex-1">
                                  <div className="text-sm font-medium">
                                    Gestión y Analítica
                                  </div>
                                  <div className="line-clamp-2 text-xs text-muted-foreground">
                                    Agentes con IA para automatizar tu gestión de compras
                                  </div>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        )}
                        {location.pathname === "/productos/cuentas-por-pagar" ? (
                          <TooltipProvider>
                            <Tooltip open={true} delayDuration={0}>
                              <TooltipTrigger asChild>
                                <li>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      to="/productos/cuentas-por-pagar"
                                      className={cn(
                                        "flex items-center gap-3 rounded-lg p-3 leading-none no-underline outline-none transition-colors",
                                        "bg-card hover:bg-accent hover:text-accent-foreground",
                                        "border border-transparent hover:border-border",
                                      )}
                                    >
                                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                                        <Receipt className="h-5 w-5 text-primary" />
                                      </div>
                                      <div className="grid gap-1 flex-1">
                                        <div className="text-sm font-medium">
                                          Cuentas por Pagar
                                        </div>
                                        <div className="line-clamp-2 text-xs text-muted-foreground">
                                          Automatiza pagos, gestiona recepción y genera planillas bancarias
                                        </div>
                                      </div>
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="bg-gray-900 text-white font-semibold">
                                Estás aquí
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/productos/cuentas-por-pagar"
                                className={cn(
                                  "flex items-center gap-3 rounded-lg p-3 leading-none no-underline outline-none transition-colors",
                                  "bg-card hover:bg-accent hover:text-accent-foreground",
                                  "border border-transparent hover:border-border",
                                )}
                              >
                                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                                  <Receipt className="h-5 w-5 text-primary" />
                                </div>
                                <div className="grid gap-1 flex-1">
                                  <div className="text-sm font-medium">
                                    Cuentas por Pagar
                                  </div>
                                  <div className="line-clamp-2 text-xs text-muted-foreground">
                                    Automatiza pagos, gestiona recepción y genera planillas bancarias
                                  </div>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        )}
                        {location.pathname === "/productos/panel-control" ? (
                          <TooltipProvider>
                            <Tooltip open={true} delayDuration={0}>
                              <TooltipTrigger asChild>
                                <li>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      to="/productos/panel-control"
                                      className={cn(
                                        "flex items-center gap-3 rounded-lg p-3 leading-none no-underline outline-none transition-colors",
                                        "bg-card hover:bg-accent hover:text-accent-foreground",
                                        "border border-transparent hover:border-border",
                                      )}
                                    >
                                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                                        <Zap className="h-5 w-5 text-primary" />
                                      </div>
                                      <div className="grid gap-1 flex-1">
                                        <div className="text-sm font-medium">
                                          Panel de Control
                                        </div>
                                        <div className="line-clamp-2 text-xs text-muted-foreground">
                                          Decisiones inteligentes en tiempo real
                                        </div>
                                      </div>
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="bg-gray-900 text-white font-semibold">
                                Estás aquí
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/productos/panel-control"
                                className={cn(
                                  "flex items-center gap-3 rounded-lg p-3 leading-none no-underline outline-none transition-colors",
                                  "bg-card hover:bg-accent hover:text-accent-foreground",
                                  "border border-transparent hover:border-border",
                                )}
                              >
                                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                                  <Zap className="h-5 w-5 text-primary" />
                                </div>
                                <div className="grid gap-1 flex-1">
                                  <div className="text-sm font-medium">
                                    Panel de Control
                                  </div>
                                  <div className="line-clamp-2 text-xs text-muted-foreground">
                                    Decisiones inteligentes en tiempo real
                                  </div>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        )}
                        {location.pathname === "/productos/stock" ? (
                          <TooltipProvider>
                            <Tooltip open={true} delayDuration={0}>
                              <TooltipTrigger asChild>
                                <li>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      to="/productos/stock"
                                      className={cn(
                                        "flex items-center gap-3 rounded-lg p-3 leading-none no-underline outline-none transition-colors",
                                        "bg-card hover:bg-accent hover:text-accent-foreground",
                                        "border border-transparent hover:border-border",
                                      )}
                                    >
                                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                                        <Package className="h-5 w-5 text-primary" />
                                      </div>
                                      <div className="grid gap-1 flex-1">
                                        <div className="text-sm font-medium">
                                          Gestión de Inventario
                                        </div>
                                        <div className="line-clamp-2 text-xs text-muted-foreground">
                                          Inventario automático, múltiples bodegas y control de traspasos
                                        </div>
                                      </div>
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="bg-gray-900 text-white font-semibold">
                                Estás aquí
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/productos/stock"
                                className={cn(
                                  "flex items-center gap-3 rounded-lg p-3 leading-none no-underline outline-none transition-colors",
                                  "bg-card hover:bg-accent hover:text-accent-foreground",
                                  "border border-transparent hover:border-border",
                                )}
                              >
                                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                                  <Package className="h-5 w-5 text-primary" />
                                </div>
                                <div className="grid gap-1 flex-1">
                                  <div className="text-sm font-medium">
                                    Gestión de Inventario
                                  </div>
                                  <div className="line-clamp-2 text-xs text-muted-foreground">
                                    Inventario automático, múltiples bodegas y control de traspasos
                                  </div>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        )}

                        <li className="px-2 py-1">
                          <div className="text-xs text-muted-foreground italic">Más productos próximamente...</div>
                        </li>
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <button
              onClick={() => scrollToSection("pricing")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("guarantee")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Garantía
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Testimonios
            </button>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-transparent border-0">
                    Industrias
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[280px] p-4 bg-white rounded-lg shadow-lg border">
                      <p className="text-sm font-medium text-muted-foreground mb-3 px-2">Soluciones por Industria</p>
                      <ul className="grid gap-2">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/restaurantes"
                              className={cn(
                                "flex items-center gap-3 rounded-lg p-3 leading-none no-underline outline-none transition-colors",
                                "bg-card hover:bg-accent hover:text-accent-foreground",
                                "border border-transparent hover:border-border",
                              )}
                            >
                              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                                <UtensilsCrossed className="h-5 w-5 text-primary" />
                              </div>
                              <div className="grid gap-1">
                                <div className="text-sm font-medium">Restaurantes</div>
                                <div className="line-clamp-2 text-xs text-muted-foreground">
                                  Automatiza el registro, seguimiento de precios y monitoreo de foodcost
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/hoteles"
                              className={cn(
                                "flex items-center gap-3 rounded-lg p-3 leading-none no-underline outline-none transition-colors",
                                "bg-card hover:bg-accent hover:text-accent-foreground",
                                "border border-transparent hover:border-border",
                              )}
                            >
                              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                                <Hotel className="h-5 w-5 text-primary" />
                              </div>
                              <div className="grid gap-1">
                                <div className="text-sm font-medium">Hoteles</div>
                                <div className="line-clamp-2 text-xs text-muted-foreground">
                                  Optimiza tus costos operativos y gestiona tus proveedores eficientemente
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>

                        <li className="px-2 py-1">
                          <div className="text-xs text-muted-foreground italic">Más industrias próximamente...</div>
                        </li>
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-10 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-full"
                onClick={() => setShowSubdomainModal(true)}
              >
                Iniciar Sesión
              </Button>
              <Button
                size="sm"
                className="h-10 px-6 text-sm font-medium bg-primary hover:bg-primary/90 rounded-full"
                onClick={() => navigate("/register")}
              >
                Regístrate
              </Button>
            </div>
            <MobileMenu />
          </div>
        </div>
      </div>

      <SubdomainModal isOpen={showSubdomainModal} onClose={() => setShowSubdomainModal(false)} />
    </nav>
  );
}
