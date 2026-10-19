// @vitest-environment node
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Helmet } from "react-helmet";
import { BlogPostSeo } from "@/components/blog/BlogSeo";
import { blogPosts } from "@/content/blog/posts";
import { blogAuthor, blogAuthorSchema } from "@/content/blog/author";
import { AboutFounders } from "@/components/about/AboutFounders";
import { socialPreview } from "@/utils/socialPreview";
import pageModified from "@/content/pageModified.json";
import { preservePublicEmails } from "../../scripts/public-email-html.mjs";

describe("editorial identity and discovery", () => {
  it("credits the approved real author on every published article", () => {
    for (const post of blogPosts) {
      expect(post.author).toEqual({ name: blogAuthor.name, url: blogAuthor.url });
      expect(post.subject.length).toBeGreaterThan(10);
      renderToString(<BlogPostSeo post={post} />);
      const head = Helmet.renderStatic().script.toString();
      expect(head).toContain('"@type":"Person"');
      expect(head).toContain('"about":{"@type":"Thing","name":');
      expect(head).toContain('"jobTitle":"CEO y Founder de Ruka"');
      expect(head).not.toContain("Equipo Ruka");
      expect(post.dateModified >= post.datePublished).toBe(true);
    }
    expect(blogAuthorSchema.sameAs[0]).toMatch(/^https:\/\/www.linkedin.com\/in\//);
  });

  it("links the author identity to a real visible profile anchor", () => {
    const html = renderToString(<StaticRouter location="/about"><AboutFounders /></StaticRouter>);
    expect(html).toContain('id="founder-1"');
    expect(html).toContain("Camilo Silva");
  });

  it("does not replace the home or One preview", () => {
    expect(socialPreview("/")).toBeUndefined();
    expect(socialPreview("/one")).toBeUndefined();
    expect(socialPreview("/productos/stock")?.image).toBe("/og/productos/stock.png");
  });

  it("stores editorial dates independently from the build clock", () => {
    for (const date of Object.values(pageModified)) {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(date))).toBe(false);
    }
    expect(pageModified["/one"]).toBe("2026-10-08");
  });
});

describe("public email preservation", () => {
  const anchor = '<a href="mailto:privacidad@ruka.ai" class="contact">privacidad@ruka.ai</a>';
  it("opts only legal-page public contacts out of Cloudflare obfuscation", () => {
    expect(preservePublicEmails(anchor, "/privacy")).toBe(`<!--email_off-->${anchor}<!--/email_off-->`);
    expect(preservePublicEmails(anchor, "/terms")).toContain("<!--email_off-->");
    expect(preservePublicEmails(anchor, "/register")).toBe(anchor);
  });
  it("leaves other links, text and form markup intact", () => {
    const other = '<a href="/register">Conversemos</a><form id="registration"><input name="email"/></form>';
    expect(preservePublicEmails(other, "/privacy")).toBe(other);
  });
});
