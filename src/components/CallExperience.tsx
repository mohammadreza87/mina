"use client";

import { useEffect, useRef, useState } from "react";
import AssistantAvatar from "@/components/AssistantAvatar";
import MicButton from "@/components/MicButton";
import type { Assistant } from "@/types/assistant";
import { gsap, withGsapContext } from "@/lib/gsapClient";

type CallState = "idle" | "connecting";

interface CallExperienceProps {
  assistant?: Assistant;
  subtitle?: string;
  moodOverride?: string;
}

export default function CallExperience({ assistant, subtitle, moodOverride }: CallExperienceProps) {
  const [callState, setCallState] = useState<CallState>("idle");

  const cardRef = useRef<HTMLDivElement>(null);
  const moodRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = withGsapContext(cardRef.current, () => {
      if (!cardRef.current) {
        return;
      }
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      );
    });
    return () => ctx?.revert();
  }, [assistant?.id]);

  useEffect(() => {
    const ctx = withGsapContext(moodRef.current, () => {
      if (!moodRef.current) {
        return;
      }
      gsap.fromTo(
        moodRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
      );
    });
    return () => ctx?.revert();
  }, [callState, assistant?.id]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (callState === "connecting") {
      timer = setTimeout(() => setCallState("idle"), 2400);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [callState]);

  if (!assistant) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-3xl border border-white/10 bg-[#080f22]/60 text-white/70">
        Select a chat to begin.
      </div>
    );
  }

  const accentColor = assistant.accentColor;
  const isConnecting = callState === "connecting";
  const voiceLabel = subtitle || assistant.voiceTag;
  const baseMood = moodOverride || assistant.mood;
  const moodText = isConnecting ? `Connecting to ${assistant.name}…` : baseMood;

  return (
    <div className="flex w-full justify-center">
      <div
        ref={cardRef}
        className="flex w-full max-w-2xl flex-col items-center gap-8 rounded-3xl border border-white/15 bg-[#0f172a]/95 p-10 text-center shadow-[0_30px_120px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        style={{ boxShadow: `0 40px 120px ${accentColor}30` }}
      >
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            Now talking to
          </p>
          <AssistantAvatar name={assistant.name} color={assistant.avatarColor} size="lg" isActive />
          <div className="space-y-1">
            <p className="text-3xl font-semibold text-white" style={{ color: accentColor }}>
              {assistant.name}
            </p>
            <p className="text-sm text-white/80">{voiceLabel}</p>
          </div>
        </div>

        <MicButton
          accentColor={accentColor}
          isConnecting={isConnecting}
          onPress={() => setCallState("connecting")}
        />

        <p ref={moodRef} className="text-lg text-white" aria-live="polite" role="status">
          {moodText}
        </p>
      </div>
    </div>
  );
}
