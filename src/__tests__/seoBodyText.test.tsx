// @vitest-environment node
import { describe, expect, it } from "vitest";
import { bodyText } from "../../scripts/seo-body-text.mjs";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import LandingV2 from "@/pages/LandingV2";
import { AcquisitionFAQ } from "@/components/acquisition/AcquisitionFAQ";
import homeSeo from "@/content/landingV2Seo.json";
import acquisitionFaq from "@/content/acquisitionFaq.json";

describe("FAQ server content validation", () => {
  it("includes all home answers in real server markup without structured data", () => {
    const html = renderToStaticMarkup(<StaticRouter location="/"><LandingV2 /></StaticRouter>);
    for (const faq of homeSeo.faq) expect(bodyText(html)).toContain(faq.answer);
    expect(html).toContain('data-state="closed"');
  });
  it("includes all acquisition answers in real server markup", () => {
    const html = renderToStaticMarkup(<AcquisitionFAQ />);
    for (const faq of acquisitionFaq) expect(bodyText(html)).toContain(faq.answer);
  });
  it("rejects an answer that exists only in JSON-LD, metadata or a template", () => {
    const html = '<html><head><meta name="description" content="Respuesta secreta"></head><body><h2>Pregunta</h2><script type="application/ld+json">{"text":"Respuesta secreta"}</script><template>Respuesta secreta</template><style>/* Respuesta secreta */</style></body></html>';
    expect(bodyText(html)).toBe("Pregunta");
    expect(bodyText(html)).not.toContain("Respuesta secreta");
  });
  it("accepts real server-rendered answers in closed disclosure elements", () => {
    expect(bodyText('<body><details><summary>Pregunta</summary><p>Respuesta &amp; evidencia</p></details></body>')).toContain("Respuesta & evidencia");
    expect(bodyText('<body><div role="region" data-state="closed">Respuesta real</div></body>')).toContain("Respuesta real");
  });
});
