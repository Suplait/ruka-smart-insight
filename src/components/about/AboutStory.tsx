import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { storyChapters, type StoryChapter as StoryChapterType } from "@/content/aboutStory";
import { AboutReveal, EditorialImage } from "./AboutMotion";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

function StoryMetrics({ chapter }: { chapter: StoryChapterType }) {
  if (!chapter.metrics?.length) return null;

  return (
    <dl
      className={`mt-12 grid border-y ${
        chapter.dark ? "border-white/15" : "border-[#ccd3e1]"
      } ${chapter.metrics.length === 1 ? "grid-cols-1" : "sm:grid-cols-3"}`}
    >
      {chapter.metrics.map((metric, index) => (
        <div
          key={`${chapter.id}-${metric.value}`}
          className={`py-7 sm:py-9 ${
            index > 0
              ? chapter.dark
                ? "border-t border-white/15 sm:border-l sm:border-t-0 sm:pl-8"
                : "border-t border-[#ccd3e1] sm:border-l sm:border-t-0 sm:pl-8"
              : ""
          }`}
        >
          <dt className={`text-sm leading-6 ${chapter.dark ? "text-white/60" : "text-[#656c7f]"}`}>
            {metric.label}
          </dt>
          <dd
            className={`order-first mb-2 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl ${
              chapter.dark ? "text-white" : "text-[#171827]"
            }`}
          >
            {metric.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function StoryChapter({ chapter }: { chapter: StoryChapterType }) {
  const reduceMotion = useReducedMotion();
  const motionEnabled = typeof window !== "undefined" && !reduceMotion;
  const content = (
    <div className={chapter.dark ? "mx-auto max-w-4xl" : ""}>
      <AboutReveal>
        <p className={`text-xs font-semibold tracking-[0.14em] ${chapter.dark ? "text-[#8798ff]" : "text-primary"}`}>
          {chapter.eyebrow}
        </p>
        <h3
          className={`mt-5 max-w-4xl text-4xl font-semibold leading-[1.06] tracking-[-0.04em] sm:text-5xl lg:text-6xl ${
            chapter.dark ? "text-white" : "text-[#171827]"
          }`}
        >
          {chapter.title}
        </h3>
      </AboutReveal>

      {chapter.dark && (
        <motion.div
          className="my-12 flex items-end gap-5 border-l-2 border-[#6278f5] pl-6 sm:my-16 sm:pl-9"
          initial={motionEnabled ? { opacity: 0, x: -18 } : false}
          whileInView={motionEnabled ? { opacity: 1, x: 0 } : undefined}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <span className="text-7xl font-semibold tracking-[-0.06em] text-white sm:text-8xl">$0</span>
          <span className="max-w-[12rem] pb-2 text-sm leading-5 text-white/50">
            ventas de Etiner al comenzar la pandemia
          </span>
        </motion.div>
      )}

      <div className={`mt-10 grid gap-6 text-[1.0625rem] leading-8 ${chapter.dark ? "text-white/70" : "text-[#4f5669]"}`}>
        {chapter.paragraphs.map((paragraph, index) => (
          <AboutReveal key={paragraph} delay={Math.min(index, 3) * 0.04}>
            <p>{paragraph}</p>
          </AboutReveal>
        ))}
      </div>

      <StoryMetrics chapter={chapter} />

      <div className={`mt-12 grid gap-8 ${chapter.images.length > 1 ? "md:grid-cols-2" : ""}`}>
        {chapter.images.map((image, index) => (
          <EditorialImage
            key={image.src}
            {...image}
            delay={index * 0.08}
            className={index % 2 === 1 ? "md:mt-16" : ""}
            mediaClassName={image.presentation === "document" ? "border border-[#d7deea] bg-[#e9edf5]" : undefined}
            imageClassName={`h-full w-full ${
              image.presentation === "document" ? "object-contain p-3 sm:p-5" : "object-cover"
            } ${chapter.images.length > 1 ? "aspect-[4/3]" : "aspect-[16/9]"}`}
          />
        ))}
      </div>

      {chapter.id === "encontrar-ruka" && (
        <AboutReveal className="mt-14 border-y border-[#cbd3e3] py-9 sm:py-11">
          <div className="grid gap-3 text-sm font-semibold tracking-[0.08em] text-[#656c7f] sm:grid-cols-[repeat(7,auto)] sm:items-center sm:justify-between">
            {[
              "SOURCING",
              "→",
              "DATOS",
              "→",
              "AUTOMATIZACIÓN",
              "→",
              "TRABAJO OPERATIVO",
            ].map((item, index) => (
              <span key={`${item}-${index}`} className={item === "TRABAJO OPERATIVO" ? "text-primary" : ""}>
                {item}
              </span>
            ))}
          </div>
        </AboutReveal>
      )}
    </div>
  );

  if (chapter.dark) {
    return (
      <article
        id={chapter.id}
        data-story-chapter={chapter.number}
        className="relative left-1/2 my-20 w-screen -translate-x-1/2 bg-[#171827] px-6 py-20 sm:px-8 sm:py-28 lg:my-28 lg:py-32"
      >
        {content}
      </article>
    );
  }

  return (
    <article id={chapter.id} data-story-chapter={chapter.number} className="scroll-mt-32 py-16 sm:py-24 lg:py-28">
      {content}
    </article>
  );
}

export function AboutStory() {
  const [activeChapter, setActiveChapter] = useState("01");

  useEffect(() => {
    const chapters = Array.from(document.querySelectorAll<HTMLElement>("[data-story-chapter]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const chapter = visible?.target.getAttribute("data-story-chapter");
        if (chapter) setActiveChapter(chapter);
      },
      { rootMargin: "-25% 0px -55%", threshold: [0, 0.15, 0.35, 0.6] },
    );

    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="historia" aria-labelledby="story-heading" className="overflow-clip bg-[#fbfcff]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="border-t border-[#cdd4e2] pt-20 sm:pt-28">
          <AboutReveal className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.14em] text-primary">NUESTRA HISTORIA</p>
            <h2 id="story-heading" className="mt-5 text-4xl font-semibold leading-[1.06] tracking-[-0.04em] text-[#171827] sm:text-6xl">
              Cuatro capítulos. La misma obsesión por entender el problema real.
            </h2>
          </AboutReveal>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16">
          <aside className="hidden lg:block" aria-label="Capítulos de la historia">
            <div className="sticky top-32 border-l border-[#cdd4e2] pl-5">
              <p className="mb-5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#80879a]">Capítulos</p>
              <ol className="space-y-4">
                {storyChapters.map((chapter) => {
                  const active = activeChapter === chapter.number;
                  return (
                    <li key={chapter.id}>
                      <a
                        href={`#${chapter.id}`}
                        aria-current={active ? "step" : undefined}
                        className={`group grid grid-cols-[2rem_1fr] gap-2 text-sm transition-colors ${
                          active ? "text-[#171827]" : "text-[#8a90a0] hover:text-[#4f5669]"
                        }`}
                      >
                        <span className={`font-semibold ${active ? "text-primary" : ""}`}>{chapter.number}</span>
                        <span className="leading-5">{chapter.eyebrow.split(" · ")[1]}</span>
                      </a>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>

          <div className="min-w-0">
            {storyChapters.map((chapter) => (
              <StoryChapter key={chapter.id} chapter={chapter} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
