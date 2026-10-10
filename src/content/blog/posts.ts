import type { BlogPost } from "./types";

const modules = import.meta.glob("./posts/*.json", {
  eager: true,
  import: "default",
}) as Record<string, BlogPost>;

const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const validatePost = (post: BlogPost, source: string) => {
  const requiredStrings: Array<keyof Pick<
    BlogPost,
    | "slug"
    | "category"
    | "title"
    | "excerpt"
    | "metaTitle"
    | "metaDescription"
    | "targetQuery"
    | "searchIntent"
    | "audience"
  >> = [
    "slug",
    "category",
    "title",
    "excerpt",
    "metaTitle",
    "metaDescription",
    "targetQuery",
    "searchIntent",
    "audience",
  ];

  if (!post || post.status !== "published") {
    throw new Error(`Invalid or unpublished blog post in ${source}`);
  }

  for (const field of requiredStrings) {
    if (typeof post[field] !== "string" || !post[field].trim()) {
      throw new Error(`Missing ${field} in ${source}`);
    }
  }

  if (!isIsoDate(post.datePublished) || !isIsoDate(post.dateModified)) {
    throw new Error(`Invalid publication date in ${source}`);
  }

  if (!post.heroImage?.src || !post.heroImage?.alt) {
    throw new Error(`Missing hero image in ${source}`);
  }

  if (!post.sections?.length || !post.intro?.length) {
    throw new Error(`Blog post without body content in ${source}`);
  }

  return post;
};

const loadedPosts = Object.entries(modules).map(([source, post]) =>
  validatePost(post, source),
);

const slugs = new Set<string>();
for (const post of loadedPosts) {
  if (slugs.has(post.slug)) throw new Error(`Duplicate blog slug: ${post.slug}`);
  slugs.add(post.slug);
}

export const blogPosts = loadedPosts.sort((a, b) =>
  b.datePublished.localeCompare(a.datePublished),
);

export const featuredBlogPost =
  blogPosts.find((post) => post.featured) ?? blogPosts[0];

export const getBlogPost = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);

export const getRelatedBlogPosts = (post: BlogPost, limit = 2) =>
  blogPosts.filter((candidate) => candidate.slug !== post.slug).slice(0, limit);
