import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  storyChapters,
  type StoryBlock,
  type StoryChapter as StoryChapterType,
  type StoryImage as StoryImageType,
  type StoryMetric,
} from "@/content/aboutStory";
import { AboutReveal, EditorialImage } from "./AboutMotion";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const aspectClass = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
  wide: "aspect-video",
  natural: "",
} as const;

function StoryCopy({
  paragraphs,
  lead,
  dark,
}: {
  paragraphs: readonly string[];
  lead?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={`mx-auto max-w-3xl space-y-6 ${lead ? "mt-11 sm:mt-14" : "mt-10 sm:mt-12"}`}>
      {paragraphs.map((paragraph, index) => (
        <AboutReveal key={paragraph} delay={Math.min(index, 3) * 0.035}>
          <p
            className={`${
              lead && index === 0
                ? "text-xl font-medium leading-8 tracking-[-0.015em] sm:text-2xl sm:leading-9"
                : "text-[1.0625rem] leading-8"
            } ${dark ? "text-white/75" : "text-[#4f5669]"}`}
          >
            {paragraph}
          </p>
        </AboutReveal>
      ))}
    </div>
  );
}

function StoryImage({
  image,
  size = "full",
  align = "left",
  dark,
}: {
  image: StoryImageType;
  size?: "full" | "medium";
  align?: "left" | "right";
  dark?: boolean;
}) {
  const isDocument = image.presentation === "document";
  const natural = image.aspect === "natural";
  const widthClass = size === "medium" ? "max-w-3xl" : "max-w-5xl";
  const alignClass = align === "right" ? "ml-auto" : "mr-auto";

  return (
    <EditorialImage
      {...image}
      presentation={image.presentation}
      className={`mt-12 sm:mt-16 ${widthClass} ${alignClass}`}
      mediaClassName={
        isDocument
          ? `border ${dark ? "border-white/15 bg-white/5" : "border-[#d7deea] bg-[#f0f2f7]"} p-2 sm:p-4`
          : dark
            ? "bg-white/5"
            : undefined
      }
      imageClassName={`${natural ? "h-auto" : "h-full"} w-full ${
        isDocument ? "object-contain" : "object-cover"
      } ${aspectClass[image.aspect ?? "landscape"]}`}
    />
  );
}

function StoryGallery({
  images,
  layout,
  dark,
}: {
  images: readonly StoryImageType[];
  layout?: "balanced" | "portrait-document";
  dark?: boolean;
}) {
  return (
    <div
      className={`mt-12 grid gap-8 sm:mt-16 md:items-start ${
        layout === "portrait-document" ? "md:grid-cols-[0.78fr_1.22fr]" : "md:grid-cols-2"
      }`}
    >
      {images.map((image, index) => (
        <EditorialImage
          key={image.src}
          {...image}
          presentation={image.presentation}
          delay={index * 0.08}
          className={index === 1 && layout === "portrait-document" ? "md:mt-16" : ""}
          mediaClassName={
            image.presentation === "document"
              ? `border p-2 sm:p-4 ${dark ? "border-white/15 bg-white/5" : "border-[#d7deea] bg-[#f0f2f7]"}`
              : undefined
          }
          imageClassName={`${image.aspect === "natural" ? "h-auto" : "h-full"} w-full ${
            image.presentation === "document" ? "object-contain" : "object-cover"
          } ${aspectClass[image.aspect ?? "landscape"]}`}
        />
      ))}
    </div>
  );
}

function StoryQuote({ text, context, dark }: { text: string; context?: string; dark?: boolean }) {
  const reduceMotion = useReducedMotion();
  const motionEnabled = typeof window !== "undefined" && !reduceMotion;

  return (
    <AboutReveal className="mx-auto mt-12 max-w-4xl sm:mt-16">
      <blockquote className={`relative border-l pl-6 sm:pl-10 ${dark ? "border-white/20" : "border-[#cbd3e2]"}`}>
        <motion.span
          className={`absolute inset-y-0 left-[-1px] w-[2px] origin-top ${dark ? "bg-[#8798ff]" : "bg-primary"}`}
          initial={motionEnabled ? { scaleY: 0 } : false}
          whileInView={motionEnabled ? { scaleY: 1 } : undefined}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: easeOut }}
          aria-hidden="true"
        />
        <p
          className={`text-2xl font-medium leading-[1.3] tracking-[-0.025em] sm:text-3xl sm:leading-[1.25] ${
            dark ? "text-white" : "text-[#202232]"
          }`}
        >
          “{text}”
        </p>
        {context && (
          <footer className={`mt-5 text-sm leading-6 ${dark ? "text-white/50" : "text-[#6a7183]"}`}>
            {context}
          </footer>
        )}
      </blockquote>
    </AboutReveal>
  );
}

function StoryMetrics({ items, dark }: { items: readonly StoryMetric[]; dark?: boolean }) {
  const reduceMotion = useReducedMotion();
  const motionEnabled = typeof window !== "undefined" && !reduceMotion;

  return (
    <dl
      className={`mx-auto mt-12 grid max-w-5xl border-y sm:mt-16 ${dark ? "border-white/15" : "border-[#ccd3e1]"} ${
        items.length === 1 ? "grid-cols-1" : "sm:grid-cols-3"
      }`}
    >
      {items.map((metric, index) => (
        <motion.div
          key={`${metric.value}-${metric.label}`}
          className={`flex flex-col py-7 sm:py-9 ${
            index > 0
              ? dark
                ? "border-t border-white/15 sm:border-l sm:border-t-0 sm:pl-8"
                : "border-t border-[#ccd3e1] sm:border-l sm:border-t-0 sm:pl-8"
              : ""
          }`}
          initial={motionEnabled ? { opacity: 0, y: 14 } : false}
          whileInView={motionEnabled ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.62, delay: index * 0.08, ease: easeOut }}
        >
          <dt className={`order-2 mt-2 text-sm leading-6 ${dark ? "text-white/55" : "text-[#656c7f]"}`}>
            {metric.label}
          </dt>
          <dd
            className={`order-1 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl ${
              dark ? "text-white" : "text-[#171827]"
            }`}
          >
            {metric.value}
          </dd>
        </motion.div>
      ))}
    </dl>
  );
}

function StoryArchive({ block }: { block: Extract<StoryBlock, { type: "archive" }> }) {
  return (
    <section
      aria-label={block.title}
      className="mt-16 border-y border-[#cbd3e2] bg-[#f1f3f7] px-4 py-12 sm:mt-20 sm:px-8 sm:py-16 lg:px-10 lg:py-20"
    >
      <AboutReveal className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">ARCHIVO ETINER</p>
        <h4 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-[#171827] sm:text-5xl">
          {block.title}
        </h4>
        <p className="mt-5 text-base leading-7 text-[#596073] sm:text-lg sm:leading-8">{block.intro}</p>
      </AboutReveal>

      <div className="mt-12 border-t border-[#cbd3e2] sm:mt-16">
        {block.items.map((item, index) => (
          <article
            key={item.image.src}
            className="grid gap-7 border-b border-[#cbd3e2] py-10 sm:py-14 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12"
          >
            <AboutReveal delay={index * 0.04}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-primary">{item.label}</p>
              <h5 className="mt-4 text-xl font-semibold tracking-[-0.025em] text-[#171827] sm:text-2xl">{item.title}</h5>
              <p className="mt-3 text-sm leading-6 text-[#62697b]">{item.description}</p>
            </AboutReveal>
            <EditorialImage
              {...item.image}
              presentation="document"
              delay={0.07 + index * 0.04}
              mediaClassName="border border-[#d5dbe7] bg-white p-2 shadow-[0_16px_50px_rgba(39,48,77,0.06)] sm:p-4"
              imageClassName="h-auto w-full object-contain"
            />
          </article>
        ))}
      </div>
    </section>
  );
}

function StoryTimeline({ items }: { items: Extract<StoryBlock, { type: "timeline" }>["items"] }) {
  const reduceMotion = useReducedMotion();
  const motionEnabled = typeof window !== "undefined" && !reduceMotion;

  return (
    <ol className="relative mx-auto mt-12 max-w-4xl border-l border-white/15 sm:mt-16">
      {items.map((item, index) => (
        <motion.li
          key={item.date}
          className="relative grid gap-2 border-b border-white/10 py-6 pl-7 sm:grid-cols-[9rem_1fr] sm:gap-7 sm:py-7 sm:pl-10"
          initial={motionEnabled ? { opacity: 0, x: -12 } : false}
          whileInView={motionEnabled ? { opacity: 1, x: 0 } : undefined}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.58, delay: index * 0.06, ease: easeOut }}
        >
          <span className="absolute left-[-4px] top-8 h-[7px] w-[7px] rounded-full bg-[#8798ff]" aria-hidden="true" />
          <time className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8798ff]">{item.date}</time>
          <p className="text-base leading-7 text-white/75 sm:text-lg">{item.text}</p>
        </motion.li>
      ))}
    </ol>
  );
}

function StoryEvolution({ steps }: { steps: Extract<StoryBlock, { type: "evolution" }>["steps"] }) {
  return (
    <AboutReveal className="mx-auto mt-14 max-w-5xl border-y border-[#cbd3e3] py-8 sm:mt-16 sm:py-10">
      <div className="grid gap-3 text-xs font-semibold tracking-[0.08em] text-[#656c7f] sm:grid-cols-[repeat(7,auto)] sm:items-center sm:justify-between sm:text-sm">
        {steps.flatMap((step, index) => {
          const nodes = [
            <span key={step} className={index === steps.length - 1 ? "text-primary" : ""}>
              {step}
            </span>,
          ];
          if (index < steps.length - 1) {
            nodes.push(
              <span key={`${step}-arrow`} className="text-[#a2a9ba]" aria-hidden="true">
                →
              </span>,
            );
          }
          return nodes;
        })}
      </div>
    </AboutReveal>
  );
}

function StoryBlockRenderer({ block, dark }: { block: StoryBlock; dark?: boolean }) {
  switch (block.type) {
    case "copy":
      return <StoryCopy paragraphs={block.paragraphs} lead={block.lead} dark={dark} />;
    case "image":
      return <StoryImage image={block.image} size={block.size} align={block.align} dark={dark} />;
    case "gallery":
      return <StoryGallery images={block.images} layout={block.layout} dark={dark} />;
    case "quote":
      return <StoryQuote text={block.text} context={block.context} dark={dark} />;
    case "metrics":
      return <StoryMetrics items={block.items} dark={dark} />;
    case "archive":
      return <StoryArchive block={block} />;
    case "timeline":
      return <StoryTimeline items={block.items} />;
    case "evolution":
      return <StoryEvolution steps={block.steps} />;
    default:
      return null;
  }
}

function StoryChapter({ chapter }: { chapter: StoryChapterType }) {
  const content = (
    <div className={chapter.dark ? "mx-auto max-w-5xl" : ""}>
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

      {chapter.blocks.map((block, index) => (
        <StoryBlockRenderer key={`${chapter.id}-${block.type}-${index}`} block={block} dark={chapter.dark} />
      ))}
    </div>
  );

  if (chapter.dark) {
    return (
      <article
        id={chapter.id}
        data-story-chapter={chapter.number}
        className="relative -mx-6 my-20 scroll-mt-28 overflow-hidden bg-[#171827] px-6 py-20 sm:-mx-8 sm:px-8 sm:py-28 lg:mx-0 lg:my-28 lg:px-12 lg:py-32"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" aria-hidden="true" />
        {content}
      </article>
    );
  }

  return (
    <article id={chapter.id} data-story-chapter={chapter.number} className="scroll-mt-28 py-16 sm:py-24 lg:py-28">
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

  const activeIndex = Math.max(
    0,
    storyChapters.findIndex((chapter) => chapter.number === activeChapter),
  );

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
              <div className="mb-6 flex items-center justify-between text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#80879a]">
                <span>Capítulos</span>
                <span>{activeChapter} / 04</span>
              </div>
              <div className="mb-6 h-px overflow-hidden bg-[#dce1eb]" aria-hidden="true">
                <motion.div
                  className="h-full origin-left bg-primary"
                  animate={{ scaleX: (activeIndex + 1) / storyChapters.length }}
                  transition={{ duration: 0.45, ease: easeOut }}
                />
              </div>
              <ol className="space-y-2">
                {storyChapters.map((chapter) => {
                  const active = activeChapter === chapter.number;
                  return (
                    <li key={chapter.id} className="relative">
                      {active && (
                        <motion.span
                          layoutId="about-active-chapter"
                          className="absolute -left-[21px] top-2 h-7 w-[2px] bg-primary"
                          transition={{ duration: 0.35, ease: easeOut }}
                          aria-hidden="true"
                        />
                      )}
                      <a
                        href={`#${chapter.id}`}
                        aria-current={active ? "step" : undefined}
                        className={`group grid grid-cols-[2rem_1fr] gap-2 py-2 text-sm transition-[color,transform] duration-300 ${
                          active ? "translate-x-1 text-[#171827]" : "text-[#8a90a0] hover:translate-x-0.5 hover:text-[#4f5669]"
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
