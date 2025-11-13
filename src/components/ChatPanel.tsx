"use client";

import AssistantAvatar from "@/components/AssistantAvatar";
import CallExperience from "@/components/CallExperience";
import type { ChatSession } from "@/types/chat";
import { assistants } from "@/data/assistants";

interface ChatPanelProps {
  chat?: ChatSession;
}

export default function ChatPanel({ chat }: ChatPanelProps) {
  if (!chat) {
    return (
      <section className="flex flex-1 items-center justify-center bg-[#050b18] text-white">
        <div className="text-center">
          <p className="text-xl font-semibold">Select or create a chat</p>
          <p className="mt-2 text-white/60">Your assistant will appear here.</p>
        </div>
      </section>
    );
  }

  const assistant = assistants.find((entry) => entry.id === chat.assistantId);

  if (!assistant) {
    return (
      <section className="flex flex-1 items-center justify-center bg-[#050b18] text-white">
        <p className="text-lg">Assistant not found. Please create a new chat.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-1 flex-col bg-[#050b18] text-white">
      <header className="flex flex-col gap-4 border-b border-white/10 bg-[#080f22]/90 px-8 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <AssistantAvatar name={assistant.name} color={assistant.avatarColor} size="sm" />
          <div>
            <p className="text-lg font-semibold">{chat.title}</p>
            <p className="text-sm text-white/60">{assistant.name}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-white/70">
          <span className="rounded-full border border-white/20 px-3 py-1">Voice: {chat.voiceStyle}</span>
          <span className="rounded-full border border-white/20 px-3 py-1">Topic: {chat.topic || "Freestyle"}</span>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8">
        <CallExperience assistant={assistant} subtitle={chat.voiceStyle} moodOverride={chat.instructions} />
      </div>
    </section>
  );
}
