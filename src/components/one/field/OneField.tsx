import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { resolveScene, type FieldSceneName } from "./fieldScenes";
import type { FieldEngine, FieldQuality } from "./fieldEngine";

type OneFieldProps = {
  scene: FieldSceneName;
  areaIndex?: number;
  /** "page" pins the field behind the whole document; "panel" fills its parent. */
  mode: "page" | "panel";
  className?: string;
  /** Element the pointer is tracked on (defaults to window). */
  interactive?: boolean;
  beaconLabel?: ReactNode;
  /** While in this scene, the element matching the selector draws the field's perimeter. */
  scopeLink?: { scene: FieldSceneName; selector: string };
};

const INTERACTIVE = "a,button,input,textarea,select,label,summary,[role=tab],[data-one-no-ripple]";

function pickQuality(): FieldQuality {
  const narrow = window.matchMedia("(max-width: 767px)").matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  if (narrow || cores <= 4 || memory <= 2) return narrow && cores > 4 ? "medium" : "low";
  return "high";
}

export function OneField({ scene, areaIndex = 0, mode, className, interactive = true, beaconLabel, scopeLink }: OneFieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<FieldEngine | null>(null);
  const layoutRef = useRef<"wide" | "narrow">("wide");
  const sceneRef = useRef({ scene, areaIndex });
  const [status, setStatus] = useState<"idle" | "ready" | "failed">("idle");
  const [generation, setGeneration] = useState(0);

  sceneRef.current = { scene, areaIndex };

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    let disposed = false;
    let engine: FieldEngine | null = null;
    const cleanups: (() => void)[] = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const layoutFor = () => (wrap.clientWidth >= 1024 && wrap.clientWidth > wrap.clientHeight ? "wide" : "narrow");

    void import("./fieldEngine").then(({ FieldEngine: Engine }) => {
      if (disposed) return;
      layoutRef.current = layoutFor();
      try {
        engine = new Engine(canvas, resolveScene(sceneRef.current.scene, layoutRef.current, sceneRef.current.areaIndex), {
          quality: pickQuality(),
          reducedMotion: reduced.matches,
          onBeacon: ({ x, y, visible, strength }) => {
            const label = labelRef.current;
            if (!label) return;
            // The caption belongs to the hero; elsewhere the risen tile speaks for itself.
            const show = visible && strength > 0.5 && sceneRef.current.scene === "hero";
            label.style.opacity = show ? String(Math.min(1, (strength - 0.5) * 2.4)) : "0";
            label.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
            // Keep the caption on screen; the leader line stays on the tile.
            const half = (label.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
            const width = wrap.clientWidth;
            const offset = Math.min(0, width - 16 - (x + half / 2)) + Math.max(0, 16 - (x - half / 2));
            label.style.setProperty("--beacon-dx", `${offset.toFixed(1)}px`);
          },
        });
      } catch (error) {
        console.warn("Ruka One field fallback", error);
        setStatus("failed");
        return;
      }
      engineRef.current = engine;
      setStatus("ready");

      const resize = () => {
        if (!engine) return;
        const next = layoutFor();
        if (next !== layoutRef.current) {
          layoutRef.current = next;
          engine.setScene(resolveScene(sceneRef.current.scene, next, sceneRef.current.areaIndex));
        }
        engine.resize();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(wrap);
      cleanups.push(() => ro.disconnect());

      // Only render while the field can be seen and the tab is visible.
      let inView = true;
      const sync = () => {
        if (!engine) return;
        if (engine.isLost) {
          setStatus("failed");
          return;
        }
        if (inView && document.visibilityState === "visible") engine.start();
        else engine.stop();
      };
      const io = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        sync();
      });
      io.observe(wrap);
      document.addEventListener("visibilitychange", sync);
      canvas.addEventListener("webglcontextlost", sync);
      cleanups.push(() => {
        io.disconnect();
        document.removeEventListener("visibilitychange", sync);
        canvas.removeEventListener("webglcontextlost", sync);
      });

      const onMotionChange = () => {
        // Rebuild with the new preference; simplest and always correct.
        setStatus("idle");
        setGeneration((value) => value + 1);
      };
      reduced.addEventListener("change", onMotionChange);
      cleanups.push(() => reduced.removeEventListener("change", onMotionChange));

      if (interactive) {
        const toNdc = (event: PointerEvent): [number, number] | null => {
          const rect = canvas.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
          return [(x / rect.width) * 2 - 1, 1 - (y / rect.height) * 2];
        };
        const move = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          const ndc = toNdc(event);
          if (ndc) engine?.setPointer(ndc[0], ndc[1], true);
        };
        const leave = () => engine?.setPointer(0, 0, false);
        const down = (event: PointerEvent) => {
          const target = event.target as Element | null;
          if (target?.closest(INTERACTIVE)) return;
          if (window.getSelection()?.toString()) return;
          const ndc = toNdc(event);
          if (ndc) engine?.ripple(ndc[0], ndc[1]);
        };
        window.addEventListener("pointermove", move, { passive: true });
        document.documentElement.addEventListener("pointerleave", leave);
        window.addEventListener("pointerdown", down, { passive: true });
        cleanups.push(() => {
          window.removeEventListener("pointermove", move);
          document.documentElement.removeEventListener("pointerleave", leave);
          window.removeEventListener("pointerdown", down);
        });
      }

      if (mode === "page" && reduced.matches) {
        let pending = 0;
        const onScroll = () => {
          if (!pending) pending = requestAnimationFrame(() => { pending = 0; engine?.redraw(); });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        cleanups.push(() => { cancelAnimationFrame(pending); window.removeEventListener("scroll", onScroll); });
      }

      if (mode === "page" && !reduced.matches) {
        let lastY = window.scrollY;
        let ticking = false;
        const onScroll = () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(() => {
            const y = window.scrollY;
            engine?.nudge(y - lastY);
            lastY = y;
            ticking = false;
          });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        cleanups.push(() => window.removeEventListener("scroll", onScroll));
      }
      sync();
    }).catch(() => setStatus("failed"));

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
      engine?.destroy();
      engineRef.current = null;
    };
  }, [generation, mode, interactive]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.setScene(resolveScene(scene, layoutRef.current, areaIndex));
    const linked = scopeLink && scopeLink.scene === scene ? document.querySelector<HTMLElement>(scopeLink.selector) : null;
    engine.setScopeElement(linked && linked.offsetParent ? linked : null);
  }, [scene, areaIndex, status, scopeLink]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={cn(
        "one-field",
        mode === "page" ? "fixed inset-0 z-0" : "absolute inset-0",
        status === "ready" && "is-ready",
        status === "failed" && "is-failed",
        className,
      )}
    >
      <div className="one-field__sky" />
      <canvas ref={canvasRef} className="one-field__canvas" />
      {beaconLabel ? (
        <div ref={labelRef} className="one-field__beacon" style={{ opacity: 0 }}>
          <div className="one-field__beacon-inner">{beaconLabel}</div>
        </div>
      ) : null}
      <div className="one-field__vignette" />
    </div>
  );
}
