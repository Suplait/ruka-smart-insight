import { customerLogos } from "@/content/customerLogos";
import { worksContent } from "@/content/worksContent";

function LogoGroup({ hidden }: { hidden?: boolean }) {
  return (
    <div className="social-proof-logo-group" aria-hidden={hidden || undefined}>
      {customerLogos.map((logo) => (
        <div key={`${hidden ? "duplicate-" : ""}${logo.name}`} className="social-proof-logo">
          <img
            src={logo.image}
            alt={hidden ? "" : logo.name}
            loading="lazy"
            className={`social-proof-logo-image ${logo.className}`}
          />
        </div>
      ))}
    </div>
  );
}

export function WorksSocialProof() {
  return (
    <section id="prueba-social" className="border-y border-[#e1e4ea] bg-white px-5 py-12 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-4xl text-balance text-[28px] font-semibold leading-[1.12] tracking-[-0.025em] text-[#202230] sm:text-[36px]">
          {worksContent.proof.title}
        </h2>
        <div className="social-proof-marquee mt-8 overflow-hidden" aria-label="Empresas que trabajan con Ruka">
          <div className="social-proof-track" role="list">
            <LogoGroup />
            <LogoGroup hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
