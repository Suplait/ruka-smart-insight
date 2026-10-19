import { webinarHtml } from "../src/content/retiredWebinar.mjs";

// A retired event is not a redirect and must not accept new registrations.
// No cookies, database access, secrets, request data or third-party services.
export default function handler(request, response) {
  response.statusCode = 410;
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.setHeader("Cache-Control", "public, max-age=300");
  response.end(request.method === "HEAD" ? undefined : webinarHtml);
}
