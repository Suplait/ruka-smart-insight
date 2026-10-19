import { Helmet } from "react-helmet";
import { webinarBody, webinarDescription, webinarStyles, webinarTitle } from "@/content/retiredWebinar.mjs";

export default function WebinarExpired() {
  return (
    <>
      <Helmet>
        <title>{webinarTitle}</title>
        <meta name="description" content={webinarDescription} />
        <meta name="robots" content="noindex, nofollow, noarchive" />
        <style>{webinarStyles}</style>
      </Helmet>
      {/* Fixed first-party markup, shared with the server's 410 response. */}
      <div dangerouslySetInnerHTML={{ __html: webinarBody }} />
    </>
  );
}
