import { Helmet } from "react-helmet";
import type { BlogPost } from "@/content/blog/types";
import { blogPosts } from "@/content/blog/posts";
import {
  createOrganizationSchema,
  createWebsiteSchema,
  organizationId,
  websiteId,
} from "@/utils/structuredData";

const origin = "https://www.ruka.ai";
const defaultImage = `${origin}/ruka-agentes-ia-operaciones-og.png`;

export function BlogIndexSeo() {
  const canonical = `${origin}/blog`;
  const title = "Guías de automatización operativa | Blog de Ruka";
  const description = "Guías prácticas para automatizar compras, conciliaciones, pagos y otros procesos operativos sobre los sistemas que tu empresa ya usa.";
  const graph = [
    createOrganizationSchema(),
    createWebsiteSchema(),
    {
      "@type": "CollectionPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: "Blog de Ruka",
      description,
      inLanguage: "es-CL",
      isPartOf: { "@id": websiteId },
      publisher: { "@id": organizationId },
      breadcrumb: { "@id": `${canonical}#breadcrumb` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        "@id": `${canonical}#primaryimage`,
        url: defaultImage,
        contentUrl: defaultImage,
        width: 1200,
        height: 630,
      },
      mainEntity: { "@id": `${canonical}#articles` },
    },
    {
      "@type": "ItemList",
      "@id": `${canonical}#articles`,
      itemListElement: blogPosts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: `${canonical}/${post.slug}`,
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ruka", item: `${origin}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: canonical },
      ],
    },
  ];

  return <SeoHead title={title} description={description} canonical={canonical} graph={graph} />;
}

export function BlogPostSeo({ post }: { post: BlogPost }) {
  const canonical = `${origin}/blog/${post.slug}`;
  const graph = [
    createOrganizationSchema(),
    createWebsiteSchema(),
    {
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: post.title,
      description: post.metaDescription,
      inLanguage: "es-CL",
      isPartOf: { "@id": websiteId },
      publisher: { "@id": organizationId },
      breadcrumb: { "@id": `${canonical}#breadcrumb` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        "@id": `${canonical}#primaryimage`,
        url: defaultImage,
        contentUrl: defaultImage,
        width: 1200,
        height: 630,
        caption: post.heroImage.alt,
      },
      mainEntity: { "@id": `${canonical}#article` },
      hasPart: { "@id": `${canonical}#faq` },
    },
    {
      "@type": "BlogPosting",
      "@id": `${canonical}#article`,
      headline: post.title,
      description: post.excerpt,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      inLanguage: "es-CL",
      image: { "@id": `${canonical}#primaryimage` },
      mainEntityOfPage: { "@id": `${canonical}#webpage` },
      author: {
        "@type": "Organization",
        name: post.author.name,
        url: post.author.url,
      },
      publisher: { "@id": organizationId },
      about: post.targetQuery,
      articleSection: post.category,
      wordCount: countPostWords(post),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ruka", item: `${origin}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${origin}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: canonical },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${canonical}#faq`,
      mainEntity: post.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    <SeoHead
      title={post.metaTitle}
      description={post.metaDescription}
      canonical={canonical}
      graph={graph}
      type="article"
      publishedTime={post.datePublished}
      modifiedTime={post.dateModified}
    />
  );
}

function SeoHead({
  title,
  description,
  canonical,
  graph,
  type = "website",
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description: string;
  canonical: string;
  graph: Record<string, unknown>[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}) {
  return (
    <Helmet htmlAttributes={{ lang: "es-CL" }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Ruka.ai" />
      <meta property="og:locale" content="es_CL" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Ruka automatiza trabajo operativo entre los sistemas de una empresa" />
      {publishedTime ? <meta property="article:published_time" content={publishedTime} /> : null}
      {modifiedTime ? <meta property="article:modified_time" content={modifiedTime} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={defaultImage} />
      <meta name="twitter:image:alt" content="Ruka automatiza trabajo operativo entre los sistemas de una empresa" />
      <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>
    </Helmet>
  );
}

function countPostWords(post: BlogPost) {
  const text = [
    post.title,
    post.excerpt,
    ...post.intro,
    ...post.keyTakeaways,
    ...post.sections.flatMap((section) => [
      section.title,
      ...section.paragraphs,
      ...(section.bullets ?? []),
      section.callout ?? "",
    ]),
    ...post.faq.flatMap((item) => [item.question, item.answer]),
  ].join(" ");

  return text.trim().split(/\s+/).length;
}
