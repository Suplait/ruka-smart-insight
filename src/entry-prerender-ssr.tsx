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
import Partners from "@/pages/Partners";
import { partnersPath, partnersDescription } from "@/content/partnersContent";
import ReconciliationExample from "@/pages/ReconciliationExample";
import Resources from "@/pages/Resources";
import Updates from "@/pages/Updates";
import { updatesPath, updatesTitle, updatesDescription } from "@/content/releaseNotes";
import { SuppliersIndex, SupplierProfileView } from "@/pages/Suppliers";
import { suppliersPath, suppliersTitle, suppliersDescription } from "@/components/suppliers/SuppliersIndex";
import suppliers from "../config/supplier-profiles.json";
import { supplierListing } from "./utils/supplierListing.mjs";
import FacturacionElectronica from "@/pages/FacturacionElectronica";
import MarginTool, { marginPath, marginTitle, marginDescription } from "@/pages/MarginTool";
import HelpGuide, { HelpIndex, helpPath, helpTitle, helpDescription, helpReviewedAt } from "@/pages/Help";
import helpGuides from "@/content/helpGuides.json";
import Security from "@/pages/Security";
import { securityPath, securityTitle, securityDescription } from "@/content/securityContent";
import Accountants, { accountantsPath, accountantsTitle, accountantsDescription } from "@/pages/Accountants";
import { billingPath, billingContent } from "@/content/billingContent";
import Developers from "@/pages/Developers";
import PurchaseCostTool from "@/pages/PurchaseCostTool";
import PurchaseGuide, { PurchaseGuidesIndex, purchaseGuidesPath, purchaseGuidesTitle, purchaseGuidesDescription } from "@/pages/PurchaseGuides";
import purchaseGuides from "@/content/purchaseGuides.json";
import ApiGuide, { apiGuidePath, apiReviewDate } from "@/pages/ApiGuide";
import apiGuides from "@/content/apiGuides.json";
import Comparison, { CompareIndex } from "@/pages/Compare";
import comparisons from "@/content/comparisons.json";
import { reconciliationExamplePath } from "@/utils/reconciliationExample";
import integrationGuides from "@/content/integrationGuides.json";
import internalRoutes from "@/content/internalRouteSeo.json";
import { InternalRouteSeo } from "@/components/seo/InternalRouteSeo";

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
  "/recursos": Resources,
  [updatesPath]: Updates,
  [suppliersPath]: SuppliersIndex,
  [billingPath]: FacturacionElectronica,
  [marginPath]: MarginTool,
  [helpPath]: HelpIndex,
  [securityPath]: Security,
  [accountantsPath]: Accountants,
  "/comparar": CompareIndex,
  [purchaseGuidesPath]: PurchaseGuidesIndex,
  "/desarrolladores": Developers,
  "/herramientas/costo-unitario": PurchaseCostTool,
  "/herramientas/variacion-costos": () => <PurchaseCostTool comparison />,
  [purchaseDossierPath]: PurchaseProcessDossier,
  [partnersPath]: Partners,
  [reconciliationExamplePath]: ReconciliationExample,
};

for (const guide of integrationGuides) {
  pages[`/integraciones/${guide.slug}`] = () => <IntegrationGuide guide={guide} />;
}
for (const guide of purchaseGuides) {
  pages[`${purchaseGuidesPath}/${guide.slug}`] = () => <PurchaseGuide guide={guide} />;
}

export const discoveryEntries = [
  { path: updatesPath, title: updatesTitle, description: updatesDescription, lastmod: "2026-10-26" },
  { path: suppliersPath, title: suppliersTitle, description: suppliersDescription, lastmod: "2026-10-26" },
  ...supplierListing(suppliers).pages.slice(1).map((_, index) => ({ path: `${suppliersPath}/pagina/${index + 2}`, title: `Proveedores · página ${index + 2}`, description: `Página ${index + 2} del directorio de empresas, RUT y actividades económicas.`, lastmod: "2026-10-26" })),
  ...suppliers.map(profile => ({ path: `${suppliersPath}/${profile.slug}`, title: `${profile.name}: RUT y razón social`, description: profile.summary, lastmod: profile.reviewedAt })),
  { path: securityPath, title: securityTitle, description: securityDescription, lastmod: "2026-10-26" },
  { path: accountantsPath, title: accountantsTitle, description: accountantsDescription, lastmod: "2026-10-26" },
  { path: helpPath, title: helpTitle, description: helpDescription, lastmod: helpReviewedAt },
  ...helpGuides.map(guide => ({ path: `${helpPath}/${guide.slug}`, title: guide.title, description: guide.description, lastmod: helpReviewedAt })),
  { path: marginPath, title: marginTitle, description: marginDescription, lastmod: "2026-10-26" },
  { path: billingPath, title: billingContent.name, description: billingContent.description, lastmod: "2026-10-26" },
  { path: "/comparar", title: "Comparar soluciones", description: "Software y enfoques por tarea: compras, documentos y operación.", lastmod: "2026-10-26" },
  ...comparisons.map(item => ({ path: `/comparar/${item.slug}`, title: item.title, description: item.description, lastmod: item.reviewedAt })),
  ...apiGuides.map(guide => ({ path: `${apiGuidePath}/${guide.slug}`, title: guide.title, description: guide.description, lastmod: apiReviewDate })),
  { path: purchaseGuidesPath, title: purchaseGuidesTitle, description: purchaseGuidesDescription, lastmod: "2026-10-26" },
  ...purchaseGuides.map(guide => ({ path: `${purchaseGuidesPath}/${guide.slug}`, title: guide.title, description: guide.description, lastmod: guide.reviewedAt })),
  { path: "/desarrolladores", title: "Desarrolladores e integradores", description: "API de compras, clasificación, documentos y webhooks para conectar Ruka con dashboards y sistemas propios.", lastmod: "2026-10-26" },
  { path: "/recursos", title: "Recursos por tarea", description: "Calculadoras, guías y ejemplos para compras, costos e integraciones.", lastmod: "2026-10-26" },
  { path: "/herramientas/costo-unitario", title: "Calculadora de costo unitario", description: "Calcula el costo neto por kilo, litro o unidad, con IVA y descuento configurables. Cálculo local sin registro.", lastmod: "2026-10-26" },
  { path: "/herramientas/variacion-costos", title: "Comparador de costos de compra", description: "Compara dos compras en una misma unidad y moneda, sin enviar los datos al servidor.", lastmod: "2026-10-26" },
  { path: partnersPath, title: "Para consultoras de restaurantes", description: partnersDescription, lastmod: "2026-10-15" },
  { path: purchaseDossierPath, title: "Registrar compras en Toteat: guía para tu equipo", description: purchaseDossierDescription, lastmod: "2026-10-15" },
  ...integrationGuides.map((guide) => ({ path: `/integraciones/${guide.slug}`, title: `Ruka y ${guide.name}`, description: guide.description, lastmod: guide.reviewedAt })),
  { path: reconciliationExamplePath, title: "Conciliador de factura, orden y recepción en CSV", description: "Compara tus archivos localmente, revisa diferencias y descarga el resultado. Sin registro ni envío de documentos al servidor.", lastmod: "2026-10-15" },
];

for (const post of blogPosts) {
  pages[`/blog/${post.slug}`] = () => <BlogArticle post={post} />;
}
for (const profile of suppliers) {
  pages[`${suppliersPath}/${profile.slug}`] = () => <SupplierProfileView profile={profile} />;
}
supplierListing(suppliers).pages.forEach((page, index) => {
  pages[index === 0 ? suppliersPath : `${suppliersPath}/pagina/${index + 1}`] = () => <SuppliersIndex page={index + 1} entries={page.entries} />;
});
for (const guide of helpGuides) {
  pages[`${helpPath}/${guide.slug}`] = () => <HelpGuide guide={guide} />;
}
for (const guide of apiGuides) {
  pages[`${apiGuidePath}/${guide.slug}`] = () => <ApiGuide guide={guide} />;
}
for (const comparison of comparisons) {
  pages[`/comparar/${comparison.slug}`] = () => <Comparison comparison={comparison} />;
}

// Operational routes keep their existing client-only flow. Render a safe shell,
// not the home page or a form with fabricated lead/session state.
for (const [routePath, metadata] of Object.entries(internalRoutes)) {
  pages[routePath] = () => (
    <>
      <InternalRouteSeo />
      <main className="mx-auto max-w-xl px-6 py-24">
        <h1>{metadata.heading}</h1>
        <p>{metadata.description}</p>
        <noscript>Activa JavaScript para continuar en esta página.</noscript>
      </main>
    </>
  );
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
