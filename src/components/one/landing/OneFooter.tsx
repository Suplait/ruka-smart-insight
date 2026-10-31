import { Link } from "react-router-dom";

const groups = [
  {
    title: "Ruka One",
    links: [
      { label: "Conversemos", href: "/one/contacto" },
      { label: "Cómo funciona", href: "/one#como-funciona" },
      { label: "Preguntas frecuentes", href: "/one#preguntas" },
    ],
  },
  {
    title: "Productos de Ruka",
    links: [
      { label: "Registro de compras", href: "/productos/registro-de-compras" },
      { label: "Conciliación automática", href: "/productos/conciliacion-automatica" },
      { label: "Cuentas por pagar", href: "/productos/cuentas-por-pagar" },
      { label: "Integraciones", href: "/integraciones" },
    ],
  },
  {
    title: "Ruka",
    links: [
      { label: "Inicio", href: "/" },
      { label: "Nosotros", href: "/about" },
      { label: "Seguridad", href: "/seguridad" },
      { label: "Comparar soluciones", href: "/comparar" },
      { label: "Recursos", href: "/recursos" },
    ],
  },
] as const;

export function OneFooter() {
  return (
    <footer className="one-night border-t border-[var(--one-night-rule)] px-4 pb-10 pt-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[84rem]">
        <div className="grid gap-12 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div>
            <p className="one-serif text-[2rem] leading-none">
              Ruka <span className="italic">One</span>
            </p>
            <p className="mt-4 max-w-xs text-[0.9375rem] leading-6 text-[var(--one-bone-2)]">
              Operación de back office delegada. Un servicio de Ruka.ai.
            </p>
          </div>
          {groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="one-eyebrow text-[var(--one-bone-2)]">{group.title}</p>
              <ul className="mt-5 space-y-3 text-[0.9375rem]">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-[var(--one-bone)] transition-colors hover:text-white">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-[var(--one-night-rule)] pt-6 text-sm text-[var(--one-bone-2)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ruka.ai</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white">Privacidad</Link>
            <Link to="/terms" className="hover:text-white">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
