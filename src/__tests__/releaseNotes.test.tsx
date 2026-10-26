// @vitest-environment node
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Helmet } from "react-helmet";
import Updates from "@/pages/Updates";
import { releaseNotes } from "@/content/releaseNotes";
import pageModified from "@/content/pageModified.json";

describe("published release notes", () => {
  it("links every change to an actual indexable resource and uses real dates", () => {
    for (const note of releaseNotes) {
      expect(note.date).toBe("2026-10-26");
      for (const change of note.changes) expect(Object.keys(pageModified)).toContain(change.href);
    }
  });
  it("has complete server content, no private QA results or promised rollout", () => {
    const html = renderToString(<StaticRouter location="/novedades"><Updates /></StaticRouter>);
    Helmet.renderStatic();
    expect(html).toContain("Lo nuevo. Y para qué te sirve.");
    expect(html).toContain("no cambian tu plan");
    expect(html).not.toMatch(/127 ejemplos|57 verificaciones|mock|tupana-2026|supabase/i);
    for (const note of releaseNotes) expect(html).toContain(note.title);
  });
});
