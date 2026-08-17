import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function AboutReveal({
  children,
  className,
  delay = 0,
  distance = 20,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
}) {
  const reduceMotion = useReducedMotion();
  const motionEnabled = typeof window !== "undefined" && !reduceMotion;

  return (
    <motion.div
      className={className}
      initial={motionEnabled ? { opacity: 0, y: distance, filter: "blur(3px)" } : false}
      whileInView={motionEnabled ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export function EditorialImage({
  src,
  alt,
  caption,
  presentation = "photo",
  className,
  mediaClassName,
  imageClassName,
  delay = 0,
  width,
  height,
  loading = "lazy",
}: {
  src: string;
  alt: string;
  caption: string;
  presentation?: "photo" | "document";
  className?: string;
  mediaClassName?: string;
  imageClassName?: string;
  delay?: number;
  width: number;
  height: number;
  loading?: "eager" | "lazy";
}) {
  const reduceMotion = useReducedMotion();
  const motionEnabled = typeof window !== "undefined" && !reduceMotion;
  const isDocument = presentation === "document";

  return (
    <motion.figure
      className={className}
      initial={motionEnabled ? { opacity: 0, y: isDocument ? 14 : 22 } : false}
      whileInView={motionEnabled ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: isDocument ? 0.12 : 0.2 }}
      transition={{ duration: 0.78, delay, ease: easeOut }}
    >
      <motion.div
        className={`overflow-hidden ${isDocument ? "bg-[#f1f3f8]" : "bg-[#e8ebf3]"} ${mediaClassName ?? ""}`}
        initial={motionEnabled ? { clipPath: "inset(0 0 12% 0)" } : false}
        whileInView={motionEnabled ? { clipPath: "inset(0 0 0% 0)" } : undefined}
        viewport={{ once: true, amount: 0.14 }}
        transition={{ duration: 0.92, delay, ease: easeOut }}
      >
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          className={imageClassName}
          initial={motionEnabled ? { scale: isDocument ? 1.008 : 1.025 } : false}
          whileInView={motionEnabled ? { scale: 1 } : undefined}
          whileHover={motionEnabled ? { scale: isDocument ? 1.008 : 1.015 } : undefined}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 0.9, delay, ease: easeOut }}
        />
      </motion.div>
      <motion.figcaption
        className="mt-3 flex items-start gap-3 text-xs font-medium uppercase leading-5 tracking-[0.13em] text-[#6c7285]"
        initial={motionEnabled ? { opacity: 0, y: 5 } : false}
        whileInView={motionEnabled ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.55, delay: delay + 0.18, ease: easeOut }}
      >
        <span className="mt-2 h-px w-6 shrink-0 bg-[#aeb7cc]" aria-hidden="true" />
        {caption}
      </motion.figcaption>
    </motion.figure>
  );
}
