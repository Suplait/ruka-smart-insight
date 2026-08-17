import { ArrowDown, ArrowRight, ArrowUpRight, Building2, MapPin } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { AboutFounders } from "@/components/about/AboutFounders";
import { AboutReveal, EditorialImage } from "@/components/about/AboutMotion";
import { AboutStory } from "@/components/about/AboutStory";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { AboutSeo } from "@/components/seo/AboutSeo";
import organization from "@/content/organization.json";

const principles = [
  {
    number: "01",
    title: "Ir al problema",
    copy: "Nuestras mejores decisiones aparecieron hablando con usuarios o metiéndonos directamente donde ocurría el problema.",
  },
  {
    number: "02",
    title: "No enamorarnos de la solución",
    copy: "PortSalud murió. Etiner tuvo que detenerse. Suplait no estaba creciendo. Aprendimos que cambiar de dirección a tiempo también es parte del trabajo.",
  },
  {
    number: "03",
    title: "La tecnología tiene que hacer trabajo",
    copy: "No queremos agregar otra herramienta a los sistemas de una empresa. Queremos sacar trabajo manual del equipo.",
  },
] as const;

const supportOrganizations = [
  { name: "Microsoft", image: "/microsoft2.png", width: 1644, height: 351, className: "max-h-10 sm:max-h-12" },
  { name: "500 Global", image: "/500logo.png", width: 350, height: 351, className: "max-h-11 sm:max-h-14" },
  { name: "Start-Up Chile", image: "/supporters/startup-chile.svg", width: 254, height: 23, className: "max-h-10 sm:max-h-12" },
  { name: "CORFO", image: "/logocorfo.png", width: 500, height: 146, className: "max-h-10 sm:max-h-12" },
] as const;

const operatingWords = ["REGISTRAR", "CRUZAR", "CONCILIAR", "ACTUALIZAR", "CALCULAR"] as const;

function HeroCollage() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const rukaPhotoY = useTransform(scrollYProgress, [0, 0.22], [0, -22]);
  const etinerPhotoY = useTransform(scrollYProgress, [0, 0.22], [0, -34]);

  return (
    <div className="relative min-h-[29rem] sm:min-h-[38rem] lg:min-h-[39rem]">
      <motion.div className="absolute right-0 top-0 z-10 w-[78%] sm:w-[72%]" style={{ y: reduceMotion ? 0 : rukaPhotoY }}>
        <EditorialImage
          src="/about/story/founders-ruka.webp"
          alt="Camilo, Enzo, Lorenzo y Benjamín, los cuatro fundadores de Ruka"
          caption="Ruka · hoy"
          width={1000}
          height={1000}
          loading="eager"
          imageClassName="aspect-square h-full w-full object-cover"
        />
      </motion.div>
      <motion.div className="absolute bottom-2 left-0 z-20 w-[61%] sm:bottom-0 sm:w-[56%]" style={{ y: reduceMotion ? 0 : etinerPhotoY }}>
        <EditorialImage
          src="/about/story/etiner-founders.webp"
          alt="Los cuatro fundadores de Ruka presentando Etiner"
          caption="Etiner · ahí ya estábamos los cuatro"
          width={1024}
          height={632}
          loading="eager"
          imageClassName="aspect-[16/10] h-full w-full object-cover"
          delay={0.12}
        />
      </motion.div>
    </div>
  );
}

function AboutHero() {
  return (
    <header className="relative overflow-hidden bg-[#fbfcff] pb-24 pt-36 sm:pb-32 sm:pt-44 lg:pb-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#dce3f2]" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-16 px-6 sm:px-8 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:gap-20">
        <div>
          <AboutReveal>
            <p className="text-xs font-semibold tracking-[0.16em] text-primary">QUIÉNES SOMOS</p>
          </AboutReveal>
          <AboutReveal delay={0.05}>
            <h1 className="mt-6 text-[clamp(3.7rem,7vw,6rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-[#171827]">
              No empezamos con Ruka.
            </h1>
          </AboutReveal>
          <AboutReveal delay={0.1}>
            <p className="mt-10 max-w-2xl text-2xl font-medium leading-[1.2] tracking-[-0.025em] text-[#30364a] sm:text-3xl">
              Llegamos hasta acá después de casi una década construyendo, equivocándonos y volviendo a empezar.
            </p>
          </AboutReveal>
          <AboutReveal delay={0.15}>
            <p className="mt-7 max-w-xl text-[1.0625rem] leading-8 text-[#5b6275]">
              Somos los cuatro fundadores detrás de Ruka. Antes hubo turismo, una pandemia, una agencia, Suplait y más de una vez en que tuvimos que cambiar de dirección. Cada etapa dejó algo dentro de lo que construimos hoy.
            </p>
          </AboutReveal>
          <AboutReveal delay={0.2} className="mt-10">
            <a
              href="#historia"
              className="inline-flex items-center gap-3 text-sm font-semibold text-[#3b4255] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
            >
              Leer la historia <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </AboutReveal>
        </div>

        <HeroCollage />
      </div>
    </header>
  );
}

function EditorialIntro() {
  return (
    <section aria-labelledby="intro-heading" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid gap-12 border-y border-[#ccd3e1] py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24 lg:py-24">
          <AboutReveal>
            <h2 id="intro-heading" className="text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#171827] sm:text-7xl">
              Los productos cambiaron.
              <br />
              <span className="text-primary">Nosotros seguimos juntos.</span>
            </h2>
          </AboutReveal>
          <AboutReveal delay={0.08} className="lg:self-end">
            <p className="text-lg leading-8 text-[#50576a]">
              Nuestra historia como equipo empezó antes de que existiera Ruka. Cambiamos de industria, producto, modelo de negocio y país más de una vez. Los cuatro seguimos acá.
            </p>
          </AboutReveal>
        </div>

        <AboutReveal className="grid gap-6 border-b border-[#ccd3e1] py-7 text-xs font-semibold uppercase tracking-[0.12em] text-[#656c7f] sm:grid-cols-3 sm:items-center">
          <span>Casi una década construyendo juntos</span>
          <span>4 fundadores</span>
          <span>Producto · Tecnología · Growth · Operaciones · Finanzas</span>
        </AboutReveal>
      </div>
    </section>
  );
}

function Principles() {
  return (
    <section aria-labelledby="principles-heading" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <AboutReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary">LO QUE NOS QUEDÓ DE TODO ESO</p>
          <h2 id="principles-heading" className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-[#171827] sm:text-6xl">
            Hay cosas que aprendimos más de una vez.
          </h2>
        </AboutReveal>

        <div className="mt-16 border-t border-[#cbd3e2]">
          {principles.map((principle, index) => (
            <AboutReveal key={principle.number} delay={index * 0.06}>
              <article className="grid gap-5 border-b border-[#cbd3e2] py-9 sm:grid-cols-[5rem_0.9fr_1.1fr] sm:items-start sm:gap-8 sm:py-12">
                <span className="text-sm font-semibold text-primary">{principle.number}</span>
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#171827] sm:text-3xl">{principle.title}</h3>
                <p className="max-w-2xl text-base leading-7 text-[#596073]">{principle.copy}</p>
              </article>
            </AboutReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrganizationSection() {
  return (
    <section aria-labelledby="organization-heading" className="bg-[#fbfcff] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid gap-14 border-y border-[#ccd3e1] py-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:py-20">
          <AboutReveal>
            <p className="text-xs font-semibold tracking-[0.14em] text-primary">RUKA.AI</p>
            <h2 id="organization-heading" className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#171827] sm:text-5xl">
              Desde Santiago estamos construyendo Ruka para automatizar trabajo operativo real.
            </h2>
          </AboutReveal>
          <AboutReveal delay={0.08} className="grid gap-8 sm:grid-cols-2">
            <div>
              <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
              <p className="mt-4 font-semibold text-[#171827]">Santiago, Chile</p>
              <p className="mt-2 text-sm leading-6 text-[#62697b]">{organization.addresses[0].streetAddress}, {organization.addresses[0].addressLocality}</p>
            </div>
            <div>
              <Building2 className="h-5 w-5 text-primary" aria-hidden="true" />
              <p className="mt-4 font-semibold text-[#171827]">Identidad pública</p>
              <div className="mt-2 flex flex-col items-start gap-2 text-sm text-[#62697b]">
                <a className="underline decoration-[#bdc4d2] underline-offset-4 hover:text-primary" href="https://www.ruka.ai/">ruka.ai</a>
                <a className="inline-flex items-center gap-1 underline decoration-[#bdc4d2] underline-offset-4 hover:text-primary" href="https://www.linkedin.com/company/rukaai/" target="_blank" rel="noopener noreferrer">
                  LinkedIn oficial <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </AboutReveal>
        </div>

        <AboutReveal className="pt-20 text-center sm:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#72798b]">Organizaciones que han sido parte del camino</p>
          <div className="mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-12">
            {supportOrganizations.map((item) => (
              <div key={item.name} className="flex min-h-16 items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  decoding="async"
                  className={`w-auto max-w-[10rem] object-contain opacity-45 grayscale ${item.className}`}
                />
              </div>
            ))}
          </div>
        </AboutReveal>
      </div>
    </section>
  );
}

function ClosingSection() {
  const reduceMotion = useReducedMotion();
  const motionEnabled = typeof window !== "undefined" && !reduceMotion;

  return (
    <section aria-labelledby="closing-heading" className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-24">
          <AboutReveal>
            <p className="text-xs font-semibold tracking-[0.14em] text-primary">HOY</p>
            <h2 id="closing-heading" className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-[#171827] sm:text-6xl">
              La historia cambió varias veces. El problema se volvió cada vez más claro.
            </h2>
            <div className="mt-7 max-w-2xl space-y-4 text-lg leading-8 text-[#596073]">
              <p>Las empresas ya tienen software, datos y sistemas.</p>
              <p>Aun así, una enorme cantidad de trabajo sigue ocurriendo manualmente entre ellos.</p>
              <p>Para eso estamos construyendo Ruka.</p>
            </div>
          </AboutReveal>

          <div className="border-l border-[#ccd3e1] pl-6 sm:pl-10">
            {operatingWords.map((word, index) => (
              <motion.p
                key={word}
                className="border-b border-[#d6dce8] py-4 text-2xl font-semibold tracking-[-0.025em] text-[#747b8d] sm:text-3xl"
                initial={motionEnabled ? { opacity: 0, x: 26 } : false}
                whileInView={motionEnabled ? { opacity: 1, x: 0 } : undefined}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.58, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.p>
            ))}
          </div>
        </div>

        <AboutReveal className="mt-24 border-y border-[#cbd3e2] py-14 sm:mt-32 sm:py-20">
          <p className="max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-[#171827] sm:text-7xl lg:text-[6rem]">
            Tu empresa ya tiene los sistemas.
            <br />
            <span className="text-primary">Ruka hace el trabajo que queda entre medio.</span>
          </p>
        </AboutReveal>

        <AboutReveal className="mt-16 grid gap-8 bg-[#eef1ff] px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-primary">ESTA ES LA HISTORIA QUE NOS TRAJO HASTA ACÁ</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#171827] sm:text-4xl">Esto es lo que estamos construyendo ahora.</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/#demo"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
            >
              Ver Ruka en acción <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/register"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#c5cde0] bg-white px-6 text-sm font-semibold text-[#30364a] transition-colors hover:border-primary/35 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
            >
              Agendar 30 min
            </Link>
          </div>
        </AboutReveal>
      </div>
    </section>
  );
}

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#fbfcff] text-[#171827]">
      <AboutSeo />
      <Navbar />
      <main>
        <AboutHero />
        <EditorialIntro />
        <AboutStory />
        <Principles />
        <AboutFounders />
        <OrganizationSection />
        <ClosingSection />
      </main>
      <Footer />
    </div>
  );
}
