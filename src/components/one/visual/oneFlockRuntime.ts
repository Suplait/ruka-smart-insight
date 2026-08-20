import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import type { OneFlockState } from "@/components/one/visual/oneFlockTypes";

export type OneFlockFrame = {
  elapsed: number;
  delta: number;
  pointer: {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    speed: number;
    active: number;
    pressed: number;
    clickX: number;
    clickY: number;
    clickStrength: number;
    clickAge: number;
  };
  state: OneFlockState;
  stateValue: number;
  stateAge: number;
  compact: boolean;
};

export type OneFlockScene = {
  resize: (width: number, height: number, pixelRatio: number, compact: boolean) => void;
  render: (frame: OneFlockFrame) => void;
  dispose: () => void;
};

export type OneFlockSceneFactory = (renderer: THREE.WebGLRenderer) => OneFlockScene;

const stateTargets: Record<OneFlockState, number> = {
  idle: 0,
  focus: 0.56,
  valid: 1,
};

export function useOneFlockScene(
  factory: OneFlockSceneFactory,
  state: OneFlockState,
  paused: boolean,
): { containerRef: RefObject<HTMLDivElement>; failed: boolean } {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  const pausedRef = useRef(paused);
  const wakeRef = useRef<(() => void) | null>(null);
  const staticRenderRef = useRef<(() => void) | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    stateRef.current = state;
    wakeRef.current?.();
    staticRenderRef.current?.();
  }, [state]);

  useEffect(() => {
    pausedRef.current = paused;
    if (paused) staticRenderRef.current?.();
    else wakeRef.current?.();
  }, [paused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || failed) return undefined;
    const interactionSurface = container.closest<HTMLElement>("[data-one-flock-surface]") ?? container;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactQuery = window.matchMedia("(max-width: 767px)");
    let reduceMotion = motionQuery.matches;
    let compact = compactQuery.matches;
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
      });
    } catch {
      setFailed(true);
      return undefined;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0xfbfcff, 0);
    const canvas = renderer.domElement;
    canvas.className = "block h-full w-full";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);

    let scene: OneFlockScene;
    try {
      scene = factory(renderer);
    } catch {
      renderer.dispose();
      canvas.remove();
      setFailed(true);
      return undefined;
    }

    const pointerTarget = new THREE.Vector2();
    const pointerCurrent = new THREE.Vector2();
    const pointerVelocityTarget = new THREE.Vector2();
    const pointerVelocityCurrent = new THREE.Vector2();
    const clickPosition = new THREE.Vector2();
    let pointerActivityTarget = 0;
    let pointerActivityCurrent = 0;
    let pointerInitialized = false;
    let pointerPressTarget = 0;
    let pointerPressCurrent = 0;
    let clickAge = Number.POSITIVE_INFINITY;
    let frameId = 0;
    let running = false;
    let visible = true;
    let pageVisible = !document.hidden;
    let elapsed = 0.72;
    let stateValue = stateTargets[stateRef.current];
    let previousState = stateRef.current;
    let stateChangedAt = performance.now();
    let previousTime = performance.now();

    const draw = (time: number, forceStatic = false) => {
      const currentState = stateRef.current;
      if (currentState !== previousState) {
        previousState = currentState;
        stateChangedAt = time;
      }

      const delta = forceStatic ? 0 : Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      if (!forceStatic && !pausedRef.current && !reduceMotion) elapsed += delta;

      const target = stateTargets[currentState];
      const stateMix = forceStatic ? 1 : 1 - Math.exp(-delta * 5.4);
      stateValue += (target - stateValue) * stateMix;
      const pointerMix = forceStatic ? 1 : 1 - Math.exp(-delta * 6.8);
      pointerCurrent.lerp(forceStatic ? new THREE.Vector2() : pointerTarget, pointerMix);
      const velocityMix = forceStatic ? 1 : 1 - Math.exp(-delta * 11.5);
      pointerVelocityCurrent.lerp(forceStatic ? new THREE.Vector2() : pointerVelocityTarget, velocityMix);
      if (!forceStatic) pointerVelocityTarget.multiplyScalar(Math.exp(-delta * 7.5));
      const activityMix = forceStatic ? 1 : 1 - Math.exp(-delta * 8.5);
      pointerActivityCurrent += (pointerActivityTarget - pointerActivityCurrent) * activityMix;
      const pressMix = forceStatic ? 1 : 1 - Math.exp(-delta * 18);
      pointerPressCurrent += (pointerPressTarget - pointerPressCurrent) * pressMix;
      if (!forceStatic && Number.isFinite(clickAge)) clickAge += delta;
      const clickStrength = forceStatic || clickAge > 2.4 ? 0 : Math.exp(-clickAge * 1.15);

      scene.render({
        elapsed: reduceMotion ? 0.72 : elapsed,
        delta,
        pointer: {
          x: pointerCurrent.x,
          y: pointerCurrent.y,
          velocityX: pointerVelocityCurrent.x,
          velocityY: pointerVelocityCurrent.y,
          speed: Math.min(pointerVelocityCurrent.length() * 5.5, 1),
          active: pointerActivityCurrent,
          pressed: pointerPressCurrent,
          clickX: clickPosition.x,
          clickY: clickPosition.y,
          clickStrength,
          clickAge,
        },
        state: currentState,
        stateValue,
        stateAge: Math.max((time - stateChangedAt) / 1000, 0),
        compact,
      });
    };

    const animate = (time: number) => {
      draw(time);
      if (!pausedRef.current && !reduceMotion && visible && pageVisible) {
        frameId = window.requestAnimationFrame(animate);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running || pausedRef.current || reduceMotion || !visible || !pageVisible) return;
      running = true;
      previousTime = performance.now();
      frameId = window.requestAnimationFrame(animate);
    };

    const renderStatic = () => {
      if (!pausedRef.current && !reduceMotion) return;
      window.cancelAnimationFrame(frameId);
      running = false;
      stateValue = stateTargets[stateRef.current];
      draw(performance.now(), true);
    };

    wakeRef.current = start;
    staticRenderRef.current = renderStatic;

    const resize = () => {
      compact = compactQuery.matches;
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, compact ? 1 : 1.28);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      scene.resize(width, height, pixelRatio, compact);
      draw(performance.now(), true);
    };

    const updatePointerFromEvent = (event: PointerEvent, trackVelocity = true) => {
      const bounds = container.getBoundingClientRect();
      const nextX = (((event.clientX - bounds.left) / bounds.width) - 0.5) * 2;
      const nextY = (((event.clientY - bounds.top) / bounds.height) - 0.5) * 2;
      if (trackVelocity && pointerInitialized) {
        pointerVelocityTarget.set(nextX - pointerTarget.x, nextY - pointerTarget.y);
      } else {
        pointerVelocityTarget.set(0, 0);
      }
      pointerTarget.set(nextX, nextY);
      pointerActivityTarget = 1;
      pointerInitialized = true;
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (reduceMotion || compact || event.pointerType !== "mouse") return;
      updatePointerFromEvent(event);
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (reduceMotion || compact || pausedRef.current || event.pointerType !== "mouse" || event.button !== 0) return;
      updatePointerFromEvent(event, false);
      clickPosition.copy(pointerTarget);
      clickAge = 0;
      pointerPressTarget = 1;
      start();
    };
    const handlePointerUp = () => {
      pointerPressTarget = 0;
    };
    const handlePointerLeave = () => {
      pointerTarget.set(0, 0);
      pointerVelocityTarget.set(0, 0);
      pointerActivityTarget = 0;
      pointerPressTarget = 0;
      pointerInitialized = false;
    };
    const handleVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible) start();
      else {
        window.cancelAnimationFrame(frameId);
        running = false;
      }
    };
    const handleMotion = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
      if (reduceMotion) renderStatic();
      else start();
    };
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else {
        window.cancelAnimationFrame(frameId);
        running = false;
      }
    }, { threshold: 0.05 });
    intersectionObserver.observe(container);

    interactionSurface.addEventListener("pointermove", handlePointerMove, { passive: true });
    interactionSurface.addEventListener("pointerdown", handlePointerDown);
    interactionSurface.addEventListener("pointerup", handlePointerUp);
    interactionSurface.addEventListener("pointercancel", handlePointerUp);
    interactionSurface.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("webglcontextlost", handleContextLost);
    document.addEventListener("visibilitychange", handleVisibility);
    motionQuery.addEventListener("change", handleMotion);
    compactQuery.addEventListener("change", resize);

    resize();
    if (pausedRef.current || reduceMotion) renderStatic();
    else start();

    return () => {
      wakeRef.current = null;
      staticRenderRef.current = null;
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      interactionSurface.removeEventListener("pointermove", handlePointerMove);
      interactionSurface.removeEventListener("pointerdown", handlePointerDown);
      interactionSurface.removeEventListener("pointerup", handlePointerUp);
      interactionSurface.removeEventListener("pointercancel", handlePointerUp);
      interactionSurface.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      document.removeEventListener("visibilitychange", handleVisibility);
      motionQuery.removeEventListener("change", handleMotion);
      compactQuery.removeEventListener("change", resize);
      scene.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, [factory, failed]);

  return { containerRef, failed };
}
