import { Helmet } from "react-helmet";
import { worksContent, WORKS_NAME } from "@/content/worksContent";
import { createOrganizationSchema, createWebsiteSchema, organizationId, websiteId } from "@/utils/structuredData";

const worksSchema = {
  "@context": "https://schema.org",
  "@graph": [
    createOrganizationSchema(),
    createWebsiteSchema(),
    {
      "@type": "Service",
      "@id": `${worksContent.seo.canonical}#service`,
      name: WORKS_NAME,
      url: worksContent.seo.canonical,
      description: worksContent.seo.description,
      provider: { "@id": organizationId },
      serviceType: "Automatización de procesos operativos",
      areaServed: "CL",
    },
    {
      "@type": "WebPage",
      "@id": `${worksContent.seo.canonical}#webpage`,
      url: worksContent.seo.canonical,
      name: worksContent.seo.title,
      description: worksContent.seo.description,
      inLanguage: "es-CL",
      isPartOf: { "@id": websiteId },
      about: { "@id": `${worksContent.seo.canonical}#service` },
      publisher: { "@id": organizationId },
    },
  ],
};

export function WorksSeo() {
  return (
    <Helmet htmlAttributes={{ lang: "es-CL" }}>
      <title>{worksContent.seo.title}</title>
      <meta name="description" content={worksContent.seo.description} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <link rel="canonical" href={worksContent.seo.canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Ruka.ai" />
      <meta property="og:locale" content="es_CL" />
      <meta property="og:url" content={worksContent.seo.canonical} />
      <meta property="og:title" content={worksContent.seo.title} />
      <meta property="og:description" content={worksContent.seo.description} />
      <meta property="og:image" content={worksContent.seo.image} />
      <meta property="og:image:secure_url" content={worksContent.seo.image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${WORKS_NAME} ejecutando un proceso de validación operacional`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={worksContent.seo.title} />
      <meta name="twitter:description" content={worksContent.seo.description} />
      <meta name="twitter:image" content={worksContent.seo.image} />
      <meta name="twitter:image:alt" content={`${WORKS_NAME} ejecutando un proceso de validación operacional`} />
      <script type="application/ld+json">{JSON.stringify(worksSchema)}</script>
    </Helmet>
  );
}

export function WorksContactSeo() {
  const canonical = `${worksContent.seo.canonical}/contacto`;
  return (
    <Helmet htmlAttributes={{ lang: "es-CL" }}>
      <title>Cuéntanos tu proceso | {WORKS_NAME}</title>
      <meta name="description" content="Cuéntanos qué proceso operativo quieres dejar de ejecutar manualmente y revisémoslo con el equipo de Ruka." />
      <meta name="robots" content="noindex, follow" />
      <meta name="googlebot" content="noindex, follow" />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Ruka.ai" />
      <meta property="og:locale" content="es_CL" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={`Cuéntanos tu proceso | ${WORKS_NAME}`} />
      <meta property="og:description" content="Cuéntanos qué proceso operativo quieres dejar de ejecutar manualmente y revisémoslo con el equipo de Ruka." />
    </Helmet>
  );
}
