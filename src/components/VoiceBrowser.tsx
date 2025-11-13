"use client";

import { useRef, useEffect } from "react";
import { assistants } from "@/data/assistants";
import AssistantAvatar from "@/components/AssistantAvatar";
import { gsap, withGsapContext } from "@/lib/gsapClient";

interface VoiceBrowserProps {
  onStartCall: (assistantId: string) => void;
}

export default function VoiceBrowser({ onStartCall }: VoiceBrowserProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = withGsapContext(containerRef.current, () => {
      if (!containerRef.current) return;
      const cards = containerRef.current.querySelectorAll(".voice-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    });
    return () => ctx?.revert();
  }, []);

  return (
    <div className="flex h-screen flex-1 flex-col bg-[#050b18]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#080f22]/90 px-6 py-4 backdrop-blur">
        <h2 className="text-xl font-semibold text-white">Available Voices</h2>
        <p className="mt-1 text-sm text-white/60">Choose an AI assistant to start a voice call</p>
      </div>

      {/* Voice List */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {assistants.map((assistant) => (
            <button
              key={assistant.id}
              onClick={() => onStartCall(assistant.id)}
              className="voice-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
              style={{
                boxShadow: `0 10px 40px ${assistant.accentColor}15`,
              }}
            >
              {/* Gradient overlay */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(135deg, ${assistant.accentColor}10, transparent)`,
                }}
              />

              <div className="relative flex items-start gap-4">
                <AssistantAvatar name={assistant.name} color={assistant.avatarColor} size="lg" isActive />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{assistant.name}</h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide" style={{ color: assistant.accentColor }}>
                    {assistant.voiceTag}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{assistant.description}</p>

                  {/* Call button */}
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium" style={{ color: assistant.accentColor }}>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>Start Voice Call</span>
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
