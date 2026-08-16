import { Helmet } from "react-helmet";
import seo from "@/content/landingV2Seo.json";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${seo.canonicalUrl}#organization`,
      name: "Ruka.ai",
      url: seo.canonicalUrl,
      logo: {
        "@type": "ImageObject",
        url: "https://www.ruka.ai/logo.png",
      },
      sameAs: ["https://www.linkedin.com/company/ruka-ai"],
    },
    {
      "@type": "WebSite",
      "@id": `${seo.canonicalUrl}#website`,
      url: seo.canonicalUrl,
      name: seo.siteName,
      inLanguage: "es-CL",
      publisher: { "@id": `${seo.canonicalUrl}#organization` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${seo.canonicalUrl}#software`,
      name: "Ruka",
      url: seo.canonicalUrl,
      description: seo.description,
      image: seo.imageUrl,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: "es-CL",
      publisher: { "@id": `${seo.canonicalUrl}#organization` },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "CLP",
        lowPrice: "99990",
        highPrice: "449990",
        offerCount: "3",
      },
      featureList: [
        "Registro automático de compras",
        "Conciliaciones",
        "Actualización de costos e inventario",
        "Integración con sistemas empresariales",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${seo.canonicalUrl}#faq`,
      mainEntity: seo.faq.map((item) => ({
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

export function LandingV2Seo() {
  return (
    <Helmet htmlAttributes={{ lang: "es-CL" }}>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="robots" content={seo.robots} />
      <meta name="googlebot" content={seo.robots} />
      <link rel="canonical" href={seo.canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={seo.siteName} />
      <meta property="og:locale" content={seo.locale} />
      <meta property="og:url" content={seo.canonicalUrl} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.imageUrl} />
      <meta property="og:image:secure_url" content={seo.imageUrl} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={seo.imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.imageUrl} />
      <meta name="twitter:image:alt" content={seo.imageAlt} />

      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
}
