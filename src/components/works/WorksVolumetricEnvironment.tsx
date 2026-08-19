import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type WorksVisualState = "idle" | "name" | "company" | "email" | "valid";
export type WorksVisualVariant = "folded" | "porous" | "monolith";

type RuntimeControls = {
  setState: (state: WorksVisualState) => void;
};

const variantIndex: Record<WorksVisualVariant, number> = {
  folded: 0,
  porous: 1,
  monolith: 2,
};

const stateTargets: Record<WorksVisualState, { coherence: number; focus: number }> = {
  idle: { coherence: 0.18, focus: 0.08 },
  name: { coherence: 0.36, focus: 0.28 },
  company: { coherence: 0.5, focus: 0.46 },
  email: { coherence: 0.66, focus: 0.66 },
  valid: { coherence: 0.92, focus: 0.9 },
};

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uTime;
  uniform float uCoherence;
  uniform float uFocus;
  uniform float uVariant;
  uniform float uCompact;
  uniform float uSteps;

  const float FAR = 10.0;
  const float EPSILON = 0.0025;

  mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
  }

  vec3 rotateX(vec3 p, float angle) {
    p.yz = rotate2d(angle) * p.yz;
    return p;
  }

  vec3 rotateY(vec3 p, float angle) {
    p.xz = rotate2d(angle) * p.xz;
    return p;
  }

  vec3 rotateZ(vec3 p, float angle) {
    p.xy = rotate2d(angle) * p.xy;
    return p;
  }

  float roundedBox(vec3 p, vec3 bounds, float radius) {
    vec3 q = abs(p) - bounds + radius;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - radius;
  }

  float smoothUnion(float a, float b, float radius) {
    float h = clamp(0.5 + 0.5 * (b - a) / radius, 0.0, 1.0);
    return mix(b, a, h) - radius * h * (1.0 - h);
  }

  float foldedManifold(vec3 p) {
    vec3 q = p - mix(vec3(0.58, 0.52, 0.0), vec3(0.0, 0.06, 0.0), uCompact);
    q = rotateY(q, -0.56 + uPointer.x * 0.035);
    q = rotateX(q, 0.3 - uPointer.y * 0.025);
    q = rotateZ(q, -0.12);

    float openness = 1.0 - uCoherence;
    q.y += sin(q.x * 1.15 + uTime * 0.08) * (0.26 + openness * 0.08);
    q.z += sin(q.x * 1.62 - q.y * 0.35 + uTime * 0.055) * (0.17 + openness * 0.06);
    q.x += sin(q.y * 1.25) * openness * 0.06;

    float body = roundedBox(q, vec3(1.78, 0.76, 1.12), 0.3);

    vec3 firstVoid = rotateZ(q + vec3(0.42, -0.02, 0.02), 0.18);
    float tunnelA = length(firstVoid.yz * vec2(1.0, 0.82)) - 0.39;

    vec3 secondVoid = rotateY(q - vec3(0.52, 0.04, -0.06), -0.2);
    float tunnelB = length(secondVoid.xz * vec2(0.82, 1.0)) - 0.33;

    vec3 aperture = q - vec3(0.18, 0.26, 0.18);
    float carvedAperture = roundedBox(aperture, vec3(0.72, 0.28, 1.34), 0.22);
    float voids = min(tunnelA, min(tunnelB, carvedAperture));
    return max(body, -voids);
  }

  float porousTopology(vec3 p) {
    vec3 q = p - mix(vec3(0.76, 0.62, 0.0), vec3(0.0, 0.02, 0.0), uCompact);
    q = rotateY(q, -0.58 + uPointer.x * 0.04);
    q = rotateX(q, 0.28 - uPointer.y * 0.03);
    q = rotateZ(q, -0.16);

    float openness = 1.0 - uCoherence;
    q += vec3(
      sin(q.y * 1.08 + uTime * 0.045),
      sin(q.z * 1.16 - uTime * 0.04),
      cos(q.x * 0.96 + uTime * 0.035)
    ) * openness * 0.035;

    vec3 enclosure = rotateZ(q, -0.14);
    float boundary = roundedBox(enclosure, vec3(1.68, 1.16, 1.0), 0.3);
    boundary = max(boundary, dot(enclosure, normalize(vec3(0.72, 0.38, 0.16))) - 1.36);
    boundary = max(boundary, dot(enclosure, normalize(vec3(-0.46, -0.76, 0.08))) - 1.5);
    boundary += sin(enclosure.x * 0.82 - enclosure.y * 0.58 + uTime * 0.04) * openness * 0.025;

    float frequency = 1.46;
    vec3 field = q * frequency + vec3(0.7, 0.12, -0.4);
    float gyroid = dot(sin(field), cos(field.zxy)) / frequency;
    float topology = gyroid - mix(0.32, 0.44, uCoherence);
    return max(boundary, topology);
  }

  float roundedFrame(vec3 p, vec3 outerBounds, vec3 innerBounds, float radius) {
    float outer = roundedBox(p, outerBounds, radius);
    float inner = roundedBox(p, innerBounds, max(radius * 0.62, 0.06));
    return max(outer, -inner);
  }

  float interlockingMonolith(vec3 p) {
    vec3 origin = mix(vec3(0.56, 0.5, 0.0), vec3(0.0, 0.04, 0.0), uCompact);
    vec3 q = p - origin;
    float openness = 1.0 - uCoherence;

    vec3 first = rotateY(q + vec3(0.34 + openness * 0.08, 0.02, 0.0), -0.66 + uPointer.x * 0.035);
    first = rotateX(first, 0.34 - uPointer.y * 0.025);
    first = rotateZ(first, -0.22);
    first.y += sin(first.x * 1.18 + uTime * 0.055) * openness * 0.055;
    float frameA = roundedFrame(first, vec3(1.48, 0.94, 0.42), vec3(0.82, 0.46, 0.68), 0.28);

    vec3 second = rotateY(q - vec3(0.42 + openness * 0.08, -0.08, 0.02), 0.58 + uPointer.x * 0.028);
    second = rotateX(second, -0.28 - uPointer.y * 0.02);
    second = rotateZ(second, 0.28);
    second.z += sin(second.y * 1.05 - uTime * 0.05) * openness * 0.05;
    float frameB = roundedFrame(second, vec3(1.28, 0.82, 0.4), vec3(0.68, 0.38, 0.64), 0.25);

    vec3 spine = rotateY(q - vec3(0.12, -0.18, -0.2), -0.18);
    spine = rotateZ(spine, 0.48);
    float monolith = roundedBox(spine, vec3(0.42, 1.32, 0.38), 0.23);

    return smoothUnion(smoothUnion(frameA, frameB, 0.1), monolith, 0.08);
  }

  float mapScene(vec3 p) {
    if (uVariant < 0.5) return foldedManifold(p);
    if (uVariant < 1.5) return porousTopology(p);
    return interlockingMonolith(p);
  }

  vec3 surfaceNormal(vec3 p) {
    vec2 e = vec2(EPSILON, 0.0);
    return normalize(vec3(
      mapScene(p + e.xyy) - mapScene(p - e.xyy),
      mapScene(p + e.yxy) - mapScene(p - e.yxy),
      mapScene(p + e.yyx) - mapScene(p - e.yyx)
    ));
  }

  float ambientOcclusion(vec3 p, vec3 n) {
    float occlusion = 0.0;
    float weight = 1.0;
    for (int i = 1; i <= 5; i++) {
      float distanceFromSurface = 0.035 * float(i);
      float sampleDistance = mapScene(p + n * distanceFromSurface);
      occlusion += (distanceFromSurface - sampleDistance) * weight;
      weight *= 0.62;
    }
    return clamp(1.0 - occlusion * 1.55, 0.26, 1.0);
  }

  float softShadow(vec3 origin, vec3 direction) {
    float result = 1.0;
    float travel = 0.035;
    for (int i = 0; i < 14; i++) {
      float distanceToSurface = mapScene(origin + direction * travel);
      result = min(result, 12.0 * distanceToSurface / travel);
      travel += clamp(distanceToSurface, 0.025, 0.22);
      if (distanceToSurface < 0.001 || travel > 4.5) break;
    }
    return clamp(result, 0.12, 1.0);
  }

  mat3 cameraBasis(vec3 origin, vec3 target) {
    vec3 forward = normalize(target - origin);
    vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(right, forward);
    return mat3(right, up, forward);
  }

  vec3 shadeSurface(vec3 position, vec3 normal, vec3 rayDirection, float travel) {
    vec3 viewDirection = -rayDirection;
    vec3 keyDirection = normalize(vec3(-2.8, 4.2, 4.8) - position);
    vec3 fillDirection = normalize(vec3(3.6, -0.8, 3.0) - position);
    vec3 rimDirection = normalize(vec3(1.8, 2.2, -3.8) - position);

    float key = max(dot(normal, keyDirection), 0.0);
    float fill = max(dot(normal, fillDirection), 0.0);
    float back = max(dot(normal, rimDirection), 0.0);
    float shadow = softShadow(position + normal * 0.018, keyDirection);
    float ao = ambientOcclusion(position, normal);
    float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 3.2);
    float specular = pow(max(dot(reflect(-keyDirection, normal), viewDirection), 0.0), 34.0);

    vec3 foldedBase = mix(vec3(0.34, 0.36, 0.42), vec3(0.78, 0.8, 0.83), 0.5 + normal.y * 0.28);
    vec3 porousBase = mix(vec3(0.105, 0.12, 0.17), vec3(0.61, 0.64, 0.7), 0.43 + normal.y * 0.25 + ao * 0.17);
    vec3 monolithBase = mix(vec3(0.23, 0.25, 0.3), vec3(0.74, 0.76, 0.8), 0.46 + normal.x * 0.22);
    vec3 material = uVariant < 0.5 ? foldedBase : (uVariant < 1.5 ? porousBase : monolithBase);

    float movingLight = 0.5 + 0.5 * sin(position.y * 1.6 + position.x * 0.7 - uTime * 0.22);
    float blueSpecular = pow(max(dot(reflect(-fillDirection, normal), viewDirection), 0.0), 28.0) * movingLight;

    vec3 color = material * (0.22 + key * shadow * 0.78 + fill * 0.2 + back * 0.1) * ao;
    color += vec3(0.93, 0.95, 1.0) * specular * 0.42;
    color += vec3(0.326, 0.412, 0.922) * blueSpecular * (0.16 + uFocus * 0.12);
    color += mix(vec3(0.1, 0.12, 0.17), vec3(0.38, 0.44, 0.88), 0.28) * fresnel * 0.22;
    color = mix(color, vec3(0.86, 0.88, 0.93), smoothstep(5.2, FAR, travel) * 0.2);
    return color;
  }

  void main() {
    vec2 resolution = max(uResolution, vec2(1.0));
    vec2 screen = vUv * 2.0 - 1.0;
    screen.x *= resolution.x / resolution.y;

    vec3 target = mix(vec3(0.72, 0.56, 0.0), vec3(0.0, 0.04, 0.0), uCompact);
    vec3 rayOrigin = vec3(
      uPointer.x * 0.13,
      0.06 - uPointer.y * 0.09,
      mix(4.52, 5.4, uCompact)
    );
    mat3 camera = cameraBasis(rayOrigin, target);
    vec3 rayDirection = normalize(camera * vec3(screen, mix(1.96, 1.88, uCompact)));

    float travel = 0.0;
    float distanceToSurface = 0.0;
    bool hit = false;

    for (int i = 0; i < 72; i++) {
      if (float(i) >= uSteps) break;
      vec3 samplePoint = rayOrigin + rayDirection * travel;
      distanceToSurface = mapScene(samplePoint);
      if (abs(distanceToSurface) < EPSILON * (1.0 + travel * 0.08)) {
        hit = true;
        break;
      }
      travel += max(distanceToSurface * 0.62, 0.006);
      if (travel > FAR) break;
    }

    vec3 coldWhite = vec3(0.984, 0.988, 1.0);
    vec3 blueWhite = vec3(0.947, 0.958, 0.992);
    float atmosphere = exp(-length(screen - vec2(0.22, 0.28)) * 0.72);
    vec3 background = mix(coldWhite, blueWhite, atmosphere * 0.38);

    if (!hit) {
      gl_FragColor = vec4(background, 1.0);
      return;
    }

    vec3 position = rayOrigin + rayDirection * travel;
    vec3 normal = surfaceNormal(position);
    vec3 color = shadeSurface(position, normal, rayDirection, travel);

    float edge = pow(1.0 - max(dot(normal, -rayDirection), 0.0), 2.8);
    color = mix(color, vec3(0.28, 0.32, 0.48), edge * 0.08);
    color = pow(max(color, 0.0), vec3(0.92));
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function WorksVolumetricEnvironment({
  state,
  variant = "porous",
}: {
  state: WorksVisualState;
  variant?: WorksVisualVariant;
}) {
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
    const compactQuery = window.matchMedia("(max-width: 767px)");
    let reduceMotion = motionQuery.matches;
    let compact = compactQuery.matches;
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: false,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
      });
    } catch {
      setWebGlFailed(true);
      return undefined;
    }

    const canvas = renderer.domElement;
    canvas.className = "block h-full w-full";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);

    renderer.setClearColor(0xfbfcff, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const initialTarget = stateTargets[initialStateRef.current];
    const uniforms = {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0.8 },
      uCoherence: { value: initialTarget.coherence },
      uFocus: { value: initialTarget.focus },
      uVariant: { value: variantIndex[variant] },
      uCompact: { value: compact ? 1 : 0 },
      uSteps: { value: compact ? 44 : 64 },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const target = { ...initialTarget };
    const pointerTarget = new THREE.Vector2(0, 0);
    const pointerCurrent = new THREE.Vector2(0, 0);
    let animationFrame = 0;
    let visible = true;
    let pageVisible = !document.hidden;
    let running = false;
    let elapsed = 0.8;
    let previousTime = performance.now();

    const render = () => renderer.render(scene, camera);

    const renderFrame = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      if (!reduceMotion) elapsed += delta;

      uniforms.uTime.value = elapsed;
      uniforms.uCoherence.value += (target.coherence - uniforms.uCoherence.value) * 0.065;
      uniforms.uFocus.value += (target.focus - uniforms.uFocus.value) * 0.06;
      pointerCurrent.lerp(pointerTarget, 0.042);
      uniforms.uPointer.value.copy(pointerCurrent);
      render();

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
      uniforms.uTime.value = 0.8;
      uniforms.uCoherence.value = target.coherence;
      uniforms.uFocus.value = target.focus;
      uniforms.uPointer.value.set(0, 0);
      render();
    };

    runtimeRef.current = {
      setState(nextState) {
        Object.assign(target, stateTargets[nextState]);
        if (reduceMotion) renderStatic();
        else start();
      },
    };

    const resize = () => {
      compact = compactQuery.matches;
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, compact ? 0.95 : 1.25);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width * pixelRatio, height * pixelRatio);
      uniforms.uCompact.value = compact ? 1 : 0;
      uniforms.uSteps.value = compact ? 44 : 64;
      render();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (reduceMotion || compact || event.pointerType !== "mouse") return;
      const bounds = container.getBoundingClientRect();
      pointerTarget.set(
        (((event.clientX - bounds.left) / bounds.width) - 0.5) * 2,
        (((event.clientY - bounds.top) / bounds.height) - 0.5) * 2,
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
    const handleCompactPreference = () => resize();
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
    compactQuery.addEventListener("change", handleCompactPreference);

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
      compactQuery.removeEventListener("change", handleCompactPreference);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, [variant, webGlFailed]);

  if (webGlFailed) return <VolumetricFallback />;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="h-full w-full overflow-hidden bg-[#fbfcff]"
    />
  );
}

function VolumetricFallback() {
  return (
    <div
      aria-hidden="true"
      className="h-full w-full bg-[#fbfcff] bg-contain bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/works/works-volumetric-fallback.png')" }}
    />
  );
}
