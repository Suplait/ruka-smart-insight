import { JSDOM } from "jsdom";

// Structured data is not page content. Closed accordions/details are retained:
// their answers exist in HTML and can be disclosed by the reader.
export function bodyText(html) {
  const { document } = new JSDOM(html).window;
  document.querySelectorAll("script, style, template").forEach((node) => node.remove());
  return document.body.textContent.replace(/\s+/g, " ").trim();
}

export const normalizeText = (value) => value.replace(/\s+/g, " ").trim();
