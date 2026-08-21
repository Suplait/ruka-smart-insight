export type OneFlockState = "idle" | "focus" | "valid";

export type OneFlockSceneProps = {
  state: OneFlockState;
  paused: boolean;
};

export type OneContactVisualState = "idle" | "name" | "company" | "email" | "whatsapp" | "valid";
