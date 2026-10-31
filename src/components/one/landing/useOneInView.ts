import { useEffect, useRef, useState } from "react";

/**
 * Marks an element as seen once it enters the viewport band.
 * `enhanced` stays false during SSR and without IntersectionObserver, so content is never hidden by default.
 */
export function useOneInView<T extends HTMLElement>(rootMargin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (node.getBoundingClientRect().top < window.innerHeight * 0.85) {
      setSeen(true);
      return;
    }
    setEnhanced(true);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSeen(true);
        observer.disconnect();
      }
    }, { rootMargin });
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, enhanced, seen };
}

/** Section wrapper that fades its content in once, only after hydration. */
export function useOneReveal<T extends HTMLElement>() {
  const { ref, enhanced, seen } = useOneInView<T>();
  return {
    ref,
    revealProps: {
      "data-enhanced": enhanced ? "true" : undefined,
      className: seen ? "one-reveal is-visible" : "one-reveal",
    },
  };
}
