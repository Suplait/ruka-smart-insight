import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { isOnboardingDebugEnabledFromSearch } from "@/utils/onboardingDebug";
import { pushToDataLayer } from "@/utils/dataLayer";

const WHATSAPP_NUMBER = "56932595791";
const WHATSAPP_MESSAGE = "Hola! Quisiera saber más de Ruka.ai y cómo podría ayudarnos con nuestros procesos.";

const exactMarketingRoutes = new Set([
  "/",
  "/about",
  "/register",
  "/restaurantes",
  "/hoteles",
  "/retail",
  "/webinar",
]);

const acquisitionRoutes = new Set(["/register", "/restaurantes", "/hoteles", "/retail"]);

function normalizePathname(pathname: string) {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "").toLowerCase();
}

export function MarketingWhatsAppButton() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const pathname = normalizePathname(location.pathname);
  const isMarketingRoute = exactMarketingRoutes.has(pathname) || pathname.startsWith("/productos/");
  const isAcquisitionRoute = acquisitionRoutes.has(pathname);
  const isDebug = isOnboardingDebugEnabledFromSearch(location.search);

  if (!isMarketingRoute || isDebug) return null;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  const handleClick = () => {
    pushToDataLayer("whatsapp_marketing_click", {
      page_path: location.pathname,
      placement: "floating",
    });
  };

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hablar con Ruka por WhatsApp"
      onClick={handleClick}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
      className={`fixed right-5 z-[60] flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#dce3f2] bg-white text-sm font-semibold text-[#202231] shadow-[0_14px_38px_rgba(23,24,39,0.16)] outline-none transition-[border-color,box-shadow] hover:border-[#b9c1d2] hover:shadow-[0_16px_42px_rgba(23,24,39,0.2)] focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:w-auto sm:gap-2.5 sm:px-4 ${
        isAcquisitionRoute ? "bottom-[6.5rem] lg:bottom-8 lg:right-8" : "bottom-5 sm:bottom-8 sm:right-8"
      }`}
    >
      <img
        src="/lovable-uploads/950f4b99-40ab-40a3-a017-7375458df29d.png"
        alt=""
        aria-hidden="true"
        className="h-7 w-7 shrink-0"
      />
      <span className="hidden sm:inline">Conversemos</span>
    </motion.a>
  );
}
