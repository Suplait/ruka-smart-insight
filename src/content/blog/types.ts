export type BlogImage = {
  src: string;
  alt: string;
  position?: string;
};

export type BlogSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: string;
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogLink = {
  label: string;
  href: string;
};

export type BlogSource = {
  title: string;
  url: string;
};

export type BlogPost = {
  slug: string;
  status: "published";
  featured?: boolean;
  category: string;
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  datePublished: string;
  dateModified: string;
  readingTimeMinutes: number;
  targetQuery: string;
  searchIntent: string;
  audience: string;
  heroImage: BlogImage;
  intro: string[];
  keyTakeaways: string[];
  sections: BlogSection[];
  faq: BlogFaq[];
  relatedProduct: BlogLink & {
    title: string;
    description: string;
  };
  relatedLinks: BlogLink[];
  sources: BlogSource[];
  author: {
    name: string;
    url: string;
  };
};
