import { Helmet } from "react-helmet";
import acquisitionFaq from "@/content/acquisitionFaq.json";

type AcquisitionSeoProps = {
  title: string;
  description: string;
  canonicalUrl: string;
  pageName: string;
  features: string[];
};

export function AcquisitionSeo({
  title,
  description,
  canonicalUrl,
  pageName,
  features,
}: AcquisitionSeoProps) {
  const imageUrl = "https://www.ruka.ai/ruka-agentes-ia-og.png";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.ruka.ai/#organization",
        name: "Ruka.ai",
        url: "https://www.ruka.ai/",
        logo: {
          "@type": "ImageObject",
          url: "https://www.ruka.ai/logo.png",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://www.ruka.ai/#website",
        url: "https://www.ruka.ai/",
        name: "Ruka.ai",
        inLanguage: "es-CL",
        publisher: { "@id": "https://www.ruka.ai/#organization" },
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: pageName,
        description,
        inLanguage: "es-CL",
        isPartOf: { "@id": "https://www.ruka.ai/#website" },
        about: { "@id": "https://www.ruka.ai/#software" },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.ruka.ai/#software",
        name: "Ruka",
        url: "https://www.ruka.ai/",
        description:
          "Agentes IA que ejecutan trabajo operativo sobre los sistemas que ya usa una empresa.",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        inLanguage: "es-CL",
        publisher: { "@id": "https://www.ruka.ai/#organization" },
        featureList: features,
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: acquisitionFaq.map((item) => ({
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

  return (
    <Helmet htmlAttributes={{ lang: "es-CL" }}>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Ruka.ai" />
      <meta property="og:locale" content="es_CL" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Ruka, agentes IA para trabajo operativo" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content="Ruka, agentes IA para trabajo operativo" />

      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
}
