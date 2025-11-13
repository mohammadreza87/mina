"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatSession } from "@/types/chat";
import { assistants } from "@/data/assistants";
import AssistantAvatar from "@/components/AssistantAvatar";
import { gsap, withGsapContext } from "@/lib/gsapClient";

interface ChatSettingsProps {
  chat: ChatSession;
  onUpdate: (updates: Partial<ChatSession>) => void;
  onClose: () => void;
}

export default function ChatSettings({ chat, onUpdate, onClose }: ChatSettingsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editedChat, setEditedChat] = useState(chat);

  const assistant = assistants.find((a) => a.id === chat.assistantId);

  useEffect(() => {
    const ctx = withGsapContext(containerRef.current, () => {
      if (!containerRef.current) return;
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
      );
    });
    return () => ctx?.revert();
  }, []);

  const handleSave = () => {
    onUpdate({
      title: editedChat.title,
      voiceStyle: editedChat.voiceStyle,
      topic: editedChat.topic,
      instructions: editedChat.instructions,
    });
  };

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full flex-col border-l border-white/10 bg-[#0a0f1f] text-white lg:w-80 xl:w-96"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h2 className="text-lg font-semibold">Chat Settings</h2>
        <button
          onClick={onClose}
          className="rounded-lg border border-white/20 p-2 text-white transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/50 lg:hidden"
          aria-label="Close settings"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Assistant Info */}
          {assistant && (
            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <AssistantAvatar name={assistant.name} color={assistant.avatarColor} size="lg" isActive />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{assistant.name}</h3>
                    <p className="text-sm text-white/60">{assistant.voiceTag}</p>
                    <p className="mt-2 text-sm text-white/70">{assistant.description}</p>
                  </div>
                </div>
              </div>

              {/* Call Button */}
              <button
                onClick={() => {
                  // TODO: Implement voice call functionality
                  console.log("Starting voice call with", assistant.name);
                }}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="relative text-base font-semibold">Start Voice Call</span>
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/50">Settings</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Chat Title */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-white/80">Chat Name</label>
            <input
              type="text"
              value={editedChat.title}
              onChange={(e) => setEditedChat({ ...editedChat, title: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
              placeholder="Name this chat..."
            />
          </div>

          {/* Voice Style */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-white/80">Voice Style</label>
            <input
              type="text"
              value={editedChat.voiceStyle}
              onChange={(e) => setEditedChat({ ...editedChat, voiceStyle: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
              placeholder="Warm, energetic, calm..."
            />
          </div>

          {/* Topic */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-white/80">Topic / Intent</label>
            <input
              type="text"
              value={editedChat.topic}
              onChange={(e) => setEditedChat({ ...editedChat, topic: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
              placeholder="What to focus on..."
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-white/80">Custom Instructions</label>
            <textarea
              value={editedChat.instructions}
              onChange={(e) => setEditedChat({ ...editedChat, instructions: e.target.value })}
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
              placeholder="How should the assistant behave..."
            />
          </div>

          {/* OpenAI Settings */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 text-sm font-semibold text-white">OpenAI Settings</h3>
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-center justify-between">
                <span>Speech Model</span>
                <span className="rounded-full bg-white/10 px-2 py-1 text-xs">TTS-1</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Voice</span>
                <select className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white focus:border-white/30 focus:outline-none">
                  <option value="alloy">Alloy</option>
                  <option value="echo">Echo</option>
                  <option value="fable">Fable</option>
                  <option value="onyx">Onyx</option>
                  <option value="nova">Nova</option>
                  <option value="shimmer">Shimmer</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span>Transcription Model</span>
                <span className="rounded-full bg-white/10 px-2 py-1 text-xs">Whisper-1</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 text-sm font-semibold text-white">Chat Statistics</h3>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-center justify-between">
                <span>Messages</span>
                <span>{chat.messages.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Created</span>
                <span>{new Date(chat.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleSave}
          className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 py-3 font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
