import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import LandingV2 from "@/pages/LandingV2";

export function renderLandingV2() {
  return renderToString(
    <StaticRouter location="/v2">
      <LandingV2 />
    </StaticRouter>,
  );
}
