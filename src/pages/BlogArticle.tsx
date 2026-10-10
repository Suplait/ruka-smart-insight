import { ArrowLeft, ArrowRight, Check, Clock3, ExternalLink } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { BlogPostSeo } from "@/components/blog/BlogSeo";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { getBlogPost, getRelatedBlogPosts } from "@/content/blog/posts";
import type { BlogPost } from "@/content/blog/types";

type BlogArticleProps = {
  post?: BlogPost;
};

export default function BlogArticle({ post: prerenderedPost }: BlogArticleProps) {
  const { slug = "" } = useParams();
  const post = prerenderedPost ?? getBlogPost(slug);

  if (!post) return <Navigate to="/404" replace />;

  const relatedPosts = getRelatedBlogPosts(post);

  return (
    <div className="min-h-screen bg-white text-[#171827]">
      <BlogPostSeo post={post} />
      <ReadingProgress />
      <Navbar />

      <main>
        <header className="border-b border-[#e1e5ed] bg-[#f7f8fc] px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-36 lg:pb-20">
          <div className="mx-auto max-w-6xl">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-[#60687a] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver al blog
            </Link>
            <div className="mt-10 max-w-5xl">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <span>{post.category}</span>
                <span className="h-px w-6 bg-primary/30" aria-hidden="true" />
                <span className="text-[#707789]">Guía práctica</span>
              </div>
              <h1 className="mt-5 text-[clamp(2.75rem,7vw,5.7rem)] font-semibold leading-[0.94] tracking-[-0.062em]">{post.title}</h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-[#5e6678] sm:text-xl sm:leading-9">{post.excerpt}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[#dfe3ed] pt-6 text-sm text-[#6a7182]">
                <span className="font-semibold text-[#303241]">{post.author.name}</span>
                <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
                <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" aria-hidden="true" />{post.readingTimeMinutes} min de lectura</span>
              </div>
            </div>
          </div>
        </header>

        <div className="px-5 pt-8 sm:px-8 sm:pt-12">
          <figure className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden border border-[#dfe3ed] bg-[#e9ecf4] shadow-[0_22px_60px_rgba(27,32,49,0.1)]">
              <div className="flex h-10 items-center gap-1.5 border-b border-[#dfe3ed] bg-white px-4" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-[#d9dde7]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#d9dde7]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#d9dde7]" />
                <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a91a1]">Ruka en operación</span>
              </div>
              <img
                src={post.heroImage.src}
                alt={post.heroImage.alt}
                className="aspect-[16/9] w-full object-cover"
                style={{ objectPosition: post.heroImage.position }}
              />
            </div>
            <figcaption className="mt-3 text-xs leading-5 text-[#7a8191]">{post.heroImage.alt}</figcaption>
          </figure>
        </div>

        <div className="px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[220px_minmax(0,720px)] lg:gap-20">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#777e8e]">En esta guía</p>
                <nav aria-label="Contenido del artículo" className="mt-5 border-l border-[#dce1eb]">
                  {post.sections.map((section) => (
                    <a key={section.id} href={`#${section.id}`} className="block border-l-2 border-transparent py-2 pl-4 text-sm leading-5 text-[#666e80] transition-colors hover:border-primary hover:text-[#171827]">
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <article>
              <details className="mb-10 border border-[#dfe3ed] bg-[#fafbfe] p-5 lg:hidden">
                <summary className="cursor-pointer font-semibold text-[#303241]">En esta guía</summary>
                <nav aria-label="Contenido del artículo" className="mt-4 space-y-2 border-t border-[#e1e5ed] pt-4">
                  {post.sections.map((section) => (
                    <a key={section.id} href={`#${section.id}`} className="block text-sm leading-6 text-[#62697a] hover:text-primary">{section.title}</a>
                  ))}
                </nav>
              </details>

              <div className="space-y-5 text-[1.08rem] leading-8 text-[#444b5c] sm:text-lg sm:leading-9">
                {post.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>

              <section aria-labelledby="key-takeaways" className="my-12 border-l-4 border-primary bg-[#f0f3ff] px-6 py-7 sm:px-8">
                <h2 id="key-takeaways" className="text-lg font-semibold tracking-[-0.02em] text-[#171827]">Lo esencial</h2>
                <ul className="mt-5 space-y-3">
                  {post.keyTakeaways.map((item) => (
                    <li key={item} className="flex gap-3 text-base leading-7 text-[#4f586c]">
                      <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center bg-primary text-white"><Check className="h-3 w-3" aria-hidden="true" /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {post.sections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-28 border-t border-[#e2e6ee] py-12 first:border-t-0 first:pt-0">
                  <p className="text-xs font-semibold tabular-nums uppercase tracking-[0.2em] text-primary">0{index + 1}</p>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.042em] sm:text-4xl">{section.title}</h2>
                  <div className="mt-6 space-y-5 text-[1.05rem] leading-8 text-[#4d5567] sm:text-lg sm:leading-9">
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                  {section.bullets?.length ? (
                    <ul className="mt-7 grid gap-3 border-y border-[#e2e6ee] py-6 sm:grid-cols-2">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 text-sm leading-6 text-[#4f586c]">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden="true" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {section.callout ? (
                    <blockquote className="my-8 border-l-2 border-[#171827] pl-6 text-xl font-medium leading-8 tracking-[-0.02em] text-[#242635] sm:text-2xl sm:leading-9">
                      {section.callout}
                    </blockquote>
                  ) : null}
                </section>
              ))}

              <section aria-labelledby="article-faq" className="border-t border-[#e2e6ee] pt-12">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Preguntas frecuentes</p>
                <h2 id="article-faq" className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Antes de llevarlo a tu operación</h2>
                <div className="mt-7 divide-y divide-[#e2e6ee] border-y border-[#e2e6ee]">
                  {post.faq.map((item, index) => (
                    <details key={item.question} className="group py-5" open={index === 0}>
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-semibold leading-6 text-[#272936] marker:content-none">
                        <span>{item.question}</span>
                        <span className="mt-1 text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                      </summary>
                      <p className="max-w-2xl pt-3 text-sm leading-7 text-[#62697a]">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>

              <aside className="mt-14 bg-[#171827] p-7 text-white sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8fa0ff]">Producto relacionado</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em]">{post.relatedProduct.title}</h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-[#c2c7d4]">{post.relatedProduct.description}</p>
                <Link to={post.relatedProduct.href} className="mt-7 inline-flex h-11 items-center gap-2 bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-[#4057d9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#171827]">
                  {post.relatedProduct.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </aside>

              <section aria-labelledby="sources" className="mt-12 border-t border-[#e2e6ee] pt-8">
                <h2 id="sources" className="text-sm font-semibold text-[#303241]">Fuentes y páginas relacionadas</h2>
                <ul className="mt-4 space-y-3">
                  {post.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} className="inline-flex items-start gap-2 text-sm leading-6 text-[#62697a] underline decoration-[#cdd3df] underline-offset-4 hover:text-primary">
                        {source.title}<ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                  {post.relatedLinks.map((link) => (
                    <li key={link.href}>
                      <Link to={link.href} className="text-sm leading-6 text-[#62697a] underline decoration-[#cdd3df] underline-offset-4 hover:text-primary">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            </article>
          </div>
        </div>

        <section aria-labelledby="related-guides" className="border-t border-[#dfe3ed] bg-[#f7f8fc] px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Seguir leyendo</p>
                <h2 id="related-guides" className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Otras guías para tu operación</h2>
              </div>
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-[#434a5c] hover:text-primary">Ver todas <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
            <div className="mt-9 grid gap-px overflow-hidden border border-[#dfe3ed] bg-[#dfe3ed] md:grid-cols-2">
              {relatedPosts.map((related) => (
                <Link key={related.slug} to={`/blog/${related.slug}`} className="group bg-white p-7 transition-colors hover:bg-[#fbfcff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:p-9">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{related.category}</p>
                  <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.035em] group-hover:text-primary">{related.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#62697a]">{related.excerpt}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#303241]">Leer guía <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const formatDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)));
};
