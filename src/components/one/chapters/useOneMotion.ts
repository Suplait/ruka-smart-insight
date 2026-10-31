import { useEffect, useState, type RefObject } from "react";
import type { FieldSceneName } from "@/components/one/field/fieldScenes";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Enables reveal states only after hydration and only when motion is welcome.
 * Without JS (or with reduced motion) every chapter renders complete and static.
 */
export function useOneMotion(rootRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    root.dataset.oneMotion = "on";

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    root.querySelectorAll("[data-reveal]").forEach((element) => io.observe(element));
    return () => {
      io.disconnect();
      delete root.dataset.oneMotion;
    };
  }, [rootRef]);
}

/** The chapter crossing the middle of the viewport drives the field. */
export function useActiveScene(rootRef: RefObject<HTMLElement>, initial: FieldSceneName) {
  const [scene, setScene] = useState<FieldSceneName>(initial);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-scene]"));
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((entry) => entry.isIntersecting).pop();
        if (hit) setScene(hit.target.getAttribute("data-scene") as FieldSceneName);
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    sections.forEach((section) => io.observe(section));
    return () => io.disconnect();
  }, [rootRef]);
  return scene;
}

/** Index of the item nearest to the reading line (40% from the top). */
export function useReadingIndex(containerRef: RefObject<HTMLElement>, selector: string) {
  const [index, setIndex] = useState(-1);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const items = Array.from(container.querySelectorAll<HTMLElement>(selector));
      const line = window.innerHeight * 0.45;
      let best = -1;
      let bestDistance = Infinity;
      items.forEach((item, i) => {
        const rect = item.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - line);
        if (distance < bestDistance && distance < window.innerHeight * 0.32) {
          bestDistance = distance;
          best = i;
        }
      });
      setIndex(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [containerRef, selector]);
  return index;
}

/** 0 → 1 progress of an element travelling through the viewport. */
export function useScrollProgress(ref: RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(1);
  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const vh = window.innerHeight;
      const value = (vh * 0.86 - rect.top) / (vh * 0.5 + rect.height * 0.5);
      setProgress(Math.max(0, Math.min(1, value)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);
  return progress;
}
