import { Helmet } from "react-helmet";
import {
  createOrganizationSchema,
  createWebsiteSchema,
  organizationId,
  websiteId,
} from "@/utils/structuredData";

type Faq = { question: string; answer: string };
type SchemaEntity = Record<string, unknown> & { "@id": string };

type MarketingSeoProps = {
  path: string;
  title: string;
  description: string;
  name: string;
  image?: string;
  imageAlt?: string;
  faqs?: readonly Faq[];
  primaryEntity?: SchemaEntity;
};

const origin = "https://www.ruka.ai";

export function MarketingSeo({
  path,
  title,
  description,
  name,
  image = "/ruka-agentes-ia-operaciones-og.png",
  imageAlt = "Ruka conecta los sistemas de una empresa y ejecuta trabajo operativo",
  faqs = [],
  primaryEntity,
}: MarketingSeoProps) {
  const canonical = `${origin}${path === "/" ? "/" : path}`;
  const imageUrl = image.startsWith("http") ? image : `${origin}${image}`;
  const breadcrumbId = `${canonical}#breadcrumb`;
  const faqId = `${canonical}#faq`;
  const graph: Record<string, unknown>[] = [
    createOrganizationSchema(),
    createWebsiteSchema(),
    ...(primaryEntity ? [primaryEntity] : []),
    {
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name,
      description,
      inLanguage: "es-CL",
      isPartOf: { "@id": websiteId },
      publisher: { "@id": organizationId },
      breadcrumb: { "@id": breadcrumbId },
      primaryImageOfPage: {
        "@type": "ImageObject",
        "@id": `${canonical}#primaryimage`,
        url: imageUrl,
        contentUrl: imageUrl,
        width: 1200,
        height: 630,
        caption: imageAlt,
      },
      ...(primaryEntity ? { about: { "@id": primaryEntity["@id"] }, mainEntity: { "@id": primaryEntity["@id"] } } : {}),
      ...(faqs.length ? { hasPart: { "@id": faqId } } : {}),
    },
    {
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ruka", item: `${origin}/` },
        { "@type": "ListItem", position: 2, name, item: canonical },
      ],
    },
  ];

  if (faqs.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": faqId,
      isPartOf: { "@id": `${canonical}#webpage` },
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }

  return (
    <Helmet htmlAttributes={{ lang: "es-CL" }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Ruka.ai" />
      <meta property="og:locale" content="es_CL" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAlt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />
      <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>
    </Helmet>
  );
}
