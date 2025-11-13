"use client";

import { useEffect, useRef } from "react";
import { heroSequence } from "@/animations/heroSequence";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export const Hero = () => {
  const cardRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const accentRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const context = heroSequence({
      card: cardRef.current ?? undefined,
      cta: ctaRef.current ?? undefined,
      accent: accentRef.current ?? undefined,
      reducedMotion: prefersReducedMotion,
    });

    return () => context?.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={cardRef}
      className="relative isolate flex w-full max-w-4xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-10 text-white shadow-[0_20px_65px_rgba(0,0,0,0.35)] backdrop-blur"
    >
      <span className="w-fit rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
        Mina Launchpad
      </span>
      <div className="space-y-6">
        <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
          Build polished product experiences with motion-first foundations.
        </h1>
        <p className="text-base text-white/80 md:max-w-2xl">
          Tailwind-powered layouts, GSAP micro-interactions, and production-ready defaults out of
          the box. Start crafting delightful flows without reinventing your tooling stack.
        </p>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <button
          ref={ctaRef}
          className="inline-flex items-center justify-center rounded-full bg-brand-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-400"
        >
          Launch playground
        </button>
        <a
          className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-3 text-base font-semibold text-white/80 transition hover:border-white hover:text-white"
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noreferrer"
        >
          View documentation
        </a>
      </div>
      <div
        ref={accentRef}
        className="pointer-events-none absolute -bottom-10 right-10 hidden h-32 w-32 rounded-full bg-accent/30 blur-2xl md:block"
        aria-hidden
      />
    </section>
  );
};
