"use client";

import { useEffect, useRef } from "react";
import { gsap, withGsapContext } from "@/lib/gsapClient";

interface AssistantAvatarProps {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
}

const sizeClasses: Record<NonNullable<AssistantAvatarProps["size"]>, string> = {
  sm: "h-16 w-16 text-lg",
  md: "h-24 w-24 text-2xl",
  lg: "h-32 w-32 text-3xl",
};

export default function AssistantAvatar({
  name,
  color,
  size = "md",
  isActive = false,
}: AssistantAvatarProps) {
  const avatarRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = withGsapContext(avatarRef.current, () => {
      if (!avatarRef.current) {
        return;
      }

      gsap.killTweensOf(avatarRef.current);
      gsap.killTweensOf(ringRef.current);
      gsap.set(avatarRef.current, { scale: 1 });
      if (ringRef.current) {
        gsap.set(ringRef.current, { scale: 1, opacity: 0.4 });
      }

      if (isActive) {
        gsap.to(avatarRef.current, {
          scale: 1.05,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        if (ringRef.current) {
          gsap.to(ringRef.current, {
            scale: 1.3,
            opacity: 0.1,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      }
    });

    return () => ctx?.revert();
  }, [isActive, color]);

  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      ref={avatarRef}
      className={`${sizeClasses[size]} relative rounded-full border border-white/10 flex items-center justify-center font-semibold text-white`}
      style={{
        background: `linear-gradient(145deg, ${color}f0, ${color}90)`,
        boxShadow: isActive
          ? `0 0 40px ${color}80, 0 0 90px ${color}40`
          : `0 0 20px ${color}35`,
      }}
    >
      <span>{initial}</span>
      <div
        ref={ringRef}
        className="pointer-events-none absolute inset-0 rounded-full border"
        style={{ borderColor: `${color}80` }}
      />
    </div>
  );
}
