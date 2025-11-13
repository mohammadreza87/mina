import { gsap, withGsapContext, type GsapContext } from "@/lib/gsapClient";

type HeroSequenceTargets = {
  card?: HTMLElement | null;
  cta?: HTMLButtonElement | null;
  accent?: HTMLElement | null;
  reducedMotion?: boolean;
};

export const heroSequence = ({ card, cta, accent, reducedMotion }: HeroSequenceTargets): GsapContext => {
  if (reducedMotion) {
    if (card) {
      card.style.opacity = "1";
      card.style.transform = "translateY(0px)";
    }
    return undefined;
  }

  return withGsapContext(card ?? cta ?? accent ?? undefined, () => {
    const timeline = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    if (card) {
      timeline.fromTo(
        card,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1 },
        0,
      );
    }

    if (accent) {
      timeline.fromTo(
        accent,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6",
      );
    }

    if (cta) {
      gsap.to(cta, {
        keyframes: [
          { scale: 1, duration: 1.6 },
          { scale: 1.045, duration: 0.9 },
          { scale: 1, duration: 1.1 },
        ],
        ease: "sine.inOut",
        repeat: -1,
        repeatDelay: 0.2,
        transformOrigin: "center",
      });
    }
  });
};
