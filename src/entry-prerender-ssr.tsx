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
};

for (const post of blogPosts) {
  pages[`/blog/${post.slug}`] = () => <BlogArticle post={post} />;
}

export const prerenderPaths = Object.keys(pages);
export const blogSitemapEntries = [
  { path: "/blog", lastmod: blogPosts[0]?.dateModified ?? "2026-10-09" },
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
