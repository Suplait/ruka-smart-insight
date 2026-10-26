import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Helmet } from "react-helmet";
import { SupplierProfileView } from "../../src/pages/Suppliers";
import type { SupplierProfile } from "../../src/types/supplier";

// Synthetic benchmark only. Not an application route or a public export.
export function renderSupplier(profile: SupplierProfile) {
  const html = renderToString(<StaticRouter location={`/proveedores/${profile.slug}`}><SupplierProfileView profile={profile} /></StaticRouter>);
  const helmet = Helmet.renderStatic();
  return `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}${helmet.script.toString()}${html}`;
}
