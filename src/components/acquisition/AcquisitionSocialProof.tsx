import { customerLogos } from "@/content/customerLogos";

function LogoGroup({ decorative = false }: { decorative?: boolean }) {
  return (
    <div className="social-proof-logo-group" aria-hidden={decorative || undefined}>
      {customerLogos.map((logo) => (
        <div key={`${decorative ? "duplicate-" : ""}${logo.name}`} className="social-proof-logo" title={decorative ? undefined : logo.name}>
          <img
            src={logo.image}
            alt={decorative ? "" : logo.name}
            loading="eager"
            className={`social-proof-logo-image ${logo.className}`}
          />
        </div>
      ))}
    </div>
  );
}

export function AcquisitionSocialProof() {
  return (
    <section aria-labelledby="acquisition-social-proof-title" className="border-y border-[#dce3f2] py-8 sm:py-9">
      <h2
        id="acquisition-social-proof-title"
        className="max-w-2xl text-balance text-sm font-semibold leading-6 text-[#454c60] sm:text-base sm:leading-7"
      >
        Ruka ya procesa millones de registros operativos para cientos de empresas.
      </h2>

      <div className="social-proof-marquee mt-5">
        <div className="social-proof-track">
          <LogoGroup />
          <LogoGroup decorative />
        </div>
      </div>
    </section>
  );
}
