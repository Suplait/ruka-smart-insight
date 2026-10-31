import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ONE_CONTACT_PATH } from "@/content/oneContent";
import { cn } from "@/lib/utils";
import { OneCta } from "./OneCta";

const anchors = [
  { label: "Qué es", href: "#categoria" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Responsabilidad", href: "#responsabilidad" },
  { label: "Preguntas", href: "#preguntas" },
] as const;

export function OneWordmark() {
  return (
    <Link to="/" aria-label="Ruka.ai, ir al inicio" className="flex shrink-0 items-center gap-2.5 sm:gap-3">
      <img src="/logo.png" alt="" width={185} height={32} className="h-[1.35rem] w-auto sm:h-8" />
      <span aria-hidden="true" className="h-5 w-[2px] sm:h-6 bg-[var(--one-primary)]" />
      <span className="one-serif text-[1.35rem] italic sm:text-[1.65rem] leading-none text-[var(--one-ink)]">One</span>
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
        "sticky top-0 z-50 border-b px-4 transition-[background-color,border-color] duration-300 sm:px-8 lg:px-10",
        scrolled ? "border-[var(--one-rule)] bg-[var(--one-paper)]/95 backdrop-blur-sm" : "border-transparent bg-[var(--one-paper)]",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[84rem] items-center justify-between gap-6 sm:h-[4.5rem]">
        <OneWordmark />
        <nav aria-label="Secciones de Ruka One" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.9375rem] text-[var(--one-ink-2)]">
            {anchors.map((anchor) => (
              <li key={anchor.href}>
                <a href={anchor.href} className="transition-colors hover:text-[var(--one-ink)]">{anchor.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <OneCta to={ONE_CONTACT_PATH} compact>Conversemos</OneCta>
      </div>
    </header>
  );
}
