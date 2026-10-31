import type { FieldScene, Vec3 } from "./fieldScenes";

/**
 * "El campo": every tile is one unit of work. Fronts of execution sweep the field,
 * tiles light up and settle as done, and only the agreed decisions rise toward the
 * client. Everything is computed on the GPU from a single instanced draw call.
 */

const VERTEX = `#version 300 es
precision highp float;
layout(location=0) in vec2 aCorner;
layout(location=1) in vec4 aInst;
uniform mat4 uViewProj;
uniform vec3 uEye;
uniform float uTime;
uniform float uIntro;
uniform float uSpacing;
uniform vec2 uOrigin;
uniform float uChaos;
uniform float uFlow;
uniform float uRise;
uniform float uBeacon;
uniform float uCalm;
uniform float uDim;
uniform vec4 uScope;
uniform float uScopeOn;
uniform vec3 uPointer;
uniform vec4 uRipples[4];
uniform vec2 uBeaconCell;
uniform vec2 uFog;
out vec2 vUv;
out vec3 vColor;
out float vAlpha;
out float vGlow;
out float vGhost;

float h1(float n) { return fract(sin(n) * 43758.5453123); }

void main() {
  vec2 cell = aInst.xy;
  float s1 = aInst.z;
  float s2 = aInst.w;
  vec2 home = uOrigin + cell * uSpacing;

  // Friction: work drifts out of place and turns at odd angles.
  vec2 jitter = (vec2(s1, s2) - 0.5) * 2.0;
  vec2 drift = vec2(sin(uTime * 0.31 + s1 * 31.0), cos(uTime * 0.27 + s2 * 29.0)) * 0.22;
  // Work piles up at a few bottlenecks between systems and people.
  float which = floor(s2 * 4.0);
  vec2 jam = which < 1.0 ? vec2(-15.0, -10.0) : which < 2.0 ? vec2(4.0, -22.0) : which < 3.0 ? vec2(17.0, -6.0) : vec2(-3.0, -34.0);
  float pulled = step(0.3, s1);
  vec2 heap = jam + jitter * (1.6 + s1 * 3.4);
  vec2 loose = home + (jitter * 0.95 + drift) * uChaos;
  vec2 pos = mix(loose, heap + drift * 0.4, uChaos * pulled * 0.92);
  float ang = (s1 - 0.5) * 2.4 * uChaos;

  // Fronts of execution: each cycle starts somewhere new on the field.
  float act = 0.0;
  float done = 0.0;
  float stagger = (s1 - 0.5) * 2.6;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float period = 11.0;
    float t = uTime + fi * period / 3.0;
    float k = floor(t / period);
    float lt = t - k * period;
    vec2 o = vec2((h1(k * 7.13 + fi * 3.1) - 0.3) * 54.0, -4.0 - h1(k * 3.77 + fi * 1.9) * 34.0);
    float r = lt * 6.5;
    float d = distance(pos, o) + stagger;
    float x = r - d;
    float life = smoothstep(0.0, 1.2, lt) * (1.0 - smoothstep(period - 2.0, period, lt));
    act += exp(-x * x / 2.2) * life;
    done = max(done, smoothstep(0.0, 1.5, x) * exp(-max(x, 0.0) / 22.0) * life);
  }

  // Intro: the field wakes up from the horizon toward the viewer.
  float introR = uIntro * 135.0;
  float introD = (pos.y - uOrigin.y) + stagger;
  float introX = introR - introD;
  float reveal = smoothstep(0.0, 6.0, introX);
  act += exp(-introX * introX / 2.5) * (1.0 - step(0.999, uIntro));

  // Tap / click dispatches a wave of work from that point.
  for (int i = 0; i < 4; i++) {
    vec4 rp = uRipples[i];
    float rt = uTime - rp.z;
    if (rt > 0.0 && rt < 5.0 && rp.w > 0.0) {
      float rr = rt * 13.0;
      float xd = rr - (distance(pos, rp.xy) + stagger * 0.5);
      float fade = 1.0 - rt / 5.0;
      act += exp(-xd * xd / 1.4) * fade * rp.w * 1.4;
      done = max(done, smoothstep(0.0, 1.0, xd) * fade * rp.w * 0.7);
    }
  }

  // Agreed perimeter.
  float edgeDist = min(min(pos.x - uScope.x, uScope.z - pos.x), min(pos.y - uScope.y, uScope.w - pos.y));
  float inside = smoothstep(-0.35, 0.35, edgeDist);
  float border = inside * (1.0 - smoothstep(0.2, 1.1, edgeDist));
  float scopeGate = mix(1.0, inside, uScopeOn);

  act *= uFlow * scopeGate;
  done = clamp(done * min(uFlow, 1.0) * scopeGate + uCalm * (0.55 + 0.45 * s2) * mix(1.0, inside, uScopeOn), 0.0, 1.0);

  // Pointer light.
  float pd = distance(pos, uPointer.xy);
  float lamp = exp(-pd * pd / 18.0) * uPointer.z;
  // The risen decision casts light on the field it came from.
  vec2 beaconPos = uOrigin + uBeaconCell * uSpacing;
  float bd = distance(pos, beaconPos);
  float pool = exp(-bd * bd / 22.0) * uBeacon;

  // Decisions that belong to the client.
  float isDecision = step(s2, 0.0045) * (1.0 - uChaos);
  float isGhost = step(s1, -0.5);
  float isBeacon = step(distance(cell, uBeaconCell), 0.1) * (1.0 - isGhost);
  float riseAmt = max(isDecision * uRise, isBeacon * uBeacon);
  float bob = sin(uTime * 0.9 + s1 * 40.0) * 0.08;
  float y = riseAmt * (isBeacon > 0.5 ? 3.1 : 1.1 + s1 * 2.2) + bob * riseAmt;
  y += lamp * 0.42 + act * 0.07;
  y += (s2 - 0.5) * 0.9 * uChaos * (1.0 - pulled) + s1 * s1 * 2.6 * uChaos * pulled * smoothstep(5.0, 0.0, distance(pos, jam));

  float size = uSpacing * 0.235 * (1.0 + act * 0.12 + isBeacon * uBeacon * 1.5 + isDecision * uRise * 0.7 + lamp * 0.1);
  float glow = clamp(riseAmt * 1.0 + act * 0.25, 0.0, 1.2);
  float grow = 1.0 + glow * 1.6;
  vec2 c = aCorner * grow;
  float ca = cos(ang), sa = sin(ang);
  c = vec2(c.x * ca - c.y * sa, c.x * sa + c.y * ca);

  // Rising tiles tilt toward the viewer so they read as objects, not decals.
  float tilt = clamp(riseAmt, 0.0, 1.0) * 0.82;
  vec3 depthAxis = normalize(mix(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 0.0), tilt));
  vec3 world = vec3(pos.x, y, pos.y) + vec3(1.0, 0.0, 0.0) * c.x * size + depthAxis * c.y * size;
  gl_Position = uViewProj * vec4(world, 1.0);
  vUv = c;

  vec3 pending = vec3(0.115, 0.13, 0.215);
  vec3 settled = vec3(0.36, 0.42, 0.72);
  vec3 primary = vec3(0.306, 0.396, 0.914);
  vec3 col = mix(pending * (0.62 + 0.75 * s1), settled * (0.8 + 0.35 * s2), done);
  col += primary * act * 1.35 + vec3(0.25, 0.3, 0.6) * act * act * 0.5;
  col += vec3(0.09, 0.1, 0.16) * uChaos * pulled;
  col = mix(col, vec3(0.93, 0.95, 1.0), clamp(riseAmt, 0.0, 1.0) * 0.92);
  col += vec3(0.3, 0.36, 0.7) * lamp * 0.55;
  col += vec3(0.32, 0.4, 0.95) * pool * 0.75;
  col = mix(col, col * 0.2, uScopeOn * (1.0 - inside));
  col += primary * border * uScopeOn * 0.9;
  col *= (1.0 - uDim * 0.8);

  col = mix(col, primary * 1.25, isGhost);

  float depth = distance(world, uEye);
  float fog = 1.0 - smoothstep(uFog.x, uFog.y, depth);
  // Keep the foreground quiet so copy can sit over it; the story happens mid-field.
  float near = mix(0.2, 1.0, smoothstep(12.0, 32.0, depth));
  near = max(near, clamp(riseAmt + act * 0.6 + pool, 0.0, 1.0));
  vColor = col;
  vAlpha = fog * reveal * near * mix(1.0, uBeacon, isGhost);
  vGlow = glow * (1.0 - isGhost);
  vGhost = isGhost;
}
`;

const FRAGMENT = `#version 300 es
precision highp float;
in vec2 vUv;
in vec3 vColor;
in float vAlpha;
in float vGlow;
in float vGhost;
out vec4 outColor;
void main() {
  float r = 0.42;
  vec2 q = abs(vUv) - (1.0 - r);
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  float aa = fwidth(d) * 1.1 + 0.0015;
  float a = 1.0 - smoothstep(-aa, aa, d);
  float px = fwidth(vUv.x);
  float far = smoothstep(0.35, 1.4, px);
  float rim = smoothstep(-0.32, -0.02, d) * a * (1.0 - far);
  float face = 0.86 + 0.14 * (-vUv.y);
  vec3 c = vColor * face + vColor * rim * 0.55;
  float alpha = a * vAlpha * mix(1.0, 0.55, far);
  // The vacated slot: only its outline remains.
  float outline = (smoothstep(-0.2, -0.06, d) - smoothstep(-0.03, 0.02, d));
  alpha = mix(alpha, outline * vAlpha, vGhost);
  c = mix(c, vColor, vGhost);
  float halo = vGlow * exp(-max(d, 0.0) * 2.6) * (1.0 - a) * 0.42 * vAlpha;
  outColor = vec4(c * alpha + vColor * halo, alpha);
}
`;

export type FieldQuality = "high" | "medium" | "low";

export type FieldEngineOptions = {
  quality: FieldQuality;
  reducedMotion: boolean;
  /** Called every frame with the projected beacon (CSS px within the canvas). */
  onBeacon?: (info: { x: number; y: number; visible: boolean; strength: number }) => void;
};

type Mutable = FieldScene & { lean: number };

/** World position (x, z) of the decision tile that rises in the hero. */
const BEACON: [number, number] = [5, -2];

const SIZE: Record<FieldQuality, [number, number, number]> = {
  high: [160, 136, 2],
  medium: [120, 110, 1.75],
  low: [88, 92, 1.5],
};

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Field shader: ${info}`);
  }
  return shader;
}

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: Vec3): Vec3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

function viewProjection(eye: Vec3, target: Vec3, fov: number, aspect: number, shift: number, lift: number) {
  const f = norm(sub(target, eye));
  const r = norm(cross(f, [0, 1, 0]));
  const u = cross(r, f);
  const view = [
    r[0], u[0], -f[0], 0,
    r[1], u[1], -f[1], 0,
    r[2], u[2], -f[2], 0,
    -dot(r, eye), -dot(u, eye), dot(f, eye), 1,
  ];
  const t = 1 / Math.tan((fov * Math.PI) / 360);
  const near = 0.1;
  const far = 400;
  const proj = [
    t / aspect, 0, 0, 0,
    0, t, 0, 0,
    shift, lift, (far + near) / (near - far), -1,
    0, 0, (2 * far * near) / (near - far), 0,
  ];
  const out = new Float32Array(16);
  for (let c = 0; c < 4; c++) {
    for (let rr = 0; rr < 4; rr++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += proj[k * 4 + rr] * view[c * 4 + k];
      out[c * 4 + rr] = s;
    }
  }
  return { matrix: out, forward: f, right: r, up: u, tanHalf: 1 / t };
}

export class FieldEngine {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private buffers: WebGLBuffer[] = [];
  private uniforms = new Map<string, WebGLUniformLocation | null>();
  private count: number;
  private cols: number;
  private rows: number;
  private spacing = 1;
  private origin: [number, number];
  private maxDpr: number;
  private dpr = 1;
  private raf = 0;
  private running = false;
  private last = 0;
  private time = 0;
  private introStart = -1;
  private current: Mutable;
  private target: FieldScene;
  private pointer = { x: 0, z: -10, s: 0, tx: 0, tz: -10, ts: 0 };
  private ripples: [number, number, number, number][] = [[0, 0, -99, 0], [0, 0, -99, 0], [0, 0, -99, 0], [0, 0, -99, 0]];
  private rippleIndex = 0;
  private leanTarget = 0;
  private frameCost = 16;
  private lastCamera: ReturnType<typeof viewProjection> | null = null;
  private beaconCell: [number, number];
  private lost = false;
  private scopeElement: Element | null = null;

  constructor(private canvas: HTMLCanvasElement, initial: FieldScene, private options: FieldEngineOptions) {
    const gl = canvas.getContext("webgl2", { antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: "high-performance" });
    if (!gl) throw new Error("WebGL2 unavailable");
    // Software rasterizers cannot hold the field at a decent frame rate: use the poster.
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) throw new Error(`Software renderer: ${renderer}`);
    this.gl = gl;
    const [cols, rows, maxDpr] = SIZE[options.quality];
    this.cols = cols;
    this.rows = rows;
    this.maxDpr = maxDpr;
    this.count = cols * rows;
    this.origin = [-(cols - 1) * 0.5 * this.spacing, 18 - (rows - 1) * this.spacing];
    this.beaconCell = [0, 0];

    const program = gl.createProgram();
    if (!program) throw new Error("program");
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`Field link: ${gl.getProgramInfoLog(program)}`);
    this.program = program;

    const vao = gl.createVertexArray();
    if (!vao) throw new Error("vao");
    this.vao = vao;
    gl.bindVertexArray(vao);

    const quad = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // Instances are ordered far → near so blending stays correct without depth sorting.
    // Blocks separated by aisles read as processes and areas, not as a floor.
    const cells: number[] = [];
    let seed = 1337;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const bx = Math.round((BEACON[0] - this.origin[0]) / this.spacing);
    const bz = Math.round((BEACON[1] - this.origin[1]) / this.spacing);
    for (let z = 0; z < rows; z++) {
      for (let x = 0; x < cols; x++) {
        const s1 = rand();
        const s2 = rand();
        const hole = rand();
        const isBeacon = x === bx && z === bz;
        if (!isBeacon && (x % 11 === 10 || z % 8 === 7 || hole < 0.07)) continue;
        cells.push(x, z, s1, isBeacon ? 0.5 : s2);
      }
    }
    // The empty slot the decision rose from.
    cells.push(bx, bz, -1, 0.5);
    this.beaconCell = [bx, bz];
    const inst = new Float32Array(cells);
    this.count = cells.length / 4;
    const instBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, instBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, inst, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(1, 1);
    gl.bindVertexArray(null);
    this.buffers.push(quad, instBuffer);

    for (const name of ["uViewProj", "uEye", "uTime", "uIntro", "uSpacing", "uOrigin", "uChaos", "uFlow", "uRise", "uBeacon", "uCalm", "uDim", "uScope", "uScopeOn", "uPointer", "uRipples", "uBeaconCell", "uFog"]) {
      this.uniforms.set(name, gl.getUniformLocation(program, name));
    }

    this.current = { ...initial, eye: [...initial.eye], target: [...initial.target], scope: [...initial.scope], lean: 0 };
    this.target = initial;
    canvas.addEventListener("webglcontextlost", this.handleLost, false);
    this.resize();
    if (options.reducedMotion) this.introStart = -1000;
  }

  private handleLost = (event: Event) => {
    event.preventDefault();
    this.lost = true;
    this.stop();
  };

  get isLost() {
    return this.lost;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, this.maxDpr);
    const w = Math.max(1, Math.round(rect.width * this.dpr));
    const h = Math.max(1, Math.round(rect.height * this.dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    if (!this.running) this.draw();
  }

  setScene(scene: FieldScene, immediate = false) {
    this.target = scene;
    if (immediate || this.options.reducedMotion) {
      this.current = { ...scene, eye: [...scene.eye], target: [...scene.target], scope: [...scene.scope], lean: 0 };
      if (!this.running) this.draw();
    }
  }

  /** Pointer in canvas NDC (-1..1). Projects onto the ground plane. */
  setPointer(ndcX: number, ndcY: number, active: boolean) {
    const hit = this.groundHit(ndcX, ndcY);
    if (hit) {
      this.pointer.tx = hit[0];
      this.pointer.tz = hit[1];
    }
    this.pointer.ts = active && hit ? 1 : 0;
  }

  ripple(ndcX: number, ndcY: number) {
    const hit = this.groundHit(ndcX, ndcY);
    if (!hit) return;
    this.ripples[this.rippleIndex] = [hit[0], hit[1], this.time, 1];
    this.rippleIndex = (this.rippleIndex + 1) % 4;
    if (!this.running) this.draw();
  }

  /** Single static frame (reduced motion keeps the field in sync with layout, without animating). */
  redraw() {
    if (!this.running) this.draw();
  }

  /** A DOM rectangle whose footprint on the field becomes the agreed perimeter, live. */
  setScopeElement(element: Element | null) {
    this.scopeElement = element;
    if (!this.running) this.draw();
  }

  private syncScopeElement() {
    const el = this.scopeElement;
    if (!el || this.target.scopeOn <= 0) return;
    const box = el.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) return;
    const canvasBox = this.canvas.getBoundingClientRect();
    const toNdc = (x: number, y: number): [number, number] => [
      ((x - canvasBox.left) / canvasBox.width) * 2 - 1,
      1 - ((y - canvasBox.top) / canvasBox.height) * 2,
    ];
    const corners = [
      toNdc(box.left, box.top),
      toNdc(box.right, box.top),
      toNdc(box.left, box.bottom),
      toNdc(box.right, box.bottom),
    ];
    const xs: number[] = [];
    const zs: number[] = [];
    for (const [x, y] of corners) {
      const point = this.groundHit(x, y);
      if (!point) return;
      xs.push(point[0]);
      zs.push(point[1]);
    }
    this.current.scope = [Math.min(...xs), Math.min(...zs), Math.max(...xs), Math.max(...zs)];
  }

  /** Scroll velocity in px/frame gives the camera a little physical lean. */
  nudge(velocity: number) {
    this.leanTarget = Math.max(-1, Math.min(1, velocity / 60));
  }

  private groundHit(ndcX: number, ndcY: number): [number, number] | null {
    const cam = this.lastCamera;
    if (!cam) return null;
    const aspect = this.canvas.width / Math.max(1, this.canvas.height);
    const x = (ndcX + this.current.shift) * cam.tanHalf * aspect;
    const y = (ndcY + this.current.lift) * cam.tanHalf;
    const dir = norm([
      cam.forward[0] + cam.right[0] * x + cam.up[0] * y,
      cam.forward[1] + cam.right[1] * x + cam.up[1] * y,
      cam.forward[2] + cam.right[2] * x + cam.up[2] * y,
    ]);
    if (dir[1] > -0.01) return null;
    const t = -this.current.eye[1] / dir[1];
    return [this.current.eye[0] + dir[0] * t, this.current.eye[2] + dir[2] * t];
  }

  start() {
    if (this.running || this.lost) return;
    if (this.options.reducedMotion) {
      this.draw();
      return;
    }
    this.running = true;
    this.last = performance.now();
    if (this.introStart === -1) this.introStart = this.time;
    const loop = (now: number) => {
      if (!this.running) return;
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.time += dt;
      this.step(dt);
      const t0 = performance.now();
      this.draw();
      this.adapt(performance.now() - t0, dt);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private adapt(cpuMs: number, dt: number) {
    // Frame interval is the honest signal; drop resolution if we cannot hold ~50fps.
    this.frameCost = this.frameCost * 0.95 + dt * 1000 * 0.05;
    if (this.frameCost > 24 && this.maxDpr > 1) {
      this.maxDpr = Math.max(1, this.maxDpr - 0.25);
      this.frameCost = 16;
      this.resize();
    }
    void cpuMs;
  }

  private step(dt: number) {
    const k = 1 - Math.exp(-dt / 0.75);
    const kc = 1 - Math.exp(-dt / 1.05);
    const c = this.current;
    const t = this.target;
    for (let i = 0; i < 3; i++) {
      c.eye[i] += (t.eye[i] - c.eye[i]) * kc;
      c.target[i] += (t.target[i] - c.target[i]) * kc;
    }
    for (let i = 0; i < 4; i++) c.scope[i] += (t.scope[i] - c.scope[i]) * k;
    c.fov += (t.fov - c.fov) * kc;
    c.shift += (t.shift - c.shift) * kc;
    c.lift += (t.lift - c.lift) * kc;
    c.chaos += (t.chaos - c.chaos) * k;
    c.flow += (t.flow - c.flow) * k;
    c.rise += (t.rise - c.rise) * k;
    c.beacon += (t.beacon - c.beacon) * k;
    c.calm += (t.calm - c.calm) * k;
    c.scopeOn += (t.scopeOn - c.scopeOn) * k;
    c.dim += (t.dim - c.dim) * k;
    // Spring for the scroll lean: quick to respond, slow to settle.
    c.lean += (this.leanTarget - c.lean) * (1 - Math.exp(-dt / 0.35));
    this.leanTarget *= Math.exp(-dt / 0.25);

    const p = this.pointer;
    const kp = 1 - Math.exp(-dt / 0.18);
    p.x += (p.tx - p.x) * kp;
    p.z += (p.tz - p.z) * kp;
    p.s += (p.ts - p.s) * (1 - Math.exp(-dt / 0.4));
  }

  private draw() {
    if (this.lost) return;
    const gl = this.gl;
    const c = this.current;
    const w = this.canvas.width;
    const h = this.canvas.height;
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const aspect = w / Math.max(1, h);
    const sway = this.options.reducedMotion ? 0 : Math.sin(this.time * 0.07) * 0.6;
    const eye: Vec3 = [c.eye[0] + sway, c.eye[1] + c.lean * 0.9, c.eye[2]];
    const target: Vec3 = [c.target[0], c.target[1] - c.lean * 1.4, c.target[2]];
    const cam = viewProjection(eye, target, c.fov, aspect, c.shift, c.lift);
    this.lastCamera = cam;
    this.syncScopeElement();

    gl.useProgram(this.program);
    const u = (name: string) => this.uniforms.get(name) ?? null;
    gl.uniformMatrix4fv(u("uViewProj"), false, cam.matrix);
    gl.uniform3f(u("uEye"), eye[0], eye[1], eye[2]);
    const time = this.options.reducedMotion ? 4.2 : this.time + 3.5;
    gl.uniform1f(u("uTime"), time);
    const intro = this.options.reducedMotion ? 1 : Math.min(1, Math.max(0, (this.time - this.introStart) / 2.1));
    gl.uniform1f(u("uIntro"), 1 - Math.pow(1 - intro, 3));
    gl.uniform1f(u("uSpacing"), this.spacing);
    gl.uniform2f(u("uOrigin"), this.origin[0], this.origin[1]);
    gl.uniform1f(u("uChaos"), c.chaos);
    gl.uniform1f(u("uFlow"), c.flow);
    gl.uniform1f(u("uRise"), c.rise);
    const beaconIn = this.options.reducedMotion ? 1 : Math.min(1, Math.max(0, (this.time - this.introStart - 1.2) / 1.3));
    const beacon = c.beacon * (1 - Math.pow(1 - beaconIn, 3));
    gl.uniform1f(u("uBeacon"), beacon);
    gl.uniform1f(u("uCalm"), c.calm);
    gl.uniform1f(u("uDim"), c.dim);
    gl.uniform4f(u("uScope"), c.scope[0], c.scope[1], c.scope[2], c.scope[3]);
    gl.uniform1f(u("uScopeOn"), c.scopeOn);
    gl.uniform3f(u("uPointer"), this.pointer.x, this.pointer.z, this.pointer.s);
    const rp = new Float32Array(16);
    this.ripples.forEach((r, i) => rp.set([r[0], r[1], r[2] + 3.5, r[3]], i * 4));
    gl.uniform4fv(u("uRipples"), rp);
    gl.uniform2f(u("uBeaconCell"), this.beaconCell[0], this.beaconCell[1]);
    gl.uniform2f(u("uFog"), 26, 88);

    gl.bindVertexArray(this.vao);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.count);
    gl.bindVertexArray(null);

    if (this.options.onBeacon) {
      const bx = this.origin[0] + this.beaconCell[0] * this.spacing;
      const bz = this.origin[1] + this.beaconCell[1] * this.spacing;
      const m = cam.matrix;
      const py = 3.1 * beacon;
      const cx = m[0] * bx + m[4] * py + m[8] * bz + m[12];
      const cy = m[1] * bx + m[5] * py + m[9] * bz + m[13];
      const cw = m[3] * bx + m[7] * py + m[11] * bz + m[15];
      const rect = { w: w / this.dpr, h: h / this.dpr };
      const visible = cw > 0;
      this.options.onBeacon({
        x: ((cx / cw) * 0.5 + 0.5) * rect.w,
        y: (1 - ((cy / cw) * 0.5 + 0.5)) * rect.h,
        visible,
        strength: beacon,
      });
    }
  }

  destroy() {
    this.stop();
    this.canvas.removeEventListener("webglcontextlost", this.handleLost);
    const gl = this.gl;
    this.buffers.forEach((b) => gl.deleteBuffer(b));
    gl.deleteVertexArray(this.vao);
    gl.deleteProgram(this.program);
  }
}
