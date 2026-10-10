import { ArrowRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { BlogIndexSeo } from "@/components/blog/BlogSeo";
import { blogPosts, featuredBlogPost } from "@/content/blog/posts";
import type { BlogPost } from "@/content/blog/types";

export default function BlogIndex() {
  const remainingPosts = blogPosts.filter((post) => post.slug !== featuredBlogPost.slug);

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#171827]">
      <BlogIndexSeo />
      <Navbar />

      <main>
        <header className="border-b border-[#dfe3ed] px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-36 lg:pb-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.58fr)] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Ideas para operar mejor</p>
              <h1 className="mt-5 max-w-4xl text-[clamp(2.9rem,7vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
                Menos tareas.<br />{" "}Más operación.
              </h1>
            </div>
            <p className="max-w-xl text-lg leading-8 text-[#5d6475] lg:pb-2 lg:text-xl">
              Guías prácticas para sacar trabajo manual de compras, finanzas y operaciones sin cambiar los sistemas que tu empresa ya usa.
            </p>
          </div>
        </header>

        <section aria-labelledby="featured-article" className="px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <Link
              to={`/blog/${featuredBlogPost.slug}`}
              className="group grid overflow-hidden border border-[#dfe3ed] bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 lg:grid-cols-[1.04fr_0.96fr]"
            >
              <div className="relative min-h-[280px] overflow-hidden bg-[#e8ebf4] sm:min-h-[420px] lg:min-h-[540px]">
                <img
                  src={featuredBlogPost.heroImage.src}
                  alt={featuredBlogPost.heroImage.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  style={{ objectPosition: featuredBlogPost.heroImage.position }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171827]/25 via-transparent to-transparent" aria-hidden="true" />
              </div>
              <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-14">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    <span>Destacado</span>
                    <span className="h-px w-6 bg-primary/30" aria-hidden="true" />
                    <span className="text-[#6a7180]">{featuredBlogPost.category}</span>
                  </div>
                  <h2 id="featured-article" className="mt-7 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
                    {featuredBlogPost.title}
                  </h2>
                  <p className="mt-6 text-base leading-7 text-[#60687a] sm:text-lg sm:leading-8">
                    {featuredBlogPost.excerpt}
                  </p>
                </div>
                <div className="mt-12 flex items-center justify-between gap-4 border-t border-[#e3e6ee] pt-6">
                  <ArticleMeta post={featuredBlogPost} />
                  <span className="grid h-11 w-11 shrink-0 place-items-center border border-[#ccd4e4] text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        <section aria-labelledby="latest-guides" className="border-t border-[#dfe3ed] bg-white px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 border-b border-[#dfe3ed] pb-8 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Biblioteca</p>
                <h2 id="latest-guides" className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Guías para llevar a la práctica</h2>
              </div>
              <p className="text-sm text-[#6b7280]">Actualizadas por el equipo de Ruka</p>
            </div>

            <div>
              {remainingPosts.map((post, index) => (
                <ArticleRow key={post.slug} post={post} index={index + 1} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#171827] px-5 py-16 text-white sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8fa0ff]">Tu operación</p>
              <h2 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                ¿Qué trabajo sigue haciendo manualmente tu equipo?
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#bec4d3]">
                Muéstranos el proceso. Te mostramos cómo podría operarlo Ruka.
              </p>
            </div>
            <Link
              to="/register"
              className="inline-flex h-12 items-center justify-center gap-2 bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-[#4057d9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#171827]"
            >
              Agendar 30 min <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ArticleRow({ post, index }: { post: BlogPost; index: number }) {
  return (
    <article className="border-b border-[#dfe3ed]">
      <Link
        to={`/blog/${post.slug}`}
        className="group grid gap-6 py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 sm:grid-cols-[190px_minmax(0,1fr)_auto] sm:items-center lg:grid-cols-[260px_minmax(0,1fr)_auto] lg:py-10"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-[#edf0f6]">
          <img
            src={post.heroImage.src}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
            style={{ objectPosition: post.heroImage.position }}
          />
          <span className="absolute left-3 top-3 bg-white/90 px-2 py-1 text-[10px] font-semibold tabular-nums text-[#303241] backdrop-blur">0{index}</span>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{post.category}</p>
          <h3 className="mt-3 max-w-3xl text-2xl font-semibold leading-tight tracking-[-0.035em] text-[#171827] transition-colors group-hover:text-primary sm:text-3xl">
            {post.title}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#62697a] sm:text-base sm:leading-7">{post.excerpt}</p>
          <div className="mt-5"><ArticleMeta post={post} /></div>
        </div>
        <span className="hidden h-11 w-11 place-items-center border border-[#d5dae5] text-[#62697a] transition-[background-color,border-color,color,transform] group-hover:translate-x-1 group-hover:border-primary group-hover:bg-primary group-hover:text-white sm:grid">
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </Link>
    </article>
  );
}

function ArticleMeta({ post }: { post: BlogPost }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-[#72798a]">
      <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
      <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{post.readingTimeMinutes} min</span>
    </div>
  );
}

const formatDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)));
};
