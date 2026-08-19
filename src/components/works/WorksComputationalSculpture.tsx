import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type WorksSculptureState = "idle" | "name" | "company" | "email" | "valid";

type RuntimeControls = {
  setState: (state: WorksSculptureState) => void;
};

const stateTargets: Record<WorksSculptureState, { coherence: number; focus: number; tension: number }> = {
  idle: { coherence: 0.18, focus: -1.7, tension: 0.9 },
  name: { coherence: 0.34, focus: -1.55, tension: 0.74 },
  company: { coherence: 0.48, focus: 0, tension: 0.62 },
  email: { coherence: 0.64, focus: 1.45, tension: 0.48 },
  valid: { coherence: 0.86, focus: 0.15, tension: 0.28 },
};

const vertexShader = `
  uniform float uTime;
  uniform float uCoherence;
  uniform float uFocus;
  uniform float uTension;

  attribute float aParam;
  attribute float aBand;
  attribute float aPhase;
  attribute float aStrength;
  attribute float aAccent;

  varying float vAlpha;
  varying float vAccent;
  varying float vLight;

  void main() {
    vec3 p = position;
    float focusField = exp(-pow((p.x - uFocus) * 0.54, 2.0));
    float openField = 1.0 - uCoherence;
    float slowA = sin(p.x * 1.34 + aPhase + uTime * 0.48);
    float slowB = cos(p.x * 0.73 - aBand * 4.1 - uTime * 0.31);
    float fineField = sin(p.y * 2.2 + p.x * 0.9 + aPhase * 1.7 + uTime * 0.22);

    p.y += (slowA * 0.34 + slowB * 0.16) * (0.34 + openField * 0.72) * (0.62 + focusField * 0.38);
    p.z += (slowB * 0.4 + fineField * 0.13) * (0.46 + uTension * 0.52);

    float longitudinalSettle = smoothstep(-2.8, 2.7, p.x) * uCoherence;
    p.y *= 1.0 - longitudinalSettle * 0.12;
    p.z *= 1.0 - longitudinalSettle * 0.18;

    float twist = sin(p.x * 0.62 + uTime * 0.16) * (0.16 + uTension * 0.2);
    mat2 rotation = mat2(cos(twist), -sin(twist), sin(twist), cos(twist));
    p.yz = rotation * p.yz;
    p.x += sin(p.y * 1.22 + aPhase) * (0.045 + openField * 0.055);

    vec4 modelPosition = modelMatrix * vec4(p, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    float edgeFade = smoothstep(-3.8, -3.25, p.x) * (1.0 - smoothstep(3.15, 3.75, p.x));
    vAlpha = min(0.94, aStrength * edgeFade * (0.72 + focusField * 0.28) * (1.0 + aAccent * 0.5));
    vAccent = aAccent * (0.46 + uCoherence * 0.54);
    vLight = clamp(0.45 + p.z * 0.2 + aBand * 0.08, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  varying float vAlpha;
  varying float vAccent;
  varying float vLight;

  void main() {
    vec3 graphite = vec3(0.085, 0.092, 0.145);
    vec3 silver = vec3(0.49, 0.52, 0.61);
    vec3 ruka = vec3(0.326, 0.412, 0.922);
    vec3 neutral = mix(graphite, silver, vLight * 0.72);
    vec3 color = mix(neutral, ruka, vAccent * 0.82);
    gl_FragColor = vec4(color, vAlpha);
  }
`;

export function WorksComputationalSculpture({ state }: { state: WorksSculptureState }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<RuntimeControls | null>(null);
  const initialStateRef = useRef(state);
  const [webGlFailed, setWebGlFailed] = useState(false);

  useEffect(() => {
    runtimeRef.current?.setState(state);
  }, [state]);

  useEffect(() => {
    if (webGlFailed) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isCompact = window.matchMedia("(max-width: 767px)").matches;
    let reduceMotion = motionQuery.matches;
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isCompact, powerPreference: "high-performance" });
    } catch {
      setWebGlFailed(true);
      return undefined;
    }

    const canvas = renderer.domElement;
    canvas.className = "block h-full w-full";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isCompact ? 1.15 : 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 40);
    camera.position.set(0, 0.05, isCompact ? 8.9 : 7.8);

    const group = new THREE.Group();
    scene.add(group);

    const geometry = createSculptureGeometry(isCompact);
    const initialTarget = stateTargets[initialStateRef.current];
    const uniforms = {
      uTime: { value: 1.35 },
      uCoherence: { value: initialTarget.coherence },
      uFocus: { value: initialTarget.focus },
      uTension: { value: initialTarget.tension },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const sculpture = new THREE.LineSegments(geometry, material);
    sculpture.rotation.z = -0.1;
    sculpture.scale.setScalar(isCompact ? 0.82 : 0.9);
    group.add(sculpture);

    const target = { ...initialTarget };
    const pointerTarget = new THREE.Vector2(0, 0);
    const pointerCurrent = new THREE.Vector2(0, 0);
    let animationFrame = 0;
    let visible = true;
    let pageVisible = !document.hidden;
    let running = false;
    let elapsed = 1.35;
    let previousTime = performance.now();

    const renderFrame = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      if (!reduceMotion) elapsed += delta;

      uniforms.uTime.value = elapsed;
      uniforms.uCoherence.value += (target.coherence - uniforms.uCoherence.value) * 0.055;
      uniforms.uFocus.value += (target.focus - uniforms.uFocus.value) * 0.045;
      uniforms.uTension.value += (target.tension - uniforms.uTension.value) * 0.05;
      pointerCurrent.lerp(pointerTarget, 0.045);

      if (!reduceMotion) {
        group.rotation.y = -0.18 + pointerCurrent.x * 0.075 + Math.sin(elapsed * 0.12) * 0.018;
        group.rotation.x = 0.1 + pointerCurrent.y * -0.05 + Math.cos(elapsed * 0.1) * 0.012;
        camera.position.x = pointerCurrent.x * 0.12;
        camera.position.y = 0.05 + pointerCurrent.y * -0.08;
      }

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);

      if (!reduceMotion && visible && pageVisible) animationFrame = window.requestAnimationFrame(renderFrame);
      else running = false;
    };

    const start = () => {
      if (running || reduceMotion || !visible || !pageVisible) return;
      running = true;
      previousTime = performance.now();
      animationFrame = window.requestAnimationFrame(renderFrame);
    };

    const renderStatic = () => {
      window.cancelAnimationFrame(animationFrame);
      running = false;
      group.rotation.set(0.1, -0.18, 0);
      camera.position.set(0, 0.05, isCompact ? 8.9 : 7.8);
      uniforms.uTime.value = 1.35;
      uniforms.uCoherence.value = target.coherence;
      uniforms.uFocus.value = target.focus;
      uniforms.uTension.value = target.tension;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    runtimeRef.current = {
      setState(nextState) {
        Object.assign(target, stateTargets[nextState]);
        if (reduceMotion) renderStatic();
        else start();
      },
    };

    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (reduceMotion || event.pointerType !== "mouse") return;
      const bounds = container.getBoundingClientRect();
      pointerTarget.set(
        ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
        ((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
      );
    };

    const resetPointer = () => pointerTarget.set(0, 0);
    const handleVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible) start();
      else {
        window.cancelAnimationFrame(animationFrame);
        running = false;
      }
    };
    const handleMotionPreference = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
      if (reduceMotion) renderStatic();
      else start();
    };
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setWebGlFailed(true);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else {
        window.cancelAnimationFrame(animationFrame);
        running = false;
      }
    }, { threshold: 0.08 });
    intersectionObserver.observe(container);

    container.addEventListener("pointermove", handlePointerMove, { passive: true });
    container.addEventListener("pointerleave", resetPointer);
    canvas.addEventListener("webglcontextlost", handleContextLost);
    document.addEventListener("visibilitychange", handleVisibility);
    motionQuery.addEventListener("change", handleMotionPreference);

    resize();
    if (reduceMotion) renderStatic();
    else start();

    return () => {
      runtimeRef.current = null;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", resetPointer);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      document.removeEventListener("visibilitychange", handleVisibility);
      motionQuery.removeEventListener("change", handleMotionPreference);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, [webGlFailed]);

  if (webGlFailed) return <StaticSculpture />;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative h-full w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_9%,black_88%,transparent_100%)]"
      style={{ background: "radial-gradient(ellipse at 52% 48%, rgba(83,105,235,0.095), rgba(251,252,255,0) 64%)" }}
    />
  );
}

function createSculptureGeometry(compact: boolean) {
  const positions: number[] = [];
  const params: number[] = [];
  const bands: number[] = [];
  const phases: number[] = [];
  const strengths: number[] = [];
  const accents: number[] = [];
  const primaryCount = compact ? 38 : 58;
  const crossCount = compact ? 10 : 18;
  const primarySegments = compact ? 44 : 66;
  const crossSegments = compact ? 30 : 44;

  const pushVertex = (x: number, y: number, z: number, param: number, band: number, phase: number, strength: number, accent: number) => {
    positions.push(x, y, z);
    params.push(param);
    bands.push(band);
    phases.push(phase);
    strengths.push(strength);
    accents.push(accent);
  };

  const primaryPoint = (curve: number, step: number) => {
    const u = step / primarySegments;
    const x = (u * 2 - 1) * 3.55;
    const band = curve / Math.max(primaryCount - 1, 1) - 0.5;
    const phase = band * 5.1 + curve * 0.032;
    const y = band * 3.72 + Math.sin(x * 0.72 + phase * 0.42) * 0.16;
    const z = Math.sin(x * 0.86 + phase * 0.58) * 0.56 + Math.cos(x * 0.43 - phase * 0.24) * 0.24 + band * band * 0.42;
    return { x, y, z, u, band, phase };
  };

  for (let curve = 0; curve < primaryCount; curve += 1) {
    const strength = curve % 4 === 0 ? 0.72 : 0.43 + ((curve * 17) % 11) * 0.018;
    const accent = curve % 8 === 0 || curve === Math.floor(primaryCount * 0.62) ? 1 : 0;
    for (let step = 0; step < primarySegments; step += 1) {
      const a = primaryPoint(curve, step);
      const b = primaryPoint(curve, step + 1);
      pushVertex(a.x, a.y, a.z, a.u, a.band, a.phase, strength, accent);
      pushVertex(b.x, b.y, b.z, b.u, b.band, b.phase, strength, accent);
    }
  }

  const crossPoint = (curve: number, step: number) => {
    const v = step / crossSegments;
    const band = v - 0.5;
    const x = (curve / Math.max(crossCount - 1, 1) * 2 - 1) * 3.1;
    const phase = band * 5.1 + curve * 0.06;
    const y = band * 3.72 + Math.sin(x * 0.72 + phase * 0.42) * 0.16;
    const z = Math.sin(x * 0.86 + phase * 0.58) * 0.56 + Math.cos(x * 0.43 - phase * 0.24) * 0.24 + band * band * 0.42;
    return { x, y, z, v, band, phase };
  };

  for (let curve = 0; curve < crossCount; curve += 1) {
    for (let step = 0; step < crossSegments; step += 1) {
      const a = crossPoint(curve, step);
      const b = crossPoint(curve, step + 1);
      pushVertex(a.x, a.y, a.z, a.v, a.band, a.phase, 0.16, curve % 7 === 0 ? 0.65 : 0);
      pushVertex(b.x, b.y, b.z, b.v, b.band, b.phase, 0.16, curve % 7 === 0 ? 0.65 : 0);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aParam", new THREE.Float32BufferAttribute(params, 1));
  geometry.setAttribute("aBand", new THREE.Float32BufferAttribute(bands, 1));
  geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  geometry.setAttribute("aStrength", new THREE.Float32BufferAttribute(strengths, 1));
  geometry.setAttribute("aAccent", new THREE.Float32BufferAttribute(accents, 1));
  geometry.computeBoundingSphere();
  return geometry;
}

function StaticSculpture() {
  const paths = Array.from({ length: 18 }, (_, index) => {
    const startY = 62 + index * 10.5;
    const bend = (index % 5 - 2) * 7;
    return `M 18 ${startY} C 132 ${startY + bend}, 218 ${startY - 34 - bend}, 328 ${startY - 9} S 518 ${startY + 20}, 624 ${startY - 4}`;
  });

  return (
    <div aria-hidden="true" className="h-full w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]">
      <svg viewBox="0 0 640 270" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {paths.map((path, index) => (
          <path
            key={path}
            d={path}
            fill="none"
            stroke={index % 7 === 0 ? "#5369eb" : index % 2 === 0 ? "#5c6170" : "#afb4c0"}
            strokeWidth={index % 7 === 0 ? 1.4 : 0.85}
            opacity={index % 7 === 0 ? 0.68 : 0.42}
          />
        ))}
      </svg>
    </div>
  );
}
