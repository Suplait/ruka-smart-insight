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
      initial={motionEnabled ? { y: distance } : false}
      whileInView={motionEnabled ? { y: 0 } : undefined}
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
  className,
  mediaClassName,
  imageClassName,
  delay = 0,
  width,
  height,
  loading = "eager",
}: {
  src: string;
  alt: string;
  caption: string;
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

  return (
    <motion.figure
      className={className}
      initial={motionEnabled ? { y: 26, rotate: -0.4 } : false}
      whileInView={motionEnabled ? { y: 0, rotate: 0 } : undefined}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.78, delay, ease: easeOut }}
    >
      <div className={`overflow-hidden bg-[#e8ebf3] ${mediaClassName ?? ""}`}>
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          className={imageClassName}
          whileHover={motionEnabled ? { scale: 1.018 } : undefined}
          transition={{ duration: 0.55, ease: easeOut }}
        />
      </div>
      <figcaption className="mt-3 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.13em] text-[#6c7285]">
        <span className="h-px w-6 bg-[#aeb7cc]" aria-hidden="true" />
        {caption}
      </figcaption>
    </motion.figure>
  );
}
