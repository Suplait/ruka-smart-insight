import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { oneContent } from "@/content/oneContent";
import { OneCta } from "./OneCta";

const links = [
  { href: `#${oneContent.difference.id}`, label: "Cómo funciona" },
  { href: `#${oneContent.scope.id}`, label: "Alcance" },
  { href: `#${oneContent.areas.id}`, label: "Áreas" },
  { href: `#${oneContent.faq.id}`, label: "Preguntas" },
];

export function OneLogo({ className }: { className?: string }) {
  return (
    <Link to="/" aria-label="Ir al inicio de Ruka" className={cn("flex items-center gap-3", className)}>
      <img src="/one/ruka-logo-on-dark.png" alt="Ruka.ai" width={139} height={24} className="h-[22px] w-auto sm:h-6" />
      <span className="h-4 w-px bg-white/20" aria-hidden="true" />
      <span className="text-[15px] font-medium tracking-[-0.01em] text-[var(--one-soft)]">One</span>
    </Link>
  );
}

export function OneHeader() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500",
        scrolled ? "border-b border-[var(--one-hair)] bg-[rgba(3,4,10,0.95)]" : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[68px] max-w-[1360px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <OneLogo />
        <nav aria-label="Secciones de Ruka One" className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-[var(--one-soft)] transition-colors hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>
        <OneCta label={oneContent.hero.primaryAction} className="!min-h-[44px] !rounded-xl !px-4 !text-sm" />
      </div>
    </header>
  );
}
