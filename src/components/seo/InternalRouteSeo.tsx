import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import internalRoutes from "@/content/internalRouteSeo.json";

/** Metadata only: no redirects, events or changes to the conversion flow. */
export function InternalRouteSeo() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/$/, "") as keyof typeof internalRoutes;
  const metadata = internalRoutes[path];
  if (!metadata) return null;

  return (
    <Helmet>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="robots" content="noindex, nofollow, noarchive" />
      <meta name="googlebot" content="noindex, nofollow, noarchive" />
      <link rel="canonical" href={`https://www.ruka.ai${path}`} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      <meta property="og:url" content={`https://www.ruka.ai${path}`} />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
    </Helmet>
  );
}
