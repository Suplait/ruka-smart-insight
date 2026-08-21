import { Helmet } from "react-helmet";
import { oneContent, ONE_NAME } from "@/content/oneContent";
import { createOrganizationSchema, createWebsiteSchema, organizationId, websiteId } from "@/utils/structuredData";

const serviceId = `${oneContent.seo.canonical}#service`;
const webpageId = `${oneContent.seo.canonical}#webpage`;
const breadcrumbId = `${oneContent.seo.canonical}#breadcrumb`;
const faqId = `${oneContent.seo.canonical}#faq`;

const oneSchema = {
  "@context": "https://schema.org",
  "@graph": [
    createOrganizationSchema(),
    createWebsiteSchema(),
    {
      "@type": "Service",
      "@id": serviceId,
      name: ONE_NAME,
      url: oneContent.seo.canonical,
      description: oneContent.seo.serviceDescription,
      provider: { "@id": organizationId },
      serviceType: "Automatización de procesos empresariales",
      areaServed: {
        "@type": "Country",
        name: "Chile",
        identifier: "CL",
      },
    },
    {
      "@type": "WebPage",
      "@id": webpageId,
      url: oneContent.seo.canonical,
      name: oneContent.seo.title,
      description: oneContent.seo.description,
      inLanguage: "es-CL",
      isPartOf: { "@id": websiteId },
      about: { "@id": serviceId },
      breadcrumb: { "@id": breadcrumbId },
      mainEntity: { "@id": faqId },
      publisher: { "@id": organizationId },
    },
    {
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Ruka",
          item: "https://www.ruka.ai/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: ONE_NAME,
          item: oneContent.seo.canonical,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": faqId,
      mainEntity: oneContent.faq.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export function OneSeo() {
  return (
    <Helmet htmlAttributes={{ lang: "es-CL" }}>
      <title>{oneContent.seo.title}</title>
      <meta name="description" content={oneContent.seo.description} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <link rel="canonical" href={oneContent.seo.canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Ruka.ai" />
      <meta property="og:locale" content="es_CL" />
      <meta property="og:url" content={oneContent.seo.canonical} />
      <meta property="og:title" content={oneContent.seo.title} />
      <meta property="og:description" content={oneContent.seo.description} />
      <meta property="og:image" content={oneContent.seo.image} />
      <meta property="og:image:secure_url" content={oneContent.seo.image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${ONE_NAME}: un proceso empresarial operando sobre los sistemas existentes`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={oneContent.seo.title} />
      <meta name="twitter:description" content={oneContent.seo.description} />
      <meta name="twitter:image" content={oneContent.seo.image} />
      <meta name="twitter:image:alt" content={`${ONE_NAME}: un proceso empresarial operando sobre los sistemas existentes`} />
      <script type="application/ld+json">{JSON.stringify(oneSchema)}</script>
    </Helmet>
  );
}

export function OneContactSeo() {
  const canonical = `${oneContent.seo.canonical}/contacto`;
  return (
    <Helmet htmlAttributes={{ lang: "es-CL" }}>
      <title>Cuéntanos tu proceso | {ONE_NAME}</title>
      <meta name="description" content="Cuéntanos qué proceso operativo quieres dejar de ejecutar manualmente y revisémoslo con el equipo de Ruka." />
      <meta name="robots" content="noindex, follow" />
      <meta name="googlebot" content="noindex, follow" />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Ruka.ai" />
      <meta property="og:locale" content="es_CL" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={`Cuéntanos tu proceso | ${ONE_NAME}`} />
      <meta property="og:description" content="Cuéntanos qué proceso operativo quieres dejar de ejecutar manualmente y revisémoslo con el equipo de Ruka." />
    </Helmet>
  );
}
