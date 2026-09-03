export type Via = "hover" | "click";

export type Menu = {
  readonly slug: string;

  readonly at: string;

  readonly anchor: number;
  readonly via: Via;
};

export type MenuState = Menu | null;

export type Target = {
  readonly slug: string;
  readonly at: string;
  readonly anchor: number;
};

export function onHover(state: MenuState, target: Target): MenuState {
  if (state?.slug === target.slug) return state;
  return { ...target, via: "hover" };
}

export function onClick(state: MenuState, target: Target): MenuState {
  if (state?.slug === target.slug && state.via === "click") return null;
  return { ...target, via: "click" };
}

export function onLeave(state: MenuState): MenuState {
  return state?.via === "hover" ? null : state;
}
