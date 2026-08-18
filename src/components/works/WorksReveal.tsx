import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function WorksReveal({
  children,
  className,
  delay = 0,
  amount = 0.18,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
}) {
  const reduceMotion = useReducedMotion();
  const motionEnabled = typeof window !== "undefined" && !reduceMotion;

  return (
    <motion.div
      className={className}
      initial={motionEnabled ? { opacity: 0, y: 18, filter: "blur(3px)" } : false}
      whileInView={motionEnabled ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.66, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export function WorksSectionHeading({
  eyebrow,
  title,
  lead,
  className,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <WorksReveal className={className}>
      <p className="mb-5 text-[11px] font-semibold tracking-[0.18em] text-[#4f64dd]">{eyebrow}</p>
      <h2 className="max-w-4xl text-balance text-[clamp(2.25rem,4.6vw,4.9rem)] font-semibold leading-[0.98] tracking-[-0.052em] text-[#171827]">
        {title}
      </h2>
      {lead ? (
        <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-[#62687a] sm:text-lg sm:leading-8">{lead}</p>
      ) : null}
    </WorksReveal>
  );
}
