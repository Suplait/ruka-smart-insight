import * as THREE from "three";
import {
  useVisualLabScene,
  type VisualLabFrame,
  type VisualLabScene,
  type VisualLabSceneFactory,
} from "@/components/works/visual-lab/visualLabRuntime";
import type { WorksVisualLabSceneProps } from "@/components/works/visual-lab/visualLabTypes";

const MAX_BIRDS = 268;
const COMPACT_BIRDS = 98;
const NARROW_BIRDS = 76;
const GRID_CELL_SIZE = 1.18;
const GRID_X = 12;
const GRID_Y = 10;
const GRID_Z = 10;
const GRID_X_OFFSET = 6;
const GRID_Y_OFFSET = 5;
const GRID_Z_OFFSET = 6;
const WAKE_TRAIL_LENGTH = 9;

/**
 * The flock is governed by the three classic Reynolds Boids rules.
 * Secondary forces below only compose the flock and make the interaction legible.
 */
const boidWeights = {
  separation: 0.46,
  alignment: 0.38,
  cohesion: 0.105,
  focusAlignmentBoost: 0.58,
  focusCohesionBoost: 0.075,
  validAlignmentBoost: 0.18,
  validCohesionBoost: 0.095,
} as const;

const boidNeighborhood = {
  neighborRadiusSquared: 1.52,
  separationRadiusSquared: 0.215,
} as const;

const birdVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uState;
  uniform float uValidPulse;
  uniform float uIntro;

  attribute float aWing;
  attribute float aPart;
  attribute vec3 aSurfaceNormal;
  attribute vec3 aOrigin;
  attribute vec3 aVelocity;
  attribute float aPhase;
  attribute float aScale;
  attribute float aTone;
  attribute float aFrequency;
  attribute float aGlide;
  attribute float aBank;
  attribute float aHighlight;
  attribute float aHero;

  varying float vDepth;
  varying float vTone;
  varying float vWingLight;
  varying float vCopyFade;
  varying float vPart;
  varying float vHighlight;
  varying float vFacing;
  varying vec3 vWorldNormal;
  varying float vFlightEnergy;
  varying float vHero;

  mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
  }

  void main() {
    float wingWeight = abs(aWing);
    float wingSide = sign(aWing);
    float interactionEnergy = smoothstep(1.02, 1.82, aHighlight);
    float speed = length(aVelocity);
    float climbDemand = smoothstep(0.02, 0.38, aVelocity.y);
    float turnDemand = smoothstep(0.12, 0.72, abs(aBank));
    float effort = clamp(
      (0.86 - speed) * 1.18
      + climbDemand * 0.25
      + turnDemand * 0.62
      + uValidPulse * 0.16
      + interactionEnergy * 0.76,
      0.0,
      1.0
    );
    float burstSignal = smoothstep(-0.22, 0.54, sin(uTime * (0.5 + aTone * 0.08) + aPhase * 0.21));
    float glideWindow = aGlide * (1.0 - burstSignal) * smoothstep(0.62, 0.96, speed) * (1.0 - effort * 0.7);
    float flockWave = sin(uTime * 0.84 - aOrigin.x * 1.18 + aOrigin.y * 0.42) * 0.24;
    float individualPhase = uTime * aFrequency * (0.72 + effort * 0.18 + interactionEnergy * 1.12) + aPhase;
    float coherentPhase = uTime * (5.15 + effort * 0.9)
      - aOrigin.x * 1.48
      + aOrigin.y * 0.62
      + aTone * 0.42;
    float localSync = 0.16 + smoothstep(0.18, 0.94, uState) * 0.07;
    float flapPhase = mix(individualPhase, coherentPhase, localSync) + flockWave;
    float rawFlap = sin(flapPhase);
    float activeFlap = rawFlap * (0.035 + effort * 0.07 + interactionEnergy * 0.16);
    float glidePose = 0.018 + sin(flapPhase * 0.22) * 0.009;
    float flap = mix(activeFlap, glidePose, glideWindow);

    vec3 local = position;
    vec3 localNormal = aSurfaceNormal;
    float hingeWeight = smoothstep(0.04, 0.92, wingWeight);
    float turnSilhouette = smoothstep(0.28, 0.74, abs(aBank));
    float innerTurnWing = smoothstep(0.0, 0.9, wingSide * sign(aBank));
    float jointAngle = flap * wingSide * hingeWeight;
    local.yz = rotate2d(jointAngle) * local.yz;
    localNormal.yz = rotate2d(jointAngle) * localNormal.yz;
    local.y *= 1.0
      + glideWindow * wingWeight * 0.065
      - turnSilhouette * innerTurnWing * wingWeight * 0.055;
    local.z += sin(uTime * 0.82 + aPhase * 0.31) * (1.0 - wingWeight) * 0.004;

    vec3 forward = normalize(aVelocity + vec3(0.00001));
    vec3 reference = abs(forward.z) > 0.92 ? vec3(0.0, 1.0, 0.0) : vec3(0.0, 0.0, 1.0);
    vec3 lateral = normalize(cross(reference, forward));
    vec3 normal = normalize(cross(forward, lateral));
    float bankAmount = aBank * 0.48 + sin(uTime * 0.37 + aPhase) * 0.018;
    vec3 bankedLateral = lateral * cos(bankAmount) + normal * sin(bankAmount);
    vec3 bankedNormal = normal * cos(bankAmount) - lateral * sin(bankAmount);

    float nearScale = mix(0.82, 1.2, smoothstep(-2.9, 1.75, aOrigin.z)) * (1.0 + aHero * 0.24);
    float localIntro = smoothstep(aTone * 0.28, 0.58 + aTone * 0.18, uIntro);
    float stateScale = 0.96 * (0.9 + localIntro * 0.1)
      * (1.0 + uState * 0.055 + uValidPulse * 0.075 + interactionEnergy * 0.18);
    vec3 worldPosition = aOrigin
      + forward * local.x * aScale * nearScale * stateScale
      + bankedLateral * local.y * aScale * nearScale * stateScale
      + bankedNormal * local.z * aScale * nearScale * stateScale;

    vDepth = smoothstep(-3.0, 1.9, aOrigin.z);
    vTone = aTone;
    vWingLight = 0.5 + 0.5 * clamp(flap * wingSide * 3.8, -1.0, 1.0);
    vCopyFade = smoothstep(0.04, 0.84, aOrigin.x)
      * mix(0.76, 1.0, smoothstep(-0.5, 1.2, aOrigin.y));
    vPart = aPart;
    vHighlight = aHighlight;
    vFacing = abs(dot(bankedNormal, vec3(0.0, 0.0, 1.0)));
    vWorldNormal = normalize(
      forward * localNormal.x
      + bankedLateral * localNormal.y
      + bankedNormal * localNormal.z
    );
    vFlightEnergy = mix(0.22, 1.0, effort) * (1.0 - glideWindow * 0.34);
    vHero = aHero;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPosition, 1.0);
  }
`;

const birdFragmentShader = `
  precision highp float;

  uniform float uState;
  uniform float uValidPulse;

  varying float vDepth;
  varying float vTone;
  varying float vWingLight;
  varying float vCopyFade;
  varying float vPart;
  varying float vHighlight;
  varying float vFacing;
  varying vec3 vWorldNormal;
  varying float vFlightEnergy;
  varying float vHero;

  void main() {
    vec3 graphite = vec3(0.055, 0.065, 0.105);
    vec3 gunmetal = vec3(0.2, 0.225, 0.29);
    vec3 alloy = vec3(0.48, 0.52, 0.61);
    vec3 silver = vec3(0.7, 0.73, 0.8);
    vec3 rukaBlue = vec3(0.25, 0.33, 0.9);

    vec3 normal = normalize(vWorldNormal);
    vec3 keyDirection = normalize(vec3(-0.38, 0.72, 0.58));
    float diffuse = 0.5 + max(dot(normal, keyDirection), 0.0) * 0.5;
    float underside = max(dot(normal, -keyDirection), 0.0);
    float rim = pow(1.0 - clamp(vFacing, 0.0, 1.0), 3.2);
    float metalSweep = pow(max(dot(normal, normalize(vec3(-0.18, 0.54, 0.82))), 0.0), 12.0);
    vec3 depthColor = mix(alloy, graphite, smoothstep(0.06, 0.98, vDepth));
    float silverGlyph = step(0.7, vTone) * (1.0 - step(0.9, vTone));
    vec3 color = mix(depthColor, gunmetal, 0.12);
    color = mix(color, alloy, silverGlyph * 0.74);
    float atmosphericVeil = pow(1.0 - vDepth, 1.45);
    float interactionGlow = smoothstep(1.02, 1.72, vHighlight);
    float accentGlyph = step(0.9, vTone);
    float blueAmount = accentGlyph
      + min(vHighlight, 1.0) * (0.035 + uState * 0.08)
      + uValidPulse * min(vHighlight, 1.0) * 0.08
      + interactionGlow * 0.34;
    float validState = smoothstep(0.76, 0.98, uState);
    color = mix(color, rukaBlue, blueAmount);
    color = mix(color, rukaBlue, validState * (0.02 + vHighlight * 0.025));
    color = mix(color, silver, metalSweep * (0.08 + vDepth * 0.12));
    color = mix(color, alloy, atmosphericVeil * 0.06);
    color *= 0.75 + diffuse * 0.27 + vWingLight * 0.07 + vFlightEnergy * 0.018;
    color = mix(color, color * 0.72, underside * 0.18);
    color = mix(color, silver, rim * (0.025 + vHero * 0.02));

    float alpha = mix(0.16, 0.95, smoothstep(0.02, 0.96, vDepth));
    float focusState = smoothstep(0.18, 0.48, uState) * (1.0 - smoothstep(0.66, 0.94, uState));
    float focusSelection = mix(0.08, 1.0, smoothstep(0.48, 0.88, vTone));
    float validSelection = mix(0.12, 1.0, smoothstep(0.28, 0.78, vTone));
    alpha *= mix(0.035, 1.0, vCopyFade);
    alpha *= mix(1.0, focusSelection, focusState * 0.82);
    alpha *= mix(1.0, validSelection, validState * 0.56);
    alpha *= (0.82 + vDepth * 0.18) * (0.88 + vFacing * 0.12 + uState * 0.11 + vHero * 0.08);
    if (alpha < 0.018) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

type GlyphVertex = readonly [number, number, number];

function seeded(seed: number) {
  const value = Math.sin(seed * 92.173) * 43758.5453;
  return value - Math.floor(value);
}

function smoothstep(minimum: number, maximum: number, value: number) {
  const normalized = THREE.MathUtils.clamp((value - minimum) / (maximum - minimum), 0, 1);
  return normalized * normalized * (3 - 2 * normalized);
}

function pulseWindow(value: number, enterStart: number, enterEnd: number, exitStart: number, exitEnd: number) {
  return smoothstep(enterStart, enterEnd, value) * (1 - smoothstep(exitStart, exitEnd, value));
}

function limitVector(x: number, y: number, z: number, maximum: number) {
  const length = Math.sqrt(x * x + y * y + z * z);
  if (length <= maximum || length < 0.0001) return [x, y, z] as const;
  const ratio = maximum / length;
  return [x * ratio, y * ratio, z * ratio] as const;
}

function createKineticGlyphGeometry() {
  const positions: number[] = [];
  const wingWeights: number[] = [];
  const parts: number[] = [];
  const normals: number[] = [];

  const addTriangle = (
    vertices: readonly [GlyphVertex, GlyphVertex, GlyphVertex],
    wings: readonly [number, number, number],
    part: number,
  ) => {
    const edgeA = new THREE.Vector3(
      vertices[1][0] - vertices[0][0],
      vertices[1][1] - vertices[0][1],
      vertices[1][2] - vertices[0][2],
    );
    const edgeB = new THREE.Vector3(
      vertices[2][0] - vertices[0][0],
      vertices[2][1] - vertices[0][1],
      vertices[2][2] - vertices[0][2],
    );
    const normal = edgeA.cross(edgeB).normalize();
    vertices.forEach((vertex, index) => {
      positions.push(vertex[0], vertex[1], vertex[2]);
      wingWeights.push(wings[index]);
      parts.push(part);
      normals.push(normal.x, normal.y, normal.z);
    });
  };

  ([1, -1] as const).forEach((side) => {
    const hingeInner: GlyphVertex = [0.22, side * 0.008, -0.032];
    const hingeOuter: GlyphVertex = [0.185, side * 0.062, -0.024];
    const tipInner: GlyphVertex = [-0.2, side * 0.325, 0.038];
    const tipOuter: GlyphVertex = [-0.165, side * 0.415, 0.038];
    const hingeWing = side * 0.05;

    if (side > 0) {
      addTriangle([hingeInner, tipInner, tipOuter], [hingeWing, side, side], 0);
      addTriangle([hingeInner, tipOuter, hingeOuter], [hingeWing, side, hingeWing], 0);
    } else {
      addTriangle([hingeInner, tipOuter, tipInner], [hingeWing, side, side], 1);
      addTriangle([hingeInner, hingeOuter, tipOuter], [hingeWing, hingeWing, side], 1);
    }
  });

  const geometry = new THREE.InstancedBufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aWing", new THREE.Float32BufferAttribute(wingWeights, 1));
  geometry.setAttribute("aPart", new THREE.Float32BufferAttribute(parts, 1));
  geometry.setAttribute("aSurfaceNormal", new THREE.Float32BufferAttribute(normals, 3));
  return geometry;
}

function getGridCoordinates(x: number, y: number, z: number) {
  return [
    Math.floor(x / GRID_CELL_SIZE) + GRID_X_OFFSET,
    Math.floor(y / GRID_CELL_SIZE) + GRID_Y_OFFSET,
    Math.floor(z / GRID_CELL_SIZE) + GRID_Z_OFFSET,
  ] as const;
}

function getGridIndex(x: number, y: number, z: number) {
  if (x < 0 || x >= GRID_X || y < 0 || y >= GRID_Y || z < 0 || z >= GRID_Z) return -1;
  return x + y * GRID_X + z * GRID_X * GRID_Y;
}

const createMathematicalFlockScene: VisualLabSceneFactory = (renderer): VisualLabScene => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 30);
  camera.position.set(0, 0.06, 8.15);

  const positions = new Float32Array(MAX_BIRDS * 3);
  const velocities = new Float32Array(MAX_BIRDS * 3);
  const accelerations = new Float32Array(MAX_BIRDS * 3);
  const phases = new Float32Array(MAX_BIRDS);
  const scales = new Float32Array(MAX_BIRDS);
  const tones = new Float32Array(MAX_BIRDS);
  const frequencies = new Float32Array(MAX_BIRDS);
  const glides = new Float32Array(MAX_BIRDS);
  const banks = new Float32Array(MAX_BIRDS);
  const groups = new Float32Array(MAX_BIRDS);
  const leaders = new Float32Array(MAX_BIRDS);
  const highlights = new Float32Array(MAX_BIRDS);
  const baseHighlights = new Float32Array(MAX_BIRDS);
  const heroes = new Float32Array(MAX_BIRDS);
  const streamCoordinates = new Float32Array(MAX_BIRDS);
  const depthAnchors = new Float32Array(MAX_BIRDS);
  const interactions = new Float32Array(MAX_BIRDS);

  for (let index = 0; index < MAX_BIRDS; index += 1) {
    const offset = index * 3;
    const pathSeed = seeded(index * 5.13 + 1);
    const depthSeed = seeded(index * 7.81 + 5);
    const group = Math.floor(seeded(index * 13.47 + 29) * 3);
    const hero = smoothstep(0.62, 0.94, depthSeed)
      * smoothstep(0.8, 0.98, seeded(index * 23.17 + 47));
    const stream = pathSeed * 2 - 1;
    const scatter = seeded(index * 3.47 + 3) - 0.5;
    const pathX = 0.62 + stream * 1.74;
    const pathY = 0.03 + Math.sin(stream * Math.PI * 1.08) * 0.72;
    const tangentX = 1;
    const tangentY = Math.cos(stream * Math.PI * 1.08) * 1.08;
    const tangentLength = Math.sqrt(tangentX * tangentX + tangentY * tangentY);

    positions[offset] = pathX + scatter * 0.44;
    positions[offset + 1] = pathY + (seeded(index * 4.19 + 9) - 0.5) * 0.56;
    positions[offset + 2] = -2.75 + depthSeed * 4.55;
    depthAnchors[index] = positions[offset + 2];

    const initialSpeed = 0.48 + seeded(index * 2.17 + 7) * 0.32;
    velocities[offset] = tangentX / tangentLength * initialSpeed;
    velocities[offset + 1] = tangentY / tangentLength * initialSpeed + (seeded(index * 4.31 + 11) - 0.5) * 0.1;
    velocities[offset + 2] = (seeded(index * 6.73 + 13) - 0.5) * 0.24;

    phases[index] = seeded(index * 8.37 + 17) * Math.PI * 2;
    scales[index] = (0.105 + seeded(index * 9.71 + 19) * 0.105) * (1 + hero * 0.18);
    tones[index] = seeded(index * 11.03 + 23);
    frequencies[index] = 4.55 + seeded(index * 12.43 + 31) * 2.15;
    glides[index] = 0.28 + seeded(index * 14.29 + 37) * 0.7;
    groups[index] = group;
    leaders[index] = Math.pow(seeded(index * 17.11 + 41), 7.5);
    baseHighlights[index] = seeded(index * 19.07 + 43) > 0.78 ? 1 : seeded(index * 19.07 + 43) * 0.25;
    highlights[index] = baseHighlights[index];
    heroes[index] = hero;
    streamCoordinates[index] = stream;
  }

  const geometry = createKineticGlyphGeometry();
  const originAttribute = new THREE.InstancedBufferAttribute(positions, 3);
  const velocityAttribute = new THREE.InstancedBufferAttribute(velocities, 3);
  const bankAttribute = new THREE.InstancedBufferAttribute(banks, 1);
  const highlightAttribute = new THREE.InstancedBufferAttribute(highlights, 1);
  originAttribute.setUsage(THREE.DynamicDrawUsage);
  velocityAttribute.setUsage(THREE.DynamicDrawUsage);
  bankAttribute.setUsage(THREE.DynamicDrawUsage);
  highlightAttribute.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("aOrigin", originAttribute);
  geometry.setAttribute("aVelocity", velocityAttribute);
  geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));
  geometry.setAttribute("aScale", new THREE.InstancedBufferAttribute(scales, 1));
  geometry.setAttribute("aTone", new THREE.InstancedBufferAttribute(tones, 1));
  geometry.setAttribute("aFrequency", new THREE.InstancedBufferAttribute(frequencies, 1));
  geometry.setAttribute("aGlide", new THREE.InstancedBufferAttribute(glides, 1));
  geometry.setAttribute("aBank", bankAttribute);
  geometry.setAttribute("aHighlight", highlightAttribute);
  geometry.setAttribute("aHero", new THREE.InstancedBufferAttribute(heroes, 1));
  geometry.instanceCount = MAX_BIRDS;

  const uniforms = {
    uTime: { value: 0.72 },
    uState: { value: 0 },
    uValidPulse: { value: 0 },
    uIntro: { value: 0 },
  };
  const material = new THREE.ShaderMaterial({
    vertexShader: birdVertexShader,
    fragmentShader: birdFragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
  });
  const flock = new THREE.Mesh(geometry, material);
  scene.add(flock);

  const interactionRaycaster = new THREE.Raycaster();
  const interactionNdc = new THREE.Vector2();
  const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const pointerPlanePosition = new THREE.Vector3();
  const clickPlanePosition = new THREE.Vector3();
  const projectedBirdPosition = new THREE.Vector3();

  const clickRingGeometry = new THREE.RingGeometry(0.78, 1, 64);
  const clickRingMaterial = new THREE.MeshBasicMaterial({
    color: 0x5369eb,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: false,
    blending: THREE.NormalBlending,
  });
  const clickRing = new THREE.Mesh(clickRingGeometry, clickRingMaterial);
  clickRing.visible = false;
  clickRing.renderOrder = 3;
  scene.add(clickRing);

  const gridHeads = new Int32Array(GRID_X * GRID_Y * GRID_Z);
  const gridNext = new Int16Array(MAX_BIRDS);
  let compact = false;
  let activeBirdCount = MAX_BIRDS;
  let viewHalfWidth = 3;
  let viewHalfHeight = 3.2;
  let cameraBaseZ = 8.15;
  let cameraDriftX = 0;
  let cameraDriftY = 0;
  let cameraDriftZ = 0;
  let centroidX = 0.7;
  let centroidY = 0.1;
  let centroidZ = 0;
  const wakeTrailX = new Float32Array(WAKE_TRAIL_LENGTH).fill(0.8);
  const wakeTrailY = new Float32Array(WAKE_TRAIL_LENGTH);
  const wakeTrailStrength = new Float32Array(WAKE_TRAIL_LENGTH);
  let wakeVelocityX = 0;
  let wakeVelocityY = 0;
  let wakeStrength = 0;
  let sceneAge = 0;

  function rebuildGrid(count: number) {
    gridHeads.fill(-1);
    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      const [cellX, cellY, cellZ] = getGridCoordinates(
        positions[offset],
        positions[offset + 1],
        positions[offset + 2],
      );
      const cellIndex = getGridIndex(cellX, cellY, cellZ);
      gridNext[index] = cellIndex >= 0 ? gridHeads[cellIndex] : -1;
      if (cellIndex >= 0) gridHeads[cellIndex] = index;
    }
  }

  function mapPointerToFlockPlane(x: number, y: number, target: THREE.Vector3) {
    interactionNdc.set(x, -y);
    camera.updateMatrixWorld();
    interactionRaycaster.setFromCamera(interactionNdc, camera);
    interactionRaycaster.ray.intersectPlane(interactionPlane, target);
    target.x -= flock.position.x;
    target.y -= flock.position.y;
  }

  function updateWake(frame: VisualLabFrame, delta: number, pointerX: number, pointerY: number) {
    const velocityX = frame.pointer.velocityX * viewHalfWidth * 10;
    const velocityY = -frame.pointer.velocityY * viewHalfHeight * 10;
    const follow = 1 - Math.exp(-delta * 16);

    if (frame.pointer.active > 0.025) {
      wakeTrailX[0] += (pointerX - wakeTrailX[0]) * follow;
      wakeTrailY[0] += (pointerY - wakeTrailY[0]) * follow;
      wakeVelocityX += (velocityX - wakeVelocityX) * follow;
      wakeVelocityY += (velocityY - wakeVelocityY) * follow;
      wakeStrength += (frame.pointer.active - wakeStrength) * (1 - Math.exp(-delta * 8));
    } else {
      wakeTrailX[0] += wakeVelocityX * delta * 0.25;
      wakeTrailY[0] += wakeVelocityY * delta * 0.25;
      wakeVelocityX *= Math.exp(-delta * 2.8);
      wakeVelocityY *= Math.exp(-delta * 2.8);
      wakeStrength *= Math.exp(-delta * 1.25);
    }

    wakeTrailStrength[0] += (wakeStrength - wakeTrailStrength[0]) * (1 - Math.exp(-delta * 9));
    for (let trailIndex = 1; trailIndex < WAKE_TRAIL_LENGTH; trailIndex += 1) {
      const trailFollow = 1 - Math.exp(-delta * (8.2 - trailIndex * 0.72));
      wakeTrailX[trailIndex] += (wakeTrailX[trailIndex - 1] - wakeTrailX[trailIndex]) * trailFollow;
      wakeTrailY[trailIndex] += (wakeTrailY[trailIndex - 1] - wakeTrailY[trailIndex]) * trailFollow;
      const strengthTarget = wakeTrailStrength[trailIndex - 1] * (0.88 - trailIndex * 0.035);
      wakeTrailStrength[trailIndex] += (strengthTarget - wakeTrailStrength[trailIndex]) * trailFollow;
    }
  }

  function simulate(frame: VisualLabFrame) {
    const count = activeBirdCount;
    const delta = Math.min(frame.delta, 0.032);
    if (delta <= 0) return;

    sceneAge += delta;
    mapPointerToFlockPlane(frame.pointer.x, frame.pointer.y, pointerPlanePosition);
    mapPointerToFlockPlane(frame.pointer.clickX, frame.pointer.clickY, clickPlanePosition);
    updateWake(frame, delta, pointerPlanePosition.x, pointerPlanePosition.y);
    rebuildGrid(count);

    const focus = smoothstep(0.08, 0.62, frame.stateValue);
    const valid = smoothstep(0.67, 0.98, frame.stateValue);
    const focusOnly = focus * (1 - valid);
    const validPulse = valid * Math.exp(-frame.stateAge * 0.5);
    const sequence = (frame.elapsed % 20) / 20;
    const gatherBeat = pulseWindow(sequence, 0.04, 0.14, 0.24, 0.33) * (1 - focusOnly) * (1 - valid);
    const splitBeat = pulseWindow(sequence, 0.28, 0.4, 0.51, 0.62) * (1 - focusOnly) * (1 - valid);
    const vortexBeat = pulseWindow(sequence, 0.57, 0.68, 0.83, 0.94) * (1 - focusOnly) * (1 - valid);
    const rejoinBeat = pulseWindow(sequence, 0.5, 0.59, 0.73, 0.82) * (1 - focusOnly) * (1 - valid);
    const sequenceEnergy = gatherBeat * 0.3 + splitBeat * 0.55 + vortexBeat * 0.42;
    const densityBreath = 0.5 + 0.5 * Math.sin(frame.elapsed * 0.46 - 0.8);
    const densityScale = 0.82 + densityBreath * 0.36;
    const clickWaveRadius = 0.015 + Math.min(frame.pointer.clickAge, 2.4) * 0.22;
    const clickWaveWidth = 0.045 + Math.min(frame.pointer.clickAge, 2.4) * 0.008;
    const clickImpact = Number.isFinite(frame.pointer.clickAge)
      ? Math.exp(-frame.pointer.clickAge * 3)
      : 0;
    const clickRecovery = frame.pointer.clickStrength
      * smoothstep(0.24, 0.82, frame.pointer.clickAge);
    const targetX = 0.82
      + Math.sin(frame.elapsed * (0.16 + sequenceEnergy * 0.045)) * (0.16 + splitBeat * 0.08)
      + focusOnly * 0.45
      + valid * 0.12;
    const targetY = Math.cos(frame.elapsed * 0.14) * 0.2
      + gatherBeat * 0.08
      - splitBeat * 0.07
      + focusOnly * 0.04
      + valid * 0.27;
    const targetZ = Math.sin(frame.elapsed * 0.12) * 0.3;

    let nextCentroidX = 0;
    let nextCentroidY = 0;
    let nextCentroidZ = 0;

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      const px = positions[offset];
      const py = positions[offset + 1];
      const pz = positions[offset + 2];
      const vx = velocities[offset];
      const vy = velocities[offset + 1];
      const vz = velocities[offset + 2];
      projectedBirdPosition
        .set(px + flock.position.x, py + flock.position.y, pz + flock.position.z)
        .project(camera);
      const birdScreenX = projectedBirdPosition.x;
      const birdScreenY = projectedBirdPosition.y;
      const [cellX, cellY, cellZ] = getGridCoordinates(px, py, pz);

      let alignX = 0;
      let alignY = 0;
      let alignZ = 0;
      let cohesionX = 0;
      let cohesionY = 0;
      let cohesionZ = 0;
      let separationX = 0;
      let separationY = 0;
      let separationZ = 0;
      let collisionX = 0;
      let collisionY = 0;
      let collisionZ = 0;
      let perceivedNeighbors = 0;
      const ownSpeed = Math.max(Math.sqrt(vx * vx + vy * vy + vz * vz), 0.001);

      for (let z = cellZ - 1; z <= cellZ + 1; z += 1) {
        for (let y = cellY - 1; y <= cellY + 1; y += 1) {
          for (let x = cellX - 1; x <= cellX + 1; x += 1) {
            const cellIndex = getGridIndex(x, y, z);
            if (cellIndex < 0) continue;
            let other = gridHeads[cellIndex];
            while (other >= 0) {
              if (other !== index) {
                const otherOffset = other * 3;
                const dx = px - positions[otherOffset];
                const dy = py - positions[otherOffset + 1];
                const dz = pz - positions[otherOffset + 2];
                const distanceSquared = dx * dx + dy * dy + dz * dz;

                if (distanceSquared <= boidNeighborhood.neighborRadiusSquared && distanceSquared > 0.0001) {
                  const distance = Math.sqrt(distanceSquared);
                  const inverseDistance = 1 / distance;
                  const forwardDot = (
                    vx * -dx + vy * -dy + vz * -dz
                  ) / (ownSpeed * distance);
                  let perception = smoothstep(-0.42, 0.16, forwardDot);
                  if (groups[other] !== groups[index]) perception *= 1 - splitBeat * 0.72;

                  if (perception > 0.001) {
                    alignX += velocities[otherOffset] * perception;
                    alignY += velocities[otherOffset + 1] * perception;
                    alignZ += velocities[otherOffset + 2] * perception;
                    cohesionX += positions[otherOffset] * perception;
                    cohesionY += positions[otherOffset + 1] * perception;
                    cohesionZ += positions[otherOffset + 2] * perception;
                    perceivedNeighbors += perception;
                  }

                  if (distanceSquared < boidNeighborhood.separationRadiusSquared) {
                    const inverseDistanceSquared = 1 / distanceSquared;
                    separationX += dx * inverseDistanceSquared;
                    separationY += dy * inverseDistanceSquared;
                    separationZ += dz * inverseDistanceSquared;
                  }

                  const predictionTime = 0.34 + ownSpeed * 0.12;
                  const futureDx = (px + vx * predictionTime)
                    - (positions[otherOffset] + velocities[otherOffset] * predictionTime);
                  const futureDy = (py + vy * predictionTime)
                    - (positions[otherOffset + 1] + velocities[otherOffset + 1] * predictionTime);
                  const futureDz = (pz + vz * predictionTime)
                    - (positions[otherOffset + 2] + velocities[otherOffset + 2] * predictionTime);
                  const futureDistanceSquared = futureDx * futureDx + futureDy * futureDy + futureDz * futureDz;
                  if (futureDistanceSquared < 0.12 && forwardDot > -0.5) {
                    const avoidance = (0.12 - futureDistanceSquared) / 0.12;
                    const futureInverseDistance = 1 / Math.sqrt(Math.max(futureDistanceSquared, 0.002));
                    collisionX += futureDx * futureInverseDistance * avoidance;
                    collisionY += futureDy * futureInverseDistance * avoidance;
                    collisionZ += futureDz * futureInverseDistance * avoidance;
                  }
                }
              }
              other = gridNext[other];
            }
          }
        }
      }

      let ax = 0;
      let ay = 0;
      let az = 0;
      let interactionTarget = 0;

      if (perceivedNeighbors > 0.001) {
        const inverseNeighbors = 1 / perceivedNeighbors;

        // Reynolds rule 1: alignment — steer toward the local average velocity.
        const averageVelocity = limitVector(
          alignX * inverseNeighbors,
          alignY * inverseNeighbors,
          alignZ * inverseNeighbors,
          1.08 + focusOnly * 0.12 + valid * 0.16,
        );
        const alignmentWeight = boidWeights.alignment
          + focusOnly * boidWeights.focusAlignmentBoost
          + valid * boidWeights.validAlignmentBoost;
        ax += (averageVelocity[0] - vx) * alignmentWeight;
        ay += (averageVelocity[1] - vy) * alignmentWeight;
        az += (averageVelocity[2] - vz) * alignmentWeight * 0.82;

        // Reynolds rule 2: cohesion — steer toward the local center of mass.
        const cohesionWeight = boidWeights.cohesion
          + focusOnly * boidWeights.focusCohesionBoost
          + valid * boidWeights.validCohesionBoost
          + wakeStrength * 0.018;
        ax += (cohesionX * inverseNeighbors - px) * cohesionWeight;
        ay += (cohesionY * inverseNeighbors - py) * cohesionWeight;
        az += (cohesionZ * inverseNeighbors - pz) * cohesionWeight * 0.76;
      }

      // Reynolds rule 3: separation — repel close neighbors to avoid collisions.
      const separationWeight = boidWeights.separation + valid * 0.06;
      ax += separationX * separationWeight;
      ay += separationY * separationWeight;
      az += separationZ * separationWeight * 0.76;
      ax += collisionX * 0.58;
      ay += collisionY * 0.58;
      az += collisionZ * 0.48;

      const group = groups[index];
      const streamCoordinate = streamCoordinates[index];
      const groupPhase = frame.elapsed * (0.12 + group * 0.014) + group * (Math.PI * 2 / 3);
      const splitSignal = 0.12 + splitBeat * 0.88;
      const groupDirection = group - 1;
      const introDelay = (streamCoordinate + 1) * 0.34 + group * 0.12;
      const intro = smoothstep(0.18 + introDelay, 3.35 + introDelay, sceneAge);

      const ribbonAngle = streamCoordinate * Math.PI * 1.12;
      const idleCurveX = streamCoordinate * 1.5;
      const idleCurveY = Math.sin(ribbonAngle) * 0.88;
      const focusCurveX = streamCoordinate * 1.05;
      const focusCurveY = streamCoordinate * 0.24 + Math.sin(phases[index]) * 0.04;
      const validCurveX = streamCoordinate * 1.16;
      const validCurveY = Math.pow((streamCoordinate + 1) * 0.5, 1.58) * 1.12 - 0.46;
      const curveX = THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(idleCurveX, focusCurveX, focusOnly),
        validCurveX,
        valid,
      );
      const curveY = THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(idleCurveY, focusCurveY, focusOnly),
        validCurveY,
        valid,
      );
      const ribbonTangentX = 1.5;
      const ribbonTangentY = Math.cos(ribbonAngle) * Math.PI * 1.12 * 0.88;
      const ribbonTangentLength = Math.sqrt(
        ribbonTangentX * ribbonTangentX + ribbonTangentY * ribbonTangentY,
      );
      const compressionWave = smoothstep(
        0.36,
        0.92,
        0.5 + 0.5 * Math.sin(frame.elapsed * 0.82 - streamCoordinate * 5.4),
      );
      const localDensityScale = 1 - compressionWave * 0.22;
      const ribbonThickness = (
        Math.sin(phases[index] * 1.71) * 0.68
        + Math.cos(phases[index] * 0.83) * 0.24
      ) * (0.145 + splitBeat * 0.035)
        * densityScale
        * localDensityScale
        * (1 - focusOnly * 0.76 - valid * 0.68);
      const ribbonOffsetX = -ribbonTangentY / ribbonTangentLength * ribbonThickness;
      const ribbonOffsetY = ribbonTangentX / ribbonTangentLength * ribbonThickness;
      const groupSpread = (0.08 + splitSignal * 0.27)
        * (0.86 + densityBreath * 0.28)
        * (1 - rejoinBeat * 0.48)
        * (1 - focusOnly * 0.62 - valid * 0.48);
      const introOffsetX = (1 - intro) * (0.68 + group * 0.18);
      const introOffsetY = (1 - intro) * (-0.42 + group * 0.22);
      const groupTargetX = targetX
        + curveX
        + ribbonOffsetX
        + groupDirection * groupSpread
        + Math.abs(groupDirection) * splitBeat * 0.035
        + Math.cos(groupPhase) * groupSpread * 0.3
        + introOffsetX;
      const groupTargetY = targetY
        + curveY
        + ribbonOffsetY
        + groupDirection * groupSpread * 0.48
        + groupDirection * splitBeat * (0.3 + Math.abs(streamCoordinate) * 0.12)
        + Math.sin(groupPhase) * groupSpread * 0.24
        + introOffsetY;
      const groupTargetZ = targetZ
        + groupDirection * groupSpread * 0.75
        + groupDirection * splitBeat * 0.34
        + Math.sin(groupPhase * 0.73) * 0.09
        + focusOnly * ((depthAnchors[index] + 0.48) * 0.74 + 0.08)
        + valid * ((depthAnchors[index] + 0.48) * 0.68)
        + Math.cos(phases[index] * 1.19) * 0.11
          * densityScale
          * localDensityScale
          * (1 - focusOnly * 0.64 - valid * 0.52);
      const pathDx = groupTargetX - px;
      const pathDy = groupTargetY - py;
      const pathDz = groupTargetZ - pz;
      const pathDistance = Math.sqrt(pathDx * pathDx + pathDy * pathDy + pathDz * pathDz);
      const centerStrength = 0.068
        + Math.min(pathDistance, 2.6) * 0.024
        + (1 - focusOnly) * (1 - valid) * 0.028
        + (1 - densityBreath) * 0.012
        + compressionWave * (1 - focusOnly) * (1 - valid) * 0.018
        + rejoinBeat * 0.082
        + focusOnly * 0.048
        + valid * 0.02
        + wakeStrength * 0.062
        + clickRecovery * 0.38
        + (1 - intro) * 0.02;
      ax += pathDx * centerStrength;
      ay += pathDy * centerStrength;
      az += pathDz * centerStrength * 0.78;

      const curveTangentX = THREE.MathUtils.lerp(ribbonTangentX, 1, focusOnly + valid * 0.72);
      const curveTangentY = THREE.MathUtils.lerp(ribbonTangentY, 0.18, focusOnly + valid * 0.72);
      const tangentLength = Math.sqrt(curveTangentX * curveTangentX + curveTangentY * curveTangentY);
      const flowStrength = 0.018
        + focusOnly * 0.085
        + valid * 0.058
        + compressionWave * (1 - focusOnly) * (1 - valid) * 0.024
        + rejoinBeat * 0.032;
      ax += (curveTangentX / tangentLength - vx) * flowStrength;
      ay += (curveTangentY / tangentLength - vy) * flowStrength;

      const reactionWave = Math.sin(frame.elapsed * 1.28 - streamCoordinate * 4.6 + group * 0.55);
      const waveEnvelope = 0.5 + 0.5 * Math.sin(frame.elapsed * 0.31 + group * 1.7);
      ay += reactionWave * waveEnvelope * (0.024 + (1 - focusOnly) * 0.018);
      az += Math.cos(frame.elapsed * 1.08 - streamCoordinate * 3.8) * waveEnvelope * 0.015;

      if (vortexBeat > 0.001) {
        const vortexDx = px - (targetX + 0.32);
        const vortexDy = py - (targetY + 0.04);
        const vortexRadius = Math.sqrt(vortexDx * vortexDx + vortexDy * vortexDy);
        const inverseVortexRadius = 1 / Math.max(vortexRadius, 0.12);
        const vortexEnvelope = 1 - smoothstep(1.72, 2.78, vortexRadius);
        const vortexStrength = vortexBeat * vortexEnvelope;
        ax += -vortexDy * inverseVortexRadius * vortexStrength * 0.29;
        ay += vortexDx * inverseVortexRadius * vortexStrength * 0.29;
        ax -= vortexDx * vortexStrength * 0.038;
        ay -= vortexDy * vortexStrength * 0.038;
        az += Math.sin(frame.elapsed * 0.88 + vortexRadius * 2.2 + group) * vortexStrength * 0.052;
      }

      const leadershipWindow = smoothstep(0.18, 0.9, 0.5 + 0.5 * Math.sin(frame.elapsed * 0.37 + phases[index] * 0.72));
      const leader = leaders[index] * leadershipWindow;
      if (leader > 0.08) {
        const leaderLift = Math.sin(frame.elapsed * 0.56 + phases[index]) * 0.24;
        ax += (0.78 + valid * 0.16 - vx) * leader * 0.12;
        ay += (leaderLift + valid * 0.24 - vy) * leader * 0.1;
        az += (Math.sin(frame.elapsed * 0.42 + phases[index]) * 0.3 - vz) * leader * 0.07;
      }

      const turbulence = 1 - focusOnly * 0.78 - valid * 0.52;
      ax += Math.sin(frame.elapsed * 0.66 + phases[index] + py * 0.72) * 0.075 * turbulence;
      ay += Math.cos(frame.elapsed * 0.58 + phases[index] * 1.27 + px * 0.48) * 0.085 * turbulence;
      az += Math.sin(frame.elapsed * 0.47 + phases[index] * 0.71) * 0.052 * turbulence;

      if (focusOnly > 0.01) {
        const focusFlowX = 0.4 + Math.sin(frame.elapsed * 0.13) * 0.04;
        const focusFlowY = 0.18 + Math.cos(frame.elapsed * 0.17) * 0.045;
        ax += (focusFlowX - vx) * focusOnly * 0.2;
        ay += (focusFlowY - vy) * focusOnly * 0.17;
        az += (Math.sin(frame.elapsed * 0.22 + group) * 0.12 - vz) * focusOnly * 0.08;
      }

      if (valid > 0.01) {
        ax += (0.4 - vx) * valid * 0.17;
        ay += (0.27 - vy) * valid * 0.16;
        ay += validPulse * (0.31 + leader * 0.16 + (streamCoordinate + 1) * 0.035);
        az += Math.sin(phases[index] + frame.elapsed * 0.9) * validPulse * 0.06;
      }

      if (wakeStrength > 0.012) {
        for (let trailIndex = 0; trailIndex < WAKE_TRAIL_LENGTH; trailIndex += 1) {
          const pointerDx = px - wakeTrailX[trailIndex];
          const pointerDy = py - wakeTrailY[trailIndex];
          const pointerDistanceSquared = pointerDx * pointerDx + pointerDy * pointerDy;
          const trailFade = 1 - trailIndex / WAKE_TRAIL_LENGTH;
          const downstream = 1 - trailFade;
          const pointerRadius = (0.68 + frame.pointer.speed * 0.24) * (0.9 + downstream * 0.42);

          if (pointerDistanceSquared < pointerRadius * pointerRadius) {
            const pointerDistance = Math.sqrt(Math.max(pointerDistanceSquared, 0.001));
            const normalizedDistance = pointerDistance / pointerRadius;
            const influence = Math.pow(1 - normalizedDistance, 2)
              * wakeTrailStrength[trailIndex]
              * trailFade;
            const inverseDistance = 1 / pointerDistance;
            const repel = (0.24 + frame.pointer.speed * 0.18) * (0.92 - downstream * 0.24);
            ax += pointerDx * inverseDistance * influence * repel;
            ay += pointerDy * inverseDistance * influence * repel;
            ax += -pointerDy * inverseDistance * influence * (0.11 + frame.pointer.speed * 0.18 + downstream * 0.06);
            ay += pointerDx * inverseDistance * influence * (0.11 + frame.pointer.speed * 0.18 + downstream * 0.06);
            ax += wakeVelocityX * influence * (0.016 + downstream * 0.026);
            ay += wakeVelocityY * influence * (0.016 + downstream * 0.026);
            az += Math.sin(phases[index] + frame.elapsed * 1.4 + trailIndex * 0.42) * influence * 0.09;
          }
        }
      }

      if (frame.pointer.active > 0.025) {
        const hoverDx = birdScreenX - frame.pointer.x;
        const hoverDy = birdScreenY + frame.pointer.y;
        const hoverDistanceSquared = hoverDx * hoverDx + hoverDy * hoverDy;
        const hoverRadius = 0.14 + (1 - frame.pointer.speed) * 0.025 + frame.pointer.pressed * 0.018;

        if (hoverDistanceSquared < hoverRadius * hoverRadius) {
          const hoverDistance = Math.sqrt(Math.max(hoverDistanceSquared, 0.002));
          const hoverProximity = Math.pow(1 - hoverDistance / hoverRadius, 3.2)
            * frame.pointer.active;
          const inverseHoverDistance = 1 / hoverDistance;
          const hoverEnergy = 0.36 + (1 - frame.pointer.speed) * 0.22 + frame.pointer.pressed * 0.12;
          const hoverSpeed = Math.sqrt(vx * vx + vy * vy + vz * vz);
          const inverseHoverSpeed = 1 / Math.max(hoverSpeed, 0.08);
          const forwardBurst = hoverProximity
            * (1.45 + (1 - frame.pointer.speed) * 0.82 + frame.pointer.pressed * 0.3);
          ax += hoverDx * inverseHoverDistance * hoverProximity * hoverEnergy;
          ay += hoverDy * inverseHoverDistance * hoverProximity * hoverEnergy;
          ax += -hoverDy * inverseHoverDistance * hoverProximity * 0.18;
          ay += hoverDx * inverseHoverDistance * hoverProximity * 0.18;
          az += Math.sin(phases[index] + frame.elapsed * 2.1) * hoverProximity * 0.14;
          ax += vx * inverseHoverSpeed * forwardBurst;
          ay += vy * inverseHoverSpeed * forwardBurst;
          az += vz * inverseHoverSpeed * forwardBurst * 0.7;
          interactionTarget = Math.max(
            interactionTarget,
            hoverProximity * (1.55 + (1 - frame.pointer.speed) * 0.7),
          );
        }
      }

      if (frame.pointer.clickStrength > 0.012) {
        const clickDx = birdScreenX - frame.pointer.clickX;
        const clickDy = birdScreenY + frame.pointer.clickY;
        const clickDistance = Math.sqrt(clickDx * clickDx + clickDy * clickDy);
        const clickBandOffset = (clickDistance - clickWaveRadius) / clickWaveWidth;
        const clickBand = Math.exp(-clickBandOffset * clickBandOffset)
          * frame.pointer.clickStrength;
        const clickCore = (1 - smoothstep(0.015, 0.16 + frame.pointer.clickAge * 0.025, clickDistance))
          * Math.exp(-frame.pointer.clickAge * 3);
        const clickFalloff = 1 - smoothstep(0.18, 1.38, clickDistance);
        const clickGlobal = clickImpact * (0.5 + clickFalloff * 0.5);
        const clickInfluence = Math.max(clickBand, clickCore, clickGlobal);

        if (clickInfluence > 0.002) {
          const clickDirectionX = clickDistance > 0.025
            ? clickDx / clickDistance
            : Math.cos(phases[index]);
          const clickDirectionY = clickDistance > 0.025
            ? clickDy / clickDistance
            : Math.sin(phases[index]);
          const radialImpulse = clickBand * 1.9 + clickCore * 1.35 + clickGlobal * 2.45;
          const groupRotation = group === 1 ? -1 : 1;
          ax += clickDirectionX * radialImpulse;
          ay += clickDirectionY * radialImpulse;
          ax += -clickDirectionY * clickBand * 0.34 * groupRotation;
          ay += clickDirectionX * clickBand * 0.34 * groupRotation;
          az += Math.sin(phases[index] * 1.13 + frame.elapsed * 2.4) * clickInfluence * 0.48;
          interactionTarget = Math.max(interactionTarget, clickInfluence * 1.65);
        }
      }

      const interactionResponse = interactionTarget > interactions[index] ? 28 : 4.2;
      interactions[index] += (interactionTarget - interactions[index])
        * (1 - Math.exp(-delta * interactionResponse));
      highlights[index] = baseHighlights[index] + interactions[index] * 1.7;
      const reactiveReturn = Math.max(interactions[index] - interactionTarget, 0) * 0.42;
      ax += pathDx * reactiveReturn;
      ay += pathDy * reactiveReturn;
      az += pathDz * reactiveReturn * 0.78;

      if (px < -1.02) ax += (-1.02 - px) * 1.06;
      if (px > 2.68) ax -= (px - 2.68) * 1.24;
      if (py < -2.55) ay += (-2.55 - py) * 0.8;
      const upperBoundary = THREE.MathUtils.lerp(2.04, 1.78, valid);
      if (py > upperBoundary) ay -= (py - upperBoundary) * (1.08 + valid * 0.58);
      if (pz < -2.9) az += (-2.9 - pz) * 0.58;
      if (pz > 1.9) az -= (pz - 1.9) * 0.58;

      const limitedAcceleration = limitVector(
        ax,
        ay,
        az,
        1.58 + focusOnly * 0.2 + valid * 0.28 + interactions[index] * 1.15,
      );
      accelerations[offset] = limitedAcceleration[0];
      accelerations[offset + 1] = limitedAcceleration[1];
      accelerations[offset + 2] = limitedAcceleration[2];
    }

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      let vx = velocities[offset] + accelerations[offset] * delta;
      let vy = velocities[offset + 1] + accelerations[offset + 1] * delta;
      let vz = velocities[offset + 2] + accelerations[offset + 2] * delta;
      const maxSpeed = 0.82
        + tones[index] * 0.16
        + focusOnly * 0.14
        + valid * 0.18
        + leaders[index] * 0.06
        + interactions[index] * 0.62;
      let limitedVelocity = limitVector(vx, vy, vz, maxSpeed);
      vx = limitedVelocity[0];
      vy = limitedVelocity[1];
      vz = limitedVelocity[2];

      const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
      if (speed < 0.29) {
        const minimumScale = 0.29 / Math.max(speed, 0.001);
        limitedVelocity = [vx * minimumScale, vy * minimumScale, vz * minimumScale];
        vx = limitedVelocity[0];
        vy = limitedVelocity[1];
        vz = limitedVelocity[2];
      }

      const turn = vx * accelerations[offset + 1] - vy * accelerations[offset];
      const bankTarget = THREE.MathUtils.clamp(-turn * 1.28, -0.78, 0.78);
      banks[index] += (bankTarget - banks[index]) * (1 - Math.exp(-delta * 5.8));

      velocities[offset] = vx;
      velocities[offset + 1] = vy;
      velocities[offset + 2] = vz;
      positions[offset] += vx * delta;
      positions[offset + 1] += vy * delta;
      positions[offset + 2] += vz * delta;
      nextCentroidX += positions[offset];
      nextCentroidY += positions[offset + 1];
      nextCentroidZ += positions[offset + 2];
    }

    centroidX = nextCentroidX / count;
    centroidY = nextCentroidY / count;
    centroidZ = nextCentroidZ / count;
    originAttribute.needsUpdate = true;
    velocityAttribute.needsUpdate = true;
    bankAttribute.needsUpdate = true;
    highlightAttribute.needsUpdate = true;
  }

  return {
    resize(width, height, _pixelRatio, nextCompact) {
      compact = nextCompact;
      camera.aspect = width / height;
      camera.fov = compact ? 48 : 43;
      cameraBaseZ = compact ? 8.3 : 8.15;
      camera.position.z = cameraBaseZ;
      camera.updateProjectionMatrix();
      const verticalFov = THREE.MathUtils.degToRad(camera.fov);
      viewHalfHeight = Math.tan(verticalFov / 2) * camera.position.z;
      viewHalfWidth = viewHalfHeight * camera.aspect;
      activeBirdCount = compact ? (width < 360 ? NARROW_BIRDS : COMPACT_BIRDS) : MAX_BIRDS;
      geometry.instanceCount = activeBirdCount;
      flock.scale.setScalar(compact ? 1.2 : 1);
      flock.position.set(compact ? -0.2 : 0, compact ? 0.08 : -0.18, 0);
    },
    render(frame) {
      simulate(frame);
      const cameraMix = frame.delta > 0 ? 1 - Math.exp(-frame.delta * 1.8) : 1;
      const cameraTargetX = (centroidX - 0.68) * 0.022 + frame.pointer.x * frame.pointer.active * 0.02;
      const cameraTargetY = (centroidY - 0.08) * 0.018 - frame.pointer.y * frame.pointer.active * 0.016;
      const cameraTargetZ = THREE.MathUtils.clamp(
        -frame.stateValue * 0.1 + centroidZ * 0.012 + frame.pointer.speed * frame.pointer.active * 0.035,
        -0.14,
        0.08,
      );
      cameraDriftX += (cameraTargetX - cameraDriftX) * cameraMix;
      cameraDriftY += (cameraTargetY - cameraDriftY) * cameraMix;
      cameraDriftZ += (cameraTargetZ - cameraDriftZ) * cameraMix;
      camera.position.set(cameraDriftX, 0.06 + cameraDriftY, cameraBaseZ + cameraDriftZ);
      camera.lookAt(0.3 + cameraDriftX * 0.18, 0.06 + cameraDriftY * 0.16, 0);

      if (frame.pointer.clickStrength > 0.012 && frame.pointer.clickAge < 2.4) {
        const ringRadius = (0.015 + Math.min(frame.pointer.clickAge, 2.4) * 0.22) * viewHalfWidth;
        const ringReveal = smoothstep(0, 0.08, frame.pointer.clickAge);
        clickRing.visible = true;
        clickRing.position.set(
          clickPlanePosition.x + flock.position.x,
          clickPlanePosition.y + flock.position.y,
          0,
        );
        clickRing.scale.setScalar(ringRadius);
        clickRingMaterial.opacity = frame.pointer.clickStrength * ringReveal * 0.48;
      } else {
        clickRing.visible = false;
        clickRingMaterial.opacity = 0;
      }

      uniforms.uTime.value = frame.elapsed;
      uniforms.uState.value = frame.stateValue;
      uniforms.uValidPulse.value = smoothstep(0.67, 0.98, frame.stateValue) * Math.exp(-frame.stateAge * 0.5);
      uniforms.uIntro.value = frame.delta <= 0 ? 1 : smoothstep(0.15, 3.8, sceneAge);
      renderer.render(scene, camera);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      clickRingGeometry.dispose();
      clickRingMaterial.dispose();
    },
  };
};

export function WorksMathematicalFlock({ state, paused }: WorksVisualLabSceneProps) {
  const { containerRef, failed } = useVisualLabScene(createMathematicalFlockScene, state, paused);

  if (failed) {
    return <div className="h-full w-full bg-[radial-gradient(ellipse_at_74%_30%,rgba(83,105,235,0.18),transparent_44%),#fbfcff]" />;
  }

  return (
    <div
      ref={containerRef}
      data-visual-lab-scene="birds"
      className="h-full w-full bg-[radial-gradient(ellipse_at_72%_25%,rgba(91,112,226,0.16),transparent_38%),radial-gradient(ellipse_at_78%_64%,rgba(198,210,247,0.2),transparent_46%),linear-gradient(145deg,#fbfcff,#f3f6ff_58%,#fafbff)]"
    />
  );
}
