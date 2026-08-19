import { Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { WORKS_CONTACT_PATH, WORKS_NAME, WORKS_PATH } from "@/content/worksContent";

export function WorksFooter() {
  return (
    <footer className="px-5 pb-8 pt-14 sm:px-8 sm:pb-10">
      <div className="mx-auto max-w-7xl border-t border-[#dfe3eb] pt-9">
        <div className="grid gap-10 md:grid-cols-[1fr_auto_auto] md:items-start md:gap-16">
          <div>
            <Link to={WORKS_PATH} aria-label={`Ir al inicio de ${WORKS_NAME}`}>
              <img src="/logo.png" alt="Ruka.ai" className="h-8" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#6c7283]">Procesos específicos, operados sobre los sistemas, reglas y datos que tu empresa ya usa.</p>
          </div>
          <nav aria-label={`Navegación de ${WORKS_NAME}`}>
            <p className="text-xs font-semibold text-[#282a39]">{WORKS_NAME}</p>
            <ul className="mt-4 space-y-3 text-sm text-[#6c7283]">
              <li><Link to={WORKS_CONTACT_PATH} className="transition hover:text-[#5369eb]">Revisar mi caso</Link></li>
              <li><Link to="/about" className="transition hover:text-[#5369eb]">Quiénes somos</Link></li>
              <li><Link to="/" className="transition hover:text-[#5369eb]">Ruka estándar</Link></li>
            </ul>
          </nav>
          <div>
            <p className="text-xs font-semibold text-[#282a39]">Legal</p>
            <ul className="mt-4 space-y-3 text-sm text-[#6c7283]">
              <li><Link to="/privacy" className="transition hover:text-[#5369eb]">Privacidad</Link></li>
              <li><Link to="/terms" className="transition hover:text-[#5369eb]">Términos</Link></li>
              <li>
                <a href="https://www.linkedin.com/company/rukaai/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-[#5369eb]">
                  LinkedIn <Linkedin className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-12 text-xs text-[#969baa]">© {new Date().getFullYear()} Ruka.ai. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
