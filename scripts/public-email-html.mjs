// Cloudflare's documented per-address opt-out. Only existing public legal
// contacts are affected; no zone setting or customer content is changed.
export function preservePublicEmails(html, route) {
  if (!["/privacy", "/terms"].includes(route)) return html;
  return html.replace(/(<a\b[^>]*\bhref="mailto:[^"]+"[^>]*>[\s\S]*?<\/a>)/g, "<!--email_off-->$1<!--/email_off-->");
}
