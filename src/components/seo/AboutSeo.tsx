import { Helmet } from "react-helmet";
import aboutSeo from "@/content/aboutSeo.json";
import { founders } from "@/content/aboutFounders";
import {
  createOrganizationSchema,
  createWebsiteSchema,
  organizationId,
  websiteId,
} from "@/utils/structuredData";

const absoluteImage = (image?: string) =>
  image ? new URL(image, "https://www.ruka.ai").toString() : undefined;

const founderEntities = founders.map((founder, index) => ({
  "@type": "Person",
  "@id": `${aboutSeo.canonicalUrl}#founder-${index + 1}`,
  name: founder.name,
  jobTitle: founder.role,
  image: absoluteImage(founder.image),
  sameAs: [founder.linkedin],
  worksFor: { "@id": organizationId },
}));

const aboutStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      ...createOrganizationSchema(),
      founder: founderEntities.map((founder) => ({ "@id": founder["@id"] })),
    },
    createWebsiteSchema(),
    {
      "@type": "AboutPage",
      "@id": `${aboutSeo.canonicalUrl}#aboutpage`,
      url: aboutSeo.canonicalUrl,
      name: aboutSeo.title,
      description: aboutSeo.description,
      inLanguage: "es-CL",
      isPartOf: { "@id": websiteId },
      mainEntity: { "@id": organizationId },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: aboutSeo.imageUrl,
      },
    },
    ...founderEntities,
  ],
};

export function AboutSeo() {
  return (
    <Helmet htmlAttributes={{ lang: "es-CL" }}>
      <title>{aboutSeo.title}</title>
      <meta name="description" content={aboutSeo.description} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <link rel="canonical" href={aboutSeo.canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={aboutSeo.siteName} />
      <meta property="og:locale" content={aboutSeo.locale} />
      <meta property="og:url" content={aboutSeo.canonicalUrl} />
      <meta property="og:title" content={aboutSeo.title} />
      <meta property="og:description" content={aboutSeo.shortDescription} />
      <meta property="og:image" content={aboutSeo.imageUrl} />
      <meta property="og:image:secure_url" content={aboutSeo.imageUrl} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={aboutSeo.imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={aboutSeo.title} />
      <meta name="twitter:description" content={aboutSeo.shortDescription} />
      <meta name="twitter:image" content={aboutSeo.imageUrl} />
      <meta name="twitter:image:alt" content={aboutSeo.imageAlt} />

      <script type="application/ld+json">{JSON.stringify(aboutStructuredData)}</script>
    </Helmet>
  );
}
