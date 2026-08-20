import { Instagram, Linkedin, MapPin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const productLinks = [
  { label: "Ruka", to: "/" },
  { label: "Demo", to: "/#demo" },
  { label: "Integraciones", to: "/#integraciones" },
  { label: "Precios", to: "/#precios" },
] as const;

const oneLinks = [
  { label: "Ruka One", to: "/one" },
  { label: "Revisar mi caso", to: "/one/contacto" },
] as const;

const industryLinks = [
  { label: "Restaurantes", to: "/restaurantes" },
  { label: "Hoteles", to: "/hoteles" },
  { label: "Retail", to: "/retail" },
] as const;

const companyLinks = [
  { label: "Quiénes somos", to: "/about" },
  { label: "Privacidad", to: "/privacy" },
  { label: "Términos", to: "/terms" },
] as const;

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/rukaai/", Icon: Linkedin },
  { label: "Instagram", href: "https://www.instagram.com/ruka__ai/", Icon: Instagram },
  { label: "X", href: "https://x.com/ruka__ai", Icon: Twitter },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-[#dce3f2] bg-[#f5f7fb] px-5 text-[#60687a] sm:px-8">
      <div className="mx-auto max-w-7xl py-12 sm:py-14">
        <div className="grid gap-x-8 gap-y-11 sm:grid-cols-2 lg:grid-cols-[1.45fr_0.72fr_0.76fr_0.76fr_0.72fr] lg:gap-x-10">
          <div>
            <Link to="/" aria-label="Ir al inicio de Ruka" className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
              <img src="/logo.png" alt="Ruka.ai" className="h-8 w-auto transition-opacity hover:opacity-75" />
            </Link>
            <p className="mt-5 max-w-sm text-base leading-7 text-[#555d70]">
              Agentes IA que hacen el trabajo operativo entre los sistemas que tu empresa ya usa.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} de Ruka`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#d6dce8] bg-white text-[#555d70] transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <FooterGroup title="Producto" links={productLinks} />
          <FooterGroup title="Ruka One" links={oneLinks} />
          <FooterGroup title="Industrias" links={industryLinks} />
          <FooterGroup title="Compañía" links={companyLinks} />
        </div>

        <div className="mt-11 grid gap-5 border-t border-[#dce1eb] pt-7 text-sm sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto] lg:items-center lg:gap-8">
          <p>© {new Date().getFullYear()} Ruka.ai. Todos los derechos reservados.</p>
          <p className="flex items-start gap-2 leading-6 sm:items-center">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary sm:mt-0" aria-hidden="true" />
            General del Canto 50, Providencia, Santiago
          </p>
          <p className="flex items-start gap-2 leading-6 sm:items-center">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary sm:mt-0" aria-hidden="true" />
            1209 Orange St., Wilmington, Delaware
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; to: string }[];
}) {
  return (
    <nav aria-label={title}>
      <p className="font-semibold text-[#171827]">{title}</p>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="inline-flex transition-colors duration-200 hover:text-[#171827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
