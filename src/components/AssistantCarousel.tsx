"use client";

import { useEffect, useRef } from "react";
import type { Assistant } from "@/types/assistant";
import AssistantAvatar from "@/components/AssistantAvatar";
import { gsap, withGsapContext } from "@/lib/gsapClient";

interface AssistantCarouselProps {
  assistants: Assistant[];
  selectedId: string;
  onSelect: (assistantId: string) => void;
}

export default function AssistantCarousel({ assistants, selectedId, onSelect }: AssistantCarouselProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = withGsapContext(listRef.current, () => {
      if (!listRef.current) {
        return;
      }

      const cards = listRef.current.querySelectorAll("button");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.05,
        },
      );
    });

    return () => ctx?.revert();
  }, []);

  return (
    <div
      className="overflow-x-auto rounded-3xl border border-white/20 bg-[#0b1120]/95 px-4 py-6 backdrop-blur supports-[backdrop-filter]:backdrop-blur"
      aria-label="Assistant selector"
    >
      <div
        ref={listRef}
        className="flex gap-4"
        role="listbox"
        aria-label="Available assistants"
        aria-activedescendant={selectedId}
      >
        {assistants.map((assistant) => {
          const isSelected = assistant.id === selectedId;
          return (
            <button
              key={assistant.id}
              type="button"
              id={assistant.id}
              role="option"
              aria-selected={isSelected}
              onClick={() => onSelect(assistant.id)}
              className="flex min-w-[200px] flex-1 cursor-pointer items-center gap-4 rounded-2xl border border-white/20 bg-slate-900/80 px-4 py-3 text-left transition duration-200 hover:border-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              style={{
                borderColor: isSelected ? `${assistant.accentColor}66` : undefined,
                background: isSelected
                  ? `linear-gradient(135deg, ${assistant.accentColor}33, rgba(15,23,42,0.95))`
                  : undefined,
                boxShadow: isSelected ? `0 20px 60px ${assistant.accentColor}33` : undefined,
              }}
            >
              <AssistantAvatar
                name={assistant.name}
                color={assistant.avatarColor}
                size="sm"
                isActive={isSelected}
              />
              <div>
                <p className="text-base font-semibold text-white">{assistant.name}</p>
                <p className="text-xs uppercase tracking-wide text-white/80">{assistant.voiceTag}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
