import { renderToString } from "react-dom/server";
import { Helmet } from "react-helmet";
import { StaticRouter } from "react-router-dom/server";
import Register from "@/pages/Register";
import Restaurantes from "@/pages/Restaurantes";
import Hoteles from "@/pages/Hoteles";
import Retail from "@/pages/Retail";

const pages = {
  "/register": Register,
  "/restaurantes": Restaurantes,
  "/hoteles": Hoteles,
  "/retail": Retail,
};

export type AcquisitionPath = keyof typeof pages;

export function renderAcquisitionPage(path: AcquisitionPath) {
  const Page = pages[path];
  const html = renderToString(
    <StaticRouter location={path}>
      <Page />
    </StaticRouter>,
  );

  Helmet.renderStatic();
  return html;
}
