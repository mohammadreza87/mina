"use client";

import { useCallback, useEffect, useRef, type KeyboardEvent, type SyntheticEvent } from "react";
import { gsap, withGsapContext } from "@/lib/gsapClient";

interface MicButtonProps {
  accentColor: string;
  isConnecting: boolean;
  onPress: () => void;
}

export default function MicButton({ accentColor, isConnecting, onPress }: MicButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const pointerActiveRef = useRef(false);

  useEffect(() => {
    const ctx = withGsapContext(buttonRef.current, () => {
      if (!buttonRef.current) {
        return;
      }
      gsap.to(buttonRef.current, {
        scale: 1.02,
        duration: 2.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    return () => ctx?.revert();
  }, []);

  useEffect(() => {
    const ctx = withGsapContext(pulseRef.current, () => {
      if (!pulseRef.current) {
        return;
      }
      gsap.killTweensOf(pulseRef.current);
      if (isConnecting) {
        gsap.fromTo(
          pulseRef.current,
          { scale: 1, opacity: 0.4 },
          {
            scale: 2.1,
            opacity: 0,
            duration: 1.6,
            repeat: -1,
            ease: "sine.out",
          },
        );
      } else {
        gsap.set(pulseRef.current, { opacity: 0 });
      }
    });

    return () => ctx?.revert();
  }, [isConnecting]);

  const pressIn = useCallback(
    (event?: SyntheticEvent) => {
      event?.preventDefault();
      pointerActiveRef.current = true;
      if (!buttonRef.current) {
        return;
      }
      gsap.to(buttonRef.current, { scale: 0.94, duration: 0.15, ease: "power2.out" });
    },
    [],
  );

  const release = useCallback(
    (shouldTrigger: boolean) => {
      if (!buttonRef.current) {
        return;
      }
      pointerActiveRef.current = false;
      gsap.to(buttonRef.current, { scale: 1.02, duration: 0.2, ease: "power2.out" });
      if (shouldTrigger) {
        onPress();
      }
    },
    [onPress],
  );

  const handlePointerUp = useCallback(() => {
    if (!pointerActiveRef.current) {
      return;
    }
    release(true);
  }, [release]);

  const handlePointerCancel = useCallback(() => {
    if (!pointerActiveRef.current) {
      return;
    }
    release(false);
  }, [release]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onPress();
      }
    },
    [onPress],
  );

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <div
          ref={pulseRef}
          className="pointer-events-none absolute inset-0 rounded-full border-2"
          style={{ borderColor: `${accentColor}70` }}
        />
        <button
          ref={buttonRef}
          type="button"
          aria-label="Call Mina"
          aria-pressed={isConnecting}
          aria-busy={isConnecting}
          className="relative flex h-36 w-36 items-center justify-center rounded-full border border-white/15 text-white transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
          style={{
            background: `radial-gradient(circle, ${accentColor}, ${accentColor}55)`,
            boxShadow: `0 25px 70px ${accentColor}55`,
          }}
          onPointerDown={pressIn}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerCancel}
          onTouchStart={pressIn}
          onTouchEnd={() => handlePointerUp()}
          onTouchCancel={handlePointerCancel}
          onClick={() => release(true)}
          onKeyDown={handleKeyDown}
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-black/45 backdrop-blur">
            <MicIcon />
          </div>
        </button>
      </div>
      <p className="text-sm font-medium uppercase tracking-[0.35em] text-white/90">
        {isConnecting ? "Connecting" : "Tap to call"}
      </p>
    </div>
  );
}

const MicIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" role="img" aria-label="Microphone">
    <path
      d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 11a7 7 0 0 1-14 0"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 19v3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
