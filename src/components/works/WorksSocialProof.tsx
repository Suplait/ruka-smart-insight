import { Quote } from "lucide-react";
import { customerLogos } from "@/content/customerLogos";
import { worksContent } from "@/content/worksContent";
import { WorksReveal } from "@/components/works/WorksReveal";

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
    <section id="prueba-social" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <WorksReveal className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <h2 className="max-w-4xl text-balance text-[clamp(2.4rem,5vw,5.15rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[#171827]">
            {worksContent.proof.title}
          </h2>
          <blockquote className="border-l border-[#cfd5e4] pl-6">
            <Quote className="h-5 w-5 text-[#5369eb]" />
            <p className="mt-4 text-base leading-7 text-[#4e5466]">“{worksContent.proof.quote}”</p>
            <footer className="mt-4 text-sm">
              <strong className="font-semibold text-[#242635]">{worksContent.proof.author}</strong>
              <span className="ml-2 text-[#7a8090]">{worksContent.proof.role}</span>
            </footer>
          </blockquote>
        </WorksReveal>

        <WorksReveal className="social-proof-marquee mt-16 border-y border-[#e3e6ed] py-5" amount={0.1}>
          <div className="social-proof-track" role="list" aria-label="Empresas que trabajan con Ruka">
            <LogoGroup />
            <LogoGroup hidden />
          </div>
        </WorksReveal>
      </div>
    </section>
  );
}
