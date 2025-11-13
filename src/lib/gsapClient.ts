import gsap from "gsap";

export type GsapContext = ReturnType<typeof gsap.context> | undefined;

export const withGsapContext = (
  scope: Element | null | undefined,
  callback: () => void,
): GsapContext => {
  if (typeof window === "undefined") {
    return undefined;
  }

  return gsap.context(callback, scope ?? undefined);
};

export { gsap };
