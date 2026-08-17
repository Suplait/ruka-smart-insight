import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { currentTeam, founders, type AboutPerson } from "@/content/aboutTeam";
import { AboutReveal } from "./AboutMotion";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

function Expertise({ items, dark = false }: { items: readonly string[]; dark?: boolean }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2" aria-label="Áreas de experiencia">
      {items.map((item) => (
        <li
          key={item}
          className={`text-xs font-semibold uppercase tracking-[0.1em] ${dark ? "text-white/50" : "text-[#747b8d]"}`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function FounderProfile({ person, index }: { person: AboutPerson; index: number }) {
  const reduceMotion = useReducedMotion();
  const motionEnabled = typeof window !== "undefined" && !reduceMotion;

  return (
    <motion.article
      className="group border-t border-[#cbd3e2] pt-5"
      initial={motionEnabled ? { opacity: 0, y: 24 } : false}
      whileInView={motionEnabled ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.68, delay: (index % 4) * 0.06, ease: easeOut }}
    >
      <div className="aspect-[4/5] overflow-hidden bg-[#e9ebf1]">
        <motion.img
          src={person.image}
          alt={`Retrato de ${person.name}, ${person.role} de Ruka`}
          width={person.imageWidth}
          height={person.imageHeight}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top grayscale-[0.12]"
          whileHover={motionEnabled ? { scale: 1.02 } : undefined}
          transition={{ duration: 0.55, ease: easeOut }}
        />
      </div>

      <div className="pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{person.role}</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#171827]">{person.name}</h3>
        <p className="mt-4 text-[0.96rem] leading-7 text-[#555c6e]">{person.bio}</p>
        <Expertise items={person.expertise} />
        <a
          href={person.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`LinkedIn de ${person.name}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#30364a] underline decoration-[#b9c1d2] underline-offset-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
        >
          Ver LinkedIn <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  );
}

function TeamProfile({ person, index }: { person: AboutPerson; index: number }) {
  const reduceMotion = useReducedMotion();
  const motionEnabled = typeof window !== "undefined" && !reduceMotion;
  const initials = person.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <motion.article
      className="grid grid-cols-[5rem_1fr] gap-5 border-t border-[#cbd3e2] py-7 sm:grid-cols-[6rem_1fr]"
      initial={motionEnabled ? { opacity: 0, x: -16 } : false}
      whileInView={motionEnabled ? { opacity: 1, x: 0 } : undefined}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.62, delay: index * 0.06, ease: easeOut }}
    >
      {person.image ? (
        <img
          src={person.image}
          alt={`Retrato de ${person.name}`}
          width={person.imageWidth}
          height={person.imageHeight}
          loading="lazy"
          decoding="async"
          className="aspect-square w-full object-cover grayscale-[0.16]"
        />
      ) : (
        <div
          className="grid aspect-square w-full place-items-center border border-[#cbd3e2] bg-[#eef1f7] text-xl font-semibold tracking-[-0.03em] text-[#30364a]"
          aria-hidden="true"
        >
          {initials}
        </div>
      )}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.11em] text-primary">{person.role}</p>
        <h3 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[#171827]">{person.name}</h3>
        <p className="mt-3 text-sm leading-6 text-[#5c6375]">{person.bio}</p>
        <Expertise items={person.expertise} />
        <a
          href={person.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`LinkedIn de ${person.name}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#3d4457] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
        >
          LinkedIn <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  );
}

export function AboutPeople() {
  return (
    <>
      <section id="founders" aria-labelledby="founders-heading" className="bg-[#f4f5f8] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <AboutReveal className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.14em] text-primary">FOUNDERS</p>
            <h2 id="founders-heading" className="mt-5 text-4xl font-semibold leading-[1.06] tracking-[-0.04em] text-[#171827] sm:text-6xl">
              Los cuatro que empezaron esto.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#596073]">Casi una década después, seguimos construyendo juntos.</p>
          </AboutReveal>

          <div className="mt-16 grid gap-x-7 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            {founders.map((founder, index) => (
              <FounderProfile key={founder.name} person={founder} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="equipo" aria-labelledby="team-heading" className="bg-white py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <AboutReveal className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-xs font-semibold tracking-[0.14em] text-primary">EL EQUIPO</p>
            <h2 id="team-heading" className="mt-5 text-4xl font-semibold leading-[1.06] tracking-[-0.04em] text-[#171827] sm:text-6xl">
              La gente que construye Ruka hoy.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#5b6275]">
              Producto, ingeniería, IA, operaciones, experiencia de clientes y growth trabajando sobre los mismos problemas que vemos todos los días con nuestros clientes.
            </p>
          </AboutReveal>

          <div>
            {currentTeam.map((person, index) => (
              <TeamProfile key={person.name} person={person} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
