import type { ComponentType } from "react";
import { renderToString } from "react-dom/server";
import { Helmet } from "react-helmet";
import { StaticRouter } from "react-router-dom/server";
import AboutUs from "@/pages/AboutUs";
import CuentasPorPagar from "@/pages/CuentasPorPagar";
import ConciliacionAutomatica from "@/pages/ConciliacionAutomatica";
import Hoteles from "@/pages/Hoteles";
import Integraciones from "@/pages/Integraciones";
import LandingV2 from "@/pages/LandingV2";
import PanelControl from "@/pages/PanelControl";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import ProductoEjemplo from "@/pages/ProductoEjemplo";
import Register from "@/pages/Register";
import Restaurantes from "@/pages/Restaurantes";
import Retail from "@/pages/Retail";
import RegistroDeCompras from "@/pages/RegistroDeCompras";
import Stock from "@/pages/Stock";
import TermsAndConditions from "@/pages/TermsAndConditions";
import One from "@/pages/One";
import OneContact from "@/pages/OneContact";
import BlogIndex from "@/pages/BlogIndex";
import BlogArticle from "@/pages/BlogArticle";
import { blogPosts } from "@/content/blog/posts";
import IntegrationGuide from "@/pages/IntegrationGuide";
import PurchaseProcessDossier, { purchaseDossierPath, purchaseDossierDescription } from "@/pages/PurchaseProcessDossier";
import ReconciliationExample from "@/pages/ReconciliationExample";
import { reconciliationExamplePath } from "@/utils/reconciliationExample";
import integrationGuides from "@/content/integrationGuides.json";

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
  "/productos/registro-de-compras": RegistroDeCompras,
  "/productos/conciliacion-automatica": ConciliacionAutomatica,
  "/productos/stock": Stock,
  "/integraciones": Integraciones,
  "/privacy": PrivacyPolicy,
  "/terms": TermsAndConditions,
  "/one": One,
  "/one/contacto": OneContact,
  "/blog": BlogIndex,
  [purchaseDossierPath]: PurchaseProcessDossier,
  [reconciliationExamplePath]: ReconciliationExample,
};

for (const guide of integrationGuides) {
  pages[`/integraciones/${guide.slug}`] = () => <IntegrationGuide guide={guide} />;
}

export const discoveryEntries = [
  { path: purchaseDossierPath, title: "Registrar compras en Toteat: expediente de proceso", description: purchaseDossierDescription, lastmod: "2026-10-15" },
  ...integrationGuides.map((guide) => ({ path: `/integraciones/${guide.slug}`, title: `Ruka y ${guide.name}`, description: guide.description, lastmod: guide.reviewedAt })),
  { path: reconciliationExamplePath, title: "Conciliador de factura, orden y recepción en CSV", description: "Compara tus archivos localmente, revisa diferencias y descarga el resultado. Sin registro ni envío de documentos al servidor.", lastmod: "2026-10-15" },
];

for (const post of blogPosts) {
  pages[`/blog/${post.slug}`] = () => <BlogArticle post={post} />;
}

export const prerenderPaths = Object.keys(pages);
export const blogSitemapEntries = [
  { path: "/blog", lastmod: [...blogPosts].map((post) => post.dateModified).sort().at(-1) ?? "2026-10-09" },
  ...blogPosts.map((post) => ({ path: `/blog/${post.slug}`, lastmod: post.dateModified })),
];
export const blogLlmsEntries = blogPosts.map((post) => ({
  title: post.title,
  path: `/blog/${post.slug}`,
  description: post.excerpt,
}));

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
