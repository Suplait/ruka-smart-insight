export type Vec3 = [number, number, number];

/**
 * A scene is a set of targets for the field. The engine eases between scenes,
 * so every chapter of the page is a camera + behaviour preset, never a cut.
 */
export type FieldScene = {
  eye: Vec3;
  target: Vec3;
  fov: number;
  /** Horizontal lens shift in NDC units: moves the action without turning the camera. */
  shift: number;
  /** Vertical lens shift in NDC units (positive pushes the field down). */
  lift: number;
  /** 0 = ordered field, 1 = work scattered between systems and people. */
  chaos: number;
  /** Intensity of the work fronts that execute tiles. */
  flow: number;
  /** How far the agreed decisions rise out of the field. */
  rise: number;
  /** The single decision tile that rises in the hero. */
  beacon: number;
  /** Fraction of the field that rests as "done". */
  calm: number;
  /** Agreed perimeter (x0, z0, x1, z1) and its strength. */
  scope: [number, number, number, number];
  scopeOn: number;
  dim: number;
};

export type FieldSceneName =
  | "hero"
  | "friction"
  | "shift"
  | "decide"
  | "scope"
  | "areas"
  | "trust"
  | "rest"
  | "close"
  | "contact"
  | "contact-focus"
  | "contact-valid";

const base: FieldScene = {
  eye: [0, 15, 25],
  target: [0, -4.5, -15],
  fov: 40,
  shift: 0,
  lift: 0,
  chaos: 0,
  flow: 1,
  rise: 0.18,
  beacon: 0,
  calm: 0,
  scope: [-200, -200, 200, 200],
  scopeOn: 0,
  dim: 0,
};

const scenes: Record<FieldSceneName, Partial<FieldScene>> = {
  hero: { beacon: 1, rise: 0.12 },
  friction: { eye: [-6, 11, 16], target: [2, -2, -16], chaos: 1, flow: 0.08, rise: 0, dim: 0.1 },
  shift: { eye: [4, 4.2, 9], target: [-2, -1.4, -14], flow: 1.1, rise: 0.08 },
  decide: { eye: [0, 7, 17], target: [0, 0.8, -12], rise: 1, flow: 0.6, beacon: 0 },
  scope: { eye: [0, 40, -8], target: [0, 0, -15], fov: 42, scope: [-9, -24, 9, -10], scopeOn: 1, flow: 1.1, rise: 0 },
  areas: { eye: [0, 22, 8], target: [0, 0, -14], fov: 46, scope: [-14, -24, -2, -12], scopeOn: 1, flow: 1, rise: 0.2 },
  trust: { eye: [0, 7, 20], target: [0, -0.5, -20], fov: 46, calm: 0.45, flow: 0.8, rise: 0.25 },
  rest: { eye: [0, 9, 22], target: [0, -0.5, -22], fov: 46, calm: 0.3, flow: 0.45, dim: 0.62, rise: 0.1 },
  close: { eye: [0, 15, 30], target: [0, -3, -26], fov: 48, calm: 0.75, flow: 0.9, rise: 0.15 },
  contact: { eye: [0, 14, 12], target: [0, 0, -12], fov: 46, flow: 0.75, rise: 0, calm: 0.15, scope: [-8, -18, 8, -6], scopeOn: 0.35 },
  "contact-focus": { eye: [0, 13, 10], target: [0, 0, -12], fov: 44, flow: 1, rise: 0, calm: 0.2, scope: [-8, -18, 8, -6], scopeOn: 1 },
  "contact-valid": { eye: [0, 12, 9], target: [0, 0, -12], fov: 44, flow: 1.25, rise: 0.4, calm: 0.75, scope: [-8, -18, 8, -6], scopeOn: 0.35 },
};

/** Areas of the transversal chapter each own a different region of the field. */
export const areaScopes: [number, number, number, number][] = [
  [-16, -26, -4, -14],
  [-2, -30, 12, -18],
  [6, -18, 18, -8],
  [-20, -14, -8, -4],
  [-6, -14, 4, -6],
  [10, -32, 22, -22],
  [-12, -36, 0, -26],
  [-22, -34, 22, -4],
];

export function resolveScene(name: FieldSceneName, layout: "wide" | "narrow", areaIndex = 0): FieldScene {
  const scene = { ...base, ...scenes[name] } as FieldScene;
  if (name === "areas") scene.scope = areaScopes[areaIndex % areaScopes.length];

  if (layout === "wide") {
    // Text lives on the left on large screens; the action is pushed right.
    const shifts: Partial<Record<FieldSceneName, number>> = {
      hero: -0.42,
      friction: -0.3,
      shift: 0,
      decide: -0.36,
      scope: 0,
      areas: -0.5,
      trust: 0,
      close: 0,
      contact: 0,
      "contact-focus": 0,
      "contact-valid": 0,
    };
    scene.shift = shifts[name] ?? 0;
  } else {
    // Portrait: lift the camera so the field reads below the copy.
    scene.eye = [scene.eye[0] * 0.5, scene.eye[1] + 2.4, scene.eye[2] + 5];
    scene.fov = Math.min(64, scene.fov + 12);
    scene.lift = 0.35;
    if (name === "hero") {
      scene.eye = [7, 15, 21];
      scene.target = [4, -2.5, -4];
      scene.fov = 56;
      scene.lift = 0.84;
    }
  }
  return scene;
}
