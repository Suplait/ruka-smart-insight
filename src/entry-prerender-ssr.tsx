import type { ComponentType } from "react";
import { renderToString } from "react-dom/server";
import { Helmet } from "react-helmet";
import { StaticRouter } from "react-router-dom/server";
import AboutUs from "@/pages/AboutUs";
import CuentasPorPagar from "@/pages/CuentasPorPagar";
import Hoteles from "@/pages/Hoteles";
import LandingV2 from "@/pages/LandingV2";
import PanelControl from "@/pages/PanelControl";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import ProductoEjemplo from "@/pages/ProductoEjemplo";
import Register from "@/pages/Register";
import Restaurantes from "@/pages/Restaurantes";
import Retail from "@/pages/Retail";
import Stock from "@/pages/Stock";
import TermsAndConditions from "@/pages/TermsAndConditions";
import Works from "@/pages/Works";
import WorksContact from "@/pages/WorksContact";

const pages: Record<string, ComponentType> = {
  "/": LandingV2,
  "/about": AboutUs,
  "/register": Register,
  "/restaurantes": Restaurantes,
  "/hoteles": Hoteles,
  "/retail": Retail,
  "/productos/ejemplo": ProductoEjemplo,
  "/productos/panel-control": PanelControl,
  "/productos/cuentas-por-pagar": CuentasPorPagar,
  "/productos/stock": Stock,
  "/privacy": PrivacyPolicy,
  "/terms": TermsAndConditions,
  "/works": Works,
  "/works/contacto": WorksContact,
};

export const prerenderPaths = Object.keys(pages);

export function renderPrerenderedPage(path: string) {
  const Page = pages[path];
  if (!Page) throw new Error(`No prerender page registered for ${path}`);

  const html = renderToString(
    <StaticRouter location={path}>
      <Page />
    </StaticRouter>,
  );
  const helmet = Helmet.renderStatic();
  const head = [
    helmet.title.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
    helmet.style.toString(),
    helmet.noscript.toString(),
  ]
    .filter(Boolean)
    .join("\n    ");

  return {
    html,
    head,
    htmlAttributes: helmet.htmlAttributes.toString(),
  };
}
