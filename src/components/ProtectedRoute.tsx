"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { gsap, withGsapContext } from "@/lib/gsapClient";

function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = withGsapContext(containerRef.current, () => {
      if (!containerRef.current || !logoRef.current || !dotsRef.current) return;

      const tl = gsap.timeline();

      // Animate logo entrance
      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
      );

      // Pulse animation for logo
      tl.to(logoRef.current, {
        scale: 1.05,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Animate loading dots
      const dots = dotsRef.current.querySelectorAll(".dot");
      gsap.to(dots, {
        y: -10,
        duration: 0.5,
        stagger: {
          each: 0.15,
          repeat: -1,
          yoyo: true,
        },
        ease: "power1.inOut",
      });
    });

    return () => ctx?.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#050a17] via-[#0a1128] to-[#050a17]"
    >
      {/* Animated background particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/3 h-64 w-64 animate-pulse rounded-full bg-purple-500/10 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute right-1/4 bottom-1/3 h-64 w-64 animate-pulse rounded-full bg-blue-500/10 blur-3xl delay-700 sm:h-96 sm:w-96" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Logo */}
        <div ref={logoRef} className="text-center">
          <h1 className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-6xl font-bold text-transparent sm:text-7xl md:text-8xl">
            Mina
          </h1>
        </div>

        {/* Loading dots */}
        <div ref={dotsRef} className="flex gap-2">
          <div className="dot h-3 w-3 rounded-full bg-white/80" />
          <div className="dot h-3 w-3 rounded-full bg-white/60" />
          <div className="dot h-3 w-3 rounded-full bg-white/40" />
        </div>

        <p className="text-sm text-white/50 sm:text-base">Loading your workspace...</p>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
